from app.core.config import settings

from app.providers.ollama import OllamaProvider


def get_provider():

    if settings.ai_provider == "ollama":
        return OllamaProvider()

    raise ValueError(
        f"Unknown AI provider: {settings.ai_provider}"
    )
