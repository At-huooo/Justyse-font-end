import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProblemTable.css";
import NoData from "../../assets/mydieu.png";
import axios from "axios";

const statusCodes = [
  "ACCEPTED",
  "WRONG_ANSWER",
  "TIME_LIMIT_EXCEEDED",
  "MEMORY_LIMIT_EXCEEDED",
  "JUDGER_ERROR",
  "RUNTIME_ERROR",
  "COMPILE_ERROR",
  "SYSTEM_ERROR",
  "UNKNOWN_ERROR",
];

export default function () {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detailedData, setDetailedData] = useState([]);
  // const [submissionsStatus, setSubmissionsStatus] = useState([]);
  const [configMode, setConfigMode] = useState(true);
  const apiUrl = localStorage.getItem("apiUrl");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [apiStatus, setApiStatus] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    // try {
    //   await axios.head(`${apiUrl}/api/problems`);
    //   setApiStatus(true);
    // } catch (error) {
    //   console.error("API is not available");
    //   setLoading(false);
    //   setApiStatus(false);
    // }

    // if (!apiStatus) return;

    try {
      const response = await axios.get(
        `${apiUrl}/api/problems?keys=id,title,point_per_testcase`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          timeout: 3000,
        }
      );
      if (response.status > 300 || response.status < 200) {
        setLoading(false);
        throw new Error(`GET "problems" error: ${response.data}`);
      }
      const result = await response.data;
      setDetailedData(result);
    } catch (error) {
      console.error(error);
      setDetailedData([]); // Set data to an empty array to trigger "No data available"
      setLoading(false);
    }

    try {
      const ans = await axios.get(
        `${apiUrl}/api/submissions?filter=by:${userId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (ans.status > 300 || ans.status < 200) {
        throw new Error(`GET "status" error: ${ans.data}`);
      }
      const res = ans.data;
      res.sort((a, b) => b.result.point - a.result.point);
      const skipId = new Set();
      if (detailedData.length > 0 && res.length > 0) {
        res.forEach((item) => {
          detailedData.forEach((problem) => {
            if (item.problem === problem.id && !skipId.has(problem.id)) {
              problem.status = statusCodes[item.result.status];
              console.log(problem);
              skipId.add(problem.id);
            }
          });
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token === "" || token === null) return navigate("/");
    // Fetch data when component mounts
    fetchData();
  }, []);

  const changeToSubmit = () => {
    setConfigMode(false);
  };
  const changeToConfig = () => {
    setConfigMode(true);
  };

  return (
    <div className="c problemTable">
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
        <Link to="config/create">
          <div className={configMode ? "addItem" : "addItem none"}>+</div>
        </Link>
        <table>
          <thead>
            <tr>
              <th>Problem Name</th>
              <th>Points</th>
              <th>Status</th>
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
              {detailedData.map((result) => (
                <tr key={result.id}>
                  <td>
                    <Link
                      to={configMode ? `config/${result.id}` : `${result.id}`}
                      className="link"
                    >
                      {result.title}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={configMode ? `config/${result.id}` : `${result.id}`}
                      className="link"
                    >
                      {result.point_per_testcase}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={
                        configMode
                          ? `config/${result.id}`
                          : `submit/${result.id}`
                      }
                      className="link"
                    >
                      {result.status || "-"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
