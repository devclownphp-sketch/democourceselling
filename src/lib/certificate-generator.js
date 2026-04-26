import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const TEXT_PLACEHOLDER_MAP = {
    "[USER NAME]": "studentName",
    "[STUDENT NAME]": "studentName",
    "[CANDIDATE NAME]": "studentName",
    "[NAME]": "studentName",
    "[REG ID]": "regId",
    "[REG_ID]": "regId",
    "[REGISTRATION ID]": "regId",
    "[REGID]": "regId",
    "[REGISTRATION]": "regId",
    "[CERTIFICATE_ID]": "certificateId",
    "[CERTIFICATE ID]": "certificateId",
    "[CERTIFICATEID]": "certificateId",
    "[CERT ID]": "certificateId",
    "[CERT_ID]": "certificateId",
    "[COURSE NAME]": "courseName",
    "[COURSENAME]": "courseName",
    "[COURCE NAME]": "courseName",
    "[COURSE]": "courseName",
    "[START DATE]": "startDate",
    "[STARTDATE]": "startDate",
    "[START]": "startDate",
    "[END DATE]": "endDate",
    "[ENDDATE]": "endDate",
    "[END]": "endDate",
    "[COURCE DURATION]": "duration",
    "[COURSE DURATION]": "duration",
    "[COURSEDURATION]": "duration",
    "[DURATION]": "duration",
    "[HOURS]": "duration",
    "[ISSUED DATE]": "issuedDate",
    "[ISSUEDAT]": "issuedDate",
    "[DATE]": "issuedDate",
};

const IMAGE_PLACEHOLDER_MAP = {
    "[SIGNATURE]": "signatureImage",
    "[SIGNATURE IMAGE]": "signatureImage",
    "[SIGN]": "signatureImage",
    "[STAMP]": "stampImage",
    "[STAMP IMAGE]": "stampImage",
    "[LOGO]": "logoImage",
    "[LOGO IMAGE]": "logoImage",
    "[PHOTO]": "photoImage",
    "[PHOTO IMAGE]": "photoImage",
    "[PASSPORT PHOTO]": "photoImage",
    "[CANDIDATE PHOTO]": "photoImage",
};

