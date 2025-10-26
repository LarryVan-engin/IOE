#!/usr/bin/env node

/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          tools/test-generator.js
 * Description:   Test generator for IOE TypeScript applications with comprehensive test coverage
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
 * Notes:         Command-line tool for generating comprehensive test suites
 *                - Only Project Leader has permission to modify this file
 *                - Generates unit tests for IOE TypeScript classes
 *                - Creates integration tests for complex workflows
 *                - Includes performance and security test templates
 *                - Supports different testing patterns (Unit, Integration, E2E)
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

// Test types and templates
const TEST_TYPES = {
  unit: {
    name: 'Unit Tests',
    description: 'Individual component/function testing',
    directory: 'tests/unit',
    suffix: '.test.ts',
    framework: 'jest'
  },
  integration: {
    name: 'Integration Tests',
    description: 'Multi-component interaction testing',
    directory: 'tests/integration',
    suffix: '.integration.test.ts',
    framework: 'jest'
  },
  e2e: {
    name: 'End-to-End Tests',
    description: 'Complete workflow testing',
    directory: 'tests/e2e',
    suffix: '.e2e.test.ts',
    framework: 'jest'
  },
  performance: {
    name: 'Performance Tests',
    description: 'Performance and load testing',
    directory: 'tests/performance',
    suffix: '.perf.test.ts',
    framework: 'jest'
  },
  security: {
    name: 'Security Tests',
    description: 'Security vulnerability testing',
    directory: 'tests/security',
    suffix: '.security.test.ts',
    framework: 'jest'
  }
};

