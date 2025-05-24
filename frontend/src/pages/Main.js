import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div className="main-card">
        <h1>EduMorph</h1>
        <button onClick={() => navigate("/login")}>Giriş Yap</button>
        <button onClick={() => navigate("/register")}>Üye Ol</button>
      </div>
    </div>
  );
}

export default Main;
