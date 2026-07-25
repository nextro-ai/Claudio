// Sonidos sintetizados con WebAudio: sin archivos de audio que descargar.
let ctx: AudioContext | undefined
let habilitado = true

export function establecerSonido(activo: boolean) {
    habilitado = activo
}

function contexto(): AudioContext {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
}

function tono(
    frecuencia: number,
    retardo: number,
    duracion: number,
    tipo: OscillatorType = 'triangle',
    volumen = 0.12,
) {
    const c = contexto()
    const osc = c.createOscillator()
    const gan = c.createGain()
    osc.type = tipo
    osc.frequency.value = frecuencia
    const t = c.currentTime + retardo
    gan.gain.setValueAtTime(0, t)
    gan.gain.linearRampToValueAtTime(volumen, t + 0.012)
    gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion)
    osc.connect(gan).connect(c.destination)
    osc.start(t)
    osc.stop(t + duracion + 0.05)
}

export const sonidos = {
    crear() {
        if (!habilitado) return
        tono(520, 0, 0.12)
        tono(780, 0.06, 0.16)
    },
    soltar() {
        if (!habilitado) return
        tono(340, 0, 0.09, 'sine', 0.09)
    },
    completar() {
        if (!habilitado) return
        tono(660, 0, 0.14)
        tono(880, 0.09, 0.22)
    },
    fanfarria() {
        if (!habilitado) return
        ;[523, 659, 784, 1047].forEach((f, i) => tono(f, i * 0.11, 0.32, 'triangle', 0.14))
        tono(1319, 0.5, 0.45, 'triangle', 0.1)
    },
    borrar() {
        if (!habilitado) return
        tono(300, 0, 0.1, 'sawtooth', 0.05)
        tono(170, 0.06, 0.14, 'sawtooth', 0.05)
    },
}
