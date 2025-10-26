"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          project_generator.py
Description:   Project template generator following IOE standards

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  click, rich, pyyaml
               - click: Command line interface
               - rich: Enhanced console output
               - pyyaml: YAML configuration support

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         Tool for generating new IOE Python projects
               - Creates project structure following IOE standards
               - Generates templates with proper headers
               - Configures development environment
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import os
import sys
import shutil
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

# Third-party imports
import click
from rich.console import Console
from rich.progress import Progress
from rich.table import Table

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
TOOL_VERSION = "1.0.0"
TOOL_NAME = "IOE Project Generator"

# Project templates
PROJECT_TYPES = {
    "web_app": "Flask/FastAPI web application",
    "ai_model": "AI/ML model development project", 
    "api_server": "REST API server project",
    "data_processing": "Data processing pipeline project",
    "cli_tool": "Command line interface tool",
    "generic": "Generic Python project"
}

#######################################################################################################################
# Global Variables
#######################################################################################################################
console = Console()

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def create_directory_structure(project_path: Path, project_type: str) -> None:
    """
    Create project directory structure.
    
    Args:
        project_path: Path to project root
        project_type: Type of project to create
    """
    directories = [
        "modules",
        "modules/utils",
        "tests",
        "tests/test_modules",
        "tests/test_integration",
        "docs",
        "examples",
        "templates",
        "tools",
        "config",
        "logs"
    ]
    
    # Add project-specific directories
    if project_type == "ai_model":
        directories.extend(["data", "data/raw", "data/processed", "models", "notebooks"])
    elif project_type == "web_app":
        directories.extend(["static", "static/css", "static/js", "templates/html"])
    elif project_type == "data_processing":
        directories.extend(["data", "data/input", "data/output", "workflows"])
    
    for directory in directories:
        dir_path = project_path / directory
        dir_path.mkdir(parents=True, exist_ok=True)
        console.print(f"  ✓ Created directory: {directory}", style="green")


def generate_main_py(project_path: Path, project_name: str, project_type: str, author: str) -> None:
    """
    Generate main.py file for the project.
    
    Args:
        project_path: Path to project root
        project_name: Name of the project
        project_type: Type of project
        author: Author name
    """
    template_content = f'''"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       {project_name}
File:          main.py
Description:   Main application entry point following IOE INNOVATION Team standards

Author:        {author} (Project Leader)
Email:         [EMAIL_ADDRESS]
Created:       {datetime.now().strftime('%Y-%m-%d')}
Last Update:   {datetime.now().strftime('%Y-%m-%d')}
Version:       1.0.0

Python:        3.8+
Dependencies:  [LIST_DEPENDENCIES]

Copyright:     (c) {datetime.now().year} IOE INNOVATION Team
License:       MIT

Notes:         Main application orchestrator for {project_type}
               - Only Project Leader has permission to modify this file
               - Coordinates between different modules
               - Handles application lifecycle and configuration
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import os
import sys
import logging
from pathlib import Path
from typing import Dict, Any, Optional

# Third-party imports
import click
from rich.console import Console

# Local imports
from modules.utils.logger import LoggerManager
from modules.utils.config import ConfigManager

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
APP_NAME = "{project_name}"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "{PROJECT_TYPES.get(project_type, 'IOE Python Application')}"

#######################################################################################################################
# Global Variables
#######################################################################################################################
console = Console()

#######################################################################################################################
# Main Functions
#######################################################################################################################
@click.command()
@click.version_option(version=APP_VERSION, prog_name=APP_NAME)
@click.option('--config', '-c', default='config/settings.yaml', help='Configuration file path')
@click.option('--debug', '-d', is_flag=True, help='Enable debug mode')
def main(config: str, debug: bool) -> None:
    """
    {project_name} - {PROJECT_TYPES.get(project_type, 'IOE Python Application')}
    
    Main entry point for IOE INNOVATION Team Python application.
    """
    try:
        # Print application banner
        console.print(f"🚀 Starting {{APP_NAME}} v{{APP_VERSION}}", style="bold blue")
        
        # Initialize logging
        logger = LoggerManager(APP_NAME, level="DEBUG" if debug else "INFO")
        logger.info(f"Starting {{APP_NAME}} application")
        
        # Load configuration
        app_config = ConfigManager(config)
        app_config.load()
        
        # TODO: Add your application logic here
        console.print("✅ Application started successfully!", style="bold green")
        logger.info("Application startup completed")
        
    except Exception as e:
        console.print(f"❌ Fatal error: {{e}}", style="bold red")
        if debug:
            console.print_exception()
        sys.exit(1)

#######################################################################################################################
# Main Execution
#######################################################################################################################
if __name__ == "__main__":
    main()

# End of File
'''
    
    main_file = project_path / "main.py"
    with open(main_file, "w", encoding="utf-8") as f:
        f.write(template_content)
    
    console.print("  ✓ Generated main.py", style="green")


