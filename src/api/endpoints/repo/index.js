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

r.get('/all', getRepos)
r.delete("/:repoid", deleteById);
r.get("/:repo?", getAllFromRepo);
r.get("/:repo?/:ver?", getVersionFromRepo);
r.get("/:repo?/versions/historic", compareVersions);
r.get("/:repo?/versions/latest", latestVersion);
r.post("/upload/:repo?", uploadFile);

module.exports = { r }