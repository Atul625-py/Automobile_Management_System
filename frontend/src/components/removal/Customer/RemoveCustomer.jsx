import { useEffect, useState } from "react";
import styles from "./RemoveCustomer.module.css";

const RemoveCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomers();
  }, [token]);

  // Handle customer removal
  const handleRemove = async (id) => {
    if (confirmId === id) {
      try {
        const res = await fetch(`/api/customers/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to delete customer");
        setCustomers(customers.filter((c) => c.id !== id));
        setConfirmId(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      setConfirmId(id);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🗑️ Remove Customers</h2>
      <ul className={styles.list}>
        {customers.map((c) => (
          <li key={c.id} className={styles.listItem}>
            <span>{`${c.firstName} ${c.lastName}`}</span>
            <button
              className={`${styles.button} ${
                confirmId === c.id ? styles.confirm : ""
              }`}
              onClick={() => handleRemove(c.id)}
            >
              {confirmId === c.id ? "Click Again to Confirm" : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemoveCustomer;
