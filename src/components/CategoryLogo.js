"use client";

// Fancy animated SVG icons for categories when no image is uploaded
// Each icon has its own unique animation

const categoryIcons = {
    // Computer Basics Icon
    computer: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="comp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
            <rect x="10" y="15" width="80" height="55" rx="5" fill="url(#comp-grad)" />
            <rect x="15" y="20" width="70" height="40" rx="3" fill="#0a0a0a" />
            <text x="50" y="45" textAnchor="middle" fill="#4ade80" fontSize="18" fontWeight="bold">&gt;_</text>
            <rect x="35" y="75" width="30" height="5" rx="2" fill="#6366f1" />
            <rect x="25" y="82" width="50" height="8" rx="3" fill="url(#comp-grad)" />
            {/* Floating particles */}
            <circle cx="20" cy="30" r="2" fill="#4ade80" className="particle p1" />
            <circle cx="80" cy="35" r="1.5" fill="#f472b6" className="particle p2" />
            <circle cx="50" cy="25" r="1" fill="#fbbf24" className="particle p3" />
        </svg>
    ),

    // Code Programming Icon
    code: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="code-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
            </defs>
            <rect x="10" y="20" width="80" height="60" rx="8" fill="#1e1e1e" />
            {/* Code lines */}
            <rect x="20" y="30" width="30" height="4" rx="2" fill="#6366f1" className="code-line cl1" />
            <rect x="25" y="40" width="45" height="4" rx="2" fill="#10b981" className="code-line cl2" />
            <rect x="25" y="50" width="35" height="4" rx="2" fill="#f59e0b" className="code-line cl3" />
            <rect x="20" y="60" width="25" height="4" rx="2" fill="#ec4899" className="code-line cl4" />
            <rect x="20" y="70" width="50" height="4" rx="2" fill="#10b981" className="code-line cl5" />
            {/* Cursor */}
            <rect x="55" y="60" width="2" height="14" fill="#fff" className="cursor" />
        </svg>
    ),

    // Web Development Icon
    web: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="web-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
            {/* Globe */}
            <circle cx="50" cy="45" r="30" fill="none" stroke="url(#web-grad)" strokeWidth="3" />
            <ellipse cx="50" cy="45" rx="30" ry="12" fill="none" stroke="url(#web-grad)" strokeWidth="2" className="rotate-slow" />
            <line x1="50" y1="15" x2="50" y2="75" stroke="url(#web-grad)" strokeWidth="2" />
            <line x1="20" y1="45" x2="80" y2="45" stroke="url(#web-grad)" strokeWidth="2" />
            {/* Browser dots */}
            <circle cx="30" cy="80" r="4" fill="#ef4444" className="pulse" />
            <circle cx="45" cy="80" r="4" fill="#fbbf24" className="pulse p2" />
            <circle cx="60" cy="80" r="4" fill="#22c55e" className="pulse p3" />
        </svg>
    ),

    // Data Science Icon
    data: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="data-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
            </defs>
            {/* Bar chart */}
            <rect x="15" y="55" width="12" height="25" rx="2" fill="url(#data-grad)" className="bar b1" />
            <rect x="32" y="40" width="12" height="40" rx="2" fill="url(#data-grad)" className="bar b2" />
            <rect x="49" y="25" width="12" height="55" rx="2" fill="url(#data-grad)" className="bar b3" />
            <rect x="66" y="35" width="12" height="45" rx="2" fill="url(#data-grad)" className="bar b4" />
            {/* Line */}
            <path d="M21 50 L44 35 L61 20 L72 30" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            <circle cx="21" cy="50" r="4" fill="#4ade80" className="pulse" />
            <circle cx="44" cy="35" r="4" fill="#4ade80" className="pulse p2" />
            <circle cx="61" cy="20" r="4" fill="#4ade80" className="pulse p3" />
            <circle cx="72" cy="30" r="4" fill="#4ade80" className="pulse p4" />
        </svg>
    ),

    // Design Icon
    design: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="design-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
            </defs>
            {/* Palette */}
            <ellipse cx="50" cy="50" rx="35" ry="30" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
            {/* Color circles */}
            <circle cx="35" cy="45" r="8" fill="#ef4444" className="color-dot cd1" />
            <circle cx="50" cy="35" r="8" fill="#3b82f6" className="color-dot cd2" />
            <circle cx="65" cy="45" r="8" fill="#22c55e" className="color-dot cd3" />
            <circle cx="55" cy="58" r="6" fill="#a855f7" className="color-dot cd4" />
            <circle cx="40" cy="58" r="6" fill="#f59e0b" className="color-dot cd5" />
            {/* Brush */}
            <rect x="75" y="10" width="8" height="35" rx="2" fill="url(#design-grad)" transform="rotate(30 79 27)" />
            <path d="M88 15 L95 8 L100 12 L93 20 Z" fill="url(#design-grad)" />
        </svg>
    ),

    // Database Icon
    database: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="db-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
            </defs>
            {/* Cylinder */}
            <ellipse cx="50" cy="25" rx="30" ry="10" fill="url(#db-grad)" />
            <rect x="20" y="25" width="60" height="50" fill="url(#db-grad)" />
            <ellipse cx="50" cy="75" rx="30" ry="10" fill="url(#db-grad)" />
            {/* Lines */}
            <ellipse cx="50" cy="40" rx="30" ry="10" fill="none" stroke="#0a0a0a" strokeWidth="2" opacity="0.3" />
            <ellipse cx="50" cy="55" rx="30" ry="10" fill="none" stroke="#0a0a0a" strokeWidth="2" opacity="0.3" />
            {/* Glow */}
            <circle cx="30" cy="50" r="3" fill="#4ade80" className="glow g1" />
            <circle cx="50" cy="50" r="3" fill="#4ade80" className="glow g2" />
            <circle cx="70" cy="50" r="3" fill="#4ade80" className="glow g3" />
        </svg>
    ),

    // Network Icon
    network: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="net-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
            {/* Central node */}
            <circle cx="50" cy="50" r="15" fill="url(#net-grad)" className="pulse" />
            <circle cx="50" cy="50" r="8" fill="#fff" />
            {/* Satellite nodes */}
            <circle cx="25" cy="25" r="10" fill="url(#net-grad)" className="float f1" />
            <circle cx="75" cy="25" r="10" fill="url(#net-grad)" className="float f2" />
            <circle cx="25" cy="75" r="10" fill="url(#net-grad)" className="float f3" />
            <circle cx="75" cy="75" r="10" fill="url(#net-grad)" className="float f4" />
            {/* Connections */}
            <line x1="38" y1="38" x2="32" y2="32" stroke="#4ade80" strokeWidth="2" />
            <line x1="62" y1="38" x2="68" y2="32" stroke="#4ade80" strokeWidth="2" />
            <line x1="38" y1="62" x2="32" y2="68" stroke="#4ade80" strokeWidth="2" />
            <line x1="62" y1="62" x2="68" y2="68" stroke="#4ade80" strokeWidth="2" />
        </svg>
    ),

    // Security Icon
    security: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="sec-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
            </defs>
            {/* Shield */}
            <path d="M50 10 L85 25 L85 55 C85 75 50 90 50 90 C50 90 15 75 15 55 L15 25 Z" fill="url(#sec-grad)" />
            <path d="M50 20 L75 32 L75 53 C75 68 50 80 50 80 C50 80 25 68 25 53 L25 32 Z" fill="#0a0a0a" />
            {/* Lock */}
            <rect x="40" y="45" width="20" height="18" rx="3" fill="url(#sec-grad)" />
            <path d="M44 45 L44 40 C44 35 56 35 56 40 L56 45" fill="none" stroke="url(#sec-grad)" strokeWidth="4" />
            <circle cx="50" cy="54" r="3" fill="#0a0a0a" />
        </svg>
    ),

    // Mobile Icon
    mobile: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="mob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
            </defs>
            {/* Phone */}
            <rect x="30" y="10" width="40" height="80" rx="8" fill="url(#mob-grad)" />
            <rect x="35" y="20" width="30" height="55" rx="2" fill="#0a0a0a" />
            {/* Screen content */}
            <rect x="38" y="25" width="24" height="4" rx="1" fill="#4ade80" className="screen-line sl1" />
            <rect x="38" y="33" width="18" height="3" rx="1" fill="#6366f1" className="screen-line sl2" />
            <rect x="38" y="40" width="20" height="3" rx="1" fill="#f59e0b" className="screen-line sl3" />
            <circle cx="50" cy="58" r="6" fill="url(#mob-grad)" className="pulse" />
            {/* Notch */}
            <rect x="40" y="12" width="20" height="4" rx="2" fill="#1a1a2e" />
        </svg>
    ),

    // Cloud Icon
    cloud: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            {/* Cloud */}
            <ellipse cx="50" cy="55" rx="30" ry="20" fill="url(#cloud-grad)" />
            <circle cx="35" cy="50" r="18" fill="url(#cloud-grad)" />
            <circle cx="65" cy="50" r="15" fill="url(#cloud-grad)" />
            <circle cx="50" cy="42" r="18" fill="url(#cloud-grad)" />
            {/* Upload arrow */}
            <path d="M50 35 L50 55 M40 48 L50 35 L60 48" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="arrow-up" />
        </svg>
    ),

    // Default Book Icon
    book: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="book-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            {/* Book */}
            <path d="M15 20 L15 80 C15 85 20 85 25 80 L25 25 C25 22 22 20 20 20 Z" fill="url(#book-grad)" />
            <rect x="25" y="20" width="55" height="60" rx="2" fill="url(#book-grad)" />
            <path d="M80 25 L80 80 C80 85 75 85 70 80 L70 20 C70 17 73 15 75 15 L80 20 Z" fill="#4f46e5" />
            {/* Pages */}
            <line x1="30" y1="30" x2="70" y2="30" stroke="#0a0a0a" strokeWidth="1" opacity="0.3" />
            <line x1="30" y1="40" x2="70" y2="40" stroke="#0a0a0a" strokeWidth="1" opacity="0.3" />
            <line x1="30" y1="50" x2="60" y2="50" stroke="#0a0a0a" strokeWidth="1" opacity="0.3" />
            {/* Bookmark */}
            <path d="M65 15 L65 35 L72 30 L79 35 L79 15 Z" fill="#ef4444" className="bookmark" />
        </svg>
    ),

    // Chart/Business Icon
    chart: (
        <svg viewBox="0 0 100 100" className="cat-icon">
            <defs>
                <linearGradient id="chart-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
            {/* Background */}
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#0a0a0a" />
            {/* Chart area */}
            <path d="M25 70 L25 45 L40 55 L55 35 L70 50 L85 30 L85 70 Z" fill="url(#chart-grad)" opacity="0.3" />
            {/* Line */}
            <path d="M25 45 L40 55 L55 35 L70 50 L85 30" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Points */}
            <circle cx="25" cy="45" r="4" fill="#4ade80" className="pulse" />
            <circle cx="40" cy="55" r="4" fill="#4ade80" className="pulse p2" />
            <circle cx="55" cy="35" r="4" fill="#4ade80" className="pulse p3" />
            <circle cx="70" cy="50" r="4" fill="#4ade80" className="pulse p4" />
            <circle cx="85" cy="30" r="4" fill="#4ade80" className="pulse p5" />
        </svg>
    ),
};

