# IOE TypeScript/Node.js Project Structure Guide

## 1. Overview

Tài liệu này mô tả cấu trúc thư mục và tổ chức files trong các dự án TypeScript/Node.js theo tiêu chuẩn IOE INNOVATION Team. Cấu trúc này được thiết kế để đảm bảo scalability, maintainability và team collaboration hiệu quả.

## 2. Root Directory Structure

```
IOE_Project_Name/
├── src/                         # Source code TypeScript
├── dist/                        # Compiled JavaScript (generated)
├── tests/                       # Test suite
├── docs/                        # Documentation
├── examples/                    # Example implementations
├── templates/                   # Code templates
├── tools/                       # Development tools
├── config/                      # Configuration files
├── scripts/                     # Build and deployment scripts
├── .github/                     # GitHub workflows (if using GitHub)
├── package.json                 # Node.js project configuration
├── tsconfig.json                # TypeScript configuration
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .gitignore                   # Git ignore rules
├── jest.config.js               # Jest testing configuration
├── main.ts                      # Main application entry point
└── README.md                    # Project documentation
```

## 3. Source Code Structure (`src/`)

### 3.1 Main Source Directory
```
src/
├── main.ts                      # Application entry point (Project Leader only)
├── types/                       # Type definitions
│   ├── index.ts                # Main type exports
│   ├── common.types.ts     # Common types
│   ├── api.types.ts            # API-related types
│   ├── database.types.ts       # Database-related types
│   ├── config.types.ts         # Configuration types
│   └── error.types.ts          # Error-related types
├── modules/                     # Business logic modules
│   ├── index.ts                # Module exports
│   ├── WebServer.ts         # Web server implementation
│   ├── Database.ts          # Database operations
│   ├── ApiClient.ts         # API client module
│   ├── AuthManager.ts       # Authentication module
│   └── FileManager.ts       # File operations module
├── utils/                       # Utility functions and classes
│   ├── index.ts                # Utils exports
│   ├── Logger.ts            # Logging utilities
│   ├── Config.ts            # Configuration management
│   ├── Validator.ts         # Data validation utilities
│   ├── Helpers.ts           # Helper functions
│   └── Crypto.ts            # Cryptography utilities
├── constants/                   # Application constants
│   ├── index.ts                # Constants exports
│   ├── api.constants.ts        # API constants
│   ├── error.constants.ts      # Error codes and messages
│   ├── config.constants.ts     # Configuration constants
│   └── validation.constants.ts # Validation rules
├── middleware/                  # Express/HTTP middleware (if applicable)
│   ├── index.ts                # Middleware exports
│   ├── auth.middleware.ts      # Authentication middleware
│   ├── error.middleware.ts     # Error handling middleware
│   ├── logging.middleware.ts   # Request logging middleware
│   └── validation.middleware.ts # Input validation middleware
└── services/                    # Service layer (optional)
    ├── index.ts                # Service exports
    ├── user.service.ts         # User-related business logic
    ├── auth.service.ts         # Authentication services
    └── notification.service.ts # Notification services
```

### 3.2 File Naming Conventions

#### 3.2.1 TypeScript Files
- **Classes**: `PascalCase.ts` (e.g., `WebServer.ts`, `Database.ts`)
- **Interfaces/Types**: `kebab-case.types.ts` (e.g., `api.types.ts`, `user-data.types.ts`)
- **Utilities**: `kebab-case.ts` hoặc `PascalCase.ts` (e.g., `api-helpers.ts`, `Logger.ts`)
- **Constants**: `kebab-case.constants.ts` (e.g., `api.constants.ts`)
- **Services**: `kebab-case.service.ts` (e.g., `user.service.ts`)
- **Middleware**: `kebab-case.middleware.ts` (e.g., `auth.middleware.ts`)

#### 3.2.2 Index Files
Mỗi directory phải có `index.ts` để export các modules chính:

```typescript
// src/types/index.ts
export type { UserData, ApiResponse } from './api.types';
export type { DatabaseConfig, ServerConfig } from './config.types';
export type { Error, ValidationError } from './error.types';

// src/modules/index.ts
export { WebServer } from './WebServer';
export { Database } from './Database';
export { ApiClient } from './ApiClient';

// src/utils/index.ts
export { Logger } from './Logger';
export { Config } from './Config';
export { Validator } from './Validator';
```

