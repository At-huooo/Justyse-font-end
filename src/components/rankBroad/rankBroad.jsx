import React, { useState, useEffect } from "react";
import axios from "axios";
import "./rankBroad.css";

const RankBroad = () => {
  const apiUrl = "https://barely-aware-walrus.ngrok-free.app";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQGFkbWluIiwiZXhwIjoxNzI0ODc4NjM2fQ.dH2fsgyEjsIaf-S4KO6Ilp5PCQASUlV_k-nCvOLY7ik";
  const itemsPerPage = 9;
  const maxPageButtons = 6; // Maximum number of page buttons to display
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationStart, setPaginationStart] = useState(1);
  const [rankData, setrankData] = useState([]);
  const [problemsDetail, setProblemsDetail] = useState([]);
  const [clickedAll, setClickedAll] = useState(false);
  const [clickedItemId, setClickedItemId] = useState(null);
  const [clickedItemIndex, setClickedItemIndex] = useState(null);

  const totalPages = Math.ceil(rankData.length / itemsPerPage);

  const onClickedAll = () => {
    setClickedAll(true);
  };
  const offClickedAll = () => {
    setClickedAll(false);
  };

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

  const renderAll = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/problems/statics?to_file=false`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status > 300 || res.status < 200) {
        throw new Error(`Rank getting error,${res.data} `);
      }
      const result = await res.data.slice(1);
      setrankData(result);
      console.log("GET, All rank Success");
    } catch (error) {
      console.log("GET, Rank: ", error);
    }
  };

  const renderItem = (id) => async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/problems/${id}/statics?to_file=false`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status > 300 || res.status < 200) {
        throw new Error(`Item Rank getting error,${res.data} `);
      }
      const result = await res.data.slice(1);
      console.log("GET, Item rank Success");
      setrankData(result);
    } catch (error) {
      console.log("GET, Item Rank: ", error);
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

  const downloadstatic = async (id) => {
    if (clickedAll) {
      try {
        const res = await axios.get(
          `${apiUrl}/api/problems/statics?to_file=true&redirect=false&download=true`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );
        if (res.status > 300 || res.status < 200) {
          throw new Error(`Error fetching statics: ${res.data}`);
        }
        setrankData(res.data);
      } catch (error) {
        console.error(`GET, statics: `, error);
      }
    } else {
      try {
        const res = await axios.get(
          `${apiUrl}/api/problems/${id}/statics?to_file=true&redirect=false&download=true`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );
        if (res.status > 300 || res.status < 200) {
          throw new Error(`Error fetching statics: ${res.data}`);
        }
        setrankData(res.data);
      } catch (error) {
        console.error(`GET, statics: `, error);
      }
    }
  };

  useEffect(() => {
    getProblems();
  }, []);

  return (
    <div className="c">
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
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Total Score</th>
                  {problemsDetail.map((item) => (
                    <th key={item.id}>{item.title}</th>
                  ))}
                  {" "}
                </tr>
              </thead>
              <tbody>
                {rankData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="Loading">
              No leaderborad choosen yet.{" "}
              <box-icon color="#1A4D2E" name="book-open"></box-icon>{" "}
            </p>
          )}
        </div>
        <div className="rank_side">
          <div className="rankBtn">
            <h4 className="rankTitle">
              Rank -{" "}
              {clickedAll ? "All" : problemsDetail[clickedItemIndex]?.title}
            </h4>
            <button
              className="downloadBtn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the div's onClick
                downloadstatic(clickedItemId);
              }}
            >
              Download
            </button>
          </div>
          <h3>Problem </h3>
          <div className="sideBottom">
            <div className="idHolder">
              <div
                className={`${clickedAll ? "active" : ""}`}
                onClick={(e) => {
                  renderAll();
                  onClickedAll();
                }}
              >
                All Problem
              </div>
              {problemsDetail.map((item, index) => (
                <div
                  className={`${
                    clickedItemId === item.id && !clickedAll ? "active" : ""
                  }`}
                  key={item.id}
                  onClick={(e) => {
                    setClickedItemId(item.id);
                    setClickedItemIndex(index);
                    renderItem(item.id);
                    offClickedAll();
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankBroad;
