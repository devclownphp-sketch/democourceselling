"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccessDeniedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const section = searchParams.get("section") || "this section";
    const message = `You don't have permission to access ${section}. Please contact your administrator if you believe this is an error.`;

    useEffect(() => {
        const timer = setTimeout(() => {
            router.back();
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "1rem",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    border: "4px solid #000",
                    borderRadius: "20px",
                    padding: "2.5rem",
                    maxWidth: "460px",
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "10px 10px 0 #000",
                    animation: "shake 0.5s ease-in-out",
                }}
            >
                <div
                    style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        background: "#fef2f2",
                        border: "4px solid #ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem",
                    }}
                >
                    <span style={{ fontSize: "3rem" }}>🚫</span>
                </div>

                <h2
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 900,
                        color: "#000",
                        margin: "0 0 1rem",
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
                        lineHeight: 1.6,
                    }}
                >
                    {message}
                </p>

                <div
                    style={{
                        padding: "1rem",
                        background: "#fffbeb",
                        border: "2px solid #f59e0b",
                        borderRadius: "14px",
                        marginBottom: "1.5rem",
                    }}
                >
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400e" }}>
                        Redirecting back in <strong>5 seconds</strong>...
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
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
                        transition: "all 0.15s ease",
                    }}
                >
                    Go Back Now
                </button>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}