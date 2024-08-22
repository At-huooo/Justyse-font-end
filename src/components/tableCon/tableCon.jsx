import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./tableCon.css";
import NoData from "./mydieu.png";
import axios from "axios";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailedData, setDetailedData] = useState([]);
  const apiUrl =
  "https://barely-aware-walrus.ngrok-free.app";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQGFkbWluIiwiZXhwIjoxNzI0ODc4NjM2fQ.dH2fsgyEjsIaf-S4KO6Ilp5PCQASUlV_k-nCvOLY7ik";
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/problems`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
        timeout: 1000,
      });
      if (response.status > 300 || response.status < 200) {
        throw new Error(`GET "problems" error: ${response.data}`);
      }
      const result = response.data;
      setData(result);
    } catch (error) {
      console.error(error);
      setData([]); // Set data to an empty array to trigger "No data available"
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedData = async (ids) => {
    const results = [];
    for (const id of ids) {
      try {
        const response = await axios.get(`${apiUrl}/api/problem/${id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          timeout: 1000,
        });
        if (response.status > 300 || response.status < 200) {
          throw new Error(`GET "problem/${id}" error: ${response.data}`);
        }
        const result = response.data; // Parse the JSON response
        results.push(result); // Push the parsed data to the results array
      } catch (error) {
        console.error(error);
      }
    }
    setDetailedData(results);
  };

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch detailed data after the main data is loaded
    if (data.length > 0) {
      fetchDetailedData(data);
    }
  }, [data]);

  const handleSave = (props) => {
    localStorage.setItem("id", props);
  };

  return (
    <div className="Frame">
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
      <Link to="config_create">
        <div className="addItem">+</div>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Problem Name</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="no-data" colSpan="2">
                <img src={NoData} alt="No data available" />
                <p className="errormes">No data available.</p>
              </td>
            </tr>
          ) : (
            detailedData.map((result) => (
              <tr key={result.id}>
                <td>
                  <Link
                    to="config"
                    className="link"
                    onClick={handleSave(result.id)}
                  >
                    {result.title}
                  </Link>
                </td>
                <td>
                  <Link
                    to="config"
                    className="link"
                    onClick={handleSave(result.id)}
                  >
                    {result.id}
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
