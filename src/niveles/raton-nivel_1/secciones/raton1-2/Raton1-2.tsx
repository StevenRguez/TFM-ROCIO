import { useEffect, useState } from 'react'
import { subtitulosPorAudio } from './subtitulos1-2'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/logo_pizarra.png'
import imagenBotones from '@/assets/botones_raton.png'
import clicIzquierdo from '@/assets/clic_izquierdo.png'

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
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-2_Clic_izquierdo/Raton1-2-3.wav',
    subtitulos: 'cambioColorCirculoAmarillo',
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

  // Estados de reproducción.
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  // Estado del ejercicio interactivo.
  const [colorCirculo, setColorCirculo] = useState('#e0fa1a')

  // Audio y subtítulos correspondientes al paso actual.
  const audioActual = secuenciaRaton12[indiceAudioActual]
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Inicia la reproducción al entrar en la sección.
  useEffect(() => {
    setReproducirAudio(true)
  }, [])

  // Gestiona la finalización de cada audio.
  function alTerminarAudio() {
    setTiempoAudio(-1)

    // Esperar al primer o segundo clic sobre el círculo.
    if (indiceAudioActual === 1 || indiceAudioActual === 2) {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // Último audio: finalizar la sección.
    if (indiceAudioActual === secuenciaRaton12.length - 1) {
      setReproducirAudio(false)
      onTerminar()
      return
    }

    // Continuar automáticamente con el siguiente audio.
    setIndiceAudioActual((indice) => indice + 1)
  }

  // Continúa la narración tras una interacción válida.
  function continuarTrasInteraccion() {
    if (!esperandoInteraccion) return

    setEsperandoInteraccion(false)
    setIndiceAudioActual((indice) => indice + 1)
    setReproducirAudio(true)
  }

  // Gestiona los cambios de color al hacer clic.
  function interactuarConCirculo() {
    if (!esperandoInteraccion) return

    // Primer clic: amarillo a rojo.
    if (indiceAudioActual === 1) {
      setColorCirculo('#e03535')
      continuarTrasInteraccion()
      return
    }

    // Segundo clic: rojo a naranja.
    if (indiceAudioActual === 2) {
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
        onTimeUpdate={setTiempoAudio}
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
        {indiceAudioActual === 0 && (
          <img
            className="imagen-botones-raton"
            src={imagenBotones}
            alt="Imagen de los distintos botones de un ratón."
          />
        )}

        {/* Demostración del clic izquierdo */}
        {indiceAudioActual === 0 && tiempoAudio >= 4 && (
          <img
            className="imagen-clic-izquierdo"
            src={clicIzquierdo}
            alt="Imagen de un ratón realizando un clic izquierdo."
          />
        )}

      </div>

      {/* Ejercicio interactivo: círculo de colores */}
      {indiceAudioActual >= 1 && indiceAudioActual <= 3 && (
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