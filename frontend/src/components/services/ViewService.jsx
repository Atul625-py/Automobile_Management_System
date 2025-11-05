import React, { useEffect, useState } from "react";
import styles from "./ViewService.module.css";

const ViewService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      alert("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🧰 Available Services</h1>

      {loading ? (
        <p className={styles.loading}>Loading services...</p>
      ) : services.length === 0 ? (
        <p className={styles.noData}>No services found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service ID</th>
              <th>Service Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.serviceId}>
                <td>{service.serviceId}</td>
                <td className={styles.name}>{service.serviceName}</td>
                <td className={styles.desc}>
                  {service.description || "— No description —"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewService;
