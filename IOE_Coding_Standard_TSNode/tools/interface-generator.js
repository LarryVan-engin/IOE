#!/usr/bin/env node

/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          tools/interface-generator.js
 * Description:   Interface generator for IOE TypeScript applications following strict naming conventions
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
 * Notes:         Command-line tool for generating TypeScript interfaces
 *                - Only Project Leader has permission to modify this file
 *                - Generates interfaces with IOE naming conventions (I prefix)
 *                - Creates comprehensive JSDoc documentation
 *                - Supports different interface types (Config, Model, Service, API)
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

// Interface templates
const INTERFACE_TYPES = {
  config: {
    name: 'Configuration Interface',
    description: 'Configuration object structure and validation',
    directory: 'src/types',
    prefix: 'IOE',
    suffix: 'Config',
    properties: ['host', 'port', 'timeout', 'retries']
  },
  model: {
    name: 'Data Model Interface',
    description: 'Data model structure with validation rules',
    directory: 'src/types',
    prefix: 'IOE',
    suffix: 'Model',
    properties: ['id', 'name', 'createdAt', 'updatedAt']
  },
  service: {
    name: 'Service Contract Interface',
    description: 'Service layer contract definition',
    directory: 'src/types',
    prefix: 'IOE',
    suffix: 'Service',
    properties: [],
    methods: ['initialize', 'execute', 'cleanup']
  },
  api: {
    name: 'API Response Interface',
    description: 'API request/response structure',
    directory: 'src/types',
    prefix: 'IOE',
    suffix: 'ApiResponse',
    properties: ['success', 'data', 'message', 'timestamp']
  },
  repository: {
    name: 'Repository Interface',
    description: 'Data access layer contract',
    directory: 'src/types',
    prefix: 'IOE',
    suffix: 'Repository',
    properties: [],
    methods: ['create', 'findById', 'update', 'delete']
  },
  dto: {
    name: 'Data Transfer Object',
    description: 'Data transfer between layers',
    directory: 'src/types',
    prefix: 'IOE',
    suffix: 'Dto',
    properties: ['data', 'metadata', 'version']
  }
};

// Common TypeScript types
const TS_TYPES = [
  'string',
  'number',
  'boolean',
  'Date',
  'unknown',
  'object',
  'any',
  'string[]',
  'number[]',
  'boolean[]',
  'Record<string, unknown>',
  'Promise<unknown>'
];

class IOEInterfaceGenerator {
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

  // Validate interface name (must be PascalCase without I prefix)
  validateInterfaceName(name) {
    const regex = /^[A-Z][a-zA-Z0-9]*$/;
    return regex.test(name) && name.length >= 2 && name.length <= 50 && !name.startsWith('I');
  }

  // Validate property name (camelCase)
  validatePropertyName(name) {
    const regex = /^[a-z][a-zA-Z0-9]*$/;
    return regex.test(name) && name.length >= 1 && name.length <= 50;
  }

