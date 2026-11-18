import { useState, type MouseEvent } from 'react'

import { subtitulosPorAudio } from './subtitulos1-3'
import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import MenuContextual from '@/componentes_reutilizables/Elementos_interactivos/MenuContextual/MenuContextual'

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
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-5.wav',
    subtitulos: 'explicacionClicDerecho',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-6.wav',
    subtitulos: 'ejercicioClicDerecho',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-3_Clic_derecho/Raton1-3-7.wav',
    subtitulos: 'felicitacionClicDerecho',
  }
] as const

type Raton13Props = {
  onTerminar: () => void
}

function Raton13({ onTerminar }: Raton13Props) {

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
    secuenciaRaton13,
    onTerminar
  )

  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Control del menú contextual.
  const [menuVisible, setMenuVisible] = useState(false)
  const [posicionMenu, setPosicionMenu] = useState({ x: 0, y: 0 })

  // Gestiona el clic derecho durante toda la sección.
  function gestionarMenuContextual(evento: MouseEvent<HTMLElement>) {
    // Impide mostrar el menú nativo del navegador.
    evento.preventDefault()

    // Sitúa el menú en la posición del cursor.
    setPosicionMenu({
      x: evento.clientX,
      y: evento.clientY,
    })

    // Muestra el menú contextual en cualquier momento.
    setMenuVisible(true)

    // La interacción solo permite avanzar en el paso previsto.
    if (
      pasoActual === 'comprobacionClicDerecho' &&
      esperandoInteraccion
    ) {
      continuarTrasInteraccion()
    }
  }

  // Cierra el menú contextual.
  function cerrarMenuContextual() {
    setMenuVisible(false)
  }

  // Gestiona la opción interactiva del menú.
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
        onTimeUpdate={actualizarTiempo}
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
            alt="Imagen de un ratón de ordenador haciendo clic derecho."
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

      {/* Menú contextual personalizado */}
      {menuVisible && (
        <MenuContextual
          posicion={posicionMenu}
          opciones={[
            { texto: 'Opción 1' },
            { texto: 'Opción 2' },
            {
              texto: 'Ir al siguiente paso',
              deshabilitada:
                pasoActual !== 'ejercicioClicDerecho' ||
                !esperandoInteraccion,
              alSeleccionar: seleccionarSiguientePaso
            }
          ]}
        />
      )}

    </main>
  )
}

export default Raton13