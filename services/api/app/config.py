from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration, read from environment variables (see .env.example)."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="TRUEWELL_", extra="ignore")

    environment: str = "development"
    database_url: str = "postgresql+psycopg://truewell:changeme@localhost:5432/truewell"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = Field(default="dev-only-secret-change-me", min_length=16)
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 15
    refresh_token_days: int = 14

    login_max_attempts: int = 5
    login_lockout_minutes: int = 15

    video_provider_url: str = "https://video.truewell.example"
    video_signing_key: str = "dev-video-key-change-me"
    notifier_url: str = "http://localhost:8090"

    reminder_lead_hours: int = 24
    lab_release_delay_hours: int = 12
    cors_origins: list[str] = ["http://localhost:3000"]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
