const addNoteTitleInput = document.querySelector("#add-note-title");
const addNoteDescriptionInput = document.querySelector("#add-note-description");
const addNoteBtn = document.querySelector("#add-note-btn");
const notesContainer = document.querySelector("#notes-container");
const searchInput = document.querySelector("#search-container input");
const searchBtn = document.querySelector("#search-btn");
const exportCsvBtn = document.querySelector("#export-csv")
const modeToggleBtn = document.querySelector("#mode-toggle")
const moonModeIcon = document.querySelector("#mode-toggle .fa-moon")
const sunModeIcon = document.querySelector("#mode-toggle .fa-sun")

let wentInCreateNote = false;
let lightMode = false;

function showNotes() {
    cleanNotes();

    getNotes().forEach(note => {
        const noteElement = createNote(note.id, note.title, note.description, note.fixed);
        notesContainer.appendChild(noteElement);
    });
}

function cleanNotes() {
    notesContainer.replaceChildren([]);
}

function addNote() {
    const titleIsNullOrEmpty = !addNoteTitleInput.value.trim();
    const descriptionIsNullOrEmpty = !addNoteDescriptionInput.value.trim();

    wentInCreateNote = false;

    if (titleIsNullOrEmpty || descriptionIsNullOrEmpty) return;

    wentInCreateNote = true;

    const notes = getNotes();

    const noteObject = {
        id: generateId(),
        title: addNoteTitleInput.value,
        description: addNoteDescriptionInput.value,
        fixed: false
    }

    const noteElement = createNote(noteObject.id, noteObject.title, noteObject.description);
    notesContainer.appendChild(noteElement);

    notes.push(noteObject);
    saveNotes(notes);

    addNoteTitleInput.value = "";
    addNoteDescriptionInput.value = "";

    if (!addNoteTitleInput.classList.contains("hide")) {
        addNoteTitleInput.classList.add("hide");
    }
}

function generateId() {
    return Math.floor(Math.random() * 5000);
}

function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1);

    return orderedNotes;
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function createNote(id, title, description, fixed) {
    const divNote = document.createElement("div");
    divNote.classList.add("note");

    const titleElement = document.createElement("textarea");
    titleElement.name = "noteTitle";
    titleElement.maxLength = 39;
    titleElement.classList.add("noteTitle");
    divNote.appendChild(titleElement);
    titleElement.innerText = title;

    const descriptionElement = document.createElement("textarea");
    descriptionElement.name = "noteDescription";
    descriptionElement.maxLength = 150;
    descriptionElement.classList.add("noteDescription");
    divNote.appendChild(descriptionElement);
    descriptionElement.innerText = description;

    const divBtns = document.createElement("div");
    divBtns.classList.add("note-btns");
    divNote.appendChild(divBtns);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    const trashCanIcon = document.createElement("i");
    trashCanIcon.classList.add(...["fa-solid", "fa-trash-can"]);
    deleteBtn.appendChild(trashCanIcon);
    divBtns.appendChild(deleteBtn);

    const duplicateBtn = document.createElement("button");
    duplicateBtn.classList.add("duplicate-btn");
    const copyIcon = document.createElement("i");
    copyIcon.classList.add(...["fa-solid", "fa-copy"]);
    duplicateBtn.appendChild(copyIcon);
    divBtns.appendChild(duplicateBtn);

    const fixBtn = document.createElement("button");
    fixBtn.classList.add("fix-btn");
    const thumbtackIcon = document.createElement("i");
    thumbtackIcon.classList.add(...["fa-solid", "fa-thumbtack"]);
    fixBtn.appendChild(thumbtackIcon);
    const thumbtackSlashIcon = document.createElement("i");
    thumbtackSlashIcon.classList.add(...["fa-solid", "fa-thumbtack-slash", "hide"]);
    fixBtn.appendChild(thumbtackSlashIcon);
    divBtns.appendChild(fixBtn);

    titleElement.addEventListener("blur", (e) => {
        const newText = e.target.value;
        editTitle(id, newText);
    })

    descriptionElement.addEventListener("blur", (e) => {
        const newText = e.target.value;
        editDescription(id, newText);
    })

    deleteBtn.addEventListener("click", () => {
        deleteNote(id, divNote);
    });

    duplicateBtn.addEventListener("click", () => {
        duplicateNote(id);
    });

    if (fixed) {
        divNote.classList.add("fixed")
        thumbtackIcon.classList.add("hide");
        thumbtackSlashIcon.classList.remove("hide");
    }

    fixBtn.addEventListener("click", () => {
        toggleFixBtn(id);
    });

    return divNote;
}

