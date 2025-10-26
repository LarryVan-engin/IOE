/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          constants/index.ts
 * Description:   Application-wide constants and configuration values
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.9.3+
 * Dependencies:  None (pure constants)
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Central location for all application constants
 *                - Only Project Leader has permission to modify this file
 *                - Values are immutable and should be in SCREAMING_SNAKE_CASE
 *                - Group related constants together with comments
 *                - Use TypeScript const assertions for better type safety
 * *******************************************************************************************************************
 */

/**
 * *******************************************************************************************************************
 * Application Information
 * *******************************************************************************************************************
 */

/** Application name */
export const APP_NAME = 'IOE TypeScript Application' as const;

/** Application version */
export const APP_VERSION = '1.0.0' as const;

/** Application description */
export const APP_DESCRIPTION = 'IOE INNOVATION Team TypeScript/Node.js application following coding standards' as const;

/** Application author */
export const APP_AUTHOR = 'IOE Development Team' as const;

/** Application license */
export const APP_LICENSE = 'MIT' as const;

/**
 * *******************************************************************************************************************
 * Server Configuration
 * *******************************************************************************************************************
 */

/** Default server port */
export const DEFAULT_PORT = 3000 as const;

/** Default server host */
export const DEFAULT_HOST = 'localhost' as const;

/** Maximum request body size (in bytes) */
export const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

/** Request timeout (in milliseconds) */
export const REQUEST_TIMEOUT = 30000 as const; // 30 seconds

/** Server shutdown timeout (in milliseconds) */
export const SHUTDOWN_TIMEOUT = 10000 as const; // 10 seconds

/** Keep-alive timeout (in milliseconds) */
export const KEEP_ALIVE_TIMEOUT = 60000 as const; // 60 seconds

/**
 * *******************************************************************************************************************
 * Database Configuration
 * *******************************************************************************************************************
 */

/** Default database port */
export const DEFAULT_DB_PORT = 5432 as const;

/** Default database host */
export const DEFAULT_DB_HOST = 'localhost' as const;

/** Database connection timeout (in milliseconds) */
export const DB_CONNECTION_TIMEOUT = 10000 as const; // 10 seconds

/** Database query timeout (in milliseconds) */
export const DB_QUERY_TIMEOUT = 30000 as const; // 30 seconds

/** Maximum database connection pool size */
export const DB_MAX_CONNECTIONS = 20 as const;

/** Minimum database connection pool size */
export const DB_MIN_CONNECTIONS = 2 as const;

/** Database connection idle timeout (in milliseconds) */
export const DB_IDLE_TIMEOUT = 30000 as const; // 30 seconds

/** Database connection maximum lifetime (in milliseconds) */
export const DB_MAX_LIFETIME = 1800000 as const; // 30 minutes

/**
 * *******************************************************************************************************************
 * Logging Configuration
 * *******************************************************************************************************************
 */

/** Available log levels */
export const LOG_LEVELS = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const;

/** Default log level */
export const DEFAULT_LOG_LEVEL = 'info' as const;

/** Log file maximum size (in bytes) */
export const LOG_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** Maximum number of log files to keep */
export const LOG_MAX_FILES = 5 as const;

/** Log rotation frequency */
export const LOG_ROTATION_FREQUENCY = 'daily' as const;

/** Default log format */
export const DEFAULT_LOG_FORMAT = 'json' as const;

/**
 * *******************************************************************************************************************
 * Security Configuration
 * *******************************************************************************************************************
 */

/** Default JWT expiration time */
export const DEFAULT_JWT_EXPIRATION = '24h' as const;

/** Password minimum length */
export const PASSWORD_MIN_LENGTH = 8 as const;

/** Password maximum length */
export const PASSWORD_MAX_LENGTH = 128 as const;

/** Maximum login attempts before lockout */
export const MAX_LOGIN_ATTEMPTS = 5 as const;

/** Account lockout duration (in milliseconds) */
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/** Rate limiting window (in milliseconds) */
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

/** Maximum requests per window */
export const RATE_LIMIT_MAX_REQUESTS = 100 as const;

/**
 * *******************************************************************************************************************
 * File System Configuration
 * *******************************************************************************************************************
 */

/** Temporary files directory */
export const TEMP_DIR = 'temp' as const;

/** Uploads directory */
export const UPLOADS_DIR = 'uploads' as const;

/** Logs directory */
export const LOGS_DIR = 'logs' as const;

