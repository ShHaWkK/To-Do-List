
self.addEventListener('install', event => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
    console.log('Service Worker activated.');
});

self.addEventListener('push', event => {
    const data = event.data.json(); 
    const title = data.title || 'Notification';
    const options = {
        body: data.body,
        icon: '../images/icon.png', 
        badge: '../images/badge-icon.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
