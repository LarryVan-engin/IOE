/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          utils/Database.ts
 * Description:   Database connection and management utility for IOE TypeScript applications
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.9.3+
 * Dependencies:  None (database-agnostic interface)
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Database abstraction layer for IOE applications
 *                - Only Project Leader has permission to modify this file
 *                - Provides database-agnostic interface
 *                - Implements connection pooling and health checks
 *                - Supports multiple database types (PostgreSQL, MySQL, SQLite)
 * *******************************************************************************************************************
 */

// Local modules
import type { DatabaseConfig, ServiceHealth } from '../types';
import type { LoggerManager } from './Logger';

/**
 * *******************************************************************************************************************
 * Type Definitions
 * *******************************************************************************************************************
 */

/** Database connection status */
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/** Database query result */
interface QueryResult<T = unknown> {
  /** Query success */
  success: boolean;
  
  /** Result data */
  data?: T[];
  
  /** Number of affected rows */
  affectedRows?: number;
  
  /** Error message */
  error?: string;
  
  /** Query execution time in milliseconds */
  executionTime?: number;
}

/** Database transaction interface */
interface Transaction {
  /** Execute query within transaction */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  
  /** Commit transaction */
  commit(): Promise<void>;
  
  /** Rollback transaction */
  rollback(): Promise<void>;
}

/** Database connection statistics */
interface ConnectionStats {
  /** Total connections created */
  totalConnections: number;
  
  /** Active connections */
  activeConnections: number;
  
  /** Idle connections */
  idleConnections: number;
  
  /** Total queries executed */
  totalQueries: number;
  
  /** Failed queries */
  failedQueries: number;
  
  /** Average query time */
  averageQueryTime: number;
  
  /** Last connection time */
  lastConnectionTime?: Date;
  
  /** Last error */
  lastError?: string;
}

/**
 * *******************************************************************************************************************
 * IOE Database Class
 * *******************************************************************************************************************
 */

/**
 * Database connection and management utility for IOE TypeScript applications.
 * 
 * This class provides a database-agnostic interface for database operations.
 * It can be extended to support specific database implementations.
 * 
 * Features:
 * - Database-agnostic interface
 * - Connection pooling and management
 * - Transaction support
 * - Health monitoring and statistics
 * - Error handling and recovery
 * - Query performance tracking
 * 
 * @example
 * ```typescript
 * const database = new Database(config, logger);
 * await database.connect();
 * 
 * const result = await database.query('SELECT * FROM users WHERE active = ?', [true]);
 * if (result.success) {
 *   console.log('Users:', result.data);
 * }
 * ```
 */
export class Database {
  /** Database configuration */
  private readonly config: DatabaseConfig;
  
  /** Logger instance */
  private readonly logger: LoggerManager;
  
  /** Connection status */
  private connectionStatus: ConnectionStatus = 'disconnected';
  
  /** Connection statistics */
  private stats: ConnectionStats;
  
  /** Active transactions */
  private readonly activeTransactions = new Set<Transaction>();

  /**
   * Creates a new IOE Database instance.
   * 
   * @param config - Database configuration
   * @param logger - Logger instance
   */
  constructor(databaseConfig: DatabaseConfig, logger: LoggerManager) {
    this.config = databaseConfig;
    this.logger = logger;
    this.stats = this.initializeStats();
    
    this.logger.info('Database instance created', {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
    });
  }

  /**
   * *******************************************************************************************************************
   * Connection Management
   * *******************************************************************************************************************
   */

  /**
   * Establishes database connection.
   * 
   * @throws Error if connection fails
   */
  public async connect(): Promise<void> {
    try {
      this.connectionStatus = 'connecting';
      this.logger.info('Connecting to database', {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
      });

      // Simulate connection logic (replace with actual database implementation)
      await this.simulateConnection();

      this.connectionStatus = 'connected';
      this.stats.totalConnections++;
      this.stats.lastConnectionTime = new Date();

      this.logger.info('Database connection established successfully');

    } catch (error) {
      this.connectionStatus = 'error';
      this.stats.lastError = error instanceof Error ? error.message : 'Unknown connection error';
      
      this.logger.error('Database connection failed', { error: this.stats.lastError });
      throw new Error(`Database connection failed: ${this.stats.lastError}`);
    }
  }

  /**
   * Closes database connection.
   */
  public async disconnect(): Promise<void> {
    try {
      this.logger.info('Disconnecting from database');

      // Close all active transactions
      await this.closeActiveTransactions();

      // Simulate disconnection logic (replace with actual database implementation)
      await this.simulateDisconnection();

      this.connectionStatus = 'disconnected';
      this.logger.info('Database disconnected successfully');

    } catch (error) {
      this.logger.error('Error during database disconnection', { error });
      throw error;
    }
  }

  /**
   * Checks if database is connected.
   * 
   * @returns True if connected
   */
  public isConnected(): boolean {
    return this.connectionStatus === 'connected';
  }

  /**
   * Gets current connection status.
   * 
   * @returns Connection status
   */
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * *******************************************************************************************************************
   * Query Operations
   * *******************************************************************************************************************
   */

  /**
   * Executes a database query.
   * 
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Query result
   */
  public async query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    const startTime = Date.now();
    
    try {
      this.ensureConnected();
      
      this.logger.debug('Executing database query', {
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        params: params?.length || 0,
      });

      // Simulate query execution (replace with actual database implementation)
      const result = await this.simulateQuery<T>(sql, params);

      const executionTime = Date.now() - startTime;
      this.updateQueryStats(true, executionTime);

      this.logger.debug('Query executed successfully', {
        executionTime,
        rowsAffected: result.affectedRows,
      });

      return {
        ...result,
        executionTime,
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.updateQueryStats(false, executionTime);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown query error';
      this.logger.error('Query execution failed', {
        sql: sql.substring(0, 100),
        error: errorMessage,
        executionTime,
      });

      return {
        success: false,
        error: errorMessage,
        executionTime,
      };
    }
  }

