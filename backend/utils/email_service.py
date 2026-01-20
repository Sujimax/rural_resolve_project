import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_status_email(to_email, user_name, complaint_id, status):
    sender_email = "sujithra1050@gmail.com"
    sender_password = "APP_PASSWORD_FROM_GOOGLE"

    subject = "Complaint Status Update"

    body = f"""
Hello {user_name},

Your complaint (ID: {complaint_id}) status has been updated.

Current Status: {status}

Thank you.
"""

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(sender_email, sender_password)
    server.send_message(msg)
    server.quit()
