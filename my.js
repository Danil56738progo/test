// my.js
document.addEventListener("DOMContentLoaded", loadNotes);

function saveNote() {
  const noteInput = document.getElementById("note-input");
  const note = noteInput.value.trim();

  if (note) {
    fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save note");
        }
        noteInput.value = "";
        loadNotes();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function loadNotes() {
  fetch("/notes")
    .then((response) => response.json())
    .then((notes) => {
      const notesList = document.getElementById("notes");
      notesList.innerHTML = "";
      notes.forEach((note) => {
        const li = document.createElement("li");
        li.textContent = `${new Date(note.timestamp).toLocaleString()}: ${
          note.text
        }`;
        notesList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
