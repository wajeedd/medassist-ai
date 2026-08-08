from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    print("=" * 60)
    print("TOKEN:", token)

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        print("PAYLOAD:", payload)

        user_id = payload.get("sub")

        print("USER ID:", user_id)

        if user_id is None:
            print("SUB IS NONE")
            raise credentials_exception

    except JWTError as e:
        print("JWT ERROR:", e)
        raise credentials_exception

    user = UserRepository.get_by_id(
        db,
        user_id,
    )

    print("USER:", user)
    print("=" * 60)

    if user is None:
        raise credentials_exception

    return user