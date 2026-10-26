import { useEffect, useRef, useState } from 'react'

type GestorAudioProps = {
  audios: string[]
  reproducir: boolean
  onTimeUpdate?: (tiempo: number, indiceAudio: number) => void
  onEnded?: () => void
}

function GestorAudio({
  audios,
  reproducir,
  onTimeUpdate,
  onEnded,
}: GestorAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [indiceAudio, setIndiceAudio] = useState(0)

  useEffect(() => {
    setIndiceAudio(0)
  }, [audios])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !reproducir || audios.length === 0) {
      audio?.pause()
      return
    }

    const archivoActual = audios[indiceAudio]

    if (!archivoActual) return

    audio.src = archivoActual
    audio.load()

    audio.play().catch((error: unknown) => {
      console.error('No se pudo reproducir el audio:', error)
    })
  }, [audios, indiceAudio, reproducir])

  function avanzarAudio() {
    if (indiceAudio < audios.length - 1) {
      setIndiceAudio((indice) => indice + 1)
    } else {
      onEnded?.()
    }
  }

  return (
    <audio
      ref={audioRef}
      preload="auto"
      onTimeUpdate={(event) => {
        onTimeUpdate?.(
          event.currentTarget.currentTime,
          indiceAudio,
        )
      }}
      onEnded={avanzarAudio}
    />
  )
}

export default GestorAudio