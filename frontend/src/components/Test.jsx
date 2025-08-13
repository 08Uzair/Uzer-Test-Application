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
import { getAllQuestion } from "../redux/actions/question";

// Popup component for notifications
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
  const containerRef = useRef(null);
  const categoryRef = useRef(null);
  const clozeRef = useRef(null);
  const passageRef = useRef(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const questionData = useSelector((state) => state?.test?.singletest);
  const allQuestionsData = useSelector((state) => state?.question?.allQuestion);
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");

  // Enter Fullscreen when test starts
  useEffect(() => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          console.warn("Fullscreen mode failed");
        });
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    }
  }, []);

  // Detect fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        setPopupMessage("You exited fullscreen. The test will now end.");
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [navigate]);

  // Warn on refresh/back/tab switch
  useEffect(() => {
    setPopupMessage(
      "IMPORTANT: Do NOT switch tabs or refresh the page. Doing so will end your test automatically."
    );

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "You will exit the test if you reload or leave. Are you sure?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handlePopState = () => {
      const confirmed = window.confirm(
        "You will lose your test progress if you leave. Are you sure?"
      );
      if (!confirmed) {
        window.history.pushState(null, document.title, window.location.href);
      } else {
        navigate("/dashboard");
      }
    };
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPopupMessage("You switched tabs. The test will now close.");
        handleSubmit();
        setTimeout(() => navigate("/dashboard"), 5000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  // Fetch test data
  useEffect(() => {
    if (id) dispatch(getTestByID(id));
  }, [dispatch, id]);

  // Fetch all questions
  useEffect(() => {
    dispatch(getAllQuestion(id));
  }, [dispatch, id]);

  // Set test time
  useEffect(() => {
    if (questionData) {
      const durationMinutes = 6;
      const seconds = durationMinutes * 60;
      setTotalTime(seconds);
      setTimeLeft(seconds);
    }
  }, [questionData]);

  // Timer logic
  useEffect(() => {
    if (totalTime === 0) return;

    if (timeLeft <= 0) {
      setPopupMessage("Time is up! Submitting your test...");
      handleSubmit();
      setTimeout(() => navigate("/dashboard"), 5000);
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

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = () => {
    categoryRef.current?.();
    clozeRef.current?.();
    passageRef.current?.();
    setTimeout(() => navigate("/dashboard"), 10000);
  };

  const minutes = Math.floor((timeLeft / 60) % 60);
  const seconds = timeLeft % 60;
  const minuteAngle = (minutes / 60) * 360;
  const secondAngle = (seconds / 60) * 360;

  const isDataLoaded =
    allQuestionsData !== null && allQuestionsData !== undefined;

  if (!isDataLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading questions...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen flex text-white gap-4 bg-white overflow-hidden"
    >
      {/* Left: Questions */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
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

      {/* Right: Sidebar */}
      <div className="w-72 sticky top-4 p-4 bg-white text-black rounded-2xl shadow-xl border border-gray-200 h-fit overflow-y-auto">
        <div className="flex flex-col items-center p-4 mb-4 rounded-xl shadow-inner bg-gradient-to-br from-gray-100 to-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Time Left
          </h3>

          <div className="relative w-40 h-40 rounded-full shadow-lg bg-white flex items-center justify-center">
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
            <div className="absolute w-4 h-4 bg-black rounded-full shadow-md" />
          </div>

          <div className="mt-4 text-2xl font-bold text-red-500">
            {formatTime(timeLeft)}
          </div>
        </div>

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

      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      )}
    </div>
  );
};

export default Test;
