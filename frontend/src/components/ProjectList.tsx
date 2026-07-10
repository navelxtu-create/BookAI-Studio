import type { Project } from "../types";

interface Props {
  projects: Project[];
  onSelect: (project: Project) => void;
}

function ProjectList({
  projects,
  onSelect
}: Props) {

  return (

    <div>

      <h2
        style={{
          marginTop: 0
        }}
      >
        📚 Moje knihy
      </h2>

      {
        projects.map(project => (

          <div
            key={project.id}
            onClick={() => onSelect(project)}
            style={{
              background: "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "12px",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >

            <h3
              style={{
                margin: 0,
                marginBottom: "8px"
              }}
            >
              📖 {project.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "14px"
              }}
            >
              {project.description}
            </p>

            <div
              style={{
                marginTop: "10px",
                fontSize: "13px",
                color: "#999"
              }}
            >
              📄 {project.chapters.length} kapitol
            </div>

          </div>

        ))
      }

    </div>

  );

}

export default ProjectList;