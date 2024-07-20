// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;
const notesFile = path.join(__dirname, "notes.json");

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Обработчик запроса для получения заметок
app.get("/notes", (req, res) => {
  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading notes");
    }
    res.json(JSON.parse(data || "[]"));
  });
});

// Обработчик запроса для сохранения заметки
app.post("/notes", (req, res) => {
  const { note } = req.body;
  if (!note) {
    return res.status(400).send("Note content is required");
  }

  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading notes");
    }

    const notes = JSON.parse(data || "[]");
    notes.push({ text: note, timestamp: new Date() });
    fs.writeFile(notesFile, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error saving note");
      }
      res.status(201).send("Note saved");
    });
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
