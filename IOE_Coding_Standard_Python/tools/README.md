# IOE Python Development Tools

Bộ công cụ phát triển cho dự án Python theo tiêu chuẩn IOE INNOVATION Team.

## Các công cụ có sẵn

### 1. Project Generator (`project_generator.py`)
Tạo dự án Python mới theo tiêu chuẩn IOE.

```bash
# Tạo dự án web application
python tools/project_generator.py --project-name "My Web App" --project-type web_app --author "Your Name"

# Tạo dự án AI/ML
python tools/project_generator.py --project-name "ML Model" --project-type ai_model --author "Your Name"

# Xem tất cả options
python tools/project_generator.py --help
```

**Các loại dự án hỗ trợ:**
- `web_app`: Flask/FastAPI web application
- `ai_model`: AI/ML model development project
- `api_server`: REST API server project
- `data_processing`: Data processing pipeline project
- `cli_tool`: Command line interface tool
- `generic`: Generic Python project

### 2. Format Checker (`format_check.py`)
Kiểm tra và sửa lỗi formatting theo tiêu chuẩn IOE.

```bash
# Kiểm tra một file
python tools/format_check.py check main.py

# Kiểm tra cả thư mục
python tools/format_check.py check modules/

# Auto-fix các lỗi có thể sửa được
python tools/format_check.py check --fix modules/

# Chỉ hiện errors và warnings
python tools/format_check.py check --severity warning modules/

# Export JSON report
python tools/format_check.py check --output json modules/ > report.json

# Xem thống kê project
python tools/format_check.py stats .
```

**Kiểm tra gì:**
- IOE file headers (required sections)
- Import organization (Standard library, Third-party, Local)
- Naming conventions (IOE prefix for classes, snake_case functions)
- Code structure và section organization
- Main execution guard

### 3. Static Analyzer (`static_analysis.py`)
Phân tích chuyên sâu code quality và security.

```bash
# Phân tích complexity
python tools/static_analysis.py complexity modules/

# Phân tích toàn diện
python tools/static_analysis.py analyze .

# Tạo HTML report
python tools/static_analysis.py analyze --output html --report-file report.html .

# Chỉ hiện high severity issues
python tools/static_analysis.py analyze --min-severity warning .
```

**Phân tích gì:**
- **Complexity metrics**: Cyclomatic complexity, nesting depth, function length
- **Security vulnerabilities**: eval/exec usage, SQL injection patterns, unsafe operations
- **Documentation coverage**: Docstring coverage cho functions và classes
- **Code quality issues**: Performance problems, best practices

## Cài đặt

```bash
# Cài dependencies cho tools
pip install click rich pyyaml

# Hoặc từ requirements.txt
pip install -r requirements.txt
```

## Quy trình phát triển khuyến nghị

### 1. Tạo dự án mới
```bash
# Tạo dự án
python tools/project_generator.py --project-name "My Project" --project-type web_app --author "Your Name"

# Chuyển vào thư mục
cd my_project

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc venv\Scripts\activate  # Windows

# Cài dependencies
pip install -r requirements.txt
```

### 2. Phát triển code
```bash
# Viết code theo templates và guidelines...

# Kiểm tra format thường xuyên
python ../tools/format_check.py check --fix .

# Chạy static analysis
python ../tools/static_analysis.py analyze .
```

### 3. Code review process
```bash
# Format check trước khi commit
python tools/format_check.py check --severity error .

# Complexity analysis
python tools/static_analysis.py complexity .

# Full analysis report
python tools/static_analysis.py analyze --output html --report-file analysis.html .
```

## Thresholds và Standards

### Complexity Thresholds
- **Cyclomatic Complexity**: ≤ 10 (warning nếu > 10)
- **Function Length**: ≤ 50 lines (info nếu > 50)
- **Nesting Depth**: ≤ 4 levels (warning nếu > 4)
- **Function Parameters**: ≤ 7 parameters
- **Class Methods**: ≤ 20 methods per class

### Documentation Standards
- **Function Docstrings**: ≥ 50% coverage (info nếu < 50%)
- **Class Docstrings**: ≥ 70% coverage (info nếu < 70%)

### Security Checks
- `eval()` và `exec()` usage
- `subprocess.call()` với `shell=True`
- Unsafe pickle operations
- YAML unsafe loading
- SQL injection patterns
- Direct request parameter usage

## Integration với CI/CD

### GitHub Actions example
```yaml
name: IOE Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.8
    
    - name: Install dependencies
      run: |
        pip install click rich pyyaml
    
    - name: Format Check
      run: |
        python tools/format_check.py check --severity error .
    
    - name: Static Analysis
      run: |
        python tools/static_analysis.py analyze --min-severity warning .
```

### Pre-commit hooks
```yaml
# .pre-commit-config.yaml
repos:
- repo: local
  hooks:
  - id: ioe-format-check
    name: IOE Format Check
    entry: python tools/format_check.py check --severity error
    language: system
    files: \.py$
    
  - id: ioe-static-analysis
    name: IOE Static Analysis
    entry: python tools/static_analysis.py analyze --min-severity warning
    language: system
    files: \.py$
```

## Customization

### Thêm custom checks
Các tools được thiết kế modular, có thể extend:

```python
# Thêm vào format_check.py
def check_custom_rules(file_path: Path) -> List[CodeIssue]:
    """Custom checks cho team của bạn."""
    issues = []
    # Implement custom logic
    return issues

# Thêm vào static_analysis.py  
class CustomAnalyzer:
    """Custom analyzer cho requirements đặc biệt."""
    def analyze_file(self, file_path, content):
        # Custom analysis logic
        pass
```

### Configuration file
Tools có thể đọc config từ `pyproject.toml` hoặc `setup.cfg`:

```toml
[tool.ioe]
complexity_threshold = 8
min_docstring_coverage = 60
exclude_patterns = ["tests/*", "migrations/*"]
```

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
```bash
# Đảm bảo dependencies đã được cài
pip install -r requirements.txt
```

**2. "Permission denied" khi chạy tools**
```bash
# Trên Linux/Mac, có thể cần chmod
chmod +x tools/*.py
```

**3. Encoding issues**
```bash
# Đảm bảo files được save với UTF-8 encoding
# Đặc biệt quan trọng với Vietnamese comments
```

**4. False positives trong security checks**
```bash
# Có thể disable specific checks bằng comments
eval(safe_expression)  # nosec: reviewed and safe
```

## Best Practices

1. **Chạy format check thường xuyên** trong quá trình development
2. **Setup pre-commit hooks** để tự động check trước khi commit
3. **Review static analysis reports** định kỳ để improve code quality
4. **Customize thresholds** theo nhu cầu team và project
5. **Document exceptions** khi cần skip certain checks

---

*Developed by IOE INNOVATION Team*