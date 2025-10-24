import React, { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: string;
}

const AI: React.FC = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");

  const callOpenAI = async (prompt: string) => {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API call failed");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  };

  const summarizeText = async (input: string): Promise<string> => {
    const prompt = `Please provide a concise summary of the following text, highlighting the main points and key information:

${input}

Summary:`;
    
    return await callOpenAI(prompt);
  };

  const generateQuiz = async (input: string): Promise<QuizQuestion[]> => {
    const prompt = `Based on the following text, create 5 multiple-choice questions to test comprehension. Each question should have 4 options (A, B, C, D) with only one correct answer. Format your response as JSON with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Option A"
  }
]

Text to analyze:
${input}

Quiz JSON:`;

    const response = await callOpenAI(prompt);
    
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      
      const questions = JSON.parse(jsonMatch[0]);
      return questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correct: q.correct
      }));
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", response);
      throw new Error("Failed to parse quiz questions from API response");
    }
  };

  const handleProcess = async () => {
    if (!text.trim()) {
      setError("Please enter some text to process");
      return;
    }

    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Generate summary
      const summaryResult = await summarizeText(text);
      setSummary(summaryResult);

      // Generate quiz
      const quizResult = await generateQuiz(text);
      setQuiz(quizResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Summarizer & Quiz Generator</h1>
      
      {/* API Key Input */}
      <div className="space-y-2">
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
          OpenAI API Key:
        </label>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full border rounded p-3"
          placeholder="sk-..."
        />
        <p className="text-xs text-gray-500">
          Your API key is stored locally and not sent anywhere except OpenAI.
        </p>
      </div>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded p-3 h-40 resize-vertical"
        placeholder="Paste your notes here..."
        disabled={loading}
      />

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={loading || !text.trim() || !apiKey.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Process with AI"}
      </button>

      {/* Error Display */}
      {error && (
        <div className="p-3 border border-red-300 rounded bg-red-50 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Summary Display */}
      {summary && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h2 className="font-semibold text-lg mb-2">Summary:</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* Quiz Display */}
      {quiz.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="font-semibold text-lg">Quiz Questions:</h2>
          {quiz.map((q, i) => (
            <div key={i} className="border p-4 rounded bg-white shadow-sm">
              <p className="font-medium mb-3">{i + 1}. {q.question}</p>
              <ul className="space-y-2">
                {q.options.map((opt, j) => (
                  <li 
                    key={j} 
                    className={`p-2 rounded border ${
                      opt === q.correct 
                        ? 'bg-green-100 border-green-300 font-medium' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {String.fromCharCode(65 + j)}. {opt}
                    {opt === q.correct && <span className="text-green-600 ml-2">✓ Correct</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AI;

//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