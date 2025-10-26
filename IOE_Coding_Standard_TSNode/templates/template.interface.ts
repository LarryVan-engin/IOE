/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       [PROJECT_NAME]
 * File:          [INTERFACE_NAME].types.ts
 * Description:   Type definitions for [BRIEF_DESCRIPTION]
 *
 * Author:        [AUTHOR_NAME]
 * Email:         [EMAIL_ADDRESS]
 * Created:       [CREATION_DATE]
 * Last Update:   [LAST_UPDATE_DATE]
 * Version:       [VERSION]
 *
 * Node.js:       [NODE_VERSION] (e.g., 24.10.0+)
 * TypeScript:    [TS_VERSION] (e.g., 5.9.3+)
 * Dependencies:  [LIST_MAIN_DEPENDENCIES]
 *                - [DEPENDENCY_1]
 *                - [DEPENDENCY_2]
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       [LICENSE_TYPE]
 *
 * Notes:         [ADDITIONAL_NOTES]
 *                - [NOTE_1]
 *                - [NOTE_2]
 * *******************************************************************************************************************
 */

/**
 * *******************************************************************************************************************
 * Basic Type Definitions
 * *******************************************************************************************************************
 */

/** Primitive type aliases for better semantic meaning */
export type UserId = string;
export type Email = string;
export type Timestamp = Date;
export type Count = number;
export type Percentage = number;

/** Status enums for better type safety */
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

/**
 * *******************************************************************************************************************
 * Core Data Interfaces
 * *******************************************************************************************************************
 */

/**
 * Base interface for entities with common fields.
 * 
 * All entity interfaces should extend this base interface
 * to ensure consistency across the application.
 * 
 * @interface BaseEntity
 * @since 1.0.0
 */
export interface BaseEntity {
  /** Unique identifier for the entity */
  readonly id: string;
  
  /** Timestamp when the entity was created */
  readonly createdAt: Timestamp;
  
  /** Timestamp when the entity was last updated */
  readonly updatedAt: Timestamp;
  
  /** Version number for optimistic locking */
  readonly version: number;
  
  /** Soft delete flag */
  readonly isDeleted: boolean;
}

/**
 * Interface for user data representation.
 * 
 * Defines the structure for user objects throughout the application
 * with proper type safety and documentation.
 * 
 * @interface UserData
 * @extends BaseEntity
 * @since 1.0.0
 */
export interface UserData extends BaseEntity {
  /** User's full name */
  readonly name: string;
  
  /** User's email address (unique) */
  readonly email: Email;
  
  /** User's current status */
  readonly status: Status;
  
  /** User's role in the system */
  readonly role: UserRole;
  
  /** Optional user profile information */
  readonly profile?: UserProfile;
  
  /** User preferences and settings */
  readonly preferences: UserPreferences;
  
  /** Last login timestamp */
  readonly lastLoginAt?: Timestamp;
}

/**
 * Interface for user profile information.
 * 
 * Contains optional extended information about the user
 * that may not be required for all operations.
 * 
 * @interface UserProfile
 * @since 1.0.0
 */
export interface UserProfile {
  /** User's first name */
  readonly firstName?: string;
  
  /** User's last name */
  readonly lastName?: string;
  
  /** User's avatar URL */
  readonly avatarUrl?: string;
  
  /** User's phone number */
  readonly phoneNumber?: string;
  
  /** User's date of birth */
  readonly dateOfBirth?: Date;
  
  /** User's address information */
  readonly address?: Address;
}

/**
 * Interface for address information.
 * 
 * @interface Address
 * @since 1.0.0
 */
export interface Address {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
}

/**
 * Interface for user preferences.
 * 
 * @interface UserPreferences
 * @since 1.0.0
 */
export interface UserPreferences {
  /** User's preferred language */
  readonly language: string;
  
  /** User's timezone */
  readonly timezone: string;
  
  /** Email notification preferences */
  readonly emailNotifications: boolean;
  
