/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          types/index.ts
 * Description:   Central type definitions and interfaces for IOE TypeScript applications
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.9.3+
 * Dependencies:  None (pure types)
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Main type definitions export file
 *                - Only Project Leader has permission to modify this file
 *                - All application-wide types should be defined here
 *                - Use proper TypeScript conventions for type definitions
 *                - Group related types together with comments
 * *******************************************************************************************************************
 */

// Import and re-export all types from sub-modules
import type {
  LogLevel,
  Environment,
  HttpStatus,
  ErrorCode,
  AllowedUploadExtension
} from '../constants';

// Re-export for external use
export type {
  LogLevel,
  Environment,
  HttpStatus,
  ErrorCode,
  AllowedUploadExtension
};

/**
 * *******************************************************************************************************************
 * Basic Utility Types
 * *******************************************************************************************************************
 */

/** Represents a unique identifier */
export type Id = string | number;

/** Represents a timestamp */
export type Timestamp = string | Date | number;

/** Represents optional properties in an object */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Represents required properties in an object */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Represents a deep partial type */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Represents a nullable type */
export type Nullable<T> = T | null;

/** Represents an optional type */
export type Maybe<T> = T | undefined;

/**
 * *******************************************************************************************************************
 * API Response Types
 * *******************************************************************************************************************
 */

/** Base API response structure */
export interface ApiResponse<T = unknown> {
  /** Indicates if the operation was successful */
  success: boolean;
  
  /** Response data (only present on success) */
  data?: T;
  
  /** Error message (only present on failure) */
  error?: string;
  
  /** Additional metadata */
  metadata?: {
    /** Response timestamp */
    timestamp: string;
    
    /** Request identifier */
    requestId?: string;
    
    /** API version */
    version?: string;
    
    /** Additional context */
    context?: Record<string, unknown>;
  };
}

/** Paginated API response */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  /** Pagination information */
  pagination?: {
    /** Current page number (1-based) */
    page: number;
    
    /** Number of items per page */
    limit: number;
    
    /** Total number of items */
    total: number;
    
    /** Total number of pages */
    totalPages: number;
    
    /** Has next page */
    hasNext: boolean;
    
    /** Has previous page */
    hasPrevious: boolean;
  };
}

/** Error response details */
export interface ErrorResponse {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Error details */
  details?: Record<string, unknown>;
  
  /** Stack trace (only in development) */
  stack?: string;
  
  /** Validation errors */
  validationErrors?: ValidationError[];
}

/** Validation error details */
export interface ValidationError {
  /** Field name */
  field: string;
  
  /** Error message */
  message: string;
  
  /** Rejected value */
  value?: unknown;
  
  /** Validation rule that failed */
  rule?: string;
}

/**
 * *******************************************************************************************************************
 * Server Configuration Types
 * *******************************************************************************************************************
 */

/** Server configuration */
export interface ServerConfig {
  /** Server port */
  port: number;
  
  /** Server host */
  host: string;
  
  /** Environment */
  environment: string;
  
  /** CORS configuration */
  cors: {
    /** Allowed origins */
    origin: string | string[];
    
    /** Allow credentials */
    credentials: boolean;
    
    /** Allowed methods */
    methods?: string[];
    
    /** Allowed headers */
    allowedHeaders?: string[];
    
    /** Exposed headers */
    exposedHeaders?: string[];
    
    /** Max age for preflight requests */
    maxAge?: number;
  };
  
  /** Security configuration */
  security: {
    /** JWT secret key */
    jwtSecret: string;
    
    /** JWT expiration time */
    jwtExpirationTime: string;
    
    /** Enable HTTPS */
    https?: boolean;
    
    /** SSL certificate path */
    sslCertPath?: string;
    
    /** SSL key path */
    sslKeyPath?: string;
    
    /** Enable helmet security headers */
    helmet?: boolean;
    
    /** Rate limiting configuration */
    rateLimit?: {
      /** Window size in milliseconds */
      windowMs: number;
      
      /** Maximum requests per window */
      max: number;
      
      /** Error message */
      message?: string;
    };
  };
  
  /** Logging configuration */
  logging: {
    /** Log level */
    level: string;
    
    /** Log format */
    format: 'json' | 'simple';
    
    /** Enable console logging */
    console: boolean;
    
    /** File logging configuration */
    file?: {
      /** Log file name */
      filename: string;
      
      /** Maximum file size */
      maxSize: number;
      
      /** Maximum number of files */
      maxFiles: number;
      
      /** Rotation frequency */
      frequency: 'daily' | 'hourly';
    };
  };
}

/**
 * *******************************************************************************************************************
 * Database Configuration Types
 * *******************************************************************************************************************
 */

/** Database configuration */
export interface DatabaseConfig {
  /** Database host */
  host: string;
  
  /** Database port */
  port: number;
  
  /** Database name */
  database: string;
  
  /** Username */
  username: string;
  
  /** Password */
  password: string;
  
  /** Connection pool configuration */
  pool?: {
    /** Minimum connections */
    min: number;
    
    /** Maximum connections */
    max: number;
    
    /** Idle timeout */
    idleTimeout: number;
    
    /** Maximum lifetime */
    maxLifetime: number;
  };
  
  /** SSL configuration */
  ssl?: boolean | {
    /** SSL mode */
    mode: 'require' | 'prefer' | 'disable';
    
    /** CA certificate */
    ca?: string;
    
    /** Client certificate */
    cert?: string;
    
    /** Client key */
    key?: string;
  };
  
