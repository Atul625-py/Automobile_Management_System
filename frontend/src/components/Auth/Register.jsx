import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const { userRole, isAuthenticated } = useContext(AuthContext);
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

    // ✅ Only ADMIN or RECEPTIONIST can access this page
    if (!isAuthenticated || !["ADMIN", "RECEPTIONIST"].includes(userRole)) {
        navigate("/");
        return null;
    }

    // ✅ Update form fields
    const handleChange = (e, index, field) => {
        if (field === "middleNames" || field === "emails") {
            const list = [...formData[field]];
            list[index] = e.target.value;
            setFormData({ ...formData, [field]: list });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const handleAddField = (field) =>
        setFormData({ ...formData, [field]: [...formData[field], ""] });

    const handleRemoveField = (field, index) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData({ ...formData, [field]: list });
    };

    // ✅ Step 1 validation
    const validateStep1 = () => {
        const err = {};

        if (!formData.username.trim()) err.username = "Username required";
        if (!formData.firstName.trim()) err.firstName = "First name required";
        if (!formData.lastName.trim()) err.lastName = "Last name required";

        if (!formData.role) err.role = "Role is required";

        if (!formData.emails.some((e) => e.includes("@")))
            err.emails = "At least one valid email required";

        if (formData.password.length < 6)
            err.password = "Password must be at least 6 characters";

        return err;
    };

    // ✅ Step 2 validation
    const validateStep2 = () => {
        const err = {};

        if (!formData.houseNo.trim()) err.houseNo = "House No required";
        if (!formData.street.trim()) err.street = "Street required";
        if (!formData.locality.trim()) err.locality = "Locality required";
        if (!formData.city.trim()) err.city = "City required";
        if (!formData.state.trim()) err.state = "State required";

        if (!/^\d{6}$/.test(formData.pinCode))
            err.pinCode = "Valid 6-digit Pincode required";

        return err;
    };

    const handleNext = (e) => {
        e.preventDefault();
        const err = validateStep1();
        if (Object.keys(err).length) setErrors(err);
        else setStep(2);
    };

    // ✅ Register user WITHOUT logging them in
    const handleRegister = async (e) => {
        e.preventDefault();
        const err = validateStep2();
        if (Object.keys(err).length) return setErrors(err);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: text };
            }

            if (response.ok) {
                alert("✅ User Registered Successfully!");
                navigate("/"); // ✅ Just redirect, NO login()
            } else {
                alert(data.message || "Registration failed.");
            }
        } catch (err) {
            alert("Something went wrong.");
            console.error(err);
        }
    };

    // ✅ Allowed roles
    const roleOptions =
        userRole === "ADMIN"
            ? [
                { value: "RECEPTIONIST", label: "RECEPTIONIST" },
                { value: "ADMIN", label: "ADMIN" },
            ]
            : [
                { value: "RECEPTIONIST", label: "RECEPTIONIST" } // receptionist can only create receptionists
            ];

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>{step === 1 ? "Step 1 - User Information" : "Step 2 - Address Details"}</h2>

                {/* ✅ STEP 1 */}
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
                            <label>Username</label>
                            {errors.username && <p className={styles.error}>{errors.username}</p>}
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
                            {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
                        </div>

                        {formData.middleNames.map((m, idx) => (
                            <div className={styles.inputGroup} key={idx}>
                                <input
                                    type="text"
                                    value={m}
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
                            {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
                        </div>

                        <div className={styles.inputGroup}>
                            <select name="role" value={formData.role} onChange={handleChange} required>
                                <option value="">Select Role</option>
                                {roleOptions.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
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
                            {errors.password && <p className={styles.error}>{errors.password}</p>}
                        </div>

                        <button className={styles.button} type="submit">
                            Next ➡️
                        </button>
                    </form>
                )}

                {/* ✅ STEP 2 */}
                {step === 2 && (
                    <form className={styles.form} onSubmit={handleRegister}>
                        {["houseNo", "street", "locality", "city", "state", "pinCode"].map((field) => (
                            <div className={styles.inputGroup} key={field}>
                                <input
                                    type="text"
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                />
                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                {errors[field] && <p className={styles.error}>{errors[field]}</p>}
                            </div>
                        ))}

                        <button className={styles.button} type="submit">
                            ✅ Register User
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
