/**
 * Extracts a Google Drive folder ID from a full folder URL.
 *
 * Supports patterns like:
 *   https://drive.google.com/drive/folders/1A2B3C4D5E6F7G
 *   https://drive.google.com/drive/u/0/folders/1A2B3C4D5E6F7G
 *
 * @param {string} link
 * @returns {string|null} folder ID or null if the URL pattern does not match
 */
export function extractDriveFolderId(link) {
    if (!link) return null;
    const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}
