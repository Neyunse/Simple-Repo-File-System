const { promises: fs } = require("fs")
const uniqid = require("uniqid")
const { compareVersions } = require("compare-versions")
const path = require("path")
class Repo {
      constructor(route) {
            this.route = route
      }
      /**
       * It reads the file, and if it's not empty, it returns the parsed JSON.
       * @returns An array of objects.
       */
      async getAll() {
            const rq = await fs.readFile(this.route, { encoding: 'utf8' })

            return rq ? JSON.parse(rq) : []
      }
      /**
       * It takes an object, adds an id to it, then writes it to a file.
       * @param obj - The object you want to save
       * @returns The id of the object that was saved.
       */
      async save(obj) {
            const repos = await this.getAll()
            if (!obj) {
                  return null
            } else {
                  
                  if (repos.length >= 0) {
                        let writeFile = [...repos, obj]
                        let stringify = JSON.stringify(writeFile, null, 2)
                        await fs.writeFile(this.route, stringify, (err) => {
                              if (err) console.error(err);
                        });

                        return obj

                  }

                  let stringify = JSON.stringify(obj, null, 2)
                  await fs.writeFile(this.route, [stringify], (err) => {
                        if (err) console.error(err);
                  });

                  return obj
            }
      }

      /**
       * It takes an object as a parameter, gets all the repos, finds the index of the repo with
       * the same id as the object, and then replaces the old repo with the new one
       * @param obj - The object to be updated
       * @returns An array of two objects.
       */
      async update(obj) {
            const repos = await this.getAll()
            const item = repos.map(i => i.id).indexOf(obj.id)
            if (item >= 0) {
                  const old = repos[item]
                  obj.id = repos[item].id
                  repos[item] = obj

                  try {
                        await fs.writeFile(this.route, JSON.stringify(repos, null, 2))
                        let up = [
                              {
                                    old: old,
                                    new: obj
                              }
                        ]
                        return up
                  } catch (error) {
                        console.error(error)
                        return []
                  }
            }

            return []

      }

      /**
       * * It gets all the repos, then it finds the repo with the id that matches the id passed in
       * * as an argument, and if it finds it, it returns it, otherwise it returns null
       * @param int - The id of the repo you want to get.
       * @returns The repo with the id of int.
       */
      async getById(int) {
            try {
                  const repos = await this.getAll()
                  let find = repos.find(r => r.id === int)
                  if (!find) {
                        return null
                  }

                  return find

            } catch (error) {
                  console.log(error)
            }
      }

      async getByRepo(str) {
            try {
                  const repos = await this.getAll()
                  
                  return repos.map(r => {
                        if (r.repo === str) { 
                              return r
                        } else {
                              return null
                        }
                  })

            } catch (error) {
                  console.log(error)
            }
      }

      async getRepos() {
            try {
                  const repos = await this.getAll()

                  if (!repos.length) {
                        return {
                              message: "No repositories"
                        }
                  }
                  
                  return repos.map(r => {
                        return r.repo
                  })

            } catch (error) {
                  console.log(error)
            }
      }

      async getVersionByRepo(repo, version) {
            try {
                  const repos = await this.getAll()
                  
                  let find = repos.find(r => r.repo === repo && r.file.version === version)
                  if (!find) {
                        return {
                              message: 'The version you are looking for does not exist'
                        }
                  }

                  return find

            } catch (error) {
                  console.log(error)
            }
      }

      async compareVersion(repo) {
            try {
                  const repos = await this.getAll()

                  const mp = repos.map(r => {
                        if (r.repo === repo) {
                              return r.file.version
                        } else {
                              return "0.0.0"
                        }
                  })

                  const sorted = mp.sort(compareVersions).reverse();

                  if (!sorted.length) {
                       return ["0.0.0"] 
                  }
       
                  return sorted 

            } catch (error) {
                  return {
                        error: {
                              message: error.message
                        }
                  }
            }
      }

    
      /**
       * It takes an id, finds the repo with that id, and then deletes it from the database
       * @param int - The id of the repo you want to delete
       * @returns a boolean value.
       */
      async delById(int) {
            const repos = await this.getAll()
            const Single = repos.find(element => element.id == int)


            if (Single) {

                  try {
                        const dir = path.join(path.resolve(this.route), '../../', `repositories/${Single.repo}/${Single.file.version}`)
                        
                        await fs.rm(dir, { recursive: true, force: true })

                        const filter = repos.filter(element => element != Single)
                        let stringify = JSON.stringify(filter, null, 2)
                        await fs.writeFile(this.route, stringify, (err) => {
                              if (err) throw new Error(err);
                        });
                        
                        return {
                              deleted: int
                        }
                  } catch (error) {
                        console.error(error.message);
                  }
            } else {
                  return {
                        error: {
                              
                              message: 'The id you are looking for does not exist'
                        }
                  }

            }
      }
}

module.exports = {
      Repo
}