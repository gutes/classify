from typing import List, Optional
from pydantic import BaseModel

class ImageCreate(BaseModel):
    name: str

class GroupingCreate(BaseModel):
    group_name: str
    images: List[ImageCreate]


class ClassificationCreate(BaseModel):
    user_name: str
    age: int
    career: str
    background: str
    knowledge: int
    reasoning: str
    current_groups: List[GroupingCreate]
    timeline : str