export async function generateCertificate(data) {
    const {
        templateUrl,
        fields,
        studentName,
        courseName,
        regId,
        certificateId,
        startDate,
        endDate,
        duration,
        signatureImage,
        stampImage,
        logoImage,
        photoImage
    } = data;

    const pdfDoc = await PDFDocument.create();

    if (templateUrl) {
        try {
            const templateBuffer = await fetch(templateUrl).then((r) => r.arrayBuffer());
            const templatePdf = await PDFDocument.load(templateBuffer);
            const templatePages = templatePdf.getPages();

            for (const templatePage of templatePages) {
                const [copiedPage] = await pdfDoc.copyPages(templatePdf, [templatePages.indexOf(templatePage)]);
                pdfDoc.addPage(copiedPage);
            }
        } catch (err) {
            console.warn("Failed to load template PDF, creating blank certificate:", err);
        }
    }

    if (pdfDoc.getPageCount() === 0) {
        const page = pdfDoc.addPage([842, 595]);
        await drawDefaultCertificate(pdfDoc, page, { studentName, courseName, regId, certificateId, startDate, endDate, duration });
    } else {
        const page = pdfDoc.getPages()[0];
        const fieldMap = {
            studentName: studentName || "",
            courseName: courseName || "",
            regId: regId || "",
            certificateId: certificateId || "",
            startDate: formatDate(startDate) || "",
            endDate: formatDate(endDate) || "",
            duration: duration || "",
            issuedDate: formatDate(new Date()) || "",
        };

        if (fields && Array.isArray(fields)) {
            for (const field of fields) {
                try {
                    if (field.type === "image") {
                        const imageData = { signatureImage, stampImage, logoImage, photoImage }[field.key];
                        if (imageData) {
                            try {
                                const imageBytes = await fetch(imageData).then(r => r.arrayBuffer());
                                let img;
                                if (imageData.endsWith(".png")) {
                                    img = await pdfDoc.embedPng(imageBytes);
                                } else {
                                    img = await pdfDoc.embedJpg(imageBytes);
                                }
                                const dims = img.scale(1);
                                const aspectRatio = dims.width / dims.height;
                                const maxWidth = field.width || 150;
                                const maxHeight = field.height || 60;
                                let drawWidth = maxWidth;
                                let drawHeight = drawWidth / aspectRatio;
                                if (drawHeight > maxHeight) {
                                    drawHeight = maxHeight;
                                    drawWidth = drawHeight * aspectRatio;
                                }
                                page.drawImage(img, {
                                    x: field.x,
                                    y: field.y,
                                    width: drawWidth,
                                    height: drawHeight,
                                });
                            } catch (e) {
                                console.warn(`Failed to embed image for field ${field.key}:`, e);
                            }
                        }
                    } else {
                        const value = fieldMap[field.key] || field.defaultValue || "";
                        const color = hexToRgb(field.color || "#000000");
                        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                        page.drawText(String(value), {
                            x: field.x,
                            y: field.y,
                            size: field.fontSize || 12,
                            font: boldFont,
                            color: rgb(color.r, color.g, color.b),
                            maxWidth: field.width || 200,
                        });
                    }
                } catch (fieldErr) {
                    console.warn(`Skipping field ${field.key} due to error:`, fieldErr);
                }
            }
        } else {
            for (const [placeholder, fieldKey] of Object.entries(TEXT_PLACEHOLDER_MAP)) {
                const value = fieldMap[fieldKey] || "";
                if (value) {
                    try {
                        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                        page.drawText(value, {
                            x: 100,
                            y: 300,
                            size: 16,
                            font: boldFont,
                            color: rgb(0, 0, 0),
                        });
                    } catch (e) {
                        console.warn("Failed to draw placeholder text:", e);
                    }
                    break;
                }
            }

            if (signatureImage) {
                try {
                    const imageBytes = await fetch(signatureImage).then(r => r.arrayBuffer());
                    const img = signatureImage.endsWith(".png")
                        ? await pdfDoc.embedPng(imageBytes)
                        : await pdfDoc.embedJpg(imageBytes);
                    page.drawImage(img, {
                        x: 500,
                        y: 80,
                        width: 150,
                        height: 60,
                    });
                } catch (e) {
                    console.warn("Failed to embed signature image:", e);
                }
            }
        }
    }

    try {
        return await pdfDoc.save();
    } catch (saveErr) {
        console.error("Failed to save PDF:", saveErr);
        throw new Error("Failed to save certificate PDF");
    }
}

async function replaceTextOnPage(page, placeholder, value) {
    try {
        const contentStreams = page.node.content().streams;
        if (!contentStreams || contentStreams.length === 0) return false;

        for (const stream of contentStreams) {
            try {
                const bytes = stream.getBytes();
                const text = new TextDecoder().decode(bytes);

                if (text.includes(placeholder)) {
                    const newText = text.replace(new RegExp(escapeRegex(placeholder), "g"), value);
                    stream.setBytes(new TextEncoder().encode(newText));
                    return true;
                }
            } catch (e) {
                continue;
            }
        }
    } catch (err) {
        console.warn("Could not replace text on page:", err);
    }
    return false;
}

