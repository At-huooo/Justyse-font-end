import React from 'react';
import Navbar from './components/Navbar/Navbar';
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
import Config_create from './pages/Config_create';
import Item_Config from './pages/Item_Config';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/judges" element={<Judges />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="problems/config_create" element={<Config_create />} />
          <Route path="problems/config" element={<Item_Config />} />
          <Route path="/submission" element={<Submission />} />
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
