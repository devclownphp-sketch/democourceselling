import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateCertificate(data) {
    const { templateUrl, fields, studentName, courseName, regId, startDate, endDate, duration } = data;

    let pdfDoc;
    if (templateUrl) {
        const templateBuffer = await fetch(templateUrl).then((r) => r.arrayBuffer());
        pdfDoc = await PDFDocument.load(templateBuffer);
    } else {
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([842, 595]);
        const { width, height } = page.getSize();

        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            borderColor: rgb(0, 0, 0),
            borderWidth: 8,
        });

        page.drawRectangle({
            x: 20,
            y: 20,
            width: width - 40,
            height: height - 40,
            borderColor: rgb(0, 0, 0),
            borderWidth: 3,
        });
    }

    const pages = pdfDoc.getPages();
    const page = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const fieldMap = {
        studentName: studentName || "",
        courseName: courseName || "",
        regId: regId || "",
        startDate: formatDate(startDate) || "",
        endDate: formatDate(endDate) || "",
        duration: duration || "",
        issuedAt: formatDate(new Date()) || "",
    };

    if (fields && Array.isArray(fields)) {
        for (const field of fields) {
            const value = fieldMap[field.key] || field.defaultValue || "";
            const color = hexToRgb(field.color || "#000000");

            page.drawText(String(value), {
                x: field.x,
                y: field.y,
                size: field.fontSize || 12,
                font: font,
                color: rgb(color.r, color.g, color.b),
                maxWidth: field.width || 200,
            });
        }
    } else {
        const { width, height } = page.getSize();
        const centerX = width / 2;

        page.drawText("CERTIFICATE OF COMPLETION", {
            x: centerX - 150,
            y: height - 80,
            size: 24,
            font: font,
            color: rgb(0, 0, 0),
        });

        page.drawText("This is to certify that", {
            x: centerX - 80,
            y: height - 150,
            size: 14,
            font: regularFont,
            color: rgb(0, 0, 0),
        });

        page.drawText(studentName || "Student Name", {
            x: centerX - 150,
            y: height - 190,
            size: 28,
            font: font,
            color: rgb(0.2, 0.4, 0.8),
        });

        page.drawText("has successfully completed the course", {
            x: centerX - 110,
            y: height - 230,
            size: 14,
            font: regularFont,
            color: rgb(0, 0, 0),
        });

        page.drawText(courseName || "Course Name", {
            x: centerX - 150,
            y: height - 270,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Duration: ${duration || "N/A"}`, {
            x: centerX - 80,
            y: height - 310,
            size: 12,
            font: regularFont,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Date: ${formatDate(startDate)} to ${formatDate(endDate)}`, {
            x: centerX - 100,
            y: height - 340,
            size: 12,
            font: regularFont,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Registration ID: ${regId || "N/A"}`, {
            x: width - 200,
            y: 60,
            size: 10,
            font: regularFont,
            color: rgb(0.5, 0.5, 0.5),
        });
    }

    return await pdfDoc.save();
}

function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
          }
        : { r: 0, g: 0, b: 0 };
}

export function generateRegId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `WC-${result}`;
}