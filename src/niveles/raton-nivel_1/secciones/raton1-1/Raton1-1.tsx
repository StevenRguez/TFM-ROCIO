import { useEffect, useState } from 'react'
import { subtitulosPorAudio } from './subtitulos1-1'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/logo_pizarra.png'
import imagenRaton from '@/assets/raton.png'
import imagenCursor from '@/assets/cursor.png'

import '../../Raton.css'

const secuenciaRaton11 = [
  { 
    audio: '/Audios_generados/raton-nivel_1/1-1_Que_es_el_raton/Raton1-1-1.wav', 
    subtitulos: 'presentacion' 
  },
  { 
    audio: '/Audios_generados/raton-nivel_1/1-1_Que_es_el_raton/Raton1-1-2.wav', 
    subtitulos: 'funcion' 
  },
  { 
    audio: '/Audios_generados/raton-nivel_1/1-1_Que_es_el_raton/Raton1-1-3.wav', 
    subtitulos: 'cursor' 
  },
  { 
    audio: '/Audios_generados/raton-nivel_1/1-1_Que_es_el_raton/Raton1-1-4.wav', 
    subtitulos: 'interaccionCursor' 
  },
  { 
    audio: '/Audios_generados/raton-nivel_1/1-1_Que_es_el_raton/Raton1-1-5.wav', 
    subtitulos: 'felicitacionCursor' 
  },
] as const

type Raton11Props = { onTerminar: () => void }

function Raton11({ onTerminar }: Raton11Props) {

  // Estado de la secuencia de audios.
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)

  // Estado de las interacciones.
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  // Audio y subtítulos correspondientes al paso actual.
  const audioActual = secuenciaRaton11[indiceAudioActual]
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Iniciar automáticamente la primera narración.
  useEffect(() => {
    setReproducirAudio(true)
  }, [])

  // Gestionar la finalización de cada narración.
  function alTerminarAudio() {
    setTiempoAudio(-1)

    // Esperar a que el usuario interactúe con la caja azul.
    if (indiceAudioActual === 3) {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // Última narración: finalizar la sección.
    if (indiceAudioActual === secuenciaRaton11.length - 1) {
      setReproducirAudio(false)
      onTerminar()
      return
    }

    // Continuar con la siguiente narración.
    setIndiceAudioActual((indice) => indice + 1)
  }

  // Continuar cuando el usuario complete el ejercicio.
  function continuarTrasInteraccion() {
    if (!esperandoInteraccion) return

    setEsperandoInteraccion(false)
    setIndiceAudioActual(4)
    setReproducirAudio(true)
  }

  return (
    <main className="pizarra">

      {/* Logotipo de ROCIO */}
      <img
        className="logo"
        src={logoPizarra}
        alt="Logotipo del sistema dibujado con efecto tiza"
      />

      <GestorAudio
        src={audioActual.audio}
        reproducir={reproducirAudio}
        onTimeUpdate={setTiempoAudio}
        onEnded={alTerminarAudio}
      />

      <GestorSubtitulos
        tiempo={tiempoAudio}
        transcripciones={transcripciones}
      />

      <div className="imagenes-tutorial">

        {/* Imagen explicativa del ratón */}
        {indiceAudioActual === 1 && (
          <img
            className="imagen-raton"
            src={imagenRaton}
            alt="Imagen del ratón de un ordenador."
          />
        )}

        {/* Imagen explicativa del cursor */}
        {indiceAudioActual === 2 && (
          <img
            className="imagen-cursor"
            src={imagenCursor}
            alt="Imagen del cursor que aparece al mover un ratón."
          />
        )}

      </div>

      {/* Ejercicio de movimiento del cursor */}
      {indiceAudioActual === 3 && (
        <Caja
          forma="cuadrado"
          color="#7bc5e5"
          tamano={200}
          interaccion="hover"
          posicion="aleatoria"
          onActivar={continuarTrasInteraccion}
        />
      )}
    </main>
  )
}

export default Raton11