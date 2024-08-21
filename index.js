 document.addEventListener('DOMContentLoaded', function () {
    const toggleModeButton = document.getElementById('toggle-mode');
    const body = document.body;
    const modal = document.getElementById('todo-modal');
    const modalClose = document.querySelector('.close');
    const addTodoButton = document.getElementById('add-todo-btn');
    const saveTodoButton = document.getElementById('save-todo');
    const todoList = document.getElementById('todo-list');
    const clearAllButton = document.getElementById('clear-all');
    const greeting = document.getElementById('greeting');
    const signinModal = document.getElementById('signin-modal');
    const signinButton = document.getElementById('signin-btn');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    const clearAllModal = document.getElementById('clear-all-modal');
    const confirmClearAllButton = document.getElementById('confirm-clear-all');
    const cancelClearAllButton = document.getElementById('cancel-clear-all');
    let editTodo = null;
    let todoToDelete = null;

    // Show Sign-In Modal on load
    signinModal.style.display = 'flex';

    // Handle Sign-In
    signinButton.addEventListener('click', function () {
        const firstName = document.getElementById('first-name-input').value.trim();
        if (firstName) {
            greeting.textContent = `Hey, ${firstName}!`;
            signinModal.style.display = 'none';
        }
    });

    // Toggle between Light and Dark Mode
    toggleModeButton.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        toggleModeButton.textContent = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });

    // Load To-Dos from Local Storage
    loadTodos();

    // Open To-Do Modal
    addTodoButton.addEventListener('click', function () {
        modal.style.display = 'flex';
        editTodo = null;
        document.getElementById('todo-input').value = '';
    });

    // Close To-Do Modal
    modalClose.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Save To-Do
    saveTodoButton.addEventListener('click', function () {
        const todoInput = document.getElementById('todo-input').value;
        if (todoInput === '') return;

        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleString();

        if (editTodo) {
            editTodo.querySelector('.todo-text').textContent = todoInput;
            editTodo.querySelector('.todo-time').textContent = `Added on: ${formattedTime}`;
            saveToLocalStorage();
        } else {
            const todoItem = document.createElement('li');
            todoItem.innerHTML = `
                <div>
                    <span class="todo-text">${todoInput}</span>
                    <small class="todo-time">Added on: ${formattedTime}</small>
                </div>
                <div>
                    <button class="check-btn">✔</button>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;
            todoList.appendChild(todoItem);

            // Complete To-Do
            todoItem.querySelector('.check-btn').addEventListener('click', function () {
                todoItem.classList.toggle('completed');
                saveToLocalStorage();
            });

            // Edit To-Do
            todoItem.querySelector('.edit-btn').addEventListener('click', function () {
                editTodo = todoItem;
                document.getElementById('todo-input').value = todoItem.querySelector('.todo-text').textContent;
                modal.style.display = 'flex';
            });

            // Delete To-Do with confirmation
            todoItem.querySelector('.delete-btn').addEventListener('click', function () {
                todoToDelete = todoItem;
                deleteModal.style.display = 'flex';
            });

            // Auto-scroll to the bottom
            todoList.scrollTop = todoList.scrollHeight;

            // Save to Local Storage
            saveToLocalStorage();
        }
        modal.style.display = 'none';
    });

    // Confirm Delete
    confirmDeleteButton.addEventListener('click', function () {
        if (todoToDelete) {
            todoList.removeChild(todoToDelete);
            todoToDelete = null;
            saveToLocalStorage();
        }
        deleteModal.style.display = 'none';
    });

    // Cancel Delete
    cancelDeleteButton.addEventListener('click', function () {
        todoToDelete = null;
        deleteModal.style.display = 'none';
    });

    // Open Clear All Confirmation Modal
    clearAllButton.addEventListener('click', function () {
        clearAllModal.style.display = 'flex';
    });

    // Confirm Clear All
    confirmClearAllButton.addEventListener('click', function () {
        todoList.innerHTML = '';
        localStorage.removeItem('todos');
        clearAllModal.style.display = 'none';
    });

    // Cancel Clear All
    cancelClearAllButton.addEventListener('click', function () {
        clearAllModal.style.display = 'none';
    });

    // Save to Local Storage
    function saveToLocalStorage() {
        const todos = [];
        document.querySelectorAll('#todo-list li').forEach(function (todoItem) {
            todos.push({
                text: todoItem.querySelector('.todo-text').textContent,
                time: todoItem.querySelector('.todo-time').textContent,
                completed: todoItem.classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Load from Local Storage
    function loadTodos() {
        const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        savedTodos.forEach(function (todo) {
            const todoItem = document.createElement('li');
            todoItem.innerHTML = `
                <div>
                    <span class="todo-text">${todo.text}</span>
                    <small class="todo-time">${todo.time}</small>
                </div>
                <div>
                    <button class="check-btn">✔</button>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;
            if (todo.completed) {
                todoItem.classList.add('completed');
            }
            todoList.appendChild(todoItem);

            // Complete To-Do
            todoItem.querySelector('.check-btn').addEventListener('click', function () {
                todoItem.classList.toggle('completed');
                saveToLocalStorage();
            });

            // Edit To-Do
            todoItem.querySelector('.edit-btn').addEventListener('click', function () {
                editTodo = todoItem;
                document.getElementById('todo-input').value = todoItem.querySelector('.todo-text').textContent;
                modal.style.display = 'flex';
            });

            // Delete To-Do with confirmation
            todoItem.querySelector('.delete-btn').addEventListener('click', function () {
                todoToDelete = todoItem;
                deleteModal.style.display = 'flex';
            });
        });
    }
});