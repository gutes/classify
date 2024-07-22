import json
from fastapi import FastAPI, APIRouter, Depends
from fastapi.staticfiles import StaticFiles

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

# Import DB and API models
from api_model  import ClassificationCreate 
from model import *
from dbutils import *

# Database setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
Base.metadata.create_all(bind=engine)

result = next(get_db()).execute(select(ClassificationDetails))

for classification_detail in result.scalars():
    jsonified = json.loads(json.loads(classification_detail.timeline)) # TODO: fix double-escaped. 
    for frame in jsonified:
        print (f"{frame['timestamp'] }")
