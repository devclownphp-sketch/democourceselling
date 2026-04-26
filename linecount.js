const fs = require("fs");
const path = require("path");

const CODE_EXTS = [
    ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
    ".css", ".scss", ".less",
    ".html", ".htm",
    ".json", ".prisma", ".sql",
    ".md", ".yaml", ".yml", ".env",
];

const root = process.cwd();
let totalLines = 0;
let totalFiles = 0;
const byExt = {};
const files = [];

function shouldSkip(name) {
    if (name.startsWith(".")) return true;
    if (name === "node_modules") return true;
    if (name === "package-lock.json") return true;
    if (name === "bun.lockb") return true;
    return false;
}

function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir); } catch { return; }

    for (const entry of entries) {
        if (shouldSkip(entry)) continue;
        const full = path.join(dir, entry);
        let stat;
        try { stat = fs.statSync(full); } catch { continue; }

        if (stat.isDirectory()) {
            walk(full);
        } else {
            const ext = path.extname(entry).toLowerCase();
            if (!CODE_EXTS.includes(ext)) continue;

            let lines;
            try {
                lines = fs.readFileSync(full, "utf8").split("\n").length;
            } catch { continue; }

            const rel = path.relative(root, full).replace(/\\/g, "/");
            files.push({ file: rel, lines, ext });
            totalLines += lines;
            totalFiles += 1;
            byExt[ext] = (byExt[ext] || 0) + lines;
        }
    }
}

walk(root);
files.sort((a, b) => b.lines - a.lines);

console.log("");
console.log("╔══════════════════════════════════════════════════════════════════════════════════╗");
console.log("║                              SOURCE CODE REPORT                                ║");
console.log("╚══════════════════════════════════════════════════════════════════════════════════╝");
console.log("");

console.log("  FILE" + " ".repeat(69) + "LINES");
console.log("  " + "─".repeat(80));
files.forEach(f => {
    const name = f.file.length > 72 ? "..." + f.file.slice(-69) : f.file;
    console.log("  " + name.padEnd(74) + String(f.lines).padStart(6));
});
console.log("  " + "─".repeat(80));

console.log("");
console.log("  BREAKDOWN BY TYPE:");
console.log("  " + "─".repeat(40));
Object.entries(byExt)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, lines]) => {
        const count = files.filter(f => f.ext === ext).length;
        console.log("  " + ext.padEnd(12) + String(count).padStart(5) + " files" + String(lines).padStart(10) + " lines");
    });
console.log("  " + "─".repeat(40));

console.log("");
console.log("  ┌────────────────────────────────┐");
console.log("  │  TOTAL FILES:  " + String(totalFiles).padStart(6) + "            │");
console.log("  │  TOTAL LINES:  " + String(totalLines).padStart(6) + "            │");
console.log("  └────────────────────────────────┘");
console.log("");
