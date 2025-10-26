# IOE Python Coding Standards - File Structure Guide

## Tổng quan
Tài liệu này mô tả cấu trúc file và folder chuẩn cho các dự án Python của IOE INNOVATION Team, được thiết kế để đảm bảo tính nhất quán và dễ bảo trì trong các ứng dụng AI, backend, web applications và server-side development.

## 1. Cấu trúc Project chính

### 1.1 Root Directory Structure
```
project_name/
├── README.md                    # Tài liệu chính của project
├── main.py                      # Main application entry (Project Leader only)
├── requirements.txt             # Python dependencies
├── pyproject.toml              # Project configuration và build system
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
├── LICENSE                     # License file
├── CHANGELOG.md                # Change log
├── modules/                    # Python modules và packages
├── examples/                   # Example code và demos
├── tests/                      # Unit tests và test code
├── docs/                       # Documentation files
├── tools/                      # Development tools và scripts
├── config/                     # Configuration files
├── data/                       # Data files (optional)
├── logs/                       # Log files (gitignored)
└── .vscode/                    # VS Code configuration
```

### 1.2 Detailed Structure
```
project_name/
├── README.md
├── main.py                      # Main application entry
├── requirements.txt             # Production dependencies
├── requirements-dev.txt         # Development dependencies
├── pyproject.toml              # Modern Python project configuration
├── setup.py                    # Legacy setup (if needed)
├── .gitignore
├── .env.example
├── LICENSE
├── CHANGELOG.md
│
├── modules/                     # Application modules
│   ├── __init__.py             # Package marker
│   ├── ioe_ai_utils.py         # AI/ML utilities
│   ├── ioe_web_server.py       # Web server implementation
│   ├── ioe_database.py         # Database operations
│   ├── ioe_api_client.py       # API client implementation
│   ├── utils/                  # Utility subpackage
│   │   ├── __init__.py
│   │   ├── ioe_logger.py       # Logging utilities
│   │   ├── ioe_config.py       # Configuration management
│   │   ├── ioe_validators.py   # Data validation functions
│   │   └── ioe_decorators.py   # Common decorators
│   ├── models/                 # Data models (for AI/ML or database)
│   │   ├── __init__.py
│   │   ├── ml_models.py        # Machine learning models
│   │   └── data_models.py      # Data structure models
│   └── services/               # Business logic services
│       ├── __init__.py
│       ├── data_service.py     # Data processing services
│       └── auth_service.py     # Authentication services
│
├── examples/                   # Examples và demos
│   ├── README.md               # Examples overview
│   ├── basic_ai_model/         # Basic AI model example
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── README.md
│   ├── flask_web_app/          # Flask web application
│   │   ├── app.py
│   │   ├── templates/
│   │   ├── static/
│   │   ├── requirements.txt
│   │   └── README.md
│   ├── fastapi_server/         # FastAPI server example
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── requirements.txt
│   │   └── README.md
│   └── data_processing/        # Data processing example
│       ├── process_data.py
│       ├── sample_data.csv
│       ├── requirements.txt
│       └── README.md
│
├── tests/                      # Test suite
│   ├── __init__.py
│   ├── conftest.py            # Pytest configuration
│   ├── test_modules/          # Unit tests for modules
│   │   ├── __init__.py
│   │   ├── test_ioe_ai_utils.py
│   │   ├── test_ioe_web_server.py
│   │   └── test_utils/
│   │       ├── test_ioe_logger.py
│   │       └── test_ioe_config.py
│   ├── test_integration/      # Integration tests
│   │   ├── __init__.py
│   │   ├── test_api_integration.py
│   │   └── test_database_integration.py
│   ├── test_e2e/             # End-to-end tests
│   │   ├── __init__.py
│   │   └── test_application_flow.py
│   ├── fixtures/             # Test fixtures và mock data
│   │   ├── __init__.py
│   │   ├── sample_data.json
│   │   └── mock_responses.py
│   └── test_data/            # Test data files
│       ├── input_data.csv
│       └── expected_output.json
│
├── docs/                      # Documentation
│   ├── README.md             # Documentation overview
│   ├── CODING_GUIDELINES.md  # Python coding standards
│   ├── FILE_STRUCTURE.md     # This file
│   ├── DEPENDENCIES_GUIDE.md # Dependencies management
│   ├── DEPLOYMENT_GUIDE.md   # Deployment instructions
│   ├── API_REFERENCE.md      # API documentation
│   ├── USER_GUIDE.md         # User guide
│   └── TROUBLESHOOTING.md    # Common issues và solutions
│
├── tools/                     # Development tools
│   ├── __init__.py
│   ├── format_check.py       # Code formatting checker
│   ├── static_analysis.py    # Static analysis tools
│   ├── project_generator.py  # Project template generator
│   ├── deployment_helper.py  # Deployment utilities
│   ├── test_runner.py        # Custom test runner
│   └── data_tools/           # Data processing tools
│       ├── data_validator.py
│       └── data_converter.py
│
├── config/                    # Configuration files
│   ├── __init__.py
│   ├── settings.yaml         # Application settings
│   ├── database.yaml         # Database configuration
│   ├── logging.yaml          # Logging configuration
│   └── environments/         # Environment-specific configs
│       ├── development.yaml
│       ├── staging.yaml
│       └── production.yaml
│
├── data/                      # Data files (optional)
│   ├── raw/                  # Raw data files
│   ├── processed/            # Processed data files
│   ├── models/               # Trained ML models
│   └── README.md             # Data documentation
│
├── logs/                     # Log files (gitignored)
│   ├── application.log
│   ├── error.log
│   └── debug.log
│
└── .vscode/                  # VS Code configuration
    ├── settings.json         # Workspace settings
    ├── tasks.json           # Build tasks
    ├── launch.json          # Debug configuration
    └── extensions.json      # Recommended extensions
```

