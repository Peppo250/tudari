import React, { useState } from "react";

// Task type
interface Task {
  id: number;
  text: string;
  status: "pending" | "inprogress" | "done";
  dueDate?: string;
  reminder?: string;
}

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminder, setReminder] = useState("");

  // Add task
  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input.trim(),
        status: "pending",
        dueDate: dueDate || undefined,
        reminder: reminder || undefined,
      },
    ]);
    setInput("");
    setDueDate("");
    setReminder("");
  };

  // Change status
  const updateStatus = (id: number, status: Task["status"]) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  // Delete
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Export CSV
  const exportCSV = () => {
    const header = "Task,Status,Due Date,Reminder\n";
    const rows = tasks
      .map(
        (t) =>
          `"${t.text}","${t.status}","${t.dueDate || ""}","${t.reminder || ""}"`
      )
      .join("\n");
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.csv";
    link.click();
  };

  // Kanban columns
  const columns: { key: Task["status"]; title: string }[] = [
    { key: "pending", title: "📌 Pending" },
    { key: "inprogress", title: "🚧 In Progress" },
    { key: "done", title: "✅ Done" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📝 To-Do List Dashboard</h1>

      {/* Input form */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow border rounded-lg px-3 py-2"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="time"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Export */}
      <button
        onClick={exportCSV}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        📤 Export to CSV
      </button>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.key} className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{col.title}</h2>
            <ul className="space-y-3">
              {tasks
                .filter((t) => t.status === col.key)
                .map((task) => (
                  <li
                    key={task.id}
                    className="bg-white border rounded-lg p-3 shadow flex flex-col"
                  >
                    <span className="font-medium">{task.text}</span>
                    <div className="text-sm text-gray-600 flex flex-col">
                      {task.dueDate && <span>📅 Due: {task.dueDate}</span>}
                      {task.reminder && <span>⏰ Reminder: {task.reminder}</span>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {columns
                        .filter((c) => c.key !== task.status)
                        .map((c) => (
                          <button
                            key={c.key}
                            onClick={() => updateStatus(task.id, c.key)}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                          >
                            Move to {c.title}
                          </button>
                        ))}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;
