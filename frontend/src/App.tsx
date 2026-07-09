import { useEffect, useState } from "react";
import api from "./services/api";


interface Chapter {
  id: number;
  title: string;
  content: string;
}


interface Project {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
}


function App() {

  const [projects, setProjects] = useState<Project[]>([]);


  useEffect(() => {

    api.get("/projects/")
      .then(response => {

        setProjects(response.data);

      })
      .catch(error => {

        console.error(
          "Chyba načítania projektov:",
          error
        );

      });

  }, []);



  return (

    <div style={{
      padding: "40px",
      fontFamily: "Arial"
    }}>

      <h1>
        📚 BookAI Studio
      </h1>


      <h2>
        Moje knihy
      </h2>



      {
        projects.map(project => (

          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px"
            }}
          >

            <h3>
              📖 {project.title}
            </h3>


            <p>
              {project.description}
            </p>


            <h4>
              Kapitoly:
            </h4>


            <ul>

              {
                project.chapters.map(chapter => (

                  <li key={chapter.id}>

                    {chapter.title}

                  </li>

                ))
              }

            </ul>


          </div>

        ))
      }


    </div>

  );

}


export default App;
