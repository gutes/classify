from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles

class Image(BaseModel):
   category: str
   imageId: str
   x: float
   y: float

class Classification(BaseModel):
    quadrants: int
    imageSetUsed: str
    reasoning: str
    categoryNames: List[str]
    imagePositions: List[Image]

app = FastAPI()
router = APIRouter()

@router.post("/save")
async def root(classification : Classification):
  return classification

# Precedence matters while adding mounting and routing handlers
app.include_router(router)
app.mount('/', StaticFiles(directory='static', html=True))
app.mount('/img', StaticFiles(directory='static/img', html=False))
