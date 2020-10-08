// todo class: represents a todo
class ToDo {
    constructor(task, description, due) {
        this.task = task;
        this.description = description;
        this.due = due;
    }
};

// UI class: handle UI tasks
class UI {
    static displayTodos() {
        const todos = Store.getTodos();

        todos.forEach(item => UI.addTodoToList(item));
    };

    static addTodoToList(item) {
        const list = document.getElementById("todo-list");
        const row = document.createElement("tr");
        row.innerHTML = 
            `<td>${item.task}</td>
            <td>${item.description}</td>
            <td>${item.due}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
                         `;
        list.appendChild(row);
    };

    // Function to delete target item (1st parent is TD, 2nd parent is 'row')
    static deleteTodo(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    };

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.getElementById('container');
        const form = document.getElementById('todo-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 2500);
    };

    static clearFields() {
        document.getElementById('todo').value = ''
        document.getElementById('description').value = ''
        document.getElementById('due-date').value = ''
    };
};

// Store class: Handles storage
class Store {
    static getTodos() {
        let todos;
        if (localStorage.getItem('todos') === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
        }
        return todos;
    }

    static addToDos(todo) {
        const todos = Store.getTodos();
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static removeTodos(task) {
        const todos = Store.getTodos();

        todos.forEach((todo, index) => {
            if(todo.task === task) {
                todos.splice(index, 1);
            }
        });

        localStorage.removeItem('todos', JSON.stringify(todos));
    }
};

// Events: Display todos
document.addEventListener('DOMContentLoaded', UI.displayTodos);

// Event: Add todo
document.querySelector('#todo-form').addEventListener('submit', (e) => {

    // Prevent actual submissions (local app)
    e.preventDefault();

    // Form Values
    const task = document.getElementById('todo').value;
    const description = document.getElementById('description').value;
    const due = document.getElementById('due-date').value;

    // Validation
    if (task === '' || description === '' || due === '') {
        UI.showAlert('Please Fill In All Fields', 'danger')
    } else {
        // Create Instance Todo
    const todo = new ToDo(task, description, due);
    
    // Add Todo To UI
    UI.addTodoToList(todo);

    // Add Todo To Storage
    Store.addToDos(todo);

    // Success Message
    UI.showAlert('Task Added', 'success')

    // Clear Submit Fields
    UI.clearFields();
    };

    
});

// Event: Remove a todo
document.getElementById('todo-list').addEventListener('click', (e) => 
{
    UI.deleteTodo(e.target);
    UI.showAlert('Task Removed', 'info');
    Store.removeTodos(e.target.parentElement.parentElementSibling.textContent);
    
})
