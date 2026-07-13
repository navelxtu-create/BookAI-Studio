from openai import OpenAI

from app.providers.base import AIProvider
from app.core.config import settings


class OpenAIProvider(AIProvider):

    def _client(self) -> OpenAI:
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY nie je nastavený")

        return OpenAI(api_key=settings.openai_api_key)

    def generate(
        self,
        prompt: str
    ) -> str:

        client = self._client()

        response = client.responses.create(
            model=settings.openai_model,
            input=prompt,
        )

        output_text = response.output_text

        if not output_text:
            raise RuntimeError("OpenAI nevrátil textový výstup")

        return output_text

    def check_connection(self) -> dict[str, str | bool]:
        if not settings.openai_api_key:
            return {
                "configured": False,
                "connected": False,
                "message": "Chýba OPENAI_API_KEY",
            }

        try:
            client = self._client()
            response = client.responses.create(
                model=settings.openai_model,
                input="Respond exactly with: OK",
            )
            text = (response.output_text or "").strip()

            return {
                "configured": True,
                "connected": "OK" in text,
                "message": f"OpenAI odpovedal: {text or 'bez textu'}",
            }
        except Exception as error:
            return {
                "configured": True,
                "connected": False,
                "message": f"OpenAI chyba: {error}",
            }
