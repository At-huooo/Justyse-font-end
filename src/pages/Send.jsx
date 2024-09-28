import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "../components/RenderProblem/RenderProblem.css";

function Send() {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState([]);
  const [selectedCompiler, setSelectedCompiler] = useState([]);
  const [compilers, setCompilers] = useState({});
  const [languages, setLanguages] = useState({});
  const [data, setData] = useState({});
  const [code, setCode] = useState("");
  const apiUrl = localStorage.getItem("apiUrl");
  const token = localStorage.getItem("token");
  const { problemId } = useParams();
  const title = localStorage.getItem("title");
  // const [queryID, setQueryID] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorPopup, setErrorPopup] = useState("");
  const SendSubmission = async () => {
    let subId = "";
    /* 401 */
    if (selectedLang === "none" || selectedCompiler === "none" || !code) {
      alert("Please fill all the fields");
      return;
    }
    try {
      const res = await axios.post(
        `${apiUrl}/api/submission`,
        {
          problem: problemId,
          lang: selectedLang, // Sai
          compiler: selectedCompiler, // Sai
          code: code,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status > 300 || res.status < 200) {
        throw new Error(`POST /submission error: ${res.data}`);
      }
      subId = res.data.id;
      console.log("Submission success", res.data);
    } catch (error) {
      setErrorPopup("Submitting Error");
      console.error(error);
    }
    
    try {
      const startJudge = axios.post(`${apiUrl}/api/judge/${subId}`, {
        headers: {
          "ngrok-skip-browser-warning": true,
          Authorization: `Bearer ${token}`,
        },
      });
      // localStorage.setItem("queue_id", );
      navigate(`/problems/${problemId}/submit/${startJudge.data}`);
    } catch (error) {
      setErrorPopup("Judging Error");
      console.error(error);
    }
  };

  const getData = async () => {
    if (Object.keys(languages).length == 0) return;
    try {
      const res = await axios.get(`${apiUrl}/api/problem/${problemId}`, {
        headers: {
          "ngrok-skip-browser-warning": true,
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`GET "problems" error: ${res.data}`);
      }
      let data_ = res.data;
      data_.accept_language = data_.accept_language.map(
        (val) => languages[val]
      );
      console.log(languages, data_);
      setData(data_);
    } catch (error) {
      setErrorPopup("Get language Error");
      console.error(error);
    }
  };

  const getDeclare = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/declare/compiler`, {
        headers: {
          "ngrok-skip-browser-warning": true,
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`GET "problems" error: ${res.data}`);
      }

      let compilers_ = {};
      for (let key in res.data)
        if (typeof res.data[key] == "object" && !Array.isArray(res.data[key]))
          compilers_[key] = { id: key, ...res.data[key] };

      setCompilers(compilers_);
    } catch (error) {
      setErrorPopup("Get compilers Error");

      return console.error(error);
    }

    try {
      const res = await axios.get(`${apiUrl}/api/declare/language`, {
        headers: {
          "ngrok-skip-browser-warning": true,
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`GET "problems" error: ${res.data}`);
      }

      let languages_ = {};
      for (let key in res.data)
        if (typeof res.data[key] == "object" && !Array.isArray(res.data[key]))
          languages_[key] = { id: key, ...res.data[key] };

      console.log(languages_);
      setLanguages(languages_);
    } catch (error) {
      setErrorPopup("Get languge error");
      return console.error(error);
    }
  };

  const filteredCompilers = () =>
    Object.values(compilers).filter(
      (compiler) =>
        typeof compiler === "object" &&
        !Array.isArray(compiler) &&
        compiler !== null &&
        compiler.language.includes(selectedLang[0])
    );
  useEffect(() => {
    if (token === "") return navigate("/");
  });
  useEffect(() => void getDeclare(), []);
  useEffect(() => void getData(), [languages]);
  useEffect(() => void setLoading(false), [data]);

  return (
    <div className="container">
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
        <div style={{ height: "100%", width: "100%" }}>
          {errorPopup != "" && (
            <div className="popHolder">
              <div className="outer"></div>
              <div className="errorPopup">
                <div className="upperLine">
                  <button
                    type="button"
                    className="CloseBtn"
                    onClick={() => setErrorPopup("")}
                  >
                    X
                  </button>
                </div>
                <div className="errorMessage">{errorPopup}</div>
              </div>
            </div>
          )}
          <div className="fullsize">
            <h2 className="headTitle">{title}</h2>
            <div className="submitFrame">
              <div className="editor">
                <Editor
                  height="100%"
                  language={selectedLang[0]}
                  theme="vs-dark"
                  onChange={(value) => setCode(value)}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                  }}
                />
              </div>
              <div className="langCom">
                <div className="langChoices">
                  <h3>Choose a language</h3>
                  <p>
                    Current:{" "}
                    <span>
                      {selectedLang.length == 0
                        ? "None"
                        : (() => {
                            const [id, version] = selectedLang;
                            return `${languages[id].name} (${version})`;
                          })()}
                    </span>
                  </p>
                  <div className="langcontain">
                    {data.accept_language?.map((lang) =>
                      (lang.version || [undefined]).map((version) => (
                        <button
                          onClick={() => setSelectedLang([lang.id, version])}
                          className={
                            selectedLang === lang
                              ? "selected langbtns"
                              : "langbtns"
                          }
                        >
                          {version ? `${lang.name} (${version})` : lang.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div className="compileChoices">
                  <h3>Choose a compiler</h3>
                  <p>
                    Current:{" "}
                    <span>
                      {selectedCompiler.length == 0
                        ? "None"
                        : (() => {
                            const [id, version] = selectedCompiler;
                            return `${compilers[id].name} (${version})`;
                          })()}
                    </span>
                  </p>
                  <div className="compilerContain">
                    {selectedLang && selectedLang !== "none" ? (
                      filteredCompilers().map((compiler) =>
                        compiler.version?.map((versions) => (
                          <button
                            className={
                              selectedCompiler ===
                              `${compiler.name} ${versions}`
                                ? "selected compilerbtns"
                                : "compilerbtns"
                            }
                            onClick={() =>
                              setSelectedCompiler([compiler.id, versions])
                            }
                          >
                            {compiler.name} ({versions})
                          </button>
                        ))
                      )
                    ) : (
                      <p>No compilers available for the selected language.</p>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="submitbtn"
                onClick={SendSubmission}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Send;
