#!/usr/bin/env node

/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          tools/class-generator.js
 * Description:   Class generator for IOE TypeScript applications following strict naming conventions
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * Dependencies:  fs, path, readline (Node.js built-in)
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Command-line tool for generating IOE TypeScript classes
 *                - Only Project Leader has permission to modify this file
 *                - Generates classes with IOE naming conventions (IOE prefix)
 *                - Creates comprehensive JSDoc documentation
 *                - Includes unit test templates
 *                - Supports different class types (Service, Utility, Model, Controller)
 * *******************************************************************************************************************
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Class templates
const CLASS_TYPES = {
  service: {
    name: 'Service Class',
    description: 'Business logic service with dependency injection',
    directory: 'src/modules',
    suffix: 'Service',
    interface: true,
    methods: ['initialize', 'execute', 'cleanup']
  },
  utility: {
    name: 'Utility Class',
    description: 'Static utility functions and helpers',
    directory: 'src/utils',
    suffix: 'Utils',
    interface: false,
    methods: ['validateInput', 'formatOutput', 'processData']
  },
  model: {
    name: 'Data Model',
    description: 'Data model with validation and serialization',
    directory: 'src/models',
    suffix: 'Model',
    interface: true,
    methods: ['validate', 'serialize', 'deserialize']
  },
  controller: {
    name: 'Controller Class',
    description: 'HTTP request controller for API endpoints',
    directory: 'src/controllers',
    suffix: 'Controller',
    interface: true,
    methods: ['handleRequest', 'validateInput', 'sendResponse']
  },
  repository: {
    name: 'Repository Class',
    description: 'Data access layer with CRUD operations',
    directory: 'src/repositories',
    suffix: 'Repository',
    interface: true,
    methods: ['create', 'findById', 'update', 'delete']
  },
  middleware: {
    name: 'Middleware Class',
    description: 'Express.js middleware for request processing',
    directory: 'src/middleware',
    suffix: 'Middleware',
    interface: true,
    methods: ['process', 'validate', 'transform']
  }
};

