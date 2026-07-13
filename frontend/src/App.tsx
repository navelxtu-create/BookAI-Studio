import { useEffect, useMemo, useState } from "react";
import api from "./services/api";

import ProjectList from "./components/ProjectList";
import ChapterList from "./components/ChapterList";
import ChapterView from "./components/ChapterView";

import type { Project, Chapter } from "./types";

interface OutlineResponse {
  title: string;
  chapters: string[];
}

interface AIStatusResponse {
  provider: string;
  configured: boolean;
  connected: boolean;
  message: string;
  openai_model: string;
  ollama_model: string;
  ollama_url: string;
  active_provider_class?: string;
  provider_chain?: Array<{
    provider_class: string;
    configured: boolean;
    connected: boolean;
    message: string;
  }>;
}

interface RuntimeConfigRequest {
  ai_provider: string;
  openai_api_key?: string;
  openai_model: string;
  ollama_url: string;
  ollama_model: string;
}

interface GenerationOptions {
  chapterCount: number;
  genre: string;
  tone: string;
  style: string;
  targetWords: number;
}

const GENRE_OPTIONS = ["román", "fantasy", "thriller", "sci-fi", "biznis"];
const TONE_OPTIONS = ["pútavý", "temný", "motivačný", "humorný", "epický"];
const STYLE_OPTIONS = ["literárny", "jednoduchý", "poetický", "filmový"];
const AI_PROVIDER_OPTIONS = ["openai", "ollama", "auto"];

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const [topic, setTopic] = useState("");
  const [chapterCount, setChapterCount] = useState(6);
  const [genre, setGenre] = useState("román");
  const [tone, setTone] = useState("pútavý");
  const [style, setStyle] = useState("literárny");
  const [targetWords, setTargetWords] = useState(50000);

  const [loadingBook, setLoadingBook] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [progressCurrent, setProgressCurrent] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [generatedWords, setGeneratedWords] = useState(0);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [runtimeProvider, setRuntimeProvider] = useState("openai");
  const [runtimeOpenAIKey, setRuntimeOpenAIKey] = useState("");
  const [runtimeOpenAIModel, setRuntimeOpenAIModel] = useState("gpt-4.1-mini");
  const [runtimeOllamaUrl, setRuntimeOllamaUrl] = useState("http://host.docker.internal:11434");
  const [runtimeOllamaModel, setRuntimeOllamaModel] = useState("llama3.2");

  const progressPercent = useMemo(() => {
    if (progressTotal === 0) {
      return 0;
    }

    return Math.round((progressCurrent / progressTotal) * 100);
  }, [progressCurrent, progressTotal]);

  async function loadProjects() {
    try {
      const response = await api.get("/projects/");
      setProjects(response.data);
      return response.data as Project[];
    } catch (error) {
      console.error(error);
      setStatusMessage("Nepodarilo sa načítať projekty.");
      return [];
    }
  }

  async function loadAIStatus() {
    try {
      const response = await api.get<AIStatusResponse>("/ai/status");
      setAiStatus(response.data);
      setRuntimeProvider(response.data.provider || "openai");
      setRuntimeOpenAIModel(response.data.openai_model || "gpt-4.1-mini");
      setRuntimeOllamaUrl(response.data.ollama_url || "http://host.docker.internal:11434");
      setRuntimeOllamaModel(response.data.ollama_model || "llama3.2");
    } catch (error) {
      console.error(error);
      setAiStatus(null);
    }
  }

  useEffect(() => {
    loadProjects();
    loadAIStatus();
  }, []);

  async function saveRuntimeConfig() {
    try {
      const payload: RuntimeConfigRequest = {
        ai_provider: runtimeProvider,
        openai_model: runtimeOpenAIModel,
        ollama_url: runtimeOllamaUrl,
        ollama_model: runtimeOllamaModel,
      };

      if (runtimeOpenAIKey.trim()) {
        payload.openai_api_key = runtimeOpenAIKey.trim();
      }

      const response = await api.post<AIStatusResponse>("/ai/config", payload);
      setAiStatus(response.data);
      setRuntimeOpenAIKey("");
      setSettingsOpen(false);
      setStatusMessage("AI konfigurácia uložená pre aktuálny runtime ✅");
    } catch (error) {
      console.error(error);
      setStatusMessage("Uloženie AI konfigurácie zlyhalo.");
    }
  }

  function exportProjectToMarkdown(project: Project) {
    const sortedChapters = [...project.chapters].sort((a, b) => a.id - b.id);

    const content = [
      `# ${project.title}`,
      "",
      project.description ?? "",
      "",
      ...sortedChapters.flatMap((chapter, index) => [
        `## ${index + 1}. ${chapter.title}`,
        "",
        chapter.content,
        "",
      ]),
    ].join("\n");

    const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeTitle || "kniha"}.md`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function exportProjectToPdf(project: Project) {
    const sortedChapters = [...project.chapters].sort((a, b) => a.id - b.id);

    const html = `
      <html>
        <head>
          <title>${project.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.5; padding: 30px; }
            h1 { margin-bottom: 6px; }
            h2 { margin-top: 28px; }
            p { white-space: pre-wrap; }
            .muted { color: #666; margin-bottom: 22px; }
          </style>
        </head>
        <body>
          <h1>${project.title}</h1>
          <div class="muted">${project.description ?? ""}</div>
          ${sortedChapters
            .map(
              (chapter, index) =>
                `<h2>${index + 1}. ${chapter.title}</h2><p>${chapter.content.replace(/</g, "&lt;")}</p>`,
            )
            .join("")}
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setStatusMessage("Nepodarilo sa otvoriť okno pre PDF export.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  async function generateBookWithAI(override?: Partial<GenerationOptions>) {
    const cleanTopic = topic.trim();

    if (!cleanTopic) {
      setStatusMessage("Najprv zadaj tému knihy.");
      return;
    }

    const activeChapterCount = override?.chapterCount ?? chapterCount;
    const activeGenre = override?.genre ?? genre;
    const activeTone = override?.tone ?? tone;
    const activeStyle = override?.style ?? style;
    const activeTargetWords = override?.targetWords ?? targetWords;

    const wordsPerChapter = Math.max(600, Math.floor(activeTargetWords / activeChapterCount));

    setLoadingBook(true);
    setGeneratedWords(0);
    setProgressCurrent(0);
    setProgressTotal(activeChapterCount);
    setStatusMessage("Generujem osnovu knihy...");

    try {
      const outlineResponse = await api.post<OutlineResponse>("/ai/outline", {
        topic: cleanTopic,
        chapter_count: activeChapterCount,
        genre: activeGenre,
        tone: activeTone,
      });

      const outline = outlineResponse.data;

      setStatusMessage("Vytváram projekt...");
      const projectResponse = await api.post<Project>("/projects/", {
        title: outline.title,
        description: `AI kniha na tému: ${cleanTopic} | žáner: ${activeGenre} | tón: ${activeTone} | cieľ slov: ${activeTargetWords}`,
      });

      const project = projectResponse.data;
      const previousChapterSnippets: string[] = [];
      let runningWordCount = 0;

      for (let i = 0; i < outline.chapters.length; i += 1) {
        const chapterTitle = outline.chapters[i];

        setProgressCurrent(i + 1);
        setStatusMessage(
          `AI píše kapitolu ${i + 1}/${outline.chapters.length}: ${chapterTitle}`,
        );

        const context = previousChapterSnippets.slice(-2).join("\n\n");
        const contextBlock = context
          ? `Kontext z predchádzajúcich kapitol:\n${context.slice(0, 3000)}\n\n`
          : "";

        const chapterTextResponse = await api.post<{ content: string }>("/ai/chapter", {
          title: chapterTitle,
          instruction:
            `${contextBlock}` +
            `Napíš kapitolu ${i + 1} do knihy "${outline.title}" na tému "${cleanTopic}". ` +
            `Dodrž kontinuitu príbehu, postáv a sveta. Píš po slovensky. ` +
            `Cieľ je približne ${wordsPerChapter} slov pre túto kapitolu.`,
          style: activeStyle,
          tone: activeTone,
        });

        await api.post("/chapters/", {
          project_id: project.id,
          title: chapterTitle,
          content: chapterTextResponse.data.content,
        });

        runningWordCount += countWords(chapterTextResponse.data.content);
        setGeneratedWords(runningWordCount);

        previousChapterSnippets.push(
          `${chapterTitle}: ${chapterTextResponse.data.content.slice(0, 1200)}`,
        );
      }

      const freshProjects = await loadProjects();
      const createdProject = freshProjects.find((p) => p.id === project.id) ?? null;

      setSelectedProject(createdProject);
      setSelectedChapter(createdProject?.chapters[0] ?? null);
      setStatusMessage(
        `Kniha je hotová ✅ (${runningWordCount} slov, cieľ: ${activeTargetWords})`,
      );
      setTopic("");
      loadAIStatus();
    } catch (error) {
      console.error(error);
      setStatusMessage("Generovanie zlyhalo. Skontroluj backend logy a AI konfiguráciu.");
    } finally {
      setLoadingBook(false);
    }
  }

  function runAuto50k() {
    generateBookWithAI({
      chapterCount: 20,
      targetWords: 50000,
      genre,
      tone,
      style,
    });
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial",
      }}
    >
      <header
        style={{
          background: "#20232a",
          color: "white",
          padding: "15px 25px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        📚 BookAI Studio
      </header>

      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Zadaj tému knihy..."
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            minWidth: "220px",
          }}
          disabled={loadingBook}
        />

        <input
          type="number"
          min={3}
          max={20}
          value={chapterCount}
          onChange={(event) => {
            const next = Number(event.target.value);
            setChapterCount(Number.isNaN(next) ? 6 : Math.max(3, Math.min(20, next)));
          }}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "90px",
          }}
          disabled={loadingBook}
        />

        <input
          type="number"
          min={5000}
          max={120000}
          value={targetWords}
          onChange={(event) => {
            const next = Number(event.target.value);
            setTargetWords(Number.isNaN(next) ? 50000 : Math.max(5000, Math.min(120000, next)));
          }}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "110px",
          }}
          disabled={loadingBook}
          title="Cieľový počet slov"
        />

        <select value={genre} onChange={(event) => setGenre(event.target.value)} disabled={loadingBook}>
          {GENRE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select value={tone} onChange={(event) => setTone(event.target.value)} disabled={loadingBook}>
          {TONE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select value={style} onChange={(event) => setStyle(event.target.value)} disabled={loadingBook}>
          {STYLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button onClick={() => generateBookWithAI()} disabled={loadingBook}>
          {loadingBook ? "Generujem..." : "🤖 Napísať knihu"}
        </button>

        <button onClick={runAuto50k} disabled={loadingBook}>
          🎯 Auto 50k
        </button>

        <button
          onClick={() => selectedProject && exportProjectToMarkdown(selectedProject)}
          disabled={!selectedProject || loadingBook}
        >
          ⬇️ Export .md
        </button>

        <button
          onClick={() => selectedProject && exportProjectToPdf(selectedProject)}
          disabled={!selectedProject || loadingBook}
        >
          ⬇️ Export PDF
        </button>

        <button onClick={loadAIStatus} disabled={loadingBook}>
          🔌 Overiť AI
        </button>

        <button onClick={() => setSettingsOpen(true)} disabled={loadingBook}>
          ⚙️ AI nastavenia
        </button>

        {statusMessage && (
          <span style={{ fontSize: "14px", color: "#555" }}>{statusMessage}</span>
        )}
      </div>

      {settingsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "white",
              width: "min(680px, 92vw)",
              borderRadius: "12px",
              padding: "18px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>⚙️ AI nastavenia (runtime)</h3>
            <p style={{ fontSize: "13px", color: "#555" }}>
              Uloží sa len pre aktuálne bežiaci backend kontajner. Pre trvalé nastavenie
              použij Deployment Options v Diploi.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label>
                Provider
                <select
                  value={runtimeProvider}
                  onChange={(event) => setRuntimeProvider(event.target.value)}
                  style={{ width: "100%" }}
                >
                  {AI_PROVIDER_OPTIONS.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                OpenAI model
                <input
                  value={runtimeOpenAIModel}
                  onChange={(event) => setRuntimeOpenAIModel(event.target.value)}
                  placeholder="gpt-4.1-mini"
                  style={{ width: "100%" }}
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                OpenAI API key (voliteľné)
                <input
                  type="password"
                  value={runtimeOpenAIKey}
                  onChange={(event) => setRuntimeOpenAIKey(event.target.value)}
                  placeholder="sk-..."
                  style={{ width: "100%" }}
                />
              </label>

              <label>
                Ollama URL
                <input
                  value={runtimeOllamaUrl}
                  onChange={(event) => setRuntimeOllamaUrl(event.target.value)}
                  placeholder="http://host.docker.internal:11434"
                  style={{ width: "100%" }}
                />
              </label>

              <label>
                Ollama model
                <input
                  value={runtimeOllamaModel}
                  onChange={(event) => setRuntimeOllamaModel(event.target.value)}
                  placeholder="llama3.2"
                  style={{ width: "100%" }}
                />
              </label>
            </div>

            <div style={{ marginTop: "12px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setSettingsOpen(false)}>Zrušiť</button>
              <button onClick={saveRuntimeConfig}>Uložiť a overiť</button>
            </div>
          </div>
        </div>
      )}

      {aiStatus && (
        <div
          style={{
            padding: "8px 20px 12px",
            fontSize: "13px",
            color: aiStatus.connected ? "#065f46" : "#92400e",
          }}
        >
          AI provider: <strong>{aiStatus.provider}</strong>
          {aiStatus.active_provider_class ? ` (aktívny: ${aiStatus.active_provider_class})` : ""}
          {` • ${aiStatus.message}`}
          {aiStatus.provider_chain && aiStatus.provider_chain.length > 0 && (
            <span style={{ color: "#555" }}>
              {" "}
              • fallback poradie: {aiStatus.provider_chain.map((item) => item.provider_class).join(" → ")}
            </span>
          )}
        </div>
      )}

      <details style={{ padding: "0 20px 10px" }}>
        <summary style={{ cursor: "pointer", fontSize: "13px", color: "#555" }}>
          Ako rýchlo nastaviť OpenAI API key a Ollamu v Diploi
        </summary>
        <div style={{ fontSize: "13px", color: "#444", marginTop: "8px", lineHeight: "1.5" }}>
          <div>
            <strong>OpenAI:</strong> Deployment Options → FastAPI → Environment:
            AI_PROVIDER=openai, OPENAI_API_KEY=..., OPENAI_MODEL=gpt-4.1-mini
          </div>
          <div style={{ marginTop: "6px" }}>
            <strong>Ollama:</strong> nastav AI_PROVIDER=ollama, OLLAMA_URL na dostupnú Ollama URL
            (napr. interný hostname služby), OLLAMA_MODEL (napr. llama3.2).
          </div>
          <div style={{ marginTop: "6px" }}>
            Aktuálne: model OpenAI <code>{aiStatus?.openai_model ?? "-"}</code>, model Ollama{" "}
            <code>{aiStatus?.ollama_model ?? "-"}</code>, URL <code>{aiStatus?.ollama_url ?? "-"}</code>
          </div>
        </div>
      </details>

      {(loadingBook || progressTotal > 0) && (
        <div style={{ padding: "0 20px 10px" }}>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#ececec",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "#4f46e5",
                transition: "width 250ms ease",
              }}
            />
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Progres: {progressCurrent}/{progressTotal} kapitol • približne {generatedWords} slov
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "280px 280px 1fr",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            borderRight: "1px solid #ddd",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <ProjectList
            projects={projects}
            onSelect={(project) => {
              setSelectedProject(project);
              setSelectedChapter(null);
            }}
          />
        </div>

        <div
          style={{
            borderRight: "1px solid #ddd",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {selectedProject ? (
            <ChapterList project={selectedProject} onSelect={setSelectedChapter} />
          ) : (
            <p>Vyber knihu.</p>
          )}
        </div>

        <div
          style={{
            padding: "25px",
            overflowY: "auto",
          }}
        >
          {selectedChapter ? (
            <ChapterView chapter={selectedChapter} />
          ) : (
            <div>
              <h2>👋 Vitaj v BookAI Studio</h2>
              <p>
                Zadaj tému, počet kapitol, cieľ slov, žáner/tón/štýl a klikni „Napísať
                knihu“ alebo „Auto 50k“.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
