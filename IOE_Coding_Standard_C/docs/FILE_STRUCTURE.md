# IOE Coding Standards - File Structure Guide

## Tổng quan
Tài liệu này mô tả cấu trúc file và folder chuẩn cho các dự án của IOE INNOVATION Team, được thiết kế để đảm bảo tính nhất quán và dễ bảo trì.

## 1. Cấu trúc Project chính

### 1.1 Root Directory Structure
```
project_name/
├── README.md                    # Tài liệu chính của project
├── Makefile                     # Build system configuration
├── .gitignore                   # Git ignore rules  
├── LICENSE                      # License file
├── CHANGELOG.md                 # Change log
├── src/                         # Source code directory
├── include/                     # Public header files
├── lib/                         # Third-party libraries
├── examples/                    # Example code và demos
├── tests/                       # Unit tests và test code
├── docs/                        # Documentation files
├── tools/                       # Development tools và scripts
├── build/                       # Build output (gitignored)
└── .vscode/                     # VS Code configuration
```

### 1.2 Current Project Structure (IOE_Coding_Standard_C)
```
IOE_Coding_Standard_C/
├── README.md                    # Project documentation
├── Makefile                     # Build configuration
├── main.c                       # Main application entry point
│
├── src/                         # Implementation files
│   └── led.c               # LED module implementation
│
├── include/                     # Public headers
│   ├── common.h            # Common definitions and types
│   └── led.h               # LED module interface
│
├── docs/                        # Documentation files
│   ├── CODING_GUIDELINES.md    # Coding standards and conventions
│   ├── FILE_STRUCTURE.md       # This file - project structure guide
│   ├── MAKEFILE_GUIDE.md       # Makefile usage and configuration
│   └── ._Embedded C Coding Standard.docx  # Additional documentation
│
├── examples/                    # Example code and demos (currently empty)
│   └── (prepared for future examples)
│
├── templates/                   # Code templates
│   ├── template.c              # C source file template
│   └── template.h              # Header file template  
│
└── tools/                       # Development tools
    └── project_generator.py    # Project generation utility
```

### 1.3 Recommended Full Structure (For Future Expansion)
```
project_name/
├── README.md
├── Makefile
├── .gitignore
├── LICENSE
├── CHANGELOG.md
├── main.c                       # Main application (for simple projects)
│
├── src/                         # Implementation files
│   ├── module1.c                # Module implementations
│   ├── module2.c
│   └── utils/                   # Utility functions
│       ├── utilities.c
│       └── math_helpers.c
│
├── include/                     # Public headers
│   ├── project_config.h         # Project configuration
│   ├── common.h                # Common definitions
│   ├── module1.h               # Module interfaces
│   ├── module2.h
│   └── utils/                   # Utility headers
│       ├── utilities.h
│       └── math_helpers.h
│
├── lib/                         # Third-party libraries
│   ├── freertos/               # FreeRTOS source
│   ├── stm32_hal/              # STM32 HAL library
│   └── README.md               # Library documentation
│
├── examples/                    # Examples và demos
│   ├── basic_usage/            # Basic example
│   │   ├── main.c
│   │   ├── Makefile
│   │   └── README.md
│   ├── advanced_demo/          # Advanced example
│   │   ├── src/
│   │   ├── include/
│   │   ├── Makefile
│   │   └── README.md
│   └── README.md               # Examples overview
│
├── tests/                       # Test code
│   ├── unit/                   # Unit tests
│   │   ├── test_module1.c
│   │   └── test_module2.c
│   ├── integration/            # Integration tests
│   │   └── test_system.c
│   ├── mocks/                  # Mock implementations
│   │   ├── mock_hardware.c
│   │   └── mock_hardware.h
│   ├── Makefile               # Test build configuration
│   └── README.md              # Test documentation
│
├── docs/                        # Documentation
│   ├── api/                    # API documentation
│   │   ├── html/              # Generated HTML docs
│   │   └── Doxyfile           # Doxygen configuration
│   ├── design/                 # Design documents
│   │   ├── architecture.md
│   │   └── requirements.md
│   ├── user_guide/            # User guides
│   │   ├── getting_started.md
│   │   └── advanced_usage.md
│   ├── CODING_GUIDELINES.md   # Coding standards
│   ├── FILE_STRUCTURE.md      # Project structure guide
│   └── MAKEFILE_GUIDE.md      # Build system documentation
│
├── templates/                   # Code templates
│   ├── template.c              # Source file template
│   ├── template.h              # Header file template
│   └── README.md              # Template usage guide
│
├── tools/                       # Development tools
│   ├── scripts/               # Build và utility scripts
│   │   ├── build.sh
│   │   ├── format_code.sh
│   │   └── generate_docs.sh
│   ├── generators/            # Code generators
│   │   ├── module_generator.py
│   │   └── template_generator.py
│   └── README.md              # Tools documentation
│
├── build/                       # Build artifacts (gitignored)
│   ├── debug/                 # Debug build output
│   ├── release/               # Release build output
│   └── test/                  # Test build output
│
└── .vscode/                     # VS Code configuration
    ├── settings.json          # Workspace settings
    ├── tasks.json             # Build tasks
    ├── launch.json            # Debug configuration
    └── c_cpp_properties.json  # C/C++ extension config
```

