const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к базе данных MongoDB
mongoose.connect("mongodb://localhost:27017/diary", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Ошибка подключения к MongoDB:"));
db.once("open", () => {
  console.log("Подключено к MongoDB");
});

// Определение схемы и модели записи в дневнике
const entrySchema = new mongoose.Schema({
  date: String,
  content: String,
});
const Entry = mongoose.model("Entry", entrySchema);

// Middleware для обработки JSON и URL-encoded данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрут для сохранения записи
app.post("/api/entries", (req, res) => {
  const { date, content } = req.body;

  const newEntry = new Entry({
    date,
    content,
  });

  newEntry
    .save()
    .then(() => {
      console.log("Запись сохранена в базе данных");
      res.status(201).send("Запись успешно сохранена");
    })
    .catch((err) => {
      console.error("Ошибка при сохранении записи:", err);
      res.status(500).send("Ошибка сервера");
    });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});