def generate_requirements_txt(project_path: Path, project_type: str) -> None:
    """
    Generate requirements.txt file.
    
    Args:
        project_path: Path to project root
        project_type: Type of project
    """
    base_requirements = [
        "click>=8.0.0",
        "rich>=10.0.0",
        "pyyaml>=5.4.0"
    ]
    
    # Add project-specific requirements
    if project_type == "web_app":
        base_requirements.extend([
            "flask>=2.0.0",
            "requests>=2.25.0"
        ])
    elif project_type == "ai_model":
        base_requirements.extend([
            "numpy>=1.21.0",
            "pandas>=1.3.0",
            "scikit-learn>=0.24.0",
            "matplotlib>=3.4.0"
        ])
    elif project_type == "api_server":
        base_requirements.extend([
            "fastapi>=0.68.0",
            "uvicorn>=0.15.0",
            "pydantic>=1.8.0"
        ])
    elif project_type == "data_processing":
        base_requirements.extend([
            "pandas>=1.3.0",
            "numpy>=1.21.0"
        ])
    
    requirements_file = project_path / "requirements.txt"
    with open(requirements_file, "w", encoding="utf-8") as f:
        for req in base_requirements:
            f.write(f"{req}\\n")
    
    console.print("  ✓ Generated requirements.txt", style="green")


def generate_readme(project_path: Path, project_name: str, project_type: str, author: str) -> None:
    """
    Generate README.md file.
    
    Args:
        project_path: Path to project root
        project_name: Name of the project
        project_type: Type of project
        author: Author name
    """
    readme_content = f'''# {project_name}

## Tổng quan
{PROJECT_TYPES.get(project_type, 'Python application')} được phát triển theo tiêu chuẩn IOE INNOVATION Team.

## Cài đặt

### Yêu cầu hệ thống
- Python 3.8+
- pip (Python package manager)

### Cài đặt dependencies
```bash
pip install -r requirements.txt
```

## Sử dụng

### Chạy ứng dụng
```bash
python main.py
```

### Các tùy chọn khác
```bash
python main.py --help     # Xem hướng dẫn
python main.py --debug    # Chế độ debug
```

## Cấu trúc dự án

```
{project_name.lower().replace(' ', '_')}/
├── main.py                 # Ứng dụng chính
├── requirements.txt        # Python dependencies
├── modules/               # Modules và packages
├── tests/                 # Test suite  
├── docs/                  # Tài liệu
├── examples/              # Ví dụ sử dụng
├── config/                # Configuration files
└── tools/                 # Development tools
```

## Phát triển

### Chạy tests
```bash
python -m pytest tests/
```

### Format code
```bash
python tools/format_check.py --format
```

## Tác giả
- **{author}** - *Project Leader*
- **IOE INNOVATION Team**

## License
MIT License - xem file LICENSE để biết thêm chi tiết.

---
*Dự án được phát triển theo tiêu chuẩn IOE INNOVATION Team*
'''
    
    readme_file = project_path / "README.md"
    with open(readme_file, "w", encoding="utf-8") as f:
        f.write(readme_content)
    
    console.print("  ✓ Generated README.md", style="green")


def generate_gitignore(project_path: Path) -> None:
    """
    Generate .gitignore file.
    
    Args:
        project_path: Path to project root
    """
    gitignore_content = '''# IOE Python Project - .gitignore

# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
ENV/
.venv/

# IDEs
.vscode/settings.json
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Environment variables
.env
.env.local

# Test coverage
.coverage
htmlcov/
.pytest_cache/

# Build artifacts
build/
dist/
*.egg-info/

# Project specific
config/secrets/
data/raw/
data/processed/
models/*.pkl
models/*.h5
'''
    
    gitignore_file = project_path / ".gitignore"
    with open(gitignore_file, "w", encoding="utf-8") as f:
        f.write(gitignore_content)
    
    console.print("  ✓ Generated .gitignore", style="green")