## 2. File Naming Conventions

### 2.1 Source Files
```
module_name.c          # Module implementation
module_name.h          # Module interface
main.c                 # Main application file
project_config.h       # Project-wide configuration
```

### 2.2 Directory Names
```
src/                   # Source code (lowercase)
include/               # Headers (lowercase)  
examples/              # Examples (lowercase)
docs/                  # Documentation (lowercase)
tools/                 # Tools và scripts (lowercase)
```

### 2.3 Special Files
```
README.md             # Markdown documentation
Makefile              # Build configuration (no extension)
.gitignore            # Git ignore rules
CHANGELOG.md          # Version history
LICENSE               # License file (no extension)
```

## 3. Header File Organization

### 3.1 Public vs Private Headers
```
include/              # Public headers (API)
├── led_controller.h # Public API for LED module (renamed from led.h)
├── button_manager.h # Public API for button module
└── common.h         # Common definitions (renamed from common.h)

src/                  # Private headers (internal, if needed)
├── led_internal.h   # Private LED definitions
├── button_priv.h    # Private button definitions
└── hardware_abs.h   # Hardware abstraction
```

### 3.2 Header Dependencies
```c
/* Dependency hierarchy example */
common.h          /* No dependencies */
├── types.h       /* Basic types */
├── errors.h      /* Error codes */
└── config.h      /* Configuration */

module.h          /* Depends on common */
├── #include "common.h"
└── /* Module-specific definitions */
```

## 4. Source Code Organization

### 4.1 Module Structure
```c
/* Single responsibility principle */
src/
├── led_controller.c  # LED functionality only (renamed from led.c)
├── button_manager.c  # Button functionality only  
├── timer_handler.c   # Timer functionality only
└── main.c            # Application logic (can be in root for simple projects)
```

### 4.2 Layered Architecture
```
Application Layer     # main.c, application logic
├── Service Layer     # High-level services
├── Driver Layer      # Hardware drivers
└── HAL Layer         # Hardware Abstraction Layer
```

## 5. Build Output Management

### 5.1 Build Directory Structure
```
build/
├── debug/            # Debug build artifacts
│   ├── obj/         # Object files
│   ├── dep/         # Dependency files
│   └── bin/         # Executable output
├── release/          # Release build artifacts
│   ├── obj/
│   ├── dep/
│   └── bin/
└── test/            # Test build artifacts
    ├── obj/
    ├── dep/
    └── bin/
```

### 5.2 Gitignore Configuration
```gitignore
# Build artifacts
build/
*.o
*.d
*.bin
*.hex
*.elf

# IDE files
.vscode/settings.json
*.code-workspace

# System files
.DS_Store
Thumbs.db

# Temporary files
*~
*.tmp
*.log
```

## 6. Example Projects

### 6.1 Current IOE C Standard Project (Simple Module)
```
IOE_Coding_Standard_C/
├── README.md
├── Makefile
├── main.c                       # Main application
├── src/
│   └── led.c               # LED module implementation
├── include/
│   ├── common.h            # Common definitions
│   └── led.h               # LED module interface
├── docs/
│   ├── CODING_GUIDELINES.md
│   ├── FILE_STRUCTURE.md
│   └── MAKEFILE_GUIDE.md
├── templates/
│   ├── template.c
│   └── template.h
├── tools/
│   └── project_generator.py
└── examples/                    # (prepared for expansion)
```

### 6.2 Recommended Multi-Module Project
```
iot_device_fw/
├── README.md
├── Makefile
├── main.c                       # Main application (for simple projects)
├── src/
│   ├── sensor_control.c         # Sensor management module
│   ├── communication.c          # Communication module
│   └── data_storage.c          # Storage module
├── include/
│   ├── common.h                # Common definitions
│   ├── sensor_control.h        # Sensor interface
│   ├── communication.h         # Communication interface
│   └── data_storage.h          # Storage interface
├── lib/
│   ├── lwip/
│   └── fatfs/
├── examples/
│   ├── sensor_demo/
│   └── communication_test/
├── docs/
│   ├── CODING_GUIDELINES.md
│   ├── FILE_STRUCTURE.md
│   ├── architecture.md
│   └── api_reference/
├── templates/
│   ├── template.c
│   └── template.h
└── tools/
    ├── project_generator.py
    └── format_checker.py
```

## 7. Configuration Management

### 7.1 Project Configuration Files
```
project_config.h      # Compile-time configuration
├── #define FEATURE_ENABLED    1
├── #define MAX_BUFFER_SIZE    256
└── #define VERSION_STRING     "1.0.0"

runtime_config.c      # Runtime configuration
├── Configuration structures
├── Default values
└── Validation functions
```