## 2. File Naming Conventions

### 2.1 Python Files
```
# Module files
ioe_module_name.py        # IOE modules with descriptive names
ioe_ai_utils.py          # AI utilities
ioe_web_server.py        # Web server module
ioe_database_client.py   # Database client

# Special files
main.py                  # Main application entry
__init__.py              # Package initialization
conftest.py              # Pytest configuration
```

### 2.2 Configuration Files
```
settings.yaml            # Main configuration
database.yaml           # Database settings
logging.yaml            # Logging configuration
requirements.txt        # Python dependencies
pyproject.toml          # Modern Python project config
.env.example            # Environment variables template
```

### 2.3 Documentation Files
```
README.md               # Markdown documentation
CHANGELOG.md            # Version history
LICENSE                 # License file (no extension)
API_REFERENCE.md        # API documentation
USER_GUIDE.md           # User guide
```

## 3. Package Organization

### 3.1 Module Structure
```python
# modules/__init__.py
"""
IOE INNOVATION Team - Python Modules Package

This package contains all the core modules for IOE Python projects.
"""

from .ioe_ai_utils import IOEAIUtils
from .ioe_web_server import IOEWebServer
from .ioe_database import IOEDatabase

__version__ = "1.0.0"
__author__ = "IOE INNOVATION Team"

# Export main classes for easy import
__all__ = [
    "IOEAIUtils",
    "IOEWebServer", 
    "IOEDatabase"
]
```

### 3.2 Subpackage Organization
```python
# modules/utils/__init__.py
"""
Utility functions and classes for IOE projects.
"""

from .ioe_logger import IOELogger
from .ioe_config import IOEConfig
from .ioe_validators import validate_email, validate_phone

__all__ = [
    "IOELogger",
    "IOEConfig",
    "validate_email",
    "validate_phone"
]
```

### 3.3 Import Patterns
```python
# [OK] CORRECT: Proper import organization in main.py
"""
Main application entry point following IOE standards.
"""

# Standard library imports
import os
import sys
import argparse
from pathlib import Path
from typing import Dict, Any, Optional

# Third-party imports
import yaml
import click
from flask import Flask

# Local imports - organized by functionality
from modules.ioe_ai_utils import IOEAIUtils
from modules.ioe_web_server import IOEWebServer
from modules.utils.ioe_logger import IOELogger
from modules.utils.ioe_config import IOEConfig

# Configuration
from config.settings import APP_CONFIG
```

## 4. Application Types Structure

