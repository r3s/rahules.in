document.addEventListener('DOMContentLoaded', () => {
    const datetimeElement = document.getElementById('datetime');
    const todoInput = document.getElementById('todo-input');
    const addTodoButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');
    const notesEditor = document.getElementById('notes-editor');

    // Date and Time
    function updateDateTime() {
        const now = new Date();
        const datePart = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        datetimeElement.textContent = `${datePart}, ${timePart}`;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Todo List
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.sort((a, b) => a.done - b.done);
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.done ? 'done' : '';
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" data-index="${index}" ${todo.done ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-todo" data-index="${index}">🗑️</button>
            `;
            todoList.appendChild(li);
        });
    }

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText) {
            todos.push({ text: todoText, done: false });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    }

    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-todo') || e.target.parentElement.classList.contains('delete-todo')) {
            const index = e.target.closest('[data-index]').dataset.index;
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        } else if (e.target.classList.contains('todo-checkbox')) {
            const index = e.target.dataset.index;
            todos[index].done = e.target.checked;
            saveTodos();
            renderTodos();
        } else if (e.target.classList.contains('todo-text')) {
            const newText = prompt('Update todo:', e.target.textContent);
            if (newText !== null) {
                const index = Array.from(todoList.children).indexOf(e.target.parentElement);
                todos[index].text = newText.trim();
                saveTodos();
                renderTodos();
            }
        }
    });

    // Notes
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notesEditor.innerHTML = savedNotes;
    }

    notesEditor.addEventListener('input', () => {
        localStorage.setItem('notes', notesEditor.innerHTML);
    });

    renderTodos();
});