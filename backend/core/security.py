import os
import secrets
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# Admin Credential Configuration (default admin / admin123 if not in env)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
ADMIN_SECRET_TOKEN = os.getenv("ADMIN_SECRET_TOKEN", "taticboard-admin-secret-token-2026")

security = HTTPBearer()

def verify_admin_credentials(token_credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """Dependency to verify admin HTTP Bearer token."""
    token = token_credentials.credentials
    if token != ADMIN_SECRET_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de administrador inválido ou expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token