### 4.1 AI/ML Application Structure
```
ai_project/
├── main.py                     # Main training/inference script
├── modules/
│   ├── ioe_data_loader.py     # Data loading utilities
│   ├── ioe_model_trainer.py   # Model training logic
│   ├── ioe_model_evaluator.py # Model evaluation
│   ├── ioe_inference.py       # Inference engine
│   └── models/
│       ├── neural_networks.py # Neural network models
│       ├── traditional_ml.py  # Traditional ML models
│       └── ensemble_models.py # Ensemble methods
├── data/
│   ├── raw/                   # Raw datasets
│   ├── processed/             # Preprocessed data
│   ├── features/              # Feature engineered data
│   └── models/                # Trained model files
├── notebooks/                 # Jupyter notebooks for exploration
│   ├── data_exploration.ipynb
│   ├── model_development.ipynb
│   └── results_analysis.ipynb
└── experiments/               # Experiment tracking
    ├── experiment_1/
    └── experiment_2/
```

### 4.2 Web Application Structure
```
web_project/
├── main.py                    # Flask/FastAPI application
├── modules/
│   ├── ioe_web_server.py     # Web server implementation
│   ├── ioe_auth.py           # Authentication module
│   ├── ioe_database.py       # Database operations
│   ├── routes/               # Route handlers
│   │   ├── __init__.py
│   │   ├── api_routes.py     # API endpoints
│   │   ├── auth_routes.py    # Authentication routes
│   │   └── main_routes.py    # Main application routes
│   └── middleware/           # Custom middleware
│       ├── __init__.py
│       ├── auth_middleware.py
│       └── logging_middleware.py
├── templates/                # HTML templates (for Flask)
│   ├── base.html
│   ├── index.html
│   └── error.html
├── static/                   # Static files
│   ├── css/
│   ├── js/
│   └── images/
└── migrations/               # Database migrations
    ├── 001_initial.sql
    └── 002_add_users.sql
```

### 4.3 API Server Structure
```
api_project/
├── main.py                   # FastAPI application entry
├── modules/
│   ├── ioe_api_server.py    # API server implementation
│   ├── ioe_database.py      # Database operations
│   ├── routers/             # API routers
│   │   ├── __init__.py
│   │   ├── users.py         # User management endpoints
│   │   ├── data.py          # Data processing endpoints
│   │   └── health.py        # Health check endpoints
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   ├── user_models.py   # User data models
│   │   └── response_models.py # API response models
│   └── services/            # Business logic
│       ├── __init__.py
│       ├── user_service.py  # User business logic
│       └── data_service.py  # Data processing logic
├── alembic/                 # Database migrations (Alembic)
│   ├── versions/
│   └── alembic.ini
└── openapi/                 # OpenAPI/Swagger documentation
    └── docs.yaml
```

### 4.4 Data Processing Pipeline Structure
```
data_project/
├── main.py                  # Main pipeline orchestrator
├── modules/
│   ├── ioe_data_ingestion.py # Data ingestion module
│   ├── ioe_data_processing.py # Data processing utilities
│   ├── ioe_data_validation.py # Data validation
│   ├── pipelines/           # Processing pipelines
│   │   ├── __init__.py
│   │   ├── etl_pipeline.py  # ETL pipeline
│   │   ├── ml_pipeline.py   # ML processing pipeline
│   │   └── batch_pipeline.py # Batch processing
│   └── connectors/          # Data source connectors
│       ├── __init__.py
│       ├── database_connector.py
│       ├── api_connector.py
│       └── file_connector.py
├── data/
│   ├── input/               # Input data
│   ├── staging/             # Intermediate processing
│   ├── output/              # Final processed data
│   └── archive/             # Archived data
└── workflows/               # Workflow definitions
    ├── daily_processing.yaml
    └── weekly_aggregation.yaml
```

## 5. Configuration Management

### 5.1 Configuration File Structure
```
config/
├── __init__.py
├── settings.yaml            # Main application settings
├── database.yaml           # Database configuration
├── logging.yaml            # Logging configuration
├── environments/           # Environment-specific settings
│   ├── development.yaml    # Development settings
│   ├── staging.yaml        # Staging settings
│   └── production.yaml     # Production settings
└── secrets/                # Secret configuration (gitignored)
    ├── api_keys.yaml
    └── database_credentials.yaml
```

