export interface Chapter {
  id: number;
  project_id: number;
  title: string;
  content: string;
}


export interface Project {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
}
