const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleFields = [
    { key: "studentName", label: "Student Name", x: 100, y: 375, fontSize: 32, color: "#0084D1", width: 400, type: "text" },
    { key: "courseName", label: "Course Name", x: 100, y: 285, fontSize: 24, color: "#000000", width: 400, type: "text" },
    { key: "regId", label: "Registration ID", x: 100, y: 60, fontSize: 12, color: "#666666", width: 200, type: "text" },
    { key: "certificateId", label: "Certificate ID", x: 640, y: 510, fontSize: 10, color: "#666666", width: 150, type: "text" },
    { key: "duration", label: "Duration", x: 100, y: 235, fontSize: 14, color: "#333333", width: 200, type: "text" },
    { key: "startDate", label: "Start Date", x: 240, y: 235, fontSize: 12, color: "#666666", width: 100, type: "text" },
    { key: "endDate", label: "End Date", x: 340, y: 235, fontSize: 12, color: "#666666", width: 100, type: "text" },
    { key: "issuedDate", label: "Issued Date", x: 100, y: 205, fontSize: 12, color: "#666666", width: 150, type: "text" },
    { key: "signatureImage", label: "Signature", x: 100, y: 60, width: 150, height: 60, type: "image" },
];

async function main() {
    // Upsert the sample template
    const template = await prisma.certificateTemplate.upsert({
        where: { id: "sample-template-001" },
        update: {
            name: "Standard Certificate",
            fileUrl: "/uploads/certificate-templates/sample-template.pdf",
            fields: sampleFields,
            isActive: true,
        },
        create: {
            id: "sample-template-001",
            name: "Standard Certificate",
            fileUrl: "/uploads/certificate-templates/sample-template.pdf",
            fields: sampleFields,
            isActive: true,
        },
    });

    console.log("Certificate template created/updated:");
    console.log(`  ID: ${template.id}`);
    console.log(`  Name: ${template.name}`);
    console.log(`  URL: ${template.fileUrl}`);
    console.log(`  Active: ${template.isActive}`);
    console.log("\nFields configured:");
    template.fields.forEach((f) => {
        console.log(`  - [${f.key}] at (${f.x}, ${f.y}) - ${f.type}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
