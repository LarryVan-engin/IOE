"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          ioe_config.py
Description:   Configuration management utilities following IOE standards

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  pyyaml (optional)
               - pyyaml: YAML configuration file support

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         IOE standard configuration management
               - Support for YAML, JSON, and environment variables
               - Validation and type conversion
               - Hierarchical configuration with defaults
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional, Union, List
from dataclasses import dataclass, field

# Third-party imports (optional)
try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
MODULE_VERSION = "1.0.0"
MODULE_NAME = "ConfigManager"

# Supported configuration formats
SUPPORTED_FORMATS = ['.yaml', '.yml', '.json']

#######################################################################################################################
# Exception Classes
#######################################################################################################################
class ConfigManagerException(Exception):
    """Base exception for IOE configuration."""
    pass


class ConfigManagerFileError(ConfigManagerException):
    """Raised when configuration file operations fail."""
    pass


class ConfigManagerValidationError(ConfigManagerException):
    """Raised when configuration validation fails."""
    pass

#######################################################################################################################
# Configuration Data Classes
#######################################################################################################################
@dataclass
class ConfigManagerSchema:
    """
    Configuration schema definition.
    
    This class defines the structure and validation rules for
    configuration parameters.
    """
    required_fields: List[str] = field(default_factory=list)
    optional_fields: Dict[str, Any] = field(default_factory=dict)
    validation_rules: Dict[str, callable] = field(default_factory=dict)
    
    def validate(self, config: Dict[str, Any]) -> bool:
        """
        Validate configuration against schema.
        
        Args:
            config: Configuration dictionary to validate
            
        Returns:
            True if valid
            
        Raises:
            ConfigManagerValidationError: If validation fails
        """
        # Check required fields
        for field in self.required_fields:
            if field not in config:
                raise ConfigManagerValidationError(f"Missing required field: {field}")
        
        # Apply validation rules
        for field, validator in self.validation_rules.items():
            if field in config:
                try:
                    if not validator(config[field]):
                        raise ConfigManagerValidationError(f"Validation failed for field: {field}")
                except Exception as e:
                    raise ConfigManagerValidationError(f"Validation error for {field}: {e}")
        
        return True

