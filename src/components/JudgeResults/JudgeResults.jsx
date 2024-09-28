import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router-dom";
import "./JudgeResults.css";

export default function () {
  const apiUrl = localStorage.getItem("apiUrl");
  // const queueID = localStorage.getItem("queue_id");
  const { queueID } = useParams();
  const { lastJsonMessage, lastMessage } = useWebSocket(
    `${apiUrl}/api/judge/${queueID}`.replace("http", "ws")
  );
  const [msgHistory, setMsgHistory] = useState([]);
  const [overall, setOverall] = useState({});

  const statusCodes = [
    "ACCEPTED",
    "WRONG_ANSWER",
    "TIME_LIMIT_EXCEEDED",
    "MEMORY_LIMIT_EXCEEDED",
    "JUDGER_ERROR",
    "RUNTIME_ERROR",
    "COMPILE_ERROR",
    "SYSTEM_ERROR",
    "UNKNOWN_ERROR"
];

  useEffect(() => {
    if (
      lastJsonMessage !== null &&
      (lastJsonMessage.status === "result" ||
      lastJsonMessage.status === "overall")
    ) {
      setMsgHistory((prev) => prev.concat(lastJsonMessage));
      if (lastJsonMessage.status === "overall") 
        setOverall(lastJsonMessage);
    }
  }, [lastMessage]);


  return (
    <div className="wsResult">
      <h1 className="Title">Judge Results</h1>
      <div className="Results">
        {msgHistory.length == 0 && (
          <div className="resBox" key="firstMess">
            Waiting for Judge Results....
          </div>
        )}
        {overall !== ({}) && 
          (<div>
            <p className="Overall">Overall: {statusCodes[overall.data?.status]}, {overall.data?.time[0].toFixed(3)}s </p>
          </div>)
        }
        {msgHistory.map((msg, idx) => (
          <div className="resBox" key={idx}>
            {msg.status === "result" && (
              <div>
                <p>
                  Testcase #{msg.data?.position}: {msg.data?.status} [
                  {msg.data?.time.toFixed(3)}s, {msg.data?.memory[1]} MB]{" "}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
