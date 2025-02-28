import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthSlider from "./components/AuthSlider";
import Home from "./pages/Home";
import TextEditor from "./components/TextEditor";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthSlider />} />
      <Route path="/main" element={<Home />} />
      <Route path="/text-editor" element={<TextEditor />} />
    </Routes>
  );
}

export default App;