#######################################################################################################################
# Main Classes
#######################################################################################################################
class ConfigManager:
    """
    IOE standard configuration management class.
    
    This class provides comprehensive configuration management following
    IOE INNOVATION Team standards, supporting multiple formats, environment
    variables, validation, and hierarchical configuration.
    
    Attributes:
        config: Configuration dictionary
        file_path: Path to configuration file
        schema: Configuration schema for validation
        logger: Logger instance
        
    Example:
        >>> config = ConfigManager("config/app.yaml")
        >>> config.load()
        >>> db_host = config.get("database.host", "localhost")
    """
    
    def __init__(
        self,
        config_path: Optional[str] = None,
        schema: Optional[ConfigManagerSchema] = None,
        logger: Optional[logging.Logger] = None
    ) -> None:
        """
        Initialize IOE configuration manager.
        
        Args:
            config_path: Path to configuration file
            schema: Optional configuration schema
            logger: Optional logger instance
        """
        self.file_path = Path(config_path) if config_path else None
        self.schema = schema
        self.logger = logger or self._setup_default_logger()
        self.config: Dict[str, Any] = {}
        self._defaults: Dict[str, Any] = {}
        self._env_prefix = "IOE_"
        
        self.logger.info(f"Initialized {MODULE_NAME} v{MODULE_VERSION}")
    
    def _setup_default_logger(self) -> logging.Logger:
        """Setup default logger."""
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
    
    def set_defaults(self, defaults: Dict[str, Any]) -> None:
        """
        Set default configuration values.
        
        Args:
            defaults: Default configuration dictionary
        """
        self._defaults = defaults.copy()
        self.logger.debug(f"Set default configuration with {len(defaults)} keys")
    
    def set_env_prefix(self, prefix: str) -> None:
        """
        Set environment variable prefix.
        
        Args:
            prefix: Environment variable prefix (e.g., "IOE_")
        """
        self._env_prefix = prefix
        self.logger.debug(f"Environment variable prefix set to: {prefix}")
    
    def load(self, merge_defaults: bool = True, load_env: bool = True) -> None:
        """
        Load configuration from file and environment.
        
        Args:
            merge_defaults: Whether to merge with default values
            load_env: Whether to load environment variables
            
        Raises:
            ConfigManagerFileError: If file loading fails
        """
        try:
            # Start with defaults
            if merge_defaults:
                self.config = self._defaults.copy()
            
            # Load from file
            if self.file_path and self.file_path.exists():
                file_config = self._load_from_file(self.file_path)
                self._merge_config(self.config, file_config)
                self.logger.info(f"Configuration loaded from: {self.file_path}")
            elif self.file_path:
                self.logger.warning(f"Configuration file not found: {self.file_path}")
            
            # Load environment variables
            if load_env:
                env_config = self._load_from_environment()
                self._merge_config(self.config, env_config)
                self.logger.debug("Environment variables loaded")
            
            # Validate configuration
            if self.schema:
                self.schema.validate(self.config)
                self.logger.debug("Configuration validation passed")
            
        except Exception as e:
            error_msg = f"Failed to load configuration: {e}"
            self.logger.error(error_msg)
            raise ConfigManagerFileError(error_msg) from e
    
    def _load_from_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Load configuration from file.
        
        Args:
            file_path: Path to configuration file
            
        Returns:
            Configuration dictionary
            
        Raises:
            ConfigManagerFileError: If file format is unsupported or loading fails
        """
        suffix = file_path.suffix.lower()
        
        if suffix not in SUPPORTED_FORMATS:
            raise ConfigManagerFileError(f"Unsupported file format: {suffix}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if suffix == '.json':
                    return json.load(f)
                elif suffix in ['.yaml', '.yml']:
                    if not YAML_AVAILABLE:
                        raise ConfigManagerFileError("PyYAML not installed for YAML support")
                    return yaml.safe_load(f) or {}
                    
        except Exception as e:
            raise ConfigManagerFileError(f"Failed to load {file_path}: {e}")
        
        return {}
    
    def _load_from_environment(self) -> Dict[str, Any]:
        """
        Load configuration from environment variables.
        
        Returns:
            Configuration dictionary from environment variables
        """
        env_config = {}
        
        for key, value in os.environ.items():
            if key.startswith(self._env_prefix):
                # Remove prefix and convert to lowercase
                config_key = key[len(self._env_prefix):].lower()
                
                # Convert to proper type
                converted_value = self._convert_env_value(value)
                
                # Support nested keys with double underscore
                if '__' in config_key:
                    self._set_nested_value(env_config, config_key.replace('__', '.'), converted_value)
                else:
                    env_config[config_key] = converted_value
        
        return env_config
    
    def _convert_env_value(self, value: str) -> Union[str, int, float, bool]:
        """
        Convert environment variable string to appropriate type.
        
        Args:
            value: String value from environment
            
        Returns:
            Converted value
        """
        # Boolean values
        if value.lower() in ('true', 'false'):
            return value.lower() == 'true'
        
        # Integer values
        if value.isdigit() or (value.startswith('-') and value[1:].isdigit()):
            return int(value)
        
        # Float values
        try:
            return float(value)
        except ValueError:
            pass
        
        # String value (default)
        return value
    
    def _merge_config(self, base: Dict[str, Any], update: Dict[str, Any]) -> None:
        """
        Recursively merge configuration dictionaries.
        
        Args:
            base: Base configuration dictionary (modified in place)
            update: Configuration to merge into base
        """
        for key, value in update.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._merge_config(base[key], value)
            else:
                base[key] = value
    
    def _set_nested_value(self, config: Dict[str, Any], key_path: str, value: Any) -> None:
        """
        Set nested configuration value using dot notation.
        
        Args:
            config: Configuration dictionary
            key_path: Dot-separated key path (e.g., "database.host")
            value: Value to set
        """
        keys = key_path.split('.')
        current = config
        
        # Navigate to parent of target key
        for key in keys[:-1]:
            current = current.setdefault(key, {})
        
        # Set the final value
        current[keys[-1]] = value
    
    def get(self, key_path: str, default: Any = None) -> Any:
        """
        Get configuration value using dot notation.
        
        Args:
            key_path: Dot-separated key path (e.g., "database.host")
            default: Default value if key not found
            
        Returns:
            Configuration value or default
        """
        keys = key_path.split('.')
        current = self.config
        
        try:
            for key in keys:
                current = current[key]
            return current
        except (KeyError, TypeError):
            return default
    
    def set(self, key_path: str, value: Any) -> None:
        """
        Set configuration value using dot notation.
        
        Args:
            key_path: Dot-separated key path
            value: Value to set
        """
        self._set_nested_value(self.config, key_path, value)
        self.logger.debug(f"Configuration updated: {key_path} = {value}")
    
    def has(self, key_path: str) -> bool:
        """
        Check if configuration key exists.
        
        Args:
            key_path: Dot-separated key path
            
        Returns:
            True if key exists
        """
        return self.get(key_path, None) is not None
    
    def save(self, file_path: Optional[str] = None, format_type: str = "yaml") -> None:
        """
        Save configuration to file.
        
        Args:
            file_path: Optional file path (uses original if not provided)
            format_type: File format (yaml, json)
            
        Raises:
            ConfigManagerFileError: If saving fails
        """
        target_path = Path(file_path) if file_path else self.file_path
        
        if not target_path:
            raise ConfigManagerFileError("No file path specified for saving")
        
        try:
            # Ensure directory exists
            target_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(target_path, 'w', encoding='utf-8') as f:
                if format_type.lower() == 'json':
                    json.dump(self.config, f, indent=2, ensure_ascii=False)
                elif format_type.lower() in ['yaml', 'yml']:
                    if not YAML_AVAILABLE:
                        raise ConfigManagerFileError("PyYAML not installed for YAML support")
                    yaml.dump(self.config, f, default_flow_style=False, allow_unicode=True)
                else:
                    raise ConfigManagerFileError(f"Unsupported format: {format_type}")
            
            self.logger.info(f"Configuration saved to: {target_path}")
            
        except Exception as e:
            error_msg = f"Failed to save configuration: {e}"
            self.logger.error(error_msg)
            raise ConfigManagerFileError(error_msg) from e
    
    def get_section(self, section: str) -> Dict[str, Any]:
        """
        Get entire configuration section.
        
        Args:
            section: Section name
            
        Returns:
            Section configuration dictionary
        """
        return self.get(section, {})
    
    def update(self, updates: Dict[str, Any]) -> None:
        """
        Update configuration with new values.
        
        Args:
            updates: Dictionary of updates to apply
        """
        self._merge_config(self.config, updates)
        self.logger.debug(f"Configuration updated with {len(updates)} changes")
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Get configuration as dictionary.
        
        Returns:
            Configuration dictionary copy
        """
        return self.config.copy()
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get configuration statistics.
        
        Returns:
            Statistics dictionary
        """
        def count_keys(d: Dict[str, Any]) -> int:
            count = len(d)
            for value in d.values():
                if isinstance(value, dict):
                    count += count_keys(value)
            return count
        
        return {
            "module_version": MODULE_VERSION,
            "file_path": str(self.file_path) if self.file_path else None,
            "total_keys": count_keys(self.config),
            "top_level_keys": len(self.config),
            "has_schema": self.schema is not None,
            "env_prefix": self._env_prefix
        }

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def create_default_config(config_path: str = "config/settings.yaml") -> ConfigManager:
    """
    Create configuration manager with default settings.
    
    Args:
        config_path: Path to configuration file
        
    Returns:
        Configured ConfigManager instance
    """
    config = ConfigManager(config_path)
    
    # Set common defaults
    defaults = {
        "application": {
            "name": "IOE Application",
            "version": "1.0.0",
            "debug": False
        },
        "logging": {
            "level": "INFO",
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        },
        "server": {
            "host": "0.0.0.0",
            "port": 8000
        }
    }
    
    config.set_defaults(defaults)
    return config


def load_config_with_schema(config_path: str, schema: ConfigManagerSchema) -> ConfigManager:
    """
    Load configuration with validation schema.
    
    Args:
        config_path: Path to configuration file
        schema: Configuration schema for validation
        
    Returns:
        Validated ConfigManager instance
    """
    config = ConfigManager(config_path, schema=schema)
    config.load()
    return config

# End of File