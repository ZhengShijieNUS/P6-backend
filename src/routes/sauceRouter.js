import express from 'express'
import { auth } from '../middleware/auth.js'
import multer from '../middleware/multer-config.js'

import { getAllSauces, getOneSauce, createSauce } from '../controllers/sauceCtrl.js'

const sauceRouter = express.Router()

sauceRouter.get('/', auth, getAllSauces)
sauceRouter.get('/:id', auth, getOneSauce)
sauceRouter.post('/',auth, multer, createSauce)
sauceRouter.put('/:id', auth)
sauceRouter.delete('/:id', auth)
sauceRouter.post('/:id/like', auth)

export default sauceRouter
