"use client";

import { useState } from "react";

export default function ReviewModal({ isOpen, onClose }) {
    const [form, setForm] = useState({ name: "", role: "", reviewText: "", rating: 5 });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/public/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess(true);
            setForm({ name: "", role: "", reviewText: "", rating: 5 });
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <div className="review-modal-header">
                    <h3>Share Your Experience</h3>
                    <button className="review-modal-close" onClick={onClose}>✕</button>
                </div>

                <form className="review-modal-form" onSubmit={handleSubmit}>
                    <div className="review-form-row">
                        <div className="review-form-field">
                            <label>Your Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="review-form-field">
                            <label>Your Role</label>
                            <input
                                type="text"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                placeholder="Student, Developer, etc."
                            />
                        </div>
                    </div>

                    <div className="review-form-field">
                        <label>Your Rating</label>
                        <div className="review-stars-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setForm({ ...form, rating: star })}
                                    className={`star-btn ${star <= form.rating ? "active" : ""}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="review-form-field">
                        <label>Your Review *</label>
                        <textarea
                            value={form.reviewText}
                            onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                            placeholder="Share your experience with our courses..."
                            rows={4}
                            required
                        />
                    </div>

                    {error && <div className="review-error">{error}</div>}
                    {success && <div className="review-success">Thank you! Your review has been submitted.</div>}

                    <button type="submit" className="review-submit-btn" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>

            <style>{`
                .review-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .review-modal {
                    background: #ffffff;
                    border: 4px solid #000000;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 550px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 12px 12px 0 #ffd400;
                }

                .review-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    background: #ffd400;
                    border-bottom: 4px solid #000;
                }

                .review-modal-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: #000;
                }

                .review-modal-close {
                    width: 36px;
                    height: 36px;
                    border: 3px solid #000;
                    border-radius: 50%;
                    background: #000;
                    color: #fff;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .review-modal-close:hover {
                    background: #333;
                }

                .review-modal-form {
                    padding: 1.5rem;
                }

                .review-form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .review-form-field {
                    margin-bottom: 1rem;
                }

                .review-form-field label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #333;
                    margin-bottom: 0.5rem;
                }

                .review-form-field input,
                .review-form-field textarea {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    background: #f5f5f5;
                    transition: all 0.2s ease;
                }

                .review-form-field input:focus,
                .review-form-field textarea:focus {
                    outline: none;
                    background: #fff;
                    box-shadow: 4px 4px 0 #000;
                }

                .review-stars-input {
                    display: flex;
                    gap: 0.5rem;
                }

                .star-btn {
                    width: 44px;
                    height: 44px;
                    border: 3px solid #000;
                    border-radius: 50%;
                    background: #f5f5f5;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #ccc;
                }

                .star-btn.active {
                    background: #ffd400;
                    color: #000;
                    box-shadow: 3px 3px 0 #000;
                }

                .star-btn:hover {
                    transform: scale(1.1);
                }

                .review-error {
                    padding: 0.75rem;
                    background: #fef2f2;
                    border: 2px solid #ef4444;
                    border-radius: 8px;
                    color: #ef4444;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .review-success {
                    padding: 0.75rem;
                    background: #ecfdf5;
                    border: 2px solid #10b981;
                    border-radius: 8px;
                    color: #10b981;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .review-submit-btn {
                    width: 100%;
                    padding: 1rem;
                    background: #000;
                    color: #ffd400;
                    border: 4px solid #000;
                    border-radius: 16px;
                    font-size: 1rem;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 6px 6px 0 #ffd400;
                    transition: all 0.2s ease;
                }

                .review-submit-btn:hover:not(:disabled) {
                    transform: translate(-3px, -3px);
                    box-shadow: 9px 9px 0 #ffd400;
                }

                .review-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                [data-theme="dark"] .review-modal {
                    background: #1a1a2e;
                    border-color: #ffd400;
                }

                [data-theme="dark"] .review-modal-header {
                    background: #ffd400;
                }

                [data-theme="dark"] .review-modal-header h3 {
                    color: #000;
                }

                [data-theme="dark"] .review-form-field label {
                    color: #b0b0b0;
                }

                [data-theme="dark"] .review-form-field input,
                [data-theme="dark"] .review-form-field textarea {
                    background: #111;
                    color: #fff;
                    border-color: #ffd400;
                }

                [data-theme="dark"] .review-form-field input::placeholder,
                [data-theme="dark"] .review-form-field textarea::placeholder {
                    color: #888;
                }

                @media (max-width: 600px) {
                    .review-form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}