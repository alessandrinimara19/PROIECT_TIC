//conversie si formatare data:
function convertTimestamp(timestamp) {
    if (timestamp && timestamp._seconds && timestamp._nanoseconds) {
        // Conversie Firebase timestamp in obiect Date
        const milliseconds = timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1e6);
        const date = new Date(milliseconds);

        // Format the Date object
        return date.toLocaleDateString("ro-RO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return "Data indisponibilă"; // Fallback daca primesc timestamp invalid
}

//trunchiere continut articol pentru preview in card
const truncateContent = (text, maxLength) => {
    if (text && text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text || '';
};

export {
    convertTimestamp,
    truncateContent
} 
