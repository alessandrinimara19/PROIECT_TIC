// Funcție pentru conversia timestamp-ului
function convertTimestamp(timestamp) {
    if (timestamp && timestamp._seconds && timestamp._nanoseconds) {
        // Combinăm _seconds și _nanoseconds pentru a obține un timestamp complet
        const milliseconds = timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1e6);
        return new Date(milliseconds).toLocaleDateString("ro-RO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }
    return null; // Returnăm null dacă datele nu sunt valide
}

export default convertTimestamp
