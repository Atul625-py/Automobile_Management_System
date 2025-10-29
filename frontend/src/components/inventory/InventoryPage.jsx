// src/pages/InventoryPage.jsx
import React, { useEffect, useState, useContext } from "react";
import styles from "./InventoryPage.module.css";
import { AuthContext } from "../context/AuthContext"; // you said you'll change import

const InventoryPage = () => {
  const { userRole } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: "",
  });

  // Fetch all inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Add new inventory item (ADMIN)
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add item");
      setNewItem({ name: "", description: "", quantity: "" });
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("❌ Could not add item");
    }
  };

  // Increase or Decrease stock
  const updateStock = async (id, action) => {
    const quantity = parseInt(prompt("Enter quantity to update:"), 10);
    if (!quantity || quantity <= 0) return;

    try {
      const res = await fetch(
        `/api/inventory/${id}/${action}?quantity=${quantity}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to update stock");
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update stock");
    }
  };

  // Delete item (ADMIN)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete item");
    }
  };

  if (loading) return <p className={styles.loading}>Loading inventory...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🧾 Inventory Management</h1>

      {/* Only Admin can add items */}
      {userRole === "ADMIN" && (
        <section className={styles.addSection}>
          <h2>Add New Item</h2>
          <form onSubmit={handleAddItem} className={styles.form}>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              required
            />
            <button type="submit">➕ Add Item</button>
          </form>
        </section>
      )}

      {/* Inventory List */}
      <section className={styles.inventoryList}>
        <h2>Current Inventory</h2>
        {inventory.length === 0 ? (
          <p>No inventory items found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Part Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {/* Admin can increase/decrease, Manager can only decrease */}
                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => updateStock(item.id, "increase")}
                        className={styles.increaseBtn}
                      >
                        ⬆️ Increase
                      </button>
                    )}
                    <button
                      onClick={() => updateStock(item.id, "decrease")}
                      className={styles.decreaseBtn}
                    >
                      ⬇️ Decrease
                    </button>
                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={styles.deleteBtn}
                      >
                        ❌ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default InventoryPage;
