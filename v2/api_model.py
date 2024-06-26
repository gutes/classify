from typing import List
from pydantic import BaseModel

#class ImageCreate(BaseModel):
    # This is the _posta_. It says in which category the image was classified into
#    group: str
#    imageId: str

#class ClassificationCreate(BaseModel):
#    name: str
#    reasoning: str
#    current_groups: List[ImageCreate]

class ImageCreate(BaseModel):
    name: str

class GroupingCreate(BaseModel):
    group_name: str
    images: List[ImageCreate]

class ClassificationCreate(BaseModel):
    user_name: str
    reasoning: str
    current_groups: List[GroupingCreate]