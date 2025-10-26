/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          modules/WebServer.ts
 * Description:   Express.js web server implementation for IOE TypeScript applications
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.9.3+
 * Dependencies:  express: Web application framework
 *                cors: Cross-origin resource sharing
 *                helmet: Security middleware
 *                compression: Response compression
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Professional Express.js server with IOE standards
 *                - Only Project Leader has permission to modify this file
 *                - Implements security best practices and middleware
 *                - Provides health monitoring and graceful shutdown
 *                - Supports API versioning and error handling
 * *******************************************************************************************************************
 */

// Node.js built-in modules
import * as http from 'http';

// Third-party libraries
import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Local modules
import type { ServerConfig, ApiResponse, ServiceHealth } from '../types';
import type { LoggerManager } from '../utils/Logger';
import type { Database } from '../utils/Database';
import { 
  HTTP_STATUS,
  API_VERSIONED_PATH,
  APP_NAME,
  APP_VERSION,
} from '../constants';

/**
 * *******************************************************************************************************************
 * Type Definitions
 * *******************************************************************************************************************
 */

/** Server status */
type ServerStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

/** Route handler function */
type RouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

/** Middleware function */
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

/** Server metrics */
interface ServerMetrics {
  /** Total requests handled */
  totalRequests: number;
  
  /** Active connections */
  activeConnections: number;
  
  /** Requests per minute */
  requestsPerMinute: number;
  
  /** Average response time */
  averageResponseTime: number;
  
  /** Error count */
  errorCount: number;
  
  /** Start time */
  startTime: Date;
  
  /** Last request time */
  lastRequestTime?: Date;
}

/**
 * *******************************************************************************************************************
 * IOE Web Server Class
 * *******************************************************************************************************************
 */

/**
 * Professional Express.js web server for IOE TypeScript applications.
 * 
 * Features:
 * - Express.js with TypeScript integration
 * - Security middleware (Helmet, CORS)
 * - Request compression and optimization
 * - Health monitoring and metrics
 * - API versioning and routing
 * - Error handling and logging
 * - Graceful shutdown support
 * 
 * @example
 * ```typescript
 * const server = new WebServer(config, database, logger);
 * await server.initialize();
 * await server.start(3000);
 * ```
 */
export class WebServer {
  /** Express application instance */
  private readonly app: Express;
  
  /** HTTP server instance */
  private httpServer: http.Server | null = null;
  
  /** Server configuration */
  private readonly config: ServerConfig;
  
  /** Database instance */
  private readonly database: Database;
  
  /** LoggerManager instance */
  private readonly logger: LoggerManager;
  
  /** Server status */
  private status: ServerStatus = 'stopped';
  
  /** Server metrics */
  private metrics: ServerMetrics;

  /**
   * Creates a new IOE Web Server instance.
   * 
   * @param config - Server configuration
   * @param database - Database instance
   * @param logger - LoggerManager instance
   */
  constructor(config: ServerConfig, database: Database, logger: LoggerManager) {
    this.config = config;
    this.database = database;
    this.logger = logger;
    this.app = express();
    this.metrics = this.initializeMetrics();
    
    this.logger.info('Web server instance created', {
      port: config.port,
      host: config.host,
      environment: config.environment,
    });
  }

  /**
   * *******************************************************************************************************************
   * Server Lifecycle
   * *******************************************************************************************************************
   */

  /**
   * Initializes the web server with middleware and routes.
   */
  public async initialize(): Promise<void> {
    try {
      this.status = 'starting';
      this.logger.info('Initializing web server');

      // Setup middleware
      this.setupMiddleware();
      
      // Setup routes
      this.setupRoutes();
      
      // Setup error handling
      this.setupErrorHandling();

      this.logger.info('Web server initialized successfully');

    } catch (error) {
      this.status = 'error';
      this.logger.error('Web server initialization failed', { error });
      throw error;
    }
  }

  /**
   * Starts the HTTP server.
   * 
   * @param port - Server port
   */
  public async start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.httpServer = this.app.listen(port, this.config.host, () => {
          this.status = 'running';
          this.metrics.startTime = new Date();
          
          this.logger.info('Web server started successfully', {
            port,
            host: this.config.host,
            pid: process.pid,
          });
          
          resolve();
        });

