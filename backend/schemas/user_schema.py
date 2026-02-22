from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    name: str
    phone: str 
    email: EmailStr
    password: str 
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str 

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
    user:dict 
   