import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from "./pages/LandingPage";
import AuthSlider from "./components/AuthSlider";
import Home from "./pages/Home";
import TextEditor from "./components/TextEditor";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthSlider />} />
        <Route path="/main" element={<Home />} />
        <Route path="/text-editor/:documentId" element={<TextEditor />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
