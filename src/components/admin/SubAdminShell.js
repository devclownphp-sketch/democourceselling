"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AccessDeniedProvider, useAccessDenied } from "./AccessDeniedModal";

function SubAdminShellContent({ children, subadmin, accessibleSections }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/admin/logout/subadmin", { method: "POST" });
            if (response.ok) {
                window.location.href = "/admin/login/subadmin";
            } else {
                window.location.href = "/admin/login/subadmin";
            }
        } catch (e) {
            console.error("Logout error:", e);
            window.location.href = "/admin/login/subadmin";
        }
    };

    const sectionUrlMap = {
        dashboard: "dashboard",
        courses: "courses",
        studyMaterials: "study-materials",
        pdfs: "pdfs",
        categories: "categories",
        quizzes: "quizzes",
        blogs: "blogs",
        faqs: "faqs",
        features: "features",
        reviews: "reviews",
        marquee: "marquee",
        colors: "colors",
        certificates: "certificates",
        siteSettings: "site-settings",
        contacts: "contacts",
    };

    const getLinkHref = (section) => {
        const urlSlug = sectionUrlMap[section] || section.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
        return `/${subadmin.urlId}/${urlSlug}`;
    };

    const isActive = (sectionKey) => {
        const urlSlug = sectionUrlMap[sectionKey] || sectionKey.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
        return pathname.includes(`/${subadmin.urlId}/${urlSlug}`) ||
               (sectionKey === "dashboard" && pathname === `/${subadmin.urlId}/dashboard`);
    };

    return (
        <div className="subadmin-page-layout">
            <aside className="subadmin-sidebar">
                <div className="subadmin-sidebar-header">
                    <h2>📋 Panel</h2>
                    <div className="subadmin-sidebar-info">
                        <span>@{subadmin.username}</span>
                    </div>
                </div>

                <nav className="subadmin-sidebar-nav">
                    {accessibleSections.map((section) => (
                        <Link
                            key={section.key}
                            href={getLinkHref(section.key)}
                            className={`subadmin-nav-item ${isActive(section.key) ? "active" : ""}`}
                        >
                            <span className="subadmin-nav-icon">{section.icon}</span>
                            <span className="subadmin-nav-label">{section.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="subadmin-sidebar-footer">
                    <button onClick={handleLogout} className="subadmin-logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="subadmin-main">
                <div className="subadmin-content">
                    {children}
                </div>
            </main>

            <style>{`
                .subadmin-page-layout {
                    display: grid;
                    grid-template-columns: 260px minmax(0, 1fr);
                    grid-template-areas: "sub-sidebar sub-main";
                    min-height: 100vh;
                    width: 100%;
                    background: #f8f9fc;
                }

                .subadmin-sidebar {
                    grid-area: sub-sidebar;
                    background: #fff;
                    border-right: 4px solid #000;
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    z-index: 100;
                    overflow-y: auto;
                }

                .subadmin-sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 4px solid #000;
                    background: #ffd400;
                    flex-shrink: 0;
                }

                .subadmin-sidebar-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 900;
                    text-transform: uppercase;
                }

                .subadmin-sidebar-info {
                    margin-top: 0.5rem;
                    font-size: 0.8rem;
                    color: #333;
                }

                .subadmin-sidebar-nav {
                    flex: 1;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .subadmin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    text-decoration: none;
                    color: #333;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                    border: 2px solid transparent;
                }

                .subadmin-nav-item:hover {
                    background: #f5f5f5;
                }

                .subadmin-nav-item.active {
                    background: #000;
                    color: #ffd400;
                    box-shadow: 3px 3px 0 #000;
                }

                .subadmin-nav-icon {
                    font-size: 1.2rem;
                }

                .subadmin-nav-label {
                    flex: 1;
                }

                .subadmin-sidebar-footer {
                    padding: 1rem;
                    border-top: 4px solid #000;
                    flex-shrink: 0;
                }

                .subadmin-logout-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: #ef4444;
                    color: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 0.9rem;
                    box-shadow: 3px 3px 0 #000;
                }

                .subadmin-logout-btn:hover {
                    transform: translateY(-2px);
                }

                .subadmin-main {
                    grid-area: sub-main;
                    min-width: 0;
                    padding: 2rem 1.5rem;
                    background: #f8f9fc;
                }

                @media (max-width: 900px) {
                    .subadmin-page-layout {
                        grid-template-columns: 1fr;
                        grid-template-areas: "sub-main";
                    }

                    .subadmin-sidebar {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

export default function SubAdminShell({ children, subadmin, accessibleSections }) {
    return (
        <AccessDeniedProvider>
            <SubAdminShellContent subadmin={subadmin} accessibleSections={accessibleSections}>
                {children}
            </SubAdminShellContent>
        </AccessDeniedProvider>
    );
}

export { SubAdminShellContent };