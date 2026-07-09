from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    app_name: str = "BookAI Studio"

    database_url: str = (
        "postgresql+psycopg://"
        "bookai:bookai@db:5432/bookai"
    )

    secret_key: str = "change-me"

    openai_api_key: str | None = None


    class Config:
        env_file = ".env"


settings = Settings()
