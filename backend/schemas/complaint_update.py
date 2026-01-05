from pydantic import BaseModel
from typing import Optional

class ComplaintUpdate(BaseModel):
    name: Optional[str] = None
    problem_type: Optional[str] = None
    description: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    door_no: Optional[str] = None