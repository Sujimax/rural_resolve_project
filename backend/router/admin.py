from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependancy import get_db, get_current_admin
from models.complaint_model import Complaint
from schemas.status_update import StatusUpdate
from utils.email import send_status_email

admin_router = APIRouter(prefix="/admin", tags=["admin"])


@admin_router.put("/complaints/{complaint_id}")
def update_complaint_status(
    complaint_id: int,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    # Get complaint
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    # Update status
    complaint.status = data.status
    db.commit()
    db.refresh(complaint)

    # Send email
    if complaint.email:
        try:
            print(f"DEBUG: Sending email to {complaint.email}")
            send_status_email(
                to_email=complaint.email,
                complaint_id=complaint.id,
                status=complaint.status
            )
        except Exception as e:
            print(f"Email error: {e}")

    return {
        "message": "Status updated and email sent",
        "complaint_id": complaint.id,
        "status": complaint.status
    }


# DELETE COMPLAINT (ADMIN)

@admin_router.delete("/complaints/{complaint_id}")
def admin_delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    db.delete(complaint)
    db.commit()

    return {"message": "Complaint deleted successfully"}
