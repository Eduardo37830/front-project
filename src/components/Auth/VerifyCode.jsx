import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import "./login.css";
import "./VerifyCode.css";

const VerifyCode = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = React.useState({
    email: "",
    code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.code) {
      setError("Code is required");
      return;
    }

    const payload = {
      email: formData.email,
      code: formData.code,
    };

    console.log("Payload to send:", payload);
    dispatch(setLoading(true));
    // Add your API call here to send the payload
  };

  const handleResendCode = () => {
    alert("Code resent successfully");
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
