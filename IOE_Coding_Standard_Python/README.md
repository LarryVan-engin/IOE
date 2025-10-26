# IOE INNOVATION Team - Official Python Coding Standards

## Tổng quan
Đây là repository chính thức về tiêu chuẩn lập trình Python của IOE INNOVATION Team, được thiết kế để đảm bảo tính nhất quán, chất lượng và khả năng bảo trì của mã nguồn trong các dự án AI, backend, web applications và server-side development.

## Cấu trúc dự án

```
IOE_Coding_Standard_Python/
├── README.md                    # Tài liệu chính
├── main.py                      # Ứng dụng chính (Project Leader only)
├── requirements.txt             # Python dependencies
├── pyproject.toml               # Project configuration
├── .gitignore                   # Git ignore rules
├── modules/                     # Python modules và packages
│   ├── __init__.py             # Package marker
│   ├── ioe_ai_utils.py         # AI/ML utility functions
│   ├── ioe_web_server.py       # Web server module
│   ├── ioe_database.py         # Database operations
│   ├── ioe_api_client.py       # API client module
│   └── utils/                  # Utility subpackage
│       ├── __init__.py
│       ├── ioe_logger.py       # Logging utilities
│       ├── ioe_config.py       # Configuration management
│       └── ioe_validators.py   # Data validation functions
├── examples/                    # Các ví dụ thực tế
│   ├── basic_ai_model/         # Ví dụ AI model cơ bản
│   ├── flask_web_app/          # Ví dụ Flask web application
│   ├── fastapi_server/         # Ví dụ FastAPI server
│   └── data_processing/        # Ví dụ xử lý dữ liệu
├── templates/                   # Templates cho development
│   ├── template_module.py      # Template file module
│   ├── template_main.py        # Template file main
│   └── project_template/       # Template cho dự án mới
├── docs/                        # Tài liệu chi tiết
│   ├── CODING_GUIDELINES.md    # Hướng dẫn coding standards
│   ├── FILE_STRUCTURE.md       # Cấu trúc file và project
│   ├── DEPENDENCIES_GUIDE.md   # Hướng dẫn quản lý dependencies
│   └── DEPLOYMENT_GUIDE.md     # Hướng dẫn deployment
├── tests/                       # Test suite
│   ├── __init__.py
│   ├── test_modules/           # Unit tests cho modules
│   ├── test_integration/       # Integration tests
│   └── test_data/              # Test data files
└── tools/                       # Các công cụ hỗ trợ
    ├── format_check.py         # Script kiểm tra format
    ├── static_analysis.py      # Script phân tích code
    ├── project_generator.py    # Tool tạo project mới
    └── deployment_helper.py    # Tool hỗ trợ deployment
```

## Tính năng chính

### 1. Python Coding Standards được áp dụng
- **General Information Header**: Mỗi file có header thông tin đầy đủ về project, mô tả, tác giả
- **Modular Organization**: Chia code thành các modules và packages rõ ràng
- **Consistent Naming**: Convention đồng nhất với prefix theo module (ioe_)
- **Professional Documentation**: Sử dụng docstring chuẩn Google/NumPy style
- **Error Handling**: Proper exception handling và input validation
- **Type Hints**: Sử dụng type hints cho better code clarity

### 2. Project Management
- **Virtual Environment**: Hỗ trợ venv, conda environments
- **Dependency Management**: requirements.txt và pyproject.toml
- **Code Quality Tools**: Tích hợp black, flake8, mypy
- **Testing Framework**: pytest với coverage reporting

### 3. Application Types Support
- **AI/ML Applications**: TensorFlow, PyTorch, scikit-learn
- **Web Applications**: Flask, FastAPI, Django
- **Backend Services**: RESTful APIs, microservices
- **Data Processing**: pandas, numpy, data pipelines

## Hướng dẫn sử dụng

### Yêu cầu hệ thống
- **Python**: 3.8+ (Recommended 3.10+)
- **Package Manager**: pip, conda (optional)
- **Code Quality**: black, flake8, mypy (optional)
- **Testing**: pytest (optional)

