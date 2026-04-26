"use client";

import { useState, createContext, useContext, useCallback } from "react";

const AccessDeniedContext = createContext(null);

export function AccessDeniedProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const showAccessDenied = useCallback((msg = "You don't have permission to perform this action.") => {
        setMessage(msg);
        setIsOpen(true);
    }, []);

    const hideAccessDenied = useCallback(() => {
        setIsOpen(false);
        setMessage("");
    }, []);

    return (
        <AccessDeniedContext.Provider value={{ showAccessDenied, hideAccessDenied }}>
            {children}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 99999,
                        padding: "1rem",
                    }}
                    onClick={(e) => e.target === e.currentTarget && hideAccessDenied()}
                >
                    <div
                        style={{
                            background: "#fff",
                            border: "4px solid #000",
                            borderRadius: "20px",
                            padding: "2rem",
                            maxWidth: "420px",
                            width: "100%",
                            textAlign: "center",
                            boxShadow: "8px 8px 0 #000",
                        }}
                    >
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "#fef2f2",
                                border: "4px solid #ef4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1.5rem",
                            }}
                        >
                            <span style={{ fontSize: "2.5rem" }}>🚫</span>
                        </div>

                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 900,
                                color: "#000",
                                margin: "0 0 0.75rem",
                                textTransform: "uppercase",
                            }}
                        >
                            Access Denied
                        </h2>

                        <p
                            style={{
                                fontSize: "1rem",
                                color: "#666",
                                margin: "0 0 1.5rem",
                                lineHeight: 1.5,
                            }}
                        >
                            {message}
                        </p>

                        <div
                            style={{
                                padding: "0.75rem",
                                background: "#fffbeb",
                                border: "2px solid #f59e0b",
                                borderRadius: "12px",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400e" }}>
                                Contact the main admin to get access.
                            </p>
                        </div>

                        <button
                            onClick={hideAccessDenied}
                            style={{
                                padding: "1rem 2rem",
                                background: "#000",
                                color: "#ffd400",
                                border: "4px solid #000",
                                borderRadius: "14px",
                                fontSize: "1rem",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow: "4px 4px 0 #666",
                            }}
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}
        </AccessDeniedContext.Provider>
    );
}

export function useAccessDenied() {
    const context = useContext(AccessDeniedContext);
    if (!context) {
        return {
            showAccessDenied: () => console.warn("AccessDeniedProvider not found"),
            hideAccessDenied: () => {},
        };
    }
    return context;
}

export function withAccessCheck(Component) {
    return function AccessCheckWrapper(props) {
        const { showAccessDenied } = useAccessDenied();
        return <Component {...props} showAccessDenied={showAccessDenied} />;
    };
}

export function checkApiError(error, showAccessDenied) {
    if (error?.message?.includes("Permission denied") ||
        error?.message?.includes("don't have access") ||
        error?.message?.includes("Access denied") ||
        error?.message?.includes("403")) {
        showAccessDenied(error.message || "You don't have permission to perform this action.");
        return true;
    }
    return false;
}

export default function SubAdminPageWrapper({ children, hasAccess, sectionName, username }) {
    const { showAccessDenied } = useAccessDenied();
    const [showDenied, setShowDenied] = useState(false);

    if (!hasAccess) {
        return (
            <>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    <button
                        onClick={() => setShowDenied(true)}
                        style={{
                            padding: "1rem 2rem",
                            background: "#ef4444",
                            color: "#fff",
                            border: "3px solid #000",
                            borderRadius: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        View Access Status
                    </button>
                </div>

                {showDenied && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.75)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                            padding: "1rem",
                        }}
                        onClick={(e) => e.target === e.currentTarget && setShowDenied(false)}
                    >
                        <div
                            style={{
                                background: "#fff",
                                border: "4px solid #000",
                                borderRadius: "20px",
                                padding: "2rem",
                                maxWidth: "420px",
                                width: "100%",
                                textAlign: "center",
                                boxShadow: "8px 8px 0 #000",
                            }}
                        >
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: "#fef2f2",
                                    border: "4px solid #ef4444",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 1.5rem",
                                }}
                            >
                                <span style={{ fontSize: "2.5rem" }}>🚫</span>
                            </div>

                            <h2
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 900,
                                    color: "#000",
                                    margin: "0 0 0.75rem",
                                    textTransform: "uppercase",
                                }}
                            >
                                Access Denied
                            </h2>

                            <p
                                style={{
                                    fontSize: "1rem",
                                    color: "#666",
                                    margin: "0 0 1.5rem",
                                    lineHeight: 1.5,
                                }}
                            >
                                You don't have permission to access <strong>{sectionName}</strong>.
                                <br />
                                <span style={{ fontSize: "0.85rem", color: "#888" }}>
                                    Logged in as: @{username}
                                </span>
                            </p>

                            <div
                                style={{
                                    padding: "0.75rem",
                                    background: "#fffbeb",
                                    border: "2px solid #f59e0b",
                                    borderRadius: "12px",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400e" }}>
                                    Contact the main admin to get access to this section.
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                                <button
                                    onClick={() => setShowDenied(false)}
                                    style={{
                                        padding: "0.75rem 1.5rem",
                                        background: "#000",
                                        color: "#ffd400",
                                        border: "4px solid #000",
                                        borderRadius: "12px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        boxShadow: "4px 4px 0 #666",
                                    }}
                                >
                                    Stay Here
                                </button>
                                <button
                                    onClick={() => showAccessDenied()}
                                    style={{
                                        padding: "0.75rem 1.5rem",
                                        background: "#fff",
                                        color: "#000",
                                        border: "3px solid #000",
                                        borderRadius: "12px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    Test Popup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return children;
}