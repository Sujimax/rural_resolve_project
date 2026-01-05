from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from dependancy import get_db
from models.user_model import User
from schemas.user_schema import UserSignup, UserLogin, UserOut, Token
from utils.jwt_handler import create_access_token

auth_router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash & verify passwords
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ================= SIGNUP =================
@auth_router.post("/signup", 
                  response_model=UserOut, 
                  status_code=status.HTTP_201_CREATED)
def signup(user: UserSignup, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=user.name,
        phone=user.phone,
        email=user.email,
        password=hash_password(user.password),
        role=user.role   # MUST include role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# ================= LOGIN =================
@auth_router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({
        "sub": db_user.email,
        "user_id": db_user.id,
        "role": db_user.role   # MUST include role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "role": db_user.role,
            "name": db_user.name
        }
    }
