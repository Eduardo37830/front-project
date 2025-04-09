import React from "react";
import "./CodeVerfied.css";

const CodeVerified = ({ firstName, lastName }) => {
  return (
    <div className="code-verified-container">
      <h1>Inicio de Sesión Exitoso</h1>
      <p>
        Bienvenido a nuestro sistema,{" "}
        <strong>
          {firstName} {lastName}
        </strong>
        .
      </p>
    </div>
  );
};

export default CodeVerified;