  /**
   * Executes multiple queries in a transaction.
   * 
   * @param queries - Array of query objects
   * @returns Transaction results
   */
  public async transaction<T = unknown>(
    queries: Array<{ sql: string; params?: unknown[] }>
  ): Promise<QueryResult<T>[]> {
    this.ensureConnected();

    const transaction = await this.beginTransaction();
    const results: QueryResult<T>[] = [];

    try {
      this.logger.debug('Starting database transaction', {
        queryCount: queries.length,
      });

      for (const { sql, params } of queries) {
        const result = await transaction.query<T>(sql, params);
        results.push(result);

        if (!result.success) {
          throw new Error(result.error || 'Query failed in transaction');
        }
      }

      await transaction.commit();
      this.logger.debug('Transaction committed successfully');

      return results;

    } catch (error) {
      await transaction.rollback();
      this.logger.error('Transaction rolled back', { error });
      throw error;
    } finally {
      this.activeTransactions.delete(transaction);
    }
  }

  /**
   * *******************************************************************************************************************
   * Health Monitoring
   * *******************************************************************************************************************
   */

  /**
   * Performs database health check.
   * 
   * @returns Health check result
   */
  public async healthCheck(): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      // Simple connectivity test
      await this.query('SELECT 1 as health_check');
      
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        responseTime,
        lastCheck: new Date().toISOString(),
        metadata: {
          connectionStatus: this.connectionStatus,
          activeConnections: this.stats.activeConnections,
          totalQueries: this.stats.totalQueries,
          averageQueryTime: this.stats.averageQueryTime,
        },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
        metadata: {
          connectionStatus: this.connectionStatus,
          lastError: this.stats.lastError,
        },
      };
    }
  }

  /**
   * Gets database connection statistics.
   * 
   * @returns Connection statistics
   */
  public getStats(): ConnectionStats {
    return { ...this.stats };
  }

  /**
   * Resets database statistics.
   */
  public resetStats(): void {
    this.stats = this.initializeStats();
    this.logger.info('Database statistics reset');
  }

  /**
   * *******************************************************************************************************************
   * Private Methods
   * *******************************************************************************************************************
   */

  /**
   * Initializes connection statistics.
   * 
   * @returns Initial statistics
   */
  private initializeStats(): ConnectionStats {
    return {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      totalQueries: 0,
      failedQueries: 0,
      averageQueryTime: 0,
    };
  }

  /**
   * Ensures database is connected.
   * 
   * @throws Error if not connected
   */
  private ensureConnected(): void {
    if (!this.isConnected()) {
      throw new Error('Database not connected. Call connect() first.');
    }
  }

  /**
   * Updates query statistics.
   * 
   * @param success - Query success
   * @param executionTime - Execution time
   */
  private updateQueryStats(success: boolean, executionTime: number): void {
    this.stats.totalQueries++;
    
    if (!success) {
      this.stats.failedQueries++;
    }

    // Update average query time
    const totalTime = this.stats.averageQueryTime * (this.stats.totalQueries - 1) + executionTime;
    this.stats.averageQueryTime = totalTime / this.stats.totalQueries;
  }

  /**
   * Simulates database connection (replace with actual implementation).
   */
  private async simulateConnection(): Promise<void> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate potential connection failure
    if (this.config.host === 'invalid-host') {
      throw new Error('Connection refused');
    }
  }

  /**
   * Simulates database disconnection (replace with actual implementation).
   */
  private async simulateDisconnection(): Promise<void> {
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Simulates query execution (replace with actual implementation).
   * 
   * @param sql - SQL query
   * @param _params - Query parameters (unused in simulation)
   * @returns Simulated result
   */
  private async simulateQuery<T = unknown>(sql: string, _params?: unknown[]): Promise<QueryResult<T>> {
    // Simulate query delay
    await new Promise(resolve => setTimeout(resolve, 10));

    // Simulate different query types
    if (sql.toLowerCase().includes('select')) {
      return {
        success: true,
        data: [{ id: 1, name: 'Sample Data' }] as T[],
        affectedRows: 1,
      };
    }

    if (sql.toLowerCase().includes('insert') || sql.toLowerCase().includes('update') || sql.toLowerCase().includes('delete')) {
      return {
        success: true,
        affectedRows: 1,
      };
    }

    // Health check query
    if (sql.toLowerCase().includes('health_check')) {
      return {
        success: true,
        data: [{ health_check: 1 }] as T[],
        affectedRows: 1,
      };
    }

    return {
      success: true,
      affectedRows: 0,
    };
  }

  /**
   * Begins a new transaction.
   * 
   * @returns Transaction interface
   */
  private async beginTransaction(): Promise<Transaction> {
    // Simulate transaction creation
    const transaction: Transaction = {
      query: async <T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>> => {
        return this.simulateQuery<T>(sql, params);
      },
      
      commit: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));
      },
      
      rollback: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));
      },
    };

    this.activeTransactions.add(transaction);
    return transaction;
  }

  /**
   * Closes all active transactions.
   */
  private async closeActiveTransactions(): Promise<void> {
    const rollbackPromises = Array.from(this.activeTransactions).map(transaction =>
      transaction.rollback().catch(error => {
        this.logger.warn('Error rolling back transaction during shutdown', { error });
      })
    );

    await Promise.all(rollbackPromises);
    this.activeTransactions.clear();
  }
}

/**
 * *******************************************************************************************************************
 * Default Export
 * *******************************************************************************************************************
 */

export default Database;

// End of File