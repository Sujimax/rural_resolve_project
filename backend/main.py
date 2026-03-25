from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import os
import cloudinary
from dotenv import load_dotenv

load_dotenv()

from router.user_complaint import user_complaint
from router.admin import admin_router   
from router.auth import auth_router

app = FastAPI(title="Complaint Management API")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://rural-resolve-project.netlify.app",
        "*"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API is working"}

app.include_router(auth_router)
app.include_router(user_complaint)
app.include_router(admin_router)