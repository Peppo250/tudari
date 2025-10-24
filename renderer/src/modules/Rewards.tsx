import React, { useState, useEffect } from "react";

interface Reward {
  id: number;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
}

const allRewards: Reward[] = [
  { id: 1, title: "Streak Starter", description: "Log activity for 3 consecutive days.", icon: "🔥", pointsRequired: 50 },
  { id: 2, title: "Note Master", description: "Write 5 pages of notes.", icon: "📓", pointsRequired: 100 },
  { id: 3, title: "Quiz Whiz", description: "Score 80%+ in 3 quizzes.", icon: "🎯", pointsRequired: 150 },
  { id: 4, title: "Task Slayer", description: "Complete 20 To-Do tasks.", icon: "✅", pointsRequired: 200 },
  { id: 5, title: "Consistency King/Queen", description: "Maintain a 7-day streak.", icon: "👑", pointsRequired: 300 },
];

const Rewards: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [inputPoints, setInputPoints] = useState<number>(0);

  // Calculate unlocked rewards based on points
  const calculateRewards = (earnedPoints: number) => {
    const unlockedRewards = allRewards
      .filter((r) => earnedPoints >= r.pointsRequired)
      .map((r) => r.id);
    setUnlocked(unlockedRewards);
  };

  // Handle user input for points
  const savePoints = () => {
    setPoints(inputPoints);
    calculateRewards(inputPoints);

    // optional: persist in localStorage
    localStorage.setItem("userPoints", inputPoints.toString());
  };

  // On page load, fetch stored points
  useEffect(() => {
    const savedPoints = localStorage.getItem("userPoints");
    if (savedPoints) {
      const parsed = parseInt(savedPoints, 10);
      setPoints(parsed);
      calculateRewards(parsed);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🏆 Rewards System</h1>

      {/* Input for user progress */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">Update Your Progress</h2>
        <input
          type="number"
          placeholder="Enter your total earned points"
          value={inputPoints}
          onChange={(e) => setInputPoints(Number(e.target.value))}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={savePoints}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Progress
        </button>
      </div>

      {/* Points Display */}
      <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Points</h2>
          <p className="text-4xl font-bold text-blue-600">{points}</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Redeem Points
        </button>
      </div>

      {/* Rewards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allRewards.map((reward) => (
          <div
            key={reward.id}
            className={`p-6 rounded-xl shadow border ${
              unlocked.includes(reward.id)
                ? "bg-yellow-100 border-yellow-400"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{reward.icon}</span>
              <div>
                <h3 className="text-lg font-semibold">{reward.title}</h3>
                <p className="text-gray-600">{reward.description}</p>
                <p className="text-sm mt-1 text-gray-500">
                  Requires {reward.pointsRequired} pts
                </p>
              </div>
            </div>

            {unlocked.includes(reward.id) && (
              <p className="mt-3 text-green-700 font-medium">✅ Unlocked</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
