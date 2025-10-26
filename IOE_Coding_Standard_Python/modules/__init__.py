"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Python Coding Standards
File:          __init__.py
Description:   IOE modules package initialization

Author:        IOE Development Team
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  None

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         Package initialization for IOE modules
               - Exports main classes for easy import
               - Defines package metadata
*******************************************************************************************************************
"""

#######################################################################################################################
# Package Information
#######################################################################################################################
__version__ = "1.0.0"
__author__ = "IOE INNOVATION Team"
__email__ = "team@ioe.innovation"
__description__ = "IOE INNOVATION Team Python modules following coding standards"

#######################################################################################################################
# Main Exports
#######################################################################################################################
# Import main classes for easy access
try:
    from .ioe_web_server import WebServer
    from .ioe_database import Database
    
    # Export main classes
    __all__ = [
        "WebServer",
        "Database"
    ]
    
except ImportError:
    # Handle missing dependencies gracefully
    __all__ = []

#######################################################################################################################
# Package Metadata
#######################################################################################################################
def get_package_info():
    """
    Get package information.
    
    Returns:
        Dictionary with package metadata
    """
    return {
        "name": "ioe_modules",
        "version": __version__,
        "author": __author__,
        "email": __email__,
        "description": __description__
    }

# End of File