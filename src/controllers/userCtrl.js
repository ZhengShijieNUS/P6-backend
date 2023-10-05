import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

export function signup (req, res, next) {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: 'User added successfully!'
        })
      })
      .catch(err => {
        res.status(500).json({
          err: err
        })
      })
  })
}

export function login (req, res, next) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found').message
        })
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect password')
            })
          }

          const token = jsonwebtoken.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
          )

          res.status(200).json({
            userId: user._id,
            token: token
          })
        })
        .catch(err => {
          res.status(500).json({
            err: err
          })
        })
    })
    .catch(err => {
      res.status(500).json({
        err: err
      })
    })
}

export function removeUser (req, res, next) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          error: new Error('User not found').message
        })
      }

      User.deleteOne({ email: req.body.email })
        .then(() => {
          res.status(200).json({
            message: 'User deleted successfully'
          })
        })
        .catch(err => {
          res.status(400).json({
            err: err
          })
        })
    })
    .catch(err => {
      res.status(400).json({
        err: err.message
      })
    })
}
