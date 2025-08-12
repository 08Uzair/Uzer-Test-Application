import React from "react";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className=" bg-[#f7f8fc] min-h-screen flex flex-col items-center font-sans">
      {/* Navbar */}
      <nav className="w-full max-w-7xl flex justify-between items-center py-5 px-6">
        <h1 className="text-[#4a3aff] font-extrabold text-2xl tracking-tight">
          UZER QUIZ APP
        </h1>
        {/* <div className="hidden md:flex gap-8 text-gray-600">
          <a href="#" className="hover:text-[#4a3aff]">
            Features
          </a>
          <a href="#" className="hover:text-[#4a3aff]">
            Pricing
          </a>
          <a href="#" className="hover:text-[#4a3aff]">
            Schools
          </a>
          <a href="#" className="hover:text-[#4a3aff]">
            Business
          </a>
        </div> */}
        <div className="flex gap-3">
          <button className="border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-100 cursor-pointer">
            Login
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#4a3aff] text-white rounded-full px-5 py-2 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl flex flex-col md:flex-row items-center px-6 py-16 md:py-24 gap-12 relative">
        {/* Left */}
        <div className="flex-1 z-10">
          <p className="text-sm font-medium text-[#4a3aff] bg-[#eae8ff] w-fit px-3 py-1 rounded-full mb-4">
            "Create Quizzes That Captivate and Challenge"
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Build Tests & Forms in Minutes
          </h1>
          <p className="mt-5 text-gray-600 leading-relaxed max-w-md">
            Easily create interactive tests, quizzes, and feedback forms without
            any technical skills. Perfect for teachers, recruiters, and business
            owners.
          </p>
          <p className="mt-2 text-sm rounded-lg  text-gray-500 border-2 p-2 w-md border-gray-200">
            Design multiple-choice, short answer, and rating forms with ease.
            <br />
            Loved by 4,000+ users for its speed and simplicity
          </p>
          <p className="mt-2 text-gray-500">Quick · Simple · Works Anywhere</p>

          <div className="flex items-center mt-2 text-yellow-400 text-lg">
            {"★".repeat(5)}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#4a3aff] text-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              Get started for free
            </button>
            <button className="text-[#4a3aff] font-semibold hover:underline cursor-pointer">
              Learn more
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 relative flex justify-center items-center z-10">
          {/* Blob background */}
          <div className="absolute w-[700px] h-[400px] bg-gradient-to-tr from-[#dcd6ff] to-[#b7aaff] rounded-full blur-2xl  animate-pulse"></div>

          {/* Main Card */}
          <div className="relative bg-white rounded-2xl w-[340px] p-6 border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300 z-10">
            {/* Header */}
            <h3 className="text-[#4a3aff] font-semibold text-lg mb-4">
              New Test Form
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5 border-l-4 border-[#4a3aff]/30 pl-3 bg-[#f9f8ff] rounded">
              Create a customized test to assess knowledge, skills, or gather
              feedback. Perfect for classrooms, recruitment, or business
              training sessions.
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-3 text-sm mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                <p className="text-gray-500 text-xs">Type</p>
                <p className="font-semibold">Multiple Choice</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                <p className="text-gray-500 text-xs">Purpose</p>
                <p className="font-semibold">Assessment</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                <p className="text-gray-500 text-xs">Language</p>
                <p className="font-semibold">English</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-gradient-to-r from-[#4a3aff] to-[#7b6cff] text-white py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 font-medium cursor-pointer">
              Add Question
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
