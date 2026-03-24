import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import EMAIL_ADDRESS, EMAIL_PASSWORD

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

def send_status_email(to_email: str, complaint_id: int, status: str):
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("❌ Email credentials not loaded")
        return

    if not to_email or "@" not in to_email:
        print("❌ Invalid email:", to_email)
        return

    subject = f"Complaint #{complaint_id} Status Update"
    body = f"""
Hello,

Your complaint with ID {complaint_id} has been updated.

Current Status: {status}

Thank you,
Rural Resolve Team
"""

    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email.strip()
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)    #create connection to email server
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print("✅ Email sent to", to_email)

    except Exception as e:
        print("❌ Email sending failed:", e)
        
        
     