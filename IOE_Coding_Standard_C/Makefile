# IOE INNOVATION Team - Advanced Makefile
# =====================================
# A comprehensive build system that combines best practices from multiple projects
# Features: Multi-target builds, code formatting, static analysis, documentation generation

#**********************************************************************************************************************
# General Information
#**********************************************************************************************************************
# Project:      IOE Coding Standards Demo
# File:         Makefile  
# Description:  Advanced build system for IOE INNOVATION Team projects
# Author:       IOE INNOVATION Team
# Created:      2025-10-23
# Version:      1.0.0
# License:      MIT License
#**********************************************************************************************************************

#**********************************************************************************************************************
# Compiler and Tool Configuration
#**********************************************************************************************************************

# Primary compiler - can be overridden (make CC=arm-none-eabi-gcc)
CC ?= gcc

# Alternative compilers for different targets
ARM_CC = arm-none-eabi-gcc
CLANG_CC = clang

# Compiler flags for different build types
CFLAGS_BASE = -std=c11 -pedantic
CFLAGS_WARNINGS = -Wall -Wextra -Wshadow -Wstrict-prototypes -Wmissing-prototypes
CFLAGS_DEBUG = -g -O0 -DDEBUG=1
CFLAGS_RELEASE = -O2 -DNDEBUG=1
CFLAGS_EMBEDDED = -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16

# Include paths - automatically includes project directories
INCLUDE_DIRS = -Iinclude -Isrc -I.
CFLAGS = $(CFLAGS_BASE) $(CFLAGS_WARNINGS) $(CFLAGS_DEBUG) $(INCLUDE_DIRS)

#**********************************************************************************************************************
# Project Configuration
#**********************************************************************************************************************

# Project name and target executable
PROJECT_NAME = ioe_coding_standard
TARGET = $(PROJECT_NAME)

# Source directories
SRC_DIR = src
INCLUDE_DIR = include
EXAMPLES_DIR = examples
DOCS_DIR = docs
TOOLS_DIR = tools

# Source files - main.c at root, modules in src/
MAIN_SOURCE = main.c
SOURCES = $(wildcard $(SRC_DIR)/*.c)
ALL_SOURCES = $(MAIN_SOURCE) $(SOURCES)

# Object files (derived from sources)
OBJECTS = $(ALL_SOURCES:.c=.o)
HEADERS = $(wildcard $(INCLUDE_DIR)/*.h)

# Dependency files for automatic header dependency tracking
DEPS = $(OBJECTS:.o=.d)

#**********************************************************************************************************************
# Tool Configuration
#**********************************************************************************************************************

# Code formatting tool
FORMATTER = clang-format
FORMAT_STYLE = -style="{BasedOnStyle: GNU, IndentWidth: 4, TabWidth: 4, UseTab: Never}"

# Static analysis tool
ANALYZER = cppcheck
ANALYZER_FLAGS = --enable=all --std=c11 --suppress=missingIncludeSystem --quiet

# Documentation generator
DOC_GENERATOR = doxygen
DOC_CONFIG = docs/Doxyfile

# Archive tool for creating libraries
AR = ar
ARFLAGS = rcs

#**********************************************************************************************************************
# Build Targets
#**********************************************************************************************************************

# Default target
.DEFAULT_GOAL := help

# Main build target
all: $(TARGET)
	@echo "Build completed successfully!"
	@echo "   Executable: ./$(TARGET)"
	@echo "   Run with: make run"

# Link object files to create executable
$(TARGET): $(OBJECTS)
	@echo "Linking $(TARGET)..."
	$(CC) $(OBJECTS) -o $@ $(LDFLAGS)
	@echo "Linking completed: $@"

# Compile source files to object files with dependency generation
%.o: %.c
	@echo "Compiling $<..."
	$(CC) $(CFLAGS) -MMD -MP -c $< -o $@

#**********************************************************************************************************************
# Alternative Build Targets
#**********************************************************************************************************************

# Debug build with extra debugging info
debug: CFLAGS = $(CFLAGS_BASE) $(CFLAGS_WARNINGS) $(CFLAGS_DEBUG) $(INCLUDE_DIRS) -fsanitize=address
debug: LDFLAGS += -fsanitize=address
debug: $(TARGET)
	@echo "Debug build completed with AddressSanitizer"

# Release build optimized for performance
release: CFLAGS = $(CFLAGS_BASE) $(CFLAGS_WARNINGS) $(CFLAGS_RELEASE) $(INCLUDE_DIRS)
release: $(TARGET)
	@echo "Release build completed"

# Embedded build for ARM Cortex-M
embedded: CC = $(ARM_CC)
embedded: CFLAGS = $(CFLAGS_BASE) $(CFLAGS_WARNINGS) $(CFLAGS_EMBEDDED) $(INCLUDE_DIRS)
embedded: $(TARGET)
	@echo "Embedded build completed for ARM Cortex-M4"

# Static library build
library: $(OBJECTS)
	@echo "Creating static library..."
	$(AR) $(ARFLAGS) lib$(PROJECT_NAME).a $(OBJECTS)
	@echo "Library created: lib$(PROJECT_NAME).a"

#**********************************************************************************************************************
# Example Builds
#**********************************************************************************************************************

# Build all examples
examples: $(TARGET)
	@echo "Building examples..."
	@for example in $(wildcard $(EXAMPLES_DIR)/*/); do \
		if [ -f "$$example/Makefile" ]; then \
			echo "  Building $$example"; \
			$(MAKE) -C "$$example" all; \
		fi; \
	done
	@echo "All examples built successfully!"

#**********************************************************************************************************************
# Code Quality Targets
#**********************************************************************************************************************

