function importTasks(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const tasks = JSON.parse(e.target.result);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks(); // Recharger la liste de tâches
        };
        reader.readAsText(file);
    }
}
document.getElementById('import').addEventListener('change', importTasks);
