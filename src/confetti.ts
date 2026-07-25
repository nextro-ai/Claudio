const COLORES = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6']

export function lanzarConfetti(cantidad = 120) {
    const canvas = document.createElement('canvas')
    canvas.style.cssText =
        'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:100'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')!

    const piezas = Array.from({ length: cantidad }, () => ({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.3,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 4,
        ancho: 6 + Math.random() * 6,
        alto: 4 + Math.random() * 4,
        color: COLORES[Math.floor(Math.random() * COLORES.length)],
        angulo: Math.random() * Math.PI * 2,
        giro: (Math.random() - 0.5) * 0.3,
    }))

    let frames = 0
    function pintar() {
        frames++
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let vivas = 0
        for (const p of piezas) {
            p.x += p.vx
            p.y += p.vy
            p.vy += 0.06
            p.angulo += p.giro
            if (p.y < canvas.height + 20) vivas++
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.angulo)
            ctx.fillStyle = p.color
            ctx.fillRect(-p.ancho / 2, -p.alto / 2, p.ancho, p.alto)
            ctx.restore()
        }
        if (vivas > 0 && frames < 400) {
            requestAnimationFrame(pintar)
        } else {
            canvas.remove()
        }
    }
    requestAnimationFrame(pintar)
}
