import React, { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tasks: Task[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  // Add new project
  const addProject = () => {
    if (!newProjectTitle.trim()) return;
    const newProject: Project = {
      id: Date.now(),
      title: newProjectTitle,
      description: newProjectDescription,
      tasks: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectTitle("");
    setNewProjectDescription("");
  };

  // Add task to a project
  const addTask = (projectId: number, taskTitle: string) => {
    if (!taskTitle.trim()) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: [
                ...p.tasks,
                { id: Date.now(), title: taskTitle, completed: false },
              ],
            }
          : p
      )
    );
  };

  // Toggle task completion
  const toggleTask = (projectId: number, taskId: number) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : p
      )
    );
  };

  // Calculate project progress
  const getProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">📂 Project Management</h1>

      {/* Add Project */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">➕ Create New Project</h2>
        <input
          type="text"
          placeholder="Project Title"
          className="border p-2 w-full rounded"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
        />
        <textarea
          placeholder="Project Description"
          className="border p-2 w-full rounded"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
        />
        <button
          onClick={addProject}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-6">
        {projects.map((project) => {
          const progress = getProgress(project.tasks);
          const isCompleted = progress === 100;

          return (
            <div
              key={project.id}
              className={`p-6 rounded-xl shadow border ${
                isCompleted ? "bg-green-100 border-green-400" : "bg-gray-50"
              }`}
            >
              <h2 className="text-2xl font-semibold">{project.title}</h2>
              <p className="text-gray-600">{project.description}</p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{progress}% complete</p>

              {/* Add Task */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="New Task..."
                  className="border p-2 rounded flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      addTask(project.id, (e.target as HTMLInputElement).value);
                  }}
                />
              </div>

              {/* Task List */}
              <ul className="mt-4 space-y-2">
                {project.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between bg-white p-2 rounded shadow"
                  >
                    <span
                      className={`${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => toggleTask(project.id, task.id)}
                      className={`px-3 py-1 rounded ${
                        task.completed
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {task.completed ? "✓" : "Mark Done"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectManagement;