class IOETestGenerator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Print colored text
  log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
  }

  // Ask user input
  async ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  // Create directory if it doesn't exist
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Analyze existing TypeScript file to extract testable elements
  analyzeSourceFile(filePath) {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const analysis = {
      classes: [],
      interfaces: [],
      functions: [],
      methods: [],
      imports: [],
      exports: []
    };

    let currentClass = null;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Extract imports
      const importMatch = line.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/);
      if (importMatch) {
        analysis.imports.push(importMatch[1]);
      }

      // Extract exports
      if (line.startsWith('export')) {
        analysis.exports.push(line);
      }

      // Extract classes
      const classMatch = line.match(/(?:export\s+)?class\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        currentClass = {
          name: classMatch[1],
          methods: [],
          properties: [],
          isExported: line.includes('export')
        };
        analysis.classes.push(currentClass);
      }

      // Extract interfaces
      const interfaceMatch = line.match(/(?:export\s+)?interface\s+([A-Za-z0-9_]+)/);
      if (interfaceMatch) {
        analysis.interfaces.push({
          name: interfaceMatch[1],
          isExported: line.includes('export')
        });
      }

      // Extract standalone functions
      const functionMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/);
      if (functionMatch && !currentClass) {
        analysis.functions.push({
          name: functionMatch[1],
          isAsync: line.includes('async'),
          isExported: line.includes('export')
        });
      }

      // Extract class methods
      if (currentClass) {
        const methodMatch = line.match(/(?:public|private|protected)?\s*(?:async\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)/);
        if (methodMatch && !line.includes('constructor')) {
          currentClass.methods.push({
            name: methodMatch[1],
            isAsync: line.includes('async'),
            visibility: line.includes('private') ? 'private' : 
                       line.includes('protected') ? 'protected' : 'public'
          });
        }

        // Track brace depth to know when class ends
        if (line.includes('{')) braceDepth++;
        if (line.includes('}')) {
          braceDepth--;
          if (braceDepth <= 0) {
            currentClass = null;
          }
        }
      }
    }

    return analysis;
  }

  // Generate unit test content
  generateUnitTest(testName, sourceFile, analysis) {
    const date = new Date().toISOString().split('T')[0];
    const className = analysis.classes.length > 0 ? analysis.classes[0].name : testName;
    
    let content = `/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Project
 * File:          tests/unit/${testName}.test.ts
 * Description:   Unit tests for ${className}
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
 * Notes:         Comprehensive unit tests following IOE testing standards
 *                - Only Project Leader has permission to modify this file
 *                - Tests all public methods and error scenarios
 *                - Includes edge cases and boundary conditions
 *                - Validates IOE coding standards compliance
 * *******************************************************************************************************************
 */

import { ${className} } from '${this.getImportPath(sourceFile)}';`;

    // Add mock imports if needed
    if (analysis.imports.length > 0) {
      content += '\nimport { IOELogger } from \'@/utils/IOELogger\';\n';
      content += '\n// Mock dependencies\njest.mock(\'@/utils/IOELogger\');\n';
    }

    content += `\ndescribe('${className}', () => {
  let instance: ${className};
  let mockLogger: jest.Mocked<IOELogger>;

  beforeEach(() => {`;

    if (analysis.imports.some(imp => imp.includes('IOELogger'))) {
      content += `
    mockLogger = new IOELogger('test') as jest.Mocked<IOELogger>;
    instance = new ${className}(mockLogger);`;
    } else {
      content += `
    instance = new ${className}();`;
    }

    content += `
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance successfully', () => {
      expect(instance).toBeInstanceOf(${className});
    });

    it('should initialize with default values', () => {
      expect(instance).toBeDefined();
      // Add specific property checks here
    });
  });`;

    // Generate tests for each class method
    if (analysis.classes.length > 0) {
      analysis.classes[0].methods.forEach(method => {
        if (method.visibility === 'public') {
          content += this.generateMethodTest(method, className);
        }
      });
    }

    // Generate tests for standalone functions
    analysis.functions.forEach(func => {
      if (func.isExported) {
        content += this.generateFunctionTest(func);
      }
    });

    // Add error handling tests
    content += `\n  describe('Error Handling', () => {
    it('should handle invalid input gracefully', () => {
      // Test with null input
      expect(() => {
        // Add specific error test cases here
      }).not.toThrow();
    });

    it('should throw appropriate errors for invalid operations', () => {
      // Test error scenarios
      expect(() => {
        // Add specific error scenarios here
      }).toThrow();
    });
  });`;

    // Add performance tests
    content += `\n  describe('Performance', () => {
    it('should execute within acceptable time limits', async () => {
      const startTime = performance.now();
      
      // Execute operation
      try {
        // Add performance test operations here
        await Promise.resolve();
      } catch (error) {
        // Expected for unimplemented methods
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete within 1000ms
      expect(executionTime).toBeLessThan(1000);
    });

    it('should handle concurrent operations', async () => {
      const promises = Array.from({ length: 10 }, () => {
        return Promise.resolve(); // Add concurrent operations here
      });
      
      await expect(Promise.all(promises)).resolves.toBeDefined();
    });
  });`;

    // Add edge case tests
    content += `\n  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      // Test with empty values
      expect(() => {
        // Add empty input tests here
      }).not.toThrow();
    });

    it('should handle large datasets', () => {
      // Test with large amounts of data
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      expect(() => {
        // Add large dataset tests here
      }).not.toThrow();
    });

    it('should handle boundary values', () => {
      // Test with boundary conditions
      const boundaryValues = [0, -1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
      
      boundaryValues.forEach(value => {
        expect(() => {
          // Add boundary value tests here
        }).not.toThrow();
      });
    });
  });

  describe('Integration Points', () => {
    it('should interact correctly with dependencies', () => {
      // Test dependency interactions
      expect(instance).toBeDefined();
      // Add specific integration tests here
    });
  });
});`;

    return content;
  }

  // Generate method test block
  generateMethodTest(method, className) {
    return `\n  describe('${method.name}', () => {
    it('should execute ${method.name} successfully', ${method.isAsync ? 'async ' : ''}() => {
      ${method.isAsync ? 'await ' : ''}expect(${method.isAsync ? 'instance.' + method.name + '()' : 'instance.' + method.name + '()'}).${method.isAsync ? 'resolves.' : ''}toBeDefined();
    });

    it('should handle ${method.name} with valid parameters', ${method.isAsync ? 'async ' : ''}() => {
      const testInput = { test: 'data' };
      ${method.isAsync ? 'await ' : ''}expect(${method.isAsync ? 'instance.' + method.name + '(testInput)' : 'instance.' + method.name + '(testInput)'}).${method.isAsync ? 'resolves.' : ''}toBeDefined();
    });

    it('should validate ${method.name} input parameters', ${method.isAsync ? 'async ' : ''}() => {
      ${method.isAsync ? 'await ' : ''}expect(${method.isAsync ? 'instance.' + method.name + '(null)' : 'instance.' + method.name + '(null)'}).${method.isAsync ? 'rejects.' : ''}toBeDefined();
    });
  })`;
  }

  // Generate function test block
  generateFunctionTest(func) {
    return `\n  describe('${func.name} (standalone function)', () => {
    it('should execute ${func.name} successfully', ${func.isAsync ? 'async ' : ''}() => {
      // Import and test the standalone function
      // const result = ${func.isAsync ? 'await ' : ''}${func.name}();
      // expect(result).toBeDefined();
    });
  })`;
  }

  // Generate integration test content
  generateIntegrationTest(testName, sourceFiles) {
    const date = new Date().toISOString().split('T')[0];

    return `/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Project
 * File:          tests/integration/${testName}.integration.test.ts
 * Description:   Integration tests for ${testName} workflow
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
 * Notes:         Integration tests for multi-component workflows
 *                - Only Project Leader has permission to modify this file
 *                - Tests component interactions and data flow
 *                - Validates system behavior under realistic conditions
 *                - Includes database and external service interactions
 * *******************************************************************************************************************
 */

describe('${testName} Integration Tests', () => {
  beforeAll(async () => {
    // Setup test environment
    // Initialize databases, services, etc.
  });

  afterAll(async () => {
    // Cleanup test environment
    // Close connections, clean up data, etc.
  });

  beforeEach(async () => {
    // Setup for each test
  });

  afterEach(async () => {
    // Cleanup after each test
  });

  describe('Component Integration', () => {
    it('should integrate components successfully', async () => {
      // Test component integration
      expect(true).toBe(true); // Replace with actual integration tests
    });

    it('should handle data flow between components', async () => {
      // Test data flow
      expect(true).toBe(true); // Replace with actual data flow tests
    });
  });

  describe('Database Integration', () => {
    it('should perform CRUD operations successfully', async () => {
      // Test database operations
      expect(true).toBe(true); // Replace with actual database tests
    });

    it('should handle database connection failures', async () => {
      // Test error scenarios
      expect(true).toBe(true); // Replace with actual error handling tests
    });
  });

  describe('External Service Integration', () => {
    it('should integrate with external APIs', async () => {
      // Test external API integration
      expect(true).toBe(true); // Replace with actual API tests
    });

    it('should handle service unavailability', async () => {
      // Test service failure scenarios
      expect(true).toBe(true); // Replace with actual failure handling tests
    });
  });

  describe('End-to-End Workflows', () => {
    it('should complete full workflow successfully', async () => {
      // Test complete workflow
      expect(true).toBe(true); // Replace with actual workflow tests
    });

    it('should handle workflow interruptions', async () => {
      // Test workflow error handling
      expect(true).toBe(true); // Replace with actual interruption tests
    });
  });
});`;
  }

  // Generate performance test content
  generatePerformanceTest(testName) {
    const date = new Date().toISOString().split('T')[0];

    return `/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Project
 * File:          tests/performance/${testName}.perf.test.ts
 * Description:   Performance tests for ${testName}
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
 * Notes:         Performance and load testing suite
 *                - Only Project Leader has permission to modify this file
 *                - Tests system performance under various loads
 *                - Validates response times and resource usage
 *                - Includes stress testing scenarios
 * *******************************************************************************************************************
 */

describe('${testName} Performance Tests', () => {
  const PERFORMANCE_THRESHOLDS = {
    maxResponseTime: 1000, // milliseconds
    maxMemoryUsage: 100 * 1024 * 1024, // 100MB
    maxCpuTime: 5000, // milliseconds
  };

  beforeAll(() => {
    // Setup performance monitoring
  });

  afterAll(() => {
    // Cleanup performance monitoring
  });

  describe('Response Time Tests', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = performance.now();
      
      // Execute operation under test
      await Promise.resolve(); // Replace with actual operation
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxResponseTime);
    });

    it('should maintain performance under normal load', async () => {
      const operations = Array.from({ length: 100 }, () => {
        return new Promise(resolve => {
          const startTime = performance.now();
          // Replace with actual operation
          setTimeout(() => {
            const endTime = performance.now();
            resolve(endTime - startTime);
          }, 10);
        });
      });

      const times = await Promise.all(operations);
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      
      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxResponseTime);
    });
  });

  describe('Load Tests', () => {
    it('should handle concurrent requests', async () => {
      const concurrentRequests = 50;
      const requests = Array.from({ length: concurrentRequests }, () => {
        return Promise.resolve(); // Replace with actual operation
      });

      const startTime = performance.now();
      await Promise.all(requests);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxResponseTime * 2);
    });

    it('should scale with increased load', async () => {
      const loadLevels = [10, 50, 100, 200];
      const results = [];

      for (const load of loadLevels) {
        const requests = Array.from({ length: load }, () => {
          return Promise.resolve(); // Replace with actual operation
        });

        const startTime = performance.now();
        await Promise.all(requests);
        const endTime = performance.now();
        
        results.push({
          load,
          time: endTime - startTime,
          avgTime: (endTime - startTime) / load
        });
      }

      // Verify that average time doesn't increase dramatically
      const baselineAvg = results[0].avgTime;
      const maxAvg = Math.max(...results.map(r => r.avgTime));
      
      expect(maxAvg).toBeLessThan(baselineAvg * 3); // Allow 3x increase max
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not exceed memory limits', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Execute memory-intensive operation
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, data: 'test'.repeat(100) }));
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.maxMemoryUsage);
    });

    it('should release memory after operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Execute operation that should release memory
      {
        const tempData = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
        // Use tempData
        expect(tempData.length).toBe(1000);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Allow some time for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryDifference = Math.abs(finalMemory - initialMemory);
      
      // Memory should be close to initial (within 10MB)
      expect(memoryDifference).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Stress Tests', () => {
    it('should handle extreme load conditions', async () => {
      const extremeLoad = 1000;
      const requests = Array.from({ length: extremeLoad }, () => {
        return Promise.resolve(); // Replace with actual operation
      });

      // Should not crash under extreme load
      await expect(Promise.all(requests)).resolves.toBeDefined();
    });

    it('should recover from resource exhaustion', async () => {
      // Simulate resource exhaustion scenario
      expect(true).toBe(true); // Replace with actual stress test
    });
  });
});`;
  }

  // Get import path for source file
  getImportPath(sourceFile) {
    if (sourceFile.includes('/src/')) {
      const relativePath = sourceFile.replace(/.*\/src\//, '@/').replace('.ts', '');
      return relativePath;
    }
    return './' + path.basename(sourceFile, '.ts');
  }

  // Main generator function
  async generate() {
    try {
      this.log('', 'reset');
      this.log('🧪 IOE TypeScript Test Generator', 'bright');
      this.log('==================================', 'cyan');
      this.log('', 'reset');

      // Get test type
      this.log('📦 Available test types:', 'yellow');
      Object.keys(TEST_TYPES).forEach((key, index) => {
        const type = TEST_TYPES[key];
        this.log('  ' + (index + 1) + '. ' + type.name + ' - ' + type.description, 'cyan');
      });

      let testTypeIndex;
      do {
        const input = await this.ask('\nSelect test type (1-' + Object.keys(TEST_TYPES).length + '): ');
        testTypeIndex = parseInt(input) - 1;
      } while (testTypeIndex < 0 || testTypeIndex >= Object.keys(TEST_TYPES).length);

      const testType = Object.keys(TEST_TYPES)[testTypeIndex];
      const template = TEST_TYPES[testType];

      // Get test name
      const testName = await this.ask('📝 Test name (PascalCase): ');
      if (!testName || !/^[A-Z][a-zA-Z0-9]*$/.test(testName)) {
        this.log('❌ Invalid test name. Use PascalCase format.', 'red');
        process.exit(1);
      }

      let sourceFile = '';
      let analysis = null;

      // For unit tests, analyze source file
      if (testType === 'unit') {
        sourceFile = await this.ask('📄 Source file path (optional, for analysis): ');
        if (sourceFile && fs.existsSync(sourceFile)) {
          analysis = this.analyzeSourceFile(sourceFile);
          if (analysis) {
            this.log('✅ Source file analyzed successfully', 'green');
            this.log('  Classes: ' + analysis.classes.length, 'cyan');
            this.log('  Functions: ' + analysis.functions.length, 'cyan');
            this.log('  Interfaces: ' + analysis.interfaces.length, 'cyan');
          }
        } else if (sourceFile) {
          this.log('⚠️  Source file not found, generating basic template', 'yellow');
        }
      }

      // Create directory if it doesn't exist
      this.ensureDir(template.directory);

      const testFilePath = path.join(template.directory, testName + template.suffix);

      // Check if file already exists
      if (fs.existsSync(testFilePath)) {
        this.log('❌ Test file \'' + testFilePath + '\' already exists!', 'red');
        process.exit(1);
      }

      // Generate test content
      this.log('\n🧪 Generating \'' + testName + '\' ' + template.name.toLowerCase() + '...', 'green');
      
      let testContent;
      switch (testType) {
        case 'unit':
          testContent = this.generateUnitTest(testName, sourceFile, analysis || { classes: [], functions: [], interfaces: [], imports: [] });
          break;
        case 'integration':
          testContent = this.generateIntegrationTest(testName, [sourceFile]);
          break;
        case 'performance':
          testContent = this.generatePerformanceTest(testName);
          break;
        default:
          testContent = this.generateUnitTest(testName, sourceFile, { classes: [], functions: [], interfaces: [], imports: [] });
      }

      fs.writeFileSync(testFilePath, testContent);

      // Success message
      this.log('\n✅ Test generated successfully!', 'green');
      this.log('', 'reset');
      this.log('📁 Generated file:', 'yellow');
      this.log('  🧪 ' + testFilePath, 'cyan');
      this.log('', 'reset');
      this.log('📋 Next steps:', 'yellow');
      this.log('  1. Implement the test cases by replacing placeholder code', 'cyan');
      this.log('  2. Run tests: npm test', 'cyan');
      this.log('  3. Check coverage: npm run test:coverage', 'cyan');
      this.log('', 'reset');
      this.log('🎯 Test file structure follows IOE testing standards', 'magenta');

    } catch (error) {
      this.log('❌ Error: ' + error.message, 'red');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new IOETestGenerator();
  generator.generate();
}

module.exports = { IOETestGenerator };