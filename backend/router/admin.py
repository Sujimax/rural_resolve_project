from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
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
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    # Update status
    complaint.status = data.status
    db.commit()
    db.refresh(complaint)

    # Send email automatically in background
    if complaint.email:
        background_tasks.add_task(
            send_status_email,
            complaint.email,
            complaint.id,
            complaint.status
        )

    return {
        "message": "Status updated successfully",
        "complaint_id": complaint.id,
        "status": complaint.status
    }


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
