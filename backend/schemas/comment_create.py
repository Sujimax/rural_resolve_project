from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommentCreate(BaseModel):
    complaint_id: int
    content: str  

class CommentOut(BaseModel):
    id: int
    complaint_id: int
    user_id: int
    content: str
    created_at: datetime
    user_name: Optional[str] = "Unknown User"

    model_config = {"from_attributes": True}