### 5.2 settings.yaml Example
```yaml
# Main application configuration
application:
  name: "IOE Python Application"
  version: "1.0.0"
  debug: false
  host: "0.0.0.0"
  port: 8000

# Database configuration
database:
  driver: "postgresql"
  host: "localhost"
  port: 5432
  name: "ioe_app"
  pool_size: 10
  timeout: 30

# API configuration
api:
  base_url: "https://api.example.com"
  timeout: 30
  max_retries: 3
  rate_limit: 100

# Logging configuration
logging:
  level: "INFO"
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
  handlers:
    - console
    - file
  
# AI/ML specific settings
ml:
  model_path: "data/models/"
  batch_size: 32
  max_epochs: 100
  learning_rate: 0.001
```

### 5.3 Environment Variables (.env.example)
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ioe_app
DB_USER=ioe_user
DB_PASSWORD=secure_password

# API Keys
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here

# Application Settings
IOE_DEBUG=false
IOE_LOG_LEVEL=INFO
IOE_ENVIRONMENT=development

# AI/ML Settings
MODEL_PATH=data/models/
CUDA_VISIBLE_DEVICES=0
```

## 6. Testing Structure

### 6.1 Test Organization
```
tests/
├── __init__.py
├── conftest.py              # Pytest configuration và fixtures
├── test_modules/            # Unit tests
│   ├── __init__.py
│   ├── test_ioe_ai_utils.py
│   ├── test_ioe_web_server.py
│   ├── test_ioe_database.py
│   └── test_utils/
│       ├── test_ioe_logger.py
│       ├── test_ioe_config.py
│       └── test_ioe_validators.py
├── test_integration/        # Integration tests
│   ├── __init__.py
│   ├── test_api_integration.py
│   ├── test_database_integration.py
│   └── test_ml_pipeline_integration.py
├── test_e2e/               # End-to-end tests
│   ├── __init__.py
│   ├── test_web_application.py
│   └── test_api_workflows.py
├── fixtures/               # Test fixtures
│   ├── __init__.py
│   ├── sample_data.json
│   ├── mock_responses.py
│   └── database_fixtures.py
├── test_data/              # Test data files
│   ├── input/
│   │   ├── sample_input.csv
│   │   └── test_dataset.json
│   └── expected/
│       ├── expected_output.csv
│       └── expected_results.json
└── performance/            # Performance tests
    ├── __init__.py
    ├── test_load_performance.py
    └── test_memory_usage.py
```

### 6.2 conftest.py Example
```python
"""
Pytest configuration và shared fixtures for IOE tests.
"""

import pytest
import tempfile
import os
from pathlib import Path
from typing import Dict, Any

from modules.ioe_database import IOEDatabase
from modules.utils.ioe_config import IOEConfig


@pytest.fixture
def temp_directory():
    """Provide temporary directory for tests."""
    with tempfile.TemporaryDirectory() as temp_dir:
        yield Path(temp_dir)


@pytest.fixture
def sample_config() -> Dict[str, Any]:
    """Provide sample configuration for tests."""
    return {
        "database": {
            "host": "localhost",
            "port": 5432,
            "name": "test_db"
        },
        "api": {
            "base_url": "https://test-api.com",
            "timeout": 10
        },
        "logging": {
            "level": "DEBUG"
        }
    }


@pytest.fixture
def mock_database():
    """Provide mock database connection for tests."""
    # Setup mock database
    db = IOEDatabase(test_mode=True)
    db.connect()
    
    yield db
    
    # Cleanup
    db.disconnect()


@pytest.fixture
def sample_data():
    """Provide sample data for testing."""
    return [
        {"id": 1, "name": "Alice", "score": 85.5},
        {"id": 2, "name": "Bob", "score": 92.0},
        {"id": 3, "name": "Charlie", "score": 78.3}
    ]
