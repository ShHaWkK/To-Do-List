document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('new-task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
/*                            addTask                         */

function addTask() {
    let taskInput = document.getElementById('new-task');
    let taskCategory = document.getElementById('filter-category').value;
    let taskPriority = document.getElementById('filter-priority').value; 
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
/*                            toggleTaskCompletion                          */

function toggleTaskCompletion(e) {
    e.target.classList.toggle('completed');
    saveTasks();
}

/*                            deleteTask                          */

function deleteTask(e) {
    e.target.parentElement.remove();
    saveTasks();
}
/*                            saveTasks                          */

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

/*                           loadTasks                          */


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

/*                            filterTasks                         */

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

/*                            askPermission                          */

function askPermission() {
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
    .then(function(permissionResult) {
        if (permissionResult !== 'granted') {
            throw new Error('Permission non accordée.');
        }
    });
}

function subscribeUserToPush() {
    return navigator.serviceWorker.register('sw.js')
        .then(function(registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('VOTRE_CLÉ_PUBLIC_VAPID')
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function(pushSubscription) {
            console.log('Reçu PushSubscription: ', JSON.stringify(pushSubscription));
            return pushSubscription;
        });
}

/*                            VAPID Key Conversion                          */

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
