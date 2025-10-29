import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { AuthContext } from "../context/AuthContext";

const RegisterCustomer = () => {
  const { login, userRole, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    middleNames: [""],
    lastName: "",
    role: "",
    emails: [""],
    password: "",
    houseNo: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({});

  // Handle change for normal & array fields
  const handleChange = (e, index, field) => {
    if (field === "middleNames" || field === "emails") {
      const newValues = [...formData[field]];
      newValues[index] = e.target.value;
      setFormData({ ...formData, [field]: newValues });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleAddField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleRemoveField = (field, index) => {
    const newValues = [...formData[field]];
    newValues.splice(index, 1);
    setFormData({ ...formData, [field]: newValues });
  };

  // Step 1 validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.emails.some((email) => email.includes("@")))
      newErrors.emails = "At least one valid email required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.houseNo.trim()) newErrors.houseNo = "House No required";
    if (!formData.street.trim()) newErrors.street = "Street required";
    if (!formData.locality.trim()) newErrors.locality = "Locality required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!formData.state.trim()) newErrors.state = "State required";
    if (!/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = "Valid 6-digit Pincode required";
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setStep(2);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validateStep2();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("Submitting registration data:", formData);

      const headersToSend = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: headersToSend,
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text); // Try parsing JSON
      } catch {
        data = { message: text }; // fallback for non-JSON responses
      }

      console.log("Parsed response:", data);

      if (response.ok) {
        alert("🎉 Registration successful!");
        login(); // update auth context
        navigate("/");
      } else {
        alert(data.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // Restrict access
  if (isAuthenticated && userRole === "customer") {
    navigate("/");
    return null;
  }

  const roleOptions =
    userRole === "admin"
      ? [
          { value: "customer", label: "Customer" },
          { value: "manager", label: "Manager" },
          { value: "admin", label: "Admin" },
        ]
      : userRole === "manager"
      ? [{ value: "customer", label: "Customer" }]
      : [];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>
          {step === 1
            ? "Step 1 - Personal & Account Setup"
            : "Step 2 - Address Details"}
        </h2>

        {step === 1 && (
          <form className={styles.form} onSubmit={handleNext}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label>First Name</label>
              {errors.firstName && (
                <p className={styles.error}>{errors.firstName}</p>
              )}
            </div>

            {formData.middleNames.map((middle, idx) => (
              <div className={styles.inputGroup} key={idx}>
                <input
                  type="text"
                  value={middle}
                  onChange={(e) => handleChange(e, idx, "middleNames")}
                />
                <label>Middle Name {idx + 1}</label>
                {idx > 0 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveField("middleNames", idx)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleAddField("middleNames")}
            >
              ➕ Add More Middle Name
            </button>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <label>Last Name</label>
              {errors.lastName && (
                <p className={styles.error}>{errors.lastName}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.role && <p className={styles.error}>{errors.role}</p>}
            </div>

            {formData.emails.map((email, idx) => (
              <div className={styles.inputGroup} key={idx}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange(e, idx, "emails")}
                  required={idx === 0}
                />
                <label>Email {idx + 1}</label>
                {idx > 0 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveField("emails", idx)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleAddField("emails")}
            >
              ➕ Add More Email
            </button>
            {errors.emails && <p className={styles.error}>{errors.emails}</p>}

            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Password</label>
              {errors.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>

            <button className={styles.button} type="submit">
              Next ➡️
            </button>
          </form>
        )}

        {step === 2 && (
          <form className={styles.form} onSubmit={handleRegister}>
            {["houseNo", "street", "locality", "city", "state", "pinCode"].map(
              (field) => (
                <div className={styles.inputGroup} key={field}>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                  <label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {errors[field] && (
                    <p className={styles.error}>{errors[field]}</p>
                  )}
                </div>
              )
            )}

            <button className={styles.button} type="submit">
              Complete Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterCustomer;
