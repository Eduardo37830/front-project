import { useState } from "react";
import "./App.css";
import Login from "./components/Auth/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import VerifyCode from "./components/Auth/VerifyCode";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
