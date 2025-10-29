import { useEffect, useState } from "react";
import styles from "./RemoveManager.module.css";

const RemoveManager = () => {
  const [managers, setManagers] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetch("/api/users/managers")
      .then((res) => res.json())
      .then((data) => setManagers(data))
      .catch((err) => console.error(err));
  }, []);

  const handleRemove = (id) => {
    if (confirmId === id) {
      fetch(`/api/users/remove/${id}`, { method: "DELETE" })
        .then(() => {
          setManagers(managers.filter((m) => m.id !== id));
          setConfirmId(null);
        })
        .catch((err) => console.error(err));
    } else {
      setConfirmId(id);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Remove Managers</h2>
      <ul className={styles.list}>
        {managers.map((m) => (
          <li key={m.id} className={styles.listItem}>
            <span>{m.name}</span>
            <button
              className={`${styles.button} ${
                confirmId === m.id ? styles.confirm : ""
              }`}
              onClick={() => handleRemove(m.id)}
            >
              {confirmId === m.id ? "Click Again to Confirm" : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemoveManager;
