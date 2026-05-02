
let todos = [];
let currentFilter = "all";

const loader = document.getElementById("loader");
const todoList = document.getElementById("todoList");
const addBtn = document.getElementById("addBtn");
const filterBtns = document.querySelectorAll(".filter-btn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

function fetchTodos() {
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      todos = data;
      loader.classList.add("hidden");
      renderTodos();
    })
    .catch(function (error) {
      loader.innerHTML = "<p>Error loading todos.</p>";
      console.log(error);
    });
}

function renderTodos() {
  todoList.innerHTML = "";

  let filtered = todos;
  if (currentFilter === "completed") {
    filtered = todos.filter(function (t) { return t.completed; });
  } else if (currentFilter === "incomplete") {
    filtered = todos.filter(function (t) { return !t.completed; });
  }

  if (filtered.length === 0) {
    todoList.innerHTML = "<p style='text-align:center;color:#999;'>No todos to show.</p>";
  } else {
    for (let i = 0; i < filtered.length; i++) {
      const todo = filtered[i];
      const card = document.createElement("div");
      card.className = "todo-card";
      if (todo.completed) {
        card.classList.add("completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", function () {
        toggleTodo(todo.id);
      });

      const title = document.createElement("span");
      title.className = "title";
      title.textContent = todo.title;

      const idLabel = document.createElement("span");
      idLabel.className = "id";
      idLabel.textContent = "#" + todo.id;

      card.appendChild(checkbox);
      card.appendChild(title);
      card.appendChild(idLabel);
      todoList.appendChild(card);
    }
  }

  updateProgress();
}

function toggleTodo(id) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].completed = !todos[i].completed;
      break;
    }
  }
  renderTodos();
}

function addTodo() {
  const newTodo = {
    userId: 1,
    id: todos.length + 1,
    title: "Fixed Task",
    completed: false
  };
  todos.unshift(newTodo);
  renderTodos();
}

function updateProgress() {
  const total = todos.length;
  let completedCount = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].completed) completedCount++;
  }
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  progressText.textContent = "Completed: " + completedCount + " / " + total + " (" + percent + "%)";
  progressFill.style.width = percent + "%";
}

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTodos();
  });
});

addBtn.addEventListener("click", addTodo);

fetchTodos();
