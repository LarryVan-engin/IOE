"""
*******************************************************************************************************************
General Information
********************************************************************************************************************
Project:       IOE Web Server Demo
File:          main.py
Description:   Flask web application demonstrating IOE INNOVATION Team Python standards

Author:        IOE Development Team (Project Leader)
Email:         team@ioe.innovation
Created:       2025-10-23
Last Update:   2025-10-23
Version:       1.0.0

Python:        3.8+
Dependencies:  Flask, requests, pyyaml, rich, click
               - Flask: Web framework
               - requests: HTTP client library
               - pyyaml: YAML configuration parser

Copyright:     (c) 2025 IOE INNOVATION Team
License:       MIT

Notes:         Web server demonstration project
               - Only Project Leader has permission to modify this file
               - Demonstrates IOE coding standards for web applications
               - Includes REST API endpoints and request handling
*******************************************************************************************************************
"""

#######################################################################################################################
# Imports
#######################################################################################################################
# Standard library imports
import os
import sys
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple
import json

# Third-party imports
import click
import yaml
from flask import Flask, request, jsonify, render_template
from rich.console import Console
from rich.table import Table

# Local imports
sys.path.append(str(Path(__file__).parent.parent.parent))
from modules.web_server import WebServer
from modules.database import Database
from modules.utils.logger import LoggerManager
from modules.utils.config import ConfigManager

#######################################################################################################################
# Constants and Configuration
#######################################################################################################################
APP_NAME = "IOE Web Server Demo"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "Flask web application demonstrating IOE Python standards"

# Configuration
DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 8000
DEFAULT_DEBUG = False

#######################################################################################################################
# Global Variables
#######################################################################################################################
console = Console()
app: Optional[Flask] = None
web_server: Optional[WebServer] = None
database: Optional[Database] = None
logger: Optional[logging.Logger] = None