/** Configuration directory */
export const CONFIG_DIR = 'config' as const;

/** Static files directory */
export const STATIC_DIR = 'public' as const;

/** Maximum file upload size (in bytes) */
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB

/** Allowed file extensions for uploads */
export const ALLOWED_UPLOAD_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.pdf', '.doc', '.docx', '.txt', '.csv',
  '.zip', '.tar', '.gz'
] as const;

/**
 * *******************************************************************************************************************
 * API Configuration
 * *******************************************************************************************************************
 */

/** API base path */
export const API_BASE_PATH = '/api' as const;

/** API version */
export const API_VERSION = 'v1' as const;

/** API versioned path */
export const API_VERSIONED_PATH = `${API_BASE_PATH}/${API_VERSION}` as const;

/** Default pagination limit */
export const DEFAULT_PAGE_SIZE = 20 as const;

/** Maximum pagination limit */
export const MAX_PAGE_SIZE = 100 as const;

/** API response timeout (in milliseconds) */
export const API_TIMEOUT = 30000 as const; // 30 seconds

/**
 * *******************************************************************************************************************
 * Cache Configuration
 * *******************************************************************************************************************
 */

/** Default cache TTL (in seconds) */
export const DEFAULT_CACHE_TTL = 3600 as const; // 1 hour

/** Maximum cache size (number of items) */
export const MAX_CACHE_SIZE = 1000 as const;

/** Cache cleanup interval (in milliseconds) */
export const CACHE_CLEANUP_INTERVAL = 300000 as const; // 5 minutes

/**
 * *******************************************************************************************************************
 * Environment Configuration
 * *******************************************************************************************************************
 */

/** Available environments */
export const ENVIRONMENTS = ['development', 'testing', 'staging', 'production'] as const;

/** Development environment */
export const ENV_DEVELOPMENT = 'development' as const;

/** Testing environment */
export const ENV_TESTING = 'testing' as const;

/** Staging environment */
export const ENV_STAGING = 'staging' as const;

/** Production environment */
export const ENV_PRODUCTION = 'production' as const;

/**
 * *******************************************************************************************************************
 * HTTP Status Codes
 * *******************************************************************************************************************
 */

/** HTTP success status codes */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

/**
 * *******************************************************************************************************************
 * Error Codes
 * *******************************************************************************************************************
 */

/** Application error codes */
export const ERROR_CODES = {
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  
  // Authentication errors
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_CREDENTIALS_INVALID: 'AUTH_CREDENTIALS_INVALID',
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  
  // Database errors
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR: 'DB_QUERY_ERROR',
  DB_TRANSACTION_ERROR: 'DB_TRANSACTION_ERROR',
  DB_CONSTRAINT_ERROR: 'DB_CONSTRAINT_ERROR',
  
  // File system errors
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_ACCESS_DENIED: 'FILE_ACCESS_DENIED',
  FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
  
  // Network errors
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_CONNECTION_ERROR: 'NETWORK_CONNECTION_ERROR',
  NETWORK_RATE_LIMITED: 'NETWORK_RATE_LIMITED',
  
  // Business logic errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_ACCESS_DENIED: 'RESOURCE_ACCESS_DENIED',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED'
} as const;

/**
 * *******************************************************************************************************************
 * Regular Expressions
 * *******************************************************************************************************************
 */

/** Email validation regex */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ as RegExp;

/** UUID v4 validation regex */
export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i as RegExp;

/** Password strength regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number) */
export const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/ as RegExp;

/** Phone number regex (international format) */
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/ as RegExp;

/** URL validation regex */
export const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/ as RegExp;

/**
 * *******************************************************************************************************************
 * Date and Time Configuration
 * *******************************************************************************************************************
 */

/** Default date format */
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD' as const;

/** Default datetime format */
export const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss' as const;

/** ISO datetime format */
export const ISO_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ' as const;

/** Timezone */
export const DEFAULT_TIMEZONE = 'UTC' as const;

/**
 * *******************************************************************************************************************
 * Type Definitions for Constants
 * *******************************************************************************************************************
 */

/** Type for log levels */
export type LogLevel = typeof LOG_LEVELS[number];

/** Type for environments */
export type Environment = typeof ENVIRONMENTS[number];

/** Type for HTTP status codes */
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

/** Type for error codes */
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/** Type for allowed upload extensions */
export type AllowedUploadExtension = typeof ALLOWED_UPLOAD_EXTENSIONS[number];

// End of File