async function replaceImageOnPage(page, placeholder, imageUrl) {
    try {
        const contentStreams = page.node.content().streams;
        if (!contentStreams || contentStreams.length === 0) return false;

        for (const stream of contentStreams) {
            try {
                const bytes = stream.getBytes();
                const text = new TextDecoder().decode(bytes);

                if (text.includes(placeholder)) {
                    const imageBytes = await fetch(imageUrl).then(r => r.arrayBuffer());

                    let img;
                    if (imageUrl.toLowerCase().endsWith(".png")) {
                        img = await page.doc.embedPng(imageBytes);
                    } else if (imageUrl.toLowerCase().endsWith(".jpg") || imageUrl.toLowerCase().endsWith(".jpeg")) {
                        img = await page.doc.embedJpg(imageBytes);
                    } else {
                        try {
                            img = await page.doc.embedPng(imageBytes);
                        } catch {
                            img = await page.doc.embedJpg(imageBytes);
                        }
                    }

                    const dims = img.scale(1);
                    const aspectRatio = dims.width / dims.height;
                    const maxWidth = 150;
                    const maxHeight = 60;
                    let drawWidth = maxWidth;
                    let drawHeight = drawWidth / aspectRatio;
                    if (drawHeight > maxHeight) {
                        drawHeight = maxHeight;
                        drawWidth = drawHeight * aspectRatio;
                    }

                    const streamText = new TextDecoder().decode(bytes);
                    const placeholderIndex = streamText.indexOf(placeholder);
                    const charWidth = 8;
                    const x = Math.floor(placeholderIndex / 50) * charWidth + 50;
                    const y = 100;

                    page.drawImage(img, {
                        x: x,
                        y: y,
                        width: drawWidth,
                        height: drawHeight,
                    });

                    return true;
                }
            } catch (e) {
                continue;
            }
        }
    } catch (err) {
        console.warn("Could not replace image on page:", err);
    }
    return false;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function drawDefaultCertificate(pdfDoc, page, data) {
    const { width, height } = page.getSize();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawRectangle({
        x: 0, y: 0, width, height,
        borderColor: rgb(0, 0, 0),
        borderWidth: 8,
    });

    page.drawRectangle({
        x: 20, y: 20, width: width - 40, height: height - 40,
        borderColor: rgb(0, 0, 0),
        borderWidth: 3,
    });

    const centerX = width / 2;

    page.drawText("CERTIFICATE OF COMPLETION", {
        x: centerX - 170, y: height - 80,
        size: 26, font: boldFont, color: rgb(0, 0, 0),
    });

    page.drawText("This is to certify that", {
        x: centerX - 80, y: height - 150,
        size: 14, font: regularFont, color: rgb(0, 0, 0),
    });

    page.drawText(data.studentName || "Student Name", {
        x: centerX - 150, y: height - 190,
        size: 30, font: boldFont, color: rgb(0.1, 0.4, 0.8),
    });

    page.drawText("has successfully completed the course", {
        x: centerX - 115, y: height - 230,
        size: 14, font: regularFont, color: rgb(0, 0, 0),
    });

    page.drawText(data.courseName || "Course Name", {
        x: centerX - 150, y: height - 270,
        size: 22, font: boldFont, color: rgb(0, 0, 0),
    });

    const startDateStr = formatDate(data.startDate) || "N/A";
    const endDateStr = formatDate(data.endDate) || "N/A";
    page.drawText(`Duration: ${data.duration || "N/A"} (${startDateStr} to ${endDateStr})`, {
        x: centerX - 130, y: height - 310,
        size: 12, font: regularFont, color: rgb(0, 0, 0),
    });

    page.drawText(`Registration ID: ${data.regId || "N/A"}`, {
        x: centerX - 80, y: height - 350,
        size: 12, font: regularFont, color: rgb(0.3, 0.3, 0.3),
    });

    if (data.certificateId) {
        page.drawText(`Certificate ID: ${data.certificateId}`, {
            x: centerX - 60, y: height - 370,
            size: 10, font: regularFont, color: rgb(0.4, 0.4, 0.4),
        });
    }

    page.drawText(`Issued: ${formatDate(new Date())}`, {
        x: 60, y: 60,
        size: 10, font: regularFont, color: rgb(0.5, 0.5, 0.5),
    });
}

function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
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
export function generateCertificateId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function extractPlaceholders(text) {
    const placeholders = [];
    const regex = /\[([^\]]+)\]/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        placeholders.push(match[0]);
    }
    return [...new Set(placeholders)];
}

export function getSupportedPlaceholders() {
    return {
        text: Object.keys(TEXT_PLACEHOLDER_MAP),
        image: Object.keys(IMAGE_PLACEHOLDER_MAP),
    };
}