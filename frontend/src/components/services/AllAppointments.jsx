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

  // Utility function: convert array → map
  const toMap = (arr, idKey, labelFn) =>
    arr.reduce((acc, item) => ({ ...acc, [item[idKey]]: labelFn(item) }), {});

  // Fetch lookup data (customers, vehicles, services)
  const fetchLookupData = async () => {
    try {
      const [custRes, vehRes, servRes] = await Promise.all([
        fetch("/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [custData, vehData, servData] = await Promise.all([
        custRes.json(),
        vehRes.json(),
        servRes.json(),
      ]);

      // Customer map: name
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

      // Vehicle map: registration + model
      setVehicles(
        toMap(vehData, "vehicleId", (v) =>
          `${v.registrationNo ?? v.regNo ?? "Reg?"} - ${v.brand ?? ""} ${
            v.model ?? ""
          }`.trim()
        )
      );

      // Service map: service name
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

  // Fetch appointments (based on filter)
  const fetchAppointments = async (status = "ALL") => {
    setLoading(true);
    try {
      let url = "/api/appointments";
      if (status !== "ALL") url = `/api/appointments/status/${status}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  // On mount: load data
  useEffect(() => {
    fetchLookupData();
    fetchAppointments();
  }, []);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `/api/appointments/${id}/status?status=${newStatus}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      alert("✅ Status updated successfully");
      fetchAppointments(filterStatus);
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("Could not update status");
    }
  };

  // Navigate to Edit Page
  const handleEdit = (id) => {
    navigate(`/edit-appointment/${id}`);
  };

  // Generate invoice
  const handleGenerateInvoice = (id) => {
    alert(`🧾 Invoice generated for appointment #${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>📋 All Appointments</h1>

      {/* Filter Section */}
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

      {/* Table Section */}
      {loading ? (
        <p className={styles.loading}>Loading appointments...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Service</th>
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
                  <td>{services[a.serviceId] || `Service ${a.serviceId}`}</td>
                  <td>{a.dateTime?.replace("T", " ")}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleStatusChange(a.appointmentId, e.target.value)
                      }
                      className={`${styles.statusDropdown} ${
                        styles[a.status.toLowerCase()]
                      }`}
                    >
                      <option value="BOOKED">BOOKED</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td>
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
