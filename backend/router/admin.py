from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.email_service import send_status_email
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
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    old_status = complaint.status   # 🔹 old status store

    complaint.status = data.status
    db.commit()
    db.refresh(complaint)

    # 🔹 Status change aana mattum email poganum
    if old_status != data.status:
        send_status_email(
            to_email=complaint.email,
            user_name=complaint.user_name,
            complaint_id=complaint.id,
            status=data.status
        )

    return {
        "message": "Status updated successfully & email sent",
        "id": complaint.id,
        "status": complaint.status
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