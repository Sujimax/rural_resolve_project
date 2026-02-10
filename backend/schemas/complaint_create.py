from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ComplaintCreate(BaseModel):
    user_id: int         
    problem_type: str
    description: str
    district: str
    village: str
    address: str 
    image_url: Optional[str] = None


class ComplaintUpdate(BaseModel):
    problem_type: str
    description: str
    district: str
    village: str
    address: str  


class ComplaintOut(BaseModel):
    id: int      #complaint id
    user_id: Optional[int]  
    problem_type: str
    description: str
    district: str
    village: str
    address: str 
    votes: int
    status: str
    created_at: datetime
    comments_count: int = 0  
    user_name: Optional[str] = None  
    phone: Optional[str] = None 
    image_url: Optional[str] = None
    email:Optional[str] = None

    model_config = {"from_attributes": True}