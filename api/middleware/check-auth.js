
// Allows to create tokens using json web token library
// https://github.com/auth0/node-jsonwebtoken#readme
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
		const token = req.headers.authorization.split(' ')[1]
		const decoded = jwt.verify(token, process.env.JWT_KEY)
		req.userData = decoded
		next()
  } catch (error) {
		console.log(error)
    return res.status(401).json({
      message: 'Auth Failed!!'
    })
  }
}
