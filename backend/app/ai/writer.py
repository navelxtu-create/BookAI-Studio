class AIWriter:

    def create_outline(self, topic: str):
        return {
            "title": topic,
            "chapters": [
                "Úvod",
                "Hlavná myšlienka",
                "Rozvinutie témy",
                "Záver"
            ]
        }


    def write_chapter(self, title: str, instruction: str):
        return (
            f"Kapitola: {title}\n\n"
            f"{instruction}\n\n"
            "Toto je pracovný návrh textu vytvorený AI Writer Engine."
        )


writer = AIWriter()