  /** Push notification preferences */
  readonly pushNotifications: boolean;
  
  /** Theme preference */
  readonly theme: 'light' | 'dark' | 'auto';
}

/**
 * Enum for user roles with hierarchical permissions.
 * 
 * @enum UserRole
 * @since 1.0.0
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * *******************************************************************************************************************
 * API Response Interfaces
 * *******************************************************************************************************************
 */

/**
 * Generic API response interface.
 * 
 * Provides a consistent structure for all API responses
 * with proper error handling and metadata.
 * 
 * @interface ApiResponse
 * @template T - Type of the response data
 * @since 1.0.0
 */
export interface ApiResponse<T = unknown> {
  /** Indicates if the operation was successful */
  readonly success: boolean;
  
  /** Response data (present on success) */
  readonly data?: T;
  
  /** Error message (present on failure) */
  readonly error?: string;
  
  /** Detailed error information */
  readonly errorDetails?: ErrorDetails;
  
  /** Response metadata */
  readonly metadata: ResponseMetadata;
}

/**
 * Interface for error details in API responses.
 * 
 * @interface ErrorDetails
 * @since 1.0.0
 */
export interface ErrorDetails {
  /** Error code for programmatic handling */
  readonly code: string;
  
  /** Human-readable error message */
  readonly message: string;
  
  /** Field-specific errors for validation failures */
  readonly fieldErrors?: Record<string, string[]>;
  
  /** Stack trace (only in development) */
  readonly stack?: string;
  
  /** Additional context information */
  readonly context?: Record<string, unknown>;
}

/**
 * Interface for response metadata.
 * 
 * @interface ResponseMetadata
 * @since 1.0.0
 */
export interface ResponseMetadata {
  /** Response timestamp */
  readonly timestamp: string;
  
  /** Request ID for tracing */
  readonly requestId: string;
  
  /** API version */
  readonly version: string;
  
  /** Pagination information (for list responses) */
  readonly pagination?: PaginationInfo;
  
  /** Performance metrics */
  readonly performance?: PerformanceMetrics;
}

/**
 * Interface for pagination information.
 * 
 * @interface PaginationInfo
 * @since 1.0.0
 */
export interface PaginationInfo {
  /** Current page number (1-based) */
  readonly page: number;
  
  /** Number of items per page */
  readonly pageSize: number;
  
  /** Total number of items */
  readonly totalItems: number;
  
  /** Total number of pages */
  readonly totalPages: number;
  
  /** Whether there are more pages */
  readonly hasNext: boolean;
  
  /** Whether there are previous pages */
  readonly hasPrevious: boolean;
}

/**
 * Interface for performance metrics.
 * 
 * @interface PerformanceMetrics
 * @since 1.0.0
 */
export interface PerformanceMetrics {
  /** Processing time in milliseconds */
  readonly processingTime: number;
  
  /** Database query time in milliseconds */
  readonly dbTime?: number;
  
  /** External API call time in milliseconds */
  readonly externalApiTime?: number;
}

/**
 * *******************************************************************************************************************
 * Configuration Interfaces
 * *******************************************************************************************************************
 */

/**
 * Interface for database configuration.
 * 
 * @interface DatabaseConfig
 * @since 1.0.0
 */
export interface DatabaseConfig {
  /** Database host */
  readonly host: string;
  
  /** Database port */
  readonly port: number;
  
  /** Database name */
  readonly database: string;
  
  /** Username for authentication */
  readonly username: string;
  
  /** Password for authentication */
  readonly password: string;
  
  /** Connection pool configuration */
  readonly pool?: ConnectionPoolConfig;
  
  /** SSL configuration */
  readonly ssl?: SSLConfig;
  
  /** Connection timeout in milliseconds */
  readonly timeout?: number;
}

/**
 * Interface for connection pool configuration.
 * 
 * @interface ConnectionPoolConfig
 * @since 1.0.0
 */
