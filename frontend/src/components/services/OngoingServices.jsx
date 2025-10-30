import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const OngoingServices = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/services", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
    })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const handleGenerateInvoice = (serviceId) => {
    navigate(`/invoice/generate/${serviceId}`);
  };

  return (
    <div className="service-page">
      <h2>🛠️ Ongoing Services</h2>
      <div className="service-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.serviceId}>
                <td>{s.serviceId}</td>
                <td>{s.serviceName}</td>
                <td>{s.description}</td>
                <td>
                  <button
                    className="btn-generate"
                    onClick={() => handleGenerateInvoice(s.serviceId)}
                  >
                    Generate Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OngoingServices;