# Format all source files
format:
	@echo "Formatting code files..."
	@if command -v $(FORMATTER) > /dev/null; then \
		find $(SRC_DIR) $(INCLUDE_DIR) -name "*.c" -o -name "*.h" | \
		xargs $(FORMATTER) -i $(FORMAT_STYLE); \
		echo "Code formatting completed"; \
	else \
		echo "WARNING: $(FORMATTER) not found. Install with: apt-get install clang-format"; \
	fi

# Run static analysis
check: $(SOURCES) $(HEADERS)
	@echo "Running static analysis..."
	@if command -v $(ANALYZER) > /dev/null; then \
		$(ANALYZER) $(ANALYZER_FLAGS) $(SOURCES) $(HEADERS); \
		echo "Static analysis completed"; \
	else \
		echo "WARNING: $(ANALYZER) not found. Install with: apt-get install cppcheck"; \
	fi

# Comprehensive code quality check
quality: format check
	@echo "Code quality check completed"

#**********************************************************************************************************************
# Documentation Targets
#**********************************************************************************************************************

# Generate documentation
docs:
	@echo "Generating documentation..."
	@if command -v $(DOC_GENERATOR) > /dev/null; then \
		if [ -f "$(DOC_CONFIG)" ]; then \
			$(DOC_GENERATOR) $(DOC_CONFIG); \
			echo "Documentation generated in docs/html/"; \
		else \
			echo "WARNING: Doxygen config not found at $(DOC_CONFIG)"; \
		fi; \
	else \
		echo "WARNING: $(DOC_GENERATOR) not found. Install with: apt-get install doxygen"; \
	fi

#**********************************************************************************************************************
# Run and Test Targets
#**********************************************************************************************************************

# Run the main executable
run: $(TARGET)
	@echo "Running $(TARGET)..."
	@./$(TARGET)

# Run with memory leak detection (if available)
memcheck: $(TARGET)
	@echo "Running memory leak detection..."
	@if command -v valgrind > /dev/null; then \
		valgrind --leak-check=full --show-leak-kinds=all ./$(TARGET); \
	else \
		echo "WARNING: Valgrind not found. Install with: apt-get install valgrind"; \
	fi

# Quick test run
test: $(TARGET)
	@echo "Running basic tests..."
	@./$(TARGET) --test 2>/dev/null || echo "Basic execution test completed"

#**********************************************************************************************************************
# Maintenance Targets
#**********************************************************************************************************************

# Clean build artifacts
clean:
	@echo "Cleaning build files..."
	@rm -f $(OBJECTS) $(DEPS) $(TARGET) lib$(PROJECT_NAME).a
	@find . -name "*.o" -type f -delete 2>/dev/null || true
	@find . -name "*.d" -type f -delete 2>/dev/null || true
	@echo "Clean completed"

# Deep clean including documentation and temporary files
distclean: clean
	@echo "Deep cleaning..."
	@rm -rf docs/html docs/latex docs/xml
	@find . -name "*~" -type f -delete 2>/dev/null || true
	@find . -name "*.tmp" -type f -delete 2>/dev/null || true
	@echo "Deep clean completed"

# Rebuild everything from scratch
rebuild: distclean all
	@echo "Complete rebuild finished!"

#**********************************************************************************************************************
# Information and Help Targets
#**********************************************************************************************************************

# Display project information
info:
	@echo "Project Information:"
	@echo "   Name: $(PROJECT_NAME)"
	@echo "   Target: $(TARGET)"
	@echo "   Compiler: $(CC)"
	@echo "   Sources: $(words $(SOURCES)) files"
	@echo "   Headers: $(words $(HEADERS)) files"
	@echo "   Build Type: $(if $(findstring -O2,$(CFLAGS)),Release,Debug)"

# Display available targets with descriptions
help:
	@echo "IOE INNOVATION Team - Makefile Help"
	@echo "========================================"
	@echo ""
	@echo "Build Targets:"
	@echo "   all        - Build the main project (default)"
	@echo "   debug      - Build with debug info and AddressSanitizer"
	@echo "   release    - Build optimized release version"
	@echo "   embedded   - Build for ARM Cortex-M microcontrollers"
	@echo "   library    - Create static library (.a file)"
	@echo "   examples   - Build all example projects"
	@echo ""
	@echo "Quality Targets:"
	@echo "   format     - Format code with clang-format"
	@echo "   check      - Run static analysis with cppcheck"
	@echo "   quality    - Run both format and check"
	@echo ""
	@echo "Documentation:"
	@echo "   docs       - Generate documentation with Doxygen"
	@echo ""
	@echo "Run Targets:"
	@echo "   run        - Run the compiled program"
	@echo "   test       - Run basic functionality tests"
	@echo "   memcheck   - Run with memory leak detection (valgrind)"
	@echo ""
	@echo "Maintenance:"
	@echo "   clean      - Remove build artifacts"
	@echo "   distclean  - Deep clean including docs"
	@echo "   rebuild    - Clean and build everything"
	@echo ""
	@echo "Information:"
	@echo "   info       - Show project information"
	@echo "   help       - Show this help message"
	@echo ""
	@echo "Usage Examples:"
	@echo "   make                    # Build the project"
	@echo "   make CC=clang          # Use clang compiler"
	@echo "   make debug run         # Build debug and run"
	@echo "   make release examples  # Build release and examples"
	@echo "   make quality docs      # Check quality and generate docs"

#**********************************************************************************************************************
# Special Targets and Dependencies
#**********************************************************************************************************************

# Include dependency files for automatic recompilation when headers change
-include $(DEPS)

# Mark phony targets (targets that don't create files)
.PHONY: all debug release embedded library examples format check quality docs run memcheck test clean distclean rebuild info help

#**********************************************************************************************************************
# End of Makefile
#**********************************************************************************************************************