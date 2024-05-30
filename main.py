from email.mime import image
from fastapi import FastAPI, APIRouter, Depends
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import sessionmaker, Session

# Import DB and API models
from api_model import ImageCreate, ClassificationCreate 
from model import *

# Database setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)
 
# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
 
def get_or_create(session: Session, model : Type[Base], **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if not instance:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
    return instance
    
def save_user_classification(session : Session, user_classification : ClassificationCreate) -> bool:
    topic = get_or_create(session, Topic, name=user_classification.imageSetUsed)
    
    # Create and save classification details
    classification_details = ClassificationDetails(reasoning=user_classification.reasoning)
    session.add(classification_details)
    session.commit()
    session.refresh(classification_details)

    # Save how images were classified
    for image_pos in user_classification.imagePositions:
        print ("Saving image", image_pos)
        image = get_or_create(session, Image, topic=topic, name=image_pos.imageId)
        image_category = get_or_create(session, Category, name=image_pos.category)
        
        new_classification = Classification(image=image, 
                                            category=image_category, 
                                            classification_details=classification_details)
        
        session.add(new_classification)
        session.commit()
        session.refresh(new_classification) # Gets the new inserted id for the classification

    
     

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