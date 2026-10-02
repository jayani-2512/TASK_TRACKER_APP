(() => {
  const STORAGE_KEY = "taskflow.tasks";
  const THEME_KEY = "taskflow.theme";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const prioritySelect = document.getElementById("priority");
  const list = document.getElementById("task-list");
  const empty = document.getElementById("empty");
  const count = document.getElementById("count");
  const clearDone = document.getElementById("clear-done");
  const themeToggle = document.getElementById("theme-toggle");
  const filterButtons = document.querySelectorAll(".filter");

  let tasks = load(STORAGE_KEY, []);
  let filter = "all";

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* storage unavailable; app still works for this session */
    }
  }

  function render() {
    const visible = tasks.filter((t) =>
      filter === "all" ? true : filter === "done" ? t.done : !t.done
    );

    list.innerHTML = "";
    visible.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task ${task.priority}${task.done ? " done" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", `Mark "${task.title}" as done`);
      checkbox.addEventListener("change", () => toggle(task.id));

      const title = document.createElement("span");
      title.className = "title";
      title.textContent = task.title; // textContent avoids XSS

      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "×";
      del.setAttribute("aria-label", `Delete "${task.title}"`);
      del.addEventListener("click", () => remove(task.id));

      li.append(checkbox, title, del);
      list.appendChild(li);
    });

    empty.hidden = visible.length > 0;
    const left = tasks.filter((t) => !t.done).length;
    count.textContent = `${left} task${left === 1 ? "" : "s"} left`;
  }

  function add(title, priority) {
    tasks.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title,
      priority,
      done: false,
    });
    save();
    render();
  }

  function toggle(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    save();
    render();
  }

  function remove(id) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    add(title, prioritySelect.value);
    input.value = "";
    input.focus();
  });

  filterButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
      render();
    })
  );

  clearDone.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done);
    save();
    render();
  });

  // Theme: saved choice, else system preference
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
  const savedTheme =
    load(THEME_KEY, null) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  });

  render();
})();
