from typing import Set
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy import create_engine, func, String, Integer

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


# Database model
class Base(DeclarativeBase):
    pass

class Image(Base):
    __tablename__ = "image"
    id : Mapped[int] = mapped_column(primary_key=True) 
    name : Mapped[str] = mapped_column(String(50))
    experiment_id : Mapped[int] = mapped_column(ForeignKey("experiment.id"))
    experiment : Mapped["Experiment"] = relationship(back_populates="images")
    classifications: Mapped[Set["Classification"]] = relationship(back_populates="image")

class Category(Base):
    __tablename__ = "category"
    id : Mapped[int] = mapped_column(primary_key=True) 
    name : Mapped[str] = mapped_column(String(50))
    classifications: Mapped[Set["Classification"]] = relationship(back_populates="category")

class Classification(Base):
    __tablename__ = "classification"
    id : Mapped[int] = mapped_column(primary_key=True) 
    
    image_id : Mapped[int] = mapped_column(ForeignKey("image.id"))
    image: Mapped["Image"] = relationship(back_populates="classifications")
    
    category_id : Mapped[int] = mapped_column(ForeignKey("category.id"))
    category : Mapped["Category"] = relationship(back_populates="")

    classification_details_id = mapped_column(ForeignKey("classification_details.id"))
    classification_details : Mapped["ClassificationDetails"] = relationship(back_populates="classifications")


class ClassificationDetails(Base):
    __tablename__ = "classification_details"
    id : Mapped[int] = mapped_column(primary_key=True)
    name : Mapped[str] = mapped_column(String(200))
    age: Mapped[int] = mapped_column(Integer)
    career: Mapped[str] = mapped_column(String(100))
    background: Mapped[str] = mapped_column(String(200))
    knowledge: Mapped[str] = mapped_column(String(250))
    reasoning : Mapped[str] = mapped_column(String(200))
    date: Mapped[datetime] = mapped_column(insert_default=func.now())
    classifications: Mapped[Set["Classification"]] = relationship(back_populates="classification_details")
    timeline: Mapped[str] # JSON string


class Experiment(Base):
    __tablename__ = "experiment"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    images : Mapped[Set["Image"]]= relationship(back_populates="experiment")