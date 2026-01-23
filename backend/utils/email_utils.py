import smtplib
from email.message import EmailMessage

from config import EMAIL_USER, EMAIL_PASS   # 👈 config.py la irundhu import

def send_status_update_email(to_email: str, complaint_id: int, status: str):
    msg = EmailMessage()

    msg["Subject"] = "Rural Resolve - Complaint Status Updated"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    msg.set_content(
        f"""
Hello,

Your complaint (ID: {complaint_id}) status has been updated.

New Status: {status}

Thank you,
Rural Resolve Team
"""
    )

    # Gmail SMTP
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
