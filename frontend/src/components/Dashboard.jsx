import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useLocalStorage from "../../utility/useLocalStorage";
import { addTest, deleteTest, getTest } from "../redux/actions/test";

export default function Dashboard() {
  const [profile] = useLocalStorage("profile", null);
  const [activeTab, setActiveTab] = useState("Quiz");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    userID: profile?.result?._id,
    title: "",
    description: "",
    points: "",
  });

  const testData = useSelector((state) => state?.test?.test?.test || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addTest(formData));
      await dispatch(getTest());
    } catch (error) {
      console.log(error);
    }
    setIsModalOpen(false);
    setFormData({ title: "", description: "", points: "" });
  };

  useEffect(() => {
    dispatch(getTest());
  }, [dispatch]);

  useEffect(() => {
    setData(testData);
  }, [testData]);

  // ✅ Safe filtering to avoid undefined errors
  const filteredData = data.filter((test) => {
    const title = test?.title?.toLowerCase() || "";
    const description = test?.description?.toLowerCase() || "";
    const query = search.trim().toLowerCase();
    return title.includes(query) || description.includes(query);
  });

  const handleDelete = async (id) => {
    setData((prev) => prev.filter((item) => item._id !== id));
    try {
      await dispatch(deleteTest(id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          My Tests
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {["Quiz", "Assignments", "Reports"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Test Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="border-2 border-dashed border-purple-300 rounded-xl p-6 cursor-pointer bg-white shadow-sm hover:shadow-lg transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-center space-x-3">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-green-500 text-3xl"
            >
              ＋
            </motion.span>
            <div>
              <p className="text-blue-600 font-semibold text-lg">
                Create a New Test
              </p>
              <p className="text-gray-500 text-sm">
                Start building a custom test for your students
              </p>
            </div>
          </div>
        </motion.div>

        {/* Test Cards */}
        {filteredData.map((test, index) => (
          <motion.div
            key={test._id || index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all"
          >
            {/* Delete Icon */}
            <button
              onClick={() => handleDelete(test._id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trash-icon lucide-trash"
              >
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold text-gray-800">
              {test.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{test.description}</p>
            <p className="text-xs text-gray-400 mb-4">
              {test.points} Points • Created on{" "}
              {new Date(test.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => navigate(`/test/${test._id}`)}
              className="px-4 py-1.5 mr-4 bg-blue-500 text-white text-sm rounded-full shadow hover:bg-blue-600 transition"
            >
              Start Test
            </button>
            <button
              onClick={() => navigate(`/test-editor/${test._id}`)}
              className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-full shadow hover:bg-blue-600 transition"
            >
              Add Questions
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Create New Test
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Points
                  </label>
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    required
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
