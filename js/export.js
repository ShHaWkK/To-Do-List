function exportTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const tasksJson = JSON.stringify(tasks, null, 2);
    const blob = new Blob([tasksJson], {type : 'application/json'});

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tasks.json';
    a.click();
}
