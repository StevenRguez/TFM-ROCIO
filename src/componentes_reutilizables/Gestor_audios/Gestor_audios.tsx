
import { useEffect, useRef } from 'react'

type GestorAudioProps = {
  src: string
  reproducir: boolean
  onTimeUpdate?: (tiempo: number) => void
  onEnded?: () => void
}

function GestorAudio({
  src,
  reproducir,
  onTimeUpdate,
  onEnded,
}: GestorAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    if (!reproducir) {
      audio.pause()
      return
    }

    audio.src = src
    audio.load()

    audio.play().catch((error: unknown) => {
      console.error('No se pudo reproducir el audio:', error)
    })

    return () => {
      audio.pause()
    }
  }, [src, reproducir])

  return (
    <audio
      ref={audioRef}
      preload="auto"
      onTimeUpdate={(event) => {
        onTimeUpdate?.(event.currentTarget.currentTime)
      }}
      onEnded={() => {
        onEnded?.()
      }}
    />
  )
}

export default GestorAudio
