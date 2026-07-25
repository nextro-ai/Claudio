import { useEffect, useState } from 'react'

export function useLocalStorage<T>(clave: string, valorInicial: T) {
    const [valor, setValor] = useState<T>(() => {
        try {
            const guardado = localStorage.getItem(clave)
            return guardado !== null ? (JSON.parse(guardado) as T) : valorInicial
        } catch {
            return valorInicial
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(clave, JSON.stringify(valor))
        } catch {
            // Sin espacio o en modo privado: la app sigue funcionando en memoria.
        }
    }, [clave, valor])

    return [valor, setValor] as const
}
