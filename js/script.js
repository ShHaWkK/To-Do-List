function addTask() {
    let taskInput = document.getElementById('new-task');
    let taskList = document.getElementById('task-list');

    if (taskInput.value.trim() !== '') {
        let newTask = document.createElement('li');
        newTask.textContent = taskInput.value;
        taskList.appendChild(newTask);
        taskInput.value = '';
    }
}
