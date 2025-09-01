const CACHE_NAME = 'arise-learning-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If offline and no cache, return offline page for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline progress when back online
      syncOfflineData()
    );
  }
});

async function syncOfflineData() {
  try {
    // Get offline progress from IndexedDB or localStorage
    const offlineProgress = JSON.parse(localStorage.getItem('offline-progress') || '[]');
    
    for (const progress of offlineProgress) {
      if (progress.syncRequired) {
        try {
          await fetch('/api/sync-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(progress),
          });
          
          // Mark as synced
          progress.syncRequired = false;
        } catch (error) {
          console.error('Failed to sync progress:', error);
        }
      }
    }
    
    // Update localStorage
    localStorage.setItem('offline-progress', JSON.stringify(offlineProgress));
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling (for future implementation)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New learning content available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'arise-learning',
    actions: [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Arise Learning', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
