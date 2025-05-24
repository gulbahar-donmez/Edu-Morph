import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { authService } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    try {
      await authService.register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Kayıt işlemi başarısız oldu");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Kayıt Ol</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="Ad"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Soyad"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Kullanıcı Adı"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Şifre Tekrar"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Kayıt Ol</button>
        </form>
        <div className="login-link">
          Hesabınız var mı? <a href="/login">Giriş yap</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
