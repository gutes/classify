from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles

class Image(BaseModel):
   category: str
   imageId: str
   x: int
   y: int

class Classification(BaseModel):
    reasoning: str
    categoryNames: List[str]
    imagePositions: List[Image]


app = FastAPI()
app.mount('/', StaticFiles(directory='static', html=True))
app.mount('/img', StaticFiles(directory='static/img', html=False))

router = APIRouter()
@router.post("/save")
async def root(request):
  return "hola"

app.include_router(router)

