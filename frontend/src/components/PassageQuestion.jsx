import React, { useState } from "react";
import useLocalStorage from "../../utility/useLocalStorage";
import { useDispatch } from "react-redux";
import { createPassageQuestion } from "../redux/actions/passageQuestion";

export default function PassageQuestionBuilder({ parentId }) {
  const [profile] = useLocalStorage("profile", null);
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([
    {
      userId: profile?.result?._id,
      parentId: parentId,
      passage: "",
      points: "",
      subQuestions: [
        {
          question: "",
          options: [{ text: "", isCorrect: false }],
        },
      ],
    },
  ]);
  const [savedData, setSavedData] = useState({});

  const addMainQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        userId: profile?.result?._id,
        passage: "",
        points: "",
        subQuestions: [
          { question: "", options: [{ text: "", isCorrect: false }] },
        ],
      },
    ]);
  };

  const deleteMainQuestion = (mainIndex) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== mainIndex));
    setSavedData((prev) => {
      const copy = { ...prev };
      delete copy[mainIndex];
      return copy;
    });
  };

  const addSubQuestion = (mainIndex) => {
    const updated = [...questions];
    updated[mainIndex].subQuestions.push({
      question: "",
      options: [{ text: "", isCorrect: false }],
    });
    setQuestions(updated);
  };

  const deleteSubQuestion = (mainIndex, subIndex) => {
    const updated = [...questions];
    updated[mainIndex].subQuestions.splice(subIndex, 1);
    setQuestions(updated);
  };

  const updateField = (mainIndex, field, value) => {
    const updated = [...questions];
    updated[mainIndex][field] = value;
    setQuestions(updated);
  };

  const updateSubQuestionField = (mainIndex, subIndex, field, value) => {
    const updated = [...questions];
    updated[mainIndex].subQuestions[subIndex][field] = value;
    setQuestions(updated);
  };

  const updateOptionText = (mainIndex, subIndex, optIndex, value) => {
    const updated = [...questions];
    updated[mainIndex].subQuestions[subIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const addOption = (mainIndex, subIndex) => {
    const updated = [...questions];
    updated[mainIndex].subQuestions[subIndex].options.push({
      text: "",
      isCorrect: false,
    });
    setQuestions(updated);
  };

  const toggleCorrectOption = (mainIndex, subIndex, optIndex) => {
    const updated = [...questions];
    const options = updated[mainIndex].subQuestions[subIndex].options;

    options.forEach((opt, i) => {
      opt.isCorrect = i === optIndex;
    });

    setQuestions(updated);
  };

  const handleSave = async (mainIndex) => {
    const mainQ = questions[mainIndex];

    const data = {
      userId: profile?.result?._id,
       parentId: parentId,
      passage: mainQ.passage,
      points: mainQ.points,
      subQuestions: mainQ.subQuestions.map((subQ) => ({
        question: subQ.question,
        options: subQ.options,
      })),
    };

    setSavedData((prev) => ({
      ...prev,
      [mainIndex]: data,
    }));
    try {
      await dispatch(createPassageQuestion(data));
    } catch (error) {
      console.log(error);
    }
    console.log("Saved data for Q" + (mainIndex + 1), data);
  };

  return (
    <div className="flex w-full ">
      <div className="p-8 w-[98%] mx-auto">
        {questions.map((q, mainIndex) => (
          <div
            key={mainIndex}
            className="bg-white rounded-2xl shadow-md border-2 border-gray-300 mb-8 transition-all duration-300 hover:shadow-lg w-full"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 rounded-t-2xl">
              <h1 className="text-xl font-semibold text-gray-800">
                Q{mainIndex + 1}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(mainIndex)}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all cursor-pointer"
                >
                  Save
                </button>
                <button className="px-5 py-2 border border-blue-500 text-blue-500 rounded-md shadow hover:bg-blue-50 transition-all cursor-pointer">
                  Save & Proceed
                </button>
                {questions.length > 1 && (
                  <button
                    onClick={() => deleteMainQuestion(mainIndex)}
                    className="px-5 py-2 border border-red-500 text-red-500 rounded-md shadow hover:bg-red-50 transition-all cursor-pointer"
                  >
                    Delete Question
                  </button>
                )}
              </div>
            </div>

            {/* Passage and Points */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-6">
                <div className="w-[80%]">
                  <label className="block font-medium text-gray-600 mb-2">
                    Passage
                  </label>
                  <textarea
                    value={q.passage}
                    onChange={(e) =>
                      updateField(mainIndex, "passage", e.target.value)
                    }
                    placeholder="Type passage here..."
                    className="w-full p-3 border-l-4 border-blue-500  bg-gray-50 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    rows={10}
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-600 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    placeholder="Points"
                    value={q.points}
                    onChange={(e) =>
                      updateField(mainIndex, "points", e.target.value)
                    }
                    className="w-[100px] h-[50px] text-center border border-gray-300 rounded-lg shadow-sm px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Sub Questions */}
              {q.subQuestions.map((subQ, subIndex) => (
                <div
                  key={subIndex}
                  className="bg-white p-4 rounded-xl border border-gray-200 mb-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">
                      Question {mainIndex + 1}.{subIndex + 1}
                    </h3>
                    {q.subQuestions.length > 1 && (
                      <button
                        onClick={() => deleteSubQuestion(mainIndex, subIndex)}
                        className="px-5 py-2 border border-red-500 text-red-500 rounded-md shadow hover:bg-red-50 transition-all cursor-pointer"
                      >
                        Delete Sub-Question
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={subQ.question}
                    onChange={(e) =>
                      updateSubQuestionField(
                        mainIndex,
                        subIndex,
                        "question",
                        e.target.value
                      )
                    }
                    placeholder="Enter question..."
                    className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {/* Options */}
                  {subQ.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex items-center gap-2 mb-2"
                    >
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) =>
                          updateOptionText(
                            mainIndex,
                            subIndex,
                            optIndex,
                            e.target.value
                          )
                        }
                        placeholder="Option (Optional)"
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          toggleCorrectOption(mainIndex, subIndex, optIndex)
                        }
                        className={`px-3 py-2 rounded-md shadow transition-all ${
                          opt.isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        aria-label={`Mark option ${optIndex + 1} as correct`}
                      >
                        {opt.isCorrect ? "Correct" : "Mark Correct"}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addOption(mainIndex, subIndex)}
                    className="px-3 py-2 border-2 border-green-500 text-green-500 rounded-md shadow hover:bg-green-50 cursor-pointer transition-all"
                  >
                    + Add Option
                  </button>
                </div>
              ))}

              <div className="mt-3">
                <button
                  onClick={() => addSubQuestion(mainIndex)}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  + Add Sub Question
                </button>
              </div>
            </div>

            {/* {savedData[mainIndex] && (
              <pre className="mt-6 p-4 bg-gray-100 rounded-md text-sm whitespace-pre-wrap break-words max-w-full">
                {JSON.stringify(savedData[mainIndex], null, 2)}
              </pre>
            )} */}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={addMainQuestion}
          aria-label="Add main question"
          className="w-[35px] h-[35px] text-2xl relative top-10 right-4 flex items-center justify-center bg-blue-500 hover:bg-blue-700  text-white p-4 rounded-full shadow-md transition-all duration-300 cursor-pointer text-center "
        >
          +
        </button>
      </div>
    </div>
  );
}
