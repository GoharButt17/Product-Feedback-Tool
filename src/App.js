import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import FeedbackList from "./pages/FeedbackList";
import FeedbackForm from "./pages/FeedbackForm";
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feedback/list" element={<FeedbackList/>}/>
          <Route path="/feedback/form" element={<FeedbackForm/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
