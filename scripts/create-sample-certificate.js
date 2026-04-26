import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

async function createSampleTemplate() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();
    const centerX = width / 2;

    page.drawRectangle({
        x: 0, y: 0, width, height,
        color: rgb(1, 1, 1),
        borderColor: rgb(0, 0, 0),
        borderWidth: 0,
    });

    page.drawRectangle({
        x: 30, y: 30, width: width - 60, height: height - 60,
        borderColor: rgb(0.1, 0.4, 0.8),
        borderWidth: 4,
    });

    page.drawRectangle({
        x: 40, y: 40, width: width - 80, height: height - 80,
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
    });

    page.drawText("STP Computer Education", {
        x: centerX - 100, y: height - 70,
        size: 18, font, color: rgb(0, 0.52, 0.82),
    });

    page.drawText("CERTIFICATE OF COMPLETION", {
        x: centerX - 180, y: height - 120,
        size: 28, font, color: rgb(0, 0, 0),
    });

    page.drawText("This is to certify that", {
        x: centerX - 70, y: height - 175,
        size: 14, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText("[USER NAME]", {
        x: centerX - 150, y: height - 220,
        size: 32, font, color: rgb(0.1, 0.4, 0.8),
    });

    page.drawText("has successfully completed the course", {
        x: centerX - 115, y: height - 265,
        size: 14, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText("[COURSE NAME]", {
        x: centerX - 150, y: height - 305,
        size: 22, font, color: rgb(0, 0, 0),
    });

    page.drawText("Duration: [COURCE DURATION]", {
        x: centerX - 100, y: height - 345,
        size: 12, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText("[START DATE] to [END DATE]", {
        x: centerX - 100, y: height - 365,
        size: 12, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText("Registration ID: [REG ID]", {
        x: centerX - 80, y: height - 390,
        size: 12, font: regularFont, color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText("Date: [ISSUED DATE]", {
        x: width - 200, y: 70,
        size: 10, font: regularFont, color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText("[SIGNATURE]", {
        x: 100, y: 100,
        size: 14, font: regularFont, color: rgb(0.7, 0.7, 0.7),
    });

    page.drawText("[STAMP]", {
        x: width - 200, y: 80,
        size: 14, font: regularFont, color: rgb(0.7, 0.7, 0.7),
    });

    page.drawText("____________________________", {
        x: 80, y: 90,
        size: 10, font: regularFont, color: rgb(0, 0, 0),
    });

    page.drawText("Director Signature", {
        x: 80, y: 80,
        size: 9, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    const pdfBytes = await pdfDoc.save();

    const uploadDir = path.join(process.cwd(), "public", "uploads", "certificates", "templates");
    if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, "sample-certificate-template.pdf");
    await writeFile(filepath, pdfBytes);

    console.log("Sample template created at:", filepath);
    console.log("URL: /uploads/certificates/templates/sample-certificate-template.pdf");
    console.log("\nText placeholders:");
    console.log("[USER NAME], [COURSE NAME], [REG ID], [START DATE], [END DATE], [COURCE DURATION], [ISSUED DATE]");
    console.log("\nImage placeholders (will be replaced with images):");
    console.log("[SIGNATURE], [STAMP]");

    return filepath;
}

createSampleTemplate().catch(console.error);