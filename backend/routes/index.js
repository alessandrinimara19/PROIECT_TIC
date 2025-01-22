import express from 'express'

const router = express.Router()

//ruta de test
router.get('/', (req, res) => {
    res.json({ message: 'Bine ai venit pe ruta principala' })
})

export { router }