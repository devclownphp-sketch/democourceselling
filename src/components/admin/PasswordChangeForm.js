"use client";

import { useState } from "react";

export default function PasswordChangeForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Password change failed.");
            }

            setCurrentPassword("");
            setNewPassword("");
            setMessage("Password changed successfully.");
        } catch (submitError) {
            setError(submitError.message || "Password change failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="panel form-grid" onSubmit={onSubmit}>
            <h3>Change Password</h3>
            <label>
                Current Password
                <input
                    required
                    minLength={6}
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                />
            </label>
            <label>
                New Password
                <input
                    required
                    minLength={6}
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                />
            </label>
            <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
            </button>
            {message ? <p className="success-text">{message}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
        </form>
    );
}
