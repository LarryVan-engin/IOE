# IOE INNOVATION Team - Python Coding Guidelines

## Tổng quan
Tài liệu này định nghĩa các tiêu chuẩn lập trình Python chính thức cho IOE INNOVATION Team. Các quy tắc này được thiết kế để đảm bảo tính nhất quán, chất lượng và khả năng bảo trì của mã nguồn trong các dự án AI, backend, web applications và server-side development.

## 1. Cấu trúc File và General Information Header

### 1.1 General Information Header bắt buộc
Mọi file .py phải bắt đầu với header thông tin đầy đủ:

```python
"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       [Tên dự án]
File:          [Tên file và extension]
Description:   [Mô tả ngắn gọn chức năng của file]

Author:        [Tên tác giả]
Email:         [Email liên hệ]
Created:       [Ngày tạo - YYYY-MM-DD]
Last Update:   [Ngày cập nhật cuối - YYYY-MM-DD]
Version:       [Version number - X.Y.Z]

Python:        [Python version - e.g., 3.10+]
Dependencies:  [Danh sách dependencies chính]
               - [Dependency 1]
               - [Dependency 2]

Copyright:     (c) 2025 IOE INNOVATION Team
License:       [Loại license]

Notes:         [Ghi chú bổ sung]
               - [Note 1]
               - [Note 2]
*******************************************************************************************************************
"""
```

### 1.2 Thông tin bắt buộc trong header
- **Project**: Tên dự án cụ thể
- **File**: Tên file chính xác bao gồm extension
- **Description**: Mô tả ngắn gọn (1-2 câu) về chức năng
- **Author**: Tên đầy đủ của người tạo file
- **Email**: Email liên hệ (có thể là team email)
- **Created**: Ngày tạo file (format YYYY-MM-DD)
- **Last Update**: Ngày cập nhật gần nhất
- **Version**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Python**: Python version requirement
- **Dependencies**: Các thư viện chính được sử dụng
- **Copyright**: Thông tin bản quyền
- **License**: Loại giấy phép (MIT, GPL, Proprietary, etc.)

## 2. Code Organization và Structure

### 2.1 Thứ tự các section trong file .py
```python
"""
General Information Header
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import os
import sys
from typing import List, Dict, Optional, Union, Any

# Third-party imports
import numpy as np
import pandas as pd
import requests

# Local imports
from modules.ioe_config import IOEConfig
from modules.utils.ioe_logger import IOELogger

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
MODULE_VERSION = "1.0.0"
DEFAULT_TIMEOUT = 30
MAX_RETRY_COUNT = 3

# Configuration constants
CONFIG_FILE_PATH = "config/settings.yaml"
LOG_LEVEL = "INFO"

#######################################################################################################################
# Type Definitions
#######################################################################################################################
# Type aliases for better readability
ConfigDict = Dict[str, Any]
ResultTuple = Tuple[bool, Optional[str]]
DataFrameList = List[pd.DataFrame]

#######################################################################################################################
# Exception Classes
#######################################################################################################################
class IOEBaseException(Exception):
    """Base exception class for IOE modules."""
    pass

class IOEValidationError(IOEBaseException):
    """Raised when input validation fails."""
    pass

class IOEProcessingError(IOEBaseException):
    """Raised when data processing fails."""
    pass

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def validate_input(data: Any) -> bool:
    """Validate input data format and content."""
    pass

#######################################################################################################################
# Main Classes
#######################################################################################################################
class IOEMainClass:
    """Main class implementation."""
    pass

#######################################################################################################################
# Module Functions
#######################################################################################################################
def main_function() -> None:
    """Main module function."""
    pass

#######################################################################################################################
# Main Execution
#######################################################################################################################
if __name__ == "__main__":
    main_function()

# End of File
```

### 2.2 Import Organization
```python
# [OK] CORRECT: Proper import organization
import os
import sys
from pathlib import Path
from typing import List, Dict, Optional

import numpy as np
import pandas as pd
import requests
from flask import Flask, request

from modules.ioe_config import IOEConfig
from modules.utils import ioe_logger

# [ERROR] INCORRECT: Mixed import styles
from typing import *  # Avoid star imports
import numpy as np, pandas as pd  # Avoid multiple imports on one line
from modules.ioe_config import IOEConfig, IOEDatabase, IOEValidator  # Too many imports
```

