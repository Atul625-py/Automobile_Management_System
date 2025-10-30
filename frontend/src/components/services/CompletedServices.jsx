import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const CompletedServices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/invoices", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
    })
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  return (
    <div className="service-page">
      <h2>✅ Completed Services</h2>
      <div className="service-table">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Appointment ID</th>
              <th>Tax %</th>
              <th>Labour Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoiceId}>
                <td>{inv.invoiceId}</td>
                <td>{inv.appointmentId}</td>
                <td>{inv.taxPercentage}%</td>
                <td>₹{inv.labourCost}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/invoice/view/${inv.invoiceId}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/invoice/edit/${inv.invoiceId}`)}
                  >
                    Edit
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

export default CompletedServices;
