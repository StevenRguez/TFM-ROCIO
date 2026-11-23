import { useState, useEffect, useRef } from 'react'

import { subtitulosPorAudio } from './subtitulos2-3'
import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import CuadroTexto from '@/componentes_reutilizables/Elementos_interactivos/CuadroTexto/CuadroTexto'

import logoTerminal from '@/assets/teclado/logo_terminal.png'
import imagenTeclaRetroceso from '@/assets/teclado/tecla_retroceso.png'
import imagenTecladoRetroceso from '@/assets/teclado/teclado_tecla_retroceso.png'
// import imagenBarraEspaciadora from '@/assets/teclado/barra_espaciadora.png'
// import imagenTecladoBarraEspaciadora from '@/assets/teclado/teclado_barra_espaciadora.png'
import imagenTeclaEnter from '@/assets/teclado/tecla_enter.png'
import imagenTecladoEnter from '@/assets/teclado/teclado_tecla_enter.png'
import imagenTeclaBloqMayus from '@/assets/teclado/tecla_bloqueo_mayusculas.png'
import imagenTecladoBloqMayus from '@/assets/teclado/teclado_bloqueo_mayusculas.png'
import imagenTecladoNumerico from '@/assets/teclado/teclado_numerico.png'
import imagenTeclasNumeros from '@/assets/teclado/teclas_numeros.png'

import '../../Teclado.css'
import './Teclado2-3.css'

// Secuencia de audios de la sección 2-2: teclas especiales.
const secuenciaTeclado23 = [
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-1.wav',
    subtitulos: 'presentacionNivelFinal',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-2.wav',
    subtitulos: 'introduccionNumeros',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-3.wav',
    subtitulos: 'ejercicioNumeros',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-4.wav',
    subtitulos: 'introduccionNivelFinal',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-5.wav',
    subtitulos: 'aparicionListaCompra',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-6.wav',
    subtitulos: 'ejercicioBotellasAgua',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-7.wav',
    subtitulos: 'ejercicioPan',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-8.wav',
    subtitulos: 'ejercicioHuevos',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-9.wav',
    subtitulos: 'ejercicioCebollas',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-10.wav',
    subtitulos: 'introduccionEjercicioCorreccionPan',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-11.wav',
    subtitulos: 'especificacionEjercicioCorreccionPan',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-12.wav',
    subtitulos: 'ejercicioYogures',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-13.wav',
    subtitulos: 'felicitacionNivelFinal',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-3_Nivel_final/Teclado2-3-14.wav',
    subtitulos: 'avanceSiguienteNivel',
  }
] as const

// Textos utilizados durante las actividades.
const NUMERO_ESPERADO = '934'

const LINEA_AGUA = '2 botellas de agua'
const LINEA_PAN = '1 barra de pan'
const LINEA_HUEVOS = '12 huevos'
const LINEA_CEBOLLAS = 'CEBOLLAS'
const LINEA_YOGURES = '6 yogures'

// Contenido esperado de la lista después de cada ejercicio.
const LISTA_AGUA = LINEA_AGUA

const LISTA_PAN = [LINEA_AGUA, LINEA_PAN].join('\n')

const LISTA_HUEVOS = [LINEA_AGUA, LINEA_PAN, LINEA_HUEVOS].join('\n')

const LISTA_CEBOLLAS = [LINEA_AGUA, LINEA_PAN, LINEA_HUEVOS,LINEA_CEBOLLAS
].join('\n')

const LISTA_SIN_PAN = [LINEA_AGUA, LINEA_HUEVOS, LINEA_CEBOLLAS].join('\n')

const LISTA_FINAL = [LINEA_AGUA, LINEA_HUEVOS, LINEA_CEBOLLAS, LINEA_YOGURES
].join('\n')

// Posición del cursor justo después de la palabra "pan".
const POSICION_DESPUES_PAN =
  LINEA_AGUA.length + 1 + LINEA_PAN.length

// Objetivos de escritura correspondientes a cada narración.
const OBJETIVOS_LISTA: Record<string, string> = {
  ejercicioBotellasAgua: LISTA_AGUA,
  ejercicioPan: LISTA_PAN,
  ejercicioHuevos: LISTA_HUEVOS,
  ejercicioCebollas: LISTA_CEBOLLAS,
  especificacionEjercicioCorreccionPan: LISTA_SIN_PAN,
  ejercicioYogures: LISTA_FINAL
}

