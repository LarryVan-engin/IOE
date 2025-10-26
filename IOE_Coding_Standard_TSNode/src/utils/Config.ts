/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          utils/ConfigManager.ts
 * Description:   Configuration management utility for IOE TypeScript applications
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.9.3+
 * Dependencies:  fs: File system operations
 *                path: File path utilities
 *                joi: Data validation library
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Centralized configuration management with validation
 *                - Only Project Leader has permission to modify this file
 *                - Supports multiple configuration sources (files, environment, defaults)
 *                - Implements configuration validation and type safety
 *                - Provides configuration caching and hot-reload capabilities
 * *******************************************************************************************************************
 */

// Node.js built-in modules
import * as fs from 'fs';
import * as path from 'path';

// Third-party libraries
import Joi from 'joi';

// Local modules
import type { AppConfig, ServerConfig, DatabaseConfig, Environment } from '../types';
import {
  ENV_DEVELOPMENT,
  ENV_PRODUCTION,
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_DB_PORT,
  DEFAULT_DB_HOST,
} from '../constants';

/**
 * *******************************************************************************************************************
 * Type Definitions
 * *******************************************************************************************************************
 */

/** Configuration validation result */
interface ValidationResult {
  /** Validation success */
  isValid: boolean;
  
  /** Validation errors */
  errors?: string[];
  
  /** Validated configuration */
  config?: AppConfig;
}

/**
 * *******************************************************************************************************************
 * Configuration Schemas
 * *******************************************************************************************************************
 */

/** Server configuration schema */
const serverConfigSchema = Joi.object({
  port: Joi.number().port().default(DEFAULT_PORT),
  host: Joi.string().hostname().default(DEFAULT_HOST),
  environment: Joi.string().valid('development', 'testing', 'staging', 'production').default('development'),
  cors: Joi.object({
    origin: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default('*'),
    credentials: Joi.boolean().default(false),
    methods: Joi.array().items(Joi.string()).optional(),
    allowedHeaders: Joi.array().items(Joi.string()).optional(),
    exposedHeaders: Joi.array().items(Joi.string()).optional(),
    maxAge: Joi.number().integer().min(0).optional(),
  }).required(),
  security: Joi.object({
    jwtSecret: Joi.string().min(32).required(),
    jwtExpirationTime: Joi.string().default('24h'),
    https: Joi.boolean().default(false),
    sslCertPath: Joi.string().optional(),
    sslKeyPath: Joi.string().optional(),
    helmet: Joi.boolean().default(true),
    rateLimit: Joi.object({
      windowMs: Joi.number().integer().min(1000).default(900000), // 15 minutes
      max: Joi.number().integer().min(1).default(100),
      message: Joi.string().optional(),
    }).optional(),
  }).required(),
  logging: Joi.object({
    level: Joi.string().valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly').default('info'),
    format: Joi.string().valid('json', 'simple').default('json'),
    console: Joi.boolean().default(true),
    file: Joi.object({
      filename: Joi.string().required(),
      maxSize: Joi.number().integer().min(1024).default(10485760), // 10MB
      maxFiles: Joi.number().integer().min(1).default(5),
      frequency: Joi.string().valid('daily', 'hourly').default('daily'),
    }).optional(),
  }).required(),
});

/** Database configuration schema */
const databaseConfigSchema = Joi.object({
  host: Joi.string().hostname().default(DEFAULT_DB_HOST),
  port: Joi.number().port().default(DEFAULT_DB_PORT),
  database: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  pool: Joi.object({
    min: Joi.number().integer().min(0).default(2),
    max: Joi.number().integer().min(1).default(10),
    idleTimeout: Joi.number().integer().min(1000).default(30000),
    maxLifetime: Joi.number().integer().min(60000).default(1800000),
  }).optional(),
  ssl: Joi.alternatives().try(
    Joi.boolean(),
    Joi.object({
      mode: Joi.string().valid('require', 'prefer', 'disable').default('prefer'),
      ca: Joi.string().optional(),
      cert: Joi.string().optional(),
      key: Joi.string().optional(),
    })
  ).default(false),
  connectionTimeout: Joi.number().integer().min(1000).default(10000),
  queryTimeout: Joi.number().integer().min(1000).default(30000),
});

