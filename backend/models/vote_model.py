from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    voter_name = Column(String)   
