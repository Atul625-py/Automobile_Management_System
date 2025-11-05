import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AppointmentDetail.module.css";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointment, setAppointment] = useState(null);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [appRes, servRes, custRes, vehRes] = await Promise.all([
        fetch(`/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!appRes.ok) throw new Error("Failed to fetch appointment");

      const [appData, servData, custData, vehData] = await Promise.all([
        appRes.json(),
        servRes.json(),
        custRes.json(),
        vehRes.json(),
      ]);

      setAppointment(appData);
      setStatus(appData.status);
      setServices(servData);
      setCustomers(custData);
      setVehicles(vehData);
    } catch (err) {
      console.error("❌ Error loading details:", err);
      alert("Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      const res = await fetch(
        `/api/appointments/${id}/status?status=${status}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      alert("✅ Status updated successfully!");
      fetchData();
    } catch (err) {
      alert("Error updating status");
    }
  };

  // Utility: get display name for customer
  const getCustomerName = (userId) => {
    const c = customers.find((u) => u.customerId === userId);
    if (!c) return `User ${userId}`;
    return (
      `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() ||
      c.name ||
      `Customer ${userId}`
    );
  };

  // Utility: get vehicle description
  const getVehicleInfo = (vehicleId) => {
    const v = vehicles.find((veh) => veh.vehicleId === vehicleId);
    if (!v) return `Vehicle ${vehicleId}`;
    return `${v.registrationNo ?? v.regNo ?? "Reg?"} - ${v.brand ?? ""} ${
      v.model ?? ""
    }`.trim();
  };

  // Utility: get readable service names
  const getServiceNames = (ids) => {
    if (!ids?.length) return "None";
    return ids
      .map((sid) => {
        const s = services.find((srv) => srv.serviceId === sid);
        return s ? s.serviceName : `Service ${sid}`;
      })
      .join(", ");
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!appointment) return <p>No appointment found.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Appointment #{appointment.appointmentId}
      </h2>

      <div className={styles.detailBox}>
        <p>
          <strong>Customer:</strong> {getCustomerName(appointment.userId)}
        </p>
        <p>
          <strong>Vehicle:</strong> {getVehicleInfo(appointment.vehicleId)}
        </p>
        <p>
          <strong>Date & Time:</strong>{" "}
          {appointment.dateTime?.replace("T", " ")}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {appointment.createdAt?.replace("T", " ")}
        </p>

        <div className={styles.services}>
          <strong>Services:</strong> {getServiceNames(appointment.serviceIds)}
        </div>

        <div className={styles.statusBox}>
          <label>Status: </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.select}
          >
            <option value="BOOKED">BOOKED</option>
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <button className={styles.saveBtn} onClick={handleStatusChange}>
            Save Status
          </button>
        </div>

        <div className={styles.actionRow}>
          <button
            className={styles.invoiceBtn}
            onClick={() => navigate(`/invoice/${appointment.appointmentId}`)}
          >
            🧾 View / Edit Invoice
          </button>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
