from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependancy import get_db, get_current_admin
from models.complaint_model import Complaint
from schemas.status_update import StatusUpdate

admin_router = APIRouter(prefix="/admin", tags=["admin"])


def send_email_background(email, complaint_id, status):
    send_status_email(email, complaint_id, status)


@admin_router.put("/complaints/{complaint_id}")
def update_complaint_status(
    complaint_id: int,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    # update status
    complaint.status = data.status
    db.commit()

    # send email automatically
    if complaint.email:
        Thread(
            target=send_email_background,
            args=(complaint.email, complaint.id, complaint.status)
        ).start()

    return {
        "success": True,
        "message": "Status updated successfully"
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