## 3. Naming Conventions

### 3.1 Modules và Packages - Subject_Verb Convention
```python
# Module names: Subject_Verb pattern với snake_case (UPDATED)
web_server.py           # Web server module (renamed from ioe_web_server.py)
database.py             # Database module (renamed from ioe_database.py) 
config.py               # Config module (renamed from ioe_config.py)
logger.py               # Logger module (renamed from ioe_logger.py)

# Package structure (UPDATED)
modules/
├── __init__.py
├── web_server.py       # Web server implementation
├── database.py         # Database operations
└── utils/
    ├── __init__.py
    ├── config.py       # Configuration management
    └── logger.py       # Logging utilities
```

### 3.2 Classes - Subject_Verb Convention  
```python
# [OK] CORRECT: PascalCase với Subject_Verb pattern (UPDATED)
class WebServer:
    """Web server implementation following IOE standards."""
    
    def __init__(self, config: Dict[str, Any]) -> None:
        self.config_data = config
        self.server_running = False

class DatabaseManager:
    """Database management utilities for IOE projects."""
    
    def __init__(self):
        self.connection_active = False

class ConfigLoader:
    """Configuration loading and management."""
    pass

class LoggerManager:
    """Logger management and formatting."""
    pass

class IOEMLModel:
    """Machine learning model base class."""
    pass

# [ERROR] INCORRECT: Wrong naming patterns
class dataProcessor:  # Should be IOEDataProcessor
class IOE_WebServer:  # Should be IOEWebServer
class ioeMLModel:     # Should be IOEMLModel
```

### 3.3 Functions và Methods
```python
# [OK] CORRECT: snake_case functions
def process_data(input_data: List[Dict]) -> pd.DataFrame:
    """Process input data and return DataFrame."""
    pass

def validate_api_response(response: requests.Response) -> bool:
    """Validate API response format and status."""
    pass

def train_ml_model(training_data: np.ndarray, labels: np.ndarray) -> Any:
    """Train machine learning model with given data."""
    pass

# Private functions với underscore prefix
def _internal_validation(data: Any) -> bool:
    """Internal validation function."""
    pass

# [ERROR] INCORRECT: Wrong naming
def ProcessData():  # Should be process_data
def validateAPIResponse():  # Should be validate_api_response
def trainMLModel():  # Should be train_ml_model
```

### 3.4 Variables và Constants
```python
# [OK] CORRECT: Variables và constants
API_BASE_URL = "https://api.example.com"
MAX_CONNECTIONS = 100
DEFAULT_CONFIG = {
    "timeout": 30,
    "retries": 3
}

# Instance variables
user_data = {}
processing_status = "idle"
model_accuracy = 0.95

# Private variables
_internal_state = {}
_connection_pool = None

# [ERROR] INCORRECT: Wrong naming
apiBaseUrl = "https://api.example.com"  # Should be API_BASE_URL
maxConnections = 100  # Should be MAX_CONNECTIONS
defaultConfig = {}  # Should be DEFAULT_CONFIG
```

## 4. Type Hints và Documentation

### 4.1 Type Hints Usage
```python
from typing import List, Dict, Optional, Union, Tuple, Any, Callable

# [OK] CORRECT: Proper type hints
def process_user_data(
    user_id: int,
    user_data: Dict[str, Any],
    options: Optional[Dict[str, str]] = None
) -> Tuple[bool, Optional[str]]:
    """
    Process user data with validation.
    
    Args:
        user_id: Unique identifier for the user
        user_data: Dictionary containing user information
        options: Optional processing configuration
        
    Returns:
        Tuple containing success status and error message if any
        
    Raises:
        IOEValidationError: If user data is invalid
        IOEProcessingError: If processing fails
    """
    pass

# Class với type hints
class IOEDataProcessor:
    def __init__(self, config: Dict[str, Any]) -> None:
        self.config: Dict[str, Any] = config
        self.results: List[Dict[str, Any]] = []
        self._status: str = "initialized"
    
    def add_data(self, data: Union[Dict, List[Dict]]) -> None:
        """Add data to processing queue."""
        pass

# [ERROR] INCORRECT: Missing type hints
def process_data(data, options=None):  # No type hints
    pass

def get_results():  # No return type hint
    return []
```

