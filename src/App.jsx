import React from 'react';
import Navbar from './components/NavBar/NavBar';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import Judges from './pages/Judges';
import Problems from './pages/Problems';
import Users from './pages/Users';
import Submission from './pages/Submission';
import Submit from './pages/Submit';
import ProblemCreate from './pages/ProblemCreate';
import ProblemConfig from './pages/ProblemConfig';
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/judges" element={<Judges />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/create" element={<ProblemCreate />} />
          <Route path="/problems/config" element={<ProblemConfig />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/problems/submit" element={<Submit/>} />
          <Route path="/users" element={<Users />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Dummy Components for the routes

function LogoutPage() {
  return <div>Logout Page Content</div>;
}

export default App;
