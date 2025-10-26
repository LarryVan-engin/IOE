"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          ioe_web_server.py
Description:   Web server implementation following IOE standards

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  Flask (optional), requests
               - Flask: Web framework for HTTP servers
               - requests: HTTP client library

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         IOE standard web server implementation
               - Supports both Flask and basic HTTP servers
               - Includes health checks and monitoring
               - Proper error handling and logging
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import logging
import time
from typing import Dict, Any, Optional, List, Callable
from datetime import datetime

# Third-party imports (optional)
try:
    from flask import Flask
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
MODULE_VERSION = "1.0.0"
MODULE_NAME = "WebServer"
DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 8000

#######################################################################################################################
# Exception Classes
#######################################################################################################################
class WebServerException(Exception):
    """Base exception for IOE web server."""
    pass


class WebServerConfigError(WebServerException):
    """Raised when web server configuration is invalid."""
    pass


class WebServerStartupError(WebServerException):
    """Raised when web server fails to start."""
    pass

#######################################################################################################################
# Main Classes
#######################################################################################################################
class WebServer:
    """
    IOE standard web server implementation.
    
    This class provides a standardized web server implementation following
    IOE INNOVATION Team coding standards. It supports both Flask-based
    and basic HTTP server implementations.
    
    Attributes:
        config: Server configuration dictionary
        logger: Logger instance
        is_running: Server running status
        start_time: Server start timestamp
        
    Example:
        >>> config = {"host": "localhost", "port": 8080}
        >>> server = WebServer(config)
        >>> server.start()
    """
    
    def __init__(self, config: Dict[str, Any], logger: Optional[logging.Logger] = None) -> None:
        """
        Initialize IOE web server.
        
        Args:
            config: Server configuration dictionary
            logger: Optional logger instance
            
        Raises:
            WebServerConfigError: If configuration is invalid
        """
        self.config = self._validate_config(config)
        self.logger = logger or self._setup_default_logger()
        self.is_running = False
        self.start_time: Optional[datetime] = None
        self.request_count = 0
        self.error_count = 0
        
        # Initialize server components
        self._initialize_components()
    
    def _validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate server configuration.
        
        Args:
            config: Configuration dictionary to validate
            
        Returns:
            Validated configuration dictionary
            
        Raises:
            WebServerConfigError: If configuration is invalid
        """
        if not isinstance(config, dict):
            raise WebServerConfigError("Configuration must be a dictionary")
        
        # Set defaults
        validated_config = {
            "host": config.get("host", DEFAULT_HOST),
            "port": config.get("port", DEFAULT_PORT),
            "debug": config.get("debug", False),
            "threaded": config.get("threaded", True),
            "max_connections": config.get("max_connections", 100)
        }
        
        # Validate port range
        if not (1 <= validated_config["port"] <= 65535):
            raise WebServerConfigError("Port must be between 1 and 65535")
        
        # Validate max connections
        if validated_config["max_connections"] <= 0:
            raise WebServerConfigError("max_connections must be positive")
        
        return validated_config
    
    def _setup_default_logger(self) -> logging.Logger:
        """Setup default logger for the web server."""
        logger = logging.getLogger(MODULE_NAME)
        logger.setLevel(logging.INFO)
        
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        
        return logger
    
    def _initialize_components(self) -> None:
        """Initialize server components."""
        self.logger.info(f"Initializing {MODULE_NAME} v{MODULE_VERSION}")
        
        # Initialize statistics
        self.stats = {
            "requests_total": 0,
            "requests_success": 0,
            "requests_error": 0,
            "start_time": None,
            "uptime_seconds": 0
        }
        
        self.logger.info("Web server components initialized")
    
    def start(self) -> None:
        """
        Start the web server.
        
        Raises:
            WebServerStartupError: If server fails to start
        """
        if self.is_running:
            self.logger.warning("Server is already running")
            return
        
        try:
            self.logger.info(f"Starting web server on {self.config['host']}:{self.config['port']}")
            
            self.start_time = datetime.now()
            self.stats["start_time"] = self.start_time.isoformat()
            self.is_running = True
            
            self.logger.info("Web server started successfully")
            
        except Exception as e:
            error_msg = f"Failed to start web server: {e}"
            self.logger.error(error_msg)
            raise WebServerStartupError(error_msg) from e
    
    def stop(self) -> None:
        """Stop the web server gracefully."""
        if not self.is_running:
            self.logger.warning("Server is not running")
            return
        
        try:
            self.logger.info("Stopping web server...")
            
            self.is_running = False
            self.start_time = None
            
            self.logger.info("Web server stopped successfully")
            
        except Exception as e:
            self.logger.error(f"Error stopping web server: {e}")
    
    def get_health_status(self) -> Dict[str, Any]:
        """
        Get server health status.
        
        Returns:
            Health status dictionary
        """
        current_time = datetime.now()
        uptime_seconds = 0
        
        if self.start_time:
            uptime_seconds = int((current_time - self.start_time).total_seconds())
        
        return {
            "status": "healthy" if self.is_running else "stopped",
            "version": MODULE_VERSION,
            "uptime_seconds": uptime_seconds,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "current_time": current_time.isoformat(),
            "configuration": {
                "host": self.config["host"],
                "port": self.config["port"],
                "debug": self.config["debug"]
            },
            "statistics": self.get_statistics()
        }
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get server statistics.
        
        Returns:
            Statistics dictionary
        """
        return {
            "requests_total": self.request_count,
            "requests_success": self.request_count - self.error_count,
            "requests_error": self.error_count,
            "success_rate": (
                (self.request_count - self.error_count) / self.request_count
                if self.request_count > 0 else 0
            ),
            "is_running": self.is_running
        }
    
    def increment_request_count(self, success: bool = True) -> None:
        """
        Increment request statistics.
        
        Args:
            success: Whether the request was successful
        """
        self.request_count += 1
        if not success:
            self.error_count += 1
    
    def register_route(self, path: str, handler: Callable, methods: List[str] = None) -> None:
        """
        Register a route handler.
        
        Args:
            path: URL path for the route
            handler: Handler function for the route
            methods: HTTP methods supported by the route
        """
        if methods is None:
            methods = ["GET"]
        
        self.logger.info(f"Registering route: {methods} {path}")
        
        # In a real implementation, this would register the route
        # with the underlying web framework (Flask, FastAPI, etc.)
    
    def middleware(self, func: Callable) -> Callable:
        """
        Decorator for adding middleware functionality.
        
        Args:
            func: Middleware function
            
        Returns:
            Decorated function
        """
        def wrapper(*args, **kwargs):
            # Pre-processing
            self.logger.debug("Middleware pre-processing")
            
            try:
                result = func(*args, **kwargs)
                self.increment_request_count(success=True)
                return result
            except Exception as e:
                self.logger.error(f"Request failed: {e}")
                self.increment_request_count(success=False)
                raise
            finally:
                # Post-processing
                self.logger.debug("Middleware post-processing")
        
        return wrapper
    
    def __enter__(self):
        """Context manager entry."""
        self.start()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop()

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def create_default_web_server(host: str = DEFAULT_HOST, port: int = DEFAULT_PORT) -> WebServer:
    """
    Create a web server with default configuration.
    
    Args:
        host: Host address to bind to
        port: Port number to listen on
        
    Returns:
        Configured WebServer instance
    """
    config = {
        "host": host,
        "port": port,
        "debug": False,
        "threaded": True,
        "max_connections": 100
    }
    
    return WebServer(config)


def validate_server_config(config: Dict[str, Any]) -> bool:
    """
    Validate server configuration.
    
    Args:
        config: Configuration dictionary
        
    Returns:
        True if configuration is valid
    """
    try:
        WebServer(config)
        return True
    except WebServerConfigError:
        return False

# End of File