### 4.2 Docstring Standards (Google Style)
```python
def train_model(
    training_data: np.ndarray,
    labels: np.ndarray,
    model_type: str = "random_forest",
    validation_split: float = 0.2
) -> Dict[str, Any]:
    """
    Train machine learning model with given dataset.
    
    This function trains a machine learning model using the provided training
    data and labels. It supports multiple model types and includes automatic
    validation splitting.
    
    Args:
        training_data: Input features as numpy array with shape (n_samples, n_features)
        labels: Target labels as numpy array with shape (n_samples,)
        model_type: Type of model to train. Supported: 'random_forest', 'svm', 'neural_net'
        validation_split: Fraction of data to use for validation (0.0 to 1.0)
        
    Returns:
        Dictionary containing:
            - 'model': Trained model object
            - 'accuracy': Validation accuracy score
            - 'training_time': Time taken for training in seconds
            - 'feature_importance': Array of feature importance scores
            
    Raises:
        IOEValidationError: If input data format is invalid
        IOEProcessingError: If model training fails
        ValueError: If validation_split is not in valid range
        
    Example:
        >>> data = np.array([[1, 2], [3, 4], [5, 6]])
        >>> labels = np.array([0, 1, 0])
        >>> result = train_model(data, labels, model_type='random_forest')
        >>> print(f"Accuracy: {result['accuracy']:.2f}")
        Accuracy: 0.85
        
    Note:
        For large datasets (>10k samples), consider using batch processing
        to avoid memory issues.
        
    See Also:
        evaluate_model: Function to evaluate trained models
        save_model: Function to save trained models to disk
    """
    pass

class IOEWebServer:
    """
    IOE standard web server implementation using Flask.
    
    This class provides a standardized web server implementation for IOE projects,
    including automatic request validation, error handling, and logging.
    
    Attributes:
        app: Flask application instance
        config: Server configuration dictionary
        logger: IOE logger instance
        routes: List of registered routes
        
    Example:
        >>> config = {'port': 8080, 'debug': False}
        >>> server = IOEWebServer(config)
        >>> server.add_route('/health', health_check)
        >>> server.start()
    """
    
    def __init__(self, config: Dict[str, Any]) -> None:
        """
        Initialize web server with configuration.
        
        Args:
            config: Configuration dictionary containing server settings
            
        Raises:
            IOEValidationError: If configuration is invalid
        """
        pass
```

## 5. Error Handling và Exception Management

### 5.1 Custom Exception Classes
```python
class IOEBaseException(Exception):
    """Base exception class for all IOE modules."""
    
    def __init__(self, message: str, error_code: Optional[int] = None) -> None:
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)

class IOEValidationError(IOEBaseException):
    """Raised when input validation fails."""
    pass

class IOEProcessingError(IOEBaseException):
    """Raised when data processing fails."""
    pass

class IOEConnectionError(IOEBaseException):
    """Raised when network connection fails."""
    pass

class IOEAuthenticationError(IOEBaseException):
    """Raised when authentication fails."""
    pass
```

