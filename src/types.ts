export type Estado = 'pendiente' | 'en_curso' | 'hecha'
export type Prioridad = 'alta' | 'media' | 'baja'

export interface Proyecto {
    id: string
    nombre: string
    color: string
    creadoEn: number
}

export interface Tarea {
    id: string
    proyectoId: string
    titulo: string
    descripcion: string
    estado: Estado
    prioridad: Prioridad
    fechaLimite: string | null
    creadaEn: number
}

export const ESTADOS: { id: Estado; titulo: string }[] = [
    { id: 'pendiente', titulo: 'Por hacer' },
    { id: 'en_curso', titulo: 'En curso' },
    { id: 'hecha', titulo: 'Hechas' },
]

export const COLORES_PROYECTO = [
    '#6366f1',
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#8b5cf6',
    '#14b8a6',
]

export function nuevoId(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
