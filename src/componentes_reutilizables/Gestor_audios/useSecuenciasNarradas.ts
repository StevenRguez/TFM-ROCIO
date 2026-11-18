import { useState } from 'react'

// Información necesaria para cada narración.
export type PasoNarrado = {
  audio: string
  subtitulos: string
  esperarInteraccion?: boolean
}

// Hook para gestionar una secuencia de narraciones.
export function useSecuenciasNarradas<T extends PasoNarrado>(
  secuencia: readonly T[], onTerminar: () => void) {

  // Estado de la secuencia.
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(true)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  // Información correspondiente a la narración actual.
  const audioActual = secuencia[indiceAudioActual]
  const pasoActual = audioActual.subtitulos

  // Actualiza el tiempo de reproducción.
  function actualizarTiempo(tiempo: number) {
    setTiempoAudio(tiempo)
  }

  // Finaliza la secuencia completa.
  function finalizarSecuencia() {
    setReproducirAudio(false)
    setEsperandoInteraccion(false)
    onTerminar()
  }

  // Gestiona la finalización de una narración.
  function alTerminarAudio() {
    setTiempoAudio(-1)

    // Si el paso requiere una interacción, esperamos.
    if (audioActual.esperarInteraccion) {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // Si es el último paso, finalizamos la secuencia.
    if (indiceAudioActual === secuencia.length - 1) {
      finalizarSecuencia()
      return
    }

    // En los demás casos, avanzamos automáticamente.
    setIndiceAudioActual((indice) => indice + 1)
  }

  // Continúa después de completar una interacción.
  function continuarTrasInteraccion() {
    if (!esperandoInteraccion) return

    setEsperandoInteraccion(false)
    setTiempoAudio(-1)

    // También permitimos que el último paso sea interactivo.
    if (indiceAudioActual === secuencia.length - 1) {
      finalizarSecuencia()
      return
    }

    // Avanzamos a la siguiente narración.
    setIndiceAudioActual((indice) => indice + 1)
    setReproducirAudio(true)
  }

  // Valores y funciones disponibles para las secciones.
  return {
    indiceAudioActual,
    audioActual,
    pasoActual,
    tiempoAudio,
    reproducirAudio,
    esperandoInteraccion,
    actualizarTiempo,
    alTerminarAudio,
    continuarTrasInteraccion,
  }
}
