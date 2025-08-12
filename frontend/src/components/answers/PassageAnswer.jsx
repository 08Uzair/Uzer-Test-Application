import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getPassageQuestion } from "../../redux/actions/passageQuestion";
import { useParams } from "react-router-dom";

// Component for a single passage
function PassageItem({ data, index, registerSubmit }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});

  const handleSelect = (qIdx, optIdx) => {
    if (!submitted) {
      setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    }
  };

  const handleSubmit = () => {
    let tempResults = {};
    data.subQuestions.forEach((q, qIdx) => {
      const selectedIdx = selectedAnswers[qIdx];
      if (selectedIdx !== undefined) {
        tempResults[qIdx] = q.options[selectedIdx].isCorrect;
      } else {
        tempResults[qIdx] = false;
      }
    });
    setResults(tempResults);
    setSubmitted(true);
  };

  useEffect(() => {
    // Register this passage's submit handler with the parent
    registerSubmit?.(handleSubmit);
  }, [registerSubmit]);

  return (
    <div className="w-[98%] mx-auto border-l-4 border-blue-500 shadow-lg p-4 rounded-lg mb-[1rem]">
      {/* Passage */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className=" border-2 border-gray-200 bg-gray-50 p-6 rounded-2xl shadow-md mb-6"
      >
        <h2 className="text-lg text-black font-semibold mb-2">
          Passage {index + 1}
        </h2>
        <p className="text-gray-800 leading-relaxed">{data.passage}</p>
      </motion.div>

      {/* Sub-Questions */}
      {data.subQuestions.map((subQ, idx) => {
        const isCorrect = results[idx] === true;
        const isWrong =
          results[idx] === false &&
          submitted &&
          selectedAnswers[idx] !== undefined;

        return (
          <motion.div
            key={subQ._id || idx}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="border border-gray-200 bg-white rounded-2xl shadow-md overflow-hidden mb-4"
          >
            {/* Question Header */}
            <button
              className={`w-full text-left px-5 py-4 flex justify-between items-center transition-colors 
                ${
                  isCorrect && submitted
                    ? "bg-green-100 hover:bg-green-200"
                    : isWrong && submitted
                    ? "bg-red-100 hover:bg-red-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span className="font-semibold text-gray-800">
                {`${idx + 1}. ${subQ.question}`}
              </span>
              <span className="text-gray-500 text-xl font-bold">
                {openIndex === idx ? "−" : "+"}
              </span>
            </button>

            {/* Options */}
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 py-4 space-y-3 text-black"
                >
                  {subQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[idx] === optIdx;
                    const isOptCorrect = results[idx] && isSelected;
                    const isOptIncorrect =
                      submitted && isSelected && !isOptCorrect;

                    return (
                      <label
                        key={opt._id || optIdx}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          isOptCorrect
                            ? "bg-green-100 border-green-400"
                            : isOptIncorrect
                            ? "bg-red-100 border-red-400"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}-${idx}`}
                          className="h-4 w-4 text-blue-500"
                          disabled={submitted}
                          checked={isSelected}
                          onChange={() => handleSelect(idx, optIdx)}
                        />
                        <span className="flex-1">{opt.text}</span>
                        {submitted && isOptCorrect && <span>✅</span>}
                        {submitted && isOptIncorrect && <span>❌</span>}
                      </label>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// Parent component for multiple passages
export default function PassageAnswerList({ registerSubmit }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const passageData = useSelector(
    (state) => state?.passageQuestion?.passageQuestion?.passages || []
  );

  const submitFns = useRef([]);

  useEffect(() => {
    dispatch(getPassageQuestion());
  }, [dispatch]);

  useEffect(() => {
    registerSubmit?.(() => {
      submitFns.current.forEach((fn) => fn && fn());
    });
  }, [registerSubmit]);

  // Filter passages by parentId matching params.id
  const filteredPassages = passageData.filter(
    (passage) => passage.parentId === id
  );

  return (
    <div>
      {filteredPassages.map((passage, idx) => (
        <PassageItem
          key={passage._id}
          data={passage}
          index={idx}
          registerSubmit={(fn) => {
            submitFns.current[idx] = fn;
          }}
        />
      ))}
    </div>
  );
}
