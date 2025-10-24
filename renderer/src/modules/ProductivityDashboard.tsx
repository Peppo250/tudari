import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Example positive quotes
const quotes = [
  "Small progress is still progress. Keep going!",
  "Consistency beats intensity.",
  "You are building your future self today.",
  "Focus on progress, not perfection.",
  "Discipline is the bridge between goals and accomplishment.",
];

interface ActivityLog {
  date: string;
  score: number;
}

const ProductivityDashboard: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quote, setQuote] = useState("");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [reflections, setReflections] = useState<string[]>([]);

  // Form inputs
  const [logDate, setLogDate] = useState("");
  const [logScore, setLogScore] = useState<number>(0);
  const [reflectionInput, setReflectionInput] = useState("");
  const [timeInput, setTimeInput] = useState<number>(0);

  // Add activity log
  const addLog = () => {
    if (logDate && logScore > 0) {
      const newLogs = [...logs, { date: logDate, score: logScore }];
      setLogs(newLogs);
      setStreak(newLogs.length); // streak = number of days logged
      setLogDate("");
      setLogScore(0);
    }
  };

  // Add reflection
  const addReflection = () => {
    if (reflectionInput.trim() !== "") {
      setReflections([...reflections, reflectionInput]);
      setReflectionInput("");
    }
  };

  // Update time spent
  const updateTime = () => {
    if (timeInput > 0) {
      setTimeSpent(timeSpent + timeInput);
      setTimeInput(0);
    }
  };

  // Pick random quote
  const pickQuote = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Productivity Dashboard</h1>

      {/* Input Forms */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">➕ Add Activity</h2>
        <input
          type="text"
          placeholder="Day (e.g., Day 1)"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="number"
          placeholder="Score"
          value={logScore}
          onChange={(e) => setLogScore(Number(e.target.value))}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addLog}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Log
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">⏱️ Log Time Spent</h2>
        <input
          type="number"
          placeholder="Minutes"
          value={timeInput}
          onChange={(e) => setTimeInput(Number(e.target.value))}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={updateTime}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Time
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">💡 Motivation</h2>
        <button
          onClick={pickQuote}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Get Random Quote
        </button>
        {quote && <p className="italic text-lg text-gray-700 mt-2">“{quote}”</p>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">📒 Reflections</h2>
        <input
          type="text"
          placeholder="Write a positive note"
          value={reflectionInput}
          onChange={(e) => setReflectionInput(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addReflection}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Add Reflection
        </button>
        <ul className="list-disc list-inside text-gray-700 mt-3">
          {reflections.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      {/* Dashboard Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">🔥 Streak</h2>
          <p className="text-4xl font-bold text-blue-600">{streak} days</p>
          <p className="text-gray-500">Consecutive days active</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">⏱️ Time Spent</h2>
          <p className="text-4xl font-bold text-green-600">{timeSpent} min</p>
          <p className="text-gray-500">Total logged time</p>
        </div>
      </div>

      {/* Productivity Graph */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">📈 Productivity Graph</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityDashboard;
