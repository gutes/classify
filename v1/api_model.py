from typing import List
from pydantic import BaseModel

class ImageCreate(BaseModel):
    # This is the _posta_. It says in which category the image was classified into
    category: str
    imageId: str
    x: float
    y: float

class ClassificationCreate(BaseModel):
    quadrants: int
    imageSetUsed: str
    reasoning: str
    categoryNames: List[str]
    imagePositions: List[ImageCreate]