import React, { useState, useEffect } from "react";
import { BiSolidTrashAlt } from "react-icons/bi";
import "../ItemCreate/ItemCreate.css";
import { IoSaveSharp } from "react-icons/io5";
import { FaUpload } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import "boxicons";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

function ConfigItem() {
  const apiUrl =
    "https://barely-aware-walrus.ngrok-free.app";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQGFkbWluIiwiZXhwIjoxNzI0ODc4NjM2fQ.dH2fsgyEjsIaf-S4KO6Ilp5PCQASUlV_k-nCvOLY7ik";
  const id = localStorage.getItem("id");

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(0);
  const [point_per_testcase, setPoint_per_testcase] = useState(1);
  const [supportedLang, setsupportedLang] = useState([]);
  const [question, setQuestion] = useState(""); // State for question
  const [selectedLanguages, setSelectedLanguages] = useState([]); // State for selected languages
  const [memo, setMemo] = useState("");
  const [subType, setSubType] = useState("file");
  const [TClength, setTClength] = useState(0);
  const [popup, setPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); // State for uploaded file
  const [isDragging, setIsDragging] = useState(false); // State for drag-and-drop
  const [warningMessage, setWarningMessage] = useState(""); // State for warning message
  const [uploadedZip, setUploadedZip] = useState(null); // State for uploaded ZIP file
  const [changesMade, setChangesMade] = useState(false);
  const [created, setCreated] = useState(false);
  const [judgers, setJudger] = useState("");
  const [inpName, setInpName] = useState("");
  const [outName, setOutName] = useState("");
  // const [Pdf, setPdf] = useState(null);
  // const [info, setAllInfo] = useState({});

  async function getData() {
    try {
      const response = await axios.get(`${apiUrl}/api/declare/language`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status > 300 || response.status < 200) {
        throw new Error(`GET "languages" error: ${response.data}`);
      }
      const result = response.data;
      setsupportedLang(result.all);
      console.log(result);
    } catch (error) {
      console.error(error);
    }

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
      setUploadedFile(res.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await axios.get(`${apiUrl}/api/problem/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`GET "problem" error: ${res.data}`);
      }
      const getInfo = res.data;
      console.log(getInfo);
      // setAllInfo(getInfo);
      setTitle(getInfo.title);
      setTime(getInfo.limit?.time);
      setPoint_per_testcase(getInfo.point_per_testcase);
      setQuestion(getInfo.description);
      setSelectedLanguages(getInfo.accept_language);
      setMemo(getInfo.limit?.memory);
      setSubType(getInfo.test_type);
      setTClength(getInfo.total_testcases);
      setInpName(getInfo.test_name[0]);
      setOutName(getInfo.test_name[1]);
      setJudger(getInfo.judger);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const Timechange = (event) => {
    setTime(event.target.value);
  };

  const handleInputChange = () => {
    setChangesMade(true);
    // Handle the input change logic here
  };

  const disableWarning = () => {
    setChangesMade(false);
  };

  const inpNameChange = (e) => {
    setInpName(e.target.value);
  };

  const outNameChange = (e) => {
    setOutName(e.target.value);
  };

  const updateLanguage = (event) => {
    const { value, checked } = event.target;
    setSelectedLanguages((prevSelectedLanguages) => {
      let updatedLanguages;
      if (checked) {
        // Add the language to the array
        updatedLanguages = [...prevSelectedLanguages, value];
      } else {
        // Remove the language from the array
        updatedLanguages = prevSelectedLanguages.filter(
          (language) => language !== value
        );
      }
      return updatedLanguages;
    });
  };
  const Judger = (event) => {
    setJudger(event.target.value);
  };

  const submissionType = (event) => {
    setSubType(event.target.value);
  };

  const renderLanguages = () => {
    if (loading) {
      return <div className="Loading">Loading...</div>;
    }

    return supportedLang.map((language, index) => (
      <label key={index} className="lang">
        <input
          type="checkbox"
          value={language}
          checked={selectedLanguages.includes(language)}
          onChange={(e) => {
            updateLanguage(e);
            handleInputChange(e);
          }}
        />
        <span></span> {language.charAt(0).toUpperCase() + language.slice(1)}
      </label>
    ));
  };

  const deleteDocs = () => {
    setUploadedFile(null);
  };

  const getQuestionValue = (e) => {
    setQuestion(e.target.value);
  };

  const DragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const DragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const DragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const MemoryChange = (event) => {
    setMemo(event.target.value);
  };

  const titleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePointsChange = (e) => {
    setPoint_per_testcase(e.target.value);
  };

  const testcaseAmount = (event) => {
    setTClength(event.target.value);
  };

  const togglePopup = () => {
    setPopup(!popup);
  };

  const uploadDocs = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      processZipFile(file);
    }
  };

  const zipUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      processZipFile(file);
    }
  };

  const processZipFile = async (file) => {
    if (file.type === "application/zip" || file.name.endsWith(".zip")) {
      setUploadedZip(file);
    } else {
      setWarningMessage("The uploaded file is not a ZIP file."); // Set warning message
    }
  };

  const handleSave = async () => {
    const data = {
      title: title,
      description: question,
      total_testcases: TClength,
      test_type: subType,
      test_name: [inpName, outName], // ?
      accept_language: selectedLanguages,
      limit: {
        time: time,
        memory: memo,
      },
      mode: {
        mode: 0,
        case: true,
        trim_endl: false,
      },
      point_per_testcase: point_per_testcase,
      judger: judgers,
      roles: ["@everyone"],
    };

    // let id = "";
    try {
      const res = await axios.patch(`${apiUrl}/api/problem/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status > 300 || res.status < 200) {
        throw new Error(`PATCH /problem/${id} error: ${res.data}`);
      }

      console.log("Success:", res.data);
      setWarningMessage("");
      // id = res.data.id;
    } catch (error) {
      setWarningMessage("Uploading Error " + error);
      console.error(error);
    }

    if (uploadedFile)
      try {
        const form_data = new FormData();
        form_data.append("file", uploadedFile);

        const res = await axios.patch(
          `${apiUrl}/api/problem/${id}/docs`,
          form_data,
          {
            headers: {
              "Content-Type": "application/pdf",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status > 300 || res.status < 200) {
          throw new Error(`PATCH /problem/${id}/docs error: ${res.data}`);
        }

        console.log("Success:", res.data);
        setWarningMessage("");
      } catch (error) {
        setWarningMessage("Uploading Docs Error " + error);
        console.error(error);
      }

    if (uploadedZip) {
      try {
        const form_data = new FormData();
        form_data.append("file", uploadedZip);
        const response = await axios.patch(
          `${apiUrl}/api/problem/${id}/testcases`,
          form_data,
          {
            headers: {
              "Content-Type": "application/zip",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status > 300 || response.status < 200) {
          throw new Error(
            `POST /problem/${id}/testcases error: ${response.data}`
          );
        }

        setCreated(true);
        console.log("Upload successful:", response.data);
        setWarningMessage("");
      } catch (error) {
        setWarningMessage("Uploading Zip Error " + error);
        console.error("Error uploading zip: ", error);
      }
    }
  };

  const deleteProblem = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/api/problem/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status > 300 || res.status < 200) {
        throw new Error(`DELETE "problem" error: ${res.data}`);
      }
      console.log("Success:", res.data);
    } catch (error) {
      setWarningMessage("Delete Error " + error);
      console.error("Error deleting problem: ", error);
    }
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
      {popup && (
        <div className="popHolder">
          <div className="outer" onClick={togglePopup}>
            {" "}
          </div>
          <div className="popup">
            {uploadedFile && (
              <embed
                src={URL.createObjectURL(uploadedFile)}
                width="100%"
                height="100%"
              />
            )}
          </div>
        </div>
      )}
      <div className="frame">
        <div className="Question">
          <div className="nametag">Question</div>
          <div className="topLocal">
            <input
              value={title}
              id="titleDiv"
              className="TITLE"
              placeholder="Problem Title"
              onChange={titleChange}
            />
          </div>
          <h4 className="num1">Question</h4>
          {uploadedFile && (
            <button className="addDocs del" onClick={deleteDocs}>
              <BiSolidTrashAlt color="black" size={15} />
            </button>
          )}
          <label htmlFor="file-upload" className="custom-file-label">
            Upload <FaUpload />
          </label>
          <input
            id="file-upload"
            className="custom-file-input"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              uploadDocs(e);
              handleInputChange(e);
            }}
          />
          <div className="renderQ">
            {uploadedFile && (
              <div className="Uploaded" onClick={togglePopup}>
                <p>File uploaded!</p>
              </div>
            )}
            {/* {!uploadedFile && Pdf && (
              <div className="Uploaded" onClick={togglePopup}>
                <p>Image uploaded!</p>
              </div>
            )} */}
            <textarea
              className="textQ"
              placeholder="description here!"
              value={question}
              onChange={(e) => {
                getQuestionValue(e);
                handleInputChange(e);
              }}
            ></textarea>
            {question && (
              <div className="renderholder">
                <h3 className="renderTitle">
                  <div className="divider"></div>
                  Render
                </h3>
                <div className="render">
                  <ReactMarkdown className="text">{question}</ReactMarkdown>
                </div>
              </div>
            )}
            <div className="divider"></div>
            <div className="judgerHolder">
              <h4>Judger (not required) </h4>
              <textarea
                className="textQ"
                placeholder="Add additional jugder here!"
                value={judgers}
                onChange={(e) => {
                  handleInputChange(e);
                  Judger(e);
                }}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="Testcase">
          <div className="nametag">Testcase</div>
          <div className="tcHolder">
            <h4>
              <span className="Bold">Number</span> of testcases:{" "}
              <input
                className="tcn"
                type="number"
                value={TClength}
                onChange={(e) => {
                  testcaseAmount(e);
                  handleInputChange(e);
                }}
              />
            </h4>
            <div className="pptHolder">
              <h5>Point per testcases:</h5>
              <input
                type="number"
                className="ppt"
                value={point_per_testcase}
                onChange={(e) => {
                  handlePointsChange(e);
                  handleInputChange(e);
                }}
              />
            </div>
            <div className="langchoice">
              <p>Accepting languages: </p>
              <div className="langc">{renderLanguages()}</div>
            </div>
            <div className="divider"></div>
            <div className="testtype">
              <p>Submission type</p>
              <div>
                <label className="ttype">
                  <input
                    type="radio"
                    checked={subType === "file"}
                    name="submissionType"
                    value="file"
                    onChange={(e) => {
                      submissionType(e);
                      handleInputChange(e);
                    }}
                  />
                  <span></span> <div>file</div>
                </label>
                <label className="ttype">
                  <input
                    type="radio"
                    name="submissionType"
                    value="std"
                    checked={subType === "std"}
                    onChange={(e) => {
                      submissionType(e);
                      handleInputChange(e);
                    }}
                  />
                  <span></span> <div>std</div>
                </label>
              </div>
            </div>
            <div className="contrains">
              <div className="timeCon">
                <h5>Run Time limit (in seconds)</h5>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => {
                    Timechange(e);
                    handleInputChange(e);
                  }}
                />
              </div>
              <div className="memoryCon">
                <h5>Memory limit</h5>
                <input
                  placeholder="1024m"
                  type="text"
                  ho
                  value={memo}
                  onChange={(e) => {
                    MemoryChange(e);
                    handleInputChange(e);
                  }}
                />
              </div>
              <div className="inpOut">
                <h5>Input file name</h5>
                <textarea
                  value={inpName}
                  className="textQ smaller"
                  placeholder="example.inp"
                  onChange={inpNameChange}
                />
                <h5>Output file name</h5>
                <textarea
                  value={outName}
                  className="textQ smaller"
                  placeholder="example.out"
                  onChange={outNameChange}
                />
              </div>
              <div className="divider"></div>
              <div className="testcaseUpload">
                <div className="dropzoneT">Upload New Testcases</div>
                <div
                  className={`dropzone ${isDragging ? "dragging" : ""}`}
                  onDragOver={DragOver}
                  onDragEnter={DragEnter}
                  onDragLeave={DragLeave}
                  onDrop={(e) => {
                    handleDrop(e);
                    handleInputChange(e);
                  }}
                >
                  <p className="DragnDrop">
                    Drag and drop to upload or click
                    <label
                      htmlFor="zip-upload"
                      className="custom-file-label-side"
                    >
                      Here <FaUpload />
                    </label>
                    <input
                      id="zip-upload"
                      className="custom-file-input"
                      type="file"
                      accept=".zip"
                      onChange={(e) => {
                        zipUpload(e);
                        handleInputChange(e);
                      }}
                    />
                    {uploadedZip && <div className="tcAdded">added!</div>}
                    {warningMessage && (
                      <div className="warning-message">
                        <box-icon name="no-entry" color="#ff9e65"></box-icon>
                        {warningMessage}
                      </div>
                    )}
                    {created && (
                      <div class="okay">Problem created successfully.</div>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {changesMade && <p class="warning">Changes haven't been save.</p>}{" "}
      <button
        className="savebtn"
        type="submit"
        onClick={(e) => {
          handleSave(e);
          disableWarning(e);
        }}
      >
        <IoSaveSharp /> Save
      </button>
      <Link to="/problems">
        <button
          className="savebtn kill"
          type="submit"
          onClick={(e) => {
            deleteProblem(e);
          }}
        >
          <FaTrash />
        </button>
      </Link>
    </div>
  );
}

export default ConfigItem;