        this.httpServer.on('error', (error) => {
          this.status = 'error';
          this.logger.error('Server error', { error });
          reject(error);
        });

        // Track connections
        this.httpServer.on('connection', () => {
          this.metrics.activeConnections++;
        });

        this.httpServer.on('close', () => {
          this.metrics.activeConnections--;
        });

      } catch (error) {
        this.status = 'error';
        this.logger.error('Failed to start web server', { error });
        reject(error);
      }
    });
  }

  /**
   * Stops the HTTP server gracefully.
   */
  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.httpServer) {
        this.status = 'stopped';
        resolve();
        return;
      }

      this.status = 'stopping';
      this.logger.info('Stopping web server');

      this.httpServer.close((error) => {
        if (error) {
          this.logger.error('Error stopping server', { error });
          reject(error);
        } else {
          this.status = 'stopped';
          this.httpServer = null;
          this.logger.info('Web server stopped successfully');
          resolve();
        }
      });
    });
  }

  /**
   * Gets current server status.
   * 
   * @returns Server status
   */
  public getStatus(): ServerStatus {
    return this.status;
  }

  /**
   * Checks if server is running.
   * 
   * @returns True if running
   */
  public isRunning(): boolean {
    return this.status === 'running';
  }

  /**
   * *******************************************************************************************************************
   * Health Monitoring
   * *******************************************************************************************************************
   */

  /**
   * Performs server health check.
   * 
   * @returns Health check result
   */
  public async healthCheck(): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      const isHealthy = this.isRunning() && this.database.isConnected();
      const responseTime = Date.now() - startTime;

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        responseTime,
        lastCheck: new Date().toISOString(),
        metadata: {
          serverStatus: this.status,
          uptime: this.getUptime(),
          metrics: this.getMetrics(),
        },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }

  /**
   * Gets server metrics.
   * 
   * @returns Server metrics
   */
  public getMetrics(): ServerMetrics {
    return { ...this.metrics };
  }

  /**
   * Gets server uptime in seconds.
   * 
   * @returns Uptime in seconds
   */
  public getUptime(): number {
    if (this.status !== 'running') {
      return 0;
    }
    return Math.floor((Date.now() - this.metrics.startTime.getTime()) / 1000);
  }

  /**
   * *******************************************************************************************************************
   * Private Methods
   * *******************************************************************************************************************
   */

  /**
   * Initializes server metrics.
   * 
   * @returns Initial metrics
   */
  private initializeMetrics(): ServerMetrics {
    return {
      totalRequests: 0,
      activeConnections: 0,
      requestsPerMinute: 0,
      averageResponseTime: 0,
      errorCount: 0,
      startTime: new Date(),
    };
  }

  /**
   * Sets up Express middleware.
   */
  private setupMiddleware(): void {
    // Security middleware
    if (this.config.security.helmet) {
      this.app.use(helmet());
    }

    // CORS middleware
    this.app.use(cors({
      origin: this.config.cors.origin,
      credentials: this.config.cors.credentials,
      methods: this.config.cors.methods,
      allowedHeaders: this.config.cors.allowedHeaders,
      exposedHeaders: this.config.cors.exposedHeaders,
      maxAge: this.config.cors.maxAge,
    }));

    // Compression middleware
    this.app.use(compression());

    // JSON parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging and metrics middleware
    this.app.use(this.createRequestMiddleware());

    this.logger.debug('Middleware setup completed');
  }

  /**
   * Sets up application routes.
   */
  private setupRoutes(): void {
    // Root route
    this.app.get('/', this.handleRootRoute.bind(this));
    
    // Health check route
    this.app.get('/health', this.handleHealthRoute.bind(this));
    
    // Server info route
    this.app.get('/info', this.handleInfoRoute.bind(this));
    
    // API routes
    this.app.use(API_VERSIONED_PATH, this.createApiRouter());

    this.logger.debug('Routes setup completed');
  }

  /**
   * Sets up error handling middleware.
   */
  private setupErrorHandling(): void {
    // 404 handler
    this.app.use('*', this.handleNotFound.bind(this));
    
    // Global error handler
    this.app.use(this.handleGlobalError.bind(this));

    this.logger.debug('Error handling setup completed');
  }

  /**
   * Creates request tracking middleware.
   * 
   * @returns Middleware function
   */
  private createRequestMiddleware(): MiddlewareFunction {
    return (req: Request, res: Response, next: NextFunction): void => {
      const startTime = Date.now();

      // Update metrics
      this.metrics.totalRequests++;
      this.metrics.lastRequestTime = new Date();

      // Log request
      this.logger.http('Incoming request', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      // Track response
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        // Update average response time
        const totalTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime;
        this.metrics.averageResponseTime = totalTime / this.metrics.totalRequests;

        this.logger.http('Request completed', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime,
        });
      });

      next();
    };
  }

  /**
   * Creates API router.
   * 
   * @returns Express router
   */
  private createApiRouter(): express.Router {
    const router = express.Router();

    // API status route
    router.get('/status', this.handleApiStatus.bind(this));
    
    // Example API route
    router.get('/users', this.handleGetUsers.bind(this));

    return router;
  }

  /**
   * *******************************************************************************************************************
   * Route Handlers
   * *******************************************************************************************************************
   */

  /**
   * Handles root route.
   */
  private handleRootRoute: RouteHandler = (_req, res) => {
    const response: ApiResponse<{ message: string; version: string }> = {
      success: true,
      data: {
        message: `Welcome to ${APP_NAME}`,
        version: APP_VERSION,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: APP_VERSION,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };

  /**
   * Handles health check route.
   */
  private handleHealthRoute: RouteHandler = async (_req, res) => {
    try {
      const health = await this.healthCheck();
      const statusCode = health.status === 'healthy' ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;

      res.status(statusCode).json(health);

    } catch (error) {
      this.metrics.errorCount++;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'unhealthy',
        error: 'Health check failed',
        lastCheck: new Date().toISOString(),
      });
    }
  };

  /**
   * Handles server info route.
   */
  private handleInfoRoute: RouteHandler = (_req, res) => {
    const info = {
      name: APP_NAME,
      version: APP_VERSION,
      environment: this.config.environment,
      uptime: this.getUptime(),
      status: this.status,
      metrics: this.getMetrics(),
      nodeVersion: process.version,
      platform: process.platform,
    };

    res.status(HTTP_STATUS.OK).json(info);
  };

  /**
   * Handles API status route.
   */
  private handleApiStatus: RouteHandler = async (_req, res) => {
    const response: ApiResponse<{ status: string; timestamp: string }> = {
      success: true,
      data: {
        status: 'API is running',
        timestamp: new Date().toISOString(),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: APP_VERSION,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };

  /**
   * Handles get users route (example).
   */
  private handleGetUsers: RouteHandler = async (_req, res) => {
    try {
      // Example database query
      const result = await this.database.query('SELECT * FROM users LIMIT 10');

      const response: ApiResponse<unknown[]> = {
        success: result.success,
        data: result.data || [],
        metadata: {
          timestamp: new Date().toISOString(),
          version: APP_VERSION,
          context: {
            count: result.data?.length || 0,
          },
        },
      };

      res.status(HTTP_STATUS.OK).json(response);

    } catch (error) {
      this.metrics.errorCount++;
      this.logger.error('Error fetching users', { error });

      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch users',
        metadata: {
          timestamp: new Date().toISOString(),
          version: APP_VERSION,
        },
      };

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
    }
  };

  /**
   * Handles 404 not found.
   */
  private handleNotFound: RouteHandler = (req, res) => {
    const response: ApiResponse = {
      success: false,
      error: `Route not found: ${req.method} ${req.url}`,
      metadata: {
        timestamp: new Date().toISOString(),
        version: APP_VERSION,
      },
    };

    res.status(HTTP_STATUS.NOT_FOUND).json(response);
  };

  /**
   * Handles global errors.
   */
  private handleGlobalError: express.ErrorRequestHandler = (error, _req, res, _next) => {
    this.metrics.errorCount++;
    this.logger.error('Unhandled error', { error });

    const response: ApiResponse = {
      success: false,
      error: this.config.environment === 'production' 
        ? 'Internal server error' 
        : error.message,
      metadata: {
        timestamp: new Date().toISOString(),
        version: APP_VERSION,
      },
    };

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  };
}

/**
 * *******************************************************************************************************************
 * Default Export
 * *******************************************************************************************************************
 */

export default WebServer;

// End of File