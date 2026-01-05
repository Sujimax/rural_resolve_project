from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ComplaintCreate(BaseModel):
    user_id: int         
    problem_type: str
    description: str
    district: str
    village: str
    door_no: str
    image_url: Optional[str] = None


class ComplaintUpdate(BaseModel):
    problem_type: str
    description: str
    district: str
    village: str
    door_no: str


class ComplaintOut(BaseModel):
    id: int      #complaint id
    user_id: Optional[int]  
    problem_type: str
    description: str
    district: str
    village: str
    door_no: str
    votes: int
    status: str
    created_at: datetime
    user_name: Optional[str] = None  
    phone: Optional[str] = None 
    image_url: Optional[str] = None
    email:Optional[str] = None

    model_config = {"from_attributes": True}