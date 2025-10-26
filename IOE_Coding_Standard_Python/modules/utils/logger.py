"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          log_messageger.py
Description:   Logging utilities following IOE standards

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  None (uses standard logging module)

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         IOE standard logging implementation
               - Consistent logging format across projects
               - Support for multiple handlers and levels
               - Easy configuration and usage
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import logging
import logging.handlers
import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional, Union
from datetime import datetime

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
MODULE_VERSION = "1.0.0"
MODULE_NAME = "LoggerManager"

# Default logging format
DEFAULT_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
DEFAULT_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Default log levels
LOG_LEVELS = {
    'DEBUG': logging.DEBUG,
    'INFO': logging.INFO,
    'WARNING': logging.WARNING,
    'ERROR': logging.ERROR,
    'CRITICAL': logging.CRITICAL
}

#######################################################################################################################
# Exception Classes
#######################################################################################################################
class LoggerManagerException(Exception):
    """Base exception for IOE logger."""
    pass


class LoggerManagerConfigError(LoggerManagerException):
    """Raised when logger configuration is invalid."""
    pass

#######################################################################################################################
# Main Classes
#######################################################################################################################
class LoggerManager:
    """
    IOE standard logger implementation.
    
    This class provides a standardized logging implementation following
    IOE INNOVATION Team standards with consistent formatting, multiple
    handlers, and easy configuration.
    
    Attributes:
        name: Logger name
        logger: Python logger instance
        config: Logger configuration
        handlers: List of active handlers
        
    Example:
        >>> logger = LoggerManager("MyApp")
        >>> logger.info("Application started")
        >>> logger.error("An error occurred", extra={"user_id": 123})
    """
    
    def __init__(
        self, 
        name: str, 
        level: str = "INFO",
        format_string: Optional[str] = None,
        log_file: Optional[str] = None,
        console_output: bool = True
    ) -> None:
        """
        Initialize IOE logger.
        
        Args:
            name: Logger name (usually module or application name)
            level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
            format_string: Custom format string for log messages
            log_file: Optional log file path
            console_output: Whether to output to console
            
        Raises:
            LoggerManagerConfigError: If configuration is invalid
        """
        self.name = name
        self.config = self._validate_config({
            "level": level,
            "format": format_string or DEFAULT_FORMAT,
            "date_format": DEFAULT_DATE_FORMAT,
            "log_file": log_file,
            "console_output": console_output
        })
        
        # Create logger instance
        self.logger = logging.getLogger(name)
        self.logger.setLevel(LOG_LEVELS[self.config["level"]])
        
        # Clear existing handlers to avoid duplicates
        for handler in self.logger.handlers[:]:
            self.logger.removeHandler(handler)
        
        self.handlers = []
        self._setup_handlers()
    
    def _validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate logger configuration.
        
        Args:
            config: Configuration dictionary
            
        Returns:
            Validated configuration
            
        Raises:
            LoggerManagerConfigError: If configuration is invalid
        """
        if config["level"] not in LOG_LEVELS:
            raise LoggerManagerConfigError(f"Invalid log level: {config['level']}")
        
        if config["log_file"] and not isinstance(config["log_file"], (str, Path)):
            raise LoggerManagerConfigError("log_file must be a string or Path object")
        
        return config
    
    def _setup_handlers(self) -> None:
        """Setup logging handlers based on configuration."""
        formatter = logging.Formatter(
            self.config["format"],
            datefmt=self.config["date_format"]
        )
        
        # Console handler
        if self.config["console_output"]:
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setFormatter(formatter)
            console_handler.setLevel(LOG_LEVELS[self.config["level"]])
            self.logger.addHandler(console_handler)
            self.handlers.append(console_handler)
        
        # File handler
        if self.config["log_file"]:
            log_file_path = Path(self.config["log_file"])
            
            # Create directory if it doesn't exist
            log_file_path.parent.mkdir(parents=True, exist_ok=True)
            
            file_handler = logging.handlers.RotatingFileHandler(
                log_file_path,
                maxBytes=10*1024*1024,  # 10MB
                backupCount=5
            )
            file_handler.setFormatter(formatter)
            file_handler.setLevel(LOG_LEVELS[self.config["level"]])
            self.logger.addHandler(file_handler)
            self.handlers.append(file_handler)
    
    def debug(self, message: str, **kwargs) -> None:
        """
        Log debug message.
        
        Args:
            message: Log message
            **kwargs: Additional context data
        """
        self.logger.debug(message, extra=kwargs)
    
    def info(self, message: str, **kwargs) -> None:
        """
        Log info message.
        
        Args:
            message: Log message
            **kwargs: Additional context data
        """
        self.logger.info(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs) -> None:
        """
        Log warning message.
        
        Args:
            message: Log message
            **kwargs: Additional context data
        """
        self.logger.warning(message, extra=kwargs)
    
    def error(self, message: str, **kwargs) -> None:
        """
        Log error message.
        
        Args:
            message: Log message
            **kwargs: Additional context data
        """
        self.logger.error(message, extra=kwargs)
    
    def critical(self, message: str, **kwargs) -> None:
        """
        Log critical message.
        
        Args:
            message: Log message
            **kwargs: Additional context data
        """
        self.logger.critical(message, extra=kwargs)
    
    def exception(self, message: str, **kwargs) -> None:
        """
        Log exception with traceback.
        
        Args:
            message: Log message
            **kwargs: Additional context data
        """
        self.logger.exception(message, extra=kwargs)
    
    def log_function_call(self, func_name: str, args: tuple = (), kwargs: dict = None) -> None:
        """
        Log function call with parameters.
        
        Args:
            func_name: Function name
            args: Function arguments
            kwargs: Function keyword arguments
        """
        kwargs = kwargs or {}
        self.debug(f"Calling function: {func_name}", extra={
            "function": func_name,
            "args": args,
            "kwargs": kwargs
        })
    
    def log_performance(self, operation: str, duration: float, **kwargs) -> None:
        """
        Log performance metrics.
        
        Args:
            operation: Operation name
            duration: Duration in seconds
            **kwargs: Additional metrics
        """
        self.info(f"Performance: {operation} completed in {duration:.4f}s", extra={
            "operation": operation,
            "duration_seconds": duration,
            **kwargs
        })
    
    def set_level(self, level: str) -> None:
        """
        Change logging level.
        
        Args:
            level: New logging level
            
        Raises:
            LoggerManagerConfigError: If level is invalid
        """
        if level not in LOG_LEVELS:
            raise LoggerManagerConfigError(f"Invalid log level: {level}")
        
        self.config["level"] = level
        self.logger.setLevel(LOG_LEVELS[level])
        
        # Update handler levels
        for handler in self.handlers:
            handler.setLevel(LOG_LEVELS[level])
    
    def add_file_handler(self, file_path: str, level: Optional[str] = None) -> None:
        """
        Add additional file handler.
        
        Args:
            file_path: Path to log file
            level: Optional specific level for this handler
        """
        log_file_path = Path(file_path)
        log_file_path.parent.mkdir(parents=True, exist_ok=True)
        
        formatter = logging.Formatter(
            self.config["format"],
            datefmt=self.config["date_format"]
        )
        
        file_handler = logging.handlers.RotatingFileHandler(
            log_file_path,
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(formatter)
        
        handler_level = level or self.config["level"]
        file_handler.setLevel(LOG_LEVELS[handler_level])
        
        self.logger.addHandler(file_handler)
        self.handlers.append(file_handler)
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get logger statistics.
        
        Returns:
            Statistics dictionary
        """
        return {
            "name": self.name,
            "level": self.config["level"],
            "handlers_count": len(self.handlers),
            "config": self.config,
            "module_version": MODULE_VERSION
        }

