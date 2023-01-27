const express = require("express");
const cors = require("cors");
const upload = require("express-fileupload")
const app = express();
const path = require("path");
const { port } = require("./config/settings")
const PORT = process.env.PORT || port;
const { endpoints } = require("./src/api");

app.use(upload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles : true,
      tempFileDir : path.join(__dirname+'/tmp/')
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors("*"));
app.use('/repositories', express.static(path.join(__dirname, 'src', 'repositories')))

app.use("/api", endpoints)

app.get('*', function(req, res){
      res.status(404).json({
            status: 404
      })
});

app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`)
});