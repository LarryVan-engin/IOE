"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          static_analysis.py
Description:   Static code analysis tool for IOE Python projects

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  click, rich, ast (built-in)
               - click: Command line interface
               - rich: Enhanced console output
               - ast: Python AST parsing

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         Advanced static analysis for IOE Python projects
               - Code complexity analysis
               - Security vulnerability scanning
               - Performance issue detection
               - Documentation coverage analysis
               - Dependency analysis
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import os
import ast
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any, Set
from dataclasses import dataclass
from collections import defaultdict, Counter
from datetime import datetime

# Third-party imports
import click
from rich.console import Console
from rich.table import Table
from rich.progress import Progress
from rich.tree import Tree

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
TOOL_VERSION = "1.0.0"
TOOL_NAME = "IOE Static Analyzer"

# Complexity thresholds
COMPLEXITY_THRESHOLDS = {
    'function_lines': 50,
    'function_params': 7,
    'class_methods': 20,
    'nesting_depth': 4,
    'cyclomatic_complexity': 10
}

# Security patterns to detect
SECURITY_PATTERNS = [
    (r'eval\s*\(', 'Use of eval() can be dangerous'),
    (r'exec\s*\(', 'Use of exec() can be dangerous'),
    (r'subprocess\.call\s*\([^)]*shell\s*=\s*True', 'Shell=True in subprocess can be risky'),
    (r'pickle\.loads?\s*\(', 'Pickle deserialization can be unsafe'),
    (r'yaml\.load\s*\([^)]*Loader\s*=\s*yaml\.Loader', 'YAML unsafe loading'),
    (r'request\.args\.get\([^)]*\)', 'Direct use of request parameters without validation'),
    (r'sql.*%.*%', 'Possible SQL injection vulnerability'),
    (r'os\.system\s*\(', 'Use of os.system() can be dangerous')
]

#######################################################################################################################
# Global Variables
#######################################################################################################################
console = Console()

#######################################################################################################################
# Data Classes
#######################################################################################################################
@dataclass
class AnalysisResult:
    """Represents analysis result for a file or project."""
    file_path: str
    issues: List[Dict[str, Any]]
    metrics: Dict[str, Any]
    suggestions: List[str]

@dataclass
class ComplexityMetrics:
    """Code complexity metrics."""
    cyclomatic_complexity: int
    lines_of_code: int
    function_count: int
    class_count: int
    max_nesting_depth: int
    avg_function_length: float

#######################################################################################################################
# Helper Classes
#######################################################################################################################
class ComplexityAnalyzer(ast.NodeVisitor):
    """AST visitor for calculating code complexity."""
    
    def __init__(self):
        self.complexity = 0
        self.nesting_depth = 0
        self.max_nesting_depth = 0
        self.function_count = 0
        self.class_count = 0
        self.lines_of_code = 0
        self.function_lengths = []
        self.current_function_lines = 0
        
    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        """Visit function definition."""
        self.function_count += 1
        
        # Calculate function length
        if hasattr(node, 'end_lineno') and node.end_lineno:
            func_length = node.end_lineno - node.lineno + 1
            self.function_lengths.append(func_length)
        
        self.nesting_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.nesting_depth)
        
        self.generic_visit(node)
        self.nesting_depth -= 1
    
    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        """Visit async function definition."""
        self.visit_FunctionDef(node)
    
    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        """Visit class definition."""
        self.class_count += 1
        self.nesting_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.nesting_depth)
        
        self.generic_visit(node)
        self.nesting_depth -= 1
    
    def visit_If(self, node: ast.If) -> None:
        """Visit if statement."""
        self.complexity += 1
        self.nesting_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.nesting_depth)
        
        self.generic_visit(node)
        self.nesting_depth -= 1
    
    def visit_While(self, node: ast.While) -> None:
        """Visit while loop."""
        self.complexity += 1
        self.nesting_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.nesting_depth)
        
        self.generic_visit(node)
        self.nesting_depth -= 1
    
    def visit_For(self, node: ast.For) -> None:
        """Visit for loop."""
        self.complexity += 1
        self.nesting_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.nesting_depth)
        
        self.generic_visit(node)
        self.nesting_depth -= 1
    
    def visit_Try(self, node: ast.Try) -> None:
        """Visit try statement."""
        self.complexity += 1
        self.nesting_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.nesting_depth)
        
        self.generic_visit(node)
        self.nesting_depth -= 1
    
    def visit_ExceptHandler(self, node: ast.ExceptHandler) -> None:
        """Visit except handler."""
        self.complexity += 1
        self.generic_visit(node)


