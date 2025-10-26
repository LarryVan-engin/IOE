# IOE INNOVATION Team - Official TypeScript/Node.js Coding Standards

## Tổng quan
Đây là repository chính thức về tiêu chuẩn lập trình TypeScript/Node.js của IOE INNOVATION Team, được thiết kế để đảm bảo tính nhất quán, chất lượng và khả năng bảo trì của mã nguồn trong các dự án web applications, API servers, microservices và backend development.

## Cấu trúc dự án

```
IOE_Coding_Standard_TSNode/
├── README.md                    # Tài liệu chính
├── package.json                 # Node.js project configuration
├── tsconfig.json                # TypeScript configuration
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .gitignore                   # Git ignore rules
├── jest.config.js               # Jest testing configuration
├── main.ts                      # Ứng dụng chính (Project Leader only)
├── src/                         # Source code TypeScript
│   ├── types/                   # Type definitions
│   │   ├── index.ts            # Main type exports
│   │   ├── ioe-common.types.ts # Common IOE types
│   │   ├── api.types.ts        # API-related types
│   │   └── database.types.ts   # Database-related types
│   ├── modules/                 # Business logic modules
│   │   ├── index.ts            # Module exports
│   │   ├── IOEWebServer.ts     # Web server module
│   │   ├── IOEDatabase.ts      # Database operations module
│   │   ├── IOEApiClient.ts     # API client module
│   │   └── IOEAuthManager.ts   # Authentication module
│   ├── utils/                   # Utility functions and classes
│   │   ├── index.ts            # Utils exports
│   │   ├── IOELogger.ts        # Logging utilities
│   │   ├── IOEConfig.ts        # Configuration management
│   │   ├── IOEValidator.ts     # Data validation utilities
│   │   └── IOEHelpers.ts       # Helper functions
│   └── constants/               # Application constants
│       ├── index.ts            # Constants exports
│       ├── api.constants.ts    # API constants
│       ├── error.constants.ts  # Error codes and messages
│       └── config.constants.ts # Configuration constants
├── tests/                       # Test suite
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── e2e/                    # End-to-end tests
│   └── mocks/                  # Test mocks and fixtures
├── examples/                    # Các ví dụ thực tế
│   ├── express-api/            # Express.js API server example
│   ├── nestjs-microservice/    # NestJS microservice example
│   ├── websocket-server/       # WebSocket server example
│   └── graphql-api/            # GraphQL API example
├── templates/                   # Templates cho development
│   ├── template.class.ts       # Class template
│   ├── template.interface.ts   # Interface template
│   ├── template.module.ts      # Module template
│   └── project-template/       # Template cho dự án mới
├── docs/                        # Tài liệu chi tiết
│   ├── CODING_GUIDELINES.md    # Hướng dẫn coding standards
│   ├── FILE_STRUCTURE.md       # Cấu trúc file và project
│   ├── TYPESCRIPT_GUIDE.md     # Hướng dẫn TypeScript best practices
│   ├── NODE_GUIDE.md           # Hướng dẫn Node.js development
│   └── API_DOCUMENTATION.md   # API documentation standards
├── config/                      # Configuration files
│   ├── development.json        # Development configuration
│   ├── production.json         # Production configuration
│   ├── test.json              # Test configuration
│   └── database.json          # Database configuration
└── tools/                       # Development tools
    ├── README.md              # Tools documentation
    ├── project-generator.js   # Project structure generator
    ├── class-generator.js     # IOE class generator
    ├── interface-generator.js # TypeScript interface generator
    ├── lint-checker.js        # IOE standards compliance checker
    └── test-generator.js      # Comprehensive test suite generator
```

## Tính năng chính

### 1. TypeScript Coding Standards được áp dụng
- **General Information Header**: Mỗi file có header thông tin đầy đủ theo format IOE
- **Strong Type Safety**: Sử dụng TypeScript với strict mode
- **Modular Architecture**: Chia code thành modules, types, utils rõ ràng
- **Consistent Naming**: Convention đồng nhất với prefix IOE cho classes
- **Professional Documentation**: JSDoc comments chuẩn cho functions và classes
- **Error Handling**: Proper error handling với custom exception classes
- **Async/Await Pattern**: Modern JavaScript async patterns

