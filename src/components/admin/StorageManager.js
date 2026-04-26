"use client";

import { useState, useEffect } from "react";

const PROVIDERS = [
    { key: "local", label: "📁 Local Storage", desc: "Files stored in public/uploads (default)" },
    { key: "s3", label: "☁️ AWS S3", desc: "Amazon S3 cloud storage" },
    { key: "r2", label: "🔥 Cloudflare R2", desc: "Cloudflare R2 storage (S3-compatible)" },
    { key: "gcs", label: "🌐 Google Cloud Storage", desc: "Google Cloud Storage" },
];

const inputStyle = {
    padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px",
    fontSize: "0.95rem", width: "100%", fontFamily: "inherit",
};

export default function StorageManager() {
    const [currentProvider, setCurrentProvider] = useState("local");
    const [config, setConfig] = useState({
        bucket: "", region: "ap-southeast-1", accessKeyId: "", secretAccessKey: "",
        endpoint: "", accountId: "", projectId: "", credentials: "",
    });
    const [folderStats, setFolderStats] = useState({});
    const [totalFiles, setTotalFiles] = useState(0);
    const [loading, setLoading] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [transferring, setTransferring] = useState(false);
    const [transferResult, setTransferResult] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState("local");

    useEffect(() => {
        fetchStorageInfo();
    }, []);

    const fetchStorageInfo = async () => {
        try {
            const res = await fetch("/api/admin/storage");
            if (res.ok) {
                const data = await res.json();
                setCurrentProvider(data.provider || "local");
                setSelectedProvider(data.provider || "local");
                setFolderStats(data.folderStats || {});
                setTotalFiles(data.totalFiles || 0);
                if (data.config) {
                    setConfig((prev) => ({
                        ...prev,
                        bucket: data.config.bucket || "",
                        region: data.config.region || "ap-southeast-1",
                        endpoint: data.config.endpoint || "",
                        accountId: data.config.accountId || "",
                        projectId: data.config.projectId || "",
                    }));
                }
            }
        } catch {}
    };

    const testConnection = async () => {
        setLoading(true);
        setTestResult(null);
        setError("");
        try {
            const res = await fetch("/api/admin/storage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider: selectedProvider, config }),
            });
            const data = await res.json();
            if (res.ok) {
                setTestResult({ success: true, message: data.message });
            } else {
                setTestResult({ success: false, message: data.error });
            }
        } catch (err) {
            setTestResult({ success: false, message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("/api/admin/storage", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider: selectedProvider, config }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(data.message || "Storage configuration saved!");
                setCurrentProvider(selectedProvider);
                fetchStorageInfo();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const transferFiles = async (toProvider) => {
        if (!window.confirm(`Transfer ALL files from local to ${toProvider.toUpperCase()}? This may take a while.`)) return;
        setTransferring(true);
        setTransferResult(null);
        setError("");
        try {
            const res = await fetch("/api/admin/storage/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fromProvider: "local",
                    toProvider,
                    toConfig: { ...config, provider: toProvider },
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setTransferResult(data.results);
                setSuccess(data.message);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setTransferring(false);
        }
    };

    const needsS3Fields = selectedProvider === "s3" || selectedProvider === "r2";
    const needsGcsFields = selectedProvider === "gcs";

    return (
        <section className="panel stack-md" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>💾 Storage Configuration</h3>

            <div style={{
                padding: "1rem", background: "#f0fdf4", border: "3px solid #22c55e",
                borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
            }}>
                <span style={{ fontSize: "1.5rem" }}>
                    {currentProvider === "local" ? "📁" : currentProvider === "s3" ? "☁️" : currentProvider === "r2" ? "🔥" : "🌐"}
                </span>
                <div>
                    <strong>Active: {currentProvider.toUpperCase()}</strong>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>{totalFiles} files across {Object.keys(folderStats).length} folders</p>
                </div>
            </div>

            {Object.keys(folderStats).length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
                    {Object.entries(folderStats).map(([folder, count]) => (
                        <div key={folder} style={{
                            padding: "0.6rem 0.75rem", background: count > 0 ? "#ffd400" : "#f5f5f5",
                            border: "2px solid #000", borderRadius: "10px", textAlign: "center",
                        }}>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{count}</div>
                            <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>{folder}</div>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <label style={{ fontWeight: 700, display: "block", marginBottom: "0.75rem" }}>Select Storage Provider</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                    {PROVIDERS.map((p) => (
                        <button
                            key={p.key}
                            type="button"
                            onClick={() => { setSelectedProvider(p.key); setTestResult(null); }}
                            style={{
                                padding: "1rem", textAlign: "left",
                                background: selectedProvider === p.key ? "#000" : "#fff",
                                color: selectedProvider === p.key ? "#ffd400" : "#000",
                                border: "3px solid #000", borderRadius: "14px", cursor: "pointer",
                                boxShadow: selectedProvider === p.key ? "4px 4px 0 #ffd400" : "2px 2px 0 #ccc",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <div style={{ fontSize: "1rem", fontWeight: 700 }}>{p.label}</div>
                            <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", opacity: 0.8 }}>{p.desc}</div>
                            {currentProvider === p.key && (
                                <span style={{
                                    display: "inline-block", marginTop: "0.4rem", padding: "0.15rem 0.5rem",
                                    background: "#22c55e", color: "#fff", borderRadius: "999px",
                                    fontSize: "0.65rem", fontWeight: 700,
                                }}>ACTIVE</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {needsS3Fields && (
                <div style={{ padding: "1.25rem", background: "#f8f9fc", border: "3px solid #000", borderRadius: "16px" }}>
                    <h4 style={{ margin: "0 0 1rem", fontWeight: 700 }}>
                        {selectedProvider === "r2" ? "🔥 Cloudflare R2 Configuration" : "☁️ AWS S3 Configuration"}
                    </h4>
                    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            Bucket Name *
                            <input value={config.bucket} onChange={(e) => setConfig((p) => ({ ...p, bucket: e.target.value }))} placeholder="my-bucket" style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            Region
                            <input value={config.region} onChange={(e) => setConfig((p) => ({ ...p, region: e.target.value }))} placeholder="ap-southeast-1" style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            Access Key ID *
                            <input value={config.accessKeyId} onChange={(e) => setConfig((p) => ({ ...p, accessKeyId: e.target.value }))} placeholder="AKIA..." type="password" style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            Secret Access Key *
                            <input value={config.secretAccessKey} onChange={(e) => setConfig((p) => ({ ...p, secretAccessKey: e.target.value }))} placeholder="Secret key" type="password" style={inputStyle} />
                        </label>
                        {selectedProvider === "r2" && (
                            <>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                    Endpoint URL *
                                    <input value={config.endpoint} onChange={(e) => setConfig((p) => ({ ...p, endpoint: e.target.value }))} placeholder="https://xxx.r2.cloudflarestorage.com" style={inputStyle} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                    Account ID
                                    <input value={config.accountId} onChange={(e) => setConfig((p) => ({ ...p, accountId: e.target.value }))} placeholder="Cloudflare Account ID" style={inputStyle} />
                                </label>
                            </>
                        )}
                    </div>
                </div>
            )}

            {needsGcsFields && (
                <div style={{ padding: "1.25rem", background: "#f8f9fc", border: "3px solid #000", borderRadius: "16px" }}>
                    <h4 style={{ margin: "0 0 1rem", fontWeight: 700 }}>🌐 Google Cloud Storage Configuration</h4>
                    <div style={{ display: "grid", gap: "1rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                Bucket Name *
                                <input value={config.bucket} onChange={(e) => setConfig((p) => ({ ...p, bucket: e.target.value }))} placeholder="my-gcs-bucket" style={inputStyle} />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                Project ID *
                                <input value={config.projectId} onChange={(e) => setConfig((p) => ({ ...p, projectId: e.target.value }))} placeholder="my-project-123" style={inputStyle} />
                            </label>
                        </div>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            Service Account JSON Credentials
                            <textarea
                                value={config.credentials}
                                onChange={(e) => setConfig((p) => ({ ...p, credentials: e.target.value }))}
                                placeholder='{"type": "service_account", ...}'
                                rows={4}
                                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "0.85rem" }}
                            />
                        </label>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {selectedProvider !== "local" && (
                    <button
                        onClick={testConnection}
                        disabled={loading}
                        style={{
                            padding: "0.75rem 1.5rem", background: "#2563eb", color: "#fff",
                            border: "3px solid #000", borderRadius: "14px", fontWeight: 700,
                            cursor: "pointer", boxShadow: "3px 3px 0 #000", fontSize: "0.9rem",
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? "Testing..." : "🔌 Test Connection"}
                    </button>
                )}
                <button
                    onClick={saveConfig}
                    disabled={loading}
                    style={{
                        padding: "0.75rem 1.5rem", background: "#000", color: "#ffd400",
                        border: "3px solid #000", borderRadius: "14px", fontWeight: 700,
                        cursor: "pointer", boxShadow: "3px 3px 0 #ffd400", fontSize: "0.9rem",
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    {loading ? "Saving..." : "💾 Save & Activate"}
                </button>
            </div>

            {testResult && (
                <div style={{
                    padding: "1rem", borderRadius: "12px", border: "2px solid",
                    borderColor: testResult.success ? "#22c55e" : "#ef4444",
                    background: testResult.success ? "#f0fdf4" : "#fef2f2",
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: testResult.success ? "#166534" : "#991b1b" }}>
                        {testResult.message}
                    </p>
                </div>
            )}

            {totalFiles > 0 && currentProvider === "local" && selectedProvider !== "local" && (
                <div style={{
                    padding: "1.25rem", background: "#fffbeb", border: "3px solid #f59e0b",
                    borderRadius: "16px", marginTop: "0.5rem",
                }}>
                    <h4 style={{ margin: "0 0 0.5rem", fontWeight: 700, color: "#92400e" }}>📦 Transfer Files</h4>
                    <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#92400e" }}>
                        Transfer all {totalFiles} local files to {selectedProvider.toUpperCase()}. Same folder structure will be maintained.
                    </p>
                    <button
                        onClick={() => transferFiles(selectedProvider)}
                        disabled={transferring}
                        style={{
                            padding: "0.75rem 1.5rem", background: "#f59e0b", color: "#000",
                            border: "3px solid #000", borderRadius: "14px", fontWeight: 700,
                            cursor: "pointer", boxShadow: "3px 3px 0 #000", fontSize: "0.9rem",
                            opacity: transferring ? 0.6 : 1,
                        }}
                    >
                        {transferring ? "⏳ Transferring... Please wait" : `🚀 Transfer ${totalFiles} files to ${selectedProvider.toUpperCase()}`}
                    </button>
                </div>
            )}

            {transferResult && (
                <div style={{
                    padding: "1rem", background: "#f0fdf4", border: "3px solid #22c55e",
                    borderRadius: "16px",
                }}>
                    <h4 style={{ margin: "0 0 0.5rem", fontWeight: 700, color: "#166534" }}>Transfer Complete</h4>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                        ✅ {transferResult.transferred} transferred, ❌ {transferResult.failed} failed
                    </p>
                    {transferResult.errors?.length > 0 && (
                        <details style={{ marginTop: "0.5rem" }}>
                            <summary style={{ cursor: "pointer", fontSize: "0.8rem", color: "#dc2626" }}>View errors</summary>
                            <pre style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>
                                {transferResult.errors.join("\n")}
                            </pre>
                        </details>
                    )}
                </div>
            )}

            {error && <p style={{ color: "#ef4444", fontWeight: 600 }}>⚠️ {error}</p>}
            {success && <p style={{ color: "#22c55e", fontWeight: 600 }}>{success}</p>}
        </section>
    );
}
