import jwt from 'jsonwebtoken'

export function auth (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
    const userId = decodedToken.userId

    if (req.body.userId && req.body.userId !== userId) {
      throw new Error('UserID does not match with the sauce owner ID')
    } else {
      next()
    }
  } catch (err){
    res.status(403).json({
      error: err.message
    })
  }
}
