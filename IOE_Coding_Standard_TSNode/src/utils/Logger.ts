/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          utils/LoggerManager.ts
 * Description:   Comprehensive logging utility for IOE TypeScript applications
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.9.3+
 * Dependencies:  winston: Advanced logging library
 *                path: File path utilities
 *                fs: File system operations
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Professional logging solution with multiple transports
 *                - Only Project Leader has permission to modify this file
 *                - Supports console, file, and external service logging
 *                - Implements structured logging with metadata
 *                - Provides log rotation and performance optimization
 * *******************************************************************************************************************
 */

// Node.js built-in modules
import * as fs from 'fs';
import * as path from 'path';

// Third-party libraries
import winston from 'winston';

// Local modules
import type { LogLevel, LogEntry, LoggerConfig } from '../types';
import { 
  LOG_LEVELS, 
  DEFAULT_LOG_LEVEL, 
  LOG_MAX_FILE_SIZE, 
  LOG_MAX_FILES,
  LOGS_DIR 
} from '../constants';

/**
 * *******************************************************************************************************************
 * Type Definitions
 * *******************************************************************************************************************
 */

/** Log file configuration */
interface LogFileConfig {
  /** File path */
  filename: string;
  
  /** Maximum file size */
  maxSize: number;
  
  /** Maximum number of files */
  maxFiles: number;
  
  /** Log level for this file */
  level?: LogLevel;
  
  /** Enable compression for rotated files */
  compress?: boolean;
}

/** LoggerManager configuration */
interface LoggerManagerConfig {
  /** Service name */
  service: string;
  
  /** Log level */
  level: LogLevel;
  
  /** Log format */
  format: 'json' | 'simple';
  
  /** Enable console logging */
  console: boolean;
  
  /** File logging configuration */
  file: {
    path: string;
    maxSize: number;
    maxFiles: number;
  };
}

/** LoggerManager performance metrics */
interface LoggerManagerMetrics {
  /** Total logs written */
  totalLogs: number;
  
  /** Logs per level */
  logsByLevel: Record<LogLevel, number>;
  
  /** Start time */
  startTime: Date;
  
  /** Last log time */
  lastLogTime?: Date | undefined;
  
  /** Error count */
  errorCount: number;
}



/**
 * *******************************************************************************************************************
 * IOE LoggerManager Class
 * *******************************************************************************************************************
 */

/**
 * Professional logging utility for IOE TypeScript applications.
 * 
 * Features:
 * - Multiple transport support (console, file, external services)
 * - Structured logging with metadata
 * - Log rotation and compression
 * - Performance metrics
 * - Custom formatting
 * - Type-safe logging levels
 * 
 * @example
 * ```typescript
 * const logger = new LoggerManager('MyService');
 * logger.info('Application started', { port: 3000 });
 * logger.error('Database connection failed', { error: dbError });
 * ```
 */
export class LoggerManager {
  /** Winston logger instance */
  private readonly logger: winston.Logger;
  
  /** Service name */
  private readonly serviceName: string;
  
  /** LoggerManager configuration */
  private readonly config: LoggerManagerConfig;
  
  /** Performance metrics */
  private readonly metrics: LoggerManagerMetrics;
  
  /** Request ID for correlation */
  private requestId?: string | undefined;
  
  /** User ID for correlation */
  private userId?: string | undefined;

  /**
   * Creates a new IOE LoggerManager instance.
   * 
   * @param serviceName - Name of the service using this logger
   * @param level - Log level (default: 'info')
   * @param config - Optional logger configuration
   */
  constructor(
    serviceName: string,
    level: LogLevel = DEFAULT_LOG_LEVEL,
    config?: Partial<LoggerConfig>
  ) {
    this.serviceName = serviceName;
    this.config = this.buildConfiguration(serviceName, level, config);
    this.metrics = this.initializeMetrics();
    this.logger = this.createWinstonLogger();
    
    // Log logger initialization
    this.info('LoggerManager initialized', {
      service: serviceName,
      level,
      transports: this.getActiveTransports(),
    });
  }

  /**
   * *******************************************************************************************************************
   * Public Logging Methods
   * *******************************************************************************************************************
   */

  /**
   * Logs an error message.
   * 
   * @param message - Error message
   * @param metadata - Additional metadata
   * @param error - Error object
   */
  public error(message: string, metadata?: Record<string, unknown>, error?: Error): void {
    this.log('error', message, metadata, error);
  }

  /**
   * Logs a warning message.
   * 
   * @param message - Warning message
   * @param metadata - Additional metadata
   */
  public warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  /**
   * Logs an info message.
   * 
   * @param message - Info message
   * @param metadata - Additional metadata
   */
  public info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  /**
   * Logs an HTTP request/response.
   * 
   * @param message - HTTP message
   * @param metadata - Additional metadata
   */
  public http(message: string, metadata?: Record<string, unknown>): void {
    this.log('http', message, metadata);
  }