/** Application configuration schema */
const appConfigSchema = Joi.object({
  app: Joi.object({
    name: Joi.string().required(),
    version: Joi.string().required(),
    description: Joi.string().required(),
    environment: Joi.string().valid('development', 'testing', 'staging', 'production').required(),
  }).required(),
  server: serverConfigSchema.required(),
  database: databaseConfigSchema.required(),
  services: Joi.object().pattern(
    Joi.string(),
    Joi.object({
      baseUrl: Joi.string().uri().required(),
      apiKey: Joi.string().optional(),
      timeout: Joi.number().integer().min(1000).default(30000),
      retry: Joi.object({
        attempts: Joi.number().integer().min(0).default(3),
        delay: Joi.number().integer().min(100).default(1000),
      }).optional(),
    })
  ).optional(),
  features: Joi.object().pattern(Joi.string(), Joi.boolean()).optional(),
});

/**
 * *******************************************************************************************************************
 * IOE Configuration Class
 * *******************************************************************************************************************
 */

/**
 * Professional configuration management utility for IOE TypeScript applications.
 * 
 * Features:
 * - Multiple configuration sources (files, environment variables, defaults)
 * - Configuration validation with Joi schemas
 * - Type-safe configuration access
 * - Configuration hot-reload and watching
 * - Environment-specific configuration files
 * - Configuration caching and performance optimization
 * 
 * @example
 * ```typescript
 * const config = await ConfigManager.loadFromFile('config/production.json');
 * const dbConfig = ConfigManager.getDatabaseConfig();
 * const serverPort = ConfigManager.getServerConfig().port;
 * ```
 */
export class ConfigManager {
  /** Current configuration */
  private static currentConfig: AppConfig | null = null;
  
  /** Configuration file path */
  private static configFilePath: string | null = null;
  
  /** Configuration cache */
  private static configCache = new Map<string, AppConfig>();
  
  /** Environment variables cache */
  private static envCache = new Map<string, string>();

  /**
   * *******************************************************************************************************************
   * Public Configuration Loading Methods
   * *******************************************************************************************************************
   */

