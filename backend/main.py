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
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")  #uploads folder-la irukka files-ah browser-la direct-aa open panna allow pannradhu


origins = [
    "https://rural-resolve-project.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth_router)
app.include_router(user_complaint)
app.include_router(admin_router)