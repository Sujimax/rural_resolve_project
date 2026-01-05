from pydantic import BaseModel, EmailStr, Field

class UserSignup(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)

class UserOut(BaseModel):
    id: int
    name: str
    phone: str
    email: EmailStr
    role: str

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str
