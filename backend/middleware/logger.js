// custom middleware, primul ce va intercepta toate request-urile si va loga metoda HTTP, URL ul si timestamp ul
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "..", "logs", "app.log"); //in folder-ul logs se va crea fisierul app.log

// Verificare existenta director logs
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

// Logger middleware
const logger = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;

  // Logare in consola
  console.log(logMessage);

  // Logare in  fisier
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Eroare la scrierea in fisier:", err);
    }
  });

  // Apel urmatorul middleware sau route handler
  next();
};

module.exports = logger;
