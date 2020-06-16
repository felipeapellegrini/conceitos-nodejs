const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

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
  const { title, url, techs } = req.body;

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
  };

  // updating the repo's array with the changed one
  repositories[repositoryIndex] = repository;

  return res.json(repository);

});

app.delete("/repositories/:id", (req, res) => {
  // TODO
});

app.post("/repositories/:id/like", (req, res) => {
  // TODO
});

module.exports = app;
