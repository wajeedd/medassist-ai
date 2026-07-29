from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

password = "MedAssist@123"

hashed = hash_password(password)

print("Original :", password)
print("Hashed   :", hashed)
print("Verified :", verify_password(password, hashed))
print("JWT Token:", create_access_token({"sub": "doctor@example.com"}))