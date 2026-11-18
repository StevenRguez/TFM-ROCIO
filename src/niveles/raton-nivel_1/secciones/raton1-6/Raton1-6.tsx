import { useEffect, useState} from 'react'

import { subtitulosPorAudio } from './subtitulos1-6'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/logo_pizarra.png'
import imagenRuedaRaton from '@/assets/rueda_raton.png'
import imagenMovimientoRueda from '@/assets/movimiento_rueda_raton.png'
import imagenClicIzquierdo from '@/assets/clic_izquierdo.png'

import '../../Raton.css'

// Secuencia de audios de la sección de doble clic
const secuenciaRaton16 = [
  {
    audio: '/Audios_generados/raton-nivel_1/1-6_Rueda_raton/Raton1-6-1.wav',
    subtitulos: 'introduccionRueda',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-6_Rueda_raton/Raton1-6-2.wav',
    subtitulos: 'explicacionFuncionamientoRueda',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-6_Rueda_raton/Raton1-6-3.wav',
    subtitulos: 'introduccionEjercicioRueda',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-6_Rueda_raton/Raton1-6-4.wav',
    subtitulos: 'instruccionesEjercicioRueda',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-6_Rueda_raton/Raton1-6-5.wav',
    subtitulos: 'felicitacionRueda',
  }
] as const

type Raton16Props = { onTerminar: () => void }

function Raton16({ onTerminar }: Raton16Props) {

  // Control de la secuencia de audios.
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  const audioActual = secuenciaRaton16[indiceAudioActual]
  const pasoActual = audioActual.subtitulos
  const transcripciones = subtitulosPorAudio[pasoActual]

  // Estados con los que permitir o impedir el scroll
  const [scrollHabilitado, setScrollHabilitado] = useState(false)

  // Inicia la reproducción al entrar en la sección.
  useEffect(() => {
    setReproducirAudio(true)
  }, [])

  // Desplazamiento a la ubicación inicial al terminar el ejercicio
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Función para permitir o impedir el scroll en función de la narración
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    if (!scrollHabilitado) {
      html.classList.add('scroll-bloqueado')
      body.classList.add('scroll-bloqueado')
    } else {
      html.classList.remove('scroll-bloqueado')
      body.classList.remove('scroll-bloqueado')
    }

    return () => {
      html.classList.remove('scroll-bloqueado')
      body.classList.remove('scroll-bloqueado')
    }
  }, [scrollHabilitado])

  // Gestiona la finalización de cada audio.
  function alTerminarAudio() {
    setTiempoAudio(-1)

    // Estos pasos requieren una interacción para continuar.
    if (
      pasoActual === 'instruccionesEjercicioRueda') {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)

      // Permitimos desplazarse por la pizarra.
      setScrollHabilitado(true)
      return
    }

    // Último audio: termina la sección.
    if (pasoActual === 'felicitacionRueda') {
      window.scrollTo(0, 0)
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

  const mostrarImagenRueda =
  (pasoActual === 'introduccionRueda' && tiempoAudio >= 3) ||
  (pasoActual === 'instruccionesEjercicioRueda' &&
    (tiempoAudio >= 0 && tiempoAudio < 3))

  return (
    <main className="pizarra pizarra-rueda">

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
        {mostrarImagenRueda && (
          <img
            className="imagen-rueda-raton"
            src={imagenRuedaRaton}
            alt="Imagen ilustrativa de la ubicación de la rueda del ratón."
          />
        )}

        {pasoActual == "explicacionFuncionamientoRueda" && (
          <img
            className="imagen-movimiento-rueda"
            src={imagenMovimientoRueda}
            alt="Imagen ilustrativa que explica cómo se mueve la rueda de
                 un ratón."
          />
        )}

        {(pasoActual == "instruccionesEjercicioRueda" && tiempoAudio >= 3.1) && (
          <img
            className="imagen-clic-izquierdo"
            src={imagenClicIzquierdo}
            alt="Imagen de un ratón realizando un clic izquierdo."
          />
        )}
      
      </div>

      {pasoActual === 'instruccionesEjercicioRueda' && (
        <Caja
          forma="cuadrado"
          color="#4E9FC1"
          tamano={150}
          interaccion="click"
          posicion="fija"
          coordenadas={{ x: 50, y: 95 }}
          onActivar={continuarTrasInteraccion}
        />
      )}

    </main>
  )
}

export default Raton16