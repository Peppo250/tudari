import React, { useState } from "react";

export interface LogEntry {
  id: number;
  date: string;         // YYYY-MM-DD
  intensity: "low" | "medium" | "high";
  note: string;
  duration: number;     // minutes studied
  score?: number;       // optional productivity score (quiz/notes quality)
}

interface LoggingModuleProps {
  onLogsUpdate?: (logs: LogEntry[]) => void;
}

const LoggingModule: React.FC<LoggingModuleProps> = ({ onLogsUpdate }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [note, setNote] = useState("");
  const [intensity, setIntensity] = useState<LogEntry["intensity"]>("medium");
  const [duration, setDuration] = useState(0);

  const addLog = () => {
    if (!note.trim()) return;

    const newLog: LogEntry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      intensity,
      note,
      duration,
      score:
        intensity === "high" ? 80 : intensity === "medium" ? 60 : 40, // basic proxy
    };

    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    onLogsUpdate?.(updatedLogs);

    setNote("");
    setDuration(0);
    setIntensity("medium");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">📒 Study Logging</h1>

      {/* Input Form */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you study today?"
          className="w-full border rounded-lg px-3 py-2"
        />
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as LogEntry["intensity"])}
            className="border rounded-lg px-3 py-2"
          >
            <option value="low">Low Intensity</option>
            <option value="medium">Medium Intensity</option>
            <option value="high">High Intensity</option>
          </select>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            placeholder="Duration (min)"
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <button
          onClick={addLog}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Log
        </button>
      </div>

      {/* History */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📜 Log History</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs yet.</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li
                key={log.id}
                className="border p-3 rounded-lg shadow-sm flex flex-col"
              >
                <span className="font-medium">
                  {log.date} – {log.intensity.toUpperCase()}
                </span>
                <p>{log.note}</p>
                <span className="text-sm text-gray-600">
                  Duration: {log.duration} min | Score: {log.score}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LoggingModule;
