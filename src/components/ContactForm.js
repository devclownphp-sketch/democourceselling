"use client";

import { useState } from "react";
import { IconCheck, IconStar, IconSend, IconYoutube, IconInstagram, IconMapPin, IconMail, IconPhone } from "@/components/Icons";

const initialState = {
    name: "",
    email: "",
    phone: "",
    message: "",
};

const socialItems = [
    { key: "youtubeUrl", icon: <IconYoutube size={18} />, label: "YouTube" },
    { key: "instagramUrl", icon: <IconInstagram size={18} />, label: "Instagram" },
    { key: "facebookUrl", icon: <span style={{ fontWeight: 700, fontSize: "14px" }}>f</span>, label: "Facebook" },
];

export default function ContactForm({ businessProfile }) {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({ type: "", message: "" });

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setResult({ type: "", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Submission failed.");
            }

            setForm(initialState);
            setResult({ type: "success", message: "Thank you! Your message has been delivered." });
        } catch (error) {
            setResult({ type: "error", message: error.message || "Could not submit your message. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-form-wrapper">
            <div className="contact-form-card">
                <div className="contact-form-grid">
                    <div className="contact-info-panel">
                        <div className="contact-info-header">
                            <p>Get in Touch</p>
                            <h2>Let's Connect</h2>
                            <p className="contact-info-subtext">
                                {businessProfile.contactSubtext || "Get in touch with us for any questions about our courses."}
                            </p>
                        </div>

                        <div className="contact-stats-banner">
                            <div className="contact-stat-item">
                                <p className="contact-stat-number">40K+</p>
                                <p className="contact-stat-label">Students</p>
                            </div>
                            <div className="contact-stat-divider" />
                            <div className="contact-stat-item">
                                <p className="contact-stat-number">4.7★</p>
                                <p className="contact-stat-label">Rating</p>
                            </div>
                        </div>

                        <div className="contact-details">
                            <div className="contact-detail-item">
                                <div className="contact-detail-icon"><IconPhone size={18} /></div>
                                <div>
                                    <p className="contact-detail-label">Phone</p>
                                    <p className="contact-detail-value">{businessProfile.supportPhone}</p>
                                </div>
                            </div>

                            <div className="contact-detail-item">
                                <div className="contact-detail-icon"><IconMail size={18} /></div>
                                <div>
                                    <p className="contact-detail-label">Email</p>
                                    <p className="contact-detail-value">{businessProfile.supportEmail}</p>
                                </div>
                            </div>

                            <div className="contact-detail-item">
                                <div className="contact-detail-icon"><IconMapPin size={18} /></div>
                                <div>
                                    <p className="contact-detail-label">Address</p>
                                    <p className="contact-detail-value">{businessProfile.addressLine}</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-social">
                            <p className="contact-social-label">Follow Us</p>
                            <div className="contact-social-links">
                                {socialItems
                                    .filter((item) => Boolean(businessProfile[item.key]))
                                    .map((item) => (
                                        <a
                                            key={item.key}
                                            href={businessProfile[item.key]}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="contact-social-btn"
                                            aria-label={item.label}
                                        >
                                            {item.icon}
                                        </a>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-panel">
                        {businessProfile.mapEmbedUrl && (
                            <div className="contact-map-embed">
                                <iframe
                                    title="Business Location"
                                    src={businessProfile.mapEmbedUrl}
                                    className="contact-map-iframe"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        )}

                        <div className="contact-form-header">
                            <h3>Send us a message</h3>
                            <p>Fill in the form below and we'll get back to you shortly.</p>
                        </div>

                        <form onSubmit={onSubmit} className="contact-form">
                            <div className="contact-form-row">
                                <div className="contact-form-field">
                                    <label>Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={onChange}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="contact-form-field">
                                    <label>Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={onChange}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="contact-form-field">
                                <label>Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="contact-form-field">
                                <label>Message</label>
                                <textarea
                                    required
                                    name="message"
                                    value={form.message}
                                    onChange={onChange}
                                    rows={4}
                                    placeholder="Tell us what's on your mind..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="contact-submit-btn"
                            >
                                <IconSend size={18} />
                                {loading ? "Sending..." : "Send Message"}
                            </button>

                            {result.message && (
                                <div className={`contact-result ${result.type}`}>
                                    <IconCheck size={18} />
                                    {result.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <div className="contact-quick-cards">
                <div className="contact-quick-card">
                    <div className="contact-quick-icon"><IconPhone size={24} /></div>
                    <h4>Call Us</h4>
                    <p>{businessProfile.supportPhone}</p>
                </div>
                <div className="contact-quick-card">
                    <div className="contact-quick-icon"><IconMail size={24} /></div>
                    <h4>Email Us</h4>
                    <p>{businessProfile.supportEmail}</p>
                </div>
                <div className="contact-quick-card">
                    <div className="contact-quick-icon"><IconMapPin size={24} /></div>
                    <h4>Visit Us</h4>
                    <p>{businessProfile.addressLine}</p>
                </div>
            </div>
        </div>
    );
}
