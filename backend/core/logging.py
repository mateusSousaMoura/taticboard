import logging
import sys

def setup_logging() -> logging.Logger:
    """Centralized logging configuration for the FastAPI application."""
    logging_format = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    
    logging.basicConfig(
        level=logging.INFO,
        format=logging_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Configure specific log levels for third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("apscheduler").setLevel(logging.INFO)
    
    app_logger = logging.getLogger("taticboard")
    app_logger.info("Core Logging initialized successfully.")
    return app_logger

logger = setup_logging()
