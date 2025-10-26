# IOE INNOVATION Team - TypeScript Coding Guidelines

## 1. General Information Header

### 1.1 Header Format
Mọi file TypeScript phải bắt đầu với header thông tin theo format chuẩn IOE:

```typescript
/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       [PROJECT_NAME]
 * File:          [FILE_NAME].ts
 * Description:   [BRIEF_DESCRIPTION]
 *
 * Author:        [AUTHOR_NAME] (Project Leader) // Chỉ cho main.ts
 * Email:         [EMAIL_ADDRESS]
 * Created:       [CREATION_DATE]
 * Last Update:   [LAST_UPDATE_DATE]
 * Version:       [VERSION]
 *
 * Node.js:       [NODE_VERSION] (e.g., 24.10.0+)
 * TypeScript:    [TS_VERSION] (e.g., 5.9.3+)
 * Dependencies:  [LIST_MAIN_DEPENDENCIES]
 *                - express: Web server framework
 *                - winston: Logging library
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       [LICENSE_TYPE]
 *
 * Notes:         [ADDITIONAL_NOTES]
 *                - [NOTE_1]
 *                - [NOTE_2]
 * *******************************************************************************************************************
 */
```

### 1.2 Header Requirements
- **Project**: Tên dự án đầy đủ
- **File**: Tên file và mô tả ngắn gọn chức năng
- **Description**: Mô tả chi tiết chức năng của file
- **Author**: Tên tác giả (chỉ Project Leader được sửa main.ts)
- **Version**: Version theo semantic versioning (x.y.z)
- **Dependencies**: Liệt kê các dependencies chính
- **Notes**: Ghi chú bổ sung quan trọng

## 2. File Organization và Import Structure

### 2.1 Import Organization
Imports phải được tổ chức theo thứ tự và phân loại rõ ràng:

```typescript
// Node.js built-in modules
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// Third-party libraries
import express from 'express';
import winston from 'winston';
import { validate } from 'class-validator';

// Local modules - Types
import type { UserData, ApiResponse } from '@/types';
import type { DatabaseConfig, ServerConfig } from '@/types/config';

// Local modules - Utils
import { Logger } from '@/utils/Logger';
import { Config } from '@/utils/Config';

// Local modules - Business logic
import { WebServer } from '@/modules/WebServer';
import { Database } from '@/modules/Database';
```

### 2.2 Export Organization
```typescript
// Named exports cho utility functions
export { processData, validateInput };

// Default export cho main class
export default class WebServer {
  // Implementation
}

// Type exports
export type { UserData, ApiResponse };
export interface ServerResponse<T = unknown> {
  // Interface definition
}
```

## 3. Naming Conventions

### 3.1 Classes và Interfaces
```typescript
// Classes: PascalCase (bắt buộc)
export class WebServer {
  // Implementation
}

export class Database {
  // Implementation
}

// Interfaces: PascalCase
export interface UserData {
  id: string;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 3.2 Functions và Variables
```typescript
// Functions: camelCase
export function processUserData(userData: UserData): ProcessedData {
  // Implementation
}

export async function connectToDatabase(config: DatabaseConfig): Promise<void> {
  // Implementation
}

// Variables: camelCase
const userCount: number = 100;
let isConnected: boolean = false;
const databaseConfig: DatabaseConfig = {
  // Configuration
};

// Constants: UPPER_SNAKE_CASE
export const MAX_RETRY_COUNT: number = 3;
export const DEFAULT_TIMEOUT: number = 5000;
export const API_BASE_URL: string = 'https://api.example.com';
```

### 3.3 Files và Directories
```typescript
// Files: PascalCase cho classes, kebab-case cho utilities
WebServer.ts        // Class file
Database.ts         // Class file
api-helpers.ts         // Utility file
user-validation.ts     // Utility file

// Directories: kebab-case
src/modules/
src/utils/
src/types/
tests/unit/
tests/integration/
```

## 4. TypeScript Specific Guidelines

### 4.1 Type Definitions
```typescript
// Sử dụng interface thay vì type khi có thể
interface UserData {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date; // Optional property
}

// Type aliases cho complex types
type ProcessingCallback = (data: UserData[]) => Promise<void>;
type DatabaseConnection = Connection | null;

// Generic types
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Enums cho constants với giới hạn
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
```

### 4.2 Function Signatures
```typescript
// Explicit return types (bắt buộc)
export function processData(input: UserData[]): Promise<ProcessedData[]> {
  // Implementation
}

// Generic functions
export function createResponse<T>(data: T, success: boolean = true): ApiResponse<T> {
  return {
    success,
    data,
    timestamp: new Date().toISOString(),
  };
}

// Optional parameters
export function connectWithRetry(
  config: DatabaseConfig,
  maxRetries: number = MAX_RETRY_COUNT,
  timeout: number = DEFAULT_TIMEOUT
): Promise<void> {
  // Implementation
}
```

### 4.3 Class Definitions
```typescript
export class WebServer {
  // Properties với explicit types
  private readonly app: express.Application;
  private readonly logger: winston.Logger;
  private isRunning: boolean = false;
  
