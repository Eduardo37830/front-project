import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";

const ITEMS_PER_PAGE = 10;

function Dashboard() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [error, setError] = useState(null); // Nuevo estado para manejar errores
  const fileInputRef = useRef(null);


  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("csv-file", file); // Asegúrate de que coincida con el nombre del campo esperado por multer en el backend

      fetch("http://localhost:3000/api/v1/towns/batch", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("CSV uploaded successfully");
            // Recargar los datos después de la carga exitosa
            // ¡POSIBLE AJUSTE! Si el POST a /batch devuelve los datos actualizados, puedes usar eso.
            // Si no, es posible que necesites hacer otra petición GET al endpoint de datos.
            fetch("http://localhost:3000/api/v1/towns/") // Ejemplo: Volver a obtener los datos
              .then((res) => res.json())
              .then((fetchedData) => {
                setData(fetchedData);
                setCurrentPage(1);
              })
              .catch((error) => {
                console.error("Error al recargar datos:", error);
              });
          } else {
            console.error("Error uploading CSV:", response.status);
            // Puedes mostrar un mensaje de error al usuario aquí
          }
        })
        .catch((error) => {
          console.error("Error uploading CSV:", error);
          // Puedes mostrar un mensaje de error al usuario aquí
        });

      // Limpiar el input de archivo después de la carga (opcional)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click(); // Simula el click en el input de tipo file
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-profile">
        <div className="avatar-circle">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="profile-info">
          <h2>BIENVENIDO/A!</h2>
          <h1>ADMINISTRADOR</h1>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="table-section">
          <div className="table-header">
            <h2>Información departamental y capital</h2>
            <div className="table-actions">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              <button className="btn green" onClick={handleUploadButtonClick}>
                Upload
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Documento</th>
                <th>Ciudad</th>
                <th>Date uploaded</th>
                <th>Last updated</th>
                <th>Uploaded by</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{item.documento}</td>
                  <td>{item.ciudad}</td>
                  <td>{item.dateUploaded}</td>
                  <td>{item.lastUpdated}</td>
                  <td>{item.uploadedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;