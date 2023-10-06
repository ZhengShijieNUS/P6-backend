import express from 'express'
import mongoose from 'mongoose'

import userRouter from './routes/userRouter.js'

import path from 'path'

const app = express()

app.use(express.json())

mongoose.set('strictQuery', false)

mongoose
  .connect(
    'mongodb+srv://admin:QdtDsxu5tNjbQYjJ@mongodb-learning.ayd34ej.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!')
  })
  .catch(error => {
    console.log('Unable to connect to MongoDB Atlas!')
    console.error(error)
  })

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

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/auth', userRouter)


// app.use('/api/stuff', (req, res, next) => {
//   const stuff = [
//     {
//       _id: 'oeihfzeoi',
//       title: 'My first thing',
//       description: 'All of the info about my first thing',
//       imageUrl: '',
//       price: 4900,
//       userId: 'qsomihvqios'
//     },
//     {
//       _id: 'oeihfzeomoihi',
//       title: 'My second thing',
//       description: 'All of the info about my second thing',
//       imageUrl: '',
//       price: 2900,
//       userId: 'qsomihvqios'
//     }
//   ]
//   res.status(200).json(stuff)
// })

// app.get('/get', (req, res, next) => {
//     res.status(200).json({result: 'get success'})
// })

// app.post('/post', (req, res, next) => {
//     const result = req.body
//     result.result = "success post"
//     res.status(201).json(result)
// })

export default app
