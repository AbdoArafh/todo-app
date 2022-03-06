import './sass/style.scss';

// --------------- imitating JQuery ----------------------

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
HTMLElement.prototype.on = function(event, handler, options) {
  this.addEventListener(event, handler, options);
}

// ---------------- select elements -----------------------

const listEl = $("#listEl");
const inputEl = $("#inputEl");
const checkboxEl = $("#checkboxEl");
const filtersEl = $("#filtersEl");
const toggleDarkEl = $("#toggleDarkEl");
const itemsLeftEl = $("#itemsLeftEl");


// ------------ adding background images ------------------

import body_bg_desktop_light from './images/bg-desktop-light.jpg'
import icon_moon from './images/icon-moon.svg'
import icon_sun from './images/icon-sun.svg'
import checkmark from './images/icon-check.svg'

const checkmarkGradient = "linear-gradient(to bottom right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))";
Array.from($$(".mark input[type=checkbox]")).forEach(handleCheckmark);

document.body.style.backgroundImage = `url("${body_bg_desktop_light}")`;

const toggleDarkImages = [`url("${icon_moon}")`, `url("${icon_sun}")`];
let isDark = false;

toggleDarkEl.style.backgroundImage = toggleDarkImages[0];
toggleDarkEl.on("click", handleToggleDark);

class Note {
  constructor(value, checked=false) {
    this.value = value;
    this.checked = checked;
  }
}

let notes = [];

function handleToggleDark(e) {
  isDark = !isDark;
  e.target.style.backgroundImage = toggleDarkImages[Number(isDark)];
}

function renderCheckmark(el) {
  const checked = el.checked;
  const checkmarkEl = el.parentElement.querySelector(".checkmark");
  checkmarkEl.style.backgroundImage = checked ? `url("${checkmark}"), ${checkmarkGradient}` : "";
}

function handleCheckmark(c) {
  c.addEventListener("input", e => renderCheckmark(e.target));
}

function renderItemsLeftEl() {
  itemsLeftEl.textContent = notes.filter(note => !note.checked).length;
}

function handleCheckbox(checkbox) {
  const li = checkbox.parentElement.parentElement;
  const index = Array.from(listEl.children).indexOf(li);
  li.parentElement.children[index].classList.toggle("completed");
  notes[index].checked = !notes[index].checked;
  renderCheckmark(checkbox);
  renderItemsLeftEl();
  updateLocalStorage();
  return false;
}

function checkEl(checked) {
  const mark = document.createElement("div");
  mark.className = "mark";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  checkbox.on("click", e => handleCheckbox(e.target));
  mark.appendChild(checkbox);
  const checkmark = document.createElement("div");
  checkmark.className = "checkmark";
  mark.appendChild(checkmark);
  renderCheckmark(checkbox);
  return mark;
}

function noteEl(note) {
  const li = document.createElement("li");
  li.appendChild(checkEl(note.checked));
  const span = document.createElement("span");
  span.textContent = note.value;
  span.on("click", e => {
    const checkbox = e.target.parentElement.querySelector("input[type=checkbox]");
    handleCheckbox(checkbox);
    checkbox.checked = !checkbox.checked;
  });
  li.appendChild(span);
  li.className = note.checked ? "completed" : "";
  li.draggable = true;
  return li;
}

function renderNotes(notes) {
  listEl.innerHTML = "";
  updateLocalStorage();
  notes.forEach(
    note => listEl.appendChild(noteEl(note))
  );
}

function appendNote(note) {
  notes.push(note);
  renderNotes(notes);
}

function handleSubmit(event) {
  event.preventDefault();
  if (!inputEl.value) return;
  const note = new Note(inputEl.value, checkboxEl.checked);
  inputEl.value = "";
  checkboxEl.checked = false;
  renderCheckmark(checkboxEl);
  renderItemsLeftEl();
  appendNote(note);
  filterNotes();
}

$("#form").on("submit", handleSubmit);

let chosenFilter = "All";

function filterNotes() {
  renderNotes(notes.filter(filters[chosenFilter]));
}

function renderFilters(filters) {
  filtersEl.innerHTML = "";
  Object.keys(filters).forEach(
    filter => {
      const filterEl = document.createElement("span");
      filterEl.textContent = filter;
      filterEl.className = filter === chosenFilter ? "active" : "";
      filterEl.on(
        "click",
        (e) => {
          chosenFilter = filter;
          updateLocalStorage();
          e.target.parentElement.querySelector(".active").classList.remove("active");
          e.target.classList.add("active");
          filterNotes();
          return false;
        }
      );
      filtersEl.appendChild(filterEl);
    }
  )
}

const filters = {
  All: () => true,
  Active: (note) => !note.checked,
  Completed: (note) => note.checked
};

$("#clearEl").on(
  "click",
  () => {
    notes = notes.filter(note => !note.checked);
    renderNotes(notes);
    updateLocalStorage();
  }
)

window.addEventListener("load", () => {
  notes = JSON.parse(localStorage.getItem("notes") ?? "[]");
  chosenFilter = localStorage.getItem("chosenFilter") ?? "All";
  $$(".mark input[type=checkbox]").forEach(renderCheckmark);
  renderItemsLeftEl();
  renderFilters(filters);
  filterNotes();
});

function updateLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("chosenFilter", chosenFilter);
}