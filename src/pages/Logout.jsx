import { useNavigate } from "react-router-dom";
import { useEffect } from "react"

export default function () {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(typeof localStorage.getItem("token"))
    localStorage.setItem("token", "")
    localStorage.setItem("userId", "")
    localStorage.setItem("username", "")
    navigate("/")
  })
}