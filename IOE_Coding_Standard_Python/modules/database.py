"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          ioe_database.py
Description:   Database operations module following IOE standards

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  None (uses in-memory storage for demo)
               - Can be extended with SQLAlchemy, PyMongo, etc.

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         IOE standard database operations module
               - In-memory implementation for demo purposes
               - Can be extended for real database connections
               - Includes proper error handling and validation
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import logging
import json
from typing import Dict, Any, Optional, List, Union
from datetime import datetime
import uuid

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
MODULE_VERSION = "1.0.0"
MODULE_NAME = "Database"

#######################################################################################################################
# Exception Classes
#######################################################################################################################
class DatabaseException(Exception):
    """Base exception for IOE database operations."""
    pass


class DatabaseConnectionError(DatabaseException):
    """Raised when database connection fails."""
    pass


class DatabaseValidationError(DatabaseException):
    """Raised when data validation fails."""
    pass


class DatabaseNotFoundError(DatabaseException):
    """Raised when requested data is not found."""
    pass

#######################################################################################################################
# Main Classes
#######################################################################################################################
class Database:
    """
    IOE standard database operations class.
    
    This class provides standardized database operations following
    IOE INNOVATION Team coding standards. For demonstration purposes,
    it uses in-memory storage but can be extended for real databases.
    
    Attributes:
        config: Database configuration
        logger: Logger instance
        is_connected: Connection status
        data: In-memory data storage
        
    Example:
        >>> config = {"type": "in_memory"}
        >>> db = Database(config)
        >>> db.connect()
        >>> users = db.get_all_users()
    """
    
    def __init__(self, config: Dict[str, Any], logger: Optional[logging.Logger] = None) -> None:
        """
        Initialize IOE database.
        
        Args:
            config: Database configuration dictionary
            logger: Optional logger instance
            
        Raises:
            DatabaseValidationError: If configuration is invalid
        """
        self.config = self._validate_config(config)
        self.logger = logger or self._setup_default_logger()
        self.is_connected = False
        
        # In-memory storage for demonstration
        self.data: Dict[str, List[Dict[str, Any]]] = {
            "users": [],
            "sessions": [],
            "logs": []
        }
        
        # Statistics
        self.stats = {
            "queries_executed": 0,
            "records_created": 0,
            "records_updated": 0,
            "records_deleted": 0,
            "connection_time": None
        }
        
        self.logger.info(f"Initialized {MODULE_NAME} v{MODULE_VERSION}")
    
    def _validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate database configuration.
        
        Args:
            config: Configuration dictionary
            
        Returns:
            Validated configuration
            
        Raises:
            DatabaseValidationError: If configuration is invalid
        """
        if not isinstance(config, dict):
            raise DatabaseValidationError("Configuration must be a dictionary")
        
        validated_config = {
            "type": config.get("type", "in_memory"),
            "connection_string": config.get("connection_string", "sqlite:///:memory:"),
            "timeout": config.get("timeout", 30),
            "pool_size": config.get("pool_size", 10)
        }
        
        # Validate timeout
        if validated_config["timeout"] <= 0:
            raise DatabaseValidationError("Timeout must be positive")
        
        return validated_config
    
    def _setup_default_logger(self) -> logging.Logger:
        """Setup default logger for the database."""
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
    
    def connect(self) -> None:
        """
        Establish database connection.
        
        Raises:
            DatabaseConnectionError: If connection fails
        """
        if self.is_connected:
            self.logger.warning("Database already connected")
            return
        
        try:
            self.logger.info(f"Connecting to database: {self.config['type']}")
            
            # Simulate connection establishment
            self.stats["connection_time"] = datetime.now().isoformat()
            self.is_connected = True
            
            self.logger.info("Database connection established successfully")
            
        except Exception as e:
            error_msg = f"Failed to connect to database: {e}"
            self.logger.error(error_msg)
            raise DatabaseConnectionError(error_msg) from e
    
    def disconnect(self) -> None:
        """Disconnect from database."""
        if not self.is_connected:
            self.logger.warning("Database not connected")
            return
        
        try:
            self.logger.info("Disconnecting from database")
            self.is_connected = False
            self.logger.info("Database disconnected successfully")
            
        except Exception as e:
            self.logger.error(f"Error disconnecting from database: {e}")
    
    def setup_sample_data(self, table_name: str, sample_data: List[Dict[str, Any]]) -> None:
        """
        Setup sample data for demonstration.
        
        Args:
            table_name: Name of the table/collection
            sample_data: List of sample records
        """
        if not self.is_connected:
            raise DatabaseConnectionError("Database not connected")
        
        self.data[table_name] = sample_data.copy()
        self.logger.info(f"Sample data setup: {len(sample_data)} records in {table_name}")
    
    # User management methods
    def get_all_users(self) -> List[Dict[str, Any]]:
        """
        Get all users from database.
        
        Returns:
            List of user dictionaries
            
        Raises:
            DatabaseConnectionError: If database not connected
        """
        if not self.is_connected:
            raise DatabaseConnectionError("Database not connected")
        
        self.stats["queries_executed"] += 1
        users = self.data.get("users", [])
        
        self.logger.debug(f"Retrieved {len(users)} users")
        return users.copy()
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Get user by ID.
        
        Args:
            user_id: User ID to search for
            
        Returns:
            User dictionary if found, None otherwise
            
        Raises:
            DatabaseConnectionError: If database not connected
        """
        if not self.is_connected:
            raise DatabaseConnectionError("Database not connected")
        
        self.stats["queries_executed"] += 1
        
        for user in self.data.get("users", []):
            if user.get("id") == user_id:
                self.logger.debug(f"Found user with ID: {user_id}")
                return user.copy()
        
        self.logger.debug(f"User not found with ID: {user_id}")
        return None
    
    def create_user(self, user_data: Dict[str, Any]) -> int:
        """
        Create new user.
        
        Args:
            user_data: User data dictionary
            
        Returns:
            ID of created user
            
        Raises:
            DatabaseConnectionError: If database not connected
            DatabaseValidationError: If user data is invalid
        """
        if not self.is_connected:
            raise DatabaseConnectionError("Database not connected")
        
        # Validate user data
        self._validate_user_data(user_data)
        
        # Generate new ID
        existing_ids = [user.get("id", 0) for user in self.data.get("users", [])]
        new_id = max(existing_ids, default=0) + 1
        
        # Create user record
        new_user = user_data.copy()
        new_user.update({
            "id": new_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        })
        
        # Add to storage
        if "users" not in self.data:
            self.data["users"] = []
        
        self.data["users"].append(new_user)
        self.stats["records_created"] += 1
        
        self.logger.info(f"Created user with ID: {new_id}")
        return new_id
    
    def update_user(self, user_id: int, update_data: Dict[str, Any]) -> bool:
        """
        Update existing user.
        
        Args:
            user_id: ID of user to update
            update_data: Data to update
            
        Returns:
            True if user was updated, False if not found
            
        Raises:
            DatabaseConnectionError: If database not connected
        """
        if not self.is_connected:
            raise DatabaseConnectionError("Database not connected")
        
        users = self.data.get("users", [])
        
        for i, user in enumerate(users):
            if user.get("id") == user_id:
                # Update user data
                users[i].update(update_data)
                users[i]["updated_at"] = datetime.now().isoformat()
                
                self.stats["records_updated"] += 1
                self.logger.info(f"Updated user with ID: {user_id}")
                return True
        
        self.logger.warning(f"User not found for update: {user_id}")
        return False
    
    def delete_user(self, user_id: int) -> bool:
        """
        Delete user by ID.
        
        Args:
            user_id: ID of user to delete
            
        Returns:
            True if user was deleted, False if not found
            
        Raises:
            DatabaseConnectionError: If database not connected
        """
        if not self.is_connected:
            raise DatabaseConnectionError("Database not connected")
        
        users = self.data.get("users", [])
        
        for i, user in enumerate(users):
            if user.get("id") == user_id:
                del users[i]
                self.stats["records_deleted"] += 1
                self.logger.info(f"Deleted user with ID: {user_id}")
                return True
        
        self.logger.warning(f"User not found for deletion: {user_id}")
        return False
    
    def _validate_user_data(self, user_data: Dict[str, Any]) -> None:
        """
        Validate user data.
        
        Args:
            user_data: User data to validate
            
        Raises:
            DatabaseValidationError: If data is invalid
        """
        if not isinstance(user_data, dict):
            raise DatabaseValidationError("User data must be a dictionary")
        
        required_fields = ["name", "email"]
        for field in required_fields:
            if field not in user_data or not user_data[field]:
                raise DatabaseValidationError(f"Missing required field: {field}")
        
        # Validate email format (basic check)
        email = user_data["email"]
        if "@" not in email or "." not in email:
            raise DatabaseValidationError("Invalid email format")
        
        # Check for duplicate email
        existing_users = self.data.get("users", [])
        for user in existing_users:
            if user.get("email") == email:
                raise DatabaseValidationError("Email already exists")
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get database statistics.
        
        Returns:
            Statistics dictionary
        """
        return {
            "module_version": MODULE_VERSION,
            "is_connected": self.is_connected,
            "connection_time": self.stats["connection_time"],
            "queries_executed": self.stats["queries_executed"],
            "records_created": self.stats["records_created"],
            "records_updated": self.stats["records_updated"],
            "records_deleted": self.stats["records_deleted"],
            "total_users": len(self.data.get("users", [])),
            "configuration": {
                "type": self.config["type"],
                "timeout": self.config["timeout"]
            }
        }
    
    def health_check(self) -> Dict[str, Any]:
        """
        Perform database health check.
        
        Returns:
            Health status dictionary
        """
        try:
            # Perform basic connectivity test
            test_passed = self.is_connected
            
            return {
                "status": "healthy" if test_passed else "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "connection_status": "connected" if self.is_connected else "disconnected",
                "statistics": self.get_statistics()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.disconnect()

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def create_default_database() -> Database:
    """
    Create database with default configuration.
    
    Returns:
        Configured Database instance
    """
    config = {
        "type": "in_memory",
        "connection_string": "sqlite:///:memory:",
        "timeout": 30,
        "pool_size": 10
    }
    
    return Database(config)


def validate_database_config(config: Dict[str, Any]) -> bool:
    """
    Validate database configuration.
    
    Args:
        config: Configuration dictionary
        
    Returns:
        True if configuration is valid
    """
    try:
        Database(config)
        return True
    except DatabaseValidationError:
        return False

# End of File