import { subtitulosPorAudio } from './subtitulos1-1'

import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/raton/logo_pizarra.png'
import imagenRaton from '@/assets/raton/raton.png'
import imagenCursor from '@/assets/raton/cursor.png'

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
    subtitulos: 'interaccionCursor',
    esperarInteraccion: true
  },
  { 
    audio: '/Audios_generados/raton-nivel_1/1-1_Que_es_el_raton/Raton1-1-5.wav', 
    subtitulos: 'felicitacionCursor' 
  },
] as const

type Raton11Props = { onTerminar: () => void }

function Raton11({ onTerminar }: Raton11Props) {

  // Gestiona la reproducción de la secuencia narrada.
  const {
    indiceAudioActual,
    audioActual,
    tiempoAudio,
    reproducirAudio,
    actualizarTiempo,
    alTerminarAudio,
    continuarTrasInteraccion
  } = useSecuenciasNarradas(
    secuenciaRaton11,
    onTerminar
  )

  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

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
        onTimeUpdate={actualizarTiempo}
        onEnded={alTerminarAudio}
      />

      <GestorSubtitulos
        tiempo={tiempoAudio}
        transcripciones={transcripciones}
      />

      {/* Imágenes ilustrativas */}
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