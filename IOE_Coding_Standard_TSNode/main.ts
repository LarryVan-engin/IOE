/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          main.ts
 * Description:   Main application entry point demonstrating IOE INNOVATION Team TypeScript standards
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.9.3+
 * Dependencies:  express: Web server framework
 *                winston: Logging library
 *                dotenv: Environment configuration
 *                helmet: Security middleware
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Main application orchestrator for TypeScript projects
 *                - Only Project Leader has permission to modify this file
 *                - Coordinates between different modules and services
 *                - Handles application lifecycle and graceful shutdown
 *                - Demonstrates IOE coding standards implementation
 * *******************************************************************************************************************
 */

// Third-party libraries
import dotenv from 'dotenv';

// Local modules - Types
import type { ServerConfig, ApiResponse } from './src/types';
import type { LogLevel } from './src/types';

// Local modules - Utils
import { LoggerManager } from './src/utils/Logger';

// Local modules - Core
import { WebServer } from './src/modules/WebServer';
import { Database } from './src/utils/Database';

// Local modules - Constants
import {
  APP_NAME,
  APP_VERSION,
  DEFAULT_PORT,
  SHUTDOWN_TIMEOUT,
} from './src/constants';

/**
 * *******************************************************************************************************************
 * Application Configuration
 * *******************************************************************************************************************
 */

/** Load environment variables */
dotenv.config();

/** Application constants */
const PORT: number = parseInt(process.env['PORT'] || String(DEFAULT_PORT), 10);
const HOST: string = process.env['HOST'] || 'localhost';
const NODE_ENV: string = process.env['NODE_ENV'] || 'development';
const LOG_LEVEL: LogLevel = (process.env['LOG_LEVEL'] as LogLevel) || 'info';

/**
 * *******************************************************************************************************************
 * Global Variables
 * *******************************************************************************************************************
 */

let server: WebServer | null = null;
let database: Database | null = null;
let logger: LoggerManager | null = null;
let isShuttingDown: boolean = false;

/**
 * *******************************************************************************************************************
 * Error Classes
 * *******************************************************************************************************************
 */

/**
 * Application-specific error class.
 * 
 * @extends Error
 */
class IOEApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'IOEApplicationError';
  }
}

/**
 * *******************************************************************************************************************
 * Helper Functions
 * *******************************************************************************************************************
 */

/**
 * Initializes the application logger.
 * 
 * @returns LoggerManager instance
 */
function initializeLogger(): LoggerManager {
  try {
    return new LoggerManager('IOEApplication', LOG_LEVEL);
  } catch (error) {
    console.error('Failed to initialize logger:', error);
    process.exit(1);
  }
}

/**
 * Loads and validates application configuration.
 * 
 * @returns Application configuration
 * @throws {IOEApplicationError} When configuration is invalid
 */
async function loadConfiguration(): Promise<ServerConfig> {
  try {
    // Load configuration (currently using inline config, but can load from file)
    // const configPath = process.env['CONFIG_PATH'] || `config/${NODE_ENV}.json`;
    // await ConfigManager.loadFromFile(configPath);
    
    const serverConfig: ServerConfig = {
      port: PORT,
      host: HOST,
      environment: NODE_ENV,
      cors: {
        origin: process.env['CORS_ORIGIN'] || '*',
        credentials: process.env['CORS_CREDENTIALS'] === 'true',
      },
      security: {
        jwtSecret: process.env['JWT_SECRET'] || 'default-secret-key',
        jwtExpirationTime: process.env['JWT_EXPIRATION'] || '24h',
      },
      logging: {
        level: LOG_LEVEL,
        format: 'json',
        console: true,
        file: {
          filename: 'logs/app.log',
          maxSize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          frequency: 'daily',
        },
      },
    };
    
    return serverConfig;
    
  } catch (error) {
    throw new IOEApplicationError(
      `Configuration loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CONFIG_LOAD_ERROR',
      { configPath: `config/${NODE_ENV}.json`, error }
    );
  }
}

/**
 * Initializes the database connection.
 * 
 * @returns Database instance
 * @throws {IOEApplicationError} When database initialization fails
 */
async function initializeDatabase(): Promise<Database> {
  try {
    const databaseConfig = {
      host: process.env['DB_HOST'] || 'localhost',
      port: parseInt(process.env['DB_PORT'] || '5432', 10),
      database: process.env['DB_NAME'] || 'ioe_app',
      username: process.env['DB_USER'] || 'postgres',
      password: process.env['DB_PASSWORD'] || 'password',
      pool: {
        min: parseInt(process.env['DB_POOL_MIN'] || '2', 10),
        max: parseInt(process.env['DB_POOL_MAX'] || '10', 10),
        idleTimeout: parseInt(process.env['DB_IDLE_TIMEOUT'] || '30000', 10),
        maxLifetime: parseInt(process.env['DB_MAX_LIFETIME'] || '1800000', 10),
      },
    };
    
    const db = new Database(databaseConfig, logger!);
    await db.connect();
    
    logger!.info('Database initialized successfully', {
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: databaseConfig.database,
    });
    
    return db;
    
  } catch (error) {
    throw new IOEApplicationError(
      `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'DATABASE_INIT_ERROR',
      { error }
    );
  }
}

/**
 * Initializes the web server.
 * 
 * @param config - Server configuration
 * @returns Web server instance
 * @throws {IOEApplicationError} When server initialization fails
 */
