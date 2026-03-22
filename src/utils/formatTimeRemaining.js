/**
 * Mengkonversi detik ke format waktu yang mudah dibaca.
 * @param {number} seconds - Sisa waktu dalam detik
 * @returns {string} Format waktu (contoh: "2 jam, 30 menit, 15 detik")
 */
export const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return "0 detik";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} hari`);
    if (hours > 0) parts.push(`${hours} jam`);
    if (minutes > 0) parts.push(`${minutes} menit`);
    if (secs > 0) parts.push(`${secs} detik`);

    return parts.join(", ");
};