#######################################################################################################################
# Decorator Functions
#######################################################################################################################
def log_function_calls(logger: LoggerManager):
    """
    Decorator to automatically log function calls.
    
    Args:
        logger: LoggerManager instance
        
    Returns:
        Decorator function
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            logger.log_function_call(func.__name__, args, kwargs)
            try:
                result = func(*args, **kwargs)
                logger.debug(f"Function {func.__name__} completed successfully")
                return result
            except Exception as e:
                logger.error(f"Function {func.__name__} failed: {e}")
                raise
        return wrapper
    return decorator


def log_performance(logger: LoggerManager):
    """
    Decorator to automatically log function performance.
    
    Args:
        logger: LoggerManager instance
        
    Returns:
        Decorator function
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            start_time = datetime.now()
            try:
                result = func(*args, **kwargs)
                duration = (datetime.now() - start_time).total_seconds()
                logger.log_performance(func.__name__, duration)
                return result
            except Exception as e:
                duration = (datetime.now() - start_time).total_seconds()
                logger.log_performance(func.__name__, duration, status="failed", error=str(e))
                raise
        return wrapper
    return decorator

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def create_default_logger(name: str, log_file: Optional[str] = None) -> LoggerManager:
    """
    Create logger with default IOE configuration.
    
    Args:
        name: Logger name
        log_file: Optional log file path
        
    Returns:
        Configured LoggerManager instance
    """
    return LoggerManager(
        name=name,
        level="INFO",
        log_file=log_file,
        console_output=True
    )


def setup_application_logging(app_name: str, log_dir: str = "logs") -> LoggerManager:
    """
    Setup application-wide logging.
    
    Args:
        app_name: Application name
        log_dir: Directory for log files
        
    Returns:
        Configured LoggerManager instance
    """
    log_file = Path(log_dir) / f"{app_name.lower()}.log"
    
    return LoggerManager(
        name=app_name,
        level=os.getenv("IOE_LOG_LEVEL", "INFO"),
        log_file=str(log_file),
        console_output=True
    )

# End of File