  // Constructor với parameter properties
  constructor(
    private readonly config: ServerConfig,
    private readonly database: Database
  ) {
    this.app = express();
    this.logger = winston.createLogger(/* config */);
    this.initialize();
  }
  
  // Public methods
  public async start(port: number): Promise<void> {
    // Implementation
  }
  
  // Private methods
  private initialize(): void {
    // Implementation
  }
  
  // Getters/Setters
  public get isServerRunning(): boolean {
    return this.isRunning;
  }
}
```

## 5. Error Handling

### 5.1 Custom Error Classes
```typescript
// Base error class
export abstract class Error extends Error {
  public readonly timestamp: Date;
  public readonly code: string;
  
  constructor(
    message: string,
    code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Specific error types
export class ValidationError extends Error {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', { field });
  }
}

export class DatabaseError extends Error {
  constructor(message: string, operation?: string) {
    super(message, 'DATABASE_ERROR', { operation });
  }
}
```

### 5.2 Error Handling Patterns
```typescript
// Async/await with proper error handling
export async function processUserData(userData: UserData[]): Promise<ProcessedData[]> {
  try {
    // Validation
    if (!userData || userData.length === 0) {
      throw new ValidationError('User data array cannot be empty');
    }
    
    // Processing logic
    const results: ProcessedData[] = [];
    
    for (const user of userData) {
      try {
        const processed = await processUser(user);
        results.push(processed);
      } catch (error) {
        // Log individual errors but continue processing
        logger.warn('Failed to process user', { userId: user.id, error });
        continue;
      }
    }
    
    return results;
    
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(
      `Failed to process user data: ${error.message}`,
      'PROCESSING_ERROR',
      { originalError: error, userCount: userData.length }
    );
  }
}

// Promise-based error handling
export function connectToDatabase(config: DatabaseConfig): Promise<Connection> {
  return new Promise((resolve, reject) => {
    // Implementation
  }).catch((error: unknown) => {
    throw new DatabaseError(`Database connection failed: ${error}`);
  });
}
```

## 6. Async/Await Best Practices

### 6.1 Async Function Patterns
```typescript
// Prefer async/await over Promises
export async function fetchUserData(userId: string): Promise<UserData> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const userData = await response.json() as UserData;
    return userData;
    
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error });
    throw new Error('User data fetch failed', 'FETCH_ERROR', { userId });
  }
}

