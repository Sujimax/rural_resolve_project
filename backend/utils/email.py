import os
import smtplib
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"))

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_status_email(to_email: str, complaint_id: int, status: str):
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise ValueError("Email credentials not loaded from .env")

    # ✅ Unique subject (prevents Gmail grouping)
    subject = f"Complaint #{complaint_id} Status Updated - {datetime.now().strftime('%H:%M:%S')}"

    body = f"""
Hello,

Your complaint (ID: {complaint_id}) status has been updated.

New Status: {status}

Thank you,
Rural Resolve Team
"""

    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
