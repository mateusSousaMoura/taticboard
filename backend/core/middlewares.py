import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.logging import logger

def setup_middlewares(app: FastAPI) -> None:
    """Centralized registration of FastAPI middlewares."""
    
    # 1. CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. HTTP Request Performance & Audit Logging Middleware
    @app.middleware("http")
    async def log_requests_and_performance(request: Request, call_next):
        start_time = time.time()
        
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            
            logger.info(
                f"[{request.method}] {request.url.path} - Status: {response.status_code} - Took: {process_time:.2f}ms"
            )
            response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
            return response
        except Exception as exc:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"[{request.method}] {request.url.path} - FAILED - Error: {exc} - Took: {process_time:.2f}ms"
            )
            raise exc
