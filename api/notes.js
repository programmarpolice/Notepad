// TODO: this file :)

const express = require("express");
const router = express.Router();
module.exports = router;

const notes = require("../data/notes");

router.get("/", (req, res) => {
  res.json(notes);
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const note = notes.find((n) => n.id === +id);
  if (note) {
    res.json(note);
  } else {
    next({ status: 404, message: `Note with id ${id} does not exist.` });
  }
});

router.post("/", (req, res, next) => {
  const { text } = req.body;
  if (text) {
    notes.push({ id: notes.length + 1, text });
    res.status(201).json(notes.at(-1));
  } else {
    next({ status: 400, message: `New note must have text.` });
  }
});