  // Create directory if it doesn't exist
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Generate interface content
  generateInterfaceContent(interfaceName, interfaceType, description, properties, methods) {
    const template = INTERFACE_TYPES[interfaceType];
    const fullInterfaceName = 'I' + template.prefix + interfaceName + template.suffix;
    const date = new Date().toISOString().split('T')[0];

    let content = `/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Project
 * File:          ${template.directory.replace('src/', '')}/${fullInterfaceName}.ts
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
 * Dependencies:  None (interface definition only)
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         ${template.description}
 *                - Only Project Leader has permission to modify this file
 *                - Follows IOE naming conventions (I prefix for interfaces)
 *                - Provides comprehensive type safety
 *                - Includes detailed JSDoc documentation
 * *******************************************************************************************************************
 */

/**
 * ${template.description}.
 * 
 * @interface ${fullInterfaceName}
 * @description ${description || 'Defines the structure and contract for ' + interfaceName.toLowerCase() + ' objects'}
 * @version 1.0.0
 * @author IOE Development Team
 * 
 * @example
 * \`\`\`typescript
 * const ${interfaceName.toLowerCase()}: ${fullInterfaceName} = {
 *   // Implementation here
 * };
 * \`\`\`
 */
export interface ${fullInterfaceName} {`;

    // Add properties
    if (properties && properties.length > 0) {
      properties.forEach(prop => {
        content += '\n  /**\n   * ' + this.generatePropertyDescription(prop.name, interfaceType) + '.\n   * \n   * @type {' + prop.type + '}\n   */\n';
        content += '  ' + prop.name + (prop.optional ? '?' : '') + ': ' + prop.type + ';';
      });
    }

    // Add separator if both properties and methods exist
    if (properties && properties.length > 0 && methods && methods.length > 0) {
      content += '\n';
    }

    // Add methods
    if (methods && methods.length > 0) {
      methods.forEach(method => {
        content += '\n  /**\n   * ' + this.generateMethodDescription(method.name, interfaceType) + '.\n   * ';
        
        if (method.params && method.params.length > 0) {
          method.params.forEach(param => {
            content += '\n   * @param {' + param.type + '} ' + param.name + ' - ' + (param.description || 'Parameter description');
          });
        }
        
        content += '\n   * @returns {' + method.returnType + '} ' + (method.returnDescription || 'Method result');
        content += '\n   * @throws {Error} When operation fails\n   */\n';
        
        const params = method.params ? method.params.map(p => p.name + (p.optional ? '?' : '') + ': ' + p.type).join(', ') : '';
        content += '  ' + method.name + '(' + params + '): ' + method.returnType + ';';
      });
    }

    content += '\n}\n';

    return content;
  }

  // Generate property description
  generatePropertyDescription(propertyName, interfaceType) {
    const descriptions = {
      id: 'Unique identifier for the entity',
      name: 'Display name or title',
      host: 'Server hostname or IP address',
      port: 'Server port number',
      timeout: 'Connection timeout in milliseconds',
      retries: 'Number of retry attempts',
      createdAt: 'Creation timestamp',
      updatedAt: 'Last update timestamp',
      success: 'Operation success status',
      data: 'Response payload data',
      message: 'Status or error message',
      timestamp: 'Operation timestamp',
      metadata: 'Additional metadata information',
      version: 'API or data version'
    };

    return descriptions[propertyName] || 'Property description for ' + propertyName;
  }

  // Generate method description
  generateMethodDescription(methodName, interfaceType) {
    const descriptions = {
      initialize: 'Initializes the service with configuration',
      execute: 'Executes the main operation',
      cleanup: 'Performs cleanup and resource disposal',
      create: 'Creates a new entity',
      findById: 'Finds an entity by its unique identifier',
      update: 'Updates an existing entity',
      delete: 'Deletes an entity',
      validate: 'Validates the data structure',
      serialize: 'Serializes the object to a transferable format',
      deserialize: 'Deserializes data to create an object instance'
    };

    return descriptions[methodName] || 'Performs ' + methodName + ' operation';
  }

  // Parse property input
  parseProperty(input) {
    const parts = input.split(':').map(p => p.trim());
    if (parts.length < 2) return null;

    const name = parts[0];
    let type = parts[1];
    let optional = false;

    // Check for optional marker
    if (name.endsWith('?')) {
      optional = true;
      name = name.slice(0, -1);
    }

    // Validate property name
    if (!this.validatePropertyName(name.replace('?', ''))) {
      return null;
    }

    return { name: name.replace('?', ''), type, optional };
  }

  // Parse method input
  parseMethod(input) {
    // Format: methodName(param1:type1, param2:type2):returnType
    const match = input.match(/^([a-zA-Z][a-zA-Z0-9]*)\(([^)]*)\):(.+)$/);
    if (!match) return null;

    const [, name, paramsStr, returnType] = match;
    const params = [];

