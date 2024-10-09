const express = require("express");
const app = express();
const PORT = 3000;

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// /notes endpoints
const notes = require("./data/notes");

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res, next) => {
  const { id } = req.params;
  const note = notes.find((n) => n.id === +id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).send(`Note with id ${id} does not exist.`);
  }
});

app.post("/notes", (req, res, next) => {
  const { text } = req.body;
  if (text) {
    notes.push({ id: notes.length + 1, text });
    res.status(201).json(notes.at(-1));
  } else {
    res.status(400).send(`New note must have text.`);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
