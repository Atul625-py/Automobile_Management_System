import { useEffect, useState } from "react";
import styles from "./RemoveCustomer.module.css";

const RemoveCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetch("/api/users/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error(err));
  }, []);

  const handleRemove = (id) => {
    if (confirmId === id) {
      fetch(`/api/users/remove/${id}`, { method: "DELETE" })
        .then(() => {
          setCustomers(customers.filter((c) => c.id !== id));
          setConfirmId(null);
        })
        .catch((err) => console.error(err));
    } else {
      setConfirmId(id);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Remove Customers</h2>
      <ul className={styles.list}>
        {customers.map((c) => (
          <li key={c.id} className={styles.listItem}>
            <span>{c.name}</span>
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
