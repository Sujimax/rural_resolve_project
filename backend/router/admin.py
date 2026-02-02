from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from threading import Thread

from dependancy import get_db, get_current_admin
from models.complaint_model import Complaint
from schemas.status_update import StatusUpdate
from utils.email import send_status_email

admin_router = APIRouter(prefix="/admin", tags=["admin"])


def send_email_thread(to_email, complaint_id, status):
    try:
        send_status_email(to_email, complaint_id, status)
    except Exception as e:
        print(f"❌ Email thread error: {e}")


@admin_router.put("/complaints/{complaint_id}")
def update_complaint_status(
    complaint_id: int,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    print(f"🔹 Update request received for complaint_id={complaint_id}")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = data.status
    db.commit()
    db.refresh(complaint)

    print(f"🔹 Complaint email: {repr(complaint.email)}")

    # send email in background thread
    if complaint.email and "@" in complaint.email:
        Thread(
            target=send_email_thread, 
            args=(complaint.email, complaint.id, complaint.status)
        ).start()

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
