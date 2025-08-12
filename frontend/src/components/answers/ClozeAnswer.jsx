import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getClozeQuestion } from "../../redux/actions/clozeQuestion";
import { RotateCcw } from "lucide-react";

const lightColors = [
  "#ffd6a5",
  "#ffb5a7",
  "#fcd5ce",
  "#cdeac0",
  "#b5ead7",
  "#9be3de",
  "#a0c4ff",
  "#bdb2ff",
  "#ffc6ff",
  "#f9f7a3",
];

function ClozeItem({ data, index, registerSubmit }) {
  const [options, setOptions] = useState(data.options);
  const [answers, setAnswers] = useState(Array(data.blanks.length).fill(null));
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);

  const coloredOptions = useMemo(() => {
    // Shuffle first, then map colors
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    return shuffled.map((opt) => ({
      text: opt,
      color: lightColors[Math.floor(Math.random() * lightColors.length)],
    }));
  }, [options]);

  const handleDrop = (blankIndex, option) => {
    if (result !== null) return;
    if (!answers[blankIndex]) {
      const newAnswers = [...answers];
      newAnswers[blankIndex] = option.text;
      setHistory([...history, { index: blankIndex, option }]);
      setAnswers(newAnswers);
      setOptions(options.filter((opt) => opt !== option.text));
    }
  };

  const handleUndo = () => {
    if (result !== null || history.length === 0) return;
    const last = history[history.length - 1];
    const newAnswers = [...answers];
    newAnswers[last.index] = null;
    setAnswers(newAnswers);
    setOptions([...options, last.option.text]);
    setHistory(history.slice(0, -1));
  };

  const handleSubmit = () => {
    const resultsArray = data.blanks.map(
      (blank, idx) =>
        answers[idx]?.trim().toLowerCase() === blank.answer.trim().toLowerCase()
    );
    setResult(resultsArray);
  };

  // Register the submit function with the parent
  useEffect(() => {
    registerSubmit?.(handleSubmit);
  }, [registerSubmit]);

  return (
    <div className="relative w-[98%] border-l-4 text-black border-blue-500 m-4 bg-white shadow-lg rounded-lg p-6">
      {/* Undo Button */}
      <button
        onClick={handleUndo}
        disabled={result !== null}
        className={`absolute top-3 right-3 p-3 rounded-lg shadow-lg font-semibold transition ${
          result === null
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Q.{index + 1}
      </h1>

      {/* Options */}
      <div className="flex flex-wrap gap-3 mb-6">
        {coloredOptions.map((option, idx) => (
          <motion.div
            key={idx}
            draggable={result === null}
            onDragStart={(e) => {
              if (result === null) {
                e.dataTransfer.setData("text/plain", option.text);
              }
            }}
            whileHover={{ scale: result === null ? 1.05 : 1 }}
            whileTap={{ scale: result === null ? 0.95 : 1 }}
            className={`px-4 py-2 rounded-lg select-none ${
              result === null
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            style={{ backgroundColor: option.color }}
          >
            {option.text}
          </motion.div>
        ))}
      </div>

      {/* Sentence with blanks */}
      <div className="flex flex-wrap items-center gap-2">
        {data.questionPreview.split(" ").map((word, i) => {
          if (word.includes("____")) {
            const blankIndex =
              data.questionPreview
                .split(" ")
                .slice(0, i + 1)
                .filter((w) => w.includes("____")).length - 1;
            return (
              <motion.div
                key={i}
                onDrop={(e) => {
                  if (result === null) {
                    e.preventDefault();
                    const draggedText = e.dataTransfer.getData("text/plain");
                    const option = coloredOptions.find(
                      (o) => o.text === draggedText
                    );
                    if (option) handleDrop(blankIndex, option);
                  }
                }}
                onDragOver={(e) => result === null && e.preventDefault()}
                className={`min-w-[80px] min-h-[5vh] px-3 py-2 rounded-lg text-center ${
                  result
                    ? result[blankIndex]
                      ? "bg-green-300"
                      : "bg-red-300"
                    : "bg-gray-200"
                }`}
              >
                {answers[blankIndex] || ""}
              </motion.div>
            );
          }
          return <span key={i}>{word} </span>;
        })}
      </div>
    </div>
  );
}

export default function ClozeAnswerList({ registerSubmit }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const clozeData = useSelector(
    (state) => state?.clozeQuestion?.clozeQuestion?.questions || []
  );

  const submitHandlersRef = useRef([]);

  useEffect(() => {
    dispatch(getClozeQuestion());
  }, [dispatch]);

  // Filter by parentId before rendering
  const filteredData = useMemo(
    () => clozeData.filter((q) => q.parentId === id),
    [clozeData, id]
  );

  // Allow parent to trigger all child submits
  useEffect(() => {
    registerSubmit?.(() => {
      submitHandlersRef.current.forEach((fn) => fn && fn());
    });
  }, [registerSubmit]);

  return (
    <div>
      {filteredData.map((question, idx) => (
        <ClozeItem
          key={question._id}
          data={question}
          index={idx}
          registerSubmit={(fn) => (submitHandlersRef.current[idx] = fn)}
        />
      ))}
    </div>
  );
}