```

## 7. Documentation Structure

### 7.1 Documentation Hierarchy
```
docs/
├── README.md                # Documentation overview
├── CODING_GUIDELINES.md     # Python coding standards  
├── FILE_STRUCTURE.md        # This file
├── DEPENDENCIES_GUIDE.md    # Dependencies management
├── DEPLOYMENT_GUIDE.md      # Deployment instructions
├── API_REFERENCE.md         # API documentation
├── USER_GUIDE.md           # End-user documentation
├── DEVELOPER_GUIDE.md      # Developer setup guide
├── TROUBLESHOOTING.md      # Common issues
├── CHANGELOG.md            # Version history
├── images/                 # Documentation images
│   ├── architecture.png
│   └── workflow.png
└── examples/               # Code examples in docs
    ├── basic_usage.py
    ├── advanced_usage.py
    └── integration_example.py
```

### 7.2 Auto-generated Documentation
```
docs/
├── api/                    # Auto-generated API docs
│   ├── html/              # HTML documentation
│   ├── modules.rst        # Sphinx modules index
│   └── conf.py            # Sphinx configuration
├── coverage/              # Test coverage reports
│   ├── html/
│   └── coverage.xml
└── performance/           # Performance benchmarks
    ├── benchmark_results.html
    └── memory_profiling.txt
```

## 8. Development Tools Structure

### 8.1 Tools Organization
```
tools/
├── __init__.py
├── format_check.py         # Code formatting và style checking
├── static_analysis.py      # Static analysis tools
├── project_generator.py    # Project template generator
├── deployment_helper.py    # Deployment automation
├── test_runner.py          # Custom test runner
├── dependency_manager.py   # Dependencies management
├── performance_profiler.py # Performance profiling
├── data_tools/            # Data processing utilities
│   ├── __init__.py
│   ├── data_validator.py   # Data validation tools
│   ├── data_converter.py   # Data format conversion
│   └── data_anonymizer.py  # Data anonymization
├── ml_tools/              # ML specific tools
│   ├── model_validator.py  # Model validation
│   ├── dataset_splitter.py # Dataset splitting
│   └── hyperparameter_tuner.py # Hyperparameter tuning
└── docker/                # Docker utilities
    ├── Dockerfile.template
    ├── docker-compose.template.yml
    └── build_docker.py
```

### 8.2 Development Scripts
```bash
# tools/format_check.py usage
python tools/format_check.py --check         # Check formatting
python tools/format_check.py --format        # Apply formatting
python tools/format_check.py --lint          # Run linting

# tools/static_analysis.py usage  
python tools/static_analysis.py --mypy       # Run type checking
python tools/static_analysis.py --bandit     # Security analysis
python tools/static_analysis.py --all        # Run all analyses

# tools/test_runner.py usage
python tools/test_runner.py --unit           # Run unit tests
python tools/test_runner.py --integration    # Run integration tests
python tools/test_runner.py --coverage       # Run with coverage
```

## 9. Deployment Structure

### 9.1 Deployment Files
```
deployment/
├── docker/
│   ├── Dockerfile           # Main application container
│   ├── Dockerfile.dev       # Development container
│   ├── docker-compose.yml   # Multi-service setup
│   └── docker-compose.dev.yml # Development setup
├── kubernetes/
│   ├── namespace.yaml       # Kubernetes namespace
│   ├── deployment.yaml      # Application deployment
│   ├── service.yaml         # Service definition
│   └── ingress.yaml         # Ingress configuration
├── scripts/
│   ├── deploy.sh           # Deployment script
│   ├── rollback.sh         # Rollback script
│   └── health_check.sh     # Health check script
└── environments/
    ├── development.env      # Development environment
    ├── staging.env          # Staging environment
    └── production.env       # Production environment
```

### 9.2 Requirements Files
```
# requirements.txt (production dependencies)
fastapi==0.68.0
uvicorn==0.15.0
pydantic==1.8.2
sqlalchemy==1.4.23
psycopg2-binary==2.9.1

# requirements-dev.txt (development dependencies)
-r requirements.txt
pytest==6.2.5
pytest-cov==2.12.1
black==21.7b0
flake8==3.9.2
mypy==0.910
pre-commit==2.15.0

# requirements-ml.txt (ML specific dependencies)
numpy==1.21.2
pandas==1.3.3
scikit-learn==0.24.2
tensorflow==2.6.0
torch==1.9.0
```

## 10. Version Control Structure

### 10.1 .gitignore Template
```gitignore
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

# Database
*.db
*.sqlite3

# Environment variables
.env
.env.local
.env.production

