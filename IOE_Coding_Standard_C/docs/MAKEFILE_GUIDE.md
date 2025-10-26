# IOE Coding Standards - Makefile Guide

## Tổng quan
Makefile trong IOE Coding Standards được thiết kế để hỗ trợ toàn diện quá trình phát triển phần mềm, từ build đơn giản đến các quy trình quality assurance và documentation.

## 1. Cấu trúc Makefile

### 1.1 Tổ chức theo sections
```makefile
# General Information Header
# Compiler and Tool Configuration  
# Project Configuration
# Tool Configuration
# Build Targets
# Alternative Build Targets
# Code Quality Targets
# Documentation Targets
# Run and Test Targets
# Maintenance Targets
# Information and Help Targets
```

### 1.2 Variables chính
```makefile
# Compiler settings
CC ?= gcc                    # Primary compiler (overridable)
ARM_CC = arm-none-eabi-gcc  # ARM compiler
CLANG_CC = clang            # Alternative compiler

# Compiler flags
CFLAGS_BASE = -std=c11 -pedantic
CFLAGS_WARNINGS = -Wall -Wextra -Wshadow -Wstrict-prototypes
CFLAGS_DEBUG = -g -O0 -DDEBUG=1
CFLAGS_RELEASE = -O2 -DNDEBUG=1

# Project structure
SRC_DIR = src
INCLUDE_DIR = include
TARGET = project_name
```

## 2. Build Targets

### 2.1 Basic Build Commands
```bash
# Default build (debug mode)
make
make all

# Clean build artifacts
make clean

# Complete rebuild
make rebuild
```

### 2.2 Alternative Build Types
```bash
# Debug build with AddressSanitizer
make debug

# Optimized release build
make release

# Embedded ARM build
make embedded

# Static library build
make library
```

### 2.3 Examples Build
```bash
# Build all examples
make examples
```

## 3. Code Quality Targets

### 3.1 Code Formatting
```bash
# Format all source files với clang-format
make format
```

**Requirements**: clang-format installed
```bash
# Ubuntu/Debian
sudo apt-get install clang-format

# macOS
brew install clang-format
```

**Configuration**: Format style được define trong Makefile:
```makefile
FORMAT_STYLE = -style="{BasedOnStyle: GNU, IndentWidth: 4, TabWidth: 4, UseTab: Never}"
```

### 3.2 Static Analysis
```bash
# Run static analysis với cppcheck
make check
```

**Requirements**: cppcheck installed
```bash
# Ubuntu/Debian
sudo apt-get install cppcheck

# macOS  
brew install cppcheck
```

**Analyzer settings**:
```makefile
ANALYZER_FLAGS = --enable=all --std=c11 --suppress=missingIncludeSystem --quiet
```

### 3.3 Combined Quality Check
```bash
# Run both format and static analysis
make quality
```

## 4. Documentation Generation

### 4.1 Generate Documentation
```bash
# Generate Doxygen documentation
make docs
```

**Requirements**: Doxygen installed
```bash
# Ubuntu/Debian
sudo apt-get install doxygen graphviz

# macOS
brew install doxygen graphviz
```

**Output**: Documentation được generate vào `docs/html/`

### 4.2 Doxygen Configuration
Tạo file `docs/Doxyfile`:
```bash
# Generate default Doxyfile
cd docs/
doxygen -g
```

**Recommended settings** trong Doxyfile:
```
PROJECT_NAME           = "IOE Coding Standards"
INPUT                  = ../src ../include
RECURSIVE              = YES
GENERATE_HTML          = YES
GENERATE_LATEX         = NO
EXTRACT_ALL            = YES
EXTRACT_PRIVATE        = YES
EXTRACT_STATIC         = YES
```

## 5. Runtime và Testing

### 5.1 Execute Program
```bash
# Run the compiled program
make run

# Run basic functionality test
make test

# Run program với arguments
./target_name --verbose --test
```

### 5.2 Memory Analysis
```bash
# Run với Valgrind memory leak detection
make memcheck
```

**Requirements**: Valgrind installed
```bash
# Ubuntu/Debian
sudo apt-get install valgrind

# macOS (limited support)
# Use AddressSanitizer instead: make debug
```

## 6. Compiler Override

### 6.1 Change Compiler
```bash
# Use different compiler
make CC=clang
make CC=arm-none-eabi-gcc

# Use specific GCC version
make CC=gcc-9
```

