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
            res.json({
                  status: res.statusCode,
                  error: {
                        message: "Invalid token"
                  }
            })
      }
}

const verifyAdminToken = (req, res, next) => {
      try {
            jwt.verify(req.token, req.secret, (error, authData) => {

                  if (error) throw error
      
                  if (authData) {
                        if (authData.admin) {
                              next()
                        } else {
                              return res.json({ message: "You do not have the necessary permissions" })
                        }
                  } else {
                        res.json({ message: "token is not valid or has no data" })
                  }
            })
      } catch (error) {
            res.status(403).json({ error })
      }
}

const verifyGuestToken = (req, res, next) => {
      try {
            jwt.verify(req.token, req.secret, (error, authData) => {

                  if (error) throw error

                  if (authData) {
                        if (authData.guest || authData.admin) {
                              next()
                        } else {
                              return res.json({ message: "You do not have the necessary permissions" })
                        }
                  } else {
                        res.json({ message: "token is not valid or has no data" })
                  }
            })
      } catch (error) {
            res.status(403).json({ error })
      }
}


module.exports = {
      verifyGuestToken,
      verifyAdminToken,
      getToken
}