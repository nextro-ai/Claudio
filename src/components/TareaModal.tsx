import { useState } from 'react'
import type { Estado, Prioridad, Tarea } from '../types'
import { ESTADOS, nuevoId } from '../types'

interface Props {
    proyectoId: string
    tarea: Tarea | null
    estadoInicial: Estado
    onGuardar: (tarea: Tarea) => void
    onCerrar: () => void
}

export default function TareaModal({ proyectoId, tarea, estadoInicial, onGuardar, onCerrar }: Props) {
    const [titulo, setTitulo] = useState(tarea?.titulo ?? '')
    const [descripcion, setDescripcion] = useState(tarea?.descripcion ?? '')
    const [estado, setEstado] = useState<Estado>(tarea?.estado ?? estadoInicial)
    const [prioridad, setPrioridad] = useState<Prioridad>(tarea?.prioridad ?? 'media')
    const [fechaLimite, setFechaLimite] = useState(tarea?.fechaLimite ?? '')

    function guardar() {
        const limpio = titulo.trim()
        if (!limpio) return
        onGuardar({
            id: tarea?.id ?? nuevoId(),
            proyectoId,
            titulo: limpio,
            descripcion: descripcion.trim(),
            estado,
            prioridad,
            fechaLimite: fechaLimite || null,
            creadaEn: tarea?.creadaEn ?? Date.now(),
        })
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onClick={onCerrar}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold">{tarea ? 'Editar tarea' : 'Nueva tarea'}</h3>

                <label className="mt-4 block text-xs font-semibold text-slate-500">Título</label>
                <input
                    autoFocus
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && guardar()}
                    placeholder="¿Qué hay que hacer?"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />

                <label className="mt-3 block text-xs font-semibold text-slate-500">
                    Descripción <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    placeholder="Detalles, enlaces, notas…"
                    className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />

                <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500">Estado</label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value as Estado)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-2 text-sm outline-none focus:border-indigo-400"
                        >
                            {ESTADOS.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.titulo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500">Prioridad</label>
                        <select
                            value={prioridad}
                            onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-2 text-sm outline-none focus:border-indigo-400"
                        >
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500">Fecha límite</label>
                        <input
                            type="date"
                            value={fechaLimite}
                            onChange={(e) => setFechaLimite(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-2 text-sm outline-none focus:border-indigo-400"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onCerrar}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={guardar}
                        disabled={!titulo.trim()}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