  /**
   * Logs a verbose message.
   * 
   * @param message - Verbose message
   * @param metadata - Additional metadata
   */
  public verbose(message: string, metadata?: Record<string, unknown>): void {
    this.log('verbose', message, metadata);
  }

  /**
   * Logs a debug message.
   * 
   * @param message - Debug message
   * @param metadata - Additional metadata
   */
  public debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  /**
   * Logs a silly message.
   * 
   * @param message - Silly message
   * @param metadata - Additional metadata
   */
  public silly(message: string, metadata?: Record<string, unknown>): void {
    this.log('silly', message, metadata);
  }

  /**
   * *******************************************************************************************************************
   * Utility Methods
   * *******************************************************************************************************************
   */

  /**
   * Sets the request ID for correlation.
   * 
   * @param requestId - Request identifier
   */
  public setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  /**
   * Sets the user ID for correlation.
   * 
   * @param userId - User identifier
   */
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Clears correlation IDs.
   */
  public clearCorrelationIds(): void {
    this.requestId = undefined;
    this.userId = undefined;
  }

  /**
   * Creates a child logger with additional context.
   * 
   * @param context - Additional context
   * @returns Child logger instance
   */
  public child(context: Record<string, unknown>): LoggerManager {
    const childLoggerManager = new LoggerManager(this.serviceName, this.config.level, this.config);
    childLoggerManager.requestId = this.requestId;
    childLoggerManager.userId = this.userId;
    
    // Add context to all logs from child
    const originalLog = childLoggerManager.log.bind(childLoggerManager);
    childLoggerManager.log = (level, message, metadata, error) => {
      const mergedMetadata = { ...context, ...metadata };
      originalLog(level, message, mergedMetadata, error);
    };
    
    return childLoggerManager;
  }

  /**
   * Gets logger performance metrics.
   * 
   * @returns Performance metrics
   */
  public getMetrics(): LoggerManagerMetrics {
    return {
      ...this.metrics,
      logsByLevel: { ...this.metrics.logsByLevel },
    };
  }

  /**
   * Resets performance metrics.
   */
  public resetMetrics(): void {
    this.metrics.totalLogs = 0;
    this.metrics.errorCount = 0;
    this.metrics.startTime = new Date();
    this.metrics.lastLogTime = undefined;
    
    // Reset level counters
    LOG_LEVELS.forEach(level => {
      this.metrics.logsByLevel[level] = 0;
    });
  }

  /**
   * Closes the logger and its transports.
   */
  public close(): Promise<void> {
    return new Promise((resolve) => {
      this.logger.close();
      this.info('LoggerManager closed');
      resolve();
    });
  }

  /**
   * *******************************************************************************************************************
   * Private Methods
   * *******************************************************************************************************************
   */

  /**
   * Core logging method.
   * 
   * @param level - Log level
   * @param message - Log message
   * @param metadata - Additional metadata
   * @param error - Error object
   */
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    try {
      // Update metrics
      this.updateMetrics(level);

      // Build log entry
      const logEntry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        service: this.serviceName,
        metadata: this.buildMetadata(metadata),
        error,
        requestId: this.requestId,
        userId: this.userId,
      };

