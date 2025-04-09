import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Papa from "papaparse";

const ITEMS_PER_PAGE = 10;

function Dashboard() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);

    // ✅ DATOS MOCK PARA PRUEBA
    useEffect(() => {
        const dummyData = [
        { documento: "123", ciudad: "Bogotá", dateUploaded: "2024-01-01", lastUpdated: "2024-02-01", uploadedBy: "Admin" },
        { documento: "456", ciudad: "Medellín", dateUploaded: "2024-01-02", lastUpdated: "2024-02-02", uploadedBy: "Admin" },
        { documento: "789", ciudad: "Cali", dateUploaded: "2024-01-03", lastUpdated: "2024-02-03", uploadedBy: "Admin" },
        ];
        setData(dummyData);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        setPaginatedData(data.slice(start, end));
      }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("CSV parsed:", results.data);
        setData(results.data);
        setCurrentPage(1);
      },
      error: function (err) {
        console.error("Error al parsear CSV:", err);
      },
    });
  };
  
  return (
    
    <div className="dashboard-container">
      <header className="dashboard-profile">
        <div className="avatar-circle">
          <span className="avatar-icon">👤</span>
          <input
            type="file"
            accept=".csv"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e)}
            />
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
            <div className="table-actions">
        {/* Input oculto para cargar CSV */}
        <input
            type="file"
            accept=".csv"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={handleFileUpload}/>
            <button
            className="btn green"
            onClick={() => document.getElementById("fileUpload").click()}>Upload
            </button>
        </div>           
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th></th>
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
                  <td><input type="checkbox" /></td>
                  <td>{item.CodigoEstacion}</td>
                  <td>{item.CodigoSensor}</td>
                  <td>{item.DescripcionSensor}</td>
                  <td>{item.FechaObservacion}</td>
                  <td>{item.Municipio}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Paginación funcional */}
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
