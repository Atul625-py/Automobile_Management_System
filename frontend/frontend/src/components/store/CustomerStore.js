// src/store/CustomerStore.js
export const CustomerStore = {
  token: localStorage.getItem("token"),

  async fetchCustomers() {
    try {
      const res = await fetch("/api/customers", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      return await res.json();
    } catch (err) {
      console.error("Error fetching customers:", err);
      return [];
    }
  },

  async addService(customerId, serviceData) {
    try {
      const res = await fetch(`/api/customers/${customerId}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(serviceData),
      });
      if (!res.ok) throw new Error("Failed to add service");
      return true;
    } catch (err) {
      console.error("Error adding service:", err);
      return false;
    }
  },

  async deleteCustomer(customerId) {
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!res.ok) throw new Error("Failed to delete customer");
      return true;
    } catch (err) {
      console.error("Error deleting customer:", err);
      return false;
    }
  },
};
