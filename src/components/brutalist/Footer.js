"use client";

import Link from "next/link";
import { IconMail, IconPhone, IconMapPin, IconTelegram, IconYoutube, IconInstagram, IconFacebook, IconTwitter } from "@/components/Icons";

export default function Footer({ siteSettings = {} }) {
    const currentYear = new Date().getFullYear();
    const footerCopyright = siteSettings.footerCopyright || `© ${currentYear} WEBCOM. All Rights Reserved. Made with ❤️ in India`;
    const businessName = siteSettings.businessName || "WEBCOM";
    const supportEmail = siteSettings.supportEmail || "stpcomputereducation@gmail.com";
    const supportPhone = siteSettings.supportPhone || "+91 9460824001";
    const addressLine = siteSettings.addressLine || "Mahipal Nagar, New Delhi - 110037";
    const youtubeUrl = siteSettings.youtubeUrl || "";
    const instagramUrl = siteSettings.instagramUrl || "";
    const facebookUrl = siteSettings.facebookUrl || "";
    const twitterUrl = siteSettings.twitterUrl || "";

    return (
        <footer style={{
            background: "#000",
            color: "#fff",
            borderTop: "4px solid #ffd400",
        }}>
            {/* Main Footer Content */}
            <div style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "3rem 1.5rem 2rem",
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "2rem",
                }}>
                    {/* Brand Column */}
                    <div>
                        <h3 style={{
                            fontSize: "2rem",
                            fontWeight: 900,
                            marginBottom: "1rem",
                            letterSpacing: "-0.02em",
                        }}>
                            {businessName}
                        </h3>
                        <p style={{
                            fontSize: "0.9rem",
                            opacity: 0.7,
                            lineHeight: 1.6,
                            marginBottom: "1.5rem",
                        }}>
                            100% Free Computer Courses, PDF Notes, and Quiz for every student in India.
                        </p>
                        {/* Social Icons */}
                        <div style={{
                            display: "flex",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                        }}>
                            {youtubeUrl && (
                                <a
                                    href={youtubeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "3px solid #000",
                                        boxShadow: "3px 3px 0 #ffd400",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translate(-2px, -2px)";
                                        e.currentTarget.style.boxShadow = "5px 5px 0 #ffd400";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translate(0, 0)";
                                        e.currentTarget.style.boxShadow = "3px 3px 0 #ffd400";
                                    }}
                                >
                                    <IconYoutube size={20} />
                                </a>
                            )}
                            {instagramUrl && (
                                <a
                                    href={instagramUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "3px solid #000",
                                        boxShadow: "3px 3px 0 #ffd400",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translate(-2px, -2px)";
                                        e.currentTarget.style.boxShadow = "5px 5px 0 #ffd400";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translate(0, 0)";
                                        e.currentTarget.style.boxShadow = "3px 3px 0 #ffd400";
                                    }}
                                >
                                    <IconInstagram size={20} />
                                </a>
                            )}
                            {facebookUrl && (
                                <a
                                    href={facebookUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "3px solid #000",
                                        boxShadow: "3px 3px 0 #ffd400",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translate(-2px, -2px)";
                                        e.currentTarget.style.boxShadow = "5px 5px 0 #ffd400";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translate(0, 0)";
                                        e.currentTarget.style.boxShadow = "3px 3px 0 #ffd400";
                                    }}
                                >
                                    <IconFacebook size={20} />
                                </a>
                            )}
                            {twitterUrl && (
                                <a
                                    href={twitterUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "3px solid #000",
                                        boxShadow: "3px 3px 0 #ffd400",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translate(-2px, -2px)";
                                        e.currentTarget.style.boxShadow = "5px 5px 0 #ffd400";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translate(0, 0)";
                                        e.currentTarget.style.boxShadow = "3px 3px 0 #ffd400";
                                    }}
                                >
                                    <IconTwitter size={20} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: "1rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            marginBottom: "1rem",
                            letterSpacing: "0.05em",
                        }}>
                            Quick Links
                        </h4>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}>
                            {[
                                { href: "/", label: "Home" },
                                { href: "/courses", label: "Courses" },
                                { href: "/study-materials", label: "Study Materials" },
                                { href: "/certificates", label: "Certificates" },
                                { href: "/quiz", label: "Quiz" },
                                { href: "/blog", label: "Blog" },
                                { href: "/contact", label: "Contact" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        color: "#fff",
                                        opacity: 0.7,
                                        textDecoration: "none",
                                        fontSize: "0.9rem",
                                        transition: "opacity 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.opacity = "1";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.opacity = "0.7";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{
                            fontSize: "1rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            marginBottom: "1rem",
                            letterSpacing: "0.05em",
                        }}>
                            Contact Us
                        </h4>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                        }}>
                            <a
                                href={`mailto:${supportEmail}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    color: "#fff",
                                    opacity: 0.7,
                                    textDecoration: "none",
                                    fontSize: "0.9rem",
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0.7";
                                }}
                            >
                                <IconMail size={18} />
                                <span>{supportEmail}</span>
                            </a>
                            <a
                                href={`tel:${supportPhone.replace(/\s/g, "")}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    color: "#fff",
                                    opacity: 0.7,
                                    textDecoration: "none",
                                    fontSize: "0.9rem",
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0.7";
                                }}
                            >
                                <IconPhone size={18} />
                                <span>{supportPhone}</span>
                            </a>
                            <div style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.75rem",
                                color: "#fff",
                                opacity: 0.7,
                                fontSize: "0.9rem",
                            }}>
                                <IconMapPin size={18} style={{ marginTop: "2px" }} />
                                <span>{addressLine}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div style={{
                background: "#ffd400",
                padding: "1rem 1.5rem",
                textAlign: "center",
            }}>
                <p style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#000",
                    margin: 0,
                }}>
                    {footerCopyright}
                </p>
            </div>
        </footer>
    );
}
