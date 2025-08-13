import React, { useState, useRef, useCallback, useEffect } from "react";
import { uploadImageToCloudinary } from "../../utility/uploadToCloudinary";
import { useDispatch } from "react-redux";
import { authSignIn, authSignUp } from "../redux/actions/auth";

const btnStages = [
  "Logging in...",
  "Just 5 sec",
  "You're almost there",
  "Almost done...",
  "Verifying credentials...",
  "Setting things up...",
  "Securing your account...",
  "Just a moment more...",
  "Getting things ready...",
];

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnStageIndex, setBtnStageIndex] = useState(0);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const dispatch = useDispatch();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadAndSetAvatar = async (file) => {
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    const uploadedUrl = await uploadImageToCloudinary(file);
    setUploading(false);
    if (uploadedUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedUrl,
      }));
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadAndSetAvatar(file);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAndSetAvatar(file);
    }
  };

  // Text loader logic
  useEffect(() => {
    let timer;
    if (btnLoading) {
      timer = setInterval(() => {
        setBtnStageIndex((prev) => (prev + 1) % btnStages.length);
      }, 1000);
    } else {
      setBtnStageIndex(0);
    }
    return () => clearInterval(timer);
  }, [btnLoading]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      await dispatch(authSignIn(formData));
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      await dispatch(authSignUp(formData));
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc] px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 animate-fadeIn">
          {isSignUp ? "Create Your Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-500 mt-1 mb-6 animate-fadeIn delay-100">
          {isSignUp
            ? "Sign up to start building quizzes and forms."
            : "Sign in to continue to QuizGecko."}
        </p>

        <form
          className="space-y-4"
          onDragEnter={handleDrag}
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
        >
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.name}
              name="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4a3aff] transition-all duration-300 hover:shadow-md"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            name="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4a3aff] transition-all duration-300 hover:shadow-md"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            name="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4a3aff] transition-all duration-300 hover:shadow-md"
          />

          {isSignUp && (
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${
                dragActive ? "border-[#4a3aff] bg-[#f9f8ff]" : "border-gray-300"
              }`}
            >
              {uploading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-6 h-6 border-4 border-[#4a3aff] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-32 rounded-lg object-cover"
                />
              ) : (
                <p className="text-gray-500">
                  Drag & Drop Profile Image Here or{" "}
                  <span className="text-[#4a3aff] font-medium">Browse</span>
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                name="image"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || btnLoading}
            className={`w-full bg-gradient-to-r from-[#4a3aff] to-[#7b6cff] text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
              uploading || btnLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {btnLoading
              ? btnStages[btnStageIndex]
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#4a3aff] font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
