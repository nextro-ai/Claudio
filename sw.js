// Service worker: red primero, con caché como respaldo para funcionar sin conexión.
const CACHE = 'claudio-v1'

self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', (evento) => {
    evento.waitUntil(
        (async () => {
            const claves = await caches.keys()
            await Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
            await self.clients.claim()
        })(),
    )
})

self.addEventListener('fetch', (evento) => {
    const { request } = evento
    if (request.method !== 'GET' || !request.url.startsWith('http')) return
    evento.respondWith(
        (async () => {
            const cache = await caches.open(CACHE)
            try {
                const respuesta = await fetch(request)
                if (respuesta.ok) cache.put(request, respuesta.clone())
                return respuesta
            } catch (error) {
                const guardada = await cache.match(request, { ignoreSearch: true })
                if (guardada) return guardada
                throw error
            }
        })(),
    )
})
