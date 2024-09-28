import React, { useState, useEffect } from "react";
import axios from "axios";
import banner from "../../assets/Justyse.png";
import "boxicons";
import "./Login.css";

export default function Login() {
  const [createUser, setCreateUser] = useState(false);
  const apiUrl = localStorage.getItem("apiUrl");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const Signup = async () => {
    setLoading(true);
    if (username === "" && password === "") {
      alert("Username and Password are empty");
      setLoading(false);
      return;
    }
    if (username === "") {
      alert("Username is empty");
      setLoading(false);
      return;
    }
    if (password === "") {
      alert("Password is empty");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}/api/user`,
        {
          name: username,
          password: password,
          roles: [],
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          timeout: 10000,
        }
      );
      if (res.status > 300 || res.status < 200) {
        throw new Error(`POST /sign up error: ${res.data}`);
      }
      setLoading(false);
    } catch (error) {
      if (error.response.status === 409) {
        setErrorMessage("Username already exists");
        return;
      }
      console.log("Sign up failed", error);
    }
    LogIn();
  };

  const LogIn = async () => {
    setLoading(true);
    if (username === "" && password === "") {
      alert("Username and Password are empty");
      setLoading(false);
      return;
    }
    if (username === "") {
      alert("Username is empty");
      setLoading(false);
      return;
    }
    if (password === "") {
      alert("Password is empty");
      setLoading(false);
      return;
    }
    const userInfo = new FormData();
    userInfo.append("username", username);
    userInfo.append("password", password);

    try {
      const res = await axios.post(`${apiUrl}/api/user/login`, userInfo, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        timeout: 10000,
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("username", res.data.name);
      localStorage.setItem("roles", JSON.stringify(res.data.roles)); // Ensure roles is stored as an array
      console.log("Login success", res.data);
      setLoading(false);
      if (res.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error)
      if (error.response.status === 401) {
        setErrorMessage("Invalid password");
        return;
      }
      if (error.response.status === 404) {
        setErrorMessage("User not found");
        return;
      }
      throw new Error(`POST /login error: ${error}`);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  });

  return (
    <div className="base">
      <div className="LoginSquare">
        <img src={banner} alt="Justyse banner" className="Banner"></img>
        <div className={!createUser ? "Login" : "Login none"}>
          <form onSubmit={(e) => e.preventDefault()}>
            <h2>Login</h2>
            <label htmlFor="login-username">
              Username:
              <input
                id="login-username"
                type="text"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </label>
            <label htmlFor="login-password">
              Password:{" "}
              <input
                id="login-password"
                type="password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              ></input>
            </label>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <p>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={() => {
                  setCreateUser(true);
                }}
              >
                Sign up
              </a>
            </p>
            <button className="loginBtn" type="submit" onClick={LogIn}>
              Login
            </button>
          </form>
        </div>
        <div className={createUser ? "Signup" : "Signup none"}>
          <div
            className="back"
            onClick={() => {
              setCreateUser(false);
            }}
          >
            <box-icon
              name="up-arrow-alt"
              size="30px"
              color="#4f6f52"
            ></box-icon>
          </div>
          <h2>Sign up</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="signup-username">
              Username:
              <input
                id="login-username"
                type="text"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </label>
            <label htmlFor="signup-password">
              Password:
              <input
                id="login-password"
                type="password"
                required
                onChange={(e) => {
                  if (e.target.value.length >= 6) {
                    setErrorMessage(
                      "The password must be at least 6 characters long"
                    );
                  } else {
                    setPassword(e.target.value);
                  }
                }}
              ></input>{" "}
            </label>
            <button className="signupBtn" type="submit" onClick={Signup}>
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