  /**
   * Loads configuration from a JSON file.
   * 
   * @param filePath - Path to configuration file
   * @param validate - Whether to validate the configuration
   * @returns Loaded and validated configuration
   * @throws Error if file doesn't exist or validation fails
   */
  public static async loadFromFile(filePath: string, validate: boolean = true): Promise<AppConfig> {
    try {
      // Check cache first
      const cacheKey = `file:${filePath}`;
      if (this.configCache.has(cacheKey)) {
        const cached = this.configCache.get(cacheKey)!;
        this.currentConfig = cached;
        this.configFilePath = filePath;
        return cached;
      }

      // Resolve file path
      const resolvedPath = path.resolve(filePath);
      
      // Check if file exists
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Configuration file not found: ${resolvedPath}`);
      }

      // Read and parse configuration file
      const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
      const rawConfig = JSON.parse(fileContent);

      // Merge with environment variables
      const config = this.mergeWithEnvironment(rawConfig);

      // Validate configuration if requested
      if (validate) {
        const validationResult = this.validateConfiguration(config);
        if (!validationResult.isValid) {
          throw new Error(`Configuration validation failed: ${validationResult.errors?.join(', ')}`);
        }
        
        // Use validated configuration
        this.currentConfig = validationResult.config!;
      } else {
        this.currentConfig = config as unknown as AppConfig;
      }

      // Cache the configuration
      this.configCache.set(cacheKey, this.currentConfig);
      this.configFilePath = filePath;

      return this.currentConfig;

    } catch (error) {
      throw new Error(`Failed to load configuration from file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Loads configuration from environment variables.
   * 
   * @returns Configuration from environment
   */
  public static loadFromEnvironment(): AppConfig {
    const config: AppConfig = {
      app: {
        name: this.getEnvVar('APP_NAME', 'IOE Application'),
        version: this.getEnvVar('APP_VERSION', '1.0.0'),
        description: this.getEnvVar('APP_DESCRIPTION', 'IOE TypeScript Application'),
        environment: this.getEnvVar('NODE_ENV', ENV_DEVELOPMENT) as Environment,
      },
      server: {
        port: parseInt(this.getEnvVar('PORT', String(DEFAULT_PORT)), 10),
        host: this.getEnvVar('HOST', DEFAULT_HOST),
        environment: this.getEnvVar('NODE_ENV', ENV_DEVELOPMENT),
        cors: {
          origin: this.getEnvVar('CORS_ORIGIN', '*'),
          credentials: this.getEnvVar('CORS_CREDENTIALS', 'false') === 'true',
        },
        security: {
          jwtSecret: this.getEnvVar('JWT_SECRET', 'default-secret-change-in-production'),
          jwtExpirationTime: this.getEnvVar('JWT_EXPIRATION', '24h'),
          https: this.getEnvVar('HTTPS_ENABLED', 'false') === 'true',
          helmet: this.getEnvVar('HELMET_ENABLED', 'true') === 'true',
        },
        logging: {
          level: this.getEnvVar('LOG_LEVEL', 'info'),
          format: this.getEnvVar('LOG_FORMAT', 'json') as 'json' | 'simple',
          console: this.getEnvVar('LOG_CONSOLE', 'true') === 'true',
          file: {
            filename: this.getEnvVar('LOG_FILE', 'logs/app.log'),
            maxSize: parseInt(this.getEnvVar('LOG_MAX_SIZE', '10485760'), 10),
            maxFiles: parseInt(this.getEnvVar('LOG_MAX_FILES', '5'), 10),
            frequency: this.getEnvVar('LOG_FREQUENCY', 'daily') as 'daily' | 'hourly',
          },
        },
      },
      database: {
        host: this.getEnvVar('DB_HOST', DEFAULT_DB_HOST),
        port: parseInt(this.getEnvVar('DB_PORT', String(DEFAULT_DB_PORT)), 10),
        database: this.getEnvVar('DB_NAME', 'ioe_app'),
        username: this.getEnvVar('DB_USER', 'postgres'),
        password: this.getEnvVar('DB_PASSWORD', 'password'),
        ssl: this.getEnvVar('DB_SSL', 'false') === 'true',
        connectionTimeout: parseInt(this.getEnvVar('DB_CONNECTION_TIMEOUT', '10000'), 10),
        queryTimeout: parseInt(this.getEnvVar('DB_QUERY_TIMEOUT', '30000'), 10),
      },
    };

    this.currentConfig = config;
    return config;
  }

  /**
   * Creates a default configuration.
   * 
   * @param environment - Target environment
   * @returns Default configuration
   */
  public static createDefault(environment: Environment = ENV_DEVELOPMENT): AppConfig {
    const config: AppConfig = {
      app: {
        name: 'IOE TypeScript Application',
        version: '1.0.0',
        description: 'IOE INNOVATION Team TypeScript application',
        environment,
      },
      server: {
        port: DEFAULT_PORT,
        host: DEFAULT_HOST,
        environment,
        cors: {
          origin: environment === ENV_PRODUCTION ? [] : '*',
          credentials: false,
        },
        security: {
          jwtSecret: environment === ENV_PRODUCTION 
            ? 'CHANGE-THIS-IN-PRODUCTION-WITH-STRONG-SECRET'
            : 'development-secret-key',
          jwtExpirationTime: '24h',
          https: environment === ENV_PRODUCTION,
          helmet: true,
        },
        logging: {
          level: environment === ENV_PRODUCTION ? 'info' : 'debug',
          format: 'json',
          console: environment !== ENV_PRODUCTION,
          file: {
            filename: `logs/${environment}.log`,
            maxSize: 10485760, // 10MB
            maxFiles: 5,
            frequency: 'daily',
          },
        },
      },
      database: {
        host: DEFAULT_DB_HOST,
        port: DEFAULT_DB_PORT,
        database: `ioe_app_${environment}`,
        username: 'postgres',
        password: 'password',
        ssl: environment === ENV_PRODUCTION,
        connectionTimeout: 10000,
        queryTimeout: 30000,
      },
    };

    this.currentConfig = config;
    return config;
  }

  /**
   * *******************************************************************************************************************
   * Configuration Access Methods
   * *******************************************************************************************************************
   */

  /**
   * Gets the current configuration.
   * 
   * @returns Current configuration
   * @throws Error if no configuration is loaded
   */
  public static getCurrentConfig(): AppConfig {
    if (!this.currentConfig) {
      throw new Error('No configuration loaded. Call loadFromFile() or loadFromEnvironment() first.');
    }
    return this.currentConfig;
  }

  /**
   * Gets the server configuration.
   * 
   * @returns Server configuration
   */
  public static getServerConfig(): ServerConfig {
    return this.getCurrentConfig().server;
  }

  /**
   * Gets the database configuration.
   * 
   * @returns Database configuration
   */
  public static getDatabaseConfig(): DatabaseConfig {
    return this.getCurrentConfig().database;
  }

  /**
   * Gets a configuration value by path.
   * 
   * @param path - Configuration path (e.g., 'server.port', 'database.host')
   * @param defaultValue - Default value if path doesn't exist
   * @returns Configuration value
   */
  public static get<T = unknown>(path: string, defaultValue?: T): T {
    const config = this.getCurrentConfig();
    const keys = path.split('.');
    let current: unknown = config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return defaultValue as T;
      }
    }

    return current as T;
  }