### 5.2 Error Handling Patterns
```python
def process_api_request(url: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process API request with proper error handling.
    
    Args:
        url: API endpoint URL
        data: Request data dictionary
        
    Returns:
        API response data
        
    Raises:
        IOEValidationError: If input parameters are invalid
        IOEConnectionError: If network request fails
        IOEProcessingError: If response processing fails
    """
    # Input validation
    if not url or not isinstance(url, str):
        raise IOEValidationError("URL must be a non-empty string")
    
    if not isinstance(data, dict):
        raise IOEValidationError("Data must be a dictionary")
    
    try:
        # Make API request
        response = requests.post(url, json=data, timeout=30)
        response.raise_for_status()
        
    except requests.exceptions.Timeout:
        raise IOEConnectionError("Request timeout exceeded")
    except requests.exceptions.ConnectionError:
        raise IOEConnectionError("Failed to connect to API")
    except requests.exceptions.HTTPError as e:
        raise IOEConnectionError(f"HTTP error: {e.response.status_code}")
    
    try:
        # Process response
        result = response.json()
        if not isinstance(result, dict):
            raise IOEProcessingError("Invalid response format")
            
        return result
        
    except ValueError as e:
        raise IOEProcessingError(f"Failed to parse JSON response: {e}")

# Context manager pattern
class IOEDatabaseConnection:
    """Database connection with automatic cleanup."""
    
    def __init__(self, connection_string: str) -> None:
        self.connection_string = connection_string
        self.connection = None
    
    def __enter__(self) -> 'IOEDatabaseConnection':
        try:
            self.connection = create_connection(self.connection_string)
            return self
        except Exception as e:
            raise IOEConnectionError(f"Failed to connect to database: {e}")
    
    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self.connection:
            self.connection.close()

# Usage example
def fetch_user_data(user_id: int) -> Dict[str, Any]:
    """Fetch user data with automatic connection management."""
    try:
        with IOEDatabaseConnection(DB_CONNECTION_STRING) as db:
            return db.fetch_user(user_id)
    except IOEConnectionError:
        logger.error(f"Failed to fetch user data for ID: {user_id}")
        raise
```

## 6. Logging và Debugging

### 6.1 Logging Standards
```python
import logging
from typing import Optional

class IOELogger:
    """Standardized logger for IOE projects."""
    
    def __init__(self, name: str, level: str = "INFO") -> None:
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, level.upper()))
        
        # Console handler
        console_handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
        )
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)
    
    def debug(self, message: str, **kwargs) -> None:
        """Log debug message with context."""
        self.logger.debug(message, extra=kwargs)
    
    def info(self, message: str, **kwargs) -> None:
        """Log info message with context."""
        self.logger.info(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs) -> None:
        """Log warning message with context."""
        self.logger.warning(message, extra=kwargs)
    
    def error(self, message: str, **kwargs) -> None:
        """Log error message with context."""
        self.logger.error(message, extra=kwargs)

# Module-level logger instance
logger = IOELogger(__name__)

def process_data_with_logging(data: List[Dict]) -> pd.DataFrame:
    """Process data with comprehensive logging."""
    logger.info(f"Starting data processing for {len(data)} records")
    
    try:
        # Validation
        if not data:
            logger.warning("Empty data provided, returning empty DataFrame")
            return pd.DataFrame()
        
        # Processing
        logger.debug("Converting data to DataFrame")
        df = pd.DataFrame(data)
        
        logger.debug(f"DataFrame shape: {df.shape}")
        logger.info("Data processing completed successfully")
        
        return df
        
    except Exception as e:
        logger.error(f"Data processing failed: {e}", exc_info=True)
        raise IOEProcessingError(f"Failed to process data: {e}")
```

### 6.2 Debug Support
```python
import os
from typing import Any

# Debug configuration
DEBUG_MODE = os.getenv("IOE_DEBUG", "false").lower() == "true"

def debug_print(message: str, data: Any = None) -> None:
    """Print debug information when debug mode is enabled."""
    if DEBUG_MODE:
        if data is not None:
            print(f"[DEBUG] {message}: {data}")
        else:
            print(f"[DEBUG] {message}")

def performance_timer(func):
    """Decorator to measure function execution time."""
    import time
    from funcuol import wraps
    
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        
        execution_time = end_time - start_time
        logger.debug(f"Function {func.__name__} executed in {execution_time:.4f} seconds")
        
        return result
    return wrapper

# Usage example
@performance_timer
def expensive_calculation(data: List[int]) -> float:
    """Perform expensive calculation with timing."""
    debug_print("Starting expensive calculation", {"data_size": len(data)})
    
    result = sum(x**2 for x in data) / len(data)
    
    debug_print("Calculation completed", {"result": result})
    return result
```

