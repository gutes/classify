from typing import Annotated
from fastapi import FastAPI, Form

app = FastAPI()


@app.post("/save")
async def root():
  f = Form()
  return {f}
