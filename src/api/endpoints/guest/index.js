const dotenv = require("dotenv")
dotenv.config()
const { Router } = require("express")
const g = new Router()
const uniqid = require("uniqid")
const jwt = require("jsonwebtoken");


// (same has admin but can't post or delete) for user access (if you want) is required to allow in the .env or in the deployment site the authorization of guest tokens.
const allow_guests = process.env.GUEST_JWT

g.get("/generate/token", (req, res) => {

      /*
      * Creating a token with the secret key and the guest variable. 
      * Expires in 1h
      * 
      * (same has admin but can't post or delete)
      * 
      * For user access. (if you want) is required to allow in the .env or in the deployment site the authorization of guest tokens.
      * GUEST_JWT=true
      */

      let gu_jwt = (allow_guests.toLowerCase() === 'true');

      if (gu_jwt) {
            const secretKey = uniqid() // using the id generator a random key will be generated.

            jwt.sign({ guest: true }, secretKey, { expiresIn: 60 * 60 * 1000 }, (err, token) => {
                  try {
                        if (err) throw err;

                        const data = {
                              guest_jwt: {
                                    token: token,
                                    secret_key: secretKey,
                                    expiresIn: 60 * 60 * 1000,
                                    permissions: ["GET"]
                              }
                        }

                        res.json(data)

                  } catch (error) {
                        console.error(error)
                  }
            });
      } else {
            res.json({
                  error: {
                        message: "JWT generation for guests is disabled. "
                  }
            })
      }
})

module.exports = { g }