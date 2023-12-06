import jwt from 'jsonwebtoken'

/**
 * A middle function to authenticate the user by auth the token
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function auth (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1] //extract the token from request headers
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') 
    const userId = decodedToken.userId

    req.userId = userId

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
