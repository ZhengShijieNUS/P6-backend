import User from '../models/user.js'

export function signup (req, res, next) {
  console.log('user signup successful')
  User.find()
    .then(() => {
      res.status(200).json({
        result: 'signup success'
      })
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
}

export function login (req, res, next) {
  console.log('user login successful')
  User.find()
    .then(() => {
      res.status(200).json({
        result: 'login success'
      })
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
}
