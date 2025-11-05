import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./InvoicePage.module.css";

const InvoicePage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [invoice, setInvoice] = useState(null);
  const [taxPercentage, setTaxPercentage] = useState("");
  const [labourCost, setLabourCost] = useState("");
  const [usedParts, setUsedParts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanics, setSelectedMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Utility for fetch
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ---- Fetch all needed data once ----
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchInventory(), fetchMechanics()]);
        await fetchInvoice(); // Only after data is loaded
      } catch (err) {
        console.error("Init error:", err);
        setMessage("⚠️ Failed to load invoice details.");
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // ---- Fetch inventory ----
  const fetchInventory = async () => {
    const res = await fetch("/api/inventory", { headers: authHeaders });
    if (!res.ok) throw new Error("Failed to fetch inventory");
    setInventory(await res.json());
  };

  // ---- Fetch mechanics ----
  const fetchMechanics = async () => {
    const res = await fetch("/api/mechanics", { headers: authHeaders });
    if (!res.ok) throw new Error("Failed to fetch mechanics");
    setMechanics(await res.json());
  };

  // ---- Fetch invoice for this appointment ----
  const fetchInvoice = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/invoices/appointment/${appointmentId}`, {
        headers: authHeaders,
      });

      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
        setTaxPercentage(data.taxPercentage ?? "");
        setLabourCost(data.labourCost ?? "");
        setUsedParts(
          (data.usedParts || []).map((p) => ({
            partId: p.partId ?? "",
            count: p.count ?? 0,
          }))
        );
        setSelectedMechanics((data.mechanics || []).map((m) => m.mechanicId));
      } else if (res.status === 404) {
        // No invoice yet for this appointment
        setInvoice(null);
        setTaxPercentage("");
        setLabourCost("");
        setUsedParts([]);
        setSelectedMechanics([]);
        setMessage("🧾 No invoice yet. You can create one below.");
      } else {
        const msg = await res.text();
        throw new Error(msg || `Fetch failed (${res.status})`);
      }
    } catch (err) {
      console.error("fetchInvoice:", err);
      setMessage("⚠️ Could not fetch invoice.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Part manipulation ----
  const addPartRow = () => setUsedParts((prev) => [...prev, { partId: "", count: 1 }]);
  const removePartRow = (index) => setUsedParts((prev) => prev.filter((_, i) => i !== index));
  const updatePartRow = (index, field, value) =>
    setUsedParts((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );

  // ---- Mechanics selection ----
  const handleMechanicToggle = (id) => {
    setSelectedMechanics((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  // ---- Save (create or update) ----
  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const invoiceDTO = {
      invoiceId: invoice?.invoiceId ?? undefined,
      appointmentId: Number(appointmentId),
      taxPercentage: Number(taxPercentage) || 0,
      labourCost: Number(labourCost) || 0,
      usedParts: usedParts.map((p) => ({
        partId: Number(p.partId),
        count: Number(p.count),
      })),
      mechanics: selectedMechanics.map((id) => ({ mechanicId: id })),
    };

    const method = invoice ? "PUT" : "POST";
    const url = invoice
      ? `/api/invoices/${invoice.invoiceId}`
      : `/api/invoices`;

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(invoiceDTO),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `${method} failed (${res.status})`);
      }

      setMessage(invoice ? "✅ Invoice updated successfully!" : "✅ Invoice created successfully!");
      await fetchInvoice();
    } catch (err) {
      console.error("Invoice save error:", err);
      setMessage(`❌ ${err.message || "Error saving invoice"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading invoice...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Invoice for Appointment #{appointmentId}</h2>
        {message && <div className={styles.message}>{message}</div>}

        <div className={styles.formRow}>
          <label>Tax Percentage</label>
          <input
            type="number"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(e.target.value)}
            placeholder="e.g. 18"
          />
        </div>

        <div className={styles.formRow}>
          <label>Labour Cost (₹)</label>
          <input
            type="number"
            value={labourCost}
            onChange={(e) => setLabourCost(e.target.value)}
            placeholder="e.g. 200"
          />
        </div>

        <hr />
        <h3>Assigned Mechanics</h3>
        <p className={styles.help}>Select all mechanics who worked on this appointment.</p>

        <div className={styles.mechanicGrid}>
          {mechanics.map((m) => (
            <label key={m.mechanicId} className={styles.mechanicItem}>
              <input
                type="checkbox"
                checked={selectedMechanics.includes(m.mechanicId)}
                onChange={() => handleMechanicToggle(m.mechanicId)}
              />
              {m.firstName} {m.lastName} ({m.city})
            </label>
          ))}
        </div>

        <hr />
        <h3>Used Parts</h3>

        {usedParts.map((row, i) => (
          <div key={i} className={styles.partRow}>
            <select
              value={row.partId}
              onChange={(e) => updatePartRow(i, "partId", e.target.value)}
              className={styles.select}
            >
              <option value="">Select Part</option>
              {inventory.map((part) => (
                <option key={part.partId} value={part.partId}>
                  {part.name} — ₹{part.unitPrice} ({part.quantityAvailable} left)
                </option>
              ))}
            </select>

            <input
              type="number"
              value={row.count}
              onChange={(e) => updatePartRow(i, "count", e.target.value)}
              min="1"
              className={styles.countInput}
            />
            <button type="button" onClick={() => removePartRow(i)} className={styles.removeBtn}>
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addPartRow} className={styles.addBtn}>
          + Add Part
        </button>

        <div className={styles.actions}>
          <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
            {saving ? "Saving..." : "💾 Save Invoice"}
          </button>

          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