class SecurityAnalyzer:
    """Security vulnerability analyzer."""
    
    def __init__(self):
        self.vulnerabilities = []
    
    def analyze_file(self, file_path: Path, content: str) -> List[Dict[str, Any]]:
        """
        Analyze file for security issues.
        
        Args:
            file_path: Path to the file
            content: File content
        
        Returns:
            List of security issues
        """
        issues = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            for pattern, message in SECURITY_PATTERNS:
                if re.search(pattern, line, re.IGNORECASE):
                    issues.append({
                        'type': 'security',
                        'line': i,
                        'severity': 'high',
                        'message': message,
                        'code': line.strip()
                    })
        
        return issues


class DependencyAnalyzer:
    """Dependency analysis."""
    
    def __init__(self):
        self.imports = defaultdict(set)
        self.modules = set()
    
    def analyze_file(self, file_path: Path, content: str) -> Dict[str, Any]:
        """
        Analyze file dependencies.
        
        Args:
            file_path: Path to the file
            content: File content
        
        Returns:
            Dependency analysis results
        """
        try:
            tree = ast.parse(content, str(file_path))
            
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        self.imports[str(file_path)].add(alias.name)
                        self.modules.add(alias.name)
                
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        self.imports[str(file_path)].add(node.module)
                        self.modules.add(node.module)
        
        except SyntaxError:
            pass
        
        return {
            'imports': list(self.imports[str(file_path)]),
            'total_modules': len(self.modules)
        }

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


def analyze_complexity(file_path: Path, content: str) -> ComplexityMetrics:
    """
    Analyze code complexity for a file.
    
    Args:
        file_path: Path to the file
        content: File content
    
    Returns:
        Complexity metrics
    """
    try:
        tree = ast.parse(content, str(file_path))
        analyzer = ComplexityAnalyzer()
        analyzer.visit(tree)
        
        lines = [line for line in content.split('\n') if line.strip() and not line.strip().startswith('#')]
        analyzer.lines_of_code = len(lines)
        
        avg_function_length = 0
        if analyzer.function_lengths:
            avg_function_length = sum(analyzer.function_lengths) / len(analyzer.function_lengths)
        
        return ComplexityMetrics(
            cyclomatic_complexity=analyzer.complexity,
            lines_of_code=analyzer.lines_of_code,
            function_count=analyzer.function_count,
            class_count=analyzer.class_count,
            max_nesting_depth=analyzer.max_nesting_depth,
            avg_function_length=avg_function_length
        )
    
    except SyntaxError:
        return ComplexityMetrics(0, 0, 0, 0, 0, 0.0)


def analyze_documentation(file_path: Path, content: str) -> Dict[str, Any]:
    """
    Analyze documentation coverage.
    
    Args:
        file_path: Path to the file
        content: File content
    
    Returns:
        Documentation analysis results
    """
    try:
        tree = ast.parse(content, str(file_path))
        
        functions_with_docstrings = 0
        total_functions = 0
        classes_with_docstrings = 0
        total_classes = 0
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                total_functions += 1
                if ast.get_docstring(node):
                    functions_with_docstrings += 1
            
            elif isinstance(node, ast.ClassDef):
                total_classes += 1
                if ast.get_docstring(node):
                    classes_with_docstrings += 1
        
        function_coverage = 0
        if total_functions > 0:
            function_coverage = (functions_with_docstrings / total_functions) * 100
        
        class_coverage = 0
        if total_classes > 0:
            class_coverage = (classes_with_docstrings / total_classes) * 100
        
        return {
            'function_docstring_coverage': function_coverage,
            'class_docstring_coverage': class_coverage,
            'total_functions': total_functions,
            'total_classes': total_classes,
            'documented_functions': functions_with_docstrings,
            'documented_classes': classes_with_docstrings
        }
    
    except SyntaxError:
        return {
            'function_docstring_coverage': 0,
            'class_docstring_coverage': 0,
            'total_functions': 0,
            'total_classes': 0,
            'documented_functions': 0,
            'documented_classes': 0
        }


