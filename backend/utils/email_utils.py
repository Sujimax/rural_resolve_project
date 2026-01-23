import smtplib
from email.message import EmailMessage
from config import EMAIL_USER, EMAIL_PASS


def send_status_update_email(to_email, complaint_id, status):
    print("📨 Email function started")
    print("To:", to_email)

    msg = EmailMessage()
    msg["Subject"] = "Rural Resolve - Complaint Status Updated"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    msg.set_content(f"""
Hello,

Your complaint (ID: {complaint_id}) status updated.

New Status: {status}

Thank you,
Rural Resolve Team
""")

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
        server.quit()

        print("✅ EMAIL SENT SUCCESSFULLY")

    except Exception as e:
        print("❌ EMAIL ERROR:", e)
