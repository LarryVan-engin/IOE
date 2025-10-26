"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          format_check.py
Description:   Code formatting and style checker following IOE standards

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  click, rich
               - click: Command line interface
               - rich: Enhanced console output
               - ast: Python AST parsing (built-in)

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         Tool for checking and formatting Python code
               - Validates IOE coding standards compliance
               - Checks file headers and documentation
               - Validates naming conventions
               - Checks imports organization
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import os
import ast
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime

# Third-party imports
import click
from rich.console import Console
from rich.table import Table
from rich.progress import Progress

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
TOOL_VERSION = "1.0.0"
TOOL_NAME = "IOE Format Checker"

# IOE naming conventions
IOE_PREFIX_PATTERNS = {
    'class': r'^IOE[A-Z][a-zA-Z0-9]*$',
    'function': r'^[a-z][a-z0-9_]*$',
    'constant': r'^[A-Z][A-Z0-9_]*$',
    'variable': r'^[a-z][a-z0-9_]*$',
    'module': r'^ioe_[a-z][a-z0-9_]*$'
}

# Required header sections
REQUIRED_HEADER_SECTIONS = [
    "General Information",
    "Project:",
    "File:",
    "Description:",
    "Author:",
    "Email:",
    "Created:",
    "Last Update:",
    "Version:",
    "Python:",
    "Copyright:",
    "License:"
]

#######################################################################################################################
# Global Variables
#######################################################################################################################
console = Console()

#######################################################################################################################
# Helper Classes
#######################################################################################################################
class CodeIssue:
    """Represents a code issue found during checking."""
    
    def __init__(self, file_path: str, line_number: int, issue_type: str, 
                 message: str, severity: str = "warning"):
        self.file_path = file_path
        self.line_number = line_number
        self.issue_type = issue_type
        self.message = message
        self.severity = severity  # "error", "warning", "info"
    
    def __str__(self) -> str:
        return f"{self.file_path}:{self.line_number} [{self.severity.upper()}] {self.issue_type}: {self.message}"

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def find_python_files(directory: Path, exclude_patterns: List[str] = None) -> List[Path]:
    """
    Find all Python files in directory.
    
    Args:
        directory: Directory to search
        exclude_patterns: Patterns to exclude
    
    Returns:
        List of Python file paths
    """
    if exclude_patterns is None:
        exclude_patterns = ['__pycache__', '.venv', 'venv', '.git', 'build', 'dist']
    
    python_files = []
    
    for file_path in directory.rglob("*.py"):
        # Skip excluded directories
        skip_file = False
        for pattern in exclude_patterns:
            if pattern in str(file_path):
                skip_file = True
                break
        
        if not skip_file:
            python_files.append(file_path)
    
    return python_files


def check_file_header(file_path: Path) -> List[CodeIssue]:
    """
    Check if file has proper IOE header format.
    
    Args:
        file_path: Path to Python file
    
    Returns:
        List of issues found
    """
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file starts with header
        if not content.startswith('"""'):
            issues.append(CodeIssue(
                str(file_path), 1, "header", 
                "File missing IOE standard header", "error"
            ))
            return issues
        
        # Extract header content
        header_end = content.find('"""', 3)
        if header_end == -1:
            issues.append(CodeIssue(
                str(file_path), 1, "header",
                "Header not properly closed", "error"
            ))
            return issues
        
        header_content = content[3:header_end]
        
        # Check required sections
        for section in REQUIRED_HEADER_SECTIONS:
            if section not in header_content:
                issues.append(CodeIssue(
                    str(file_path), 1, "header",
                    f"Missing required header section: {section}", "warning"
                ))
        
    except Exception as e:
        issues.append(CodeIssue(
            str(file_path), 1, "header",
            f"Error reading file: {e}", "error"
        ))
    
    return issues


