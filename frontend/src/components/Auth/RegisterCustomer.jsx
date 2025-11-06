import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { AuthContext } from "../context/AuthContext";

const RegisterCustomer = () => {
    const { userRole, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: "",
        middleNames: [""],
        lastName: "",
        emails: [""],
        houseNo: "",
        street: "",
        locality: "",
        city: "",
        pinCode: "",
    });

    const [errors, setErrors] = useState({});

    // Only ADMIN & RECEPTIONIST allowed
    if (!isAuthenticated || !["ADMIN", "RECEPTIONIST"].includes(userRole)) {
        navigate("/");
        return null;
    }

    const handleChange = (e, idx, field) => {
        if (field === "middleNames" || field === "emails") {
            const list = [...formData[field]];
            list[idx] = e.target.value;
            setFormData({ ...formData, [field]: list });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addField = (field) =>
        setFormData({ ...formData, [field]: [...formData[field], ""] });

    const removeField = (field, idx) => {
        const list = [...formData[field]];
        list.splice(idx, 1);
        setFormData({ ...formData, [field]: list });
    };

    // Validation
    const validateStep1 = () => {
        const err = {};
        if (!formData.firstName.trim()) err.firstName = "First name required";
        if (!formData.lastName.trim()) err.lastName = "Last name required";
        if (!formData.emails.some((e) => e.includes("@")))
            err.emails = "At least one valid email required";
        return err;
    };

    const validateStep2 = () => {
        const err = {};
        if (!formData.houseNo.trim()) err.houseNo = "House No required";
        if (!formData.street.trim()) err.street = "Street required";
        if (!formData.locality.trim()) err.locality = "Locality required";
        if (!formData.city.trim()) err.city = "City required";
        if (!/^\d{6}$/.test(formData.pinCode))
            err.pinCode = "Valid 6-digit Pincode required";
        return err;
    };

    const nextStep = (e) => {
        e.preventDefault();
        const err = validateStep1();
        if (Object.keys(err).length) return setErrors(err);
        setErrors({});
        setStep(2);
    };

    const submitCustomer = async (e) => {
        e.preventDefault();
        const err = validateStep2();
        if (Object.keys(err).length) return setErrors(err);

        try {
            const response = await fetch("/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const raw = await response.text();
            let data;
            try {
                data = JSON.parse(raw);
            } catch {
                data = { message: raw };
            }

            if (response.ok) {
                alert("✅ Customer Registered Successfully!");
                navigate("/customers");
            } else {
                alert(data.message || "Registration failed!");
            }
        } catch (err) {
            alert("Something went wrong!");
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>{step === 1 ? "Customer Information" : "Address Details"}</h2>

                {/* STEP 1 ------------------------------------------------- */}
                {step === 1 && (
                    <form className={styles.form} onSubmit={nextStep}>
                        {/* --- First Name --- */}
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

                        {/* --- Multiple Middle Names --- */}
                        {formData.middleNames.map((name, idx) => (
                            <div className={styles.inputGroup} key={idx}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => handleChange(e, idx, "middleNames")}
                                />
                                <label>Middle Name {idx + 1}</label>
                                {idx > 0 && (
                                    <button
                                        type="button"
                                        className={styles.removeButton}
                                        onClick={() => removeField("middleNames", idx)}
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className={styles.addButton}
                            onClick={() => addField("middleNames")}
                        >
                            ➕ Add Middle Name
                        </button>

                        {/* --- Last Name --- */}
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

                        {/* --- Multiple Emails --- */}
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
                                        onClick={() => removeField("emails", idx)}
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className={styles.addButton}
                            onClick={() => addField("emails")}
                        >
                            ➕ Add Email
                        </button>
                        {errors.emails && <p className={styles.error}>{errors.emails}</p>}

                        <button type="submit" className={styles.button}>
                            Next ➡️
                        </button>
                    </form>
                )}

                {/* STEP 2 -------------------------------------------------- */}
                {step === 2 && (
                    <form className={styles.form} onSubmit={submitCustomer}>
                        {["houseNo", "street", "locality", "city", "pinCode"].map(
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
                                        {field
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (s) => s.toUpperCase())}
                                    </label>
                                    {errors[field] && (
                                        <p className={styles.error}>{errors[field]}</p>
                                    )}
                                </div>
                            )
                        )}

                        <button className={styles.button} type="submit">
                            ✅ Register Customer
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterCustomer;
