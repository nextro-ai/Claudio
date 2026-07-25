import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Tablero from './components/Tablero'
import TareaModal from './components/TareaModal'
import { useLocalStorage } from './useLocalStorage'
import { establecerSonido, sonidos } from './sonidos'
import { lanzarConfetti } from './confetti'
import type { Estado, Proyecto, Tarea } from './types'

export default function App() {
    const [proyectos, setProyectos] = useLocalStorage<Proyecto[]>('claudio.proyectos', [])
    const [tareas, setTareas] = useLocalStorage<Tarea[]>('claudio.tareas', [])
    const [proyectoActivoId, setProyectoActivoId] = useLocalStorage<string | null>(
        'claudio.proyectoActivo',
        null,
    )
    const [temaOscuro, setTemaOscuro] = useLocalStorage<boolean>('claudio.temaOscuro', false)
    const [sonidoActivo, setSonidoActivo] = useLocalStorage<boolean>('claudio.sonido', true)
    const [busqueda, setBusqueda] = useState('')
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [modal, setModal] = useState<{ tarea: Tarea | null; estado: Estado } | null>(null)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', temaOscuro)
    }, [temaOscuro])

    useEffect(() => {
        establecerSonido(sonidoActivo)
    }, [sonidoActivo])

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

    const delProyecto = proyectoActivo
        ? tareas.filter((t) => t.proyectoId === proyectoActivo.id)
        : []
    const hechas = delProyecto.filter((t) => t.estado === 'hecha').length
    const progreso = delProyecto.length > 0 ? Math.round((hechas / delProyecto.length) * 100) : 0

    function celebrar(nuevas: Tarea[], proyectoId: string) {
        const tareasProyecto = nuevas.filter((t) => t.proyectoId === proyectoId)
        if (tareasProyecto.length > 0 && tareasProyecto.every((t) => t.estado === 'hecha')) {
            sonidos.fanfarria()
            lanzarConfetti(180)
        } else {
            sonidos.completar()
            lanzarConfetti(40)
        }
    }

    function moverTarea(id: string, estado: Estado) {
        const anterior = tareas.find((t) => t.id === id)
        if (!anterior || anterior.estado === estado) return
        const nuevas = tareas.map((t) => (t.id === id ? { ...t, estado } : t))
        setTareas(nuevas)
        if (estado === 'hecha') celebrar(nuevas, anterior.proyectoId)
        else sonidos.soltar()
    }

    function guardarTarea(tarea: Tarea) {
        const anterior = tareas.find((t) => t.id === tarea.id)
        const nuevas = anterior
            ? tareas.map((t) => (t.id === tarea.id ? tarea : t))
            : [...tareas, tarea]
        setTareas(nuevas)
        setModal(null)
        if (tarea.estado === 'hecha' && anterior?.estado !== 'hecha') {
            celebrar(nuevas, tarea.proyectoId)
        } else if (!anterior) {
            sonidos.crear()
        }
    }

    function eliminarTarea(id: string) {
        setTareas((prev) => prev.filter((t) => t.id !== id))
        sonidos.borrar()
    }

    function exportarDatos() {
        const datos = JSON.stringify({ proyectos, tareas }, null, 2)
        const blob = new Blob([datos], { type: 'application/json' })
        const enlace = document.createElement('a')
        enlace.href = URL.createObjectURL(blob)
        enlace.download = 'claudio-datos.json'
        enlace.click()
        URL.revokeObjectURL(enlace.href)
    }

    function importarDatos(archivo: File) {
        const lector = new FileReader()
        lector.onload = () => {
            try {
                const datos = JSON.parse(String(lector.result)) as {
                    proyectos?: Proyecto[]
                    tareas?: Tarea[]
                }
                if (!Array.isArray(datos.proyectos) || !Array.isArray(datos.tareas)) {
                    throw new Error('formato')
                }
                if (
                    confirm(
                        `Se importarán ${datos.proyectos.length} proyectos y ${datos.tareas.length} tareas, reemplazando los datos actuales. ¿Continuar?`,
                    )
                ) {
                    setProyectos(datos.proyectos)
                    setTareas(datos.tareas)
                    setProyectoActivoId(datos.proyectos[0]?.id ?? null)
                    sonidos.crear()
                }
            } catch {
                alert('El archivo no tiene el formato de datos de Claudio.')
            }
        }
        lector.readAsText(archivo)
    }

    const botonCabecera =
        'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'

    return (
        <div className="flex h-dvh overflow-hidden font-sans">
            {menuAbierto && (
                <div
                    className="animar-velo fixed inset-0 z-30 bg-slate-900/50 md:hidden"
                    onClick={() => setMenuAbierto(false)}
                />
            )}
            <div
                className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:static md:translate-x-0 ${
                    menuAbierto ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar
                    proyectos={proyectos}
                    proyectoActivoId={proyectoActivo?.id ?? null}
                    contadorTareas={(id) => tareas.filter((t) => t.proyectoId === id).length}
                    onSeleccionar={(id) => {
                        setProyectoActivoId(id)
                        setMenuAbierto(false)
                    }}
                    onCrear={(p) => {
                        setProyectos((prev) => [...prev, p])
                        setProyectoActivoId(p.id)
                        setMenuAbierto(false)
                        sonidos.crear()
                    }}
                    onEliminar={(id) => {
                        setProyectos((prev) => prev.filter((p) => p.id !== id))
                        setTareas((prev) => prev.filter((t) => t.proyectoId !== id))
                        if (proyectoActivoId === id) setProyectoActivoId(null)
                        sonidos.borrar()
                    }}
                    onExportar={exportarDatos}
                    onImportar={importarDatos}
                />
            </div>

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-6 md:py-4">
                    <button
                        onClick={() => setMenuAbierto(true)}
                        className={`${botonCabecera} md:hidden`}
                        title="Abrir menú"
                    >
                        ☰
                    </button>

                    {proyectoActivo ? (
                        <div className="flex min-w-0 items-center gap-3">
                            <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{ backgroundColor: proyectoActivo.color }}
                            />
                            <h2 className="truncate text-lg font-bold md:text-xl">
                                {proyectoActivo.nombre}
                            </h2>
                        </div>
                    ) : (
                        <h2 className="text-lg font-bold md:text-xl">Claudio</h2>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => setSonidoActivo(!sonidoActivo)}
                            className={botonCabecera}
                            title={sonidoActivo ? 'Silenciar sonidos' : 'Activar sonidos'}
                        >
                            {sonidoActivo ? '🔊' : '🔇'}
                        </button>
                        <button
                            onClick={() => setTemaOscuro(!temaOscuro)}
                            className={botonCabecera}
                            title={temaOscuro ? 'Modo claro' : 'Modo oscuro'}
                        >
                            {temaOscuro ? '☀️' : '🌙'}
                        </button>
                        {proyectoActivo && (
                            <>
                                <input
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar…"
                                    className="hidden w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 sm:block md:w-48"
                                />
                                <button
                                    onClick={() => setModal({ tarea: null, estado: 'pendiente' })}
                                    className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 md:px-4"
                                >
                                    + Tarea
                                </button>
                            </>
                        )}
                    </div>

                    {proyectoActivo && delProyecto.length > 0 && (
                        <div className="flex w-full items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${progreso}%` }}
                                />
                            </div>
                            <span className="text-xs font-semibold text-slate-400">
                                {progreso}% · {hechas}/{delProyecto.length}
                            </span>
                        </div>
                    )}
                </header>

                {proyectoActivo ? (
                    <Tablero
                        tareas={tareasVisibles}
                        onMover={moverTarea}
                        onNueva={(estado) => setModal({ tarea: null, estado })}
                        onEditar={(tarea) => setModal({ tarea, estado: tarea.estado })}
                        onEliminar={eliminarTarea}
                    />
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                        <div className="animar-entrada text-5xl">🗂️</div>
                        <h2 className="text-xl font-bold">Bienvenido a Claudio</h2>
                        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                            Crea tu primer proyecto en el menú y empieza a organizar tus tareas en
                            el tablero.
                        </p>
                        <button
                            onClick={() => setMenuAbierto(true)}
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 md:hidden"
                        >
                            Abrir menú
                        </button>
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
