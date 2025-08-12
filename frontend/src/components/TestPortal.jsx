import React, { useState, useEffect } from "react";

const questionsData = [
  {
    id: 1,
    question: `10 women can complete a work in 7 days and 10 children take 14 days to complete the work. How many days will 5 women and 10 children take to complete the work?`,
    options: [
      { id: "A", text: "3" },
      { id: "B", text: "5" },
      { id: "C", text: "7" },
      { id: "D", text: "can't be determined" },
    ],
    answer: "C",
  },
  {
    id: 2,
    question: `What is the capital of France?`,
    options: [
      { id: "A", text: "Berlin" },
      { id: "B", text: "Madrid" },
      { id: "C", text: "Paris" },
      { id: "D", text: "Rome" },
    ],
    answer: "C",
  },
];

function Timer({ startMinutes = 20 }) {
  const [timeLeft, setTimeLeft] = useState(startMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="text-white font-medium tracking-wide">
      ⏳ {mins}:{secs < 10 ? `0${secs}` : secs}
    </div>
  );
}

export default function TestPortal() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const currentQuestion = questionsData[currentQuestionIndex];

  function handleOptionSelect(optionId) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentQuestion.id);
      return newSet;
    });
  }

  function handleMarkForReview() {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      newSet.has(currentQuestion.id)
        ? newSet.delete(currentQuestion.id)
        : newSet.add(currentQuestion.id);
      return newSet;
    });
  }

  function handleClearResponse() {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  }

  function handleBookmark() {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.has(currentQuestion.id)
        ? newSet.delete(currentQuestion.id)
        : newSet.add(currentQuestion.id);
      return newSet;
    });
  }

  function nextQuestion() {
    setCurrentQuestionIndex((prev) =>
      prev + 1 < questionsData.length ? prev + 1 : prev
    );
  }

  function getStatus(questionId) {
    if (flaggedQuestions.has(questionId)) return 3;
    if (markedForReview.has(questionId)) return 2;
    if (answers[questionId]) return 1;
    return 0;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 shadow-md">
        <Timer startMinutes={20} />
        <h1 className="text-white font-bold text-lg">
          10th Social Exam 1{" "}
          <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full ml-2">
            Mock Exam
          </span>
        </h1>
        <button
          className="bg-white/10 text-white font-medium px-4 py-1.5 rounded-lg border border-white/20 hover:bg-white/20 transition"
          onClick={() => alert("Submit clicked!")}
        >
          Submit
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Question Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h2 className="text-center text-lg font-semibold border-b pb-3 mb-4">
              Question {currentQuestionIndex + 1}
            </h2>
            <p className="text-gray-700 mb-6">{currentQuestion.question}</p>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center cursor-pointer rounded-xl border px-4 py-3 shadow-sm transition hover:shadow-md ${
                      selected
                        ? "bg-blue-50 border-blue-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      className="mr-3 accent-blue-500"
                      checked={selected}
                      onChange={() => handleOptionSelect(opt.id)}
                    />
                    <span className="font-semibold mr-2">{opt.id}.</span>
                    <span>{opt.text}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-2">
            <button
              onClick={handleMarkForReview}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 shadow transition"
            >
              Mark for Review
            </button>
            <button
              onClick={handleClearResponse}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 shadow transition"
            >
              Clear Response
            </button>
            <button
              onClick={handleBookmark}
              className={`rounded-lg px-3 py-2 shadow transition ${
                flaggedQuestions.has(currentQuestion.id)
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Bookmark
            </button>
            <button
              onClick={nextQuestion}
              className="ml-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Save & Next →
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-white shadow-md rounded-tl-2xl p-4 overflow-auto">
          <h3 className="font-semibold border-b pb-2 mb-3">Questions</h3>
          <div className="grid grid-cols-5 gap-2">
            {questionsData.map((q, idx) => {
              const status = getStatus(q.id);
              const colorMap = {
                0: "bg-gray-100 text-gray-700",
                1: "bg-red-500 text-white",
                2: "bg-blue-500 text-white",
                3: "bg-purple-500 text-white",
              };
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold shadow-sm hover:scale-105 transition ${colorMap[status]}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
