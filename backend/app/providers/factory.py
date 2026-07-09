from app.core.config import settings

from app.providers.ollama import OllamaProvider
from app.providers.openai import OpenAIProvider


def get_provider():

    if settings.ai_provider == "ollama":
        return OllamaProvider()

    if settings.ai_provider == "openai":
        return OpenAIProvider()

    raise ValueError(
        f"Unknown AI provider: {settings.ai_provider}"
    )
