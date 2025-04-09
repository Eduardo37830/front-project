import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";

const ITEMS_PER_PAGE = 10;
const PAGINATION_LIMIT = 3; // Número de botones de página a mostrar

function Dashboard() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("csv-file", file);

      fetch("http://localhost:3000/api/v1/towns/batch", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("CSV uploaded successfully");
            fetch("http://localhost:3000/api/v1/towns/")
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
          }
        })
        .catch((error) => {
          console.error("Error uploading CSV:", error);
        });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - Math.floor(PAGINATION_LIMIT / 2));
    const end = Math.min(totalPages, start + PAGINATION_LIMIT - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/towns/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
      });
  }, []);

  if (error) {
    return <div>Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.</div>;
  }

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
                <th>name</th>
                <th>departament</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.department.name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="page-btn arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {getPaginationNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`page-btn ${currentPage === pageNumber ? "active" : ""}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              className="page-btn arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;