## 4. Test Structure (`tests/`)

### 4.1 Test Directory Organization
```
tests/
├── unit/                        # Unit tests
│   ├── modules/                # Tests for modules
│   │   ├── WebServer.test.ts
│   │   ├── Database.test.ts
│   │   └── ApiClient.test.ts
│   ├── utils/                  # Tests for utilities
│   │   ├── Logger.test.ts
│   │   ├── Config.test.ts
│   │   └── Validator.test.ts
│   └── services/               # Tests for services
│       ├── user.service.test.ts
│       └── auth.service.test.ts
├── integration/                 # Integration tests
│   ├── api/                    # API integration tests
│   │   ├── user-endpoints.test.ts
│   │   └── auth-endpoints.test.ts
│   ├── database/               # Database integration tests
│   │   ├── user-operations.test.ts
│   │   └── connection.test.ts
│   └── services/               # Service integration tests
│       └── user-auth-flow.test.ts
├── e2e/                        # End-to-end tests
│   ├── user-registration.test.ts
│   ├── auth-flow.test.ts
│   └── api-workflows.test.ts
├── mocks/                      # Test mocks and fixtures
│   ├── data/                   # Mock data
│   │   ├── users.mock.ts
│   │   └── api-responses.mock.ts
│   ├── services/               # Mock services
│   │   ├── database.mock.ts
│   │   └── api-client.mock.ts
│   └── fixtures/               # Test fixtures
│       ├── config.fixture.ts
│       └── server.fixture.ts
├── helpers/                    # Test helper utilities
│   ├── test-setup.ts          # Test environment setup
│   ├── mock-factory.ts        # Mock object factory
│   └── assertion-helpers.ts   # Custom assertions
└── jest-e2e.json              # E2E test configuration
```

### 4.2 Test File Naming
- **Unit tests**: `[ModuleName].test.ts`
- **Integration tests**: `[feature-name].test.ts`
- **E2E tests**: `[workflow-name].test.ts`
- **Mock files**: `[module-name].mock.ts`
- **Fixtures**: `[name].fixture.ts`

## 5. Configuration Structure (`config/`)

### 5.1 Configuration Directory
```
config/
├── development.json             # Development environment config
├── production.json              # Production environment config
├── test.json                   # Test environment config
├── staging.json                # Staging environment config
├── database.json               # Database configurations
├── api.json                    # API configurations
├── logging.json                # Logging configurations
├── security.json               # Security configurations
└── secrets/                    # Secret configurations (gitignored)
    ├── .env.development        # Development secrets
    ├── .env.production         # Production secrets
    └── .env.test               # Test secrets
```

### 5.2 Configuration File Format
```json
{
  "server": {
    "port": 3000,
    "host": "localhost",
    "environment": "development"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "database": "app_dev",
    "pool": {
      "min": 2,
      "max": 10,
      "timeout": 5000
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "enableConsole": true,
    "enableFile": true,
    "filename": "logs/app.log"
  },
  "api": {
    "baseUrl": "https://api.example.com",
    "timeout": 5000,
    "retries": 3
  }
}
```

## 6. Documentation Structure (`docs/`)

### 6.1 Documentation Directory
```
docs/
├── CODING_GUIDELINES.md         # Coding standards và guidelines
├── FILE_STRUCTURE.md           # File structure guide (this file)
├── TYPESCRIPT_GUIDE.md         # TypeScript best practices
├── NODE_GUIDE.md               # Node.js development guide
├── API_DOCUMENTATION.md        # API documentation standards
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
├── TROUBLESHOOTING.md          # Common issues và solutions
├── CONTRIBUTING.md             # Contribution guidelines
├── CHANGELOG.md                # Project changelog
├── api/                        # Generated API documentation
│   ├── index.html              # API docs homepage
│   └── modules/                # Module-specific docs
└── diagrams/                   # Architecture diagrams
    ├── system-architecture.png
    ├── database-schema.png
    └── api-flow.png
```

## 7. Examples Structure (`examples/`)

