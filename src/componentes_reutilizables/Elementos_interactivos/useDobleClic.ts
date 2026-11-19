import { useRef, type MouseEvent } from 'react'

// Detecta dos clics realizados sobre el mismo elemento
// dentro de un intervalo configurable.
export function useDobleClic(
  onActivar?: () => void,
  intervaloMs = 800
) {
  // Guarda el instante del primer clic.
  const ultimoClic = useRef<number | null>(null)

  function gestionarClic(evento: MouseEvent<HTMLButtonElement>) {

    // Permite activar el botón mediante teclado o
    // tecnologías de asistencia con una sola activación.
    if (evento.detail === 0) {
      ultimoClic.current = null
      onActivar?.()
      return
    }

    // Solo contamos clics del botón izquierdo.
    if (evento.button !== 0) return

    const instanteActual = evento.timeStamp

    // Comprobamos si ya existe un primer clic.
    if (ultimoClic.current !== null) {

      const tiempoTranscurrido =
        instanteActual - ultimoClic.current

      // Segundo clic dentro del intervalo permitido.
      if (tiempoTranscurrido <= intervaloMs) {
        ultimoClic.current = null
        onActivar?.()
        return
      }
    }

    // Primer clic, o comienzo de un nuevo intento.
    ultimoClic.current = instanteActual
  }

  return gestionarClic
}