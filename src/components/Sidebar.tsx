import { useState } from 'react'
import type { Proyecto } from '../types'
import { COLORES_PROYECTO, nuevoId } from '../types'

interface Props {
    proyectos: Proyecto[]
    proyectoActivoId: string | null
    contadorTareas: (proyectoId: string) => number
    onSeleccionar: (id: string) => void
    onCrear: (proyecto: Proyecto) => void
    onEliminar: (id: string) => void
}

export default function Sidebar({
    proyectos,
    proyectoActivoId,
    contadorTareas,
    onSeleccionar,
    onCrear,
    onEliminar,
}: Props) {
    const [creando, setCreando] = useState(false)
    const [nombre, setNombre] = useState('')

    function crearProyecto() {
        const limpio = nombre.trim()
        if (!limpio) return
        onCrear({
            id: nuevoId(),
            nombre: limpio,
            color: COLORES_PROYECTO[proyectos.length % COLORES_PROYECTO.length],
            creadoEn: Date.now(),
        })
        setNombre('')
        setCreando(false)
    }

    return (
        <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-extrabold text-white">
                    C
                </div>
                <div>
                    <h1 className="text-base font-extrabold leading-tight">Claudio</h1>
                    <p className="text-xs text-slate-400">Organizador de proyectos</p>
                </div>
            </div>

            <div className="flex items-center justify-between px-5 pb-2 pt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Proyectos
                </span>
                <button
                    onClick={() => setCreando(true)}
                    className="rounded-lg px-2 py-0.5 text-lg leading-none text-indigo-600 hover:bg-indigo-50"
                    title="Nuevo proyecto"
                >
                    +
                </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
                {creando && (
                    <div className="mb-2 rounded-xl border border-indigo-200 bg-indigo-50 p-2">
                        <input
                            autoFocus
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') crearProyecto()
                                if (e.key === 'Escape') setCreando(false)
                            }}
                            placeholder="Nombre del proyecto…"
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                        />
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={crearProyecto}
                                className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => setCreando(false)}
                                className="rounded-lg px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {proyectos.length === 0 && !creando && (
                    <p className="px-2 py-6 text-center text-sm text-slate-400">
                        Aún no hay proyectos.
                        <br />
                        Crea el primero con “+”.
                    </p>
                )}

                {proyectos.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => onSeleccionar(p.id)}
                        className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            p.id === proyectoActivoId
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: p.color }}
                        />
                        <span className="flex-1 truncate">{p.nombre}</span>
                        <span className="text-xs text-slate-400">{contadorTareas(p.id)}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                if (confirm(`¿Eliminar el proyecto “${p.nombre}” y todas sus tareas?`)) {
                                    onEliminar(p.id)
                                }
                            }}
                            className="hidden rounded-md px-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
                            title="Eliminar proyecto"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </nav>

            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
                Los datos se guardan en este navegador.
            </p>
        </aside>
    )
}
