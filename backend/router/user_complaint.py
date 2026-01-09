from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import cloudinary.uploader

from dependancy import get_db, get_current_user
from models.complaint_model import Complaint
from models.comment_model import Comment
from models.user_model import User
from schemas.complaint_create import ComplaintUpdate, ComplaintOut
from schemas.comment_create import CommentCreate, CommentOut 

user_complaint = APIRouter(prefix="/complaints", tags=["complaints"])

# ================= CREATE COMPLAINT (JWT REQUIRED) =================
@user_complaint.post("/", response_model=ComplaintOut)
def create_complaint(
    problem_type: str = Form(...),
    description: str = Form(...),
    district: str = Form(...),
    village: str = Form(...),
    door_no: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = None

    if image:
        try:
            upload_result = cloudinary.uploader.upload(
                image.file,
                folder="complaints",       
                public_id=f"user_{current_user.id}_{image.filename}",
                resource_type="image"
            )
            image_url = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail="Image upload failed")


    complaint = Complaint(
        user_id=current_user.id,
        problem_type=problem_type,
        description=description,
        district=district,
        village=village,
        door_no=door_no,
        image_url=image_url  
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint

# ================= GET ALL COMPLAINTS =================
@user_complaint.get("/", response_model=List[ComplaintOut])
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()

    result = []
    for c in complaints:
        user = db.query(User).filter(User.id == c.user_id).first()

        result.append(
            ComplaintOut(
                id=c.id,
                user_id=c.user_id,
                problem_type=c.problem_type,
                description=c.description,
                district=c.district,
                village=c.village,
                door_no=c.door_no,
                votes=c.votes,
                status=c.status,
                created_at=c.created_at,
                user_name=user.name if user else None,
                phone=user.phone if user else None,
                email=user.email if user else None,
                image_url=c.image_url
            )
        )
    return result


# ================= GET MY COMPLAINTS (JWT REQUIRED) =================
@user_complaint.get("/me", response_model=List[ComplaintOut])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Complaint)
        .filter(Complaint.user_id == current_user.id)
        .order_by(Complaint.created_at.desc())
        .all()
    )


# ================= GET ONE COMPLAINT (PUBLIC) =================
@user_complaint.get("/{id}", response_model=ComplaintOut)
def get_one_complaint(id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    user = db.query(User).filter(User.id == complaint.user_id).first()

    return ComplaintOut(
        id=complaint.id,
        user_id=complaint.user_id,
        problem_type=complaint.problem_type,
        description=complaint.description,
        district=complaint.district,
        village=complaint.village,
        door_no=complaint.door_no,
        votes=complaint.votes,
        status=complaint.status,
        created_at=complaint.created_at,
        user_name=user.name if user else None,
        phone=user.phone if user else None,
        email=user.email if user else None,
        image_url=complaint.image_url
    )


# ================= UPDATE COMPLAINT (OWNER ONLY) =================
@user_complaint.put("/{id}")
def update_complaint(
    id: int,
    updated: ComplaintUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter_by(id=id).first()
    if not complaint or complaint.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    complaint.problem_type = updated.problem_type
    complaint.description = updated.description
    complaint.district = updated.district
    complaint.village = updated.village
    complaint.door_no = updated.door_no

    db.commit()
    return {"message": "Complaint updated successfully"}


# ================= DELETE COMPLAINT (OWNER ONLY) =================
@user_complaint.delete("/{id}")
def delete_complaint(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter_by(id=id).first()
    if not complaint or complaint.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted successfully"}


# ================= VOTE COMPLAINT (JWT REQUIRED) =================
@user_complaint.post("/{id}/vote")
def vote_complaint(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.votes += 1
    db.commit()
    return {"message": "Vote added", "votes": complaint.votes}


# ================= GET COMMENTS (PUBLIC) =================
@user_complaint.get("/{id}/comments", response_model=List[CommentOut])
def get_comments(id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.complaint_id == id).all()

    result = []
    for c in comments:
        user = db.query(User).filter(User.id == c.user_id).first()
        result.append(
            CommentOut(
                id=c.id,
                complaint_id=c.complaint_id,
                user_id=c.user_id,
                content=c.content,
                created_at=c.created_at,
                user_name=user.name if user else "Unknown"
            )
        )
    return result


# ================= ADD COMMENT (JWT REQUIRED) =================
@user_complaint.post("/{id}/comments", response_model=CommentOut)
def add_comment(
    id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if comment.complaint_id != id:
        raise HTTPException(status_code=400, detail="Complaint ID mismatch")

    new_comment = Comment(
        complaint_id=id,
        user_id=current_user.id,
        content=comment.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return CommentOut(
        id=new_comment.id,
        complaint_id=id,
        user_id=current_user.id,
        content=new_comment.content,
        created_at=new_comment.created_at,
        user_name=current_user.name
    )


# ================= DELETE COMMENT (OWNER ONLY) =================
@user_complaint.delete("/comments/{id}")
def delete_comment(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(comment)
    db.commit()
    return {"message": "Deleted"}
