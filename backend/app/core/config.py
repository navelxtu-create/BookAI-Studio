from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    app_name: str = "BookAI Studio"
    app_env: str = "development"
    debug: bool = True

    database_url: str

    secret_key: str

    ai_provider: str = "ollama"

    ollama_url: str = "http://host.docker.internal:11434"
    ollama_model: str = "llama3.2"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"

    log_level: str = "INFO"


    class Config:
        env_file = ".env"


settings = Settings()
