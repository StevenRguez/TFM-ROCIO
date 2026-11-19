import { useState, useRef } from 'react'

import { subtitulosPorAudio } from './subtitulos1-5'
import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'

import logoPizarra from '@/assets/raton/logo_pizarra.png'

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
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-5_Arrastrar_y_soltar/Raton1-5-6.wav',
    subtitulos: 'felicitacionArrastre',
  },
] as const

type Raton15Props = { onTerminar: () => void }

function Raton15({ onTerminar }: Raton15Props) {

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
    secuenciaRaton15,
    onTerminar
  )

  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Referencia a la zona donde depositaremos el objeto.
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Indica si el objeto se ha depositado correctamente.
  const [cajaDepositada, setCajaDepositada] = useState(false)

  // =========================================
  // APARICIÓN DE ELEMENTOS
  // =========================================

  // Identifica si estamos en la narración del ejercicio.
  const ejercicioEnCurso = pasoActual === 'comienzoEjercicio'

  // El cuadrado azul aparece cuando la narradora
  // comienza a mencionarlo (segundo 2.1).
  const mostrarCaja = ejercicioEnCurso && !cajaDepositada && (
    tiempoAudio >= 2.1 || esperandoInteraccion )

  // El contenedor rosa aparece cuando la narradora
  // menciona la zona discontinua (segundo 3).
  //
  // También permanece visible durante la felicitación
  // si el objeto ya ha sido depositado.
  const mostrarContenedor =
    (ejercicioEnCurso && (tiempoAudio >= 3 || esperandoInteraccion)) ||
    (pasoActual === 'felicitacionArrastre' && cajaDepositada)

  // =========================================
  // INTERACCIÓN DE ARRASTRAR Y SOLTAR
  // =========================================

  function comprobarDeposito(posicion: { x: number; y: number }) {
    if (!esperandoInteraccion || cajaDepositada) return

    const contenedor = contenedorRef.current
    if (!contenedor) return

    // Obtenemos los límites del contenedor.
    const limites = contenedor.getBoundingClientRect()

    // Comprobamos si se soltó el cursor dentro.
    const dentroHorizontalmente =
      posicion.x >= limites.left && posicion.x <= limites.right

    const dentroVerticalmente =
      posicion.y >= limites.top && posicion.y <= limites.bottom

    // Si se ha depositado correctamente, completamos el ejercicio.
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
          posicionY="18%"
          escala={2}
        />
      )}

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

      {/* Zona de destino */}
      {mostrarContenedor && (
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
      {mostrarCaja && (
        <Caja
          forma="cuadrado"
          color="#84C3D8"
          tamano={125}
          interaccion="dragDrop"
          posicion="fija"
          coordenadas={{x: 15, y: 20}}
          onSoltar={comprobarDeposito}
        />
      )}
    </main>
  )

}

export default Raton15