def check_imports_organization(file_path: Path) -> List[CodeIssue]:
    """
    Check imports organization according to IOE standards.
    
    Args:
        file_path: Path to Python file
    
    Returns:
        List of issues found
    """
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Find import section
        import_start = -1
        import_end = -1
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith(('import ', 'from ')) and not stripped.startswith('#'):
                if import_start == -1:
                    import_start = i
                import_end = i
        
        if import_start == -1:
            return issues  # No imports found
        
        # Check for proper sectioning
        import_lines = lines[import_start:import_end + 1]
        
        # Look for section comments
        has_stdlib_section = any("Standard library" in line for line in import_lines)
        has_thirdparty_section = any("Third-party" in line for line in import_lines)
        has_local_section = any("Local imports" in line for line in import_lines)
        
        if not (has_stdlib_section or has_thirdparty_section or has_local_section):
            issues.append(CodeIssue(
                str(file_path), import_start + 1, "imports",
                "Imports should be organized in sections (Standard library, Third-party, Local)", "warning"
            ))
        
    except Exception as e:
        issues.append(CodeIssue(
            str(file_path), 1, "imports",
            f"Error analyzing imports: {e}", "error"
        ))
    
    return issues


def check_naming_conventions(file_path: Path) -> List[CodeIssue]:
    """
    Check naming conventions according to IOE standards.
    
    Args:
        file_path: Path to Python file
    
    Returns:
        List of issues found
    """
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        tree = ast.parse(content, str(file_path))
        
        for node in ast.walk(tree):
            # Check class names
            if isinstance(node, ast.ClassDef):
                class_name = node.name
                
                # IOE classes should start with IOE
                if not class_name.startswith('IOE') and not class_name.startswith('_'):
                    issues.append(CodeIssue(
                        str(file_path), node.lineno, "naming",
                        f"Class '{class_name}' should follow IOE naming convention (start with 'IOE')", "warning"
                    ))
                elif class_name.startswith('IOE') and not re.match(IOE_PREFIX_PATTERNS['class'], class_name):
                    issues.append(CodeIssue(
                        str(file_path), node.lineno, "naming",
                        f"Class '{class_name}' doesn't follow IOE class naming pattern", "warning"
                    ))
            
            # Check function names
            elif isinstance(node, ast.FunctionDef):
                func_name = node.name
                
                # Skip private and magic methods
                if not func_name.startswith('_'):
                    if not re.match(IOE_PREFIX_PATTERNS['function'], func_name):
                        issues.append(CodeIssue(
                            str(file_path), node.lineno, "naming",
                            f"Function '{func_name}' should use snake_case naming", "info"
                        ))
        
        # Check module name
        module_name = file_path.stem
        if module_name != "__init__" and not module_name.startswith('test_'):
            if not re.match(IOE_PREFIX_PATTERNS['module'], module_name) and module_name not in ['main', 'setup']:
                issues.append(CodeIssue(
                    str(file_path), 1, "naming",
                    f"Module '{module_name}' should follow IOE naming convention (start with 'ioe_')", "info"
                ))
        
    except SyntaxError as e:
        issues.append(CodeIssue(
            str(file_path), e.lineno or 1, "syntax",
            f"Syntax error: {e.msg}", "error"
        ))
    except Exception as e:
        issues.append(CodeIssue(
            str(file_path), 1, "naming",
            f"Error analyzing naming: {e}", "error"
        ))
    
    return issues


def check_code_structure(file_path: Path) -> List[CodeIssue]:
    """
    Check code structure and organization.
    
    Args:
        file_path: Path to Python file
    
    Returns:
        List of issues found
    """
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Check for proper section comments
        expected_sections = [
            "Imports",
            "Constants and Configuration", 
            "Global Variables",
            "Helper Functions",
            "Main Functions"
        ]
        
        found_sections = []
        for i, line in enumerate(lines):
            for section in expected_sections:
                if section in line and line.strip().startswith('#'):
                    found_sections.append(section)
                    break
        
        # Check if main sections are present
        if len(found_sections) < 2:
            issues.append(CodeIssue(
                str(file_path), 1, "structure",
                "File should have proper section organization with comments", "info"
            ))
        
        # Check for main execution guard
        has_main_guard = any("if __name__ == \"__main__\":" in line for line in lines)
        has_executable_code = any(not line.strip().startswith(('#', '"""', "'''")) and 
                                line.strip() and 
                                not line.strip().startswith(('import ', 'from '))
                                for line in lines[-20:])  # Check last 20 lines
        
        if has_executable_code and not has_main_guard:
            issues.append(CodeIssue(
                str(file_path), len(lines), "structure",
                "File with executable code should have main execution guard", "warning"
            ))
        
    except Exception as e:
        issues.append(CodeIssue(
            str(file_path), 1, "structure",
            f"Error analyzing structure: {e}", "error"
        ))
    
    return issues


