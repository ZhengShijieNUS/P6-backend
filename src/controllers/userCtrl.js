import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

export async function signup (req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    })

    await user.save()
    res.status(201).json({
      message: 'User added successfully!'
    })
  } catch (err) {
    res.status(500).json({
      err: err.message
    })
  }
}

export async function login (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        error: new Error('User not found').message
      })
    }

    const valid = await bcrypt.compare(req.body.password, user.password)

    if (!valid) {
      return res.status(401).json({
        error: new Error('Invalid password').message
      })
    }

    const token = jsonwebtoken.sign(
      { userId: user._id },
      'RANDOM_TOKEN_SECRET',
      {
        expiresIn: '24h'
      }
    )

    res.status(200).json({
      userId: user._id,
      token: token
    })
  } catch (err) {
    res.status(500).json({
      err: err.message
    })
  }
}

export async function removeUser (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    await User.deleteOne({ email: req.body.email })

    res.status(200).json({
      message: 'User deleted successfully'
    })
  } catch (err) {
    res.status(400).json({
      error: err.message
    })
  }
}
