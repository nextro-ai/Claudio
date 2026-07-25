import type { Estado, Tarea } from '../types'
import { ESTADOS } from '../types'

const ESTILO_PRIORIDAD: Record<Tarea['prioridad'], string> = {
    alta: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    media: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    baja: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
}

interface Props {
    tarea: Tarea
    onEditar: () => void
    onEliminar: () => void
    onMover: (estado: Estado) => void
}

export default function TareaCard({ tarea, onEditar, onEliminar, onMover }: Props) {
    const indice = ESTADOS.findIndex((e) => e.id === tarea.estado)
    const anterior = ESTADOS[indice - 1]?.id
    const siguiente = ESTADOS[indice + 1]?.id

    const vencida =
        tarea.fechaLimite !== null &&
        tarea.estado !== 'hecha' &&
        new Date(tarea.fechaLimite + 'T23:59:59') < new Date()

    return (
        <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', tarea.id)}
            onClick={onEditar}
            className="animar-entrada group cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
        >
            <div className="flex items-start justify-between gap-2">
                <h4
                    className={`text-sm font-semibold ${
                        tarea.estado === 'hecha' ? 'text-slate-400 line-through' : ''
                    }`}
                >
                    {tarea.titulo}
                </h4>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onEliminar()
                    }}
                    className="shrink-0 rounded-md px-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 md:hidden md:group-hover:block"
                    title="Eliminar tarea"
                >
                    ✕
                </button>
            </div>

            {tarea.descripcion && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {tarea.descripcion}
                </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${ESTILO_PRIORIDAD[tarea.prioridad]}`}
                >
                    {tarea.prioridad}
                </span>
                {tarea.fechaLimite && (
                    <span
                        className={`text-[11px] font-medium ${
                            vencida ? 'text-red-500' : 'text-slate-400'
                        }`}
                    >
                        📅 {new Date(tarea.fechaLimite + 'T00:00:00').toLocaleDateString('es', {
                            day: 'numeric',
                            month: 'short',
                        })}
                        {vencida && ' · vencida'}
                    </span>
                )}

                <span className="ml-auto flex gap-1 md:hidden">
                    {anterior && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onMover(anterior)
                            }}
                            className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 active:scale-90 dark:bg-slate-700 dark:text-slate-300"
                            title="Mover a la columna anterior"
                        >
                            ◀
                        </button>
                    )}
                    {siguiente && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onMover(siguiente)
                            }}
                            className="rounded-lg bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-600 active:scale-90 dark:bg-indigo-950 dark:text-indigo-300"
                            title="Mover a la columna siguiente"
                        >
                            ▶
                        </button>
                    )}
                </span>
            </div>
        </div>
    )
}
