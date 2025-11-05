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

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchInventory(), fetchMechanics()]);
        await fetchInvoice();
      } catch (err) {
        console.error("Init error:", err);
        setMessage("⚠️ Failed to load invoice details.");
      }
    };
    init();
  }, [appointmentId]);

  const fetchInventory = async () => {
    const res = await fetch("/api/inventory", { headers: authHeaders });
    if (!res.ok) throw new Error("Failed to fetch inventory");
    setInventory(await res.json());
  };

  const fetchMechanics = async () => {
    const res = await fetch("/api/mechanics", { headers: authHeaders });
    if (!res.ok) throw new Error("Failed to fetch mechanics");
    setMechanics(await res.json());
  };

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

  const addPartRow = () =>
    setUsedParts((prev) => [...prev, { partId: "", count: 1 }]);
  const removePartRow = (index) =>
    setUsedParts((prev) => prev.filter((_, i) => i !== index));
  const updatePartRow = (index, field, value) =>
    setUsedParts((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );

  const handleMechanicToggle = (id) => {
    setSelectedMechanics((prev) =>
      prev.includes(id)
        ? prev.filter((mid) => mid !== id)
        : [...prev, id]
    );
  };

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

      setMessage(
        invoice
          ? "✅ Invoice updated successfully!"
          : "✅ Invoice created successfully!"
      );
      await fetchInvoice();
    } catch (err) {
      console.error("Invoice save error:", err);
      setMessage(`❌ ${err.message || "Error saving invoice"}`);
    } finally {
      setSaving(false);
    }
  };

  // ✅ PRINTABLE INVOICE FUNCTION
  const handlePrintInvoice = () => {
    if (!usedParts.length && !labourCost) {
      alert("⚠️ Please add parts or labour cost before printing the invoice.");
      return;
    }

    const partDetails = usedParts.map((p) => {
      const part = inventory.find((x) => x.partId === Number(p.partId));
      const name = part?.name || `Part ${p.partId}`;
      const unit = part?.unitPrice || 0;
      const total = unit * (Number(p.count) || 0);
      return { name, count: p.count, unit, total };
    });

    const partsTotal = partDetails.reduce((sum, p) => sum + p.total, 0);
    const subtotal = partsTotal + (Number(labourCost) || 0);
    const tax = (subtotal * (Number(taxPercentage) || 0)) / 100;
    const grandTotal = subtotal + tax;

    const assignedMechanics = mechanics
      .filter((m) => selectedMechanics.includes(m.mechanicId))
      .map((m) => `${m.firstName} ${m.lastName} (${m.city})`)
      .join(", ") || "—";

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice for Appointment #${appointmentId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            h1, h2, h3 { text-align: center; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th { background-color: #f3f6fa; }
            .totals {
              margin-top: 20px;
              width: 50%;
              float: right;
              border-collapse: collapse;
            }
            .totals td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            .totals tr:last-child td {
              font-weight: bold;
              background: #f8f8f8;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 14px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <h1>RKVK Automobiles</h1>
          <h2>Invoice for Appointment #${appointmentId}</h2>
          <h3>Date: ${new Date().toLocaleDateString()}</h3>
          <h3>Serviced by: ${assignedMechanics}</h3>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Part Name</th>
                <th>Quantity</th>
                <th>Unit Price (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${
                partDetails.length > 0
                  ? partDetails
                      .map(
                        (p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${p.name}</td>
                  <td>${p.count}</td>
                  <td>${p.unit}</td>
                  <td>${p.total}</td>
                </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="5" style="text-align:center;">No spare parts used</td></tr>`
              }
            </tbody>
          </table>

          <table class="totals">
            <tr><td>Spare Parts Total</td><td>₹${partsTotal.toFixed(2)}</td></tr>
            <tr><td>Labour Cost</td><td>₹${Number(labourCost).toFixed(2)}</td></tr>
            <tr><td>Tax (${taxPercentage || 0}%)</td><td>₹${tax.toFixed(2)}</td></tr>
            <tr><td><strong>Grand Total</strong></td><td><strong>₹${grandTotal.toFixed(2)}</strong></td></tr>
          </table>

          <div class="footer">
            <p>Thank you for choosing RKVK Automobiles!</p>
            <p>Visit again for your next service.</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
            <button
              type="button"
              onClick={() => removePartRow(i)}
              className={styles.removeBtn}
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addPartRow} className={styles.addBtn}>
          + Add Part
        </button>

        <div className={styles.actions}>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.saveBtn}
          >
            {saving ? "Saving..." : "💾 Save Invoice"}
          </button>

          <button onClick={handlePrintInvoice} className={styles.printBtn}>
            🖨️ Print / Save as PDF
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
