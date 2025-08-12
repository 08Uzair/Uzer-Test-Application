import "./App.css";
import Auth from "./components/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionForm from "./components/QuestionForm";
import Test from "./components/Test";
import Dashboard from "./components/Dashboard";
import TestPortal from "./components/TestPortal";
function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test-editor/:id" element={<QuestionForm />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="/testPortal" element={<TestPortal />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
