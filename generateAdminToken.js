const jwt = require("jsonwebtoken");


const admin = false; // By default admin is true, if the admin token is not
                    // specified in the request this app return 403
const secretkey = process.env.SECRET_SERVER; // make your own secret

jwt.sign({ admin }, secretkey, (err, token) => {
      try {
            if (err) throw err;

            console.log({
                  token: token,
                  secret_key: secretkey
            });

      } catch (error) {
            console.log(error);
      }
});