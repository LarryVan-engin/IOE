"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          __init__.py
Description:   IOE utilities package initialization

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  None

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         Utilities package initialization
               - Exports utility classes and functions
               - Provides easy access to common utilities
*******************************************************************************************************************
"""

#######################################################################################################################
# Package Information
#######################################################################################################################
__version__ = "1.0.0"
__author__ = "IOE INNOVATION Team"

#######################################################################################################################
# Main Exports
#######################################################################################################################
try:
    from .log_messageger import LoggerManager
    from .ioe_config import ConfigManager
    
    __all__ = [
        "LoggerManager",
        "ConfigManager"
    ]
    
except ImportError:
    __all__ = []

# End of File