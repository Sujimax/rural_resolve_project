from pydantic import BaseModel
from typing import Optional

class StatusUpdate(BaseModel):
    status: Optional[str] = None
    solved_image: Optional[str] = None