// Etiquetas descriptivas de cada ejercicio.
const ETIQUETAS_LISTA: Record<string, string> = {
  ejercicioBotellasAgua: "Escribe: '2 botellas de agua'.",
  ejercicioPan: "Añade otra línea: '1 barra de pan'.",
  ejercicioHuevos: "Añade otra línea: '12 huevos'.",
  ejercicioCebollas: "Añade otra línea: 'CEBOLLAS'.",
  introduccionEjercicioCorreccionPan: 'Lista de la compra.',
  especificacionEjercicioCorreccionPan:
    "Haz clic después de 'pan', y borra toda esa línea con Retroceso.",
  ejercicioYogures: "Desactiva Bloq Mayús y añade otra línea: '6 yogures'."
}

type Teclado23Props = { onTerminar: () => void }

function Teclado23({ onTerminar }: Teclado23Props) {

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
    secuenciaTeclado23,
    onTerminar
  )

  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // =========================================
  // EJERCICIO DE NÚMEROS
  // =========================================

  // Estado del ejercicio de escritura de números.
  const [textoNumeros, setTextoNumeros] = useState('')

  // Determina cuándo debemos mostrar el cuadro de números.
  const mostrarCuadroNumeros = pasoActual === 'ejercicioNumeros'

  // Determina cuándo el usuario puede escribir números.
  const permitirNumeros = mostrarCuadroNumeros &&
    textoNumeros !== NUMERO_ESPERADO

  // Gestiona la escritura del número solicitado.
  function gestionarNumeros(nuevoTexto: string) {
    // Impedimos modificaciones fuera del ejercicio.
    if (!permitirNumeros) return

    // Actualizamos el contenido del cuadro.
    setTextoNumeros(nuevoTexto)
  }

  // =========================================
  // EJERCICIO DE LA LISTA DE LA COMPRA
  // =========================================

  // Estado del ejercicio de la lista de la compra.
  const [textoLista, setTextoLista] = useState('')

  // Registra si el usuario ha colocado correctamente
  // el cursor después de la palabra "pan".
  const [cursorPanColocado, setCursorPanColocado] = useState(false)

  // Registra la pulsación de Enter para avanzar de nivel.
  const [enterFinalPulsado, setEnterFinalPulsado] = useState(false)

  // Evita continuar dos veces una misma interacción.
  const ultimoPasoCompletado = useRef<string | null>(null)

  // Determina cuándo debemos mostrar la lista de la compra.
  const mostrarCuadroLista = [
    'aparicionListaCompra',
    'ejercicioBotellasAgua',
    'ejercicioPan',
    'ejercicioHuevos',
    'ejercicioCebollas',
    'introduccionEjercicioCorreccionPan',
    'especificacionEjercicioCorreccionPan',
    'ejercicioYogures'
  ].includes(pasoActual)

  // Obtiene el texto esperado para el ejercicio actual.
  const objetivoLista = OBJETIVOS_LISTA[pasoActual] ?? null

  // Determina cuándo el usuario puede modificar la lista.
  const permitirEscrituraLista =
    objetivoLista !== null && textoLista !== objetivoLista &&
    (pasoActual !== 'especificacionEjercicioCorreccionPan' || 
     cursorPanColocado)

  // Determina cuándo se debe enfocar el cuadro de texto.
  const enfocarLista =
    permitirEscrituraLista && (
      pasoActual === 'ejercicioBotellasAgua' ||
      pasoActual === 'ejercicioPan' ||
      pasoActual === 'ejercicioHuevos' ||
      pasoActual === 'ejercicioCebollas' ||
      pasoActual === 'ejercicioYogures'
    )

  // Gestiona las modificaciones realizadas por el usuario.
  function gestionarLista(nuevoTexto: string) {
    // Impedimos modificaciones fuera de los ejercicios.
    if (!permitirEscrituraLista) return

    // Actualizamos el contenido del cuadro.
    setTextoLista(nuevoTexto)
  }

  // Gestiona la posición del cursor dentro de la lista.
  function gestionarPosicionCursor(inicio: number, fin: number) {

    // Solo comprobamos el cursor durante la corrección del pan.
    if (pasoActual !== 'especificacionEjercicioCorreccionPan') {
      return
    }

    // Evitamos considerar una selección de varios caracteres
    // como una colocación válida del cursor.
    if (inicio !== fin) return

    // Comprobamos que el cursor esté después de "pan".
    if (inicio === POSICION_DESPUES_PAN && textoLista === LISTA_CEBOLLAS) {
      setCursorPanColocado(true)
    }
  }

  // =========================================
  // DETECCIÓN DE TECLAS ESPECIALES
  // =========================================

  // Registra las teclas especiales utilizadas durante cada ejercicio.
  const [teclasPulsadas, setTeclasPulsadas] = useState<Record<string, boolean>>({})

  // Detecta las pulsaciones físicas de las teclas especiales.
  useEffect(() => {

    // Identifica la tecla correspondiente al ejercicio actual.
    let teclaEsperada: string | null = null

    switch (pasoActual) {

      case 'ejercicioPan':
      case 'ejercicioHuevos':
      case 'felicitacionNivelFinal':
        teclaEsperada = 'Enter'
        break

      case 'especificacionEjercicioCorreccionPan':
        teclaEsperada = 'Backspace'
        break

      case 'ejercicioCebollas':
      case 'ejercicioYogures':
        teclaEsperada = 'CapsLock'
        break
    }

    // No escuchamos el teclado si no estamos en un ejercicio.
    if (!teclaEsperada) return

    function gestionarTecla(evento: KeyboardEvent) {

      // Solo nos interesa la tecla correspondiente al ejercicio.
      if (
        evento.key !== teclaEsperada &&
        evento.code !== teclaEsperada
      ) {
        return
      }

      // Evitamos registrar pulsaciones repetidas.
      if (evento.repeat) return

      // Enter y Retroceso se validan al presionar la tecla.
      // Bloq Mayús puede detectarse también al soltarla.
      if (
        teclaEsperada !== 'CapsLock' &&
        evento.type !== 'keydown'
      ) {
        return
      }

      // Ejercicio final: pulsar Enter para avanzar de nivel.
      if (pasoActual === 'felicitacionNivelFinal') {

        // Evitamos que Enter provoque otras acciones.
        evento.preventDefault()

        // Registramos la pulsación para modificar el botón.
        setEnterFinalPulsado(true)
        return
      }

      // En los ejercicios de Enter y Retroceso,
      // comprobamos que el usuario esté escribiendo en la lista.
      if (
        teclaEsperada === 'Enter' ||
        teclaEsperada === 'Backspace'
      ) {
        if (
          !(evento.target instanceof HTMLTextAreaElement) ||
          !evento.target.closest('.ejercicio-lista-compra')
        ) {
          return
        }
      }

      // Para borrar el pan, primero debe colocarse correctamente
      // el cursor al final de la línea correspondiente.
      if (
        pasoActual === 'especificacionEjercicioCorreccionPan' &&
        !cursorPanColocado
      ) {
        return
      }

      // Registramos la tecla utilizada en el ejercicio actual.
      setTeclasPulsadas((anteriores) => ({
        ...anteriores,
        [pasoActual]: true
      }))
    }

    // Escuchamos las pulsaciones del teclado.
    window.addEventListener('keydown', gestionarTecla)
    window.addEventListener('keyup', gestionarTecla)

    // Dejamos de escuchar cuando cambia la fase.
    return () => {
      window.removeEventListener('keydown', gestionarTecla)
      window.removeEventListener('keyup', gestionarTecla)
    }

  }, [
    pasoActual,
    cursorPanColocado
  ])

  // =========================================
  // VALIDACIÓN DE LAS INTERACCIONES
  // =========================================

  // Comprueba si el usuario ha completado cada ejercicio.
  // La narración continúa cuando también ha terminado el audio.
  useEffect(() => {

    // Solo avanzamos cuando la narradora espera una interacción.
    if (!esperandoInteraccion) return

    // Evitamos continuar dos veces una misma narración.
    if (ultimoPasoCompletado.current === pasoActual) return

    let ejercicioCompletado = false

    switch (pasoActual) {

      // Ejercicio de números.
      case 'ejercicioNumeros':
        ejercicioCompletado = textoNumeros === NUMERO_ESPERADO
        break

      // Ejercicio de botellas de agua.
      case 'ejercicioBotellasAgua':
        ejercicioCompletado = textoLista === LISTA_AGUA
        break

      // Ejercicio de pan.
      case 'ejercicioPan':
        ejercicioCompletado = textoLista === LISTA_PAN
        break

      // Ejercicio de huevos.
      case 'ejercicioHuevos':
        ejercicioCompletado = textoLista === LISTA_HUEVOS
        break

      // Ejercicio de cebollas.
      case 'ejercicioCebollas':
        ejercicioCompletado = textoLista === LISTA_CEBOLLAS
        break

      // Ejercicio de corrección del pan.
      case 'especificacionEjercicioCorreccionPan':
        ejercicioCompletado = cursorPanColocado && textoLista === LISTA_SIN_PAN
        break

      // Ejercicio de yogures.
      case 'ejercicioYogures':
        ejercicioCompletado = textoLista === LISTA_FINAL
        break

      // Avance al siguiente nivel mediante Enter.
      case 'felicitacionNivelFinal':
        ejercicioCompletado = enterFinalPulsado
        break
    }

    // Continuamos cuando el usuario completa la actividad.
    if (ejercicioCompletado) {
      ultimoPasoCompletado.current = pasoActual
      continuarTrasInteraccion()
    }

  }, [
    pasoActual,
    esperandoInteraccion,
    textoNumeros,
    textoLista,
    cursorPanColocado,
    enterFinalPulsado,
    continuarTrasInteraccion
  ])

  // =========================================
  // ELEMENTOS VISUALES
  // =========================================

  // Determina cuándo mostrar el indicador de avance final.
  // Permanece visible durante la felicitación y la narración de cierre.
  const mostrarAvanceFinal =
    pasoActual === 'felicitacionNivelFinal' || pasoActual === 'avanceSiguienteNivel'

  // Determina cuándo mostrar las imágenes de los números.
  const mostrarImagenNumeros =
    pasoActual === 'introduccionNumeros' || pasoActual === 'ejercicioNumeros'

  // Determina cuándo mostrar las imágenes de la barra espaciadora.
  /*const mostrarImagenEspacio =
    pasoActual === 'ejercicioBotellasAgua'*/

  // Determina cuándo mostrar las imágenes de Enter.
  const mostrarImagenEnter =
    (pasoActual === 'ejercicioPan' &&
     !teclasPulsadas.ejercicioPan) || 
    (pasoActual === 'ejercicioHuevos' && tiempoAudio >= 2.9 && 
     !teclasPulsadas.ejercicioHuevos) || 
    (pasoActual === 'felicitacionNivelFinal' && (
     tiempoAudio >= 9 || esperandoInteraccion || enterFinalPulsado))

  // Determina cuándo mostrar las imágenes de Retroceso.
  const mostrarImagenRetroceso =
    pasoActual === 'introduccionEjercicioCorreccionPan' ||
    (pasoActual === 'especificacionEjercicioCorreccionPan' &&
     !teclasPulsadas.especificacionEjercicioCorreccionPan)

  // Determina cuándo mostrar las imágenes de Bloq Mayús.
  const mostrarImagenBloqMayus =
    (pasoActual === 'ejercicioCebollas' &&
     !teclasPulsadas.ejercicioCebollas) || 
    (pasoActual === 'ejercicioYogures' &&
     !teclasPulsadas.ejercicioYogures)

  // Obtiene la etiqueta correspondiente a la actividad.
  const etiquetaLista =
    ETIQUETAS_LISTA[pasoActual] ?? 'Lista de la compra'

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
          ROCIO — NIVEL 02: TECLADO. NIVEL FINAL
        </header>

        {/* Área principal de la terminal */}
        <div className="terminal-contenido terminal-contenido-ejercicios">

          {/* Logotipo del sistema */}
          <img
            className="logo-terminal"
            src={logoTerminal}
            alt="Logotipo de ROCIO"
          />
        
          {/* Imágenes explicativas */}
          <div className="imagenes-tutorial">

            {/* Imagen de las teclas de números */}
            {mostrarImagenNumeros && (
              <img
                className="imagen-teclas-numeros"
                src={imagenTeclasNumeros}
                alt="Imagen ilustrativa de las teclas de números."
              />
            )}

            {/* Imagen del teclado numérico */}
            {mostrarImagenNumeros && (
              <img
                className="imagen-teclado-numerico"
                src={imagenTecladoNumerico}
                alt="Imagen representativa de las teclas numéricas en un teclado."
              />
            )}

            {/* Imagen de la barra espaciadora 
            {mostrarImagenEspacio && (
              <img
                className="imagen-barra-espaciadora"
                src={imagenBarraEspaciadora}
                alt="Imagen ilustrativa de la barra espaciadora."
              />
            )}

            { Imagen de la barra espaciadora en un teclado }
            {mostrarImagenEspacio && (
              <img
                className="imagen-teclado-espacio"
                src={imagenTecladoBarraEspaciadora}
                alt="Imagen representativa de la barra espaciadora en un teclado."
              />
            )} */}

            {/* Imagen de la tecla Enter */}
            {mostrarImagenEnter && (
              <img
                className="imagen-tecla-enter"
                src={imagenTeclaEnter}
                alt="Imagen ilustrativa de la tecla Enter."
              />
            )}

            {/* Imagen de la tecla Enter en un teclado */}
            {mostrarImagenEnter && (
              <img
                className="imagen-teclado-enter"
                src={imagenTecladoEnter}
                alt="Imagen representativa de la tecla Enter en un teclado."
              />
            )}

            {/* Imagen de la tecla de retroceso */}
            {mostrarImagenRetroceso && (
              <img
                className="imagen-tecla-retroceso"
                src={imagenTeclaRetroceso}
                alt="Imagen ilustrativa de la tecla de retroceso."
              />
            )}

            {/* Imagen de la tecla de retroceso en un teclado */}
            {mostrarImagenRetroceso && (
              <img
                className="imagen-teclado-retroceso"
                src={imagenTecladoRetroceso}
                alt="Imagen representativa de la tecla de retroceso en un teclado."
              />
            )}

            {/* Imagen de la tecla Bloq. Mayús. */}
            {mostrarImagenBloqMayus && (
              <img
                className="imagen-tecla-bloq-mayus"
                src={imagenTeclaBloqMayus}
                alt="Imagen ilustrativa de la tecla de bloqueo de mayúsculas."
              />
            )}

            {/* Imagen de la tecla Bloq. Mayús. en un teclado */}
            {mostrarImagenBloqMayus && (
              <img
                className="imagen-teclado-bloq-mayus"
                src={imagenTecladoBloqMayus}
                alt="Imagen representativa de la tecla de bloqueo de mayúsculas en un teclado."
              />
            )}

          </div>

          {/* Ejercicio interactivo de escritura. Números. */}
          {mostrarCuadroNumeros && (
            <div className="terminal-ejercicio ejercicio-numeros">

              <CuadroTexto
                texto={textoNumeros}
                onCambiarTexto={gestionarNumeros}
                etiqueta="Escribe el número '934'."
                multilinea={false}
                enfocarAutomaticamente={permitirNumeros}
                soloLectura={!permitirNumeros}
              />

            </div>
          )}

          {/* Ejercicio interactivo de escritura. Lista de la compra. */}
          {mostrarCuadroLista && (
            <div className="terminal-ejercicio ejercicio-lista-compra">

              <CuadroTexto
                texto={textoLista}
                onCambiarTexto={gestionarLista}
                onColocarCursor={gestionarPosicionCursor}
                etiqueta={etiquetaLista}
                multilinea={true}
                enfocarAutomaticamente={enfocarLista}
                soloLectura={!permitirEscrituraLista}
              />

            </div>
          )}

          {/* Botón visual para avanzar al siguiente nivel mediante Enter */}
          {mostrarAvanceFinal && (
            <div
              className={`boton-avanzar-terminal ${
                enterFinalPulsado ? 'boton-avanzar-terminal--pulsado' : ''
              }`}
              aria-hidden="true"
            >
              Avanzar al siguiente nivel
            </div>
          )}

        </div>
      </section>
    </main>

  )
}

export default Teclado23