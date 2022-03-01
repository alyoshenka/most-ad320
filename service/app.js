import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { router } from './routes/router.js'

const app = express()
const port = 8000

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@notablecluster.sm4hi.mongodb.net/Notable?retryWrites=true&w=majority`

try {
    await mongoose.connect(connectionString)
} catch (err) {
    console.log('error ', err)
}

const exampleMiddleware = (req, res, next) => {
    console.log('example middleware')
    next()
}

app.use(cors())
app.use(express.json())

app.use('/', router)

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(mongoose.connection.readyState === 1 ? "mongoose ready" : "mongoose not ready")
})