    if (paramsStr.trim()) {
      const paramParts = paramsStr.split(',').map(p => p.trim());
      for (const paramPart of paramParts) {
        const paramMatch = paramPart.match(/^([a-zA-Z][a-zA-Z0-9]*\??):(.+)$/);
        if (!paramMatch) continue;

        const [, paramName, paramType] = paramMatch;
        const optional = paramName.endsWith('?');
        
        params.push({
          name: paramName.replace('?', ''),
          type: paramType.trim(),
          optional,
          description: 'Parameter for ' + name
        });
      }
    }

    return {
      name,
      params,
      returnType: returnType.trim(),
      returnDescription: 'Result of ' + name + ' operation'
    };
  }

  // Main generator function
  async generate() {
    try {
      this.log('', 'reset');
      this.log('🔷 IOE TypeScript Interface Generator', 'bright');
      this.log('======================================', 'cyan');
      this.log('', 'reset');

      // Get interface name
      let interfaceName;
      do {
        interfaceName = await this.ask('📝 Interface name (PascalCase, without I prefix): ');
        if (!this.validateInterfaceName(interfaceName)) {
          this.log('❌ Invalid interface name. Use PascalCase without I prefix (2-50 chars)', 'red');
        }
      } while (!this.validateInterfaceName(interfaceName));

      // Get interface type
      this.log('\n📦 Available interface types:', 'yellow');
      Object.keys(INTERFACE_TYPES).forEach((key, index) => {
        const type = INTERFACE_TYPES[key];
        this.log('  ' + (index + 1) + '. ' + type.name + ' - ' + type.description, 'cyan');
      });

      let interfaceTypeIndex;
      do {
        const input = await this.ask('\nSelect interface type (1-' + Object.keys(INTERFACE_TYPES).length + '): ');
        interfaceTypeIndex = parseInt(input) - 1;
      } while (interfaceTypeIndex < 0 || interfaceTypeIndex >= Object.keys(INTERFACE_TYPES).length);

      const interfaceType = Object.keys(INTERFACE_TYPES)[interfaceTypeIndex];
      const template = INTERFACE_TYPES[interfaceType];

      // Get description
      const description = await this.ask('📋 Interface description (optional): ');

      // Get properties
      this.log('\n🏷️  Add properties (format: propertyName:type or propertyName?:type for optional)', 'yellow');
      this.log('Available types: ' + TS_TYPES.join(', '), 'cyan');
      
      if (template.properties && template.properties.length > 0) {
        this.log('Default properties: ' + template.properties.join(', '), 'cyan');
      }

      let properties = [];
      
      // Add default properties
      if (template.properties) {
        template.properties.forEach(propName => {
          const defaultType = this.getDefaultTypeForProperty(propName);
          properties.push({ name: propName, type: defaultType, optional: false });
        });
      }

      // Get custom properties
      const customPropsInput = await this.ask('➕ Additional properties (comma-separated, e.g., "name:string, age?:number"): ');
      if (customPropsInput.trim()) {
        const customProps = customPropsInput.split(',').map(p => p.trim());
        for (const propInput of customProps) {
          const prop = this.parseProperty(propInput);
          if (prop) {
            properties.push(prop);
          } else {
            this.log('⚠️  Skipped invalid property: ' + propInput, 'yellow');
          }
        }
      }

      // Get methods
      let methods = [];
      if (template.methods) {
        this.log('\n🔧 Default methods: ' + template.methods.join(', '), 'cyan');
        
        template.methods.forEach(methodName => {
          const defaultMethod = this.getDefaultMethod(methodName);
          methods.push(defaultMethod);
        });
      }

      // Get custom methods
      this.log('\n⚙️  Add custom methods (format: methodName(param1:type1, param2:type2):returnType)', 'yellow');
      const customMethodsInput = await this.ask('➕ Additional methods (comma-separated, optional): ');
      if (customMethodsInput.trim()) {
        const customMethods = customMethodsInput.split(',').map(m => m.trim());
        for (const methodInput of customMethods) {
          const method = this.parseMethod(methodInput);
          if (method) {
            methods.push(method);
          } else {
            this.log('⚠️  Skipped invalid method: ' + methodInput, 'yellow');
          }
        }
      }

      // Create directory if it doesn't exist
      this.ensureDir(template.directory);

      const fullInterfaceName = 'I' + template.prefix + interfaceName + template.suffix;
      const interfaceFilePath = path.join(template.directory, fullInterfaceName + '.ts');

      // Check if file already exists
      if (fs.existsSync(interfaceFilePath)) {
        this.log('❌ Interface file \'' + interfaceFilePath + '\' already exists!', 'red');
        process.exit(1);
      }

      // Generate file
      this.log('\n🔷 Generating \'' + fullInterfaceName + '\' interface...', 'green');
      
      const interfaceContent = this.generateInterfaceContent(
        interfaceName, 
        interfaceType, 
        description, 
        properties, 
        methods
      );
      fs.writeFileSync(interfaceFilePath, interfaceContent);

      // Success message
      this.log('\n✅ Interface generated successfully!', 'green');
      this.log('', 'reset');
      this.log('📁 Generated file:', 'yellow');
      this.log('  📄 ' + interfaceFilePath, 'cyan');
      this.log('', 'reset');
      this.log('📋 Next steps:', 'yellow');
      this.log('  1. Import the interface: import { ' + fullInterfaceName + ' } from \'@/types/' + fullInterfaceName + '\';', 'cyan');
      this.log('  2. Implement the interface in your classes', 'cyan');
      this.log('  3. Use the interface for type safety', 'cyan');
      this.log('', 'reset');
      this.log('🎉 Happy coding with IOE standards!', 'magenta');

    } catch (error) {
      this.log('❌ Error: ' + error.message, 'red');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  // Get default type for common properties
  getDefaultTypeForProperty(propName) {
    const defaultTypes = {
      id: 'string',
      name: 'string',
      host: 'string',
      port: 'number',
      timeout: 'number',
      retries: 'number',
      createdAt: 'Date',
      updatedAt: 'Date',
      success: 'boolean',
      data: 'unknown',
      message: 'string',
      timestamp: 'Date',
      metadata: 'Record<string, unknown>',
      version: 'string'
    };

    return defaultTypes[propName] || 'unknown';
  }

  // Get default method signature
  getDefaultMethod(methodName) {
    const defaultMethods = {
      initialize: {
        name: 'initialize',
        params: [{ name: 'config', type: 'Record<string, unknown>', optional: true }],
        returnType: 'Promise<void>',
        returnDescription: 'Initialization result'
      },
      execute: {
        name: 'execute',
        params: [{ name: 'input', type: 'unknown', optional: true }],
        returnType: 'Promise<unknown>',
        returnDescription: 'Execution result'
      },
      cleanup: {
        name: 'cleanup',
        params: [],
        returnType: 'Promise<void>',
        returnDescription: 'Cleanup completion'
      },
      create: {
        name: 'create',
        params: [{ name: 'data', type: 'Record<string, unknown>', optional: false }],
        returnType: 'Promise<unknown>',
        returnDescription: 'Created entity'
      },
      findById: {
        name: 'findById',
        params: [{ name: 'id', type: 'string', optional: false }],
        returnType: 'Promise<unknown | null>',
        returnDescription: 'Found entity or null'
      },
      update: {
        name: 'update',
        params: [
          { name: 'id', type: 'string', optional: false },
          { name: 'data', type: 'Record<string, unknown>', optional: false }
        ],
        returnType: 'Promise<unknown>',
        returnDescription: 'Updated entity'
      },
      delete: {
        name: 'delete',
        params: [{ name: 'id', type: 'string', optional: false }],
        returnType: 'Promise<boolean>',
        returnDescription: 'Deletion success status'
      }
    };

    return defaultMethods[methodName] || {
      name: methodName,
      params: [],
      returnType: 'unknown',
      returnDescription: 'Method result'
    };
  }
}

// Run the generator
if (require.main === module) {
  const generator = new IOEInterfaceGenerator();
  generator.generate();
}

module.exports = { IOEInterfaceGenerator };