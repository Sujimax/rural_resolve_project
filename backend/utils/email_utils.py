import smtplib
from email.message import EmailMessage
from config import EMAIL_USER, EMAIL_PASS


def send_status_update_email(to_email: str, complaint_id: int, status: str):
    try:
        msg = EmailMessage()
        msg["Subject"] = "Rural Resolve - Complaint Status Updated"
        msg["From"] = EMAIL_USER
        msg["To"] = to_email

        msg.set_content(f"""
Hello,

Your complaint (ID: {complaint_id}) status has been updated.

New Status: {status}

Thank you,
Rural Resolve Team
""")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        print(f"✅ Email sent to {to_email}")

    except Exception as e:
        print("❌ Email sending failed:", e)