function editTitle(id, newText) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];
    if (targetNote.title !== newText) targetNote.title = newText;

    saveNotes(notes);
}

function editDescription(id, newText) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];
    if (targetNote.description !== newText) targetNote.description = newText;

    saveNotes(notes);
}

function toggleFixBtn(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];
    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
}

function deleteNote(id, element) {
    const notes = getNotes();

    const filteredNotes = notes.filter((note) => note.id !== id);

    saveNotes(filteredNotes);

    notesContainer.removeChild(element);
}

function duplicateNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id: generateId(),
        title: targetNote.title,
        description: targetNote.description,
        fixed: false
    }

    const noteElement = createNote(noteObject.id, noteObject.title, noteObject.description);
    notesContainer.appendChild(noteElement);

    notes.push(noteObject);
    saveNotes(notes);
}

function toggleAddNoteTitle(id) {
    if (
        id === "add-note-form-inputs" ||
        id === "add-note-title" ||
        id === "add-note-description" ||
        (id === "add-note-btn" && wentInCreateNote === false)
    ) {
        if (addNoteTitleInput.classList.contains("hide")) {
            addNoteTitleInput.classList.remove("hide");
        }
    } else {
        if (!addNoteTitleInput.classList.contains("hide")) {
            addNoteTitleInput.classList.add("hide");
            addNoteTitleInput.value = "";
            addNoteDescriptionInput.value = "";
        }
    }
}

function searchValue(value) {
    const notes = getNotes().filter((note) => note.title.includes(value));

    const searchInputIsNullOrEmpty = !searchInput.value.trim();

    if (!searchInputIsNullOrEmpty) {
        cleanNotes();

        notes.forEach((note) => {
            const noteElement = createNote(note.id, note.title, note.description, note.fixed);
            notesContainer.appendChild(noteElement);
        });

        return;
    }

    showNotes();
}

function exportData() {
    const notes = getNotes();

    const csvString = [
        ["ID", "Título", "Descrição", "Fixado?"],
        ...notes.map((note) => [note.id, note.title, note.description, note.fixed])
    ].map((e) => e.join(",")).join("\n");

    const element = document.createElement("a")
    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);
    element.target = "_blank"
    element.download = "notes.csv"
    element.click();
}

function toggleMode() {
    document.documentElement.style.setProperty('--background-color', `${lightMode ? '#242424' : '#ddd'}`);
    document.documentElement.style.setProperty('--input-background-color', `${lightMode ? '#ddd' : '#242424'}`);
    document.documentElement.style.setProperty('--input-text-color', `${lightMode ? '#242424' : '#ddd'}`);
    document.documentElement.style.setProperty('--border-color', `${lightMode ? '#ddd' : '#242424'}`);
    document.documentElement.style.setProperty('--text-color', `${lightMode ? '#ddd' : '#242424'}`);
    document.documentElement.style.setProperty('--button-color', `${lightMode ? '#ddd' : '#4e4e4e'}`);
    document.documentElement.style.setProperty('--placeholder-color', `${lightMode ? '#777' : '#cfcfcf'}`);
    document.documentElement.style.setProperty('--hover-color', `${lightMode ? '#fff' : '#242424'}`);
    document.documentElement.style.setProperty('--fixed-color', `${lightMode ? '#444' : '#bebebe'}`);
    document.documentElement.style.setProperty('--caret-color', `${lightMode ? '#000' : '#fff'}`);

    moonModeIcon.classList.toggle("hide");
    sunModeIcon.classList.toggle("hide");

    lightMode = !lightMode;
}

document.addEventListener("click", (e) => {
    const elementId = e.target.id;
    toggleAddNoteTitle(elementId);
});

addNoteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addNote();
});

searchInput.addEventListener("keyup", (e) => {
    const value = e.target.value;
    searchValue(value);
});

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
});

exportCsvBtn.addEventListener("click", () => {
    exportData();
});

modeToggleBtn.addEventListener("click", () => {
    toggleMode();
});

showNotes();