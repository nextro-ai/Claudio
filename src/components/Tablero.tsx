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
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-6 md:grid-cols-3">
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
                        className={`flex h-fit min-h-48 flex-col rounded-2xl border-2 p-3 transition ${
                            columnaActiva === col.id
                                ? 'border-indigo-300 bg-indigo-50/60'
                                : 'border-transparent bg-slate-200/50'
                        }`}
                    >
                        <div className="mb-3 flex items-center justify-between px-1">
                            <h3 className="text-sm font-bold text-slate-600">
                                {col.titulo}
                                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-400">
                                    {enColumna.length}
                                </span>
                            </h3>
                            <button
                                onClick={() => onNueva(col.id)}
                                className="rounded-lg px-2 text-lg leading-none text-slate-400 hover:bg-white hover:text-indigo-600"
                                title={`Añadir tarea en ${col.titulo}`}
                            >
                                +
                            </button>
                        </div>

                        <div className="space-y-2">
                            {enColumna.length === 0 && (
                                <p className="rounded-xl border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-400">
                                    Arrastra tareas aquí
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
                                    />
                                ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
