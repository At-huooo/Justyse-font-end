import React, { useState } from 'react';
import { FiMenu } from "react-icons/fi";
import { TiHome } from "react-icons/ti";
import userimg from '../../assets/funny.png';
import { FaServer, FaList } from "react-icons/fa";
import { RiTerminalBoxFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import './Navbarstyle.css';
import { SiRedhatopenshift } from 'react-icons/si';
import { Outlet, Link } from "react-router-dom";

// Individual Navbar Item Component
function NavbarItem({ icon, label, link, tooltip }) {
  return (
    <li>
      <Link to={link}>
        {icon}
        <span className="nav-item">{label}</span>
      </Link>
      <span className="tooltip">{tooltip}</span>
    </li>
  );
}

// User Info Component
function UserInfo() {
  return (
    <div className="user">
      <img src={userimg} alt="user" className="user-img" />
      <div>
        <p className="bold">Puyol</p>
        <p className="role">Admin</p>
      </div>
    </div>
  );
}

// Logo and Menu Toggle Component
function NavbarHeader({ toggleSidebar }) {
  return (
    <div className="top">
      <div className="logo">
        <span>JUSTYSE.</span>
      </div>
      <FiMenu className="btn" onClick={toggleSidebar} />
    </div>
  );
}

// Main Navbar Component
function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      <NavbarHeader toggleSidebar={toggleSidebar} />
      <UserInfo />
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
          icon={<FaList size={22} />}
          label="Submission"
          link="/submission"
          tooltip="Submission"
        />
        <NavbarItem
          icon={<FaUsers size={22} />}
          label="Users"
          link="/users"
          tooltip="Users"
        />
        <NavbarItem
          icon={<IoLogOut size={22} />}
          label="Log out"
          link="/logout"
          tooltip="Log out"
        />
      </ul>
    </div>
  );
}

export default Navbar;