async function initializeServer(config: ServerConfig): Promise<WebServer> {
  try {
    const webServer = new WebServer(config, database!, logger!);
    await webServer.initialize();
    
    logger!.info('Web server initialized successfully', {
      port: config.port,
      host: config.host,
      environment: config.environment,
    });
    
    return webServer;
    
  } catch (error) {
    throw new IOEApplicationError(
      `Server initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'SERVER_INIT_ERROR',
      { config, error }
    );
  }
}

/**
 * Sets up process signal handlers for graceful shutdown.
 */
function setupSignalHandlers(): void {
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  
  signals.forEach(signal => {
    process.on(signal, async () => {
      if (isShuttingDown) {
        logger?.warn('Force shutdown initiated', { signal });
        process.exit(1);
      }
      
      logger?.info('Shutdown signal received', { signal });
      await gracefulShutdown();
    });
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger?.error('Uncaught exception', { error: error.message, stack: error.stack });
    gracefulShutdown().finally(() => process.exit(1));
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    logger?.error('Unhandled promise rejection', { reason });
    gracefulShutdown().finally(() => process.exit(1));
  });
}

/**
 * Performs graceful application shutdown.
 */
async function gracefulShutdown(): Promise<void> {
  if (isShuttingDown) {
    return;
  }
  
  isShuttingDown = true;
  logger?.info('Starting graceful shutdown');
  
  const shutdownTimeout = setTimeout(() => {
    logger?.error('Shutdown timeout exceeded, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
  
  try {
    // Stop accepting new connections
    if (server) {
      logger?.info('Stopping web server');
      await server.stop();
      logger?.info('Web server stopped');
    }
    
    // Close database connections
    if (database) {
      logger?.info('Closing database connections');
      await database.disconnect();
      logger?.info('Database connections closed');
    }
    
    // Clear shutdown timeout
    clearTimeout(shutdownTimeout);
    
    logger?.info('Graceful shutdown completed');
    process.exit(0);
    
  } catch (error) {
    logger?.error('Error during shutdown', { error });
    process.exit(1);
  }
}

/**
 * Performs application health check.
 * 
 * @returns Health check result
 */
async function performHealthCheck(): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    const healthData: Record<string, unknown> = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
      environment: NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
    
    // Check database health
    if (database) {
      const dbHealth = await database.healthCheck();
      healthData['database'] = dbHealth;
    }
    
    // Check server health
    if (server) {
      const serverHealth = await server.healthCheck();
      healthData['server'] = serverHealth;
    }
    
    return {
      success: true,
      data: healthData,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: 'health-check',
        version: APP_VERSION,
      },
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: 'health-check',
        version: APP_VERSION,
      },
    };
  }
}

/**
 * *******************************************************************************************************************
 * Main Application Functions
 * *******************************************************************************************************************
 */

/**
 * Initializes the complete application.
 * 
 * @throws {IOEApplicationError} When initialization fails
 */
async function initializeApplication(): Promise<void> {
  try {
    logger?.info('Starting application initialization', {
      name: APP_NAME,
      version: APP_VERSION,
      environment: NODE_ENV,
      nodeVersion: process.version,
    });
    
    // Load configuration
    const config = await loadConfiguration();
    logger?.info('Configuration loaded successfully');
    
    // Initialize database
    database = await initializeDatabase();
    
    // Initialize web server
    server = await initializeServer(config);
    
    logger?.info('Application initialization completed successfully');
    
  } catch (error) {
    logger?.error('Application initialization failed', { error });
    throw error;
  }
}

/**
 * Starts the application server.
 * 
 * @throws {IOEApplicationError} When server start fails
 */
async function startApplication(): Promise<void> {
  try {
    if (!server) {
      throw new IOEApplicationError('Server not initialized', 'SERVER_NOT_INITIALIZED');
    }
    
    await server.start(PORT);
    
    logger?.info('Application started successfully', {
      name: APP_NAME,
      version: APP_VERSION,
      port: PORT,
      host: HOST,
      environment: NODE_ENV,
      processId: process.pid,
    });
    
    // Log startup banner
    console.log('\\n' + '='.repeat(70));
    console.log(`  ${APP_NAME} v${APP_VERSION}`);
    console.log('  IOE INNOVATION Team');
    console.log('='.repeat(70));
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📝 Environment: ${NODE_ENV}`);
    console.log(`🔍 Process ID: ${process.pid}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
    console.log('='.repeat(70) + '\\n');
    
  } catch (error) {
    throw new IOEApplicationError(
      `Application start failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'APP_START_ERROR',
      { error }
    );
  }
}

/**
 * Main application entry point.
 * 
 * Coordinates the entire application lifecycle including initialization,
 * startup, and graceful shutdown handling.
 */
async function main(): Promise<void> {
  try {
    // Initialize logger first
    logger = initializeLogger();
    
    // Setup signal handlers for graceful shutdown
    setupSignalHandlers();
    
    // Initialize and start application
    await initializeApplication();
    await startApplication();
    
    // Perform initial health check
    const healthCheck = await performHealthCheck();
    logger.info('Initial health check completed', { 
      healthy: healthCheck.success,
      data: healthCheck.data 
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (logger) {
      logger.error('Application startup failed', { error: errorMessage });
    } else {
      console.error('Application startup failed:', errorMessage);
    }
    
    // Cleanup and exit
    await gracefulShutdown();
  }
}

/**
 * *******************************************************************************************************************
 * Application Entry Point
 * *******************************************************************************************************************
 */

// Start the application
main().catch(error => {
  console.error('Fatal error during application startup:', error);
  process.exit(1);
});

/**
 * *******************************************************************************************************************
 * Export for Testing
 * *******************************************************************************************************************
 */

// Export functions for testing purposes
export {
  initializeApplication,
  startApplication,
  performHealthCheck,
  gracefulShutdown,
  IOEApplicationError,
};

// End of File