### 2. Node.js Development Environment
- **Multi-environment Config**: Development, production, test configurations
- **Package Management**: npm/yarn với proper dependency management
- **Build System**: TypeScript compilation với optimization
- **Code Quality Tools**: ESLint, Prettier, Jest integration
- **Hot Reload**: Development server với auto-restart

### 3. Development Tools Suite
- **Project Generator**: Tự động tạo project structure theo chuẩn IOE
- **Class Generator**: Sinh class TypeScript với IOE naming conventions
- **Interface Generator**: Tạo interface với type safety đầy đủ
- **Lint Checker**: Kiểm tra compliance với IOE standards
- **Test Generator**: Sinh comprehensive test suites (unit, integration, performance)

### 4. Application Types Support
- **Web Applications**: Express.js, NestJS, Fastify
- **API Servers**: RESTful APIs, GraphQL, WebSocket
- **Microservices**: Scalable microservice architecture
- **Database Integration**: MongoDB, PostgreSQL, Redis support

## Hướng dẫn sử dụng

### Yêu cầu hệ thống
- **Node.js**: 18.0+ (Recommended 24.0+)
- **npm**: 9.0+ hoặc yarn 1.22+
- **TypeScript**: 5.0+ (Global installation recommended)
- **Code Editor**: VS Code với TypeScript extensions

### Quick Start
1. **Clone/Copy repository**:
   ```bash
   cd your_workspace
   cp -r IOE_Coding_Standard_TSNode/ your_project_name/
   ```

2. **Setup project**:
   ```bash
   cd your_project_name/
   
   # Activate nodejs conda environment
   conda activate nodejs
   
   # Install dependencies
   npm install
   ```

3. **Build and run**:
   ```bash
   # Build TypeScript
   npm run build
   
   # Run development server
   npm run dev
   
   # Run production
   npm start
   ```

4. **Code quality checks**:
   ```bash
   # Type checking
   npm run type-check
   
   # Linting
   npm run lint
   
   # Formatting
   npm run format
   
   # Run tests
   npm test
   ```

### Available npm Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run test suite với Jest
- `npm run lint` - Run ESLint checking
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code với Prettier
- `npm run type-check` - TypeScript type checking
- `npm run clean` - Clean build artifacts

## Environment Setup với Conda

Dự án này sử dụng conda environment `nodejs` để quản lý Node.js và các dependencies:

```bash
# Activate environment
conda activate nodejs

# Verify installations
node --version    # v24.10.0
npm --version     # 11.6.1
tsc --version     # Version 5.9.3

# Install project dependencies
npm install

# Start development
npm run dev
```

## Sử dụng Development Tools

### 🚀 Tạo dự án mới
```bash
# Sử dụng project generator
node tools/project-generator.js

# Chọn loại dự án: API Server, Web App, CLI Tool, hoặc Library
# Tool sẽ tự động tạo:
# - package.json với dependencies phù hợp
# - tsconfig.json với strict configuration
# - ESLint và Prettier configuration
# - Project structure theo chuẩn IOE
# - README.md với hướng dẫn chi tiết
```

### 🏗️ Tạo class mới
```bash
# Sử dụng class generator
node tools/class-generator.js

# Nhập tên class (không cần prefix IOE)
# Chọn loại class: Service, Utility, Model, Controller, Repository, Middleware
# Tool sẽ tự động:
# - Tạo class với IOE naming conventions
# - Sinh JSDoc documentation đầy đủ
# - Tạo file test tương ứng
# - Include interface definitions khi cần
```

### 🔷 Tạo interface mới
```bash
# Sử dụng interface generator
node tools/interface-generator.js

# Nhập tên interface (không cần prefix I)
# Chọn loại: Config, Model, Service, API, Repository, DTO
# Định nghĩa properties và methods
# Tool sẽ tự động tạo interface với type safety đầy đủ
```

### 🧪 Tạo test suite
```bash
# Sử dụng test generator
node tools/test-generator.js

# Chọn loại test: Unit, Integration, E2E, Performance, Security
# Nhập đường dẫn source file để analyze tự động
# Tool sẽ sinh comprehensive test cases
```

