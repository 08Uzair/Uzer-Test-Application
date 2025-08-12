import React, { useState, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useDispatch } from "react-redux";
import { createClozeQuestion } from "../redux/actions/clozeQuestion";
import useLocalStorage from "../../utility/useLocalStorage";
function QuestionCard({ questionNumber, onDelete, showDelete, parentId }) {
  const [sentence, setSentence] = useState(
    "A quick brown fox jumped over a fence"
  );
  const [highlights, setHighlights] = useState([]);
  const [points, setPoints] = useState(0);
  const [savedData, setSavedData] = useState(null);
  const pRef = useRef();
  const dispatch = useDispatch();
  const [profile] = useLocalStorage("profile", null);

  const handleUnderline = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) return;
    if (!pRef.current.contains(selection.anchorNode)) return;

    // Find first occurrence index of selectedText in sentence which is not already highlighted
    let startIndex = sentence.indexOf(selectedText);
    if (startIndex === -1) return;

    // Check if this exact range overlaps existing highlights; if so, ignore
    for (const h of highlights) {
      if (
        (startIndex >= h.start && startIndex < h.end) || // start inside existing highlight
        (startIndex + selectedText.length > h.start &&
          startIndex + selectedText.length <= h.end)
      ) {
        return;
      }
    }

    const newHighlight = {
      id: Date.now(),
      text: selectedText,
      start: startIndex,
      end: startIndex + selectedText.length,
    };

    setHighlights((prev) => [...prev, newHighlight]);
    selection.removeAllRanges();
  };

  const handleUndo = () => {
    setHighlights((prev) => prev.slice(0, -1));
  };

  // Sort highlights by start position for rendering and data
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

  const renderWithHighlights = () => {
    if (sortedHighlights.length === 0) return sentence;

    let lastIndex = 0;
    const parts = [];

    sortedHighlights.forEach((h, index) => {
      parts.push(sentence.slice(lastIndex, h.start));
      parts.push(
        <span key={h.id} className="underline bg-blue-100 px-1 rounded">
          {sentence.slice(h.start, h.end)}
        </span>
      );
      lastIndex = h.end;
    });

    parts.push(sentence.slice(lastIndex));
    return parts;
  };

  const previewSentence = () => {
    let preview = sentence;
    sortedHighlights.forEach((h) => {
      preview = preview.replace(h.text, "____");
    });
    return preview;
  };

  // On save, create the object per your format
  const handleSave = async () => {
    const data = {
      userID: profile?.result?._id,
      parentId: parentId,
      points: points || 0,
      questionPreview: previewSentence(),
      sentence,
      options: sortedHighlights.map((h) => h.text),
      blanks: sortedHighlights.map((h, i) => ({
        position: i + 1,
        answer: h.text,
      })),
    };
    try {
      await dispatch(createClozeQuestion(data));
    } catch (error) {
      console.log(error);
    }
    setSavedData(data);
    console.log("Saved Data:", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6  w-[98%] bg-white rounded-2xl shadow-lg border-2 border-gray-300 transition-all duration-300 animate-fadeIn"
    >
      {/* Top Row */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Q{questionNumber}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all cursor-pointer"
          >
            Save
          </button>
          <button className="px-5 py-2 border border-blue-500 text-blue-500 rounded-md shadow hover:bg-blue-50 transition-all cursor-pointer">
            Save & Proceed
          </button>
          <AnimatePresence>
            {showDelete && (
              <motion.button
                key="delete-btn"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                onClick={onDelete}
                className="px-5 py-2 border border-red-500 text-red-500 rounded-md shadow hover:bg-red-50 transition-all cursor-pointer"
              >
                Delete Question
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Preview and Points */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="w-[80%]">
          <label className="block text-gray-700 font-medium mb-1">
            Question
          </label>
          <div className="border-l-4 border-blue-500 rounded-md bg-gray-50 shadow-lg">
            <textarea
              value={previewSentence()}
              readOnly
              className="w-full p-3 outline-none bg-transparent resize-none"
              placeholder="Question preview"
              rows={3}
            />
          </div>
        </div>
        <div>
          {/* Points */}
          <input
            type="number"
            placeholder="Points"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-[100px] h-[50px] text-center border border-gray-300 rounded-lg shadow-sm px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
          />
        </div>
      </div>

      {/* Sentence Editing */}
      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-1">
          Sentence*
        </label>
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="w-full border border-gray-200 rounded-md p-3 mb-3 shadow-sm outline-none focus:ring-1 focus:ring-blue-400 resize-none"
          rows={3}
        />
        <label className="block text-red-600 font-medium mb-1">
          Select the Answer to Underline*
        </label>
        <div
          ref={pRef}
          onMouseUp={handleUnderline}
          className="w-full border border-gray-200 rounded-md p-3 shadow-sm cursor-text focus-within:ring-4 focus-within:ring-blue-400 min-h-[60px]"
        >
          {renderWithHighlights()}
        </div>
      </div>

      {/* Highlights List */}
      <Reorder.Group
        axis="y"
        values={highlights}
        onReorder={setHighlights}
        className="mb-6"
      >
        <AnimatePresence>
          {highlights.map((h) => (
            <Reorder.Item
              key={h.id}
              value={h}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileDrag={{ scale: 1.05 }}
              className="flex items-center mb-2 bg-gray-50 rounded-md border border-gray-200 p-2 shadow-sm"
            >
              <span className="cursor-grab mr-3 text-gray-400 select-none">
                ⋮⋮
              </span>
              <input
                type="checkbox"
                checked
                readOnly
                className="w-4 h-4 text-blue-500 rounded mr-2"
              />
              <input
                type="text"
                value={h.text}
                readOnly
                className="flex-1 border border-gray-200 rounded-md p-2 bg-white"
              />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Undo */}
      <div className="flex justify-start">
        <button
          onClick={handleUndo}
          disabled={highlights.length === 0}
          className="px-5 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 disabled:opacity-50 transition-all cursor-pointer"
        >
          Undo
        </button>
      </div>

      {/* Display saved data JSON */}
      {/* {savedData && (
        <pre className="mt-6 p-4 bg-gray-100 rounded-md text-sm whitespace-pre-wrap break-words max-w-full">
          {JSON.stringify(savedData, null, 2)}
        </pre>
      )} */}
    </motion.div>
  );
}

export default function App({ parentId }) {
  const [questions, setQuestions] = useState([1]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, prev.length + 1]);
  };

  const deleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex w-full">
      <div className="min-h-[70vh]  flex flex-col items-center p-6 w-[98%]">
        {questions.map((qNum, index) => (
          <QuestionCard
            key={qNum}
            questionNumber={qNum}
            onDelete={() => deleteQuestion(index)}
            showDelete={questions.length > 1}
            parentId={parentId}
          />
        ))}
      </div>
      <div className="relative">
        <button
          onClick={addQuestion}
          className="w-[35px] h-[35px] text-2xl relative top-12 right-4 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white p-4 rounded-full shadow-md transition-all duration-300 cursor-pointer text-center"
          aria-label="Add question"
        >
          +
        </button>
      </div>
    </div>
  );
}