#######################################################################################################################
# Main CLI Command
#######################################################################################################################
@click.command()
@click.version_option(version=TOOL_VERSION, prog_name=TOOL_NAME)
@click.option('--project-name', '-n', 
              prompt='Project name',
              help='Name of the project to create')
@click.option('--project-type', '-t',
              type=click.Choice(list(PROJECT_TYPES.keys())),
              default='generic',
              help='Type of project to create')
@click.option('--author', '-a',
              prompt='Author name',
              help='Project author name')
@click.option('--output-dir', '-o',
              default='.',
              help='Output directory for project')
@click.option('--force', '-f',
              is_flag=True,
              help='Overwrite existing project directory')
def main(project_name: str, project_type: str, author: str, output_dir: str, force: bool) -> None:
    """
    IOE Project Generator - Create new Python projects following IOE standards.
    
    This tool generates a complete project structure with proper IOE INNOVATION Team
    coding standards, including templates, configuration files, and documentation.
    """
    try:
        # Print banner
        console.print()
        console.print("=" * 70, style="blue")
        console.print(f"  {TOOL_NAME} v{TOOL_VERSION}", style="bold blue")
        console.print("  IOE INNOVATION Team", style="green")
        console.print("=" * 70, style="blue")
        console.print()
        
        # Show project information
        table = Table(show_header=False, box=None, padding=(0, 2))
        table.add_column("Key", style="cyan", width=15)
        table.add_column("Value", style="white")
        
        table.add_row("Project Name", project_name)
        table.add_row("Project Type", f"{project_type} ({PROJECT_TYPES[project_type]})")
        table.add_row("Author", author)
        table.add_row("Output Dir", output_dir)
        
        console.print(table)
        console.print()
        
        # Create project directory
        project_dir_name = project_name.lower().replace(' ', '_').replace('-', '_')
        project_path = Path(output_dir) / project_dir_name
        
        if project_path.exists():
            if not force:
                console.print(f"❌ Project directory already exists: {project_path}", style="red")
                console.print("Use --force to overwrite", style="yellow")
                return
            else:
                console.print(f"⚠️ Overwriting existing project: {project_path}", style="yellow")
                shutil.rmtree(project_path)
        
        # Generate project with progress
        with Progress() as progress:
            task = progress.add_task("Generating project...", total=6)
            
            # Create directory structure
            console.print("📁 Creating directory structure...")
            create_directory_structure(project_path, project_type)
            progress.update(task, advance=1)
            
            # Generate main files
            console.print("📄 Generating main.py...")
            generate_main_py(project_path, project_name, project_type, author)
            progress.update(task, advance=1)
            
            # Generate requirements
            console.print("📋 Generating requirements.txt...")
            generate_requirements_txt(project_path, project_type)
            progress.update(task, advance=1)
            
            # Generate README
            console.print("📖 Generating README.md...")
            generate_readme(project_path, project_name, project_type, author)
            progress.update(task, advance=1)
            
            # Generate .gitignore
            console.print("🚫 Generating .gitignore...")
            generate_gitignore(project_path)
            progress.update(task, advance=1)
            
            # Create empty __init__.py files
            console.print("🐍 Creating __init__.py files...")
            init_files = [
                project_path / "modules" / "__init__.py",
                project_path / "modules" / "utils" / "__init__.py",
                project_path / "tests" / "__init__.py",
                project_path / "tests" / "test_modules" / "__init__.py",
                project_path / "tests" / "test_integration" / "__init__.py"
            ]
            
            for init_file in init_files:
                init_file.touch()
            
            progress.update(task, advance=1)
        
        # Success message
        console.print()
        console.print("🎉 Project created successfully!", style="bold green")
        console.print(f"📂 Project location: {project_path.absolute()}", style="cyan")
        console.print()
        
        # Next steps
        console.print("📋 Next steps:", style="bold yellow")
        console.print(f"  1. cd {project_dir_name}")
        console.print("  2. python -m venv venv")
        console.print("  3. source venv/bin/activate  # Linux/Mac")
        console.print("  4. pip install -r requirements.txt")
        console.print("  5. python main.py")
        console.print()
        
    except Exception as e:
        console.print(f"❌ Error generating project: {e}", style="bold red")
        sys.exit(1)

#######################################################################################################################
# Main Execution
#######################################################################################################################
if __name__ == "__main__":
    main()

# End of File