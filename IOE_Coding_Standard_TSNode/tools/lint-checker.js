#!/usr/bin/env node

/**
 * *******************************************************************************************************************
 * General Information
 * ********************************************************************************************************************
 * Project:       IOE TypeScript Coding Standards
 * File:          tools/lint-checker.js
 * Description:   Advanced linting and code quality checker for IOE TypeScript projects
 *
 * Author:        IOE Development Team (Project Leader)
 * Email:         team@ioe.innovation
 * Created:       2025-10-23
 * Last Update:   2025-10-23
 * Version:       1.0.0
 *
 * Node.js:       24.10.0+
 * Dependencies:  fs, path (Node.js built-in)
 *
 * Copyright:     (c) 2025 IOE INNOVATION Team
 * License:       MIT
 *
 * Notes:         Advanced code quality analysis tool for IOE standards
 *                - Only Project Leader has permission to modify this file
 *                - Checks IOE naming conventions compliance
 *                - Validates file headers and documentation
 *                - Analyzes project structure and organization
 *                - Reports code quality metrics and suggestions
 * *******************************************************************************************************************
 */

const fs = require('fs');
const path = require('path');

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

// IOE coding standard rules
const IOE_RULES = {
  naming: {
    classPrefix: 'IOE',
    interfacePrefix: 'I',
    enumPrefix: 'IOE',
    constantCase: 'UPPER_SNAKE_CASE',
    variableCase: 'camelCase',
    functionCase: 'camelCase',
    fileCase: 'PascalCase'
  },
  structure: {
    requiredDirectories: ['src', 'tests', 'docs'],
    requiredFiles: ['package.json', 'tsconfig.json', '.eslintrc.json', 'README.md'],
    srcSubdirectories: ['types', 'utils', 'modules', 'constants']
  },
  documentation: {
    requireFileHeaders: true,
    requireJSDoc: true,
    headerFields: ['Project', 'File', 'Description', 'Author', 'Created', 'Version']
  }
};

class IOELintChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.stats = {
      filesChecked: 0,
      classesFound: 0,
      interfacesFound: 0,
      functionsFound: 0,
      linesOfCode: 0
    };
  }

  // Print colored text
  log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
  }

  // Add error message
  addError(file, line, message) {
    this.errors.push({ file, line, message, type: 'error' });
  }

  // Add warning message
  addWarning(file, line, message) {
    this.warnings.push({ file, line, message, type: 'warning' });
  }

  // Add info message
  addInfo(file, line, message) {
    this.info.push({ file, line, message, type: 'info' });
  }

  // Check if file is TypeScript
  isTypeScriptFile(filePath) {
    return filePath.endsWith('.ts') && !filePath.endsWith('.d.ts');
  }

  // Check if file is test file
  isTestFile(filePath) {
    return filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('/tests/');
  }

  // Read file content
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      this.addError(filePath, 0, 'Failed to read file: ' + error.message);
      return null;
    }
  }

  // Get all TypeScript files recursively
  getTypeScriptFiles(dir) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules' && item !== 'dist' && item !== '.git') {
        files.push(...this.getTypeScriptFiles(fullPath));
      } else if (stat.isFile() && this.isTypeScriptFile(fullPath)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Check file header compliance
  checkFileHeader(filePath, content) {
    const lines = content.split('\n');
    let headerFound = false;
    let headerEndLine = 0;

    // Look for header block
    for (let i = 0; i < Math.min(50, lines.length); i++) {
      if (lines[i].includes('*******************************************************************************************************************')) {
        headerFound = true;
        
        // Find end of header
        for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
          if (lines[j].includes('*******************************************************************************************************************')) {
            headerEndLine = j;
            break;
          }
        }
        break;
      }
    }

    if (!headerFound) {
      this.addError(filePath, 1, 'Missing IOE file header block');
      return;
    }

    const headerContent = lines.slice(0, headerEndLine + 1).join('\n');

    // Check required header fields
    IOE_RULES.documentation.headerFields.forEach(field => {
      if (!headerContent.includes(field + ':')) {
        this.addWarning(filePath, 1, 'Missing header field: ' + field);
      }
    });

    // Check for IOE INNOVATION Team
    if (!headerContent.includes('IOE INNOVATION Team') && !headerContent.includes('IOE Development Team')) {
      this.addWarning(filePath, 1, 'Header should reference IOE INNOVATION Team or IOE Development Team');
    }

    // Check for copyright
    if (!headerContent.includes('Copyright')) {
      this.addWarning(filePath, 1, 'Missing copyright notice in header');
    }
  }

  // Check naming conventions
  checkNamingConventions(filePath, content) {
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Check class declarations
      const classMatch = line.match(/class\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        const className = classMatch[1];
        this.stats.classesFound++;

        if (!className.startsWith('IOE')) {
          this.addError(filePath, lineNumber, 'Class name \'' + className + '\' must start with \'IOE\' prefix');
        }

        if (!/^[A-Z]/.test(className)) {
          this.addError(filePath, lineNumber, 'Class name \'' + className + '\' must be PascalCase');
        }
      }

      // Check interface declarations
      const interfaceMatch = line.match(/interface\s+([A-Za-z0-9_]+)/);
      if (interfaceMatch) {
        const interfaceName = interfaceMatch[1];
        this.stats.interfacesFound++;

        if (!interfaceName.startsWith('I')) {
          this.addError(filePath, lineNumber, 'Interface name \'' + interfaceName + '\' must start with \'I\' prefix');
        }

        if (!interfaceName.includes('IOE') && !this.isTestFile(filePath)) {
          this.addWarning(filePath, lineNumber, 'Interface name \'' + interfaceName + '\' should include \'IOE\' (e.g., \'IIOE...\')');
        }
      }

      // Check enum declarations
      const enumMatch = line.match(/enum\s+([A-Za-z0-9_]+)/);
      if (enumMatch) {
        const enumName = enumMatch[1];

        if (!enumName.startsWith('IOE')) {
          this.addError(filePath, lineNumber, 'Enum name \'' + enumName + '\' must start with \'IOE\' prefix');
        }
      }

      // Check constant declarations
      const constMatch = line.match(/const\s+([A-Z_][A-Z0-9_]*)\s*=/);
      if (constMatch) {
        const constName = constMatch[1];

        if (!/^[A-Z][A-Z0-9_]*$/.test(constName)) {
          this.addWarning(filePath, lineNumber, 'Constant \'' + constName + '\' should use UPPER_SNAKE_CASE');
        }
      }

      // Check function declarations
      const functionMatch = line.match(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (functionMatch) {
        const functionName = functionMatch[1];
        this.stats.functionsFound++;

        if (!/^[a-z]/.test(functionName)) {
          this.addWarning(filePath, lineNumber, 'Function name \'' + functionName + '\' should start with lowercase letter');
        }
      }

      // Check variable declarations
      const varMatch = line.match(/(let|const|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (varMatch && !constMatch) {
        const varName = varMatch[2];

        if (!/^[a-z]/.test(varName) && varName !== varName.toUpperCase()) {
          this.addInfo(filePath, lineNumber, 'Variable \'' + varName + '\' should use camelCase');
        }
      }
    }
  }

  // Check JSDoc documentation
  checkDocumentation(filePath, content) {
    const lines = content.split('\n');
    let inComment = false;
    let hasJSDoc = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;

      // Track JSDoc comments
      if (line.startsWith('/**')) {
        inComment = true;
        hasJSDoc = true;
      } else if (line.endsWith('*/') && inComment) {
        inComment = false;
      }

      // Check for undocumented classes
      if (line.startsWith('export class') || line.startsWith('class')) {
        let hasDocBefore = false;
        
        // Look backwards for JSDoc
        for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
          if (lines[j].trim().endsWith('*/')) {
            hasDocBefore = true;
            break;
          }
          if (lines[j].trim() && !lines[j].trim().startsWith('*') && !lines[j].trim().startsWith('/**')) {
            break;
          }
        }

        if (!hasDocBefore) {
          this.addWarning(filePath, lineNumber, 'Class declaration should have JSDoc documentation');
        }
      }

      // Check for undocumented interfaces
      if (line.startsWith('export interface') || line.startsWith('interface')) {
        let hasDocBefore = false;
        
        // Look backwards for JSDoc
        for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
          if (lines[j].trim().endsWith('*/')) {
            hasDocBefore = true;
            break;
          }
          if (lines[j].trim() && !lines[j].trim().startsWith('*') && !lines[j].trim().startsWith('/**')) {
            break;
          }
        }

        if (!hasDocBefore) {
          this.addWarning(filePath, lineNumber, 'Interface declaration should have JSDoc documentation');
        }
      }
    }

    if (!hasJSDoc && !this.isTestFile(filePath)) {
      this.addInfo(filePath, 0, 'File lacks JSDoc documentation');
    }
  }

  // Check imports and exports
  checkImportsExports(filePath, content) {
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Check for relative imports
      const importMatch = line.match(/import.*from\s+['"]([^'"]+)['"]/);
      if (importMatch) {
        const importPath = importMatch[1];

        // Suggest using path aliases
        if (importPath.startsWith('../') || importPath.startsWith('./')) {
          if (importPath.includes('/src/')) {
            this.addInfo(filePath, lineNumber, 'Consider using path alias @/ instead of relative path: ' + importPath);
          }
        }
      }

      // Check for missing exports
      if (line.includes('class IOE') && !line.includes('export')) {
        this.addWarning(filePath, lineNumber, 'IOE classes should typically be exported');
      }
    }
  }

  // Check code complexity
  checkComplexity(filePath, content) {
    const lines = content.split('\n');
    let currentFunction = null;
    let functionComplexity = 0;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Track function start
      const functionMatch = line.match(/(function|method)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (functionMatch || line.includes('):')) {
        if (currentFunction) {
          // Report previous function complexity
          if (functionComplexity > 10) {
            this.addWarning(filePath, lineNumber - 1, 'Function \'' + currentFunction + '\' has high complexity (' + functionComplexity + '). Consider refactoring.');
          }
        }
        currentFunction = functionMatch ? functionMatch[2] : 'anonymous';
        functionComplexity = 1;
        braceDepth = 0;
      }

      // Count complexity indicators
      if (currentFunction) {
        if (line.includes('if') || line.includes('else') || line.includes('switch') || 
            line.includes('case') || line.includes('for') || line.includes('while') ||
            line.includes('catch') || line.includes('&&') || line.includes('||')) {
          functionComplexity++;
        }

        if (line.includes('{')) braceDepth++;
        if (line.includes('}')) {
          braceDepth--;
          if (braceDepth <= 0) {
            // End of function
            if (functionComplexity > 10) {
              this.addWarning(filePath, lineNumber, 'Function \'' + currentFunction + '\' has high complexity (' + functionComplexity + '). Consider refactoring.');
            }
            currentFunction = null;
          }
        }
      }

      // Check line length
      if (line.length > 120) {
        this.addInfo(filePath, lineNumber, 'Line exceeds 120 characters (' + line.length + ')');
      }
    }

    this.stats.linesOfCode += lines.length;
  }

  // Check project structure
  checkProjectStructure(projectRoot) {
    // Check required directories
    IOE_RULES.structure.requiredDirectories.forEach(dir => {
      const dirPath = path.join(projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        this.addError(projectRoot, 0, 'Missing required directory: ' + dir);
      }
    });

    // Check required files
    IOE_RULES.structure.requiredFiles.forEach(file => {
      const filePath = path.join(projectRoot, file);
      if (!fs.existsSync(filePath)) {
        this.addError(projectRoot, 0, 'Missing required file: ' + file);
      }
    });

    // Check src subdirectories
    const srcPath = path.join(projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      IOE_RULES.structure.srcSubdirectories.forEach(subdir => {
        const subdirPath = path.join(srcPath, subdir);
        if (!fs.existsSync(subdirPath)) {
          this.addWarning(projectRoot, 0, 'Recommended src subdirectory missing: ' + subdir);
        }
      });
    }
  }

  // Analyze a single file
  analyzeFile(filePath) {
    this.stats.filesChecked++;
    const content = this.readFile(filePath);
    
    if (!content) return;

    this.checkFileHeader(filePath, content);
    this.checkNamingConventions(filePath, content);
    this.checkDocumentation(filePath, content);
    this.checkImportsExports(filePath, content);
    this.checkComplexity(filePath, content);
  }

  // Run complete analysis
  analyze(projectRoot = process.cwd()) {
    this.log('🔍 IOE TypeScript Lint Checker', 'bright');
    this.log('==============================', 'cyan');
    this.log('');
    this.log('📁 Analyzing project: ' + projectRoot, 'blue');
    this.log('');

    // Check project structure
    this.checkProjectStructure(projectRoot);

    // Get all TypeScript files
    const tsFiles = this.getTypeScriptFiles(projectRoot);
    
    if (tsFiles.length === 0) {
      this.log('⚠️  No TypeScript files found in project', 'yellow');
      return;
    }

    this.log('📄 Found ' + tsFiles.length + ' TypeScript files', 'cyan');
    this.log('');

    // Analyze each file
    tsFiles.forEach(filePath => {
      this.analyzeFile(filePath);
    });

    // Display results
    this.displayResults();
  }

  // Display analysis results
  displayResults() {
    this.log('📊 Analysis Results', 'bright');
    this.log('==================', 'cyan');
    this.log('');

    // Statistics
    this.log('📈 Statistics:', 'yellow');
    this.log('  Files checked: ' + this.stats.filesChecked, 'cyan');
    this.log('  Classes found: ' + this.stats.classesFound, 'cyan');
    this.log('  Interfaces found: ' + this.stats.interfacesFound, 'cyan');
    this.log('  Functions found: ' + this.stats.functionsFound, 'cyan');
    this.log('  Lines of code: ' + this.stats.linesOfCode, 'cyan');
    this.log('');

    // Errors
    if (this.errors.length > 0) {
      this.log('❌ Errors (' + this.errors.length + '):', 'red');
      this.errors.forEach(error => {
        this.log('  ' + error.file + ':' + error.line + ' - ' + error.message, 'red');
      });
      this.log('');
    }

    // Warnings
    if (this.warnings.length > 0) {
      this.log('⚠️  Warnings (' + this.warnings.length + '):', 'yellow');
      this.warnings.slice(0, 20).forEach(warning => {
        this.log('  ' + warning.file + ':' + warning.line + ' - ' + warning.message, 'yellow');
      });
      if (this.warnings.length > 20) {
        this.log('  ... and ' + (this.warnings.length - 20) + ' more warnings', 'yellow');
      }
      this.log('');
    }

    // Info messages
    if (this.info.length > 0) {
      this.log('ℹ️  Suggestions (' + this.info.length + '):', 'blue');
      this.info.slice(0, 10).forEach(info => {
        this.log('  ' + info.file + ':' + info.line + ' - ' + info.message, 'blue');
      });
      if (this.info.length > 10) {
        this.log('  ... and ' + (this.info.length - 10) + ' more suggestions', 'blue');
      }
      this.log('');
    }

    // Summary
    const totalIssues = this.errors.length + this.warnings.length;
    if (totalIssues === 0) {
      this.log('✅ All checks passed! Your code follows IOE standards.', 'green');
    } else {
      this.log('📋 Summary:', 'yellow');
      if (this.errors.length > 0) {
        this.log('  🔴 ' + this.errors.length + ' errors must be fixed', 'red');
      }
      if (this.warnings.length > 0) {
        this.log('  🟡 ' + this.warnings.length + ' warnings should be addressed', 'yellow');
      }
      if (this.info.length > 0) {
        this.log('  🔵 ' + this.info.length + ' suggestions for improvement', 'blue');
      }
    }

    this.log('');
    this.log('🎯 For more details on IOE coding standards, see: docs/CODING_GUIDELINES.md', 'magenta');
  }
}

// Run the linter if called directly
if (require.main === module) {
  const checker = new IOELintChecker();
  const projectPath = process.argv[2] || process.cwd();
  checker.analyze(projectPath);
}

module.exports = { IOELintChecker };