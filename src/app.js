const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.'});
  }

  return next();
}

app.use('repositories/:id', validateRepoId);

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  // getting values to save from the request's body
  const { title, url, techs } = req.body;

  // creating the repository object
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  // sending repo to the repo's array
  repositories.push(repository);

  // returning the created repository
  return res.json(repository);


});

app.put("/repositories/:id", (req, res) => {
  // getting the repo id
  const { id } = req.params;

  // getting the repo's values to update
  const { title, url, techs, likes } = req.body;

  // getting the repo's index
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // checking if it's an existing repo
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  // creating the repo object 
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes, // this line blocks the put route from updating the likes's number
  };

  // updating the repo's array with the changed one
  repositories[repositoryIndex] = repository;

  return res.json(repository);

});

app.delete("/repositories/:id", (req, res) => {
  // getting the repo id
  const { id } = req.params;

  // getting the repo's index
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // checking if it's an existing repo
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  // if exists then delete repo
  repositories.splice(repositoryIndex, 1);

  // return success
  return res.status(204).send();

  
});

app.post("/repositories/:id/like", (req, res) => {
    // getting the repo id and likes
    const { id } = req.params;

    // getting repo
    const repository = repositories.find(repository => repository.id === id);

  // checking if it's an existing repo
  if (!repository) {
    return res.status(400).send();
  }

  // give a like to the existing repo
  repository.likes ++;

  return res.json(repository);

  
});

module.exports = app;