def analyze_file(file_path: Path) -> AnalysisResult:
    """
    Perform comprehensive analysis of a Python file.
    
    Args:
        file_path: Path to the file to analyze
    
    Returns:
        Analysis results
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return AnalysisResult(
            file_path=str(file_path),
            issues=[{'type': 'error', 'message': f'Cannot read file: {e}'}],
            metrics={},
            suggestions=[]
        )
    
    issues = []
    suggestions = []
    
    # Complexity analysis
    complexity = analyze_complexity(file_path, content)
    
    # Check complexity thresholds
    if complexity.cyclomatic_complexity > COMPLEXITY_THRESHOLDS['cyclomatic_complexity']:
        issues.append({
            'type': 'complexity',
            'severity': 'warning',
            'message': f'High cyclomatic complexity: {complexity.cyclomatic_complexity}',
            'threshold': COMPLEXITY_THRESHOLDS['cyclomatic_complexity']
        })
        suggestions.append('Consider breaking down complex functions into smaller ones')
    
    if complexity.max_nesting_depth > COMPLEXITY_THRESHOLDS['nesting_depth']:
        issues.append({
            'type': 'complexity',
            'severity': 'warning',
            'message': f'Deep nesting detected: {complexity.max_nesting_depth} levels',
            'threshold': COMPLEXITY_THRESHOLDS['nesting_depth']
        })
        suggestions.append('Reduce nesting depth by extracting functions or using early returns')
    
    if complexity.avg_function_length > COMPLEXITY_THRESHOLDS['function_lines']:
        issues.append({
            'type': 'complexity',
            'severity': 'info',
            'message': f'Long functions detected: avg {complexity.avg_function_length:.1f} lines',
            'threshold': COMPLEXITY_THRESHOLDS['function_lines']
        })
        suggestions.append('Consider breaking long functions into smaller, focused functions')
    
    # Security analysis
    security_analyzer = SecurityAnalyzer()
    security_issues = security_analyzer.analyze_file(file_path, content)
    issues.extend(security_issues)
    
    # Documentation analysis
    doc_analysis = analyze_documentation(file_path, content)
    
    if doc_analysis['function_docstring_coverage'] < 50:
        issues.append({
            'type': 'documentation',
            'severity': 'info',
            'message': f'Low function documentation coverage: {doc_analysis["function_docstring_coverage"]:.1f}%'
        })
        suggestions.append('Add docstrings to functions for better documentation')
    
    if doc_analysis['class_docstring_coverage'] < 70:
        issues.append({
            'type': 'documentation',
            'severity': 'info',
            'message': f'Low class documentation coverage: {doc_analysis["class_docstring_coverage"]:.1f}%'
        })
        suggestions.append('Add docstrings to classes for better documentation')
    
    # Dependency analysis
    dep_analyzer = DependencyAnalyzer()
    dep_analysis = dep_analyzer.analyze_file(file_path, content)
    
    # Combine metrics
    metrics = {
        'complexity': {
            'cyclomatic_complexity': complexity.cyclomatic_complexity,
            'lines_of_code': complexity.lines_of_code,
            'function_count': complexity.function_count,
            'class_count': complexity.class_count,
            'max_nesting_depth': complexity.max_nesting_depth,
            'avg_function_length': complexity.avg_function_length
        },
        'documentation': doc_analysis,
        'dependencies': dep_analysis
    }
    
    return AnalysisResult(
        file_path=str(file_path),
        issues=issues,
        metrics=metrics,
        suggestions=suggestions
    )

#######################################################################################################################
# Main CLI Commands
#######################################################################################################################
@click.group()
@click.version_option(version=TOOL_VERSION, prog_name=TOOL_NAME)
def cli():
    """IOE Static Analyzer - Advanced code analysis for Python projects."""
    pass


@cli.command()
@click.argument('path', type=click.Path(exists=True))
@click.option('--output', '-o',
              type=click.Choice(['text', 'json', 'html']),
              default='text',
              help='Output format')
@click.option('--min-severity',
              type=click.Choice(['info', 'warning', 'error']),
              default='info',
              help='Minimum severity level to report')
@click.option('--report-file',
              type=click.Path(),
              help='Save report to file')
def analyze(path: str, output: str, min_severity: str, report_file: Optional[str]) -> None:
    """
    Perform comprehensive static analysis of Python code.
    
    PATH can be a file or directory to analyze.
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
            files_to_analyze = [path_obj]
        else:
            files_to_analyze = find_python_files(path_obj)
        
        if not files_to_analyze:
            console.print("❌ No Python files found", style="red")
            return
        
        # Analyze files
        results = []
        
        with Progress() as progress:
            task = progress.add_task("Analyzing files...", total=len(files_to_analyze))
            
            for file_path in files_to_analyze:
                result = analyze_file(file_path)
                results.append(result)
                progress.update(task, advance=1)
        
        # Generate report
        if output == 'text':
            generate_text_report(results, min_severity)
        elif output == 'json':
            report_data = generate_json_report(results, min_severity)
            if report_file:
                with open(report_file, 'w') as f:
                    json.dump(report_data, f, indent=2)
                console.print(f"📄 Report saved to {report_file}", style="green")
            else:
                print(json.dumps(report_data, indent=2))
        elif output == 'html':
            if not report_file:
                report_file = 'analysis_report.html'
            generate_html_report(results, min_severity, report_file)
            console.print(f"📄 HTML report saved to {report_file}", style="green")
        
    except Exception as e:
        console.print(f"❌ Error during analysis: {e}", style="bold red")
        sys.exit(1)