export interface ConnectionPoolConfig {
  /** Minimum number of connections */
  readonly min: number;
  
  /** Maximum number of connections */
  readonly max: number;
  
  /** Connection idle timeout in milliseconds */
  readonly idleTimeout: number;
  
  /** Maximum connection lifetime in milliseconds */
  readonly maxLifetime: number;
}

/**
 * Interface for SSL configuration.
 * 
 * @interface SSLConfig
 * @since 1.0.0
 */
export interface SSLConfig {
  /** Enable SSL */
  readonly enabled: boolean;
  
  /** CA certificate */
  readonly ca?: string;
  
  /** Client certificate */
  readonly cert?: string;
  
  /** Client private key */
  readonly key?: string;
  
  /** Reject unauthorized connections */
  readonly rejectUnauthorized?: boolean;
}

/**
 * Interface for server configuration.
 * 
 * @interface ServerConfig
 * @since 1.0.0
 */
export interface ServerConfig {
  /** Server port */
  readonly port: number;
  
  /** Server host */
  readonly host: string;
  
  /** Environment (development, production, test) */
  readonly environment: string;
  
  /** CORS configuration */
  readonly cors?: CorsConfig;
  
  /** Security configuration */
  readonly security?: SecurityConfig;
  
  /** Logging configuration */
  readonly logging?: LoggingConfig;
}

/**
 * Interface for CORS configuration.
 * 
 * @interface CorsConfig
 * @since 1.0.0
 */
export interface CorsConfig {
  /** Allowed origins */
  readonly origin: string | string[] | boolean;
  
  /** Allowed methods */
  readonly methods?: string[];
  
  /** Allowed headers */
  readonly allowedHeaders?: string[];
  
  /** Exposed headers */
  readonly exposedHeaders?: string[];
  
  /** Allow credentials */
  readonly credentials?: boolean;
  
  /** Preflight max age */
  readonly maxAge?: number;
}

/**
 * Interface for security configuration.
 * 
 * @interface SecurityConfig
 * @since 1.0.0
 */
export interface SecurityConfig {
  /** JWT secret key */
  readonly jwtSecret: string;
  
  /** JWT expiration time */
  readonly jwtExpirationTime: string;
  
  /** Rate limiting configuration */
  readonly rateLimit?: RateLimitConfig;
  
  /** Enable HTTPS */
  readonly httpsEnabled?: boolean;
  
  /** HTTPS certificate paths */
  readonly httpsCerts?: {
    readonly cert: string;
    readonly key: string;
  };
}

/**
 * Interface for rate limiting configuration.
 * 
 * @interface RateLimitConfig
 * @since 1.0.0
 */
export interface RateLimitConfig {
  /** Maximum requests per window */
  readonly maxRequests: number;
  
  /** Time window in milliseconds */
  readonly windowMs: number;
  
  /** Error message for rate limit exceeded */
  readonly message?: string;
}

/**
 * Interface for logging configuration.
 * 
 * @interface LoggingConfig
 * @since 1.0.0
 */
export interface LoggingConfig {
  /** Log level */
  readonly level: LogLevel;
  
  /** Log format */
  readonly format: 'json' | 'text';
  
  /** Enable console logging */
  readonly console: boolean;
  
  /** File logging configuration */
  readonly file?: FileLoggingConfig;
  
  /** External logging service configuration */
  readonly external?: ExternalLoggingConfig;
}

/**
 * Interface for file logging configuration.
 * 
 * @interface FileLoggingConfig
 * @since 1.0.0
 */
export interface FileLoggingConfig {
  /** Log file path */
  readonly filename: string;
  
  /** Maximum file size in bytes */
  readonly maxSize: number;
  
  /** Maximum number of log files */
  readonly maxFiles: number;
  
  /** Log rotation frequency */
  readonly frequency: 'daily' | 'hourly';
}

/**
 * Interface for external logging configuration.
 * 
 * @interface ExternalLoggingConfig
 * @since 1.0.0
 */