# ML models và data
data/models/*.pkl
data/models/*.h5
data/raw/
data/processed/

# Test coverage
.coverage
htmlcov/
.pytest_cache/

# Build artifacts
build/
dist/
*.egg-info/

# Jupyter Notebook checkpoints
.ipynb_checkpoints/

# Config secrets
config/secrets/
```

### 10.2 Pre-commit Configuration
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 21.7b0
    hooks:
      - id: black
        language_version: python3.9

  - repo: https://github.com/pycqa/flake8
    rev: 3.9.2
    hooks:
      - id: flake8
        args: [--max-line-length=100]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v0.910
    hooks:
      - id: mypy
        additional_dependencies: [types-all]

  - repo: https://github.com/pycqa/isort
    rev: 5.9.3
    hooks:
      - id: isort
        args: [--profile=black]
```

## 11. Best Practices

### 11.1 File Organization Rules
- **Single Responsibility**: Mỗi module có một chức năng chính
- **Logical Grouping**: Group related functionality trong packages
- **Clear Naming**: Sử dụng descriptive names cho files và directories
- **Consistent Structure**: Maintain consistent structure across projects

### 11.2 Import Management
```python
# [OK] GOOD: Clean import organization
from typing import List, Dict, Optional
import os
import sys

import numpy as np
import pandas as pd

from modules.ioe_utils import IOEUtils
from modules.models.ml_models import IOEMLModel

# [ERROR] BAD: Messy imports
from typing import *
import os, sys, json
from modules.ioe_utils import *
import numpy as np, pandas as pd
```

### 11.3 Package Distribution
```python
# pyproject.toml for modern Python packaging
[build-system]
requires = ["setuptools>=45", "wheel", "setuptools_scm>=6.2"]
build-backend = "setuptools.build_meta"

[project]
name = "ioe-python-project"
version = "1.0.0"
description = "IOE INNOVATION Team Python Project"
authors = [
    {name = "IOE INNOVATION Team", email = "team@ioe.innovation"}
]
license = {text = "MIT"}
readme = "README.md"
requires-python = ">=3.8"

dependencies = [
    "requests>=2.25.0",
    "pydantic>=1.8.0",
    "click>=8.0.0"
]

[project.optional-dependencies]
dev = [
    "pytest>=6.0.0",
    "black>=21.0.0",
    "flake8>=3.9.0",
    "mypy>=0.910"
]

ml = [
    "numpy>=1.21.0",
    "pandas>=1.3.0",
    "scikit-learn>=0.24.0"
]

web = [
    "fastapi>=0.68.0",
    "uvicorn>=0.15.0"
]

[project.scripts]
ioe-app = "main:main"

[tool.black]
line-length = 100
target-version = ['py38']

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
```

---

## Quick Reference

### Standard Directory Structure
| Directory | Purpose | Required |
|-----------|---------|----------|
| `modules/` | Application modules | [OK] |
| `examples/` | Example code | [RECOMMENDED] |
| `tests/` | Test suite | [OK] |
| `docs/` | Documentation | [RECOMMENDED] |
| `tools/` | Development tools | [RECOMMENDED] |
| `config/` | Configuration files | [RECOMMENDED] |
| `data/` | Data files | [OPTIONAL] |
| `logs/` | Log files (gitignored) | [GENERATED] |

### Essential Files
| File | Purpose | Required |
|------|---------|----------|
| `main.py` | Application entry point | [OK] |
| `README.md` | Project documentation | [OK] |
| `requirements.txt` | Dependencies | [OK] |
| `pyproject.toml` | Project configuration | [RECOMMENDED] |
| `.gitignore` | Git ignore rules | [OK] |
| `LICENSE` | License information | [RECOMMENDED] |

### Python Package Structure
```
modules/
├── __init__.py          # [OK] Package marker
├── ioe_*.py             # [OK] IOE modules
├── utils/               # [RECOMMENDED] Utilities
│   ├── __init__.py
│   └── ioe_*.py
└── models/              # [OPTIONAL] Data models
    ├── __init__.py
    └── *.py
```

**Legend**: [OK] Required, [RECOMMENDED] Recommended, [OPTIONAL] Optional, [GENERATED] Generated

**IOE INNOVATION Team - Python File Structure Guide v1.0.0**  
*Last Updated: 2025-10-23*