### 7.1 Example Projects
```
examples/
├── express-api/                 # Express.js API server example
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── ...
├── nestjs-microservice/        # NestJS microservice example
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── ...
├── websocket-server/           # WebSocket server example
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── ...
├── graphql-api/                # GraphQL API example
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── ...
└── cli-tool/                   # CLI tool example
    ├── src/
    ├── package.json
    ├── README.md
    └── ...
```

## 8. Templates Structure (`templates/`)

### 8.1 Code Templates
```
templates/
├── template.class.ts           # Class template
├── template.interface.ts       # Interface template
├── template.module.ts          # Module template
├── template.service.ts         # Service template
├── template.middleware.ts      # Middleware template
├── template.test.ts            # Test template
├── project-template/           # Complete project template
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
└── generators/                 # Template generators
    ├── class-generator.ts
    ├── interface-generator.ts
    └── module-generator.ts
```

## 9. Tools Structure (`tools/`)

### 9.1 Development Tools
```
tools/
├── lint-check.ts               # ESLint checking tool
├── format-check.ts             # Code formatting tool
├── type-check.ts               # TypeScript type checking
├── project-generator.ts        # Project generator tool
├── build-helper.ts             # Build automation tool
├── migration-helper.ts         # Database migration tool
├── test-runner.ts              # Custom test runner
├── deploy-helper.ts            # Deployment automation
└── generators/                 # Code generators
    ├── class-generator.ts
    ├── interface-generator.ts
    ├── module-generator.ts
    └── project-generator.ts
```

## 10. Build và Deployment Structure

### 10.1 Generated Files (`dist/`)
```
dist/                           # Generated by TypeScript compiler
├── main.js                     # Compiled main application
├── main.js.map                 # Source map for main
├── types/                      # Compiled type definitions
├── modules/                    # Compiled modules
├── utils/                      # Compiled utilities
└── ...                         # Other compiled files
```

### 10.2 Scripts Directory
```
scripts/
├── build.sh                    # Build script
├── deploy.sh                   # Deployment script
├── test.sh                     # Test execution script
├── lint.sh                     # Linting script
├── clean.sh                    # Cleanup script
└── setup.sh                    # Initial setup script
```

## 11. Environment-Specific Considerations

### 11.1 Development Environment
- Sử dụng `ts-node-dev` cho hot reloading
- Enable source maps cho debugging
- Detailed logging và error reporting
- Mock services cho external dependencies

### 11.2 Production Environment
- Compiled JavaScript trong `dist/`
- Optimized build với minification
- Production logging configuration
- Health check endpoints
- Proper error handling và monitoring

### 11.3 Test Environment
- Isolated test database
- Mock external services
- Coverage reporting
- Parallel test execution

## 12. Import Path Guidelines

### 12.1 Absolute Imports
Sử dụng absolute imports với path mapping:

```typescript
// Good: Absolute imports
import { WebServer } from '@/modules/WebServer';
import { UserData } from '@/types/api.types';
import { Logger } from '@/utils/Logger';

// Avoid: Relative imports cho cross-module dependencies
import { WebServer } from '../modules/WebServer';
import { UserData } from '../../types/api.types';
```

### 12.2 Import Organization
```typescript
// 1. Node.js built-in modules
import * as fs from 'fs';
import * as path from 'path';

// 2. Third-party libraries
import express from 'express';
import winston from 'winston';

// 3. Local types (first)
import type { UserData, ApiResponse } from '@/types';

// 4. Local modules
import { WebServer } from '@/modules/WebServer';
import { Logger } from '@/utils/Logger';
```

## 13. File Size và Organization Guidelines

### 13.1 File Size Limits
- **Classes**: Tối đa 500 lines
- **Modules**: Tối đa 300 lines
- **Utilities**: Tối đa 200 lines
- **Types**: Tối đa 100 lines per file
- **Constants**: Tối đa 50 lines per file

### 13.2 Breaking Down Large Files
Khi files quá lớn, chia thành:
- Sub-modules trong thư mục riêng
- Separate concerns into different files
- Extract common utilities
- Create separate type definition files

### 13.3 Directory Organization Rules
- Maximum 15 files per directory
- Maximum 5 levels deep
- Group related functionality together
- Use clear, descriptive directory names

---

**Prepared by IOE INNOVATION Team**  
*Version: 1.0.0*  
*Last Updated: 2025-10-23*