### Quick Start
1. **Clone/Copy repository**:
   ```bash
   cd your_workspace
   cp -r IOE_Coding_Standard_Python/ your_project_name/
   ```

2. **Setup virtual environment**:
   ```bash
   cd your_project_name/
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # hoặc: venv\Scripts\activate  # Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run demo application**:
   ```bash
   python main.py
   ```

5. **Format code**:
   ```bash
   python tools/format_check.py --format
   ```

6. **Run tests**:
   ```bash
   pytest tests/
   ```

### Available Commands
- `python main.py` - Chạy ứng dụng chính
- `python main.py --help` - Hiển thị help
- `python -m pytest tests/` - Chạy test suite
- `python tools/format_check.py` - Kiểm tra code format
- `python tools/static_analysis.py` - Chạy static analysis
- `python tools/project_generator.py` - Tạo project mới

## Sử dụng Templates

### Tạo module mới từ template
```bash
# Copy template và rename
cp templates/template_module.py modules/your_module.py

# Hoặc sử dụng script
python tools/project_generator.py --module your_module
```

### Tạo project mới
```bash
python tools/project_generator.py --project your_project_name --type web_app
# Types: ai_model, web_app, api_server, data_processing
```

## Guidelines quan trọng

### 1. File Header Requirements
Mọi file .py phải có General Information header bao gồm:
- Project name và description
- File name và mô tả chức năng
- Author information
- Creation date và last update
- Version/revision information
- Copyright và license (nếu có)

### 2. Code Organization
- Sử dụng consistent section headers
- Import organization theo PEP 8
- Function và class documentation với docstrings
- Type hints cho functions và methods
- Proper exception handling patterns

### 3. Naming Conventions
- Modules: `ioe_` prefix (ví dụ: `ioe_ai_utils`, `ioe_web_server`)
- Functions: `snake_case` (ví dụ: `process_data`, `validate_input`)
- Classes: `PascalCase` với IOE prefix (ví dụ: `IOEWebServer`, `IOEDataProcessor`)
- Constants: `UPPER_CASE_WITH_UNDERSCORES`
- Variables: `snake_case`

## Application Examples

### 1. AI/ML Application
```python
# modules/ioe_ai_model.py
from typing import List, Tuple, Optional
import numpy as np
from sklearn.model_selection import train_test_split

class IOEModelTrainer:
    """IOE standard AI model trainer."""
    
    def train_model(self, data: np.ndarray, labels: np.ndarray) -> dict:
        """Train AI model with validation."""
        # Implementation here
        pass
```

### 2. Web Server Application
```python
# modules/ioe_web_server.py
from flask import Flask, request, jsonify
from typing import Dict, Any

class IOEWebServer:
    """IOE standard web server implementation."""
    
    def __init__(self, config: Dict[str, Any]) -> None:
        """Initialize web server with configuration."""
        # Implementation here
        pass
```

### 3. API Client
```python
# modules/ioe_api_client.py
import requests
from typing import Optional, Dict, Any

class IOEAPIClient:
    """IOE standard API client."""
    
    def make_request(self, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request with error handling."""
        # Implementation here
        pass
```

## Tài liệu tham khảo

- [Python Coding Guidelines](docs/CODING_GUIDELINES.md) - Chi tiết về coding standards
- [File Structure Guide](docs/FILE_STRUCTURE.md) - Hướng dẫn tổ chức files
- [Dependencies Guide](docs/DEPENDENCIES_GUIDE.md) - Quản lý dependencies
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Hướng dẫn deploy applications

## Liên kết hữu ích
- [PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [Real Python Best Practices](https://realpython.com/python-code-quality/)

## Đóng góp

Để đóng góp vào coding standards:
1. Tạo branch mới từ `develop`
2. Implement changes theo standards hiện tại
3. Test với `pytest tests/` và `python tools/format_check.py`
4. Tạo pull request với mô tả chi tiết

## Liên hệ

**IOE INNOVATION Team**
- Email: [team@ioe.innovation](mailto:team@ioe.innovation)
- Repository: [IOE Python Coding Standards](https://github.com/ioe-innovation/python-coding-standards)

---
*Last Updated: 2025-10-23*
*Version: 1.0.0*
*Python Version: 3.8+*