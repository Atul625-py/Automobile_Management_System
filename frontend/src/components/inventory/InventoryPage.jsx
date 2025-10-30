import React, { useEffect, useState, useContext } from "react";
import styles from "./InventoryPage.module.css";
import { AuthContext } from "../context/AuthContext";
import { Trash2, Save } from "lucide-react";

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

  const [editQuantities, setEditQuantities] = useState({}); // store editable quantities

  // ✅ Fetch all inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data);

      // initialize editable values
      const initial = {};
      data.forEach((item) => {
        initial[item.partId] = item.quantityAvailable;
      });
      setEditQuantities(initial);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ✅ Add new inventory item (ADMIN only)
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

  // ✅ Update stock directly with new value
  const handleUpdateQuantity = async (partId) => {
    const newQuantity = parseInt(editQuantities[partId], 10);
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      const res = await fetch(`/api/inventory/${partId}/set_quantity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update quantity");
    }
  };

  // ✅ Delete item (ADMIN only)
  const handleDelete = async (partId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/inventory/${partId}`, {
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

      {/* ✅ ADMIN can add items */}
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

      {/* ✅ Inventory Table */}
      <section className={styles.inventoryList}>
        <h2>Current Inventory</h2>
        {inventory.length === 0 ? (
          <p>No inventory items found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Part ID</th>
                <th>Part Name</th>
                <th>Quantity</th>
                <th>Unit Price (₹)</th>
                {userRole === "ADMIN" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.partId}>
                  <td>{item.partId}</td>
                  <td>{item.name}</td>

                  {/* ✅ Editable quantity input */}
                  <td>
                    <div className={styles.quantityEdit}>
                      <input
                        type="number"
                        value={editQuantities[item.partId] || ""}
                        onChange={(e) =>
                          setEditQuantities({
                            ...editQuantities,
                            [item.partId]: e.target.value,
                          })
                        }
                        className={styles.quantityInput}
                      />
                      {userRole === "ADMIN" && (
                        <button
                          className={styles.saveBtn}
                          onClick={() => handleUpdateQuantity(item.partId)}
                          title="Save quantity"
                        >
                          <Save size={16} />
                        </button>
                      )}
                    </div>
                  </td>

                  <td>{item.unitPrice}</td>

                  {/* ✅ Delete button for ADMIN */}
                  {userRole === "ADMIN" && (
                    <td>
                      <button
                        onClick={() => handleDelete(item.partId)}
                        className={styles.deleteBtn}
                        title="Delete item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
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