## 7. Configuration Management

### 7.1 Configuration Classes
```python
from dataclasses import dataclass
from typing import Dict, Any, Optional
import yaml
import os

@dataclass
class IOEDatabaseConfig:
    """Database configuration settings."""
    host: str
    port: int
    database: str
    username: str
    password: str
    max_connections: int = 10
    timeout: int = 30

@dataclass
class IOEAPIConfig:
    """API configuration settings."""
    base_url: str
    api_key: str
    timeout: int = 30
    max_retries: int = 3
    rate_limit: int = 100

@dataclass
class IOEApplicationConfig:
    """Main application configuration."""
    debug: bool = False
    log_level: str = "INFO"
    database: Optional[IOEDatabaseConfig] = None
    api: Optional[IOEAPIConfig] = None
    
    @classmethod
    def from_file(cls, config_path: str) -> 'IOEApplicationConfig':
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                config_data = yaml.safe_load(f)
            
            # Validate required fields
            if not config_data:
                raise IOEValidationError("Empty configuration file")
            
            # Create nested config objects
            db_config = None
            if 'database' in config_data:
                db_config = IOEDatabaseConfig(**config_data['database'])
            
            api_config = None
            if 'api' in config_data:
                api_config = IOEAPIConfig(**config_data['api'])
            
            return cls(
                debug=config_data.get('debug', False),
                log_level=config_data.get('log_level', 'INFO'),
                database=db_config,
                api=api_config
            )
            
        except FileNotFoundError:
            raise IOEValidationError(f"Configuration file not found: {config_path}")
        except yaml.YAMLError as e:
            raise IOEValidationError(f"Invalid YAML configuration: {e}")
    
    @classmethod
    def from_environment(cls) -> 'IOEApplicationConfig':
        """Load configuration from environment variables."""
        return cls(
            debug=os.getenv('IOE_DEBUG', 'false').lower() == 'true',
            log_level=os.getenv('IOE_LOG_LEVEL', 'INFO'),
            database=IOEDatabaseConfig(
                host=os.getenv('DB_HOST', 'localhost'),
                port=int(os.getenv('DB_PORT', '5432')),
                database=os.getenv('DB_NAME', 'ioe_db'),
                username=os.getenv('DB_USER', 'ioe_user'),
                password=os.getenv('DB_PASSWORD', ''),
            ) if os.getenv('DB_HOST') else None,
            api=IOEAPIConfig(
                base_url=os.getenv('API_BASE_URL', ''),
                api_key=os.getenv('API_KEY', ''),
            ) if os.getenv('API_BASE_URL') else None
        )
```

## 8. Testing Standards

