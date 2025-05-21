import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GoogleCallback.css";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/upload");
    } else {
      alert("No token found in URL");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="google-callback-container">
      <div className="google-callback-message">
        Logging you in...
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default GoogleCallback;
