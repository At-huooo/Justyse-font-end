import React, { useState, useEffect } from "react";
import { FiEyeOff } from "react-icons/fi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserBoard.css";
export default function UserBoard() {
  const apiUrl = localStorage.getItem("apiUrl");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // User-related state
  const [users, setUsers] = useState([]);
  const [noDataU, setNoDataU] = useState(false);
  const [tempU, setTempU] = useState([]);
  const [selected, setSelected] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [itemname, setItemname] = useState("");

  // Role-related state
  const [Roles, setRoles] = useState([]);
  const [noDataR, setNoDataR] = useState(false);
  const [addedRoles, setAddedRoles] = useState([]);
  const [popupR, setPopupR] = useState([]);
  const [rolesPopUp, togglePopup] = useState(false);
  const [tempR, setTempR] = useState([]);
  const [perms, setPerms] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchInputSide, setSearchInputSide] = useState("");
  const [mode, setMode] = useState("users");
  const [create, setCreate] = useState(false);
  const [currentUR, setCurrentUR] = useState("users");
  const [batchSelect, setBatchSelect] = useState([]);
  const [Mess, setMess] = useState("");

  const DeleteUR = async () => {
    setLoading(true);
    if (currentUR === "users") {
      try {
        const res = axios.delete(`${apiUrl}/api/user/${selected.id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Delete user", res);
        setMess(`User ${selected.name} deleted`);
        setSelected({});
      } catch (error) {
        setMess(`User ${selected.name} fail to delete`);
        console.log("Delete user", error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUR === "roles") {
      try {
        const res = axios.delete(`${apiUrl}/api/role/${selected.id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Delete role", res);
        setMess(`Role ${selected.name} deleted`);
        setSelected({});
      } catch (error) {
        setMess(`Role ${selected.name} fail to delete`);
        console.log("Delete role", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const sendData = async (item) => {
    setLoading(true);
    if (create && currentUR === "users") {
      try {
        const res = axios.post(
          `${apiUrl}/api/user`,

          {
            name: item.name,
            password: item.password,
            roles: item.roles,
          },
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              // Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Create user", res);
        setCreate(false);
        settingSelected(item);
        setMess(`User ${item.name} created`);
      } catch (error) {
        console.log("Create user", error);
        setMess(`User ${item.name} fail to create`);
      } finally {
        setLoading(false);
      }
    }

    if (create && currentUR === "roles") {
      try {
        const res = axios.post(
          `${apiUrl}/api/role`,
          {
            name: item.name,
            permissions: "perms",
          },
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Create role", res);
        settingSelected(item);
        setCreate(false);
        setMess(`Role ${item.name} created`);
      } catch (error) {
        setMess(`Role ${item.name} fail to create`);
        console.log("Create role", error);
      } finally {
        setLoading(false);
      }
    }

    if (!create && currentUR === "users") {
      try {
        const res = axios.patch(
          `${apiUrl}/api/user/${item.id}`,
          {
            name: item.name,
            roles: item.roles,
          },
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Update user", res);
        settingSelected(item);
        setMess(`User ${item.name} updated`);
      } catch (error) {
        setMess(`User ${item.name} fail to update`);
        console.log("Update user", error);
      } finally {
        setLoading(false);
      }
    }

    if (!create && currentUR === "roles") {
      try {
        const res = axios.patch(
          `${apiUrl}/api/role/${item.id}`,
          {
            name: item.name,
            permissions: "perms",
          },
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Update role", res);
        settingSelected(item);
        setMess(`Role ${item.name} updated`);
      } catch (error) {
        setMess(`Role ${item.name} fail to update`);
        console.log("Update role", error);
      } finally {
        setLoading(false);
      }
    }
    return;
  };

  const getUsersRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/users?keys=id,name,password,roles`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          timeout: 7000,
        }
      );
      if (res.status < 200 || res.status >= 300) {
        throw new Error("Failed to get users");
      }
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      // setNoDataU(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
    setLoading(true);

    try {
      const rep = await axios.get(
        `${apiUrl}/api/roles?keys=id,name,permissions`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          timeout: 7000,
        }
      );
      if (rep.status < 200 || rep.status >= 300) {
        throw new Error("Failed to get roles");
      }
      setRoles(rep.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      // setNoDataR(true);
      setLoading(false);
    } finally {
      setTempR(Roles);
      setTempU(users);
      setLoading(false);
      setPopupR(Roles);
    }
  };

  const searchRolesPopup = (e) => {
    e.preventDefault();
    const filteredRoles = tempR.filter((role) =>
      role.name.toLowerCase().includes(searchInputSide.toLowerCase())
    );
    setPopupR(filteredRoles);

    if (searchInputSide === "") {
      setPopupR(tempR);
    }
  };

  const searchUsers = (e) => {
    e.preventDefault();

    const filteredUsers = tempU.filter((user) =>
      user.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setUsers(filteredUsers);

    if (searchInput === "") {
      setUsers(tempU);
    }
  };

  const searchRoles = (e) => {
    e.preventDefault();
    const filteredRoles = tempR.filter((role) =>
      role.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setRoles(filteredRoles);
    if (searchInput === "") {
      setRoles(tempR);
    }
  };

  const settingSelected = (item) => {
    setItemname(item.name);
    if (item.roles) {
      setPassword(item.password);
      setAddedRoles(item.roles);
    } else if (item.permissions) {
      setPerms(item.permissions);
    }
    setSelected(item);
  };

  useEffect(() => {
    if (token === "") return navigate("/");
    getUsersRoles();

    setRoles([
      {
        name: "admin",
        id: "asda#1",
        permissions: ["hu", "34", "1"],
      },
      {
        name: "user",
        id: "asda#2",
        permissions: ["a", "sdsad", "l"],
      },
      {
        name: "guest",
        id: "asda#3",
        permissions: ["fsa", "986", "45"],
      },
    ]);
    setUsers([
      {
        name: "Banana",
        id: "asda#1",
        roles: ["admin", "apple", "pen"],
        password: "btiches",
      },
      {
        name: "Apple",
        id: "asda#2",
        roles: ["admin", "apple", "pen"],
        password: "btiches",
      },
      {
        name: "Pen",
        id: "asda#3",
        roles: ["admin", "apple", "pen"],
        password: "btiches",
      },
    ]);

    setTempR(Roles);
    setTempU(users);
  }, []);

  const sendInPatch = () => {
    batchSelect.map((item) => {
      sendData(item);
    });
  };

  const getRandomGreenColor = () => {
    const red = Math.floor(Math.random() * 100) + 27; // Slight red component
    const green = Math.floor(Math.random() * 102) + 100; // Strong green component
    const blue = Math.floor(Math.random() * 100) + 27; // Slight blue component
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <div className="c">
      {loading ? (
        <div className="popHolder">
          <div className="outer"></div>
          <div className="Loading">
            <box-icon
              name="loader-circle"
              animation="spin"
              color="#509c7c"
            ></box-icon>{" "}
            Loading...
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="sideLeft">
            <div className="currentselect">
              <h3>
                {create ? "Create" : "Selected"}{" "}
                {currentUR === "users" ? "User" : "Role"}
              </h3>
              <h2>{selected.name}</h2>
            </div>
            <div id="renderUAR">
              <div id="actionBar">
                <button
                  className={currentUR === "users" ? "URbtn active" : "URbtn"}
                  onClick={() => {
                    setMode("users");
                    setMess("");
                    setCurrentUR("users");
                  }}
                >
                  Users
                </button>
                <button
                  className={currentUR === "roles" ? "URbtn active" : "URbtn"}
                  onClick={() => {
                    setMode("roles");
                    setMess("");
                    togglePopup(false);
                    setCurrentUR("roles");
                  }}
                >
                  Roles
                </button>
                <span className="searchSection">
                  <form
                    width="100%"
                    onSubmit={(e) => {
                      e.stopPropagation(); // Stop event propagation to prevent parent form submission
                      if (currentUR === "users") {
                        searchUsers(e);
                      } else if (currentUR === "roles") {
                        searchRoles(e);
                      }
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit">
                      <box-icon
                        name="search-alt"
                        size="27px"
                        color="#509c7c"
                      ></box-icon>
                    </button>
                  </form>
                </span>
              </div>
              <div className="divider small"></div>
              <div className="items">
                {mode === "users" &&
                  (noDataU ? (
                    <p style={{ color: "#1a4d2e" }}>No data avaiable</p>
                  ) : (
                    users.map((user) => (
                      <div
                        className="userItem"
                        key={user.id}
                        onClick={() => {
                          setMess("");
                          togglePopup(false);
                          settingSelected(user);
                          setCreate(false);
                        }}
                        style={{ backgroundColor: getRandomGreenColor() }}
                      >
                        {user.name}
                      </div>
                    ))
                  ))}
                {mode === "roles" &&
                  (noDataR ? (
                    <p>No data avaiable</p>
                  ) : (
                    Roles.map((role) => (
                      <div
                        className="roleItem"
                        key={role.id}
                        style={{ backgroundColor: getRandomGreenColor() }}
                        onClick={() => {
                          settingSelected(role);
                          setMess("");
                          togglePopup(false);
                          setCreate(false);
                        }}
                      >
                        {role.name}
                      </div>
                    ))
                  ))}
              </div>
            </div>
          </div>
          <div className="configBoard">
            {rolesPopUp && (
              <div className="popupSearch">
                <span className="searchSection small">
                  <form
                    width="100%"
                    onSubmit={(e) => {
                      e.stopPropagation(); // Stop event propagation to prevent parent form submission
                      searchRolesPopup(e);
                    }}
                  >
                    {" "}
                    <input
                      type="text"
                      placeholder="Search"
                      onChange={(e) => setSearchInputSide(e.target.value)}
                    />
                    <button type="submit">
                      <box-icon
                        name="search-alt"
                        size="20px"
                        color="#ffffff"
                      ></box-icon>
                    </button>
                  </form>
                </span>
                {popupR.map((role) => (
                  <div
                    key={role.id}
                    className="roleItem inline nodash close"
                    style={{ backgroundColor: getRandomGreenColor() }}
                  >
                    <div
                      onClick={() => {
                        setAddedRoles([...addedRoles, role.name]);
                      }}
                    >
                      {role.name}
                    </div>
                    {addedRoles.includes(role.name) && (
                      <button
                        type="button"
                        onClick={() =>
                          setAddedRoles(
                            addedRoles.filter((r) => r !== role.name)
                          )
                        }
                      >
                        remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                console.log("submitting");
                e.preventDefault();
                const sendingData = {
                  id: selected.id,
                  name: itemname,
                  password: password,
                  roles: addedRoles,
                  permissions: "perms", //in progress
                };

                sendData(sendingData);
                // } else {
                //   sendInPatch();
                // }
              }}
            >
              <div className="inline">
                {!create && <h4>id: {selected.id}</h4>}
                <button
                  className="addBtn"
                  type="button"
                  onClick={(event) => {
                    event.preventDefault(); // Prevent default form submission
                    setMess("");
                    setCreate(!create);
                  }}
                >
                  {create ? "Back" : "Create"}
                </button>
              </div>

              {currentUR === "users" && (
                <div className="UserRender">
                  <h1>Username</h1>
                  <input
                    className="RenderInp"
                    type="text"
                    id="UserName"
                    placeholder="Enter name"
                    value={itemname}
                    onChange={(e) => {
                      setItemname(e.target.value);
                    }}
                  />
                  <h3>Password</h3>
                  <div className="passRender">
                    <input
                      className="passInp"
                      type={showPass ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        setPassword(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        setShowPass(!showPass);
                      }}
                    >
                      {showPass ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <div className="inline nodash close">
                    <h3>Roles</h3>
                    <button
                      className="addRoleBtn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        togglePopup(!rolesPopUp);
                        setSearchInputSide("");
                        setPopupR(tempR);
                      }}
                    >
                      {rolesPopUp ? "x" : "+"}
                    </button>
                  </div>
                  <div
                    className={rolesPopUp ? "roleRender small" : "roleRender"}
                  >
                    {addedRoles.map((item, index) => (
                      <div
                        key={index}
                        style={{ border: `3px solid ${getRandomGreenColor()}` }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentUR === "roles" && (
                <div>
                  {!create && <h2>id: {selected.id}</h2>}
                  <input
                    type="text"
                    value={itemname}
                    id="RoleName"
                    onChange={(e) => {
                      e.preventDefault(); // Prevent default form submission

                      setItemname(e.target.value);
                    }}
                  />
                  <div>
                    {perms?.map((permission, index) => (
                      <div key={index}>{permission}</div>
                    ))}
                  </div>
                </div>
              )}
              <div className="Btns">
                <button type="submit">
                  Submit <FaCheck />
                </button>
                <button type="button" className="delBtn" onClick={DeleteUR}>
                  <RiDeleteBin2Fill />
                </button>
              </div>
              {Mess && <h2>{Mess}</h2>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