class IOEClassGenerator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Print colored text
  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Ask user input
  async ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  // Validate class name (must be PascalCase without IOE prefix)
  validateClassName(name) {
    const regex = /^[A-Z][a-zA-Z0-9]*$/;
    return regex.test(name) && name.length >= 2 && name.length <= 50 && !name.startsWith('IOE');
  }

  // Create directory if it doesn't exist
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Generate class file content
  generateClassContent(className, classType, description, methods) {
    const template = CLASS_TYPES[classType];
    const fullClassName = `IOE${className}${template.suffix}`;
    const interfaceName = template.interface ? `I${fullClassName}` : null;
    const date = new Date().toISOString().split('T')[0];

    let content = `/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Project
 * File:          ${template.directory.replace('src/', '')}/${fullClassName}.ts
 * Description:   ${description || template.description}
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       ${date}
 * Last Update:   ${date}
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.4.5+
 * Dependencies:  Based on implementation requirements
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         ${template.description}
 *                - Only Project Leader has permission to modify this file
 *                - Follows IOE naming conventions (IOE prefix for classes)
 *                - Implements comprehensive error handling
 *                - Includes detailed logging and monitoring
 * *******************************************************************************************************************
 */

import { IOELogger } from '@/utils/IOELogger';

`;

    // Add interface if needed
    if (interfaceName) {
      content += `/**
 * Interface defining the contract for ${fullClassName}.
 * 
 * @interface ${interfaceName}
 * @description Defines the public API for ${className.toLowerCase()} operations
 */
export interface ${interfaceName} {`;

      methods.forEach(method => {
        content += `
  /**
   * ${this.generateMethodDescription(method, classType)}.
   * 
   * @param {unknown} input - Input parameters for the operation
   * @returns {Promise<unknown>} Result of the operation
   * @throws {Error} When operation fails
   */
  ${method}(input?: unknown): Promise<unknown>;`;
      });

      content += `
}

`;
    }

    // Add class definition
    content += `/**
 * ${template.description}.
 * 
 * @class ${fullClassName}
 * @description ${description || `Handles ${className.toLowerCase()} operations following IOE standards`}
 * @version 1.0.0
 * @author IOE Development Team
 * 
 * @example
 * \`\`\`typescript
 * const ${className.toLowerCase()}${template.suffix} = new ${fullClassName}();
 * await ${className.toLowerCase()}${template.suffix}.initialize();
 * const result = await ${className.toLowerCase()}${template.suffix}.${methods[0] || 'execute'}();
 * \`\`\`
 */`;

    if (interfaceName) {
      content += `
export class ${fullClassName} implements ${interfaceName} {`;
    } else {
      content += `
export class ${fullClassName} {`;
    }

    // Add private properties
    content += `
  private static readonly CLASS_NAME = '${fullClassName}';
  private readonly logger: IOELogger;
  private isInitialized: boolean = false;

  /**
   * Creates an instance of ${fullClassName}.
   * 
   * @constructor
   * @param {IOELogger} [customLogger] - Optional custom logger instance
   */
  constructor(customLogger?: IOELogger) {
    this.logger = customLogger || new IOELogger(${fullClassName}.CLASS_NAME);
    this.logger.info('${fullClassName} instance created');
  }`;

    // Add methods
    methods.forEach(method => {
      content += this.generateMethodImplementation(method, classType, fullClassName);
    });

    // Add utility methods
    content += `

  /**
   * Gets the current initialization status.
   * 
   * @returns {boolean} True if the ${className.toLowerCase()} is initialized
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Gets the class name for debugging purposes.
   * 
   * @returns {string} The class name
   */
  public getClassName(): string {
    return ${fullClassName}.CLASS_NAME;
  }

  /**
   * Gets runtime information about this instance.
   * 
   * @returns {object} Runtime information
   */
  public getInfo(): {
    className: string;
    initialized: boolean;
    timestamp: string;
  } {
    return {
      className: ${fullClassName}.CLASS_NAME,
      initialized: this.isInitialized,
      timestamp: new Date().toISOString(),
    };
  }
}`;

    return content;
  }

  // Generate method description based on method name and class type
  generateMethodDescription(methodName, classType) {
    const descriptions = {
      initialize: 'Initializes the service and sets up required resources',
      execute: 'Executes the main business logic operation',
      cleanup: 'Cleans up resources and performs necessary shutdown tasks',
      validateInput: 'Validates input parameters according to business rules',
      formatOutput: 'Formats output data for consistent presentation',
      processData: 'Processes data according to business requirements',
      validate: 'Validates the model data against defined schema',
      serialize: 'Serializes the model to a portable format',
      deserialize: 'Deserializes data to create a model instance',
      handleRequest: 'Handles incoming HTTP request and coordinates response',
      sendResponse: 'Sends formatted response back to the client',
      create: 'Creates a new record in the data store',
      findById: 'Finds a record by its unique identifier',
      update: 'Updates an existing record with new data',
      delete: 'Deletes a record from the data store',
      process: 'Processes the middleware logic for the request',
      transform: 'Transforms request or response data'
    };

    return descriptions[methodName] || `Performs ${methodName} operation`;
  }

  // Generate method implementation
  generateMethodImplementation(methodName, classType, className) {
    const template = `

  /**
   * ${this.generateMethodDescription(methodName, classType)}.
   * 
   * @param {unknown} [input] - Input parameters for the operation
   * @returns {Promise<unknown>} Result of the operation
   * @throws {Error} When operation fails or validation errors occur
   * 
   * @example
   * \`\`\`typescript
   * const result = await instance.${methodName}(inputData);
   * console.log('Operation result:', result);
   * \`\`\`
   */
  public async ${methodName}(input?: unknown): Promise<unknown> {
    const methodName = '${methodName}';
    this.logger.info(\`Executing \${methodName}\`, { input });

    try {
      // TODO: Implement ${methodName} logic here
      ${this.generateMethodBody(methodName, classType)}

      this.logger.info(\`\${methodName} completed successfully\`);
      return { success: true, message: '${methodName} executed successfully' };

    } catch (error) {
      this.logger.error(\`\${methodName} failed\`, { error: error instanceof Error ? error.message : error });
      throw new Error(\`\${className}.\${methodName} failed: \${error instanceof Error ? error.message : 'Unknown error'}\`);
    }
  }`;

    return template;
  }

  // Generate method body based on method name and class type
  generateMethodBody(methodName, classType) {
    const bodies = {
      initialize: `      // Validate configuration
      if (this.isInitialized) {
        throw new Error('${classType} is already initialized');
      }

      // Setup resources, connections, etc.
      // await this.setupResources();
      
      this.isInitialized = true;`,

      execute: `      // Validate initialization
      if (!this.isInitialized) {
        throw new Error('${classType} must be initialized before execution');
      }

      // Validate input
      if (input === null || input === undefined) {
        throw new Error('Input is required for execution');
      }

      // Perform business logic
      // const result = await this.processBusinessLogic(input);
      
      // Return processed result
      // return result;`,

      cleanup: `      // Perform cleanup operations
      if (!this.isInitialized) {
        this.logger.warn('Cleanup called on uninitialized instance');
        return;
      }

      // Close connections, release resources, etc.
      // await this.closeConnections();
      
      this.isInitialized = false;`,

      validateInput: `      // Check if input exists
      if (!input) {
        throw new Error('Input is required for validation');
      }

      // Perform validation logic
      // const isValid = await this.performValidation(input);
      
      // Return validation result
      // return { isValid, errors: [] };`,

      create: `      // Validate input data
      if (!input) {
        throw new Error('Data is required for creation');
      }

      // Create new record
      // const createdRecord = await this.dataStore.create(input);
      
      // Return created record
      // return createdRecord;`,

      handleRequest: `      // Extract request data
      // const requestData = this.extractRequestData(input);
      
      // Validate request
      // await this.validateRequest(requestData);
      
      // Process request
      // const result = await this.processRequest(requestData);
      
      // Return response
      // return result;`
    };

    return bodies[methodName] || `      // Implement ${methodName} logic here
      // Add your business logic implementation
      
      // Return appropriate result`;
  }

  // Generate test file content
  generateTestContent(className, classType, methods) {
    const template = CLASS_TYPES[classType];
    const fullClassName = `IOE${className}${template.suffix}`;
    const date = new Date().toISOString().split('T')[0];

    return `/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Project
 * File:          tests/${fullClassName}.test.ts
 * Description:   Unit tests for ${fullClassName}
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       ${date}
 * Last Update:   ${date}
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * TypeScript:    5.4.5+
 * Dependencies:  Jest testing framework
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Comprehensive unit tests for ${fullClassName}
 *                - Only Project Leader has permission to modify this file
 *                - Tests all public methods and error scenarios
 *                - Follows IOE testing standards
 *                - Includes performance and integration tests
 * *******************************************************************************************************************
 */

import { ${fullClassName} } from '@/${template.directory.replace('src/', '')}/${fullClassName}';
import { IOELogger } from '@/utils/IOELogger';

// Mock logger to avoid console output during tests
jest.mock('@/utils/IOELogger');

describe('${fullClassName}', () => {
  let ${className.toLowerCase()}${template.suffix}: ${fullClassName};
  let mockLogger: jest.Mocked<IOELogger>;

  beforeEach(() => {
    mockLogger = new IOELogger('test') as jest.Mocked<IOELogger>;
    ${className.toLowerCase()}${template.suffix} = new ${fullClassName}(mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance with default logger', () => {
      const instance = new ${fullClassName}();
      expect(instance).toBeInstanceOf(${fullClassName});
      expect(instance.getClassName()).toBe('${fullClassName}');
    });

    it('should create instance with custom logger', () => {
      const instance = new ${fullClassName}(mockLogger);
      expect(instance).toBeInstanceOf(${fullClassName});
      expect(mockLogger.info).toHaveBeenCalledWith('${fullClassName} instance created');
    });
  });

  describe('Utility Methods', () => {
    it('should return correct class name', () => {
      expect(${className.toLowerCase()}${template.suffix}.getClassName()).toBe('${fullClassName}');
    });

    it('should return initialization status', () => {
      expect(${className.toLowerCase()}${template.suffix}.isReady()).toBe(false);
    });

    it('should return runtime information', () => {
      const info = ${className.toLowerCase()}${template.suffix}.getInfo();
      expect(info).toMatchObject({
        className: '${fullClassName}',
        initialized: false,
      });
      expect(info.timestamp).toBeDefined();
    });
  });

${methods.map(method => this.generateTestMethod(method, className, template.suffix)).join('\n\n')}

  describe('Error Handling', () => {
    it('should handle and log errors properly', async () => {
      // Test error handling for each method
      ${methods.map(method => `
      await expect(${className.toLowerCase()}${template.suffix}.${method}(null)).rejects.toThrow();`).join('')}
    });
  });

  describe('Performance Tests', () => {
    it('should execute methods within acceptable time limits', async () => {
      const startTime = performance.now();
      
      try {
        await ${className.toLowerCase()}${template.suffix}.${methods[0] || 'execute'}({});
      } catch (error) {
        // Expected for unimplemented methods
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete within 1000ms
      expect(executionTime).toBeLessThan(1000);
    });
  });
});`;
  }

  // Generate test method
  generateTestMethod(methodName, className, suffix) {
    return `  describe('${methodName}', () => {
    it('should execute ${methodName} successfully with valid input', async () => {
      const input = { test: 'data' };
      
      await expect(${className.toLowerCase()}${suffix}.${methodName}(input)).resolves.toMatchObject({
        success: true,
        message: '${methodName} executed successfully'
      });
      
      expect(mockLogger.info).toHaveBeenCalledWith(\`Executing ${methodName}\`, { input });
    });

    it('should handle ${methodName} with undefined input', async () => {
      await expect(${className.toLowerCase()}${suffix}.${methodName}()).resolves.toBeDefined();
    });

    it('should log ${methodName} execution', async () => {
      await ${className.toLowerCase()}${suffix}.${methodName}({});
      
      expect(mockLogger.info).toHaveBeenCalledWith(\`Executing ${methodName}\`, { input: {} });
    });
  })`;
  }

  // Main generator function
  async generate() {
    try {
      this.log('', 'reset');
      this.log('🏗️  IOE TypeScript Class Generator', 'bright');
      this.log('====================================', 'cyan');
      this.log('', 'reset');

      // Get class name
      let className;
      do {
        className = await this.ask('📝 Class name (PascalCase, without IOE prefix): ');
        if (!this.validateClassName(className)) {
          this.log('❌ Invalid class name. Use PascalCase without IOE prefix (2-50 chars)', 'red');
        }
      } while (!this.validateClassName(className));

      // Get class type
      this.log('\n📦 Available class types:', 'yellow');
      Object.keys(CLASS_TYPES).forEach((key, index) => {
        const type = CLASS_TYPES[key];
        this.log(`  ${index + 1}. ${type.name} - ${type.description}`, 'cyan');
      });

      let classTypeIndex;
      do {
        const input = await this.ask(`\nSelect class type (1-${Object.keys(CLASS_TYPES).length}): `);
        classTypeIndex = parseInt(input) - 1;
      } while (classTypeIndex < 0 || classTypeIndex >= Object.keys(CLASS_TYPES).length);

      const classType = Object.keys(CLASS_TYPES)[classTypeIndex];
      const template = CLASS_TYPES[classType];

      // Get description
      const description = await this.ask('📋 Class description (optional): ');

      // Get custom methods
      this.log('\n🔧 Default methods for ' + template.name + ': ' + template.methods.join(', '), 'cyan');
      const customMethodsInput = await this.ask('➕ Additional methods (comma-separated, optional): ');
      
      let methods = [...template.methods];
      if (customMethodsInput.trim()) {
        const customMethods = customMethodsInput
          .split(',')
          .map(m => m.trim())
          .filter(m => m.length > 0)
          .filter(m => /^[a-zA-Z][a-zA-Z0-9]*$/.test(m));
        methods = [...methods, ...customMethods];
      }

      // Create directory if it doesn't exist
      this.ensureDir(template.directory);
      this.ensureDir('tests');

      const fullClassName = 'IOE' + className + template.suffix;
      const classFilePath = path.join(template.directory, fullClassName + '.ts');
      const testFilePath = path.join('tests', fullClassName + '.test.ts');

      // Check if files already exist
      if (fs.existsSync(classFilePath)) {
        this.log('❌ Class file \'' + classFilePath + '\' already exists!', 'red');
        process.exit(1);
      }

      // Generate files
      this.log('\n🏗️  Generating \'' + fullClassName + '\' class...', 'green');
      
      const classContent = this.generateClassContent(className, classType, description, methods);
      fs.writeFileSync(classFilePath, classContent);

      const testContent = this.generateTestContent(className, classType, methods);
      fs.writeFileSync(testFilePath, testContent);

      // Success message
      this.log('\n✅ Class generated successfully!', 'green');
      this.log('', 'reset');
      this.log('📁 Generated files:', 'yellow');
      this.log('  📄 ' + classFilePath, 'cyan');
      this.log('  🧪 ' + testFilePath, 'cyan');
      this.log('', 'reset');
      this.log('📋 Next steps:', 'yellow');
      this.log('  1. Implement the TODO sections in the class', 'cyan');
      this.log('  2. Run tests: npm test', 'cyan');
      this.log('  3. Import and use the class in your application', 'cyan');
      this.log('', 'reset');
      this.log('🎉 Happy coding with IOE standards!', 'magenta');

    } catch (error) {
      this.log(`❌ Error: ${error.message}`, 'red');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new IOEClassGenerator();
  generator.generate();
}

module.exports = { IOEClassGenerator };