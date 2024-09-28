import React, { useState, useEffect } from "react";
import "boxicons";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./RankBroad.css";

export default function () {
  const apiUrl = localStorage.getItem("apiUrl");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const problemName = useParams().problemName;
  const problemId = useParams().problemId;
  const itemsPerPage = 9;
  const maxPageButtons = 6; // Maximum number of page buttons to display
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationStart, setPaginationStart] = useState(1);
  const [rankData, setrankData] = useState([]);
  const [problemsDetail, setProblemsDetail] = useState([]);
  const [clickedItemId, setClickedItemId] = useState(null);
  const [clickedItemIndex, setClickedItemIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true); // State for collapsible section
  const [Loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "No leaderbroad choosen yet."
  );
  const [temptitle, setTemptitle] = useState("");
  const totalPages = Math.ceil(rankData.length / itemsPerPage);

  const ChangePage = (page) => {
    setCurrentPage(page);
  };

  const getCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return rankData.slice(startIndex, endIndex);
  };

  const PreviousRange = () => {
    setPaginationStart(Math.max(paginationStart - maxPageButtons, 1));
  };

  const NextRange = () => {
    setPaginationStart(
      Math.min(
        paginationStart + maxPageButtons,
        totalPages - maxPageButtons + 1
      )
    );
  };

  const getPaginationRange = () => {
    const end = Math.min(paginationStart + maxPageButtons - 1, totalPages);
    return { start: paginationStart, end };
  };

  const { start, end } = getPaginationRange();

  const render = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        id === "@all"
          ? `${apiUrl}/api/problems/statics?to_file=false`
          : `${apiUrl}/api/problem/${id}/statics?to_file=false`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status > 300 || res.status < 200) {
        throw new Error(res.data);
      }

      let result = await res.data;
      if (!result || result.length === 0) {
        setLoadingMessage("No data available");
        setrankData([]);
        return;
      }
      if (id === "@all") result = result.slice(1);

      setrankData(result);
      console.log("GET, Item rank Success");
      console.dir(result);
    } catch (error) {
      console.log("GET, Item Rank: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getProblems = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/problems/?keys=id,title`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`Problems details getting error,${res.data} `);
      }
      const result = await res.data; // [{id:..., title:...}]
      setProblemsDetail(result);
      console.log("GET, Problem details Success");
    } catch (error) {
      console.log("GET, Problem: ", error);
    }
  };

  const downloadstatic = async () => {
    try {
      const res = await axios.get(
        clickedItemId === "@all"
          ? `${apiUrl}/api/problems/statics?to_file=true&redirect=false&download=true`
          : `${apiUrl}/api/problem/${clickedItemId}/statics?to_file=true&redirect=false&download=true`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
          responseType: "blob", // Ensure the response is a Blob
        }
      );
      if (res.status > 300 || res.status < 200) {
        throw new Error(`Error fetching statics: ${res.data}`);
      }

      // Create a Blob from the response data
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = `${
        clickedItemId === "@all" ? "All" : `${temptitle}`
      }_data.csv`; // Set the desired file name
      document.body.appendChild(a);
      a.click();
      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("GET, Problem: ", error);
    }
  };

  useEffect(() => {
    if(token === "")return navigate("/");
    getProblems();
  }, []);

  useEffect(() => {
    if (problemId) {
      render(problemId);
      setClickedItemId(problemId);
      setTemptitle(problemName);
    }
  }, []);

  return (
    <div className="c">
      {Loading && (
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

      <div className="nav_tab">
        <button onClick={PreviousRange} disabled={paginationStart === 1}>
          <box-icon name="chevrons-left" size={10} color="#fff4e7"></box-icon>
        </button>
        {Array.from({ length: end - start + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => ChangePage(start + index)}
            className={currentPage === index + start ? "active" : ""}
          >
            {index + start}
          </button>
        ))}
        <button onClick={NextRange} disabled={end === totalPages}>
          <box-icon name="chevrons-right" size={10} color="#fff4e7"></box-icon>
        </button>
      </div>

      <div className="rankFrame">
        <div className="rank">
          {rankData.length > 0 ? (
            clickedItemId === "@all" ? (
              <table id="allview">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Total Score</th>
                    {problemsDetail.map((item) => (
                      <th key={item.id}>{item.title}</th>
                    ))}{" "}
                  </tr>
                </thead>
                <tbody>
                  {rankData.map((row, rowIndex) => {
                    return (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="problemRank">
                <thead>
                  <tr>
                    <th className="Position">Rank</th>
                    <th className="User">User</th>
                    <th className="Lang">Language</th>
                    <th className="Points">Points</th>
                    <th className="Status">Status</th>
                    <th className="Time">Time (seconds)</th>
                    <th className="Memory">Memory - peak</th>
                  </tr>
                </thead>
                <tbody>
                  {rankData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="Position">{index + 1}</td>
                        <td className="User">{item.by}</td>
                        <td className="Lang">
                          {item.lang[0]} ({item.lang[1]})
                        </td>
                        <td className="Points">{item.result?.point}</td>
                        <td className="Status">{item.result?.status}</td>
                        <td className="Time">
                          {Math.ceil(item.result?.time * 1000) / 1000}
                        </td>
                        <td className="Memory">{item.result?.memory[1]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : (
            <p className="Loading">
              {loadingMessage}{" "}
              <box-icon
                type="solid"
                color="#4F6F52"
                name="message-square-x"
              ></box-icon>
            </p>
          )}
        </div>
        <div className="rank_side">
          <h4 className="rankTitle">
            Rank - {clickedItemId === "@all" ? "All" : temptitle}
          </h4>
          <div className="rankBtn">
            <button
              className="downloadBtn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the div's onClick
                downloadstatic();
              }}
            >
              <span> Download </span>
              <box-icon name="download" type="solid" color="#ffffff"></box-icon>
            </button>
          </div>
          <div className="inline">
            <h3>Problem </h3>
            <button
              className="dropDown"
              onClick={() => {
                setIsCollapsed(!isCollapsed);
              }}
            >
              {isCollapsed ? (
                <box-icon color="#1a4d2e" name="down-arrow" type="solid" size="17px"></box-icon>
              ) : (
                <box-icon color="#1a4d2e" type="solid" name="left-arrow" size="17px"></box-icon>
              )}
            </button>
          </div>

          {!isCollapsed && (
            <div className="sideBottom">
              <div className="idHolder">
                <div
                  className={`${clickedItemId === "@all" ? "active" : ""}`}
                  onClick={async () => {
                    await render("@all");
                    setClickedItemId("@all");
                    setTemptitle("");
                  }}
                >
                  All Problem
                </div>
                {problemsDetail.map((item, index) => (
                  <div
                    className={`${
                      clickedItemId === item.id
                        ? "active problemBubble"
                        : "problemBubble"
                    }`}
                    key={item.id}
                    onClick={async (e) => {
                      // offClickedAll();
                      // setClickedAll(false)
                      await render(item.id);
                      setClickedItemId(item.id);
                      setClickedItemIndex(index);
                      setTemptitle(item.title);
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
