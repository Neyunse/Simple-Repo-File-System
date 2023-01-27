const path = require('path');
const src = path.dirname(path.resolve('src'))
const uniqid = require("uniqid")
const fs = require('fs');
const { Repo } = require('../models')
const rp = new Repo(path.join(src, '/src/DB/repos.json'))
const increment = require('version-incrementer').increment;


const uploadFile = async (req, res) => {

      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjc0Nzc4MzY3fQ.PcIj9zBOXLuePymPs9j5-JK_P4s_am2HycmpjW07GGQ

      // secretkey


      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsImlhdCI6MTY3NDc3OTYzNn0.ZY5aAAd1khaux4GiqWfa1sDJ0NiDQToUWWyDSNMViSE

      // pepito
      try {
            const { files, body } = req

            if (!files) {
                  if (files == null) throw new Error("There are no files")

                  throw new Error("Invalid upload file")
            }



            const repo = body.repo

            if (!repo) throw new Error("Mising repo")

            const ver = body.version

            let fileUp = files.file

            const c = await rp.compareVersion(repo)


            const version = ver ? ver : increment(c[0])

            const rep = ver ? `repositories/${repo}/${ver}` : `repositories/${repo}/${version}`

            if (!fs.existsSync(path.join(src, `/src/${rep}`))) await fs.mkdirSync(path.join(src, `/src/${rep}`), { recursive: true })

            if (fs.existsSync(path.join(src, `/src/${rep}`))) {
                  const pathOut = path.join(src, `/src/${rep}/${fileUp.name}`);

                  const data = {
                        id: uniqid(),
                        repo,
                        file: {
                              version,
                              name: fileUp.name,
                              size: fileUp.size,
                              mimetype: fileUp.mimetype,
                              download: "/" + rep + `/${fileUp.name}`,
                              encoding: fileUp.encoding ? fileUp.encoding : null,
                              md5: fileUp.md5 ? fileUp.md5 : null,
                        }
                  }

                  await fileUp.mv(pathOut, (err) => {

                        if (err) throw Error(err)

                        rp.save(data);

                        return res.json(data)

                  })
            }

      } catch (error) {
            console.log(error)
      }


}

const getAllFromRepo = async (req, res) => {

      const { repo } = req.params

      try {
            if (!repo) throw new Error("Mising repo")
            const r = await rp.getByRepo(repo)

            res.status(200).json(r)
      } catch (error) {
            res.status(400).json({
                  error: {
                        message: error.message
                  }
            })
      }
}

const getVersionFromRepo = async (req, res) => {

      const { repo, ver } = req.params


      try {

            if (!repo || !ver) throw new Error("Mising repo or version")

            const r = await rp.getVersionByRepo(repo, ver)

            res.status(200).json(r)

      } catch (error) {
            res.status(400).json({
                  error: {
                        message: error.message
                  }
            })
      }
}

const compareVersions = async (req, res) => {
      const { repo } = req.params

      try {
            if (!repo) throw new Error("Mising repo")
            const r = await rp.compareVersion(repo)

            res.status(200).json(r)
      } catch (error) {
            res.status(400).json({
                  error: {
                        message: error.message
                  }
            })
      }
}
const latestVersion = async (req, res) => {
      const { repo } = req.params

      try {
            if (!repo) throw new Error("Mising repo")

            const c = await rp.compareVersion(repo)

            const r = await rp.getVersionByRepo(repo, c[0])

            res.status(200).json(r)

      } catch (error) {
            res.status(400).json({
                  error: {
                        message: error.message
                  }
            })
      }


}


const deleteById = async (req, res) => {
      const { repoid } = req.params

      try {
            if (!repoid) throw new Error("Mising repo id")

            const r = await rp.delById(repoid);
            res.status(200).json({ ...r });

      } catch (error) {
            res.status(400).json({
                  error: {
                        message: error.message
                  }
            })
      }

}

const getRepos = async (req, res) => {
      try {
            const r = await rp.getRepos();
            res.status(200).json(r);
      } catch (error) {
            console.log(error)
      }
}

const getToken = (req, res, next) => {
      const bearerHeader = req.headers['authorization'];
      const secretHeader = req.headers['secret_key'];

      if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(" ")[1];
            req.token = bearerToken;
            req.secret = secretHeader
            next();
      } else {
            res.status(403).json({
                  status: res.statusCode,
                  error: {
                        message: "Invalid token"
                  }
            })
      }
}

module.exports = {
      uploadFile,
      getAllFromRepo,
      getVersionFromRepo,
      compareVersions,
      latestVersion,
      deleteById,
      getRepos
}