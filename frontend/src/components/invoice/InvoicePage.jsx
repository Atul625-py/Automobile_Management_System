// src/pages/InvoicePage.jsx
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inventory, setInventory] = useState([]); // list of all available parts

  // ---- Fetch all available inventory parts ----
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      } else {
        console.error("Failed to fetch inventory:", res.status);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  // ---- Fetch invoice ----
  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
        setTaxPercentage(data.taxPercentage ?? "");
        setLabourCost(data.labourCost ?? "");
        setUsedParts(
          Array.from(data.usedParts ?? []).map((p) => ({
            partId: p.partId ?? p.id ?? p.part?.partId ?? "",
            count: p.count ?? p.quantity ?? 0,
          }))
        );
      } else if (res.status === 404) {
        setInvoice(null);
        setTaxPercentage("");
        setLabourCost("");
        setUsedParts([]);
      } else {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Status ${res.status}`);
      }
    } catch (err) {
      console.warn("fetchInvoice:", err);
      setInvoice(null);
      setTaxPercentage("");
      setLabourCost("");
      setUsedParts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // ---- Helpers for used parts ----
  const addPartRow = () =>
    setUsedParts((p) => [...p, { partId: "", count: 1 }]);
  const removePartRow = (i) =>
    setUsedParts((p) => p.filter((_, idx) => idx !== i));
  const updatePartRow = (i, field, value) =>
    setUsedParts((p) =>
      p.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    );

  // ---- Save logic ----
  const handleSave = async () => {
    setSaving(true);
    try {
      if (usedParts.length === 0 && !invoice) {
        if (
          !window.confirm(
            "No used parts specified. Some backends require at least one part to create an invoice. Continue anyway?"
          )
        ) {
          setSaving(false);
          return;
        }
      }

      const invoiceDTO = {
        invoiceId: invoice?.invoiceId ?? undefined,
        appointmentId: Number(appointmentId),
        taxPercentage: taxPercentage === "" ? null : Number(taxPercentage),
        labourCost: labourCost === "" ? null : Number(labourCost),
        usedParts: usedParts.map((p) => ({
          partId: Number(p.partId),
          count: Number(p.count),
        })),
      };

      // ---- Update existing invoice ----
      if (invoice && invoice.invoiceId) {
        const putRes = await fetch(`/api/invoices/${invoice.invoiceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(invoiceDTO),
        });
        if (!putRes.ok) {
          const txt = await putRes.text().catch(() => "");
          throw new Error(txt || `PUT failed (${putRes.status})`);
        }
        alert("✅ Invoice updated successfully");
        await fetchInvoice();
        setSaving(false);
        return;
      }

      // ---- Create invoice using /parts endpoint ----
      if (usedParts.length > 0) {
        for (const p of usedParts) {
          if (!p.partId) {
            throw new Error("Each used part must have a selected part.");
          }
          const url = `/api/invoices/${appointmentId}/parts?partId=${p.partId}&count=${p.count}`;
          const partRes = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!partRes.ok) {
            const txt = await partRes.text().catch(() => "");
            throw new Error(
              `Failed to add part (partId=${p.partId}). ${
                txt || partRes.status
              }`
            );
          }
        }

        // Fetch created invoice
        await fetchInvoice();

        const res = await fetch(`/api/invoices/appointment/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invoice created but could not fetch it.");
        const created = await res.json();

        const updateRes = await fetch(`/api/invoices/${created.invoiceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...invoiceDTO,
            invoiceId: created.invoiceId,
          }),
        });
        if (!updateRes.ok) {
          const txt = await updateRes.text().catch(() => "");
          throw new Error(txt || "Failed to update invoice after creation.");
        }

        alert("✅ Invoice created & saved successfully");
        await fetchInvoice();
        setSaving(false);
        return;
      }

      throw new Error(
        "No invoice exists and no parts provided. Add at least one part or create invoice via backend."
      );
    } catch (err) {
      console.error("Invoice save error:", err);
      alert("❌ Error saving invoice: " + (err.message || err));
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading invoice...</p>;

  return (
    <div className={styles.container}>
      <h2>Invoice for appointment #{appointmentId}</h2>

      <div className={styles.row}>
        <label>Tax %</label>
        <input
          type="number"
          value={taxPercentage}
          onChange={(e) => setTaxPercentage(e.target.value)}
          placeholder="e.g. 18"
        />
      </div>

      <div className={styles.row}>
        <label>Labour Cost</label>
        <input
          type="number"
          value={labourCost}
          onChange={(e) => setLabourCost(e.target.value)}
          placeholder="e.g. 200.00"
        />
      </div>

      <hr />

      <h3>Used Parts</h3>
      <p className={styles.help}>
        Select parts from inventory below. You can add or remove rows as needed.
      </p>

      {usedParts.map((row, i) => (
        <div key={i} className={styles.partRow}>
          <select
            value={row.partId}
            onChange={(e) => updatePartRow(i, "partId", e.target.value)}
            className={styles.inputSmall}
          >
            <option value="">Select Part</option>
            {inventory.map((part) => (
              <option key={part.partId} value={part.partId}>
                {part.name} (Available: {part.quantityAvailable}, ₹
                {part.unitPrice})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="count"
            value={row.count}
            onChange={(e) => updatePartRow(i, "count", e.target.value)}
            className={styles.inputSmall}
            min="1"
          />
          <button
            type="button"
            onClick={() => removePartRow(i)}
            className={styles.removeBtn}
          >
            Remove
          </button>
        </div>
      ))}

      <div style={{ marginTop: 8 }}>
        <button type="button" onClick={addPartRow} className={styles.addBtn}>
          + Add Part
        </button>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleSave}
          disabled={saving}
          className={styles.saveBtn}
        >
          {saving ? "Saving..." : "💾 Save Invoice"}
        </button>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
