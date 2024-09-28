import React from "react";
import Login from "../components/Login/Login";
import MainPage from "../components/MainPage/MainPage";

function Home() {
  const token = localStorage.getItem("token");
  return (
    <div className="container">
      {token ? <MainPage /> : <Login />}
    </div>
  );
}

export default Home;
