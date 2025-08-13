import "./App.css";
import Auth from "./components/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuestionForm from "./components/QuestionForm";
import Test from "./components/Test";
import Dashboard from "./components/Dashboard";
import TestPortal from "./components/TestPortal";
import useAuthenticated from "../utility/useAuthenticate";
import Footer from "./components/Footer";
function App() {
  const { isAuthenticated } = useAuthenticated();
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={!isAuthenticated ? <Auth /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
          />
          <Route
            path="/test-editor/:id"
            element={
              isAuthenticated ? <QuestionForm /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/test/:id"
            element={isAuthenticated ? <Test /> : <Navigate to="/auth" />}
          />
          <Route
            path="/testPortal"
            element={isAuthenticated ? <TestPortal /> : <Navigate to="/auth" />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
