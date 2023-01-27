const { Router } = require("express")
const r = new Router()
const {
      uploadFile,
      getAllFromRepo,
      getVersionFromRepo,
      compareVersions,
      latestVersion,
      deleteById,
      getRepos
} = require("./controllers")

const { getToken, verifyToken } = require("./controllers/auth")

r.get('/all', getToken, verifyToken, getRepos)
r.delete("/:repoid", getToken, verifyToken, deleteById);
r.get("/:repo?",getToken, verifyToken, getAllFromRepo);
r.get("/:repo?/:ver?", getToken, verifyToken, getVersionFromRepo);
r.get("/:repo?/versions/historic", getToken, verifyToken,compareVersions);
r.get("/:repo?/versions/latest", getToken, verifyToken,latestVersion);
r.post("/upload/:repo?", getToken, verifyToken, uploadFile);

module.exports = { r }