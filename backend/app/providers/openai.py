from app.providers.base import AIProvider
from app.core.config import settings


class OpenAIProvider(AIProvider):

    def generate(
        self,
        prompt: str
    ) -> str:

        if not settings.openai_api_key:
            return (
                "OpenAI API key nie je nastavený.\n\n"
                f"Prompt:\n{prompt}"
            )

        return (
            f"OpenAI model: {settings.openai_model}\n\n"
            f"{prompt}"
        )