// Parallel processing
export async function processMultipleUsers(userIds: string[]): Promise<UserData[]> {
  const promises = userIds.map(id => fetchUserData(id));
  
  try {
    return await Promise.all(promises);
  } catch (error) {
    // Handle partial failures if needed
    const results = await Promise.allSettled(promises);
    const successful = results
      .filter((result): result is PromiseFulfilledResult<UserData> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
    
    logger.warn('Some user fetches failed', { 
      total: userIds.length, 
      successful: successful.length 
    });
    
    return successful;
  }
}
```

## 7. Documentation Guidelines

### 7.1 JSDoc Comments
```typescript
/**
 * Processes user data according to business rules and validates the results.
 * 
 * This function performs comprehensive validation and transformation of user data,
 * including data sanitization, business rule application, and result validation.
 * 
 * @param userData - Array of user data objects to process
 * @param options - Processing options and configuration
 * @param options.validateInput - Whether to validate input data (default: true)
 * @param options.skipErrors - Whether to skip errors and continue processing (default: false)
 * @param callback - Optional callback function for progress updates
 * 
 * @returns Promise resolving to array of processed user data
 * 
 * @throws {ValidationError} When input validation fails
 * @throws {ProcessingError} When processing fails
 * 
 * @example
 * ```typescript
 * const users = [{ id: '1', name: 'John', email: 'john@example.com' }];
 * const options = { validateInput: true, skipErrors: false };
 * 
 * const processed = await processUserData(users, options);
 * console.log(`Processed ${processed.length} users`);
 * ```
 * 
 * @since 1.0.0
 * @author  Development Team
 */
export async function processUserData(
  userData: UserData[],
  options: ProcessingOptions = {},
  callback?: ProcessingCallback
): Promise<ProcessedUserData[]> {
  // Implementation
}
```

### 7.2 Interface Documentation
```typescript
/**
 * Configuration interface for database connections.
 * 
 * Defines all required and optional parameters for establishing
 * database connections in IOE applications.
 * 
 * @interface DatabaseConfig
 * @since 1.0.0
 */
export interface DatabaseConfig {
  /** Database host address */
  readonly host: string;
  
  /** Database port number (default: 5432 for PostgreSQL) */
  readonly port: number;
  
  /** Database name */
  readonly database: string;
  
  /** Username for authentication */
  readonly username: string;
  
  /** Password for authentication */
  readonly password: string;
  
  /** 
   * Connection pool configuration 
   * @optional
   */
  readonly pool?: {
    /** Minimum number of connections in pool (default: 2) */
    min: number;
    /** Maximum number of connections in pool (default: 10) */
    max: number;
    /** Connection timeout in milliseconds (default: 5000) */
    timeout: number;
  };
  
  /** 
   * SSL configuration for secure connections 
   * @optional
   */
  readonly ssl?: boolean | {
    ca?: string;
    cert?: string;
    key?: string;
  };
}
```

## 8. Testing Guidelines

### 8.1 Unit Test Structure
```typescript
/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          WebServer.test.ts
 * Description:   Unit tests for WebServer class
 * 
 * Author:        IOE Development Team
 * Created:       2025-10-23
 * Version:       1.0.0
 * *******************************************************************************************************************
 */

import { WebServer } from '../modules/IOEWebServer';
import { Database } from '../modules/IOEDatabase';
import type { ServerConfig } from '../types';

describe('WebServer', () => {
  let server: WebServer;
  let mockConfig: ServerConfig;
  let mockDatabase: jest.Mocked<Database>;
  
  beforeEach(() => {
    mockConfig = {
      port: 3000,
      host: 'localhost',
      environment: 'test',
    };
    
    mockDatabase = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      query: jest.fn(),
    } as jest.Mocked<Database>;
    
    server = new WebServer(mockConfig, mockDatabase);
  });
  
  afterEach(async () => {
    await server.stop();
  });
  
  describe('constructor', () => {
    it('should initialize with valid configuration', () => {
      expect(server).toBeDefined();
      expect(server.isServerRunning).toBe(false);
    });
    
    it('should throw error with invalid configuration', () => {
      const invalidConfig = { ...mockConfig, port: -1 };
      
      expect(() => new WebServer(invalidConfig, mockDatabase))
        .toThrow('Invalid port number');
    });
  });
  
  describe('start', () => {
    it('should start server successfully', async () => {
      await expect(server.start(3000)).resolves.toBeUndefined();
      expect(server.isServerRunning).toBe(true);
    });
    
    it('should handle start errors gracefully', async () => {
      // Mock server start failure
      jest.spyOn(server as any, 'initializeServer').mockRejectedValue(
        new Error('Port already in use')
      );
      
      await expect(server.start(3000)).rejects.toThrow('Port already in use');
    });
  });
});
```

### 8.2 Integration Test Example
```typescript
describe('WebServer Integration', () => {
  let app: WebServer;
  let testDatabase: Database;
  
  beforeAll(async () => {
    // Setup test database
    testDatabase = new Database(testConfig);
    await testDatabase.connect();
    
    // Initialize server
    app = new WebServer(serverConfig, testDatabase);
    await app.start(0); // Use random port
  });
  
  afterAll(async () => {
    await app.stop();
    await testDatabase.disconnect();
  });
  
  it('should handle API requests correctly', async () => {
    const response = await request(app.getExpressApp())
      .get('/api/users')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## 9. Performance Guidelines

### 9.1 Memory Management
```typescript
// Use WeakMap for object associations
const userSessions = new WeakMap<User, Session>();

// Implement proper cleanup in classes
export class WebServer {
  private readonly timers: Set<NodeJS.Timeout> = new Set();
  
  public scheduleCleanup(interval: number): void {
    const timer = setInterval(() => {
      this.performCleanup();
    }, interval);
    
    this.timers.add(timer);
  }
  
  public async stop(): Promise<void> {
    // Clear all timers
    for (const timer of this.timers) {
      clearInterval(timer);
    }
    this.timers.clear();
    
    // Other cleanup
  }
}
```

### 9.2 Async Performance
```typescript
// Use streaming for large data sets
import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';

export async function processLargeDataSet(
  dataSource: Readable,
  processor: Transform,
  output: WritableStream
): Promise<void> {
  await pipeline(dataSource, processor, output);
}

// Implement backpressure handling
export class DataProcessor {
  private readonly queue: UserData[] = [];
  private readonly maxQueueSize: number = 1000;
  private processing: boolean = false;
  
  public async addData(data: UserData): Promise<void> {
    if (this.queue.length >= this.maxQueueSize) {
      await this.waitForQueueSpace();
    }
    
    this.queue.push(data);
    
    if (!this.processing) {
      this.startProcessing();
    }
  }
}
```

## 10. Security Guidelines

### 10.1 Input Validation
```typescript
import { IsString, IsEmail, IsNotEmpty, validate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public readonly name!: string;
  
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  public readonly email!: string;
}

export async function validateUserInput(input: unknown): Promise<CreateUserDto> {
  const dto = plainToClass(CreateUserDto, input);
  const errors = await validate(dto);
  
  if (errors.length > 0) {
    const messages = errors.map(error => 
      Object.values(error.constraints || {}).join(', ')
    );
    throw new ValidationError(`Validation failed: ${messages.join('; ')}`);
  }
  
  return dto;
}
```

### 10.2 Secure Coding Practices
```typescript
// Environment variable validation
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'API_KEY'] as const;

function validateEnvironment(): void {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Required environment variable ${envVar} is not set`);
    }
  }
}

// Secure random ID generation
import { randomBytes } from 'crypto';

export function generateSecureId(): string {
  return randomBytes(16).toString('hex');
}

// Safe JSON parsing
export function safeJsonParse<T = unknown>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
```

---

**Prepared by IOE INNOVATION Team**  
*Version: 1.0.0*  
*Last Updated: 2025-10-23*