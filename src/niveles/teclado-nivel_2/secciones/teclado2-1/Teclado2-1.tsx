import { useState } from 'react'

import { subtitulosPorAudio } from './subtitulos2-1'
import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import CuadroTexto from '@/componentes_reutilizables/Elementos_interactivos/CuadroTexto/CuadroTexto'

import logoTerminal from '@/assets/teclado/logo_terminal.png'
import imagenMaquinaEscribir from '@/assets/teclado/maquina_escribir.png'
import imagenTecladoSimple from '@/assets/teclado/teclado_simple.png'

import '../../Teclado.css'

// Secuencia de audios de la sección 2-1: introducción al teclado.
const secuenciaTeclado21 = [
  {
    audio: '/Audios_generados/teclado-nivel_2/2-1_Introduccion/Teclado2-1-1.wav',
    subtitulos: 'presentacionMaquinaEscribir',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-1_Introduccion/Teclado2-1-2.wav',
    subtitulos: 'presentacionTeclado',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-1_Introduccion/Teclado2-1-3.wav',
    subtitulos: 'pruebaEscritura',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-1_Introduccion/Teclado2-1-4.wav',
    subtitulos: 'felicitacionIntroduccion'
  },
] as const

// Texto requerido para completar el ejercicio.
const TEXTO_ESPERADO = 'rocio'

type Teclado21Props = { onTerminar: () => void }

function Teclado21({ onTerminar }: Teclado21Props) {
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
      secuenciaTeclado21,
      onTerminar
    )
  
  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

    // Almacena los caracteres introducidos por el usuario.
  const [textoEscrito, setTextoEscrito] = useState('')

  // Gestiona la escritura y comprueba el resultado.
  function gestionarCambioTexto(nuevoTexto: string) {

    // Actualizamos el contenido del cuadro.
    setTextoEscrito(nuevoTexto)

    // Solo validamos durante el ejercicio y una vez
    // que la narradora haya terminado las instrucciones.
    if (
      pasoActual !== 'pruebaEscritura' ||
      !esperandoInteraccion
    ) {
      return
    }

    // Si el texto coincide, avanzamos automáticamente.
    if (nuevoTexto === TEXTO_ESPERADO) {
      continuarTrasInteraccion()
    }
  }

  // El cuadro aparece después de las instrucciones
  // y permanece visible durante la felicitación.
  const mostrarCuadroTexto =
    (
      pasoActual === 'pruebaEscritura' &&
      esperandoInteraccion
    ) ||
    pasoActual === 'felicitacionIntroduccion'

  return (
    <main className="pantalla-teclado">
      <section className="terminal">

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

        {/* Cabecera del nivel */}
        <header className="terminal-cabecera">
          ROCIO — NIVEL 02: TECLADO. INTRODUCCION
        </header>

        {/* Área principal de la terminal */}
        <div className="terminal-contenido">
          {/* Logotipo del sistema */}
          <img
            className="logo-terminal"
            src={logoTerminal}
            alt="Logotipo de ROCIO"
          />

          {/* Imágenes explicativas */}
          <div className="imagenes-tutorial">

            {/* Imagen de una máquina de escribir */}
            {((pasoActual === "presentacionMaquinaEscribir" && 
              tiempoAudio >= 0.5) ||
              pasoActual === "presentacionTeclado") && (
              <img
                className="imagen-maquina-escribir"
                src={imagenMaquinaEscribir}
                alt="Imagen simplificada de una máquina de escribir."
              />
            )}

            {/* Imagen de un teclado de ordenador simplificado */}
            {pasoActual === "presentacionTeclado" && (
              <img
                className="imagen-teclado-simple"
                src={imagenTecladoSimple}
                alt="Imagen simplificada del teclado de un ordenador."
              />
            )}

          </div>

          {/* Ejercicio interactivo de escritura */}
          {mostrarCuadroTexto && (
            <div className="terminal-contenido terminal-ejercicio">

              <CuadroTexto
                texto={textoEscrito}
                onCambiarTexto={gestionarCambioTexto}
                etiqueta="Escribe aquí el nombre: rocio"
                enfocarAutomaticamente={true}
                deshabilitado={
                  pasoActual !== 'pruebaEscritura' ||
                  !esperandoInteraccion
                }
              />

            </div>
          )}
        </div>
      </section>
    </main>
  )
}
export default Teclado21