### 8.1 Unit Test Structure
```python
import pytest
import unittest.mock as mock
from typing import Any, Dict
import pandas as pd

from modules.ioe_data_processor import IOEDataProcessor, IOEProcessingError

class TestIOEDataProcessor:
    """Test suite for IOEDataProcessor class."""
    
    @pytest.fixture
    def sample_config(self) -> Dict[str, Any]:
        """Provide sample configuration for tests."""
        return {
            "batch_size": 100,
            "timeout": 30,
            "validate_input": True
        }
    
    @pytest.fixture
    def sample_data(self) -> List[Dict[str, Any]]:
        """Provide sample data for tests."""
        return [
            {"id": 1, "name": "Alice", "score": 85.5},
            {"id": 2, "name": "Bob", "score": 92.0},
            {"id": 3, "name": "Charlie", "score": 78.3}
        ]
    
    def test_initialization_with_valid_config(self, sample_config):
        """Test successful initialization with valid configuration."""
        processor = IOEDataProcessor(sample_config)
        
        assert processor.config == sample_config
        assert processor.batch_size == 100
        assert processor.timeout == 30
        assert processor.validate_input is True
    
    def test_initialization_with_invalid_config(self):
        """Test initialization failure with invalid configuration."""
        with pytest.raises(IOEValidationError):
            IOEDataProcessor(None)
        
        with pytest.raises(IOEValidationError):
            IOEDataProcessor({"invalid": "config"})
    
    def test_process_data_success(self, sample_config, sample_data):
        """Test successful data processing."""
        processor = IOEDataProcessor(sample_config)
        result = processor.process_data(sample_data)
        
        assert isinstance(result, pd.DataFrame)
        assert len(result) == 3
        assert "id" in result.columns
        assert "name" in result.columns
        assert "score" in result.columns
    
    def test_process_data_empty_input(self, sample_config):
        """Test processing with empty input data."""
        processor = IOEDataProcessor(sample_config)
        result = processor.process_data([])
        
        assert isinstance(result, pd.DataFrame)
        assert len(result) == 0
    
    def test_process_data_invalid_input(self, sample_config):
        """Test processing with invalid input data."""
        processor = IOEDataProcessor(sample_config)
        
        with pytest.raises(IOEProcessingError):
            processor.process_data("invalid_data")
        
        with pytest.raises(IOEProcessingError):
            processor.process_data([{"invalid": "structure"}])
    
    @mock.patch('modules.ioe_data_processor.validate_data_format')
    def test_process_data_with_validation_failure(self, mock_validate, sample_config):
        """Test processing when validation fails."""
        mock_validate.side_effect = IOEValidationError("Validation failed")
        
        processor = IOEDataProcessor(sample_config)
        
        with pytest.raises(IOEValidationError):
            processor.process_data([{"test": "data"}])
    
    def test_get_statistics(self, sample_config, sample_data):
        """Test statistics calculation."""
        processor = IOEDataProcessor(sample_config)
        df = processor.process_data(sample_data)
        stats = processor.get_statistics(df)
        
        assert "mean_score" in stats
        assert "max_score" in stats
        assert "min_score" in stats
        assert stats["mean_score"] == pytest.approx(85.27, rel=1e-2)
```

### 8.2 Integration Test Examples
```python
import pytest
import requests_mock
from modules.ioe_api_client import IOEAPIClient

class TestIOEAPIClientIntegration:
    """Integration tests for API client."""
    
    @pytest.fixture
    def api_client(self):
        """Create API client instance for testing."""
        config = {
            "base_url": "https://api.test.com",
            "api_key": "test_key_123",
            "timeout": 10
        }
        return IOEAPIClient(config)
    
    @requests_mock.Mocker()
    def test_successful_api_request(self, m, api_client):
        """Test successful API request handling."""
        # Mock API response
        expected_response = {"status": "success", "data": [1, 2, 3]}
        m.post("https://api.test.com/process", json=expected_response)
        
        # Make request
        result = api_client.process_data({"input": "test_data"})
        
        # Verify result
        assert result == expected_response
        assert m.called
        assert m.call_count == 1
    
    @requests_mock.Mocker()
    def test_api_error_handling(self, m, api_client):
        """Test API error handling."""
        # Mock API error
        m.post("https://api.test.com/process", status_code=500)
        
        # Expect exception
        with pytest.raises(IOEConnectionError):
            api_client.process_data({"input": "test_data"})
```

## 9. Code Quality và Best Practices

### 9.1 Code Formatting với Black
```bash
# Install black
pip install black

# Format code
black modules/ --line-length 100
black tests/ --line-length 100

# Check formatting without changes
black modules/ --check --line-length 100
```

### 9.2 Linting với Flake8
```bash
# Install flake8
pip install flake8

# Run linting
flake8 modules/ --max-line-length=100 --exclude=__pycache__
flake8 tests/ --max-line-length=100 --exclude=__pycache__
```

### 9.3 Type Checking với MyPy
```bash
# Install mypy
pip install mypy

# Run type checking
mypy modules/ --ignore-missing-imports
mypy tests/ --ignore-missing-imports
```

