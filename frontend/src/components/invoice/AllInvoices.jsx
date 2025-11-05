import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AllInvoices.module.css";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [mechanics, setMechanics] = useState({});
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Common header
  const headers = { Authorization: `Bearer ${token}` };

  // Utility: turn array into lookup map
  const toMap = (arr, idKey, labelFn) =>
    arr.reduce((acc, item) => ({ ...acc, [item[idKey]]: labelFn(item) }), {});

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices", { headers });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();

      const sorted = [...data].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setInvoices(sorted);
    } catch (err) {
      console.error("❌ Error fetching invoices:", err);
      alert("Failed to load invoices");
    }
  };

  // Fetch mechanics and inventory for name resolution
  const fetchLookups = async () => {
    try {
      const [mechRes, invRes] = await Promise.all([
        fetch("/api/mechanics", { headers }),
        fetch("/api/inventory", { headers }),
      ]);
      if (!mechRes.ok || !invRes.ok) throw new Error("Failed to fetch lookups");

      const [mechData, invData] = await Promise.all([mechRes.json(), invRes.json()]);

      setMechanics(
        toMap(
          mechData,
          "mechanicId",
          (m) => `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || `Mechanic ${m.mechanicId}`
        )
      );

      setInventory(
        toMap(
          invData,
          "partId",
          (p) => p.name ?? `Part ${p.partId}`
        )
      );
    } catch (err) {
      console.error("❌ Error fetching lookup data:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchInvoices(), fetchLookups()]);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewInvoice = (appointmentId) => {
    navigate(`/invoice/${appointmentId}`);
  };

  // Convert mechanic IDs to names
  const getMechanicNames = (mechList) => {
    if (!mechList || mechList.length === 0) return "—";
    return mechList
      .map((m) => mechanics[m.mechanicId] || `Mechanic ${m.mechanicId}`)
      .join(", ");
  };

  // Convert used part IDs to names
  const getPartNames = (partList) => {
    if (!partList || partList.length === 0) return "—";
    return partList
      .map((p) => `${inventory[p.partId] || `Part ${p.partId}`} (x${p.count})`)
      .join(", ");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🧾 All Invoices</h1>

      {loading ? (
        <p className={styles.loading}>Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className={styles.noData}>No invoices found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Appointment ID</th>
              <th>Tax %</th>
              <th>Labour Cost</th>
              <th>Mechanics</th>
              <th>Used Parts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoiceId}>
                <td>{inv.invoiceId}</td>
                <td>{inv.appointmentId}</td>
                <td>{inv.taxPercentage ?? 0}%</td>
                <td>₹{inv.labourCost ?? 0}</td>
                <td>{getMechanicNames(inv.mechanics)}</td>
                <td>{getPartNames(inv.usedParts)}</td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => handleViewInvoice(inv.appointmentId)}
                  >
                    🔍 View / Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllInvoices;