### 🔍 Kiểm tra code quality
```bash
# Sử dụng lint checker
node tools/lint-checker.js [project-path]

# Tool sẽ kiểm tra:
# - IOE naming conventions compliance
# - File headers và documentation
# - Project structure standards
# - Code quality metrics
# - Đưa ra suggestions cho improvements
```

## Guidelines quan trọng

### 1. File Header Requirements
Mọi file .ts phải có General Information header bao gồm:
- Project name và description
- File name và mô tả chức năng
- Author information (Project Leader cho main.ts)
- Creation date và last update
- Version/revision information
- Copyright và license (nếu có)

### 2. TypeScript Best Practices
- Sử dụng strict TypeScript configuration
- Define interfaces cho tất cả data structures
- Sử dụng enums cho constants có giới hạn
- Generic types cho reusable components
- Proper async/await error handling
- Export/import với clear module structure

### 3. Naming Conventions
- **Classes**: PascalCase với IOE prefix (ví dụ: `IOEWebServer`, `IOEDatabase`)
- **Interfaces**: PascalCase (ví dụ: `UserData`, `ApiResponse`)
- **Functions**: camelCase (ví dụ: `processData`, `validateInput`)
- **Variables**: camelCase (ví dụ: `userData`, `configOptions`)
- **Constants**: UPPER_SNAKE_CASE (ví dụ: `MAX_RETRY_COUNT`, `API_BASE_URL`)
- **Files**: kebab-case hoặc PascalCase cho classes

## Application Examples

### 1. Express.js API Server
```typescript
// src/modules/IOEWebServer.ts
import express from 'express';
import { IOELogger } from '../utils/IOELogger';

export class IOEWebServer {
    private app: express.Application;
    private logger: IOELogger;
    
    constructor(config: ServerConfig) {
        this.app = express();
        this.logger = new IOELogger('IOEWebServer');
        this.setupMiddleware();
        this.setupRoutes();
    }
    
    public async start(port: number): Promise<void> {
        // Implementation
    }
}
```

### 2. Database Module
```typescript
// src/modules/IOEDatabase.ts
import { DatabaseConfig, QueryResult } from '../types';

export class IOEDatabase {
    private connectionPool: any;
    
    public async connect(config: DatabaseConfig): Promise<void> {
        // Implementation
    }
    
    public async query<T>(sql: string, params?: any[]): Promise<QueryResult<T>> {
        // Implementation
    }
}
```

### 3. Type Definitions
```typescript
// src/types/api.types.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
```

## Code Quality và Testing

### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Jest Testing
```typescript
// tests/unit/IOEWebServer.test.ts
describe('IOEWebServer', () => {
    test('should initialize correctly', async () => {
        const server = new IOEWebServer(mockConfig);
        expect(server).toBeDefined();
    });
});
```

## Tài liệu tham khảo

- [TypeScript Coding Guidelines](docs/CODING_GUIDELINES.md) - Chi tiết về coding standards
- [File Structure Guide](docs/FILE_STRUCTURE.md) - Hướng dẫn tổ chức files
- [TypeScript Guide](docs/TYPESCRIPT_GUIDE.md) - TypeScript best practices
- [Node.js Guide](docs/NODE_GUIDE.md) - Node.js development patterns
- [API Documentation](docs/API_DOCUMENTATION.md) - API documentation standards
- [Development Tools Guide](tools/README.md) - Hướng dẫn sử dụng development tools

## Liên kết hữu ích
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## Đóng góp

Để đóng góp vào coding standards:
1. Tạo branch mới từ `develop`
2. Implement changes theo standards hiện tại
3. Test với `npm test` và `npm run lint`
4. Tạo pull request với mô tả chi tiết

## Liên hệ

**IOE INNOVATION Team**
- Email: [team@ioe.innovation](mailto:team@ioe.innovation)
- Repository: [IOE TypeScript Coding Standards](https://github.com/ioe-innovation/typescript-coding-standards)

---
*Last Updated: 2025-10-23*
*Version: 1.0.0*
*Node.js Version: 24.10.0+*
*TypeScript Version: 5.9.3+*