// Fallback icons for random selection
const fallbackIcons = ["computer", "code", "web", "data", "design", "database", "network", "security", "mobile", "cloud", "chart"];

export default function CategoryLogo({ category = "General", size = 120, className = "" }) {
    // Map category names to icon keys
    const categoryMap = {
        "computer": "computer",
        "computers": "computer",
        "basics": "computer",
        "office": "computer",
        "ms office": "computer",
        "excel": "chart",
        "powerpoint": "design",
        "word": "book",
        "typing": "computer",
        "internet": "web",
        "web": "web",
        "website": "web",
        "html": "code",
        "css": "code",
        "javascript": "code",
        "js": "code",
        "programming": "code",
        "python": "code",
        "java": "code",
        "c++": "code",
        "data": "data",
        "analytics": "data",
        "excel": "chart",
        "statistics": "data",
        "ai": "data",
        "machine learning": "data",
        "ml": "data",
        "design": "design",
        "graphic": "design",
        "photoshop": "design",
        "canva": "design",
        "ui": "design",
        "ux": "design",
        "database": "database",
        "sql": "database",
        "mysql": "database",
        "mongodb": "database",
        "network": "network",
        "networking": "network",
        "ccna": "network",
        "security": "security",
        "cyber": "security",
        "hacking": "security",
        "ethical": "security",
        "mobile": "mobile",
        "android": "mobile",
        "react native": "mobile",
        "flutter": "mobile",
        "ios": "mobile",
        "cloud": "cloud",
        "aws": "cloud",
        "azure": "cloud",
        "google cloud": "cloud",
        "server": "cloud",
        "chart": "chart",
        "business": "chart",
        "marketing": "chart",
        "accounting": "chart",
        "tally": "chart",
        "gst": "chart",
        "finance": "chart",
        "blog": "book",
        "content": "book",
        "writing": "book",
        "seo": "web",
    };

    // Get icon key based on category
    const getIconKey = (cat) => {
        const lowerCat = cat.toLowerCase();
        for (const [key, value] of Object.entries(categoryMap)) {
            if (lowerCat.includes(key) || key.includes(lowerCat)) {
                return value;
            }
        }
        // Random fallback for variety
        const randomIndex = Math.floor(Math.random() * fallbackIcons.length);
        return fallbackIcons[randomIndex];
    };

    const iconKey = getIconKey(category);
    const icon = categoryIcons[iconKey] || categoryIcons.book;

    return (
        <div
            className={`category-logo ${className}`}
            style={{
                width: size,
                height: size,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {icon}
        </div>
    );
}

// CSS for animations - inject into head
export function CategoryLogoStyles() {
    if (typeof document === "undefined") return null;

    const styleId = "category-logo-styles";
    if (document.getElementById(styleId)) return null;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        .cat-icon {
            width: 100%;
            height: 100%;
        }

        /* Particle animations */
        .particle {
            animation: float-particle 3s ease-in-out infinite;
        }
        .p1 { animation-delay: 0s; }
        .p2 { animation-delay: 0.5s; }
        .p3 { animation-delay: 1s; }
        .p4 { animation-delay: 1.5s; }
        .p5 { animation-delay: 2s; }

        @keyframes float-particle {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(-5px); opacity: 0.5; }
        }

        /* Code line animations */
        .code-line {
            animation: code-appear 2s ease-in-out infinite;
            transform-origin: left;
        }
        .cl1 { animation-delay: 0s; }
        .cl2 { animation-delay: 0.3s; }
        .cl3 { animation-delay: 0.6s; }
        .cl4 { animation-delay: 0.9s; }
        .cl5 { animation-delay: 1.2s; }

        @keyframes code-appear {
            0%, 100% { opacity: 0.4; transform: scaleX(1); }
            50% { opacity: 1; transform: scaleX(1.05); }
        }

        /* Cursor blink */
        .cursor {
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        /* Rotate animation */
        .rotate-slow {
            transform-origin: center;
            animation: rotate 20s linear infinite;
        }
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Pulse animation */
        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
        }

        /* Bar chart animation */
        .bar {
            transform-origin: bottom;
            animation: grow 2s ease-in-out infinite;
        }
        .b1 { animation-delay: 0s; }
        .b2 { animation-delay: 0.2s; }
        .b3 { animation-delay: 0.4s; }
        .b4 { animation-delay: 0.6s; }

        @keyframes grow {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.1); }
        }

        /* Color dot animation */
        .color-dot {
            animation: color-pop 3s ease-in-out infinite;
        }
        .cd1 { animation-delay: 0s; }
        .cd2 { animation-delay: 0.5s; }
        .cd3 { animation-delay: 1s; }
        .cd4 { animation-delay: 1.5s; }
        .cd5 { animation-delay: 2s; }

        @keyframes color-pop {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }

        /* Glow animation */
        .glow {
            animation: glow-pulse 2s ease-in-out infinite;
        }
        .g1 { animation-delay: 0s; }
        .g2 { animation-delay: 0.3s; }
        .g3 { animation-delay: 0.6s; }

        @keyframes glow-pulse {
            0%, 100% { opacity: 0.5; filter: blur(2px); }
            50% { opacity: 1; filter: blur(4px); }
        }

        /* Float animation */
        .float {
            animation: float 4s ease-in-out infinite;
        }
        .f1 { animation-delay: 0s; }
        .f2 { animation-delay: 1s; }
        .f3 { animation-delay: 2s; }
        .f4 { animation-delay: 3s; }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }

        /* Screen line animation */
        .screen-line {
            animation: screen-appear 3s ease-in-out infinite;
        }
        .sl1 { animation-delay: 0s; }
        .sl2 { animation-delay: 0.5s; }
        .sl3 { animation-delay: 1s; }

        @keyframes screen-appear {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        /* Arrow up animation */
        .arrow-up {
            animation: bounce-up 1.5s ease-in-out infinite;
        }
        @keyframes bounce-up {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        /* Bookmark animation */
        .bookmark {
            animation: bookmark-wave 2s ease-in-out infinite;
            transform-origin: top center;
        }
        @keyframes bookmark-wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }
    `;
    document.head.appendChild(style);
    return null;
}
