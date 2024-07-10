import json

from sqlalchemy.orm import Session
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

    # Create and save classification details
    classification_details = ClassificationDetails(reasoning=user_classification.reasoning,
                                                   name=user_classification.user_name,
                                                   timeline=json.dumps(user_classification.timeline))
    session.add(classification_details)
    session.commit()
    session.refresh(classification_details)

    # Save how images were classified
    print(user_classification)
    for group in user_classification.current_groups:
        image_category = get_or_create(session, Category, name=group.group_name)
        for img in group.images:
            image = get_or_create(session, Image, name=img.name)
            new_classification = Classification(image=image, 
                                                category=image_category, 
                                                classification_details=classification_details)
            session.add(new_classification)
            session.commit()
            session.refresh(new_classification) # Gets the new inserted id for the classification

    
     