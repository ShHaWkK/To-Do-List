document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('new-task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    let taskInput = document.getElementById('new-task');
    if (taskInput.value.trim() === '') return;

    let newTask = document.createElement('li');
    newTask.textContent = taskInput.value;
    newTask.addEventListener('click', toggleTaskCompletion);

    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.addEventListener('click', deleteTask);

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
        tasks.push({ text: task.firstChild.textContent, completed: task.classList.contains('completed') });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        let newTask = document.createElement('li');
        newTask.textContent = task.text;
        if (task.completed) {
            newTask.classList.add('completed');
        }

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', deleteTask);

        newTask.appendChild(deleteBtn);
        newTask.addEventListener('click', toggleTaskCompletion);
        document.getElementById('task-list').appendChild(newTask);
    });
}
