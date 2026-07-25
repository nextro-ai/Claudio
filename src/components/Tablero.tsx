import { useState } from 'react'
import type { Estado, Tarea } from '../types'
import { ESTADOS } from '../types'
import TareaCard from './TareaCard'

interface Props {
    tareas: Tarea[]
    onMover: (tareaId: string, estado: Estado) => void
    onNueva: (estado: Estado) => void
    onEditar: (tarea: Tarea) => void
    onEliminar: (tareaId: string) => void
}

export default function Tablero({ tareas, onMover, onNueva, onEditar, onEliminar }: Props) {
    const [columnaActiva, setColumnaActiva] = useState<Estado | null>(null)

    return (
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-3 md:p-6">
            {ESTADOS.map((col) => {
                const enColumna = tareas.filter((t) => t.estado === col.id)
                return (
                    <div
                        key={col.id}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setColumnaActiva(col.id)
                        }}
                        onDragLeave={() => setColumnaActiva(null)}
                        onDrop={(e) => {
                            e.preventDefault()
                            setColumnaActiva(null)
                            const id = e.dataTransfer.getData('text/plain')
                            if (id) onMover(id, col.id)
                        }}
                        className={`flex h-fit min-h-40 flex-col rounded-2xl border-2 p-3 transition md:min-h-48 ${
                            columnaActiva === col.id
                                ? 'scale-[1.01] border-indigo-300 bg-indigo-50/60 dark:border-indigo-600 dark:bg-indigo-950/40'
                                : 'border-transparent bg-slate-200/50 dark:bg-slate-800/40'
                        }`}
                    >
                        <div className="mb-3 flex items-center justify-between px-1">
                            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                {col.titulo}
                                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-400 dark:bg-slate-700">
                                    {enColumna.length}
                                </span>
                            </h3>
                            <button
                                onClick={() => onNueva(col.id)}
                                className="rounded-lg px-2 text-lg leading-none text-slate-400 transition hover:bg-white hover:text-indigo-600 active:scale-90 dark:hover:bg-slate-700"
                                title={`Añadir tarea en ${col.titulo}`}
                            >
                                +
                            </button>
                        </div>

                        <div className="space-y-2">
                            {enColumna.length === 0 && (
                                <p className="rounded-xl border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-400 dark:border-slate-600">
                                    <span className="hidden md:inline">Arrastra tareas aquí</span>
                                    <span className="md:hidden">Sin tareas</span>
                                </p>
                            )}
                            {enColumna
                                .slice()
                                .sort((a, b) => a.creadaEn - b.creadaEn)
                                .map((t) => (
                                    <TareaCard
                                        key={t.id}
                                        tarea={t}
                                        onEditar={() => onEditar(t)}
                                        onEliminar={() => onEliminar(t.id)}
                                        onMover={(estado) => onMover(t.id, estado)}
                                    />
                                ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