@cli.command()
@click.argument('path', type=click.Path(exists=True))
def complexity(path: str) -> None:
    """
    Show complexity metrics for Python code.
    
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
        
        console.print()
        console.print("📊 Complexity Analysis", style="bold blue")
        console.print("=" * 60, style="blue")
        
        # Create complexity table
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("File", width=30)
        table.add_column("Complexity", width=10)
        table.add_column("LOC", width=8)
        table.add_column("Functions", width=10)
        table.add_column("Classes", width=8)
        table.add_column("Max Depth", width=10)
        
        total_complexity = 0
        total_loc = 0
        total_functions = 0
        total_classes = 0
        
        for file_path in files_to_analyze:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                complexity_metrics = analyze_complexity(file_path, content)
                
                # Color coding based on complexity
                complexity_style = "green"
                if complexity_metrics.cyclomatic_complexity > 20:
                    complexity_style = "red"
                elif complexity_metrics.cyclomatic_complexity > 10:
                    complexity_style = "yellow"
                
                table.add_row(
                    str(file_path.name),
                    str(complexity_metrics.cyclomatic_complexity),
                    str(complexity_metrics.lines_of_code),
                    str(complexity_metrics.function_count),
                    str(complexity_metrics.class_count),
                    str(complexity_metrics.max_nesting_depth),
                    style=complexity_style
                )
                
                total_complexity += complexity_metrics.cyclomatic_complexity
                total_loc += complexity_metrics.lines_of_code
                total_functions += complexity_metrics.function_count
                total_classes += complexity_metrics.class_count
                
            except Exception:
                table.add_row(str(file_path.name), "Error", "-", "-", "-", "-", style="red")
        
        # Add totals row
        table.add_row(
            "TOTAL",
            str(total_complexity),
            str(total_loc),
            str(total_functions),
            str(total_classes),
            "-",
            style="bold"
        )
        
        console.print(table)
        console.print()
        
        # Show recommendations
        avg_complexity = total_complexity / len(files_to_analyze) if files_to_analyze else 0
        
        console.print("💡 Recommendations:", style="bold yellow")
        if avg_complexity > 15:
            console.print("  • High average complexity detected - consider refactoring", style="red")
        elif avg_complexity > 8:
            console.print("  • Moderate complexity - monitor and refactor complex functions", style="yellow")
        else:
            console.print("  • Good complexity levels maintained", style="green")
        
    except Exception as e:
        console.print(f"❌ Error analyzing complexity: {e}", style="bold red")
        sys.exit(1)


def generate_text_report(results: List[AnalysisResult], min_severity: str) -> None:
    """Generate text report."""
    severity_levels = {'info': 1, 'warning': 2, 'error': 3}
    min_level = severity_levels[min_severity]
    
    total_issues = 0
    total_suggestions = 0
    
    # Summary
    console.print("📋 Analysis Summary", style="bold blue")
    console.print("=" * 50, style="blue")
    
    summary_table = Table(show_header=True, header_style="bold magenta")
    summary_table.add_column("File", width=30)
    summary_table.add_column("Issues", width=8)
    summary_table.add_column("Complexity", width=12)
    summary_table.add_column("LOC", width=8)
    summary_table.add_column("Doc Coverage", width=12)
    
    for result in results:
        filtered_issues = [
            issue for issue in result.issues
            if severity_levels.get(issue.get('severity', 'info'), 1) >= min_level
        ]
        
        complexity = result.metrics.get('complexity', {}).get('cyclomatic_complexity', 0)
        loc = result.metrics.get('complexity', {}).get('lines_of_code', 0)
        doc_coverage = result.metrics.get('documentation', {}).get('function_docstring_coverage', 0)
        
        summary_table.add_row(
            Path(result.file_path).name,
            str(len(filtered_issues)),
            str(complexity),
            str(loc),
            f"{doc_coverage:.1f}%"
        )
        
        total_issues += len(filtered_issues)
        total_suggestions += len(result.suggestions)
    
    console.print(summary_table)
    console.print()
    
    # Detailed issues
    if total_issues > 0:
        console.print(f"🔍 Detailed Issues ({total_issues} total)", style="bold yellow")
        console.print("-" * 50, style="yellow")
        
        for result in results:
            file_issues = [
                issue for issue in result.issues
                if severity_levels.get(issue.get('severity', 'info'), 1) >= min_level
            ]
            
            if file_issues:
                console.print(f"\n📄 {Path(result.file_path).name}", style="bold cyan")
                
                for issue in file_issues:
                    severity = issue.get('severity', 'info')
                    issue_type = issue.get('type', 'unknown')
                    message = issue.get('message', 'No message')
                    line = issue.get('line', '')
                    
                    style = {'info': 'cyan', 'warning': 'yellow', 'error': 'red'}[severity]
                    line_info = f":{line}" if line else ""
                    
                    console.print(f"  [{severity.upper()}] {issue_type}{line_info}: {message}", style=style)
    
    # Suggestions
    if total_suggestions > 0:
        console.print(f"\n💡 Suggestions ({total_suggestions} total)", style="bold green")
        console.print("-" * 50, style="green")
        
        all_suggestions = []
        for result in results:
            all_suggestions.extend(result.suggestions)
        
        # Remove duplicates while preserving order
        unique_suggestions = []
        for suggestion in all_suggestions:
            if suggestion not in unique_suggestions:
                unique_suggestions.append(suggestion)
        
        for i, suggestion in enumerate(unique_suggestions, 1):
            console.print(f"  {i}. {suggestion}")
    
    console.print()


def generate_json_report(results: List[AnalysisResult], min_severity: str) -> Dict[str, Any]:
    """Generate JSON report."""
    severity_levels = {'info': 1, 'warning': 2, 'error': 3}
    min_level = severity_levels[min_severity]
    
    report_data = {
        'metadata': {
            'tool': TOOL_NAME,
            'version': TOOL_VERSION,
            'timestamp': str(datetime.now()),
            'min_severity': min_severity
        },
        'summary': {
            'total_files': len(results),
            'total_issues': sum(len([i for i in r.issues if severity_levels.get(i.get('severity', 'info'), 1) >= min_level]) for r in results),
            'total_suggestions': sum(len(r.suggestions) for r in results)
        },
        'files': []
    }
    
    for result in results:
        filtered_issues = [
            issue for issue in result.issues
            if severity_levels.get(issue.get('severity', 'info'), 1) >= min_level
        ]
        
        file_data = {
            'path': result.file_path,
            'issues': filtered_issues,
            'metrics': result.metrics,
            'suggestions': result.suggestions
        }
        
        report_data['files'].append(file_data)
    
    return report_data


def generate_html_report(results: List[AnalysisResult], min_severity: str, output_file: str) -> None:
    """Generate HTML report."""
    # Basic HTML template - in a real implementation, you'd use a proper template engine
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>IOE Static Analysis Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .header {{ background: #2196F3; color: white; padding: 20px; }}
            .summary {{ background: #f5f5f5; padding: 15px; margin: 20px 0; }}
            .file {{ border: 1px solid #ddd; margin: 10px 0; padding: 15px; }}
            .issue {{ margin: 5px 0; padding: 5px; }}
            .error {{ background: #ffebee; border-left: 4px solid #f44336; }}
            .warning {{ background: #fff3e0; border-left: 4px solid #ff9800; }}
            .info {{ background: #e3f2fd; border-left: 4px solid #2196f3; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>{TOOL_NAME} Report</h1>
            <p>Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
        
        <div class="summary">
            <h2>Summary</h2>
            <p>Total files analyzed: {len(results)}</p>
            <p>Minimum severity: {min_severity}</p>
        </div>
        
        <h2>Files</h2>
    """
    
    for result in results:
        html_content += f"""
        <div class="file">
            <h3>{Path(result.file_path).name}</h3>
        """
        
        for issue in result.issues:
            severity = issue.get('severity', 'info')
            message = issue.get('message', 'No message')
            html_content += f'<div class="issue {severity}">{message}</div>'
        
        html_content += "</div>"
    
    html_content += """
    </body>
    </html>
    """
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

#######################################################################################################################
# Main Execution
#######################################################################################################################
if __name__ == "__main__":
    cli()

# End of File