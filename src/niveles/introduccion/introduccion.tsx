import { useEffect } from 'react' // Registra eventos
import { useRef }    from 'react' // Referencia al audio 
import { useState }  from 'react' // Guarda si se ha comenzado el recorrido
import './Introduccion.css'
import { transcripciones } from './subtitulos'



function App() {
  const [mostrarLogo, setMostrarLogo] = useState(false)
  const [animacionLogo, setAnimacionLogo] = useState(false)
  const [subtituloActual, setSubtituloActual] = useState('')

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const iniciadaRef = useRef(false)

  // Actualiza los subtítulos que se están mostrando por pantalla 
  // siguiendo una serie de marcas temporales
  function actualizarSubtitulo() {
    const audio = audioRef.current

    if (!audio) return

    const tiempoActual = audio.currentTime

    const subtitulo = [...transcripciones]
      .reverse()
      .find((item) => item.tiempo <= tiempoActual)

    setSubtituloActual(subtitulo?.texto ?? '')
  }

  useEffect(() => {
    let temporizador: number | undefined

    function manejarTecla(event: KeyboardEvent) {
      // Evita repetir el inicio al mantener una tecla pulsada.
      if (event.repeat || iniciadaRef.current) return

      iniciadaRef.current = true

      // Intenta activar la pantalla completa.
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((error) => {
          console.error('No se pudo activar pantalla completa:', error)
        })
      }

      // Comienza la narración.
      audioRef.current?.play().catch((error) => {
        console.error('No se pudo reproducir la introducción:', error)
      })

      // El logo empieza a dibujarse 1,5 segundos después.
      temporizador = window.setTimeout(() => {
        setMostrarLogo(true)

        // Permite reiniciar la animación CSS al mostrar el logo.
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
      <audio
        ref={audioRef}
        src="/Audios_generados/Introduccion.wav"
        preload="auto"
        onTimeUpdate={actualizarSubtitulo}
        onEnded={() => setSubtituloActual('')}
      />

      {mostrarLogo && (
        <img
          className={`logo ${animacionLogo ? 'logo--dibujando' : ''}`}
          src="src/assets/logo_pizarra.png"
          alt="Logotipo del sistema dibujado con efecto tiza"
        />
      )}

      <div className="subtitulos" aria-live="polite">
        {/* Aquí aparecerá el texto de la narración */}
        {subtituloActual}
      </div>
    </main>
  )
}

export default App