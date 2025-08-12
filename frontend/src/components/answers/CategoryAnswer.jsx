import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryQuestion } from "../../redux/actions/categoryQuestion";
import { useParams } from "react-router-dom";

const randomLightGradient = () => {
  const gradients = [
    "bg-gradient-to-br from-red-100 to-pink-200",
    "bg-gradient-to-br from-blue-100 to-cyan-200",
    "bg-gradient-to-br from-green-100 to-emerald-200",
    "bg-gradient-to-br from-yellow-100 to-amber-200",
    "bg-gradient-to-br from-purple-100 to-pink-200",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function CategoryAnswer({ registerSubmit }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  const categoryData = useSelector(
    (data) => data?.categoryQuestion?.categoryQuestion?.questions || []
  );

  const [questionsState, setQuestionsState] = useState([]);

  useEffect(() => {
    dispatch(getCategoryQuestion());
  }, [dispatch]);

  // Initialize state with filtered data
  useEffect(() => {
    if (categoryData.length > 0) {
      const filtered = categoryData.filter((item) => item.parentId === id);
      const initialized = filtered.map((q, qIndex) => {
        const shuffledAnswers = shuffleArray(
          q.answers.map((a, idx) => ({
            id: `${qIndex}-${idx}`,
            text: a.text,
            belongsTo: a.belongsTo,
          }))
        );

        return {
          _id: q._id,
          titleContent: q.titleContent,
          submitted: false,
          history: [],
          pool: shuffledAnswers,
          categories: q.categories.map((cat, idx) => ({
            id: `q${qIndex}-cat-${idx}`,
            title: cat,
            items: [],
            gradient: randomLightGradient(),
          })),
        };
      });

      setQuestionsState(initialized);
    }
  }, [categoryData, id]);

  const handleDragStart = (e, item, fromCategory, qIndex) => {
    const question = questionsState[qIndex];
    if (question.submitted) return;
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ item, fromCategory, qIndex })
    );
  };

  const handleDrop = (e, toCategory, qIndex) => {
    e.preventDefault();
    const { item, fromCategory } = JSON.parse(
      e.dataTransfer.getData("application/json")
    );

    setQuestionsState((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      if (question.submitted || fromCategory === toCategory) return prev;

      // Save history
      question.history = [
        ...question.history,
        { item, fromCategory, toCategory },
      ];

      // Remove from source
      if (fromCategory === "pool") {
        question.pool = question.pool.filter((i) => i.id !== item.id);
      } else {
        question.categories = question.categories.map((cat) =>
          cat.id === fromCategory
            ? { ...cat, items: cat.items.filter((i) => i.id !== item.id) }
            : cat
        );
      }

      // Add to target
      if (toCategory === "pool") {
        question.pool = [...question.pool, item];
      } else {
        question.categories = question.categories.map((cat) =>
          cat.id === toCategory ? { ...cat, items: [...cat.items, item] } : cat
        );
      }

      updated[qIndex] = question;
      return updated;
    });
  };

  const handleUndo = (qIndex) => {
    setQuestionsState((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };
      if (question.submitted || question.history.length === 0) return prev;

      const lastMove = question.history.pop();
      if (!lastMove) return prev;

      const { item, fromCategory, toCategory } = lastMove;

      // Reverse move
      if (toCategory === "pool") {
        question.pool = question.pool.filter((i) => i.id !== item.id);
      } else {
        question.categories = question.categories.map((cat) =>
          cat.id === toCategory
            ? { ...cat, items: cat.items.filter((i) => i.id !== item.id) }
            : cat
        );
      }

      if (fromCategory === "pool") {
        question.pool = [...question.pool, item];
      } else {
        question.categories = question.categories.map((cat) =>
          cat.id === fromCategory
            ? { ...cat, items: [...cat.items, item] }
            : cat
        );
      }

      updated[qIndex] = question;
      return updated;
    });
  };

  const handleSubmit = (qIndex) => {
    setQuestionsState((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], submitted: true };
      return updated;
    });
  };