export interface ExternalLoggingConfig {
  /** Service name (e.g., 'elasticsearch', 'cloudwatch') */
  readonly service: string;
  
  /** Service endpoint URL */
  readonly endpoint: string;
  
  /** Authentication credentials */
  readonly credentials?: Record<string, string>;
  
  /** Additional configuration */
  readonly options?: Record<string, unknown>;
}

/**
 * *******************************************************************************************************************
 * Utility Type Definitions
 * *******************************************************************************************************************
 */

/** Type for async operation results */
export type AsyncResult<T, E = Error> = Promise<{
  readonly success: boolean;
  readonly data?: T;
  readonly error?: E;
}>;

/** Type for event handler functions */
export type EventHandler<T = unknown> = (event: T) => void | Promise<void>;

/** Type for validation functions */
export type Validator<T = unknown> = (value: T) => boolean | Promise<boolean>;

/** Type for transformation functions */
export type Transformer<TInput, TOutput> = (input: TInput) => TOutput | Promise<TOutput>;

/** Type for comparison functions */
export type Comparator<T> = (a: T, b: T) => number;

/** Type for predicate functions */
export type Predicate<T> = (value: T) => boolean;

/** Type for factory functions */
export type Factory<T, TArgs extends readonly unknown[] = []> = (...args: TArgs) => T;

/** Type for cleanup functions */
export type CleanupFunction = () => void | Promise<void>;

/** Type for middleware functions */
export type MiddlewareFunction<TContext = unknown> = (
  context: TContext,
  next: () => Promise<void>
) => Promise<void>;

/**
 * *******************************************************************************************************************
 * Advanced Type Utilities
 * *******************************************************************************************************************
 */

/** Make specified properties required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make specified properties optional */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Deep readonly type */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** Deep partial type */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Nullable type */
export type Nullable<T> = T | null;

/** Optional type */
export type Optional<T> = T | undefined;

/** Non-empty array type */
export type NonEmptyArray<T> = [T, ...T[]];

/** Extract promise type */
export type PromiseType<T> = T extends Promise<infer U> ? U : T;

/** Extract array element type */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/** Create a type with all properties as functions returning the property type */
export type Getters<T> = {
  [P in keyof T]: () => T[P];
};

/** Create a type with all properties as functions accepting the property type */
export type Setters<T> = {
  [P in keyof T]: (value: T[P]) => void;
};

/**
 * *******************************************************************************************************************
 * Validation Result Types
 * *******************************************************************************************************************
 */

/**
 * Interface for validation results.
 * 
 * @interface ValidationResult
 * @template T - Type of the validated data
 * @since 1.0.0
 */
export interface ValidationResult<T = unknown> {
  /** Whether validation passed */
  readonly isValid: boolean;
  
  /** Validated data (if valid) */
  readonly data?: T;
  
  /** Validation errors */
  readonly errors: ValidationError[];
  
  /** Validation warnings */
  readonly warnings?: ValidationWarning[];
}

/**
 * Interface for validation errors.
 * 
 * @interface ValidationError
 * @since 1.0.0
 */
export interface ValidationError {
  /** Field that failed validation */
  readonly field: string;
  
  /** Error message */
  readonly message: string;
  
  /** Error code */
  readonly code: string;
  
  /** Actual value that failed validation */
  readonly value?: unknown;
  
  /** Expected value or format */
  readonly expected?: unknown;
}

/**
 * Interface for validation warnings.
 * 
 * @interface ValidationWarning
 * @since 1.0.0
 */
export interface ValidationWarning {
  /** Field with warning */
  readonly field: string;
  
  /** Warning message */
  readonly message: string;
  
  /** Warning code */
  readonly code: string;
}

/**
 * *******************************************************************************************************************
 * Export Summary
 * *******************************************************************************************************************
 */

// All interfaces and types are already exported above
// This template file provides comprehensive type definitions
// for IOE TypeScript projects following coding standards

// End of File