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
import body_bg_desktop_dark from './images/bg-desktop-dark.jpg'
import body_bg_mobile_dark from './images/bg-mobile-dark.jpg'
import body_bg_mobile_light from './images/bg-mobile-light.jpg'
import icon_moon from './images/icon-moon.svg'
import icon_sun from './images/icon-sun.svg'
import checkmark from './images/icon-check.svg'

let isDark = true;
let isDesktop = true;
const toggleDarkImages = [`url("${icon_moon}")`, `url("${icon_sun}")`];
const bodyBackgrounds = [
  [
    `url("${body_bg_mobile_light}")`,
    `url("${body_bg_mobile_dark}")`
  ],
  [
    `url("${body_bg_desktop_light}")`,
    `url("${body_bg_desktop_dark}")`
  ]
];

const checkmarkGradient = "linear-gradient(to bottom right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))";
Array.from($$(".mark input[type=checkbox]")).forEach(handleCheckmark);

toggleDarkEl.on("click", handleToggleDark);

class Note {
  constructor(value, checked=false) {
    this.value = value;
    this.checked = checked;
  }
}

let notes = [];

function handleBackgroundSize() {
  let { width } = this.getComputedStyle(document.body);
  width = Number(width.replace("px", ""));
  isDesktop = width > 640;
  switchImages();
}

handleBackgroundSize.call(window);
window.addEventListener("resize", handleBackgroundSize);

function switchImages() {
  toggleDarkEl.style.backgroundImage = toggleDarkImages[Number(isDark)];
  document.body.style.backgroundImage = bodyBackgrounds[Number(isDesktop)][Number(isDark)];
}

function toggleDarkMode(newValue) {
  isDark = newValue;
  localStorage.setItem("isDark", isDark);
  document.body.className = isDark ? "dark" : "";
  switchImages();
}

function handleToggleDark() {
  toggleDarkMode(!isDark);
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

function noteEl(note, index) {
  const li = document.createElement("li");
  li.appendChild(checkEl(note.checked));
  const span = document.createElement("span");
  span.textContent = note.value;
  span.on("click", e => {
    const checkbox = e.target.parentElement.querySelector("input[type=checkbox]");
    handleCheckbox(checkbox);
    checkbox.checked = !checkbox.checked;
    renderCheckmark(checkbox);
  });
  li.appendChild(span);
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "X";
  deleteButton.dataset.index = notes.indexOf(note);
  deleteButton.addEventListener(
    "click",
    e => {
      notes.splice(Number(e.target.dataset.index), 1);
      renderItemsLeftEl();
      filterNotes();
      updateLocalStorage();
    }
  );
  li.appendChild(deleteButton);
  li.className = note.checked ? "completed" : "";
  li.draggable = true;
  li.dataset.index = index;
  addEventsDragAndDrop(li);
  return li;
}

function renderNotes(notes, allNotes=notes) {
  listEl.innerHTML = "";
  updateLocalStorage();
  notes.forEach(
    note => listEl.appendChild(noteEl(note, allNotes.indexOf(note)))
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
  renderNotes(notes.filter(filters[chosenFilter]), notes);
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
  isDark = (localStorage.getItem("isDark") ?? "false") === "true" ? true : false;
  toggleDarkMode(isDark);
  renderItemsLeftEl();
  renderFilters(filters);
  filterNotes();
});

function updateLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("chosenFilter", chosenFilter);
}

let dragSrcEl;

function dragStart(e) {
  this.style.opacity = '0.4';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
};
 
function dragEnter(e) {
  this.classList.add('over');
}
 
function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}
 
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}
 
function dragDrop(e) {
  if (dragSrcEl != this) {
    const i = +this.dataset.index;
    const j = +dragSrcEl.dataset.index;
    [notes[i], notes[j]] = [notes[j], notes[i]];
    updateLocalStorage();
    filterNotes();
  }
  return false;
}
 
function dragEnd(e) {
  var listItems = document.querySelectorAll('[draggable=true]');
  listItems.forEach(
    item => item.classList.remove('over')
  );
  this.style.opacity = '1';
}

function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart);
  el.addEventListener('dragenter', dragEnter);
  el.addEventListener('dragover', dragOver);
  el.addEventListener('dragleave', dragLeave);
  el.addEventListener('drop', dragDrop);
  el.addEventListener('dragend', dragEnd);
}