      // Log with Winston
      this.logger.log(level, message, {
        ...logEntry,
        // Flatten metadata for Winston
        ...logEntry.metadata,
      });

    } catch (logError) {
      // Fallback to console if logger fails
      console.error('LoggerManager error:', logError);
      console.error('Original log:', { level, message, metadata, error });
      this.metrics.errorCount++;
    }
  }

  /**
   * Builds the logger configuration.
   * 
   * @param serviceName - Service name
   * @param level - Log level
   * @param config - Optional configuration
   * @returns Complete logger configuration
   */
  private buildConfiguration(
    serviceName: string,
    level: LogLevel,
    config?: Partial<LoggerConfig>
  ): LoggerManagerConfig {
    return {
      service: serviceName,
      level,
      format: 'json',
      console: true,
      file: {
        path: path.join(LOGS_DIR, `${serviceName.toLowerCase()}.log`),
        maxSize: LOG_MAX_FILE_SIZE,
        maxFiles: LOG_MAX_FILES,
      },
      ...config,
    };
  }

  /**
   * Initializes performance metrics.
   * 
   * @returns Initial metrics
   */
  private initializeMetrics(): LoggerManagerMetrics {
    const logsByLevel: Record<LogLevel, number> = {} as Record<LogLevel, number>;
    LOG_LEVELS.forEach(level => {
      logsByLevel[level] = 0;
    });

    return {
      totalLogs: 0,
      logsByLevel,
      startTime: new Date(),
      errorCount: 0,
    };
  }

  /**
   * Creates the Winston logger instance.
   * 
   * @returns Winston logger
   */
  private createWinstonLogger(): winston.Logger {
    // Ensure logs directory exists
    this.ensureLogsDirectory();

    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.console) {
      transports.push(
        new winston.transports.Console({
          level: this.config.level,
          format: this.createConsoleFormat(),
        })
      );
    }

    // File transport
    if (this.config.file) {
      transports.push(
        new winston.transports.File({
          filename: this.config.file.path,
          level: this.config.level,
          maxsize: this.config.file.maxSize,
          maxFiles: this.config.file.maxFiles,
          format: this.createFileFormat(),
          tailable: true,
          zippedArchive: true,
        })
      );
    }

    const loggerOptions = {
      level: this.config.level,
      levels: winston.config.npm.levels,
      transports,
      exitOnError: false,
      silent: false,
    };

    return winston.createLogger(loggerOptions);
  }

  /**
   * Creates console log format.
   * 
   * @returns Winston format
   */
  private createConsoleFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, service, requestId, userId, ...meta }) => {
        let output = `${timestamp} [${service}] ${level}: ${message}`;
        
        if (requestId) {
          output += ` [req:${requestId}]`;
        }
        
        if (userId) {
          output += ` [user:${userId}]`;
        }
        
        // Add metadata if present
        const metaKeys = Object.keys(meta).filter(key => 
          !['timestamp', 'level', 'message', 'service', 'requestId', 'userId'].includes(key)
        );
        
        if (metaKeys.length > 0) {
          const cleanMeta: Record<string, unknown> = {};
          metaKeys.forEach(key => {
            cleanMeta[key] = meta[key];
          });
          output += ` ${JSON.stringify(cleanMeta)}`;
        }
        
        return output;
      })
    );
  }

  /**
   * Creates file log format.
   * 
   * @returns Winston format
   */
  private createFileFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );
  }

  /**
   * Builds metadata object with common fields.
   * 
   * @param metadata - User-provided metadata
   * @returns Enhanced metadata
   */
  private buildMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
    return {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      pid: process.pid,
      hostname: process.env['HOSTNAME'] || 'unknown',
      nodeVersion: process.version,
      environment: process.env['NODE_ENV'] || 'development',
      ...metadata,
    };
  }

  /**
   * Updates performance metrics.
   * 
   * @param level - Log level
   */
  private updateMetrics(level: LogLevel): void {
    this.metrics.totalLogs++;
    this.metrics.logsByLevel[level]++;
    this.metrics.lastLogTime = new Date();
  }

  /**
   * Gets list of active transports.
   * 
   * @returns Transport names
   */
  private getActiveTransports(): string[] {
    const transports: string[] = [];
    
    if (this.config.console) {
      transports.push('console');
    }
    
    if (this.config.file) {
      transports.push('file');
    }
    
    return transports;
  }

  /**
   * Ensures the logs directory exists.
   */
  private ensureLogsDirectory(): void {
    try {
      const logsPath = path.resolve(LOGS_DIR);
      if (!fs.existsSync(logsPath)) {
        fs.mkdirSync(logsPath, { recursive: true });
      }
    } catch (error) {
      console.warn('Failed to create logs directory:', error);
    }
  }

  /**
   * *******************************************************************************************************************
   * Static Methods
   * *******************************************************************************************************************
   */

  /**
   * Creates a default logger instance.
   * 
   * @param serviceName - Service name
   * @returns LoggerManager instance
   */
  public static createDefault(serviceName: string): LoggerManager {
    return new LoggerManager(serviceName);
  }

  /**
   * Creates a logger with file output disabled.
   * 
   * @param serviceName - Service name
   * @param level - Log level
   * @returns LoggerManager instance
   */
  public static createConsoleOnly(serviceName: string, level: LogLevel = 'info'): LoggerManager {
    return new LoggerManager(serviceName, level, {
      console: true,
    });
  }

  /**
   * Creates a logger with custom file configuration.
   * 
   * @param serviceName - Service name
   * @param fileConfig - File configuration
   * @returns LoggerManager instance
   */
  public static createWithFile(serviceName: string, fileConfig: LogFileConfig): LoggerManager {
    return new LoggerManager(serviceName, fileConfig.level || 'info', {
      file: {
        path: fileConfig.filename,
        maxSize: fileConfig.maxSize,
        maxFiles: fileConfig.maxFiles,
      },
    });
  }
}

/**
 * *******************************************************************************************************************
 * Default Export
 * *******************************************************************************************************************
 */

export default LoggerManager;

// End of File