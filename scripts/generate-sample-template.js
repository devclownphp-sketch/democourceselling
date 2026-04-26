const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function generateSampleTemplate() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const { width, height } = page.getSize();

    // Background
    page.drawRectangle({
        x: 0, y: 0, width, height,
        color: rgb(0.98, 0.98, 1),
    });

    // Outer border
    page.drawRectangle({
        x: 20, y: 20, width: width - 40, height: height - 40,
        borderColor: rgb(0.1, 0.3, 0.7),
        borderWidth: 4,
        color: rgb(1, 1, 1),
    });

    // Inner border
    page.drawRectangle({
        x: 30, y: 30, width: width - 60, height: height - 60,
        borderColor: rgb(0, 0.52, 0.82),
        borderWidth: 2,
    });

    const centerX = width / 2;

    // Header decoration
    page.drawRectangle({
        x: 100, y: height - 100, width: width - 200, height: 50,
        color: rgb(0, 0.52, 0.82),
    });

    // Title
    page.drawText("CERTIFICATE OF COMPLETION", {
        x: centerX - 180, y: height - 85,
        size: 24, font: boldFont, color: rgb(1, 1, 1),
    });

    // Placeholder: [CERTIFICATE_ID] - top right
    page.drawText("[CERTIFICATE_ID]", {
        x: width - 150, y: height - 80,
        size: 10, font: regularFont, color: rgb(0.5, 0.5, 0.5),
    });

    // Decorative line
    page.drawLine({
        start: { x: 150, y: height - 130 },
        end: { x: width - 150, y: height - 130 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });

    // "This is to certify that"
    page.drawText("This is to certify that", {
        x: centerX - 70, y: height - 170,
        size: 14, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    // Placeholder: [STUDENT NAME] - main name
    page.drawText("[STUDENT NAME]", {
        x: centerX - 180, y: height - 220,
        size: 32, font: boldFont, color: rgb(0, 0.52, 0.82),
    });

    // Decorative line under name
    page.drawLine({
        start: { x: centerX - 180, y: height - 235 },
        end: { x: centerX + 180, y: height - 235 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });

    // "has successfully completed"
    page.drawText("has successfully completed the course", {
        x: centerX - 120, y: height - 270,
        size: 14, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    // Placeholder: [COURSE NAME]
    page.drawText("[COURSE NAME]", {
        x: centerX - 150, y: height - 310,
        size: 24, font: boldFont, color: rgb(0.1, 0.1, 0.1),
    });

    // Duration section
    page.drawText("Duration:", {
        x: centerX - 180, y: height - 360,
        size: 12, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });

    // Placeholder: [DURATION]
    page.drawText("[DURATION]", {
        x: centerX - 100, y: height - 360,
        size: 12, font: boldFont, color: rgb(0.2, 0.2, 0.2),
    });

    // Date range
    page.drawText("(", {
        x: centerX + 20, y: height - 360,
        size: 12, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });

    // Placeholder: [START DATE]
    page.drawText("[START DATE]", {
        x: centerX + 35, y: height - 360,
        size: 12, font: regularFont, color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText("to", {
        x: centerX + 115, y: height - 360,
        size: 12, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });

    // Placeholder: [END DATE]
    page.drawText("[END DATE]", {
        x: centerX + 140, y: height - 360,
        size: 12, font: regularFont, color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(")", {
        x: centerX + 210, y: height - 360,
        size: 12, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });

    // Issued date
    page.drawText("Issued on:", {
        x: centerX - 180, y: height - 390,
        size: 12, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });

    // Placeholder: [ISSUED DATE]
    page.drawText("[ISSUED DATE]", {
        x: centerX - 85, y: height - 390,
        size: 12, font: boldFont, color: rgb(0.2, 0.2, 0.2),
    });

    // Signature line
    page.drawLine({
        start: { x: 100, y: 120 },
        end: { x: 300, y: 120 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
    });

    // Placeholder: [SIGNATURE]
    page.drawText("[SIGNATURE]", {
        x: 150, y: 90,
        size: 10, font: italicFont, color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText("Authorized Signature", {
        x: 140, y: 75,
        size: 10, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });

    // Registration ID
    page.drawLine({
        start: { x: width - 300, y: 120 },
        end: { x: width - 100, y: 120 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
    });

    // Placeholder: [REG ID]
    page.drawText("[REG ID]", {
        x: width - 260, y: 90,
        size: 10, font: italicFont, color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText("Registration Number", {
        x: width - 250, y: 75,
        size: 10, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });

    // Footer
    page.drawRectangle({
        x: 0, y: 0, width: 40, height: height,
        color: rgb(0, 0.52, 0.82),
    });

    // Company name placeholder
    page.drawText("STP", {
        x: 8, y: height / 2 - 20,
        size: 20, font: boldFont, color: rgb(1, 1, 1),
    });

    page.drawText("Computer", {
        x: 2, y: height / 2,
        size: 10, font: regularFont, color: rgb(1, 1, 1),
    });

    // Corner decorations
    page.drawCircle({
        x: 60, y: height - 60, size: 10,
        color: rgb(1, 0.84, 0),
    });

    page.drawCircle({
        x: width - 60, y: height - 60, size: 10,
        color: rgb(1, 0.84, 0),
    });

    page.drawCircle({
        x: 60, y: 60, size: 10,
        color: rgb(1, 0.84, 0),
    });

    page.drawCircle({
        x: width - 60, y: 60, size: 10,
        color: rgb(1, 0.84, 0),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Ensure directory exists
    const outputDir = path.join(process.cwd(), "public", "uploads", "certificate-templates");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "sample-template.pdf");
    fs.writeFileSync(outputPath, pdfBytes);

    console.log(`Sample template saved to: ${outputPath}`);
    console.log("\nPlaceholders in this template:");
    console.log("  - [STUDENT NAME] - Student full name");
    console.log("  - [COURSE NAME] - Course title");
    console.log("  - [DURATION] - Course duration");
    console.log("  - [START DATE] - Start date");
    console.log("  - [END DATE] - End date");
    console.log("  - [ISSUED DATE] - Issue date");
    console.log("  - [REG ID] - Registration number");
    console.log("  - [CERTIFICATE_ID] - Certificate ID (7 letters)");
    console.log("  - [SIGNATURE] - Signature image placeholder");
}

generateSampleTemplate().catch(console.error);
