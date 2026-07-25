import type { Tarea } from '../types'

const ESTILO_PRIORIDAD: Record<Tarea['prioridad'], string> = {
    alta: 'bg-red-100 text-red-700',
    media: 'bg-amber-100 text-amber-700',
    baja: 'bg-emerald-100 text-emerald-700',
}

interface Props {
    tarea: Tarea
    onEditar: () => void
    onEliminar: () => void
}

export default function TareaCard({ tarea, onEditar, onEliminar }: Props) {
    const vencida =
        tarea.fechaLimite !== null &&
        tarea.estado !== 'hecha' &&
        new Date(tarea.fechaLimite + 'T23:59:59') < new Date()

    return (
        <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', tarea.id)}
            onClick={onEditar}
            className="group cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-300 hover:shadow active:cursor-grabbing"
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
                    className="hidden shrink-0 rounded-md px-1 text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
                    title="Eliminar tarea"
                >
                    ✕
                </button>
            </div>

            {tarea.descripcion && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{tarea.descripcion}</p>
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
            </div>
        </div>
    )
}