#######################################################################################################################
# Application Classes
#######################################################################################################################
class IOEWebApplication:
    """
    IOE Web Application following team standards.
    
    This class demonstrates a Flask web application built according to
    IOE INNOVATION Team coding standards, including proper error handling,
    logging, configuration management, and modular design.
    """
    
    def __init__(self, config: Dict[str, Any]) -> None:
        """
        Initialize web application.
        
        Args:
            config: Application configuration dictionary
        """
        self.config = config
        self.app = Flask(__name__)
        self.web_server = WebServer(config.get('server', {}))
        self.database = Database(config.get('database', {}))
        self.logger = LoggerManager(__name__).logger
        
        # Configure Flask app
        self.app.config.update({
            'SECRET_KEY': config.get('secret_key', 'dev-secret-key'),
            'DEBUG': config.get('debug', False),
            'TESTING': config.get('testing', False)
        })
        
        # Register routes
        self._register_routes()
        self._register_error_handlers()
        
        # Initialize components
        self._initialize_components()
    
    def _initialize_components(self) -> None:
        """Initialize application components."""
        try:
            self.database.connect()
            self.logger.info("Database connected successfully")
            
            # Initialize sample data
            self._setup_sample_data()
            
        except Exception as e:
            self.logger.error(f"Component initialization failed: {e}")
            raise
    
    def _setup_sample_data(self) -> None:
        """Setup sample data for demonstration."""
        sample_users = [
            {"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin"},
            {"id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "user"},
            {"id": 3, "name": "Charlie Brown", "email": "charlie@example.com", "role": "user"}
        ]
        
        self.database.setup_sample_data("users", sample_users)
        self.logger.info(f"Sample data initialized: {len(sample_users)} users")
    
    def _register_routes(self) -> None:
        """Register application routes."""
        
        @self.app.route('/')
        def index():
            """Home page showing application info."""
            return render_template_string("""
            <!DOCTYPE html>
            <html>
            <head>
                <title>{{ app_name }}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                    .info { background: #ecf0f1; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    .endpoints { background: #f8f9fa; padding: 20px; border-radius: 5px; }
                    .endpoint { margin: 10px 0; padding: 10px; background: white; border-radius: 3px; }
                    .method { color: #27ae60; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1 class="header">{{ app_name }}</h1>
                <div class="info">
                    <h2>Application Information</h2>
                    <p><strong>Version:</strong> {{ version }}</p>
                    <p><strong>Description:</strong> {{ description }}</p>
                    <p><strong>Team:</strong> IOE INNOVATION Team</p>
                </div>
                
                <div class="endpoints">
                    <h2>Available Endpoints</h2>
                    
                    <div class="endpoint">
                        <span class="method">GET</span> <strong>/</strong> - This page
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">GET</span> <strong>/health</strong> - Health check
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">GET</span> <strong>/api/users</strong> - Get all users
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">GET</span> <strong>/api/users/&lt;id&gt;</strong> - Get user by ID
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">POST</span> <strong>/api/users</strong> - Create new user
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">PUT</span> <strong>/api/users/&lt;id&gt;</strong> - Update user
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">DELETE</span> <strong>/api/users/&lt;id&gt;</strong> - Delete user
                    </div>
                </div>
            </body>
            </html>
            """, 
            app_name=APP_NAME,
            version=APP_VERSION,
            description=APP_DESCRIPTION
            )
        
        @self.app.route('/health')
        def health_check():
            """Health check endpoint."""
            try:
                health_status = self.web_server.get_health_status()
                health_status.update({
                    "application": APP_NAME,
                    "version": APP_VERSION,
                    "database": self.database.is_connected()
                })
                
                return jsonify(health_status), 200
                
            except Exception as e:
                self.logger.error(f"Health check failed: {e}")
                return jsonify({
                    "status": "error",
                    "message": str(e)
                }), 500
        
        # API Routes
        @self.app.route('/api/users', methods=['GET'])
        def get_users():
            """Get all users."""
            try:
                users = self.database.get_all_users()
                return jsonify({
                    "status": "success",
                    "data": users,
                    "count": len(users)
                }), 200
                
            except Exception as e:
                self.logger.error(f"Get users failed: {e}")
                return jsonify({
                    "status": "error",
                    "message": "Failed to retrieve users"
                }), 500
        
        @self.app.route('/api/users/<int:user_id>', methods=['GET'])
        def get_user(user_id: int):
            """Get user by ID."""
            try:
                user = self.database.get_user_by_id(user_id)
                if user:
                    return jsonify({
                        "status": "success",
                        "data": user
                    }), 200
                else:
                    return jsonify({
                        "status": "error",
                        "message": "User not found"
                    }), 404
                    
            except Exception as e:
                self.logger.error(f"Get user {user_id} failed: {e}")
                return jsonify({
                    "status": "error",
                    "message": "Failed to retrieve user"
                }), 500
        
        @self.app.route('/api/users', methods=['POST'])
        def create_user():
            """Create new user."""
            try:
                data = request.get_json()
                if not data:
                    return jsonify({
                        "status": "error",
                        "message": "No data provided"
                    }), 400
                
                # Validate required fields
                required_fields = ['name', 'email']
                for field in required_fields:
                    if field not in data:
                        return jsonify({
                            "status": "error",
                            "message": f"Missing required field: {field}"
                        }), 400
                
                # Create user
                user_id = self.database.create_user(data)
                return jsonify({
                    "status": "success",
                    "message": "User created successfully",
                    "user_id": user_id
                }), 201
                
            except Exception as e:
                self.logger.error(f"Create user failed: {e}")
                return jsonify({
                    "status": "error",
                    "message": "Failed to create user"
                }), 500
        
        @self.app.route('/api/users/<int:user_id>', methods=['PUT'])
        def update_user(user_id: int):
            """Update user."""
            try:
                data = request.get_json()
                if not data:
                    return jsonify({
                        "status": "error",
                        "message": "No data provided"
                    }), 400
                
                success = self.database.update_user(user_id, data)
                if success:
                    return jsonify({
                        "status": "success",
                        "message": "User updated successfully"
                    }), 200
                else:
                    return jsonify({
                        "status": "error",
                        "message": "User not found"
                    }), 404
                    
            except Exception as e:
                self.logger.error(f"Update user {user_id} failed: {e}")
                return jsonify({
                    "status": "error",
                    "message": "Failed to update user"
                }), 500
        
        @self.app.route('/api/users/<int:user_id>', methods=['DELETE'])
        def delete_user(user_id: int):
            """Delete user."""
            try:
                success = self.database.delete_user(user_id)
                if success:
                    return jsonify({
                        "status": "success",
                        "message": "User deleted successfully"
                    }), 200
                else:
                    return jsonify({
                        "status": "error",
                        "message": "User not found"
                    }), 404
                    
            except Exception as e:
                self.logger.error(f"Delete user {user_id} failed: {e}")
                return jsonify({
                    "status": "error",
                    "message": "Failed to delete user"
                }), 500
    
    def _register_error_handlers(self) -> None:
        """Register error handlers."""
        
        @self.app.errorhandler(404)
        def not_found(error):
            return jsonify({
                "status": "error",
                "message": "Endpoint not found",
                "code": 404
            }), 404
        
        @self.app.errorhandler(500)
        def internal_error(error):
            return jsonify({
                "status": "error",
                "message": "Internal server error",
                "code": 500
            }), 500
        
        @self.app.errorhandler(400)
        def bad_request(error):
            return jsonify({
                "status": "error",
                "message": "Bad request",
                "code": 400
            }), 400
    
    def run(self, host: str = DEFAULT_HOST, port: int = DEFAULT_PORT, debug: bool = DEFAULT_DEBUG) -> None:
        """
        Run the web application.
        
        Args:
            host: Host address to bind to
            port: Port number to listen on
            debug: Enable debug mode
        """
        try:
            console.print(f"🚀 Starting {APP_NAME} on http://{host}:{port}", style="bold green")
            self.logger.info(f"Starting web server on {host}:{port}")
            
            self.app.run(
                host=host,
                port=port,
                debug=debug,
                use_reloader=False  # Disable reloader to avoid issues
            )
            
        except Exception as e:
            self.logger.error(f"Failed to start web server: {e}")
            console.print(f"❌ Failed to start server: {e}", style="bold red")
            raise

#######################################################################################################################
# Helper Functions
#######################################################################################################################
def render_template_string(template: str, **kwargs) -> str:
    """
    Simple template rendering function.
    
    Args:
        template: HTML template string
        **kwargs: Template variables
    
    Returns:
        Rendered HTML string
    """
    result = template
    for key, value in kwargs.items():
        result = result.replace(f"{{{{ {key} }}}}", str(value))
    return result


def load_config(config_path: str) -> Dict[str, Any]:
    """
    Load configuration from YAML file.
    
    Args:
        config_path: Path to configuration file
        
    Returns:
        Configuration dictionary
    """
    try:
        if Path(config_path).exists():
            with open(config_path, 'r') as f:
                return yaml.safe_load(f) or {}
        else:
            console.print(f"⚠️ Config file not found: {config_path}, using defaults", style="yellow")
            return {}
    except Exception as e:
        console.print(f"❌ Failed to load config: {e}", style="red")
        return {}


def get_default_config() -> Dict[str, Any]:
    """
    Get default application configuration.
    
    Returns:
        Default configuration dictionary
    """
    return {
        "server": {
            "host": DEFAULT_HOST,
            "port": DEFAULT_PORT,
            "debug": DEFAULT_DEBUG
        },
        "database": {
            "type": "in_memory",
            "connection_string": "sqlite:///:memory:"
        },
        "logging": {
            "level": "INFO",
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        },
        "secret_key": "demo-secret-key-change-in-production"
    }

#######################################################################################################################
# Command Line Interface
#######################################################################################################################
@click.command()
@click.version_option(version=APP_VERSION, prog_name=APP_NAME)
@click.option('--host', '-h', 
              default=DEFAULT_HOST,
              help='Host address to bind to')
@click.option('--port', '-p',
              default=DEFAULT_PORT,
              type=int,
              help='Port number to listen on')
@click.option('--debug', '-d',
              is_flag=True,
              help='Enable debug mode')
@click.option('--config', '-c',
              default='config.yaml',
              help='Configuration file path')
def main(host: str, port: int, debug: bool, config: str) -> None:
    """
    IOE Web Server Demo - Flask web application following IOE standards.
    
    This application demonstrates IOE INNOVATION Team Python coding standards
    for web applications, including proper project structure, error handling,
    logging, and API design.
    """
    try:
        # Print application banner
        console.print()
        console.print("═" * 70, style="blue")
        console.print(f"  {APP_NAME} v{APP_VERSION}", style="bold blue")
        console.print(f"  {APP_DESCRIPTION}", style="cyan")
        console.print("  IOE INNOVATION Team", style="green")
        console.print("═" * 70, style="blue")
        console.print()
        
        # Load configuration
        app_config = load_config(config)
        if not app_config:
            app_config = get_default_config()
        
        # Override with CLI options
        app_config.setdefault('server', {})
        app_config['server']['host'] = host
        app_config['server']['port'] = port
        app_config['server']['debug'] = debug
        
        # Create and run application
        web_app = IOEWebApplication(app_config)
        
        console.print("📋 Available endpoints:", style="bold")
        console.print("  • GET  /                - Home page")
        console.print("  • GET  /health          - Health check")
        console.print("  • GET  /api/users       - Get all users")
        console.print("  • GET  /api/users/<id>  - Get user by ID")
        console.print("  • POST /api/users       - Create user")
        console.print("  • PUT  /api/users/<id>  - Update user")
        console.print("  • DEL  /api/users/<id>  - Delete user")
        console.print()
        
        web_app.run(host=host, port=port, debug=debug)
        
    except KeyboardInterrupt:
        console.print("\\n⏸️ Application interrupted by user", style="yellow")
    except Exception as e:
        console.print(f"❌ Fatal error: {e}", style="bold red")
        if debug:
            console.print_exception()
        sys.exit(1)

#######################################################################################################################
# Main Execution
#######################################################################################################################
if __name__ == "__main__":
    main()

# End of File