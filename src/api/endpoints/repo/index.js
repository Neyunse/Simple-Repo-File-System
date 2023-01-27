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

const { getToken, verifyAdminToken, verifyGuestToken } = require("./controllers/auth")

// Admin endpoints
r.get('/all', getToken, verifyAdminToken, getRepos)

r.post("/upload/:repo?", getToken, verifyAdminToken, uploadFile);

r.delete("/:repoid", getToken, verifyAdminToken, deleteById);


// Guest endpoints
r.get("/:repo?", getToken, verifyGuestToken, getAllFromRepo);

r.get("/:repo?/:ver?", getToken, verifyGuestToken, getVersionFromRepo);

r.get("/:repo?/versions/historic", getToken, verifyGuestToken, compareVersions);

r.get("/:repo?/versions/latest", getToken, verifyGuestToken, latestVersion);


module.exports = { r }