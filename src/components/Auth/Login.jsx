import { Card, Spin, Typography } from "antd";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../../api/auth";
import { setLoading, setUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./login.css";

const { Title } = Typography;

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    current_password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  console.log(`${isAuthenticated}`);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validación de password
    if (!formData.current_password) {
      newErrors.current_password = "Password is required";
    } else if (formData.current_password.length < 6) {
      newErrors.current_password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    // Si el objeto de errores está vacío, el form es válido
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const response = await auth.signIn(formData);
      console.log(response);
      // Simular éxito en la autenticación
      dispatch(setUser({ isAuthenticated: true, token: "fake-token" }));
      navigate("/verify-code");
    } catch (error) {
      setLoginError("Invalid email or password");
      console.log("Error en el login", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    // Capturar nombre del input y valor que el usuario esté asignando
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //classname es original de react

  return (
    <div
      className="login-container"
      style={{ maxWith: 400, margin: "0 auto", marginTop: 50 }}
    >
      <Title level={2} style={{ textAlign: "center" }}>
        Login
      </Title>
      <form onSubmit={handleSubmit}>
        {/* Input de email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            onChange={handleChange}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        {/* input de password */}
        <div className="form-group">
          <label htmlFor="current_password">Password</label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            value={formData.current_password}
            placeholder="Enter your password"
            onChange={handleChange}
          />
          {errors.current_password && (
            <span className="field-error">{errors.current_password}</span>
          )}
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <Spin /> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
