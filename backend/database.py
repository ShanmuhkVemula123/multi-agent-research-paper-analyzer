import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Database configuration: supports DATABASE_URL, DATABASE_PATH, or defaults to ../database/research_papers.db
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    db_path = os.getenv("DATABASE_PATH", os.path.join(BASE_DIR, "..", "database", "research_papers.db"))
    abs_db_path = os.path.abspath(db_path).replace("\\", "/")
    os.makedirs(os.path.dirname(abs_db_path), exist_ok=True)
    DATABASE_URL = f"sqlite:///{abs_db_path}"
elif DATABASE_URL.startswith("postgres://"):
    # SQLAlchemy requires postgresql:// instead of postgres://
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
