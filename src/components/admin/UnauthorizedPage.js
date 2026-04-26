"use client";

/**
 * UnauthorizedPage - Full-page themed unauthorized screen
 * Shown when a subadmin navigates to a page they don't have view permission for.
 * Styled to match the brutalist design system.
 */
export default function UnauthorizedPage({ sectionName = "this section", username = "" }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: "60vh", padding: "2rem",
        }}>
            <div style={{
                background: "#fff", border: "4px solid #000", borderRadius: "24px",
                padding: "3rem 2.5rem", maxWidth: "520px", width: "100%",
                textAlign: "center", boxShadow: "8px 8px 0 #000",
            }}>
                <div style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: "#fef2f2", border: "4px solid #ef4444",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.5rem",
                }}>
                    <span style={{ fontSize: "3rem" }}>🚫</span>
                </div>

                <h1 style={{
                    fontSize: "1.75rem", fontWeight: 900, color: "#000",
                    margin: "0 0 0.75rem", textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                }}>
                    Unauthorized
                </h1>

                <p style={{
                    fontSize: "1rem", color: "#666", margin: "0 0 1rem",
                    lineHeight: 1.6,
                }}>
                    You don&apos;t have permission to access <strong style={{ color: "#000" }}>{sectionName}</strong>.
                </p>

                {username && (
                    <p style={{
                        fontSize: "0.85rem", color: "#999", margin: "0 0 1.5rem",
                    }}>
                        Logged in as: <strong>@{username}</strong>
                    </p>
                )}

                <div style={{
                    padding: "1rem", background: "#fffbeb",
                    border: "3px solid #f59e0b", borderRadius: "14px",
                    marginBottom: "1.5rem",
                }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400e", fontWeight: 600 }}>
                        ⚠️ Contact the main admin to request access to this section.
                    </p>
                </div>

                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: "1rem 2.5rem", background: "#000", color: "#ffd400",
                        border: "4px solid #000", borderRadius: "16px",
                        fontSize: "1rem", fontWeight: 800, cursor: "pointer",
                        boxShadow: "4px 4px 0 #666", transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "translate(-2px, -2px)";
                        e.target.style.boxShadow = "6px 6px 0 #666";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "none";
                        e.target.style.boxShadow = "4px 4px 0 #666";
                    }}
                >
                    ← Go Back
                </button>
            </div>
        </div>
    );
}
