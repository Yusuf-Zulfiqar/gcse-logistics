// Service Worker for Yusuf Exam Alert Push Notifications
// Place this file at the ROOT of the GitHub Pages repo as sw.js

self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Exam Alert', body: event.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏥</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚠️</text></svg>',
    vibrate: data.type === 'alert' ? [200, 100, 200, 100, 200] : [200],
    tag: 'exam-alert-' + (data.date || 'general'),
    renotify: true,
    requireInteraction: data.type === 'alert',
    data: {
      url: data.url || 'https://yusuf-zulfiqar.github.io/gcse-logistics/?view=driver'
    },
    actions: data.type === 'alert' ? [
      { action: 'open', title: 'View Timetable' }
    ] : []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Exam Alert', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const url = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : 'https://yusuf-zulfiqar.github.io/gcse-logistics/?view=driver';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes('gcse-logistics') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new tab
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
