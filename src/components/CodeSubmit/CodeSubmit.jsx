import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import "./CodeSubmit.css";

function CodeSubmit() {
  const apiUrl = "https://barely-aware-walrus.ngrok-free.app";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQGFkbWluIiwiZXhwIjoxNzI0ODc4NjM2fQ.dH2fsgyEjsIaf-S4KO6Ilp5PCQASUlV_k-nCvOLY7ik";

  const id = localStorage.getItem("id");
  const [PDF, setPDF] = useState("");
  const [data, setData] = useState({});
  const [selectedLang, setSelectedLang] = useState("none");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [selectedCompiler, setSelectedCompiler] = useState("none");
  const [compilers, setCompilers] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/problem/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`GET "problems" error: ${res.data}`);
      }
      setData(res.data);
      setHasData(true); // Data is available
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPDF = async () => {
    try {
      const link = await axios.get(
        `${apiUrl}/api/problem/${id}/docs?redirect=False`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (link.status > 300 || link.status < 200) {
        if (link.status === 404) {
          console.log("There is no docs");
        } else {
          throw new Error(`GET /problem/${id} error: ${link.data}`);
        }
      }
      const res = await axios.get(`${apiUrl}${link.data}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        responseType: "blob",
      });
      console.log("success", res.data);
      setPDF(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const SendSubmission = async () => {
    if(selectedLang === "none" || selectedCompiler === "none" || !code) {
      alert("Please fill all the fields");
      return;
    } else{
      try{
        const res = await axios.post(`${apiUrl}/api/submission`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          }
        });
        if(res.status > 300 || res.status < 200){
          throw new Error(`POST /submission error: ${res.data}`);
        }
        console.log("Submission success", res.data);
      }catch(error){
        console.error(error);
      }
    }
  }

  useEffect(() => {
    getData();
    getPDF();
    setCompilers([
      {
        lang: "C++",
        compiler: "g++",
      },
      {
        lang: "Java",
        compiler: "javac",
      },
      {
        lang: "Python",
        compiler: "python3",
      },
      {
        lang: "C",
        compiler: "gcc",
      },
      {
        lang: "C#",
        compiler: "mcs",
      },
      {
        lang: "JavaScript",
        compiler: "node",
      },
      {
        lang: "Ruby",
        compiler: "ruby",
      },
      {
        lang: "Swift",
        compiler: "swift",
      },
      {
        lang: "Go",
        compiler: "go",
      },
      {
        lang: "Scala",
        compiler: "scala",
      },
      {
        lang: "Kotlin",
        compiler: "kotlinc",
      },
      {
        lang: "Rust",
        compiler: "rustc",
      },
    ]);

    setData({
      ...data,
      title: "Problem Title",
      accept_language: [
        "C++",
        "Java",
        "Python",
        "C",
        "C#",
      ],
      description: `# Problem Statement`,
   });
  }, []);

  const filteredCompilers = compilers.filter(
    (compiler) => compiler.lang === selectedLang
  );

  return (
    <div className="Submit">
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
      ) : !hasData ? (
        <div className="NoData">
          <h1>No Data Available</h1>
        </div>
      ) : (
        <div className="space">
          <h2 className="headTitle">{data.title}</h2>

          <div className="dividerSubmit head"></div>

          <div className="problemRender">
            {PDF ? (
              <embed
                width="80%"
                height="60%"
                src={URL.createObjectURL(PDF)}
                type="application/pdf"
              />
            ) : (
              <div className="description">
                {" "}
                <ReactMarkdown>{data.description}</ReactMarkdown>
              </div>
            )}
          </div>
          <div className="dividerSubmit"></div>
          <div className="submitFrame">
            <div className="editor">
              <Editor
                height="100%"
                defaultLanguage="cpp"
                defaultValue="// Your code here"
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
                <h3>Choose a languge</h3>
                <p>
                  Current: <span>{selectedLang}</span>
                </p>
                <div className="langcontain">
                  {data.accept_language?.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={
                        selectedLang === lang ? "selected langbtns" : "langbtns"
                      }
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div className="compileChoices">
                <h3>Choose a compiler</h3>
                <p>
                  Current: <span>{selectedCompiler}</span>
                  <div className="compilerContain">
                    {selectedLang && selectedLang !== "none" ? (
                      filteredCompilers.map((compiler) => (
                        <button
                          className={
                            selectedCompiler === compiler.compiler
                              ? "selected compilerbtns"
                              : "compilerbtns"
                          }
                          onClick={() => setSelectedCompiler(compiler.compiler)}
                        >
                          {compiler.compiler}
                        </button>
                      ))
                    ) : (
                      <p>No compilers available for the selected language.</p>
                    )}
                  </div>
                </p>
              </div>
            </div>
            <button type="submit" className="submitbtn" onClick={SendSubmission}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeSubmit;
