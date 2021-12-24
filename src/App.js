import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";
import "./App.scss";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Signup />} />
          <Route exact path="/signupWithReferId/:id" element={<Signup />} />
          <Route exact path="/home" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
