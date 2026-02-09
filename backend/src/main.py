"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import create_db_and_tables

# Initialize FastAPI application
app = FastAPI(
    title="Full-Stack Todo API",
    description="RESTful API for multi-user todo task management with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,  # Required for httpOnly cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.on_event("startup")
async def on_startup():
    """Initialize database tables on application startup."""
    # Note: In production, use Alembic migrations instead
    if settings.DEBUG:
        create_db_and_tables()


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "todo-api"}


# Import and register routers
from .api.routes import tasks, auth
app.include_router(tasks.router)
app.include_router(auth.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG
    )
