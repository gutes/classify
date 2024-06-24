from fastapi import FastAPI, APIRouter, Depends
from fastapi.staticfiles import StaticFiles

# Import DB and API models
from api_model import ImageCreate, ClassificationCreate 
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

## Create FastAPI application and routes
app = FastAPI()
router = APIRouter()

# API endpoint to save a classification
@router.post("/save", response_model = ClassificationCreate)
async def root(user_classification : ClassificationCreate, db: Session = Depends(get_db)):
    # DB saving logic
    try:
        save_user_classification(db, user_classification)
    except Exception as e:
        raise e
    return user_classification

# Precedence matters while adding mounting and routing handlers
app.include_router(router)
app.mount('/', StaticFiles(directory='static', html=True))
app.mount('/img', StaticFiles(directory='static/img', html=False))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)