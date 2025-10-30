import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { login, userRole, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
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

  //  Handle change for both normal and array fields
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

  //  Add new field for middle names/emails
  const handleAddField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  //  Remove field for middle names/emails
  const handleRemoveField = (field, index) => {
    const newValues = [...formData[field]];
    newValues.splice(index, 1);
    setFormData({ ...formData, [field]: newValues });
  };

  // Step 1 validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "username is required";
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), //  send arrays
      });

      const data = await response.json();

      // if (response.ok && data.token) {
      //   // localStorage.setItem("token", data.token);
      //   console.log("respose received successfully", data);
      //   login(); // Update auth context
      //   alert("🎉 Registration complete & Verified!");
      //   navigate("/");
      // } else {
      //   alert(data.message || "Registration failed!");
      //   console.log("registration failed for some reason ", data);
      // }
    } catch (err) {
      console.error(err);
      // alert("Something went wrong. Please try again.");
      // navigate("/");
    }
  };
  // if (response.ok) {
  //   alert("🎉 Registration complete! Please wait for verification email.");
  //
  // }

  // Restrict access: if a customer tries to open register, redirect them
  if (isAuthenticated && userRole === "customer") {
    navigate("/"); // redirect away
    return null;
  }

  // Role options based on who is logged in
  const roleOptions =
    userRole === "ADMIN"
      ? [
          { value: "customer", label: "Customer" },
          { value: "RECEPTIONIST", label: "RECEPTIONIST" },
          { value: "ADMIN", label: "ADMIN" },
        ]
      : userRole === "RECEPTIONIST"
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

        {/* Step 1 */}
        {step === 1 && (
          <form className={styles.form} onSubmit={handleNext}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label>username</label>
              {errors.username && (
                <p className={styles.error}>{errors.username}</p>
              )}
            </div>
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

            {/*  Multiple Middle Names */}
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

            {/*  Multiple Emails */}
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

        {/* Step 2 */}
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

export default Register;
