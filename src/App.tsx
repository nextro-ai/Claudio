import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Tablero from './components/Tablero'
import TareaModal from './components/TareaModal'
import { useLocalStorage } from './useLocalStorage'
import type { Estado, Proyecto, Tarea } from './types'

export default function App() {
    const [proyectos, setProyectos] = useLocalStorage<Proyecto[]>('claudio.proyectos', [])
    const [tareas, setTareas] = useLocalStorage<Tarea[]>('claudio.tareas', [])
    const [proyectoActivoId, setProyectoActivoId] = useLocalStorage<string | null>(
        'claudio.proyectoActivo',
        null,
    )
    const [busqueda, setBusqueda] = useState('')
    const [modal, setModal] = useState<{ tarea: Tarea | null; estado: Estado } | null>(null)

    const proyectoActivo = proyectos.find((p) => p.id === proyectoActivoId) ?? proyectos[0] ?? null

    const tareasVisibles = useMemo(() => {
        if (!proyectoActivo) return []
        const texto = busqueda.trim().toLowerCase()
        return tareas.filter(
            (t) =>
                t.proyectoId === proyectoActivo.id &&
                (texto === '' ||
                    t.titulo.toLowerCase().includes(texto) ||
                    t.descripcion.toLowerCase().includes(texto)),
        )
    }, [tareas, proyectoActivo, busqueda])

    const hechas = tareasVisibles.filter((t) => t.estado === 'hecha').length

    function guardarTarea(tarea: Tarea) {
        setTareas((prev) => {
            const existe = prev.some((t) => t.id === tarea.id)
            return existe ? prev.map((t) => (t.id === tarea.id ? tarea : t)) : [...prev, tarea]
        })
        setModal(null)
    }

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            <Sidebar
                proyectos={proyectos}
                proyectoActivoId={proyectoActivo?.id ?? null}
                contadorTareas={(id) => tareas.filter((t) => t.proyectoId === id).length}
                onSeleccionar={setProyectoActivoId}
                onCrear={(p) => {
                    setProyectos((prev) => [...prev, p])
                    setProyectoActivoId(p.id)
                }}
                onEliminar={(id) => {
                    setProyectos((prev) => prev.filter((p) => p.id !== id))
                    setTareas((prev) => prev.filter((t) => t.proyectoId !== id))
                    if (proyectoActivoId === id) setProyectoActivoId(null)
                }}
            />

            <main className="flex flex-1 flex-col overflow-hidden">
                {proyectoActivo ? (
                    <>
                        <header className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: proyectoActivo.color }}
                                />
                                <h2 className="text-xl font-bold">{proyectoActivo.nombre}</h2>
                            </div>
                            <span className="text-sm text-slate-400">
                                {hechas}/{tareasVisibles.length} hechas
                            </span>
                            <div className="ml-auto flex items-center gap-3">
                                <input
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar tareas…"
                                    className="w-48 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                                />
                                <button
                                    onClick={() => setModal({ tarea: null, estado: 'pendiente' })}
                                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                                >
                                    + Nueva tarea
                                </button>
                            </div>
                        </header>

                        <Tablero
                            tareas={tareasVisibles}
                            onMover={(id, estado) =>
                                setTareas((prev) =>
                                    prev.map((t) => (t.id === id ? { ...t, estado } : t)),
                                )
                            }
                            onNueva={(estado) => setModal({ tarea: null, estado })}
                            onEditar={(tarea) => setModal({ tarea, estado: tarea.estado })}
                            onEliminar={(id) =>
                                setTareas((prev) => prev.filter((t) => t.id !== id))
                            }
                        />
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                        <div className="text-5xl">🗂️</div>
                        <h2 className="text-xl font-bold">Bienvenido a Claudio</h2>
                        <p className="max-w-sm text-sm text-slate-500">
                            Crea tu primer proyecto en la barra lateral y empieza a organizar tus
                            tareas en el tablero.
                        </p>
                    </div>
                )}
            </main>

            {modal && proyectoActivo && (
                <TareaModal
                    proyectoId={proyectoActivo.id}
                    tarea={modal.tarea}
                    estadoInicial={modal.estado}
                    onGuardar={guardarTarea}
                    onCerrar={() => setModal(null)}
                />
            )}
        </div>
    )
}