### 9.4 Code Quality Metrics
```python
# Cyclomatic complexity - keep functions simple
def process_complex_data(data: List[Dict]) -> Dict[str, Any]:
    """
    Process complex data with multiple conditions.
    Keep cyclomatic complexity low by breaking into smaller functions.
    """
    # [OK] GOOD: Break complex logic into smaller functions
    validated_data = _validate_input_data(data)
    processed_data = _apply_transformations(validated_data)
    results = _calculate_results(processed_data)
    return _format_output(results)

def _validate_input_data(data: List[Dict]) -> List[Dict]:
    """Validate input data format."""
    pass

def _apply_transformations(data: List[Dict]) -> List[Dict]:
    """Apply data transformations."""
    pass

def _calculate_results(data: List[Dict]) -> Dict[str, Any]:
    """Calculate processing results."""
    pass

def _format_output(results: Dict[str, Any]) -> Dict[str, Any]:
    """Format output for return."""
    pass

# [ERROR] BAD: High cyclomatic complexity
def bad_complex_function(data):
    if data:
        if isinstance(data, list):
            if len(data) > 0:
                for item in data:
                    if isinstance(item, dict):
                        if 'id' in item:
                            if item['id'] > 0:
                                # Too many nested conditions
                                pass
```

## 10. Performance Considerations

### 10.1 Memory Management
```python
# [OK] GOOD: Use generators for large datasets
def process_large_dataset(file_path: str):
    """Process large dataset using generators."""
    def read_chunks(file_path: str, chunk_size: int = 1000):
        with open(file_path, 'r') as f:
            chunk = []
            for line in f:
                chunk.append(line.strip())
                if len(chunk) >= chunk_size:
                    yield chunk
                    chunk = []
            if chunk:
                yield chunk
    
    for chunk in read_chunks(file_path):
        yield process_chunk(chunk)

# [OK] GOOD: Use context managers for resource management
class IOEResourceManager:
    """Manage resources with automatic cleanup."""
    
    def __init__(self, resource_config: Dict[str, Any]) -> None:
        self.config = resource_config
        self.resources = []
    
    def __enter__(self) -> 'IOEResourceManager':
        # Acquire resources
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        # Clean up resources
        for resource in self.resources:
            resource.close()

# [ERROR] BAD: Loading entire large file into memory
def bad_process_large_file(file_path: str):
    with open(file_path, 'r') as f:
        all_data = f.read()  # Bad: loads entire file
    return process_data(all_data)
```

### 10.2 Caching và Optimization
```python
from functools import lru_cache
import time

class IOECachedProcessor:
    """Data processor with caching capabilities."""
    
    def __init__(self) -> None:
        self._cache = {}
        self._cache_timeout = 300  # 5 minutes
    
    @lru_cache(maxsize=128)
    def expensive_calculation(self, input_value: str) -> float:
        """Expensive calculation with LRU caching."""
        # Simulate expensive operation
        time.sleep(0.1)
        return hash(input_value) / 1000000
    
    def cached_api_call(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """API call with manual caching."""
        cache_key = f"{endpoint}:{hash(str(sorted(params.items())))}"
        current_time = time.time()
        
        # Check cache
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if current_time - timestamp < self._cache_timeout:
                return cached_data
        
        # Make API call
        result = self._make_api_call(endpoint, params)
        
        # Cache result
        self._cache[cache_key] = (result, current_time)
        
        return result
```

---

## Quick Reference

### Essential Naming Patterns
| Type | Pattern | Example |
|------|---------|---------|
| Module | `ioe_snake_case.py` | `ioe_web_server.py` |
| Class | `IOEPascalCase` | `IOEDataProcessor` |
| Function | `snake_case` | `process_data` |
| Constant | `UPPER_CASE` | `MAX_CONNECTIONS` |
| Variable | `snake_case` | `user_data` |
| Private | `_snake_case` | `_internal_state` |

### Import Order
1. Standard library imports
2. Third-party imports  
3. Local application imports

### Required Documentation
- [OK] General Information header
- [OK] Class and function docstrings
- [OK] Type hints for all functions
- [OK] Exception documentation

**IOE INNOVATION Team - Python Coding Guidelines v1.0.0**  
*Last Updated: 2025-10-23*