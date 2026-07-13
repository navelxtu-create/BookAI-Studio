from app.core.config import settings

from app.providers.base import AIProvider
from app.providers.ollama import OllamaProvider
from app.providers.openai import OpenAIProvider


def _build_provider(name: str) -> AIProvider:

    if name == "ollama":
        return OllamaProvider()

    if name == "openai":
        return OpenAIProvider()

    raise ValueError(
        f"Unknown AI provider: {name}"
    )


def get_provider():
    return _build_provider(settings.ai_provider)


def get_provider_chain() -> list[AIProvider]:

    if settings.ai_provider == "openai":
        order = ["openai", "ollama"]
    elif settings.ai_provider == "ollama":
        order = ["ollama", "openai"]
    elif settings.ai_provider == "auto":
        order = ["openai", "ollama"]
    else:
        raise ValueError(f"Unknown AI provider: {settings.ai_provider}")

    return [_build_provider(name) for name in order]