### 7.2 Environment-specific Configs
```
config/
├── debug_config.h    # Debug build configuration
├── release_config.h  # Release build configuration
├── test_config.h     # Test build configuration
└── hardware/         # Hardware-specific configs
    ├── stm32f4_config.h
    └── linux_config.h
```

## 8. Documentation Structure

### 8.1 Documentation Hierarchy
```
docs/
├── README.md         # Documentation overview
├── getting_started/  # Quick start guides
├── user_guide/       # Comprehensive user documentation
├── developer_guide/  # Development documentation
├── api_reference/    # Generated API docs
└── design/          # Design documents
```

### 8.2 Doxygen Integration
```
docs/
├── Doxyfile         # Doxygen configuration
├── html/            # Generated HTML documentation
├── latex/           # Generated LaTeX documentation
└── mainpage.md      # Doxygen main page
```

## 9. Testing Structure

### 9.1 Test Organization
```
tests/
├── unit/            # Unit tests
│   ├── test_led.c
│   ├── test_button.c
│   └── test_utils.c
├── integration/     # Integration tests
│   ├── test_system_init.c
│   └── test_communication.c
├── functional/      # Functional tests
│   └── test_end_to_end.c
├── mocks/          # Mock implementations
│   ├── mock_gpio.c
│   └── mock_timer.c
└── fixtures/       # Test data và fixtures
    ├── test_data.h
    └── expected_results.h
```

### 9.2 Test Build Integration
```makefile
# Test targets in Makefile
test: $(TEST_OBJECTS)
	$(CC) $(TEST_OBJECTS) -o test_runner -lcunit
	./test_runner

unit_test: $(UNIT_TEST_OBJECTS)
	$(CC) $(UNIT_TEST_OBJECTS) -o unit_runner -lcunit
	./unit_runner
```

## 10. Multi-Platform Support

### 10.1 Platform-specific Files
```
src/
├── common/          # Platform-independent code
│   ├── algorithm.c
│   └── protocol.c
├── stm32/          # STM32-specific implementation
│   ├── gpio_stm32.c
│   └── timer_stm32.c
├── linux/          # Linux-specific implementation
│   ├── gpio_linux.c
│   └── timer_linux.c
└── platform.h      # Platform abstraction interface
```

### 10.2 Conditional Compilation
```c
/* Platform detection */
#if defined(STM32F4XX)
    #include "stm32f4xx_hal.h"
    #define PLATFORM_STM32F4
#elif defined(__linux__)
    #include <unistd.h>
    #define PLATFORM_LINUX
#endif

/* Platform-specific implementations */
#ifdef PLATFORM_STM32F4
    void gpio_init_stm32(void);
#elif PLATFORM_LINUX
    void gpio_init_linux(void);
#endif
```

## 11. Best Practices

### 11.1 File Organization Rules
- **One module per file**: Mỗi .c file implement một module duy nhất
- **Clear separation**: Tách biệt public và private interfaces
- **Consistent naming**: Sử dụng consistent naming convention
- **Minimal dependencies**: Giảm thiểu dependencies giữa modules

### 11.2 Directory Management
- **Logical grouping**: Group related files trong cùng directory
- **Shallow hierarchy**: Tránh directory nesting quá sâu
- **Clear purpose**: Mỗi directory có purpose rõ ràng
- **Documentation**: Mỗi directory có README.md explaining purpose

### 11.3 Build Artifact Management
- **Separate build outputs**: Tách biệt debug/release/test builds
- **Clean build process**: Support clean rebuild
- **Reproducible builds**: Ensure consistent build results
- **Version tracking**: Include version info trong build artifacts

---

## Quick Reference

### Standard Directories
| Directory | Purpose | Required |
|-----------|---------|----------|
| `src/` | Source code implementation | [OK] |
| `include/` | Public header files | [OK] |
| `examples/` | Example code | [RECOMMENDED] |
| `docs/` | Documentation | [RECOMMENDED] |
| `tests/` | Test code | [RECOMMENDED] |
| `tools/` | Development tools | [OPTIONAL] |
| `lib/` | Third-party libraries | [OPTIONAL] |
| `build/` | Build artifacts (gitignored) | [GENERATED] |

**Legend**: [OK] Required, [RECOMMENDED] Recommended, [OPTIONAL] Optional, [GENERATED] Generated

### Essential Files
| File | Purpose | Required |
|------|---------|----------|
| `README.md` | Project documentation | [OK] |
| `Makefile` | Build configuration | [OK] |
| `.gitignore` | Git ignore rules | [OK] |
| `LICENSE` | License information | [RECOMMENDED] |
| `CHANGELOG.md` | Version history | [RECOMMENDED] |

**IOE INNOVATION Team - File Structure Guide v1.0.0**  
*Last Updated: 2025-10-23*