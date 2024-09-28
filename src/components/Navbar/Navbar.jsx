import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { TiHome } from "react-icons/ti";
import userimg from "../../assets/funny.png";
import { FaServer, FaList } from "react-icons/fa";
import { RiTerminalBoxFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import icon from "../../assets/JustyseLogo.png";
import "./NavBar.css";
import { Link } from "react-router-dom";

// Main Navbar Component
function Navbar() {
  const [open, setOpen] = useState(false);

  const userName = localStorage.getItem("username");
  const userRole = localStorage.getItem("roles");
  const [userPanel, setUserPanel] = useState(false);
  const userId = localStorage.getItem("userId");

  // Individual Navbar Item Component
  function NavbarItem({ icon, label, link, tooltip }) {
    return (
      <Link to={link}>
        <li id={label}>
          {icon}
          <span className="nav-item">{label}</span>
          <span className="tooltip">{tooltip}</span>
        </li>
      </Link>
    );
  }

  // User Info Component
  // function UserInfo() {
  //   return (
  //     <div
  //       className="user"
  //       onClick={() => {
  //         setUserPanel(!userPanel);
  //         localStorage.setItem("userPanel", userPanel);
  //       }}
  //     >
  //       <img src={userimg} alt="user" className="user-img" />
  //       <div>
  //         <p className="bold">{userName}</p>
  //         {Array.isArray(userRole) && (
  //           <div className="roleHolder">
  //             {userRole.map((role) => (
  //               <p className="role" key={role}>
  //                 {role}
  //               </p>
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // Logo and Menu Toggle Component
  function NavbarHeader({ toggleSidebar }) {
    return (
      <div className="top">
        <div className="logo">
          <img src={icon} className="logoicon" />
          <span>USTYSE.</span>
        </div>
        <FiMenu className="btn" onClick={toggleSidebar} />
      </div>
    );
  }

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      <NavbarHeader toggleSidebar={toggleSidebar} />
      <Link to={`users/${userId}`}>
        <div
          className="user"
          onClick={() => {
            setUserPanel(!userPanel);
            localStorage.setItem("userPanel", userPanel);
          }}
        >
          <img src={userimg} alt="user" className="user-img" />
          <div>
            <p className="bold">{userName}</p>
            {Array.isArray(userRole) && (
              <div className="roleHolder">
                {userRole.map((role) => (
                  <p className="role" key={role}>
                    {role}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
      <ul>
        <NavbarItem
          icon={<TiHome size={25} />}
          label="Homepage"
          link="/"
          tooltip="Homepage"
        />
        <NavbarItem
          icon={<FaServer size={23} />}
          label="Judges"
          link="/judges"
          tooltip="Judges"
        />
        <NavbarItem
          icon={<RiTerminalBoxFill size={23} />}
          label="Problems"
          link="/problems"
          tooltip="Problems"
        />
        <NavbarItem
          icon={<FaList size={20} />}
          label="Submission"
          link="/submission/@all/All"
          tooltip="Submission"
        />
        <NavbarItem
          icon={<FaUsers size={22} />}
          label="Users"
          link={`/users/${userId}`}
          tooltip="Users"
        />
        <div className="logout">
          <NavbarItem
            icon={<IoLogOut size={22} />}
            label="Log out"
            link="/logout"
            tooltip="Log out"
          />
        </div>
      </ul>
    </div>
  );
}

export default Navbar;
