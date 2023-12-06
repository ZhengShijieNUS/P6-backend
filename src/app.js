import express from 'express'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

import userRouter from './routes/userRouter.js'
import sauceRouter from './routes/sauceRouter.js'

const app = express()

app.use(express.json())

mongoose.set('strictQuery', false)

// set mongoose DB connection settings and try to connect MongoDB
mongoose
  .connect('mongodb+srv://admin:QdtDsxu5tNjbQYjJ@mongodb-learning.ayd34ej.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!')
  })
  .catch(error => {
    console.log('Unable to connect to MongoDB Atlas!')
    console.error(error)
  })

// To set response headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imageStaticPath = path.join(__dirname,'images')

app.use('/src/images', express.static(imageStaticPath))

// set which router to be use when the specific api format is called
app.use('/api/auth', userRouter)
app.use('/api/sauces', sauceRouter)


export default app
