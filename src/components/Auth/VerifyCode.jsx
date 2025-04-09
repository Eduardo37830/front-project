import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./login.css";
import "./VerifyCode.css";

const VerifyCode = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    code: "",
  });

  // Obtener el email del localStorage al montar el componente
  const [email, setEmail] = useState(() => localStorage.getItem("userEmail") || "");

  useEffect(() => {
    // Si no hay email en localStorage, redirigir al login (opcional)
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.code) {
      setError("Code is required");
      return;
    }

    if (!email) {
      setError("Email not found. Please log in again.");
      return;
    }

    const payload = {
      code: formData.code,
      email: email, // Usar el email del localStorage
    };

    console.log("Payload to send:", payload);
    dispatch(setLoading(true));

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Verification successful:", responseData);
        dispatch(setLoading(false));
        navigate("/dashboard");
      } else {
        console.error("Verification failed:", responseData);
        setError(responseData.message || "Invalid verification code.");
        dispatch(setLoading(false));
      }
    } catch (err) {
      console.error("Error during verification:", err);
      setError("An error occurred while verifying the code.");
      dispatch(setLoading(false));
    }
  };

  const handleResendCode = () => {
    // Aquí puedes implementar la lógica para reenviar el código
    // Esto probablemente implicará otra llamada a una API
    alert("Resend code functionality not implemented in this example.");
  };

  return (
    <div className="verify-container">
      <h2>Verification Code</h2>
      <p>We have sent a verification code to your number.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            placeholder="Enter the code"
            onChange={handleChange}
          />
          {error && <span className="field-error">{error}</span>}
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Verifying..." : "Continue"}
        </button>
      </form>
      <p>
        Didn’t receive the code?
        <span onClick={handleResendCode} className="resend-link">
          Resend code
        </span>
      </p>
    </div>
  );
};

export default VerifyCode;