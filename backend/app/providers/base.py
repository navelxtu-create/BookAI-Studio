from abc import ABC, abstractmethod
from typing import Any


class AIProvider(ABC):

    @abstractmethod
    def generate(
        self,
        prompt: str
    ) -> str:
        pass

    @abstractmethod
    def check_connection(self) -> dict[str, Any]:
        pass
