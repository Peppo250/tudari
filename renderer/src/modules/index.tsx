import NoteMaking from "./NoteMaking";
import AI from "./AI";
import ToDoList from "./ToDoList";
import ProductivityDashbaord from "./ProductivityDashboard";
import LoggingModule from "./LoggingModule";
import Rewards from "./Rewards";
import ProjectManagement from "./ProjectManagement";

export const features = [
  {
    name: "Note-Making",
    path: "note-making",
    component: NoteMaking,
    description: "Grid canvas with drawing tools, text, and image upload"
  },
  {
    name: "AI Summarizer & Quiz Generator",
    path: "ai",
    component: AI,
    description: "Summarize notes and auto-generate quizzes"
  },
  {
    name: "To-Do List",
    path: "todo",
    component: ToDoList,
    description: "Organize tasks with filters and progress tracking"
  },
  {
    name: "Productivity Dashboard",
    path: "productivitydashboard",
    component: ProductivityDashbaord,
    description: "View Productivity of User through different metrics"
  },
  {
    name: "User Logs",
    path: "user logs",
    component: LoggingModule,
    description: "Record your activity everyday"
  },
  {
    name: "Rewards",
    path: "rewards",
    component: Rewards,
    description: "Look at your rewards"
  },
  {
    name: "Project Management",
    path: "project management",
    component: ProjectManagement,
    description: "Manage your projects"
  }
  // 🚀 Add more modules here later
];
