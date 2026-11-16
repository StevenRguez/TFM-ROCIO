
import { useEffect, useState, type MouseEvent } from 'react'

import { subtitulosPorAudio } from './subtitulos1-3'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import logoPizarra from '@/assets/logo_pizarra.png'
import clicDerecho from '@/assets/clic_derecho.png'
import cuadroDialogo from '@/assets/cuadro_dialogo.png'

import '../../Raton.css'

// Secuencia de audios de la sección 1-3: clic derecho.
const secuenciaRaton13 = [
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-1.wav',
    subtitulos: 'aperturaClicDerecho',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-2.wav',
    subtitulos: 'ubicacionClicDerecho',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-3.wav',
    subtitulos: 'aparicionCuadroDialogo',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-4.wav',
    subtitulos: 'comprobacionClicDerecho',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-5.wav',
    subtitulos: 'explicacionClicDerecho',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-6.wav',
    subtitulos: 'ejercicioClicDerecho',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-7.wav',
    subtitulos: 'felicitacionClicDerecho',
  },
] as const

type Raton13Props = {
  onTerminar: () => void
}

function Raton13({ onTerminar }: Raton13Props) {

  // Control de la secuencia de audios.
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  // Control del menú contextual.
  const [menuVisible, setMenuVisible] = useState(false)
  const [posicionMenu, setPosicionMenu] = useState({ x: 0, y: 0 })

  const audioActual = secuenciaRaton13[indiceAudioActual]
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
      pasoActual === 'comprobacionClicDerecho' ||
      pasoActual === 'ejercicioClicDerecho'
    ) {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // Último audio: termina la sección.
    if (pasoActual === 'felicitacionClicDerecho') {
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

  // Gestiona el clic derecho y sustituye el menú del navegador.
  function gestionarMenuContextual(evento: MouseEvent<HTMLElement>) {
    evento.preventDefault()

    // No mostramos el menú en los pasos iniciales.
    if (
      pasoActual === 'aperturaClicDerecho' ||
      pasoActual === 'ubicacionClicDerecho' ||
      pasoActual === 'felicitacionClicDerecho'
    ) {
      return
    }

    // Colocamos el menú donde se ha realizado el clic.
    setPosicionMenu({
      x: evento.clientX,
      y: evento.clientY,
    })

    setMenuVisible(true)

    // En la comprobación, el clic derecho permite avanzar.
    if (
      pasoActual === 'comprobacionClicDerecho' &&
      esperandoInteraccion
    ) {
      continuarTrasInteraccion()
    }
  }

  // Oculta el menú contextual.
  function cerrarMenuContextual() {
    setMenuVisible(false)
  }

  // Gestiona la selección de la opción del ejercicio.
  function seleccionarSiguientePaso() {
    if (
      pasoActual !== 'ejercicioClicDerecho' ||
      !esperandoInteraccion
    ) {
      return
    }

    cerrarMenuContextual()
    continuarTrasInteraccion()
  }

  // Determina qué imágenes deben aparecer.
  const mostrarClicDerecho =
    pasoActual === 'ubicacionClicDerecho' ||
    pasoActual === 'aparicionCuadroDialogo' ||
    pasoActual === 'comprobacionClicDerecho'

  const mostrarCuadroDialogo =
    pasoActual === 'aparicionCuadroDialogo' ||
    pasoActual === 'comprobacionClicDerecho'

  return (
    <main
      className="pizarra"
      onContextMenu={gestionarMenuContextual}
      onClick={cerrarMenuContextual}
    >

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

      {/* Imágenes de apoyo */}
      <div className="imagenes-tutorial">

        {mostrarClicDerecho && (
          <img
            className="imagen-clic-derecho"
            src={clicDerecho}
            alt="Imagen de un ratón de ordenador haciendo clic derecho"
          />
        )}

        {mostrarCuadroDialogo && (
          <img
            className="imagen-cuadro-dialogo"
            src={cuadroDialogo}
            alt="Imagen esquemática del menú que aparece al hacer clic derecho"
          />
        )}

      </div>

      {/* Menú contextual interactivo */}
      {menuVisible && (
        <div
          className="menu-contextual"
          style={{
            left: posicionMenu.x,
            top: posicionMenu.y,
          }}
          onClick={(evento) => evento.stopPropagation()}
        >

          <button type="button" disabled>
            Opción 1
          </button>

          <button type="button" disabled>
            Opción 2
          </button>

          <button
            type="button"
            disabled={
              pasoActual !== 'ejercicioClicDerecho' ||
              !esperandoInteraccion
            }
            onClick={seleccionarSiguientePaso}
          >
            Ir al siguiente paso
          </button>

        </div>
      )}

    </main>
  )
}

export default Raton13
