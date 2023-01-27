const jwt = require("jsonwebtoken");

const getToken = (req, res, next) => {
      const bearerHeader = req.headers['authorization'];
      const secretHeader = req.headers['secret_key'];
      
      if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(" ")[1];
            req.token = bearerToken;
            req.secret = secretHeader
            next();
      } else {
            res.status(403).json({
                  status: res.statusCode,
                  error: {
                        message: "Invalid token"
                  }
            })
      }
}

const verifyToken = (req, res, next) => { 
      jwt.verify(req.token, req.secret, (error, authData) => {

            if (error) res.status(403).json({ error })

            if (authData) {
                  if (!authData.admin) res.status(403).json({ message: "" })
                  next()
            }
      })
}

module.exports = {
      verifyToken,
      getToken
}