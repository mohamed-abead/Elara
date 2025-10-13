# core/settings.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # --- Supabase ---
    SUPABASE_URL: str
    SUPABASE_JWKS_URL: str | None = None  # only needed for RS/ES alg projects
    SUPABASE_JWT_SECRET: str | None = None  # only for HS256 projects
    SUPABASE_ANON_KEY: str

    # --- Privy ---
    PRIVY_API_BASE: str = "https://api.privy.io"
    PRIVY_APP_SECRET: str
    PRIVY_APP_ID: str | None = None  # optional if you don't need it in headers


    # pydantic-settings v2 config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()
