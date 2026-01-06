from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base

from router.user_complaint import user_complaint
from router.admin import admin_router
from router.auth import auth_router

app = FastAPI(title="Complaint Management API")
Base.metadata.create_all(bind=engine)

# Static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ CORS setup
origins = [
    "https://rural-resolve-project.netlify.app",  # production frontend
    "http://localhost:5173",  # local dev frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers after middleware
app.include_router(auth_router)
app.include_router(user_complaint)
app.include_router(admin_router)
