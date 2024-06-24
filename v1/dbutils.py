from sqlalchemy.orm import sessionmaker, Session
from typing import Type

from model import * 
from api_model import *


# Retrieves mapped object from DB. Creates it if it doesn't exist
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
        image = get_or_create(session, Image, topic=topic, name=image_pos.imageId)
        image_category = get_or_create(session, Category, name=image_pos.category)

        new_classification = Classification(image=image, 
                                            category=image_category, 
                                            classification_details=classification_details)
        
        session.add(new_classification)
        session.commit()
        session.refresh(new_classification) # Gets the new inserted id for the classification

    
     