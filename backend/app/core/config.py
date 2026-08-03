from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "MedAssist AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()