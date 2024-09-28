import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TiUpload } from "react-icons/ti";
import { FaRankingStar } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import "./RenderProblem.css";

function CodeSubmit() {
  const apiUrl = localStorage.getItem("apiUrl");
  const token = localStorage.getItem("token");

  const { problemId } = useParams();
  const naviagate = useNavigate();
  const [PDF, setPDF] = useState("");
  const [data, setData] = useState({});
  // const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  // const [selectedCompiler, setSelectedCompiler] = useState("none");
  const [compilers, setCompilers] = useState([]);

  const getData = async () => {
    /* 401 */
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/problem/${problemId}`, {
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
    /* 401 */
    try {
      const link = await axios.get(
        `${apiUrl}/api/problem/${problemId}/docs?redirect=False`,
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
          throw new Error(`GET /problem/${problemId} error: ${link.data}`);
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

  const getCompilers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/declare/compiler`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`GET "problems" error: ${res.data}`);
      }

      let compilers = [];
      for (let key in res.data)
        if (typeof res.data[key] == "object" && !Array.isArray(res.data[key]))
          compilers.push({ id: key, ...res.data[key] });

      setCompilers(compilers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const SendSubmission = async () => {
  //   /* 401 */
  //   if (selectedLang === "none" || selectedCompiler === "none" || !code) {
  //     alert("Please fill all the fields");
  //     return;
  //   } else {
  //     try {
  //       const res = await axios.post(
  //         `${apiUrl}/api/submission`,
  //         {
  //           body: {
  //             id: "",
  //             problem: problemId,
  //             lang: selectedLang,
  //             compiler: selectedCompiler,
  //             code: code,
  //           },
  //         },
  //         {
  //           headers: {
  //             "ngrok-skip-browser-warning": "true",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       if (res.status > 300 || res.status < 200) {
  //         throw new Error(`POST /submission error: ${res.data}`);
  //       }
  //       console.log("Submission success", res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  useEffect(() => {
    if (token === "") return naviagate("/");
    if (!problemId) return naviagate("/problems");
    getData();
    getPDF();
    getCompilers();
  }, []);

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
            <div className="ProblemSide">
              {PDF ? (
                <embed
                  width="100%"
                  height="100%"
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
            <div className="BtnsSide">
              <Link to={`../../submission/${data.title}/${problemId}`}>
                <h5
                  className="ViewBtns"
                  onClick={() => {
                    localStorage.setItem("id", problemId);
                    localStorage.setItem("title", data.title);
                  }}
                >
                  <FaRankingStar size={25}/> See problem's ranking 
                </h5>
              </Link>
              <Link to={'submit'}>
                <h5 className="ViewBtns"> <TiUpload size={25}/> Submit a solution</h5>
              </Link>
            </div>
          </div>

          <div className="dividerSubmit"></div>

          {/* <div className="submitFrame">
            <div className="editor">
              <Editor
                height="100%"
                language={selectedLang}
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
                  Current: <span>{selectedLang}</span>
                </p>
                <div className="langcontain">
                  {data.accept_language?.map((lang) => {
                    console.log(lang);
                    return (
                      <button
                        key={lang}
                        id={`${lang}`}
                        onClick={() => setSelectedLang(lang)}
                        className={
                          selectedLang === lang
                            ? "selected langbtns"
                            : "langbtns"
                        }
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="compileChoices">
                <h3>Choose a compiler</h3>
                <p>
                  Current: <span>{selectedCompiler}</span>
                </p>
                <div className="compilerContain">
                  {selectedLang && selectedLang !== "none" ? (
                    filteredCompilers().map((compiler) =>
                      compiler.version?.map((versions) => (
                        <button
                          key={`${compiler.name}-${versions}`}
                          id={`compiler-${compiler.name}-${versions}`}
                          className={
                            selectedCompiler === `${compiler.name} ${versions}`
                              ? "selected compilerbtns"
                              : "compilerbtns"
                          }
                          onClick={() =>
                            setSelectedCompiler(`${compiler.name} ${versions}`)
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
          </div> */}
        </div>
      )}
    </div>
  );
}

export default CodeSubmit;
