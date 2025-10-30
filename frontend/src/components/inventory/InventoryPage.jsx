import React, { useEffect, useState, useContext } from "react";
import styles from "./InventoryPage.module.css";
import { AuthContext } from "../context/AuthContext";
import { Trash2, PlusCircle, MinusCircle } from "lucide-react";

const InventoryPage = () => {
  const { userRole } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    quantityAvailable: "",
    unitPrice: "",
  });

  const [adjustQuantities, setAdjustQuantities] = useState({}); // store per-item adjustment values

  // ✅ Fetch all inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data);

      // initialize adjustments as empty
      const init = {};
      data.forEach((i) => (init[i.partId] = ""));
      setAdjustQuantities(init);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ✅ Add new item
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
      alert("✅ Item added successfully!");
      setNewItem({ name: "", quantityAvailable: "", unitPrice: "" });
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("❌ Could not add item");
    }
  };

  // ✅ Increase / Decrease stock
  const updateStock = async (partId, type) => {
    const qty = adjustQuantities[partId];
    if (!qty || isNaN(qty) || qty <= 0) {
      alert("Enter a valid quantity");
      return;
    }

    const endpoint =
      type === "increase"
        ? `/api/inventory/${partId}/increase?quantity=${qty}`
        : `/api/inventory/${partId}/decrease?quantity=${qty}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to update stock");
      fetchInventory();
      // reset this item’s adjust field
      setAdjustQuantities((prev) => ({ ...prev, [partId]: "" }));
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to ${type} stock`);
    }
  };

  // ✅ Delete item
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

      {/* ✅ Add Section */}
      {userRole === "ADMIN" && (
        <section className={styles.addSection}>
          <h2>Add New Inventory Item</h2>
          <form onSubmit={handleAddItem} className={styles.form}>
            <input
              type="text"
              placeholder="Part Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Initial Quantity"
              value={newItem.quantityAvailable}
              onChange={(e) =>
                setNewItem({ ...newItem, quantityAvailable: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Unit Price (₹)"
              value={newItem.unitPrice}
              onChange={(e) =>
                setNewItem({ ...newItem, unitPrice: e.target.value })
              }
              required
            />
            <button type="submit">➕ Add Item</button>
          </form>
        </section>
      )}

      {/* ✅ Table */}
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
                {userRole === "ADMIN" && <th>Adjust Stock</th>}
                {userRole === "ADMIN" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.partId}>
                  <td>{item.partId}</td>
                  <td>{item.name}</td>
                  <td>{item.quantityAvailable}</td>
                  <td>{item.unitPrice}</td>

                  {userRole === "ADMIN" && (
                    <>
                      <td className={styles.adjustCell}>
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={adjustQuantities[item.partId] ?? ""}
                          onChange={(e) =>
                            setAdjustQuantities({
                              ...adjustQuantities,
                              [item.partId]: e.target.value,
                            })
                          }
                          className={styles.adjustInput}
                        />
                        <div className={styles.adjustButtons}>
                          <button
                            onClick={() => updateStock(item.partId, "increase")}
                            className={styles.increaseBtn}
                            title="Add Stock"
                          >
                            <PlusCircle size={18} />
                          </button>
                          <button
                            onClick={() => updateStock(item.partId, "decrease")}
                            className={styles.decreaseBtn}
                            title="Remove Stock"
                          >
                            <MinusCircle size={18} />
                          </button>
                        </div>
                      </td>

                      <td>
                        <button
                          onClick={() => handleDelete(item.partId)}
                          className={styles.deleteBtn}
                          title="Delete Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
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
