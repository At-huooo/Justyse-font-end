import React from "react";
import { Link } from "react-router-dom";
import "boxicons";
import "./MainPage.css";

export default function MainPage() {
  const userId = localStorage.getItem("userId");

  return (
    <div className="MainScreen">
      <div className="topBanner">
        <h1>
          <span>J</span>
          <span>u</span>
          <span>s</span>tyse <span>✨</span>
        </h1>
        <p>The all rounded code marking program.</p>
      </div>
      <div className="quickAccess">
        <Link to="./problems" className="Link">
          <div className="ShortcutHolder one">
            <div className="icons">
            <box-icon name='terminal' type='solid' size="38px" color="#0A6847"></box-icon>            </div>
            <h3>Problems</h3>
            <p>Be able to create problems / submit and get codes marked automatically. </p>
          </div>
        </Link>
        <Link to="./submission/@all/All" className="Link">
          <div className="ShortcutHolder two">
            <div className="icons">
            <box-icon name='list-ul' type='solid' size="38px" color="#41644A"></box-icon>            </div>
            <h3>Submission</h3>
            <p>Get real time data of submissions and leaderbroad</p>
          </div>
        </Link>
        <Link to={`./users/${userId}`} className="Link">
          <div className="ShortcutHolder three">
            <div className="icons">
            <box-icon name='user-badge' type='solid' size="38px" color="#75A47F"></box-icon>            </div>
            <h3>Users</h3>
            <p>Create users in patch and modify control abilities</p>
          </div>
        </Link>
        <Link to="./judges" className="Link">
          <div className="ShortcutHolder four">
            <div className="icons">
            <box-icon name='server' type='solid' size="38px" color="#436850"></box-icon>            </div>
            <h3>Judges</h3>
            <p>Get update about server marking process</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