  /**
   * Checks if a configuration path exists.
   * 
   * @param path - Configuration path
   * @returns True if path exists
   */
  public static has(path: string): boolean {
    try {
      this.get(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * *******************************************************************************************************************
   * Configuration Validation
   * *******************************************************************************************************************
   */

  /**
   * Validates a configuration object.
   * 
   * @param config - Configuration to validate
   * @returns Validation result
   */
  public static validateConfiguration(config: unknown): ValidationResult {
    try {
      const { error, value } = appConfigSchema.validate(config, {
        allowUnknown: false,
        stripUnknown: true,
        abortEarly: false,
      });

      if (error) {
        return {
          isValid: false,
          errors: error.details.map(detail => detail.message),
        };
      }

      return {
        isValid: true,
        config: value as AppConfig,
      };

    } catch (validationError) {
      return {
        isValid: false,
        errors: [`Validation error: ${validationError instanceof Error ? validationError.message : 'Unknown error'}`],
      };
    }
  }

  /**
   * *******************************************************************************************************************
   * Configuration Utilities
   * *******************************************************************************************************************
   */

  /**
   * Saves the current configuration to a file.
   * 
   * @param filePath - Output file path
   * @param pretty - Pretty print JSON
   */
  public static async saveToFile(filePath: string, pretty: boolean = true): Promise<void> {
    try {
      const config = this.getCurrentConfig();
      const configJson = pretty 
        ? JSON.stringify(config, null, 2)
        : JSON.stringify(config);

      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, configJson, 'utf-8');

    } catch (error) {
      throw new Error(`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Reloads configuration from the original source.
   */
  public static async reload(): Promise<void> {
    if (this.configFilePath) {
      await this.loadFromFile(this.configFilePath);
    } else {
      this.loadFromEnvironment();
    }
  }

  /**
   * Clears configuration cache.
   */
  public static clearCache(): void {
    this.configCache.clear();
    this.envCache.clear();
  }

  /**
   * *******************************************************************************************************************
   * Private Helper Methods
   * *******************************************************************************************************************
   */

  /**
   * Gets an environment variable with caching.
   * 
   * @param key - Environment variable key
   * @param defaultValue - Default value
   * @returns Environment variable value
   */
  private static getEnvVar(key: string, defaultValue: string): string {
    // Check cache first
    if (this.envCache.has(key)) {
      return this.envCache.get(key)!;
    }

    const value = process.env[key] || defaultValue;
    this.envCache.set(key, value);
    return value;
  }

  /**
   * Merges configuration with environment variables.
   * 
   * @param config - Base configuration
   * @returns Merged configuration
   */
  private static mergeWithEnvironment(config: Record<string, unknown>): Record<string, unknown> {
    const merged = { ...config };

    // Override with environment variables
    if (process.env['PORT']) {
      this.setNestedValue(merged, 'server.port', parseInt(process.env['PORT'], 10));
    }
    
    if (process.env['HOST']) {
      this.setNestedValue(merged, 'server.host', process.env['HOST']);
    }
    
    if (process.env['NODE_ENV']) {
      this.setNestedValue(merged, 'server.environment', process.env['NODE_ENV']);
      this.setNestedValue(merged, 'app.environment', process.env['NODE_ENV']);
    }

    if (process.env['JWT_SECRET']) {
      this.setNestedValue(merged, 'server.security.jwtSecret', process.env['JWT_SECRET']);
    }

    if (process.env['DB_HOST']) {
      this.setNestedValue(merged, 'database.host', process.env['DB_HOST']);
    }

    if (process.env['DB_PORT']) {
      this.setNestedValue(merged, 'database.port', parseInt(process.env['DB_PORT'], 10));
    }

    if (process.env['DB_NAME']) {
      this.setNestedValue(merged, 'database.database', process.env['DB_NAME']);
    }

    if (process.env['DB_USER']) {
      this.setNestedValue(merged, 'database.username', process.env['DB_USER']);
    }

    if (process.env['DB_PASSWORD']) {
      this.setNestedValue(merged, 'database.password', process.env['DB_PASSWORD']);
    }

    return merged;
  }

  /**
   * Sets a nested value in an object.
   * 
   * @param obj - Target object
   * @param path - Property path
   * @param value - Value to set
   */
  private static setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!key) continue;
      
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
  }
}

/**
 * *******************************************************************************************************************
 * Default Export
 * *******************************************************************************************************************
 */

export default ConfigManager;

// End of File