useEffect(() => {
  // Register a function that will submit ALL questions
  registerSubmit?.(() => {
    setQuestionsState((prev) =>
      prev.map((q) => ({ ...q, submitted: true }))
    );
  });
}, [registerSubmit]);


  const handleDragOver = (e) => e.preventDefault();

  return (
    <>
      <div className="w-[98%] mx-auto text-black space-y-12">
        {questionsState.map((question, qIndex) => (
          <div
            key={question._id}
            className="border-l-4 border-blue-500 mt-4 shadow-lg p-4 rounded-lg"
          >
            {/* Title */}
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="border-2 border-gray-200 bg-gray-50 p-5 rounded-xl mb-6 shadow-sm font-semibold text-2xl"
            >
              Q.{qIndex + 1} {question.titleContent}
            </motion.h1>

            {/* Pool + Undo */}
            <div className="flex items-start gap-4 mb-6">
              {/* Pool */}
              <motion.div
                layout
                className="flex gap-3 p-4 bg-white rounded-xl shadow-lg overflow-x-auto min-h-[80px] flex-1"
                onDrop={(e) => handleDrop(e, "pool", qIndex)}
                onDragOver={handleDragOver}
              >
                <AnimatePresence>
                  {question.pool.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{
                        scale: question.submitted ? 1 : 1.05,
                      }}
                      className={`px-12 py-4 bg-gray-200 rounded-lg shadow ${
                        question.submitted
                          ? "cursor-not-allowed"
                          : "cursor-grab hover:bg-gray-300"
                      }`}
                      draggable={!question.submitted}
                      onDragStart={(e) =>
                        handleDragStart(e, item, "pool", qIndex)
                      }
                    >
                      {item.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Undo Button */}
              <motion.button
                whileHover={{ scale: question.submitted ? 1 : 1.05 }}
                whileTap={{ scale: question.submitted ? 1 : 0.95 }}
                onClick={() => handleUndo(qIndex)}
                disabled={question.history.length === 0 || question.submitted}
                className={`px-6 py-3 rounded-lg shadow-lg min-h-[88px] font-semibold transition ${
                  question.history.length === 0 || question.submitted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
                </svg>
              </motion.button>
            </div>

            {/* Categories */}
            <div className="flex justify-center gap-6 flex-wrap flex-1">
              {question.categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  className={`w-[320px] min-h-[50vh] rounded-2xl p-4 shadow-xl flex flex-col ${cat.gradient}`}
                  onDrop={(e) => handleDrop(e, cat.id, qIndex)}
                  onDragOver={handleDragOver}
                >
                  <h2 className="text-center text-xl font-bold bg-white rounded-lg p-2 mb-4 shadow-sm">
                    {cat.title}
                  </h2>
                  <div className="space-y-2 flex-1">
                    <AnimatePresence>
                      {cat.items.map((item) => {
                        let statusClass = "";
                        if (question.submitted) {
                          statusClass =
                            item.belongsTo === cat.title
                              ? "border-2 border-green-500"
                              : "border-2 border-red-500";
                        }
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            whileHover={{
                              scale: question.submitted ? 1 : 1.05,
                            }}
                            className={`px-4 py-2 bg-white rounded-lg shadow-md ${
                              question.submitted
                                ? "cursor-not-allowed"
                                : "cursor-grab hover:bg-gray-100"
                            } ${statusClass}`}
                            draggable={!question.submitted}
                            onDragStart={(e) =>
                              handleDragStart(e, item, cat.id, qIndex)
                            }
                          >
                            {item.text}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-start">
              <motion.button
                whileHover={{ scale: question.submitted ? 1 : 1.05 }}
                whileTap={{ scale: question.submitted ? 1 : 0.95 }}
                onClick={() => handleSubmit(qIndex)}
                className={`px-4 py-2 rounded hidden shadow-lg transition ${
                  question.submitted
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={question.submitted}
              >
                Submit
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
