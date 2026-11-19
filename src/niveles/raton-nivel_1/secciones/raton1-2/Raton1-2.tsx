import { useState } from 'react'

import { subtitulosPorAudio } from './subtitulos1-2'

import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/raton/logo_pizarra.png'
import imagenBotones from '@/assets/raton/botones_raton.png'
import clicIzquierdo from '@/assets/raton/clic_izquierdo.png'

import '../../Raton.css'

// Secuencia de audios de la sección: clic izquierdo.
const secuenciaRaton12 = [
  {
    audio: '/Audios_generados/raton-nivel_1/1-2_Clic_izquierdo/Raton1-2-1.wav',
    subtitulos: 'introduccionClicIzquierdo',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-2_Clic_izquierdo/Raton1-2-2.wav',
    subtitulos: 'clicIzquierdoCirculoAmarillo',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-2_Clic_izquierdo/Raton1-2-3.wav',
    subtitulos: 'cambioColorCirculoAmarillo',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-2_Clic_izquierdo/Raton1-2-4.wav',
    subtitulos: 'cambioColorCirculoNaranja',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-2_Clic_izquierdo/Raton1-2-5.wav',
    subtitulos: 'explicacionBotonIzquierdo',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-2_Clic_izquierdo/Raton1-2-6.wav',
    subtitulos: 'ejemplosClicIzquierdo',
  },
] as const

type Raton12Props = { onTerminar: () => void }

function Raton12({ onTerminar }: Raton12Props) {

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
    secuenciaRaton12,
    onTerminar
  )

  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Estado del ejercicio interactivo.
  const [colorCirculo, setColorCirculo] = useState('#e0fa1a')

  // Gestiona los cambios de color al hacer clic.
  function interactuarConCirculo() {
    if (!esperandoInteraccion) return

    // Primer clic: amarillo a rojo.
    if (pasoActual === "clicIzquierdoCirculoAmarillo") {
      setColorCirculo('#e03535')
      continuarTrasInteraccion()
      return
    }

    // Segundo clic: rojo a naranja.
    if (pasoActual === "cambioColorCirculoAmarillo") {
      setColorCirculo('#ff7b00')
      continuarTrasInteraccion()
    }
  }

  return (
    <main className="pizarra">

      {/* Logotipo de ROCIO */}
      <img
        className="logo"
        src={logoPizarra}
        alt="Logotipo del sistema dibujado con efecto tiza"
      />

      {/* Reproducción de audio */}
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

      {/* Imágenes explicativas */}
      <div className="imagenes-tutorial">

        {/* Botones del ratón */}
        {pasoActual === "introduccionClicIzquierdo" && (
          <img
            className="imagen-botones-raton"
            src={imagenBotones}
            alt="Imagen de los distintos botones de un ratón."
          />
        )}

        {/* Demostración del clic izquierdo */}
        {pasoActual === "introduccionClicIzquierdo" && tiempoAudio >= 4 && (
          <img
            className="imagen-clic-izquierdo"
            src={clicIzquierdo}
            alt="Imagen de un ratón realizando un clic izquierdo."
          />
        )}

      </div>

      {/* Ejercicio interactivo: círculo de colores */}
      {(pasoActual === "clicIzquierdoCirculoAmarillo" ||
        pasoActual === "cambioColorCirculoAmarillo"   ||
        pasoActual === "cambioColorCirculoNaranja"    ) && (
        <Caja
          forma="circulo"
          color={colorCirculo}
          tamano={200}
          interaccion="click"
          posicion="aleatoria"
          onActivar={interactuarConCirculo}
        />
      )}
      
    </main>
  )
}

export default Raton12