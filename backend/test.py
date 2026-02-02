from utils.email import send_status_email

print("TEST SCRIPT STARTED")

try:
    send_status_email(
        to_email="sujithra1050@gmail.com",  # 👈 put your email here
        complaint_id=123,
        status="TEST STATUS"
    )
    print("TEST EMAIL FUNCTION COMPLETED")
except Exception as e:
    print("TEST FAILED:", e)
