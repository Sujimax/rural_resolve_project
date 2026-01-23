from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.email_utils import send_status_update_email
from models.user_model import User

from dependancy import get_db, get_current_admin
from models.complaint_model import Complaint
from schemas.status_update import StatusUpdate

admin_router = APIRouter(prefix="/admin", tags=["admin"])

@admin_router.put("/complaints/{complaint_id}")
def update_complaint_status(
    complaint_id: int,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    # update status
    complaint.status = data.status
    db.commit()
    db.refresh(complaint)

    # get user email
    user = db.query(User).filter(
        User.id == complaint.user_id
    ).first()

    # send email
    if user and user.email:
        send_status_update_email(
            to_email=user.email,
            complaint_id=complaint.id,
            status=complaint.status
        )

    return {
        "message": "Status updated and email sent successfully"
    }


@admin_router.delete("/complaints/{complaint_id}")
def admin_delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted successfully"}