document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('new-task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    let taskInput = document.getElementById('new-task');
    let taskCategory = document.getElementById('task-category').value;
    let taskPriority = document.getElementById('task-priority').value;
    if (taskInput.value.trim() === '') return;

    let newTask = document.createElement('li');
    newTask.textContent = taskInput.value + ' [Catégorie: ' + taskCategory + ']';
    newTask.classList.add(taskPriority);
    newTask.addEventListener('click', toggleTaskCompletion);
    newTask.setAttribute('data-category', taskCategory);
    newTask.setAttribute('data-priority', taskPriority);

    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.addEventListener('click', deleteTask);

    let dueDate = document.getElementById('task-due-date').value;
    newTask.setAttribute('data-due-date', dueDate);

    newTask.appendChild(deleteBtn);
    document.getElementById('task-list').appendChild(newTask);
    saveTasks();
    taskInput.value = '';
}


function toggleTaskCompletion(e) {
    e.target.classList.toggle('completed');
    saveTasks();
}

function deleteTask(e) {
    e.target.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#task-list li').forEach(task => {
        tasks.push({
            text: task.firstChild.textContent,
            completed: task.classList.contains('completed'),
            category: task.getAttribute('data-category'),
            priority: task.getAttribute('data-priority'),
            dueDate: task.getAttribute('data-due-date')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        let newTask = document.createElement('li');
        newTask.setAttribute('data-category', task.category);
        newTask.setAttribute('data-priority', task.priority);
        newTask.setAttribute('data-due-date', task.dueDate);
        newTask.textContent = task.text;
        if (task.completed) {
            newTask.classList.add('completed');
        }
        if (task.dueDate && new Date(task.dueDate) < new Date()) {
            newTask.classList.add('overdue');
        }

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', deleteTask);

        newTask.appendChild(deleteBtn);
        newTask.addEventListener('click', toggleTaskCompletion);
        document.getElementById('task-list').appendChild(newTask);
    });
}

function filterTasks() {
    let searchText = document.getElementById('search-text').value.toLowerCase();
    let filterCategory = document.getElementById('filter-category').value;
    let filterPriority = document.getElementById('filter-priority').value;
    let tasks = document.querySelectorAll('#task-list li');

    tasks.forEach(function(task) {
        let taskText = task.textContent.toLowerCase();
        let taskCategory = task.getAttribute('data-category'); 
        let taskPriority = task.getAttribute('data-priority'); 

        if (taskText.includes(searchText) && 
            (filterCategory === '' || taskCategory === filterCategory) && 
            (filterPriority === '' || taskPriority === filterPriority)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}
