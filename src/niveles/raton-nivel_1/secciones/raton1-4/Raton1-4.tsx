import { useEffect, useState, useRef } from 'react'

import { subtitulosPorAudio } from './subtitulos1-4'
import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/raton/logo_pizarra.png'
import imagenDobleClic from '@/assets/raton/doble_clic.png'

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
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-4.wav',
    subtitulos: 'repeticionDobleClic',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-5.wav',
    subtitulos: 'explicacionRepeticionDobleClic',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-4_Doble_clic/Raton1-4-6.wav',
    subtitulos: 'felicitacionDobleClic',
  }
] as const

type Raton14Props = { onTerminar: () => void }

function Raton14({ onTerminar }: Raton14Props) {

  // Gestiona la reproducción de la secuencia narrada.
  const {
    audioActual,
    pasoActual,
    tiempoAudio,
    reproducirAudio,
    esperandoInteraccion,
    actualizarTiempo,
    alTerminarAudio,
    continuarTrasInteraccion
  } = useSecuenciasNarradas(
    secuenciaRaton14,
    onTerminar
  )

  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Estado del ejercicio interactivo.
  const [tamanyoCaja, setTamanyoCaja] = useState(200)
  const [cambioEnCurso, setCambioEnCurso] = useState(false)
  const temporizadorCambio = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Limpiar el temporizador si el componente desaparece
  useEffect(() => {
    return () => {
      if (temporizadorCambio.current !== null) {
        clearTimeout(temporizadorCambio.current)
      }
    }
  }, [])

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
        onTimeUpdate={actualizarTiempo}
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
          habilitada={esperandoInteraccion && !cambioEnCurso}
          onActivar={cambiarTamanyoCaja}
        />
      )}
    </main>
  ) 
}

export default Raton14