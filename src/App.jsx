import React, { useEffect } from "react";
import Navbar from "./components/NavBar/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Judges from "./pages/Judges";
import Problems from "./pages/Problems";
import Users from "./pages/Users";
import Submission from "./pages/Submission";
import Submit from "./pages/ShowProblem";
import ProblemConfig from "./pages/ProblemConfig";
import Logout from "./pages/Logout";
import Result from "./pages/JudgeRes";
import Send from "./pages/Send";

export default function () {
  let token = localStorage.getItem("token");
  const apiUrl = "http://192.168.146.241:8000";
  localStorage.setItem("apiUrl", apiUrl);

  return (
    <Router>
      <div className="App">
        {token && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/judges" element={<Judges />} />
          <Route path="/problems" element={<Problems />} />
          <Route
            path="/problems/config/:problemId"
            element={<ProblemConfig />}
          />
          <Route
            path="/submission/:problemName/:problemId"
            element={<Submission />}
          />
          <Route path="/problems/:problemId" element={<Submit />} />
          <Route path="/problems/:problemId/submit" element={<Send />} />
          <Route path="/problems/:problemId/submit/:queueID" element={<Result />} />
          <Route path="/users/:userId" element={<Users />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

