"use client";

import { useState } from "react";

export default function AdminContactsClient({ initialContacts, canDelete }) {
    const [contacts, setContacts] = useState(initialContacts || []);
    const [selectedContact, setSelectedContact] = useState(null);
    const [deleting, setDeleting] = useState("");

    const deleteContact = async (id) => {
        if (!window.confirm("Delete this contact message?")) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            setContacts((prev) => prev.filter((c) => c.id !== id));
            if (selectedContact?.id === id) setSelectedContact(null);
        } catch {
            alert("Failed to delete contact.");
        } finally {
            setDeleting("");
        }
    };

    const deleteAllContacts = async () => {
        if (!window.confirm(`Delete ALL ${contacts.length} contact messages? This cannot be undone.`)) return;
        setDeleting("all");
        try {
            const res = await fetch("/api/admin/contacts?all=true", { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            setContacts([]);
            setSelectedContact(null);
        } catch {
            alert("Failed to delete contacts.");
        } finally {
            setDeleting("");
        }
    };

    return (
        <>
            <section className="panel stack-md">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                    <h1>{"📩"} Contact Submissions ({contacts.length})</h1>
                    {canDelete !== false && contacts.length > 0 && (
                        <button
                            onClick={deleteAllContacts}
                            disabled={deleting === "all"}
                            style={{
                                padding: "0.5rem 1.25rem", background: "#ef4444", color: "#fff",
                                border: "3px solid #000", borderRadius: "12px", fontWeight: 700,
                                fontSize: "0.85rem", cursor: "pointer", boxShadow: "3px 3px 0 #000",
                                opacity: deleting === "all" ? 0.6 : 1, transition: "all 0.2s ease"
                            }}
                        >
                            {deleting === "all" ? "Deleting..." : "🗑️ Delete All"}
                        </button>
                    )}
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>{"👤"} Name</th>
                                <th>{"📧"} Email</th>
                                <th>{"📱"} Phone</th>
                                <th>{"💬"} Message</th>
                                <th>{"📅"} Date</th>
                                {canDelete !== false && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td className="msg-cell">
                                        <button
                                            className="view-message-btn"
                                            onClick={() => setSelectedContact(item)}
                                        >
                                            View Message
                                        </button>
                                    </td>
                                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                                    {canDelete !== false && (
                                        <td>
                                            <button
                                                onClick={() => deleteContact(item.id)}
                                                disabled={deleting === item.id}
                                                style={{
                                                    padding: "0.4rem 0.8rem", background: "#fee2e2", color: "#dc2626",
                                                    border: "2px solid #dc2626", borderRadius: "8px", fontWeight: 700,
                                                    fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s ease",
                                                    opacity: deleting === item.id ? 0.5 : 1
                                                }}
                                            >
                                                {deleting === item.id ? "..." : "🗑️"}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {contacts.length === 0 && (
                                <tr><td colSpan={canDelete !== false ? 6 : 5} className="empty-row">{"📦"} No contact entries yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {selectedContact && (
                <div className="message-modal-overlay" onClick={() => setSelectedContact(null)}>
                    <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="message-modal-header">
                            <h3>Contact Message Details</h3>
                            <button className="message-modal-close" onClick={() => setSelectedContact(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="message-modal-content">
                            <div className="message-detail">
                                <label>Name</label>
                                <p>{selectedContact.name}</p>
                            </div>
                            <div className="message-detail">
                                <label>Email</label>
                                <p>{selectedContact.email}</p>
                            </div>
                            <div className="message-detail">
                                <label>Phone</label>
                                <p>{selectedContact.phone}</p>
                            </div>
                            <div className="message-detail">
                                <label>Date</label>
                                <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="message-detail message-full">
                                <label>Message</label>
                                <p>{selectedContact.message}</p>
                            </div>
                        </div>
                        <div className="message-modal-footer">
                            <a
                                href={`mailto:${selectedContact.email}?subject=Re: Your inquiry&body=${encodeURIComponent(selectedContact.message)}`}
                                className="reply-btn"
                            >
                                Reply via Email
                            </a>
                            {canDelete !== false && (
                                <button
                                    onClick={() => deleteContact(selectedContact.id)}
                                    disabled={deleting === selectedContact.id}
                                    style={{
                                        padding: "0.75rem 1.5rem", background: "#ef4444", color: "#fff",
                                        border: "3px solid #000", borderRadius: "12px", fontWeight: 700,
                                        cursor: "pointer", boxShadow: "4px 4px 0 #000", transition: "all 0.2s ease"
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                            )}
                            <button className="close-btn" onClick={() => setSelectedContact(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .view-message-btn {
                    background: #ffd400;
                    color: #000;
                    border: 2px solid #000;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 3px 3px 0 #000;
                }

                .view-message-btn:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 5px 5px 0 #000;
                }

                .message-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .message-modal {
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 8px 8px 0 #000;
                }

                .message-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    border-bottom: 3px solid #000;
                    background: #ffd400;
                }

                .message-modal-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 800;
                }

                .message-modal-close {
                    background: #000;
                    color: #fff;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .message-modal-close:hover {
                    background: #333;
                }

                .message-modal-content {
                    padding: 1.5rem;
                }

                .message-detail {
                    margin-bottom: 1rem;
                }

                .message-detail label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #666;
                    margin-bottom: 0.25rem;
                }

                .message-detail p {
                    margin: 0;
                    font-size: 0.95rem;
                    color: #0f172a;
                }

                .message-full p {
                    background: #f5f5f5;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 2px solid #e2e8f0;
                    white-space: pre-wrap;
                    word-break: break-word;
                }

                .message-modal-footer {
                    display: flex;
                    gap: 1rem;
                    padding: 1.25rem 1.5rem;
                    border-top: 3px solid #000;
                    background: #f8f9fc;
                }

                .reply-btn {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    background: #2563eb;
                    color: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 4px 4px 0 #000;
                }

                .reply-btn:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0 #000;
                }

                .close-btn {
                    padding: 0.75rem 1.5rem;
                    background: #fff;
                    color: #000;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 4px 4px 0 #000;
                }

                .close-btn:hover {
                    background: #f5f5f5;
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0 #000;
                }
            `}</style>
        </>
    );
}
