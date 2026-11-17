import { useEffect, useState, useRef } from 'react'

import { subtitulosPorAudio } from './subtitulos1-5'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/logo_pizarra.png'

import AnimacionArrastre from './AnimacionArrastre/AnimacionArrastre'

import '../../Raton.css'
import './Raton1-5.css'

// Secuencia de audios de la sección de doble clic
const secuenciaRaton15 = [
  {
    audio: '/Audios_generados/raton-nivel_1/1-5_Arrastrar_y_soltar/Raton1-5-1.wav',
    subtitulos: 'resumenPrevioArrastre',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-5_Arrastrar_y_soltar/Raton1-5-2.wav',
    subtitulos: 'explicacionArrastre',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-5_Arrastrar_y_soltar/Raton1-5-3.wav',
    subtitulos: 'continuacionExplicacionArrastre',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-5_Arrastrar_y_soltar/Raton1-5-5.wav',
    subtitulos: 'comienzoEjercicio',
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-5_Arrastrar_y_soltar/Raton1-5-6.wav',
    subtitulos: 'felicitacionArrastre',
  },
] as const

type Raton15Props = { onTerminar: () => void }

function Raton15({ onTerminar }: Raton15Props) {

  // Control de la secuencia de audios.
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  // Referencia a la zona donde depositaremos el objeto.
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Indica si el objeto se ha depositado correctamente.
  const [cajaDepositada, setCajaDepositada] = useState(false)

  const audioActual = secuenciaRaton15[indiceAudioActual]
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
      pasoActual === 'comienzoEjercicio') {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // Último audio: termina la sección.
    if (pasoActual === 'felicitacionArrastre') {
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

  function comprobarDeposito(posicion: { x: number; y: number }) {
    if (!esperandoInteraccion || cajaDepositada) return

    const contenedor = contenedorRef.current
    if (!contenedor) return

    // Obtenemos los límites del contenedor.
    const limites = contenedor.getBoundingClientRect()

    // Comprobamos si se soltó el cursor dentro.
    const dentroHorizontalmente =
      posicion.x >= limites.left &&
      posicion.x <= limites.right

    const dentroVerticalmente =
      posicion.y >= limites.top &&
      posicion.y <= limites.bottom

    if (dentroHorizontalmente && dentroVerticalmente) {
      setCajaDepositada(true)
      continuarTrasInteraccion()
    }
  }

  return (
    <main className="pizarra">

      {/* Logotipo del proyecto */}
      <img
        className="logo"
        src={logoPizarra}
        alt="Logotipo del sistema dibujado con efecto tiza"
      />

      {/* Animación que muestra la acción */}
      { (pasoActual == "explicacionArrastre" || 
        pasoActual == "continuacionExplicacionArrastre") && (
        <AnimacionArrastre
          posicionX="50%"
          posicionY="25%"
          escala={2}
        />
      )}

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

      {/* Zona de destino */}
      { (pasoActual == "comienzoEjercicio" ||
        (pasoActual === 'felicitacionArrastre' && cajaDepositada)) && (
        <div
          ref={contenedorRef}
          className="contenedor-deposito"
        >
          {cajaDepositada && (
            <div className="objeto-depositado" />
          )}
        </div>
      )}

      {/* Caja que debe arrastrarse */}
      {!cajaDepositada && pasoActual == "comienzoEjercicio" && 
        (tiempoAudio >= 2.1 || esperandoInteraccion) && (
        <Caja
          forma="cuadrado"
          color="#84C3D8"
          tamano={125}
          interaccion="dragDrop"
          posicion="fija"
          coordenadas={{x: 15, y:20}}
          onSoltar={comprobarDeposito}
        />
      )}
    </main>
  )

}

export default Raton15