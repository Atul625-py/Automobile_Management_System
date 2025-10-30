import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Invoice.css";

const InvoicePage = ({ mode }) => {
  const { id } = useParams(); // serviceId or invoiceId
  const [invoice, setInvoice] = useState({
    taxPercentage: "",
    labourCost: "",
    usedParts: [],
  });

  useEffect(() => {
    if (mode === "view" || mode === "edit") {
      fetch(`/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
        .then((res) => res.json())
        .then((data) => setInvoice(data))
        .catch((err) => console.error("Error fetching invoice:", err));
    }
  }, [id, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      mode === "generate" ? `/api/invoices/${id}/parts` : `/api/invoices/${id}`;
    const method = mode === "generate" ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(invoice),
    });

    alert(
      mode === "generate"
        ? "Invoice Generated Successfully"
        : "Invoice Updated Successfully"
    );
  };

  return (
    <div className="invoice-page">
      <h2>
        {mode === "generate"
          ? "🧾 Generate Invoice"
          : mode === "view"
          ? "📄 View Invoice"
          : "✏️ Edit Invoice"}
      </h2>

      <form onSubmit={handleSubmit} className="invoice-form">
        <label>Tax Percentage</label>
        <input
          type="number"
          value={invoice.taxPercentage}
          onChange={(e) =>
            setInvoice({ ...invoice, taxPercentage: e.target.value })
          }
          disabled={mode === "view"}
        />

        <label>Labour Cost</label>
        <input
          type="number"
          value={invoice.labourCost}
          onChange={(e) =>
            setInvoice({ ...invoice, labourCost: e.target.value })
          }
          disabled={mode === "view"}
        />

        {mode !== "view" && (
          <button type="submit" className="btn-save">
            {mode === "generate" ? "Generate Invoice" : "Save Changes"}
          </button>
        )}
      </form>
    </div>
  );
};

export default InvoicePage;