def format_file_inplace(file_path: Path) -> List[str]:
    """
    Apply basic formatting fixes to file.
    
    Args:
        file_path: Path to Python file
    
    Returns:
        List of applied fixes
    """
    fixes = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix trailing whitespace
        lines = content.split('\n')
        fixed_lines = [line.rstrip() for line in lines]
        content = '\n'.join(fixed_lines)
        
        if content != original_content:
            fixes.append("Removed trailing whitespace")
        
        # Ensure file ends with newline
        if content and not content.endswith('\n'):
            content += '\n'
            fixes.append("Added final newline")
        
        # Write back if changes were made
        if fixes:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
    except Exception as e:
        fixes.append(f"Error applying fixes: {e}")
    
    return fixes

#######################################################################################################################
# Main CLI Commands
#######################################################################################################################
@click.group()
@click.version_option(version=TOOL_VERSION, prog_name=TOOL_NAME)
def cli():
    """IOE Format Checker - Validate Python code against IOE standards."""
    pass


@cli.command()
@click.argument('path', type=click.Path(exists=True))
@click.option('--fix', is_flag=True, help='Apply automatic fixes')
@click.option('--severity', 
              type=click.Choice(['error', 'warning', 'info']),
              default='warning',
              help='Minimum severity level to report')
@click.option('--output', '-o',
              type=click.Choice(['text', 'json']),
              default='text',
              help='Output format')
def check(path: str, fix: bool, severity: str, output: str) -> None:
    """
    Check Python files for IOE coding standards compliance.
    
    PATH can be a file or directory to check.
    """
    try:
        # Print banner
        if output == 'text':
            console.print()
            console.print("=" * 70, style="blue")
            console.print(f"  {TOOL_NAME} v{TOOL_VERSION}", style="bold blue")
            console.print("  IOE INNOVATION Team", style="green")
            console.print("=" * 70, style="blue")
            console.print()
        
        path_obj = Path(path)
        
        # Find Python files
        if path_obj.is_file():
            files_to_check = [path_obj]
        else:
            files_to_check = find_python_files(path_obj)
        
        if not files_to_check:
            console.print("❌ No Python files found", style="red")
            return
        
        all_issues = []
        all_fixes = []
        
        # Process files
        with Progress() as progress:
            task = progress.add_task("Checking files...", total=len(files_to_check))
            
            for file_path in files_to_check:
                # Check file
                issues = []
                issues.extend(check_file_header(file_path))
                issues.extend(check_imports_organization(file_path))
                issues.extend(check_naming_conventions(file_path))
                issues.extend(check_code_structure(file_path))
                
                # Apply fixes if requested
                if fix:
                    fixes = format_file_inplace(file_path)
                    if fixes:
                        all_fixes.extend([(str(file_path), fix) for fix in fixes])
                
                # Filter by severity
                severity_levels = {'error': 3, 'warning': 2, 'info': 1}
                min_level = severity_levels[severity]
                filtered_issues = [
                    issue for issue in issues 
                    if severity_levels.get(issue.severity, 1) >= min_level
                ]
                
                all_issues.extend(filtered_issues)
                progress.update(task, advance=1)
        
        # Output results
        if output == 'text':
            # Summary table
            if all_issues:
                console.print(f"📋 Found {len(all_issues)} issues:", style="bold yellow")
                console.print()
                
                # Group by severity
                errors = [i for i in all_issues if i.severity == 'error']
                warnings = [i for i in all_issues if i.severity == 'warning']
                infos = [i for i in all_issues if i.severity == 'info']
                
                summary_table = Table(show_header=True, header_style="bold magenta")
                summary_table.add_column("Severity", width=10)
                summary_table.add_column("Count", width=8)
                summary_table.add_column("Description", width=40)
                
                if errors:
                    summary_table.add_row("ERROR", str(len(errors)), "Critical issues that must be fixed", style="red")
                if warnings:
                    summary_table.add_row("WARNING", str(len(warnings)), "Important issues to address", style="yellow")
                if infos:
                    summary_table.add_row("INFO", str(len(infos)), "Suggestions for improvement", style="cyan")
                
                console.print(summary_table)
                console.print()
                
                # Detailed issues
                for issue in all_issues:
                    style = {"error": "red", "warning": "yellow", "info": "cyan"}[issue.severity]
                    console.print(f"  {issue}", style=style)
                
            else:
                console.print("✅ No issues found! Code follows IOE standards.", style="bold green")
            
            # Applied fixes
            if all_fixes:
                console.print()
                console.print(f"🔧 Applied {len(all_fixes)} fixes:", style="bold blue")
                for file_path, fix_msg in all_fixes:
                    console.print(f"  {file_path}: {fix_msg}", style="green")
        
        else:  # JSON output
            import json
            result = {
                "summary": {
                    "total_files": len(files_to_check),
                    "total_issues": len(all_issues),
                    "errors": len([i for i in all_issues if i.severity == 'error']),
                    "warnings": len([i for i in all_issues if i.severity == 'warning']),
                    "infos": len([i for i in all_issues if i.severity == 'info'])
                },
                "issues": [
                    {
                        "file": issue.file_path,
                        "line": issue.line_number,
                        "type": issue.issue_type,
                        "severity": issue.severity,
                        "message": issue.message
                    }
                    for issue in all_issues
                ],
                "fixes": [
                    {"file": file_path, "fix": fix_msg}
                    for file_path, fix_msg in all_fixes
                ]
            }
            
            print(json.dumps(result, indent=2))
        
        # Exit with appropriate code
        if any(issue.severity == 'error' for issue in all_issues):
            sys.exit(1)
        elif any(issue.severity == 'warning' for issue in all_issues):
            sys.exit(2)
        else:
            sys.exit(0)
            
    except Exception as e:
        console.print(f"❌ Error during checking: {e}", style="bold red")
        sys.exit(1)


