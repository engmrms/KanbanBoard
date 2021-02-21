const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumn = document.querySelectorAll(".drag-item-list");
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
let updatedOnLoad = false;

// Drag Functionality
let dragItem;
let currentColumn;
let isDrag = false;
function allowDrop(event) {
  event.preventDefault();
}
function drag(event) {
  dragItem = event.target;
  isDrag = true;
}
function dragEnter(columnOrder) {
  listColumn[columnOrder].classList.add("over");
  currentColumn = columnOrder;
}
function drop(event) {
  event.preventDefault();
  const parent = listColumn[currentColumn];
  listColumn.forEach((column) => column.classList.remove("over"));
  parent.appendChild(dragItem);
  isDrag = false;
  rebuildArrays();
}

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  listArrays.forEach((listArray, index) => {
    localStorage.setItem(
      `${arrayNames[index]}Items`,
      JSON.stringify(listArray)
    );
  });
}

function updateItem(id, columnOrder) {
  const selectedArray = listArrays[columnOrder];
  const selectedEle = listColumn[columnOrder].children;
  if (!isDrag) {
    if (!selectedEle[id].textContent) {
      delete selectedArray.splice(id, 1);
    } else {
      selectedArray[id] = selectedEle[id].textContent;
    }
    updateDOM();
  }
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.id = index;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  listEl.contentEditable = true;

  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlog, index) => {
    createItemEl(backlogList, 0, backlog, index);
  });
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((backlog, index) => {
    createItemEl(progressList, 1, backlog, index);
  });
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((backlog, index) => {
    createItemEl(completeList, 2, backlog, index);
  });
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((backlog, index) => {
    createItemEl(onHoldList, 3, backlog, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function addToColumn(columnOrder) {
  const ItemContent = addItems[columnOrder].textContent;
  listArrays[columnOrder].push(ItemContent);
  addItems[columnOrder].textContent = "";
  updateDOM();
}

function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(
    (item) => item.textContent
  );

  progressListArray = Array.from(progressList.children).map(
    (item) => item.textContent
  );

  completeListArray = Array.from(completeList.children).map(
    (item) => item.textContent
  );

  onHoldListArray = Array.from(onHoldList.children).map(
    (item) => item.textContent
  );

  updateDOM();
}

function showInputBox(columnOrder) {
  addBtns[columnOrder].style.visibility = "hidden";
  saveItemBtns[columnOrder].style.display = "flex";
  addItemContainers[columnOrder].style.display = "flex";
}
function hideInputBox(columnOrder) {
  addBtns[columnOrder].style.visibility = "visible";
  saveItemBtns[columnOrder].style.display = "none";
  addItemContainers[columnOrder].style.display = "none";
  addToColumn(columnOrder);
}

updateDOM();