### 6.2 Custom Flags
```bash
# Add extra CFLAGS
make CFLAGS="-Wall -Wextra -O3 -DCUSTOM_DEFINE=1"

# Debug with specific flags
make debug CFLAGS="-g -O0 -DDEBUG=1 -fsanitize=address,undefined"
```

## 7. Dependency Management

### 7.1 Automatic Dependencies
Makefile tự động track header dependencies:
```makefile
# Include dependency files
-include $(DEPS)

# Generate dependencies during compilation
%.o: %.c
    $(CC) $(CFLAGS) -MMD -MP -c $< -o $@
```

### 7.2 Manual Dependency Update
```bash
# Clean và rebuild để update dependencies
make clean
make
```

## 8. Multi-target Build

### 8.1 Cross-compilation Setup
```makefile
# ARM Cortex-M4 settings
embedded: CC = $(ARM_CC)
embedded: CFLAGS = $(CFLAGS_BASE) $(CFLAGS_WARNINGS) $(CFLAGS_EMBEDDED) $(INCLUDE_DIRS)
embedded: $(TARGET)
```

### 8.2 Platform-specific Builds
```bash
# Build cho different platforms
make embedded          # ARM Cortex-M
make CC=x86_64-linux-gnu-gcc  # Cross-compile cho Linux
```

## 9. Advanced Usage

### 9.1 Parallel Build
```bash
# Build với multiple jobs
make -j4              # Use 4 cores
make -j$(nproc)       # Use all available cores
```

### 9.2 Verbose Output
```bash
# Show detailed build commands
make V=1

# Show variables
make info
```

### 9.3 Custom Targets
Thêm custom targets vào Makefile:
```makefile
# Custom target example
flash: $(TARGET)
    @echo "Flashing $(TARGET) to device..."
    st-flash write $(TARGET).bin 0x8000000

install: $(TARGET)
    @echo "Installing $(TARGET)..."
    cp $(TARGET) /usr/local/bin/

.PHONY: flash install
```

## 10. Integration với IDEs

### 10.1 VS Code Integration
Tạo `.vscode/tasks.json`:
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build Project",
            "type": "shell",
            "command": "make",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        },
        {
            "label": "Clean Build",
            "type": "shell", 
            "command": "make",
            "args": ["clean"],
            "group": "build"
        }
    ]
}
```

### 10.2 CLion Integration
CLion tự động detect Makefile projects. Configure trong `Settings > Build > Makefile`:
- **Makefile**: `./Makefile`
- **Build Directory**: `./build`
- **Arguments**: `-j$(nproc)`

## 11. Troubleshooting

### 11.1 Common Issues

**Problem**: "make: command not found"
```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# macOS
xcode-select --install
```

**Problem**: "clang-format: command not found"
```bash
# Install clang-format
sudo apt-get install clang-format  # Ubuntu
brew install clang-format          # macOS
```

**Problem**: Compilation errors với ARM-GCC
```bash
# Install ARM toolchain
sudo apt-get install gcc-arm-none-eabi

# Verify installation
arm-none-eabi-gcc --version
```

### 11.2 Debug Makefile Issues
```bash
# Show make variables
make info

# Dry run (show commands without executing)
make -n

# Debug make execution
make --debug=v
```

## 12. Best Practices

### 12.1 Development Workflow
```bash
# Recommended development cycle
make clean          # Start clean
make format         # Format code
make check          # Static analysis  
make debug          # Build debug version
make test           # Run tests
make docs           # Update documentation
```

### 12.2 CI/CD Integration
```bash
# Typical CI pipeline commands
make clean
make quality        # Format + static analysis
make release        # Build release
make test           # Run tests
make docs           # Generate docs
```

### 12.3 Release Workflow
```bash
# Release build workflow
make distclean      # Deep clean
make release        # Optimized build
make check          # Final quality check
make docs           # Generate documentation
```

---

## Quick Reference

### Essential Commands
| Command | Description |
|---------|-------------|
| `make` | Build project (default debug) |
| `make clean` | Remove build files |
| `make format` | Format code |
| `make check` | Static analysis |
| `make docs` | Generate documentation |
| `make run` | Execute program |
| `make help` | Show all available targets |

### Build Types
| Command | Description |
|---------|-------------|
| `make debug` | Debug build + AddressSanitizer |
| `make release` | Optimized release build |
| `make embedded` | ARM Cortex-M build |
| `make library` | Static library build |

**IOE INNOVATION Team - Makefile Guide v1.0.0**  
*Last Updated: 2025-10-23*