const jwt = require("jsonwebtoken");


const admin = true; // By default admin is true, if the admin token is not
                    // specified in the request this app return 403
                    
                    // For extra security reasons it is recommended to modify the name of the variable or use it in another way, since if a token is created in this way and it is admin true anyone will be able to access the api with that token. For a basic use you can leave it as it is or change it for another name.


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