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

const CAMPO =
    'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800'

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
            className="animar-velo fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onClick={onCerrar}
        >
            <div
                className="animar-modal w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold">{tarea ? 'Editar tarea' : 'Nueva tarea'}</h3>

                <label className="mt-4 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Título
                </label>
                <input
                    autoFocus
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && guardar()}
                    placeholder="¿Qué hay que hacer?"
                    className={CAMPO}
                />

                <label className="mt-3 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Descripción <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    placeholder="Detalles, enlaces, notas…"
                    className={`${CAMPO} resize-none`}
                />

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Estado
                        </label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value as Estado)}
                            className={CAMPO}
                        >
                            {ESTADOS.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.titulo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Prioridad
                        </label>
                        <select
                            value={prioridad}
                            onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                            className={CAMPO}
                        >
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Fecha límite
                        </label>
                        <input
                            type="date"
                            value={fechaLimite}
                            onChange={(e) => setFechaLimite(e.target.value)}
                            className={CAMPO}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onCerrar}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={guardar}
                        disabled={!titulo.trim()}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-40"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
