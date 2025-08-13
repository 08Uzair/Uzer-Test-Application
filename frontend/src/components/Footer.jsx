import React from "react";
import { Github, Linkedin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" bg-white shadow-md rounded-t-2xl border border-gray-200 h-[11vh]">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left side - Text */}
        <p className="text-gray-600 text-sm text-center sm:text-left">
          © {new Date().getFullYear()} Made By{" "}
          <span className="font-semibold text-gray-800">Uzer Qureshi</span>
        </p>

        {/* Right side - Icons */}
        <div className="flex gap-4">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-300 text-gray-700 hover:text-black"
          >
            <Github size={20} strokeWidth={1.8} />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#0a66c2]"
          >
            <Linkedin size={20} strokeWidth={1.8} />
          </a>
          <a
            href="https://yourportfolio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#4a3aff]"
          >
            <Globe size={20} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </footer>
  );
}
