const express = require("express");
const cors = require("cors");
const upload = require("express-fileupload")
const app = express();
const path = require("path");
const { port } = require("./config/settings")
const PORT = process.env.PORT || port;
const { endpoints } = require("./src/api");
const fs = require("fs");

const dotenv = require("dotenv")

dotenv.config()

homePage = process.env.HOME_PAGE;

app.use(upload({
      useTempFiles : true,
      tempFileDir : path.join(__dirname+'/tmp/')
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "./src/ejs");
app.set("view engine", "ejs");
app.use(cors("*"));
app.use('/assets', express.static(path.join(__dirname, 'src', 'public')))

app.use('/repositories', express.static(path.join(__dirname, 'data', 'repositories')))

app.use("/api", endpoints)

app.get("*", function (req, res) {
  res.status(403).render("index", { homePage });
});

async function createFile(p, file) {
      const filename = path.resolve(file)
      if (!fs.existsSync(filename)) {
            await fs.mkdirSync(p, { recursive: true});
            fs.writeFileSync(filename, "", function (err) {
                  if (err) console.error(err)
                  console.log('DB created', filename); 
                  
            });
      }
}

createFile(__dirname+'/data/DB', __dirname+'/data/DB/repositories.json')


app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`)
});
