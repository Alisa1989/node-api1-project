const express = require("express");
const db = require("./database");

const server = express();
server.use(express.json());

server.post("/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user.",
    });
  }
  const newUser = db.createUser({
    name: req.body.name,
    bio: req.body.bio,
  });
  res.status(201).json(newUser);
  //else
  res
    .status(500)
    .json({
      errorMessage: "There was an error while saving the user to the database",
    });
});

server.get("/users", (req, res) => {
  const users = db.getUsers();
  res.json(users);
});

server.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  }
  //else
  res
    .status(500)
    .json({ errorMessage: "The user information could not be retrieved." });
});

server.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);

  if (!user) {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  } else {
    if (!req.body.name || !req.body.bio) {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user.",
      });
    }
    const updatedUser = db.updateUser(id, {
      name: req.body.name,
      bio: req.body.bio,
    });
    res.status(200).json(updatedUser);
  }
  //else
  res.status(500).json({ errorMessage: "The user information could not be modified." });
});

server.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);

  if (user) {
    db.deleteUser(id);
    //204 = succesful empty response
    res.status(204).end();
  } else {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  }
  //else
  res.status(500).json({ errorMessage: "The user could not be removed" });
});

//web servers need to be continuously listening
server.listen(8080, () => {
  console.log("server started");
});
