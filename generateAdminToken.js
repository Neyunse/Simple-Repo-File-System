const dotenv = require("dotenv")
dotenv.config()
const jwt = require("jsonwebtoken");

const admin = true; // By default admin is true, if the admin token is not
                    // specified in the request this app return 403
                    
                    // For extra security reasons it is recommended to modify the name of the variable or use it in another way, since if a token is created in this way and it is admin true anyone will be able to access the api with that token. For a basic use you can leave it as it is or change it for another name.

const secretkey = process.env.JWT_KEY; // make your own secret

/* 
* Creating a token with the secret key and the admin variable. 
*/
jwt.sign({ admin }, secretkey, (err, token) => {
      try {
            if (err) throw err;

            const data = {
                  admin_jwt: {
                        token: token,
                        secret_key: secretkey,
                        expiresIn: 60 * 60 * 1000
                  }
            }

      
            console.log(JSON.stringify(data, null, 2));

      } catch (error) {
            console.log(error);
      }
});

