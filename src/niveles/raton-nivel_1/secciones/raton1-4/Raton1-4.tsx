import { useEffect, useState, useRef } from 'react'

import { subtitulosPorAudio } from './subtitulos1-4'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/logo_pizarra.png'
import imagenDobleClic from '@/assets/doble_clic.png'

import '../../Raton.css'

// Secuencia de audios de la sección de doble clic
const secuenciaRaton14 = [
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-1.wav',
    subtitulos: 'aperturaDobleClic',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-2.wav',
    subtitulos: 'ejemploDobleClic',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-3.wav',
    subtitulos: 'explicacionDobleClic',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-4.wav',
    subtitulos: 'repeticionDobleClic',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-5.wav',
    subtitulos: 'explicacionRepeticionDobleClic',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-6.wav',
    subtitulos: 'felicitacionDobleClic',
  }
] as const

type Raton14Props = { onTerminar: () => void }

function Raton14({ onTerminar }: Raton14Props) {

  // Control de la secuencia de audios.
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  // Estado del ejercicio interactivo.
  const [tamanyoCaja, setTamanyoCaja] = useState(200)
  const [cambioEnCurso, setCambioEnCurso] = useState(false)
  const temporizadorCambio = useRef<ReturnType<typeof setTimeout> | null>(null)

  const audioActual = secuenciaRaton14[indiceAudioActual]
  const pasoActual = audioActual.subtitulos
  const transcripciones = subtitulosPorAudio[pasoActual]

  // Inicia la reproducción al entrar en la sección.
  useEffect(() => {
    setReproducirAudio(true)
  }, [])

  // Gestiona la finalización de cada audio.
  function alTerminarAudio() {
    setTiempoAudio(-1)

    // Estos pasos requieren una interacción para continuar.
    if (
      pasoActual === 'explicacionDobleClic' ||
      pasoActual === 'explicacionRepeticionDobleClic'
    ) {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // Último audio: termina la sección.
    if (pasoActual === 'felicitacionDobleClic') {
      setReproducirAudio(false)
      onTerminar()
      return
    }

    // Continúa automáticamente con el siguiente audio.
    setIndiceAudioActual((indice) => indice + 1)
  }

  // Continúa después de una interacción correcta.
  function continuarTrasInteraccion() {
    if (!esperandoInteraccion) return

    setEsperandoInteraccion(false)
    setIndiceAudioActual((indice) => indice + 1)
    setReproducirAudio(true)
  }

  // Gestiona los cambios de color al hacer clic.
  function cambiarTamanyoCaja() {
    if (!esperandoInteraccion || cambioEnCurso) return

    // Evita nuevas interacciones mientras cambia el tamaño
    setCambioEnCurso(true)
    // Alterna entre tamaño pequeño y grande
    setTamanyoCaja((tamanyoActual) =>
      tamanyoActual === 200 ? 300 : 200
    )

    // Deja terminar la animación antes de continuar.
    temporizadorCambio.current = setTimeout(() => {
      setCambioEnCurso(false)
      continuarTrasInteraccion()
    }, 450)

    // LImpiar el temporizador si el componente desaparece
    useEffect(() => {
      return () => {
        if (temporizadorCambio.current !== null) {
          clearTimeout(temporizadorCambio.current)
        }
      }
    }, [])
  }

  const mostrarCajaRosa =
  pasoActual === 'ejemploDobleClic' ||
  pasoActual === 'explicacionDobleClic' 

  const mostrarCajaAmarilla =
  pasoActual === 'repeticionDobleClic' ||
  pasoActual === 'explicacionRepeticionDobleClic' ||
  pasoActual === 'felicitacionDobleClic'

  const mostrarCaja = mostrarCajaRosa || mostrarCajaAmarilla

  return (
    <main className="pizarra">

      {/* Logotipo del proyecto */}
      <img
        className="logo"
        src={logoPizarra}
        alt="Logotipo del sistema dibujado con efecto tiza"
      />

      {/* Reproducción de audios */}
      <GestorAudio
        src={audioActual.audio}
        reproducir={reproducirAudio}
        onTimeUpdate={setTiempoAudio}
        onEnded={alTerminarAudio}
      />

      {/* Subtítulos sincronizados */}
      <GestorSubtitulos
        tiempo={tiempoAudio}
        transcripciones={transcripciones}
      />

      <div className="imagenes-tutorial">

        {/* Imagen explicativa del ratón */}
        {pasoActual == "aperturaDobleClic" && (
          <img
            className="imagen-doble-clic"
            src={imagenDobleClic}
            alt="Imagen explicativa de la ejecución del doble clic 
            en un ratón de ordenador."
          />
        )}
      
      </div>

      {/* Elementos interactivos */}
      {mostrarCaja && (
        <Caja
          forma="cuadrado"
          color={mostrarCajaRosa ? '#ff77d2' : '#f4ff2d'}
          tamano={tamanyoCaja}
          interaccion="doubleClick"
          posicion="aleatoria"
          onActivar={cambiarTamanyoCaja}
        />
      )}
    </main>
  ) 
}

export default Raton14