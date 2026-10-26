import { useEffect, useState } from 'react'
import { transcripciones } from './subtitulos'
import GestorAudio from '../../componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '../../componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import logoPizarra from '../../assets/logo_pizarra.png'
import './Introduccion.css'

const audiosIntroduccion = [
  '/Audios_generados/Introduccion.wav'
]

function Introduccion() {
  const [mostrarLogo, setMostrarLogo] = useState(false)
  const [animacionLogo, setAnimacionLogo] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)

  useEffect(() => {
    let temporizador: number | undefined
    let iniciada = false

    function manejarTecla(event: KeyboardEvent) {
      if (event.repeat || iniciada) return

      iniciada = true

      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((error) => {
          console.error(
            'No se pudo activar pantalla completa:',
            error,
          )
        })
      }

      setReproducirAudio(true)

      temporizador = window.setTimeout(() => {
        setMostrarLogo(true)

        requestAnimationFrame(() => {
          setAnimacionLogo(true)
        })
      }, 1500)
    }

    window.addEventListener('keydown', manejarTecla)

    return () => {
      window.removeEventListener('keydown', manejarTecla)

      if (temporizador !== undefined) {
        window.clearTimeout(temporizador)
      }
    }
  }, [])

  return (
    <main className="pizarra">
      <GestorAudio
        audios={audiosIntroduccion}
        reproducir={reproducirAudio}
        onTimeUpdate={(tiempo, indice) => {
          setTiempoAudio(tiempo)
          setIndiceAudioActual(indice)
        }}
        onEnded={() => setTiempoAudio(-1)}
      />

      {mostrarLogo && (
        <img
          className={`logo ${animacionLogo ? 'logo--dibujando' : ''}`}
          src={logoPizarra}
          alt="Logotipo del sistema dibujado con efecto tiza"
        />
      )}

      <GestorSubtitulos
        tiempo={tiempoAudio}
        transcripciones={transcripciones}
      />
    </main>
  )
}

export default Introduccion