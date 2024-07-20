document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("saveEntry");
  const entryTextarea = document.getElementById("entryText");
  const imageUpload = document.getElementById("imageUpload");
  const entriesSection = document.getElementById("entries");

  // Загрузка сохраненных записей из localStorage при загрузке страницы
  loadEntries();

  saveButton.addEventListener("click", function () {
    const entryText = entryTextarea.value.trim();
    const entryDate = new Date().toLocaleString("ru-RU");
    let imageUrl = "";

    if (imageUpload.files.length > 0) {
      const file = imageUpload.files[0];
      resizeAndSaveImage(file, entryDate, entryText);
    } else if (entryText !== "") {
      saveEntryToLocalStorage(entryDate, entryText, ""); // Сохраняем запись без изображения
      const entryHTML = createEntryHTML(entryDate, entryText, "");
      // Вставляем новую запись в начало списка
      entriesSection.insertAdjacentHTML("afterbegin", entryHTML);
      entryTextarea.value = "";
    }
    imageUpload.value = ""; // Очистка поля выбора изображения
  });

  function resizeAndSaveImage(file, entryDate, entryText) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Максимальные размеры изображения
        const maxWidth = 800;
        const maxHeight = 600;

        // Устанавливаем размеры canvas
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Рисуем изображение на canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Получаем data URL уменьшенного изображения
        const resizedImage = canvas.toDataURL("image/jpeg", 0.7); // Качество JPEG 0.7

        // Сохраняем изображение в localStorage
        saveEntryToLocalStorage(entryDate, entryText, resizedImage);

        // Вставляем запись с изображением на страницу
        const entryHTML = createEntryHTML(entryDate, entryText, resizedImage);
        // Вставляем новую запись в начало списка
        entriesSection.insertAdjacentHTML("afterbegin", entryHTML);
        entryTextarea.value = "";
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function createEntryHTML(date, text, imageUrl) {
    let imageHTML = "";
    if (imageUrl) {
      imageHTML = `<img src="${imageUrl}" alt="Uploaded Image">`;
    }
    return `
          <div class="entry">
              <div class="entryDate">${date}</div>
              <div class="entryText">${text}</div>
              ${imageHTML}
              <div class="entryButtons">
                  <button class="editButton">Редактировать</button>
                  <button class="deleteButton">Удалить</button>
              </div>
          </div>
      `;
  }

  function saveEntryToLocalStorage(date, text, imageUrl) {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    // Вставляем новую запись в начало массива
    entries.unshift({ date: date, text: text, imageUrl: imageUrl });
    localStorage.setItem("entries", JSON.stringify(entries));
  }

  function loadEntries() {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    // Очищаем список записей перед загрузкой
    entriesSection.innerHTML = "";
    entries.forEach((entry) => {
      const entryHTML = createEntryHTML(entry.date, entry.text, entry.imageUrl);
      // Вставляем записи в начало списка
      entriesSection.insertAdjacentHTML("afterbegin", entryHTML);
    });
  }

  // Обработчик событий для кнопок удаления и редактирования записей
  entriesSection.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("deleteButton")) {
      if (confirm("Вы уверены, что хотите удалить эту запись?")) {
        const entryNode = target.closest(".entry");
        deleteEntry(entryNode);
      }
    } else if (target.classList.contains("editButton")) {
      const entryNode = target.closest(".entry");
      editEntry(entryNode);
    }
  });

  function deleteEntry(entryNode) {
    entryNode.remove();
    updateLocalStorage();
  }

  function editEntry(entryNode) {
    const entryTextElement = entryNode.querySelector(".entryText");
    const entryText = entryTextElement.textContent.trim();
    const entryDate = entryNode.querySelector(".entryDate").textContent;
    const imageUrl = entryNode.querySelector("img")
      ? entryNode.querySelector("img").src
      : "";

    entryTextarea.value = entryText;

    saveButton.innerHTML = "Сохранить изменения";
    saveButton.removeEventListener("click", saveNewEntry);

    saveButton.addEventListener("click", function saveEditedEntry() {
      const newText = entryTextarea.value.trim();
      if (newText === "") {
        return;
      }
      entryTextElement.textContent = newText;
      entryNode.querySelector(".entryDate").textContent = entryDate;
      saveEntryToLocalStorage(entryDate, newText, imageUrl);
      entryTextarea.value = "";
      saveButton.innerHTML = "Сохранить запись";
      saveButton.removeEventListener("click", saveEditedEntry);
      saveButton.addEventListener("click", saveNewEntry);
    });
  }

  function updateLocalStorage() {
    const entries = [];
    const entryNodes = entriesSection.querySelectorAll(".entry");
    entryNodes.forEach((entryNode) => {
      const entryDate = entryNode.querySelector(".entryDate").textContent;
      const entryText = entryNode
        .querySelector(".entryText")
        .textContent.trim();
      const imageUrl = entryNode.querySelector("img")
        ? entryNode.querySelector("img").src
        : "";
      entries.push({ date: entryDate, text: entryText, imageUrl: imageUrl });
    });
    localStorage.setItem("entries", JSON.stringify(entries));
  }
});
