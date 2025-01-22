import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import logger from "./middleware/logger.js" //custom logger 
import { router } from './routes/index.js'

// incarcare variabile de mediu din fisierul env
dotenv.config({ path: './env' })

const PORT = process.env.PORT || 8080
const app = express()

//custom middleware - logger
app.use(logger)

//JSON parser middleware
app.use(express.json())

//setup cors middleware
app.use(
    cors({
        origin: [process.env.FRONTEND_ROUTE],
        credentials: true,
    })
)

// prima ruta de test
app.use('/api', router)

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta nu a fost gasita' })
})

app.use((error, req, res, next) => {
    console.error(error) //logare eroare in consola
    res.status(error.statusCode || 500).json({
        status: 'fail',
        message: error.message
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`Serverul ruleaza pe portul ${PORT}`)
})