  /** Connection timeout */
  connectionTimeout?: number;
  
  /** Query timeout */
  queryTimeout?: number;
}

/**
 * *******************************************************************************************************************
 * Logging Types
 * *******************************************************************************************************************
 */

/** Log entry structure */
export interface LogEntry {
  /** Log level */
  level: LogLevel;
  
  /** Log message */
  message: string;
  
  /** Timestamp */
  timestamp: string;
  
  /** Logger name/service */
  service?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  
  /** Error object */
  error?: Error | undefined;
  
  /** Request ID */
  requestId?: string | undefined;
  
  /** User ID */
  userId?: string | undefined;
}

/** Logger configuration */
export interface LoggerConfig {
  /** Service name */
  service: string;
  
  /** Log level */
  level: LogLevel;
  
  /** Output format */
  format: 'json' | 'simple';
  
  /** Enable console output */
  console: boolean;
  
  /** File output configuration */
  file?: {
    /** File path */
    path: string;
    
    /** Maximum file size */
    maxSize: number;
    
    /** Maximum files to keep */
    maxFiles: number;
  };
}

/**
 * *******************************************************************************************************************
 * Authentication Types
 * *******************************************************************************************************************
 */

/** User authentication information */
export interface UserAuth {
  /** User ID */
  id: Id;
  
  /** Username */
  username: string;
  
  /** Email address */
  email: string;
  
  /** User roles */
  roles: string[];
  
  /** Permissions */
  permissions: string[];
  
  /** JWT token */
  token?: string;
  
  /** Token expiration */
  tokenExpires?: Timestamp;
  
  /** Refresh token */
  refreshToken?: string;
}

/** Login credentials */
export interface LoginCredentials {
  /** Username or email */
  username: string;
  
  /** Password */
  password: string;
  
  /** Remember me flag */
  rememberMe?: boolean;
}

/** JWT payload */
export interface JwtPayload {
  /** Subject (user ID) */
  sub: string;
  
  /** Username */
  username: string;
  
  /** Email */
  email: string;
  
  /** Roles */
  roles: string[];
  
  /** Issued at */
  iat: number;
  
  /** Expires at */
  exp: number;
  
  /** Issuer */
  iss?: string;
  
  /** Audience */
  aud?: string;
}

/**
 * *******************************************************************************************************************
 * HTTP Request/Response Types
 * *******************************************************************************************************************
 */

/** HTTP request context */
export interface RequestContext {
  /** Request ID */
  requestId: string;
  
  /** User information */
  user?: UserAuth;
  
  /** Client IP address */
  ip: string;
  
  /** User agent */
  userAgent?: string;
  
  /** Request timestamp */
  timestamp: string;
  
  /** Request method */
  method: string;
  
  /** Request URL */
  url: string;
  
  /** Request headers */
  headers: Record<string, string | string[]>;
  
  /** Query parameters */
  query: Record<string, unknown>;
  
  /** Request body */
  body?: unknown;
}

/** File upload information */
export interface FileUpload {
  /** Original filename */
  originalName: string;
  
  /** File mimetype */
  mimetype: string;
  
  /** File size in bytes */
  size: number;
  
  /** File buffer */
  buffer: Buffer;
  
  /** Upload timestamp */
  uploadedAt: Timestamp;
  
  /** Uploaded by user */
  uploadedBy?: Id;
}

/**
 * *******************************************************************************************************************
 * Health Check Types
 * *******************************************************************************************************************
 */

/** Health check result */
export interface HealthCheck {
  /** Overall status */
  status: 'healthy' | 'unhealthy' | 'degraded';
  
  /** Check timestamp */
  timestamp: string;
  
  /** Application version */
  version: string;
  
  /** Uptime in seconds */
  uptime: number;
  
  /** Memory usage */
  memory: {
    /** Used memory */
    used: number;
    
    /** Total memory */
    total: number;
    
    /** Memory usage percentage */
    percentage: number;
  };
  
  /** Service checks */
  services: Record<string, ServiceHealth>;
}

/** Individual service health */
export interface ServiceHealth {
  /** Service status */
  status: 'healthy' | 'unhealthy';
  
  /** Response time in milliseconds */
  responseTime?: number;
  
  /** Last check timestamp */
  lastCheck: string;
  
  /** Error message if unhealthy */
  error?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * *******************************************************************************************************************
 * Configuration Types
 * *******************************************************************************************************************
 */

/** Application configuration */
export interface AppConfig {
  /** Application information */
  app: {
    /** Application name */
    name: string;
    
    /** Application version */
    version: string;
    
    /** Application description */
    description: string;
    
    /** Environment */
    environment: Environment;
  };
  
  /** Server configuration */
  server: ServerConfig;
  
  /** Database configuration */
  database: DatabaseConfig;
  
  /** External services configuration */
  services?: Record<string, ServiceConfig>;
  
  /** Feature flags */
  features?: Record<string, boolean>;
}

/** External service configuration */
export interface ServiceConfig {
  /** Service base URL */
  baseUrl: string;
  
  /** API key */
  apiKey?: string;
  
  /** Request timeout */
  timeout: number;
  
  /** Retry configuration */
  retry?: {
    /** Number of retries */
    attempts: number;
    
    /** Delay between retries */
    delay: number;
  };
}

// End of File