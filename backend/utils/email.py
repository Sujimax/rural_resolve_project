import os
import smtplib
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# 👇 force load .env from backend folder
load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"))

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_status_email(to_email: str, complaint_id: int, status: str):
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise ValueError("Email credentials not loaded from .env")

    subject = "Complaint Status Updated"

    status_color = {
        "Pending": "#f59e0b",
        "In Progress": "#2563eb",
        "Resolved": "#16a34a"
    }.get(status, "#000000")

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <p>Hello,</p>

        <p>
          Your complaint <b>(ID: {complaint_id})</b> status has been updated.
        </p>

        <p>
          <b>New Status:</b>
          <span style="color:{status_color}; font-weight:bold;">
            {status}
          </span>
        </p>

        <br>
        <p>
          Thank you,<br>
          <b>Rural Resolve Team</b>
        </p>
      </body>
    </html>
    """

    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    server.send_message(msg)
    server.quit()