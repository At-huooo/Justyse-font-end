import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProblemTable.css";
import NoData from "../../assets/mydieu.png";
import axios from "axios";

export default function () {
  const [loading, setLoading] = useState(true);
  const [detailedData, setDetailedData] = useState([]);
  const [configMode, setConfigMode] = useState(true);
  const apiUrl = "https://barely-aware-walrus.ngrok-free.app";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQGFkbWluIiwiZXhwIjoxNzI0ODc4NjM2fQ.dH2fsgyEjsIaf-S4KO6Ilp5PCQASUlV_k-nCvOLY7ik";
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/problems?keys=id,title`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        timeout: 3000,
      });
      if (response.status > 300 || response.status < 200) {
        throw new Error(`GET "problems" error: ${response.data}`);
      }
      const result = await response.data;
      setDetailedData(result);
    } catch (error) {
      console.error(error);
      setDetailedData([]); // Set data to an empty array to trigger "No data available"
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
    console.log("detailed data", detailedData);
  }, []);

  const changeToSubmit = () => {
    setConfigMode(false);
  };
  const changeToConfig = () => {
    setConfigMode(true);
  };

  const handleSave = (props) => {
    localStorage.setItem("id", props);
  };

  return (
    <div className="c">
      {loading && (
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
      )}
      <div className="Frame">
        {configMode && (
          <Link to="create">
            <div className="addItem">+</div>
          </Link>
        )}
        <table>
          <thead>
            <tr>
              <th>Problem Name</th>
              <th>ID</th>
            </tr>
          </thead>
          {detailedData.length === 0 ? (
            <tr>
              <td className="no-data" colSpan="2">
                <img src={NoData} alt="No data available" />
                <p className="errormes">No data available.</p>
              </td>
            </tr>
          ) : (
            <tbody>
              {configMode
                ? detailedData.map((result) => (
                    <tr key={result.id}>
                      <td>
                        <Link
                          to="config"
                          className="link"
                          onClick={() => handleSave(result.id)}
                        >
                          {result.title}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="config"
                          className="link"
                          onClick={() => handleSave(result.id)}
                        >
                          {result.id}
                        </Link>
                      </td>
                    </tr>
                  ))
                : detailedData.map((result) => (
                    <tr key={result.id}>
                      <td>
                        <Link
                          to="submit"
                          className="link"
                          onClick={() => handleSave(result.id)}
                        >
                          {result.title}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="submit"
                          className="link"
                          onClick={() => handleSave(result.id)}
                        >
                          {result.id}
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          )}
        </table>
      </div>
      <div
        className={[configMode ? "active" : "", "modeBtn one"].join(" ")}
        onClick={changeToConfig}
      >
        Config{" "}
        <box-icon
          color={configMode ? "white" : "#4F6F52"}
          size="20px"
          type="solid"
          name="wrench"
        ></box-icon>
      </div>
      <div
        className={[configMode ? "" : "active", "modeBtn two"].join(" ")}
        onClick={changeToSubmit}
      >
        Submit{" "}
        <box-icon
          color={!configMode ? "white" : "#4F6F52"}
          size="20px"
          name="code-alt"
          type="solid"
        ></box-icon>
      </div>
    </div>
  );
};
