<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simple Notepad</title>
    <link rel="stylesheet" href="my.css" />
  </head>
  <body>
    <div class="container">
      <h1>Simple Notepad</h1>
      <textarea
        id="note-input"
        placeholder="Write your note here..."
      ></textarea>
      <button onclick="saveNote()">Save Note</button>
      <div id="notes-list">
        <h2>Notes History</h2>
        <ul id="notes"></ul>
      </div>
    </div>
    <script src="my.js"></script>
  </body>
</html>
