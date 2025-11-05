import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AllAppointments.module.css";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState({});
  const [vehicles, setVehicles] = useState({});
  const [services, setServices] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Convert array to object map
  const toMap = (arr, idKey, labelFn) =>
    arr.reduce((acc, item) => ({ ...acc, [item[idKey]]: labelFn(item) }), {});

  // Fetch lookup data
  const fetchLookupData = async () => {
    try {
      const [custRes, vehRes, servRes] = await Promise.all([
        fetch("/api/customers", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/vehicles", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/services", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [custData, vehData, servData] = await Promise.all([
        custRes.json(),
        vehRes.json(),
        servRes.json(),
      ]);

      setCustomers(
        toMap(
          custData,
          "customerId",
          (c) =>
            `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() ||
            c.name ||
            `Customer ${c.customerId}`
        )
      );

      setVehicles(
        toMap(
          vehData,
          "vehicleId",
          (v) =>
            `${v.registrationNo ?? v.regNo ?? "Reg?"} - ${v.brand ?? ""} ${
              v.model ?? ""
            }`.trim()
        )
      );

      setServices(
        toMap(
          servData,
          "serviceId",
          (s) => s.serviceName ?? s.name ?? `Service ${s.serviceId}`
        )
      );
    } catch (err) {
      console.error("❌ Error fetching lookup data:", err);
    }
  };

  // Fetch appointments
  const fetchAppointments = async (status = "ALL") => {
    setLoading(true);
    try {
      let url = "/api/appointments";
      if (status !== "ALL") url = `/api/appointments/status/${status}`;

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLookupData();
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure invoice exists, then navigate
  const ensureInvoiceAndNavigate = async (appointmentId) => {
    try {
      const res = await fetch(`/api/invoices/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        // No invoice yet, create one
        const createRes = await fetch("/api/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentId: Number(appointmentId),
            taxPercentage: 0,
            labourCost: 0,
            usedParts: [],
            mechanics: [],
          }),
        });

        if (!createRes.ok) {
          throw new Error("Failed to create invoice");
        }
      }

      navigate(`/invoice/${appointmentId}`);

    } catch (err) {
      console.error("❌ Error creating/navigating invoice:", err);
      alert("Could not generate invoice. Please try again.");
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/appointments/${id}/status?status=${newStatus}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to update status");
      alert("✅ Status updated successfully");
      fetchAppointments(filterStatus);

      if (newStatus === "COMPLETED") {
        await ensureInvoiceAndNavigate(id);
      }
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("Could not update status");
    }
  };

  const handleEdit = (id) => navigate(`/edit-appointment/${id}`);
  const handleViewDetails = (id) => navigate(`/appointment-details/${id}`);
  const handleGenerateInvoice = (id) => ensureInvoiceAndNavigate(id);

  const getServiceNames = (serviceIds) => {
    if (!serviceIds || serviceIds.length === 0) return "—";
    return serviceIds.map((id) => services[id] ?? `Service ${id}`).join(", ");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>📋 All Appointments</h1>

      <div className={styles.filterRow}>
        <label className={styles.label}>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            fetchAppointments(e.target.value);
          }}
          className={styles.select}
        >
          <option value="ALL">All</option>
          <option value="BOOKED">Booked</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading appointments...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Services</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.appointmentId}>
                  <td>{a.appointmentId}</td>
                  <td>{customers[a.userId] || `User ${a.userId}`}</td>
                  <td>{vehicles[a.vehicleId] || `Vehicle ${a.vehicleId}`}</td>
                  <td>{getServiceNames(a.serviceIds)}</td>
                  <td>{a.dateTime?.replace("T", " ")}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleStatusChange(a.appointmentId, e.target.value)
                      }
                      className={`${styles.statusDropdown} ${
                        styles[a.status?.toLowerCase()] || ""
                      }`}
                    >
                      <option value="BOOKED">BOOKED</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => handleViewDetails(a.appointmentId)}
                      className={styles.viewBtn}
                    >
                      🔍 View
                    </button>
                    <button
                      onClick={() => handleEdit(a.appointmentId)}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    {a.status === "COMPLETED" && (
                      <button
                        onClick={() => handleGenerateInvoice(a.appointmentId)}
                        className={styles.invoiceBtn}
                      >
                        🧾 Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllAppointments;
