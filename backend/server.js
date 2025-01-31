import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import logger from "./middleware/logger.js" //custom logger 

import { articleRouter } from './routes/articleRoutes.js'
import { userRouter } from './routes/userRoutes.js'
import { fakerRouter } from './routes/fakerRoutes.js'
import { authRouter } from './routes/authRoutes.js'

// incarcare variabilei de mediu din fisierul env
dotenv.config()

const PORT = process.env.PORT || 8080
const app = express()

//custom middleware - logger
app.use(logger)

//JSON parser middleware
app.use(express.json())

//setup cors middleware
app.use(
    cors({
        origin: process.env.FRONTEND_ROUTE, //permite accesul dintr-o anumita origine (frontend-ul)
        credentials: true, //permite trimiterea de cookie-uri sau alte credentiale (Authorization header)
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    })
)

// Rute
app.use("/api/articles", articleRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/faker", fakerRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta nu a fost gasita' })
})

app.use((error, req, res, next) => {
    console.error(error) //logare eroare in consola
    res.status(error.statusCode || 500).json({
        status: 'fail',
        message: error.message || "Ceva nu a mers bine"
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`Serverul ruleaza pe portul ${PORT}`)
})


