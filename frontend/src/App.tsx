import { useEffect, useState } from "react";
import api from "./services/api";

import ProjectList from "./components/ProjectList";
import ChapterList from "./components/ChapterList";
import ChapterView from "./components/ChapterView";

import type { Project, Chapter } from "./types";

function App() {

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [selectedChapter, setSelectedChapter] =
    useState<Chapter | null>(null);


  useEffect(() => {

    api.get("/projects/")
      .then(response => {

        setProjects(response.data);

      })
      .catch(error => {

        console.error(error);

      });

  }, []);


  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial"
      }}
    >

      <header
        style={{
          background: "#20232a",
          color: "white",
          padding: "15px 25px",
          fontSize: "24px",
          fontWeight: "bold"
        }}
      >
        📚 BookAI Studio
      </header>


      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "280px 280px 1fr",
          overflow: "hidden"
        }}
      >

        <div
          style={{
            borderRight: "1px solid #ddd",
            padding: "20px",
            overflowY: "auto"
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
            overflowY: "auto"
          }}
        >

          {
            selectedProject ? (

              <ChapterList
                project={selectedProject}
                onSelect={setSelectedChapter}
              />

            ) : (

              <p>Vyber knihu.</p>

            )
          }

        </div>


        <div
          style={{
            padding: "25px",
            overflowY: "auto"
          }}
        >

          {
            selectedChapter ? (

              <ChapterView
                chapter={selectedChapter}
              />

            ) : (

              <div>

                <h2>👋 Vitaj v BookAI Studio</h2>

                <p>
                  Vyber kapitolu z ľavého panelu.
                </p>

              </div>

            )
          }

        </div>

      </div>

    </div>

  );

}

export default App;
