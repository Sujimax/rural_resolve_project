from utils.email import send_status_email
import os

print("EMAIL_ADDRESS =", os.getenv("EMAIL_ADDRESS"))
print("EMAIL_PASSWORD =", "SET" if os.getenv("EMAIL_PASSWORD") else "NOT SET")

send_status_email(
    to_email="sujithra1050@gmail.com",
    complaint_id=123,
    status="TEST STATUS"
)
