from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)   #complaint id

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),nullable=False)
    problem_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    district = Column(String, nullable=False)
    village = Column(String, nullable=False)
    door_no = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    votes = Column(Integer, default=0)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="complaints")
    
    comments = relationship("Comment", back_populates="complaint", cascade="all, delete-orphan")
