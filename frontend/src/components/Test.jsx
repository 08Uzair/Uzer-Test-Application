import React, { useEffect, useRef, useState } from "react";
import CategoryAnswer from "./answers/CategoryAnswer";
import ClozeAnswer from "./answers/ClozeAnswer";
import PassageAnswer from "./answers/PassageAnswer";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getTestByID } from "../redux/actions/test";
import { formatDate } from "../../utility/formatedDate";
import { Clock, Info, AlertTriangle, Timer } from "lucide-react";
import { motion } from "framer-motion";

const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
      <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2 text-blue-600">
        <Info className="w-5 h-5" /> Notification
      </h2>
      <p className="text-gray-700">{message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
        onClick={onClose}
      >
        OK
      </button>
    </div>
  </div>
);

const Test = () => {
  const categoryRef = useRef(null);
  const clozeRef = useRef(null);
  const passageRef = useRef(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const questionData = useSelector((state) => state?.test?.singletest);

  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");

  // Fetch test data
  useEffect(() => {
    if (id) {
      dispatch(getTestByID(id));
    }
  }, [dispatch, id]);

  // Set dummy dynamic time after questionData is loaded
  useEffect(() => {
    if (questionData) {
      const durationMinutes = 20; // ⏳ dummy value, replace with questionData.duration
      const seconds = durationMinutes * 60;
      setTotalTime(seconds);
      setTimeLeft(seconds);
    }
  }, [questionData]);

  // Timer & popup notifications
  useEffect(() => {
    if (totalTime === 0) return;

    if (timeLeft <= 0) {
      setPopupMessage("Time is up! Submitting your test...");
      handleSubmit();
      setTimeout(() => navigate("/dashboard"), 10000);
      return;
    }

    if (timeLeft === Math.floor(totalTime / 2)) {
      setPopupMessage("You are halfway through your test!");
    }
    if (timeLeft === 5 * 60) {
      setPopupMessage("Only 5 minutes remaining!");
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, totalTime, navigate]);

  // Warn before leaving/reloading
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "You will exit the test if you reload or leave. Are you sure?";
    };

    const handleUnloadDecision = (e) => {
      const confirmLeave = window.confirm(
        "You will exit the test if you leave.\nClick 'OK' to go to Dashboard, or 'Cancel' to stay."
      );
      if (confirmLeave) {
        navigate("/dashboard");
      } else {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnloadDecision);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnloadDecision);
    };
  }, [navigate]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = () => {
    categoryRef.current?.();
    clozeRef.current?.();
    passageRef.current?.();
  };

  // Clock calculations
  const minutes = Math.floor((timeLeft / 60) % 60);
  const seconds = timeLeft % 60;
  const minuteAngle = (minutes / 60) * 360;
  const secondAngle = (seconds / 60) * 360;

  return (
    <div className="w-full flex text-white gap-4">
      {/* Left Section - Questions */}
      <div className="flex-1 space-y-4">
        <CategoryAnswer registerSubmit={(fn) => (categoryRef.current = fn)} />
        <ClozeAnswer registerSubmit={(fn) => (clozeRef.current = fn)} />
        <PassageAnswer registerSubmit={(fn) => (passageRef.current = fn)} />

        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 m-4 cursor-pointer rounded-lg shadow-md transition bg-blue-600 hover:bg-blue-500 flex items-center gap-2"
        >
          <AlertTriangle className="w-5 h-5" /> SUBMIT ALL
        </button>
      </div>

      {/* Right Section - Sidebar */}
      <div className="w-72 sticky top-4 p-4 bg-white text-black rounded-2xl shadow-xl border border-gray-200 h-fit">
        {/* Analog Clock Timer */}
        <div className="flex flex-col items-center p-4 mb-4 rounded-xl shadow-inner bg-gradient-to-br from-gray-100 to-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Time Left
          </h3>

          <div className="relative w-40 h-40 rounded-full shadow-lg bg-white flex items-center justify-center">
            {/* Progress Ring */}
            <svg
              className="absolute -rotate-90"
              width="160"
              height="160"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={(1 - timeLeft / totalTime) * 2 * Math.PI * 70}
                strokeLinecap="round"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>

            {/* Clock Hands */}
            <motion.div
              className="absolute top-[32px] w-1 h-12 bg-blue-500 origin-bottom"
              style={{ rotate: `${minuteAngle}deg` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
            <motion.div
              className="absolute top-[20px] w-0.5 h-15 bg-red-500 origin-bottom"
              style={{ rotate: `${secondAngle}deg` }}
              transition={{ type: "spring", stiffness: 120 }}
            />

            {/* Center Dot */}
            <div className="absolute w-4 h-4 bg-black rounded-full shadow-md" />
          </div>

          {/* Digital Time */}
          <div className="mt-4 text-2xl font-bold text-red-500">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Test Details */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Timer className="w-5 h-5 text-green-600" /> Test Details
          </h3>
          <p className="p-2 bg-gray-50 rounded-lg shadow-sm">
            <strong>Title : </strong> {questionData?.title || "—"}
          </p>
          <p className="p-2 bg-gray-50 rounded-lg shadow-sm">
            <strong>Description : </strong> {questionData?.description || "—"}
          </p>
          <p className="p-2 bg-gray-50 rounded-lg shadow-sm">
            <strong>Points : </strong> {questionData?.points || 0}
          </p>
          <p className="p-2 bg-gray-50 rounded-lg shadow-sm">
            <strong>Created : </strong>{" "}
            {questionData?.createdAt
              ? formatDate(questionData?.createdAt)
              : "—"}
          </p>
        </div>
      </div>

      {/* Popup Notification */}
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      )}
    </div>
  );
};

export default Test;
