import type { Project } from "../types";

interface Props {
  projects: Project[];
  selectedProjectId: number | null;
  onSelect: (project: Project) => void;
}

function ProjectList({ projects, selectedProjectId, onSelect }: Props) {
  return (
    <div>
      <h2 className="panel-title">📚 Moje knihy</h2>

      <div className="list-stack">
        {projects.map((project) => (
          <button
            key={project.id}
            className={`card-button ${selectedProjectId === project.id ? "is-active" : ""}`}
            onClick={() => onSelect(project)}
          >
            <h3>📖 {project.title}</h3>
            <p>{project.description || "Bez popisu"}</p>
            <div className="card-meta">📄 {project.chapters.length} kapitol</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;