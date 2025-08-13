import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategoryQuestion } from "../redux/actions/categoryQuestion";
import useLocalStorage from "../../utility/useLocalStorage";
import { toast } from "react-toastify";
export default function CategoryQuestion({ parentId }) {
  // console.log(parentId, "This is the Child Parent ID");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const emptyQuestion = {
    question: "",
    description: "",
    categories: ["cat 1", "cat 2"],
    items: [
      { name: "ans 1", belongsTo: "cat 1" },
      { name: "ans 2", belongsTo: "cat 2" },
    ],
    points: 0, // added points here
  };
  const [profile] = useLocalStorage("profile", null);
  // console.log(profile?.result?._id);
  const [questions, setQuestions] = useState([
    JSON.parse(JSON.stringify(emptyQuestion)),
  ]);
  const [savedData, setSavedData] = useState(null);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        ...JSON.parse(JSON.stringify(emptyQuestion)),
        categories: ["cat 1", "cat 2"],
        items: [],
        points: 0,
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionField = (qIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, [field]: field === "points" ? Number(value) : value }
          : q
      )
    );
  };

  const updateCategories = (qIndex, newCategories) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              categories: Array.isArray(newCategories) ? newCategories : [],
            }
          : q
      )
    );
  };

  const updateItems = (qIndex, newItems) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, items: Array.isArray(newItems) ? newItems : [] }
          : q
      )
    );
  };

  // Save handler for each question
  const handleSaveQuestion = async (qIndex) => {
    setLoading(true);
    const q = questions[qIndex];
    const dataToSave = {
      userID: profile?.result?._id,
      parentId: parentId,
      titleContent: q.question,
      points: q.points || 0,
      categories: q.categories,
      answers: q.items.map(({ name, belongsTo }) => ({
        text: name,
        belongsTo,
      })),
    };
    try {
      await dispatch(createCategoryQuestion(dataToSave));
      setLoading(false);
      toast.success("Question Added Successfully");
    } catch (error) {
      console.log(error);
    }
    setSavedData(dataToSave);
    // console.log("Saved Data:", dataToSave);
  };

  return (
    <div className="p-4 w-full flex justify-center">
      <div className="w-full">
        {questions.map((questionData, qIndex) => (
          <div
            key={qIndex}
            className="p-6 m-4 bg-white rounded-2xl shadow-lg border-2 border-gray-300 transition-all duration-300 animate-fadeIn"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-gray-800">
                Q{qIndex + 1}
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSaveQuestion(qIndex)}
                  className="px-5 py-2 border border-blue-500 text-blue-500 rounded-md shadow hover:bg-blue-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Save Category Question No {qIndex + 1}</>
                  )}
                </button>

                {questions.length > 1 && (
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="cursor-pointer border border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300 px-5 py-2 rounded-lg shadow-md cursor-pointer"
                  >
                    Delete Question
                  </button>
                )}
              </div>
            </div>

            {/* Question Inputs */}
            <div className="border-l-4 border-blue-500  bg-gray-50 p-5 rounded-xl mb-6 shadow-sm">
              <input
                type="text"
                placeholder="Question"
                value={questionData.question}
                onChange={(e) =>
                  updateQuestionField(qIndex, "question", e.target.value)
                }
                className="w-full mb-3 border-b border-gray-300 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-lg font-medium outline-none"
              />

              <input
                type="text"
                placeholder="Description (Optional)"
                value={questionData.description}
                onChange={(e) =>
                  updateQuestionField(qIndex, "description", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
              />
            </div>

            <div className="w-full flex  justify-between">
              {/* Categories Section */}
              <CategorySection
                categories={
                  Array.isArray(questionData.categories)
                    ? questionData.categories
                    : []
                }
                setCategories={(newCats) => updateCategories(qIndex, newCats)}
                items={
                  Array.isArray(questionData.items) ? questionData.items : []
                }
                setItems={(newItems) => updateItems(qIndex, newItems)}
              />
              {/* Points input */}
              <div className="mb-6">
                <input
                  type="number"
                  placeholder="Points"
                  min="0"
                  value={questionData.points || ""}
                  onChange={(e) =>
                    updateQuestionField(qIndex, "points", e.target.value)
                  }
                  className="w-[100px] h-[50px] text-center border border-gray-300 rounded-lg shadow-sm px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}

        {/* Animations */}
        <style>
          {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}
        </style>

        {/* Display saved data */}
        {/* {savedData && (
          <pre className="mt-8 p-4 bg-gray-100 rounded-md text-sm whitespace-pre-wrap">
            {JSON.stringify(savedData, null, 2)}
          </pre>
        )} */}
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleAddQuestion}
          className="w-[35px] h-[35px] text-2xl relative top-6 flex items-center justify-center bg-blue-500 hover:bg-blue-700  text-white p-4 rounded-full shadow-md transition-all duration-300 cursor-pointer text-center "
        >
          +
        </button>
      </div>
    </div>
  );
}

function CategorySection({
  categories = [],
  setCategories,
  items = [],
  setItems,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleRemoveCategory = (index) => {
    const removedCategory = categories[index];
    const updatedCategories = categories.filter((_, i) => i !== index);
    const updatedItems = items.filter((it) => it.belongsTo !== removedCategory);
    setCategories(updatedCategories);
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() && categories.length > 0) {
      setItems([...items, { name: newItem.trim(), belongsTo: categories[0] }]);
      setNewItem("");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index !== dragIndex) setDragOverIndex(index);
  };
  const handleDrop = (index) => {
    if (dragIndex === null) return;
    const updatedItems = [...items];
    const draggedItem = updatedItems.splice(dragIndex, 1)[0];
    updatedItems.splice(index, 0, draggedItem);
    setItems(updatedItems);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Categories</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-4 py-2 shadow-sm animate-fadeIn"
            >
              <span className="text-gray-700">{cat}</span>
              <button
                onClick={() => handleRemoveCategory(index)}
                className="cursor-pointer ml-2 text-gray-500 hover:text-red-500 transition-all duration-200"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-60 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
          />
          <button
            onClick={handleAddCategory}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Add
          </button>
        </div>

        {/* Items */}
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Items</h2>
        {items.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            className={`flex gap-3 items-center w-full max-w-2xl mb-3 border border-gray-300 rounded-xl p-3 bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md animate-fadeIn
            ${index === dragIndex ? "scale-105 border-blue-400 shadow-lg" : ""}
            ${index === dragOverIndex ? "bg-blue-50 scale-[1.02]" : ""}
          `}
            style={{ transition: "all 0.2s ease" }}
          >
            <div
              className="cursor-grab p-2 text-gray-400 hover:text-gray-600"
              title="Drag to reorder"
            >
              ⋮⋮
            </div>

            <input
              type="text"
              value={item.name}
              onChange={(e) =>
                setItems(
                  items.map((it, i) =>
                    i === index ? { ...it, name: e.target.value } : it
                  )
                )
              }
              className="border border-gray-300 rounded-lg px-4 py-2 flex-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
            />
            <select
              value={item.belongsTo}
              onChange={(e) =>
                setItems(
                  items.map((it, i) =>
                    i === index ? { ...it, belongsTo: e.target.value } : it
                  )
                )
              }
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleRemoveItem(index)}
              className="cursor-pointer text-gray-500 hover:text-red-500 transition-all duration-200"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-60 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-300"
          />
          <button
            onClick={handleAddItem}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Add
          </button>
        </div>
      </div>
      <div>
        {/* Points field removed here because we moved it inside each question */}
      </div>
    </div>
  );
}