@cli.command()
@click.argument('path', type=click.Path(exists=True))
def stats(path: str) -> None:
    """
    Show statistics about Python code in the project.
    
    PATH can be a file or directory to analyze.
    """
    try:
        path_obj = Path(path)
        
        # Find Python files
        if path_obj.is_file():
            files_to_analyze = [path_obj]
        else:
            files_to_analyze = find_python_files(path_obj)
        
        if not files_to_analyze:
            console.print("❌ No Python files found", style="red")
            return
        
        # Analyze files
        total_lines = 0
        total_functions = 0
        total_classes = 0
        total_imports = 0
        ioe_compliant_files = 0
        
        for file_path in files_to_analyze:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    lines = content.split('\n')
                
                total_lines += len(lines)
                
                # Check IOE compliance
                if content.startswith('"""') and "IOE INNOVATION Team" in content:
                    ioe_compliant_files += 1
                
                # Parse AST
                try:
                    tree = ast.parse(content)
                    for node in ast.walk(tree):
                        if isinstance(node, ast.FunctionDef):
                            total_functions += 1
                        elif isinstance(node, ast.ClassDef):
                            total_classes += 1
                        elif isinstance(node, (ast.Import, ast.ImportFrom)):
                            total_imports += 1
                except SyntaxError:
                    pass  # Skip files with syntax errors
                    
            except Exception:
                pass  # Skip files that can't be read
        
        # Display statistics
        console.print()
        console.print("📊 Project Statistics", style="bold blue")
        console.print("=" * 50, style="blue")
        
        stats_table = Table(show_header=False, box=None, padding=(0, 2))
        stats_table.add_column("Metric", style="cyan", width=25)
        stats_table.add_column("Value", style="white")
        
        stats_table.add_row("Python Files", str(len(files_to_analyze)))
        stats_table.add_row("Total Lines", str(total_lines))
        stats_table.add_row("Functions", str(total_functions))
        stats_table.add_row("Classes", str(total_classes))
        stats_table.add_row("Import Statements", str(total_imports))
        stats_table.add_row("IOE Compliant Files", f"{ioe_compliant_files}/{len(files_to_analyze)}")
        
        if len(files_to_analyze) > 0:
            compliance_rate = (ioe_compliant_files / len(files_to_analyze)) * 100
            stats_table.add_row("Compliance Rate", f"{compliance_rate:.1f}%")
        
        console.print(stats_table)
        console.print()
        
    except Exception as e:
        console.print(f"❌ Error analyzing statistics: {e}", style="bold red")
        sys.exit(1)

#######################################################################################################################
# Main Execution
#######################################################################################################################
if __name__ == "__main__":
    cli()

# End of File