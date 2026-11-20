import { useState, useEffect } from 'react'

import { subtitulosPorAudio } from './subtitulos2-2'
import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'

import CuadroTexto from '@/componentes_reutilizables/Elementos_interactivos/CuadroTexto/CuadroTexto'

import logoTerminal from '@/assets/teclado/logo_terminal.png'
import imagenTeclaRetroceso from '@/assets/teclado/tecla_retroceso.png'
import imagenTecladoRetroceso from '@/assets/teclado/teclado_tecla_retroceso.png'
import imagenBarraEspaciadora from '@/assets/teclado/barra_espaciadora.png'
import imagenTecladoBarraEspaciadora from '@/assets/teclado/teclado_barra_espaciadora.png'
import imagenTeclaEnter from '@/assets/teclado/tecla_enter.png'
import imagenTecladoEnter from '@/assets/teclado/teclado_tecla_enter.png'

import '../../Teclado.css'

// Secuencia de audios de la sección 2-2: teclas especiales.
const secuenciaTeclado22 = [
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-1.wav',
    subtitulos: 'presentacionTeclasEspeciales',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-2.wav',
    subtitulos: 'introduccionBarraRetroceso',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-3.wav',
    subtitulos: 'interaccionBarraRetroceso',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-4.wav',
    subtitulos: 'felicitacionBarraRetroceso',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-5.wav',
    subtitulos: 'introduccionBarraEspaciadora',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-6.wav',
    subtitulos: 'clicIzquierdoBarraEspaciadora',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-7.wav',
    subtitulos: 'interaccionBarraEspaciadora',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-8.wav',
    subtitulos: 'introduccionSaltoDeLinea',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-9.wav',
    subtitulos: 'interaccionSaltoDeLinea',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-10.wav',
    subtitulos: 'aclaracionSaltoDeLinea',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-11.wav',
    subtitulos: 'felicitacionFinDeNivel',
  }
] as const

// Textos utilizados durante las actividades.
const TEXTO_ERRONEO = 'MwenaP0l3d'
const TEXTO_SIN_ESPACIO = 'MentaPoleo'
const TEXTO_CON_ESPACIO = 'Menta Poleo'
const TEXTO_CON_SALTO = 'Menta Poleo\n'
const TEXTO_FINAL = 'Menta Poleo\nEs mi infusión favorita.'

// Momento en el que la narradora comienza a escribir el ejemplo.
const SEGUNDO_APARICION_TEXTO = 3.4

// Momento en el que aparece el texto del segundo ejercicio.
const SEGUNDO_APARICION_SEGUNDO_TEXTO = 2

// Simula la escritura progresiva de un texto.
function escribirProgresivamente(
  textoCompleto: string,
  actualizarTexto: (texto: string) => void,
  posicionInicial = 0,
  velocidad = 100
) {
  let caracteresEscritos = posicionInicial

  // Si el texto ya está completo, no iniciamos la animación.
  if (caracteresEscritos >= textoCompleto.length) {
    actualizarTexto(textoCompleto)
    return () => {}
  }

  // Añadimos un carácter en cada intervalo.
  const temporizador = setInterval(() => {
    caracteresEscritos++

    actualizarTexto(
      textoCompleto.slice(0, caracteresEscritos)
    )

    // Detenemos la animación al completar el texto.
    if (caracteresEscritos >= textoCompleto.length) {
      clearInterval(temporizador)
    }
  }, velocidad)

  // Permite cancelar la animación si cambia la narración.
  return () => clearInterval(temporizador)
}

type Teclado22Props = { onTerminar: () => void }

function Teclado22({ onTerminar }: Teclado22Props) {

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
    secuenciaTeclado22,
    onTerminar
  )

  // Obtiene los subtítulos de la narración actual.
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Estado del ejercicio de Retroceso.
  const [textoRetroceso, setTextoRetroceso] = useState('')

  // Detecta cuándo debe comenzar a escribirse el texto erróneo.
  const iniciarEscrituraRetroceso =
    pasoActual === 'introduccionBarraRetroceso' &&
    tiempoAudio >= SEGUNDO_APARICION_TEXTO

  // Escribe progresivamente el texto del ejercicio de Retroceso.
  useEffect(() => {
    if (!iniciarEscrituraRetroceso) return

    return escribirProgresivamente(
      TEXTO_ERRONEO,
      setTextoRetroceso
    )
  }, [iniciarEscrituraRetroceso])

  // Cuadro de texto del ejercicio de Retroceso.
  // Aparece cuando la narradora comienza a escribir el ejemplo.
  const mostrarCuadroRetroceso =
    (pasoActual === 'introduccionBarraRetroceso' &&
     tiempoAudio >= SEGUNDO_APARICION_TEXTO) ||
    pasoActual === 'interaccionBarraRetroceso'

  // Determina cuándo el usuario puede modificar cada texto.
  const permitirRetroceso =
    pasoActual === 'interaccionBarraRetroceso' && esperandoInteraccion


  // Estado del ejercicio de Enter.
  const [textoEnter, setTextoEnter] = useState(TEXTO_CON_ESPACIO)

  // Completa progresivamente la frase tras el salto de línea.
  useEffect(() => {
    if (pasoActual !== 'aclaracionSaltoDeLinea') return

    return escribirProgresivamente(
      TEXTO_FINAL,
      setTextoEnter,
      TEXTO_CON_SALTO.length
    )
  }, [pasoActual])

  // Cuadro de texto del ejercicio de Enter.
  // Aparece cuando comienza la explicación del salto de línea.
  const mostrarCuadroEnter =
    pasoActual === 'introduccionSaltoDeLinea' ||
    pasoActual === 'interaccionSaltoDeLinea' ||
    pasoActual === 'aclaracionSaltoDeLinea' ||
    pasoActual === 'felicitacionFinDeNivel'

  // Determina cuándo el usuario puede modificar cada texto.
  const permitirEnter =
    pasoActual === 'interaccionSaltoDeLinea' && esperandoInteraccion

  
  // Estado del ejercicio de la barra espaciadora.
  const [textoEspacio, setTextoEspacio] = useState('')

  // Detecta cuándo debe comenzar a escribirse el segundo texto.
  const iniciarEscrituraEspacio =
    pasoActual === 'felicitacionBarraRetroceso' &&
    tiempoAudio >= SEGUNDO_APARICION_SEGUNDO_TEXTO

  // Escribe progresivamente las palabras sin espacio.
  useEffect(() => {
    if (!iniciarEscrituraEspacio) return

    return escribirProgresivamente(
      TEXTO_SIN_ESPACIO,
      setTextoEspacio
    )
  }, [iniciarEscrituraEspacio])

  // Cuadro de texto del ejercicio de la barra espaciadora.
  // Aparece tras completar el ejercicio de Retroceso.
  const mostrarCuadroEspacio =
    (pasoActual === 'felicitacionBarraRetroceso' &&
     tiempoAudio >= SEGUNDO_APARICION_SEGUNDO_TEXTO) ||
    pasoActual === 'introduccionBarraEspaciadora' ||
    pasoActual === 'clicIzquierdoBarraEspaciadora' ||
    pasoActual === 'interaccionBarraEspaciadora'

  // Determina cuándo el usuario puede modificar cada texto.
  const permitirEspacio =
    pasoActual === 'interaccionBarraEspaciadora' && esperandoInteraccion

  // Gestiona las modificaciones realizadas por el usuario.

  // Ejercicio de Retroceso: eliminar todo el contenido.
  function gestionarRetroceso(nuevoTexto: string) {

    // Impedimos modificaciones fuera del ejercicio.
    if (!permitirRetroceso) return

    // Actualizamos el contenido del cuadro.
    setTextoRetroceso(nuevoTexto)

    // Avanzamos cuando el usuario elimina todo el texto.
    if (nuevoTexto === '') { 
      continuarTrasInteraccion()
    }
  }

  // Ejercicio de Espacio: separar las dos palabras.
  function gestionarEspacio(nuevoTexto: string) {

    // Impedimos modificaciones fuera del ejercicio.
    if (!permitirEspacio) return

    // Actualizamos el contenido del cuadro.
    setTextoEspacio(nuevoTexto)

    // Avanzamos cuando las palabras están correctamente separadas.
    if (nuevoTexto === TEXTO_CON_ESPACIO) {
      continuarTrasInteraccion()
    }
  }

  // Ejercicio de Enter: introducir un salto de línea.
  function gestionarEnter(nuevoTexto: string) {

    // Impedimos modificaciones fuera del ejercicio.
    if (!permitirEnter) return

    // Actualizamos el contenido del cuadro.
    setTextoEnter(nuevoTexto)

    // Avanzamos cuando el usuario introduce el salto de línea.
    if (nuevoTexto === TEXTO_CON_SALTO) {
      continuarTrasInteraccion()
    }
  }

  // Gestiona la posición del cursor dentro de los cuadros de texto.

  // Ejercicio: colocar el cursor entre Menta y Poleo.
  function gestionarCursorEspacio(inicio: number, fin: number) {

    // Solo validamos cuando la narradora espera una interacción.
    if (pasoActual !== 'clicIzquierdoBarraEspaciadora' ||
       !esperandoInteraccion) {
      return
    }

    // Evitamos considerar una selección de varios caracteres
    // como una colocación válida del cursor.
    if (inicio !== fin) return

    // Comprobamos que el cursor esté después de Menta.
    if (inicio === 5 && textoEspacio === TEXTO_SIN_ESPACIO) {
      continuarTrasInteraccion()
    }
  }

  // Ejercicio: colocar el cursor después de Poleo.
  function gestionarCursorEnter(inicio: number, fin: number) {

    // Solo validamos cuando la narradora espera una interacción.
    if (pasoActual !== 'introduccionSaltoDeLinea' ||
       !esperandoInteraccion) {
      return
    }

    // Evitamos considerar una selección de varios caracteres
    // como una colocación válida del cursor.
    if (inicio !== fin) return

    // Comprobamos que el cursor esté al final del texto.
    if (inicio === TEXTO_CON_ESPACIO.length &&
        textoEnter === TEXTO_CON_ESPACIO) {
      continuarTrasInteraccion()
    }
  }

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
          ROCIO — NIVEL 02: TECLADO. TECLAS ESPECIALES
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

            {/* Imagen de la tecla de retroceso */}
            {(pasoActual === 'introduccionBarraRetroceso' ||
              pasoActual === 'interaccionBarraRetroceso') && (
              <img
                className="imagen-tecla-retroceso"
                src={imagenTeclaRetroceso}
                alt="Imagen ilustrativa de la tecla de retroceso."
              />
            )}

            {/* Imagen de la tecla de retroceso en un teclado */}
            {(pasoActual === 'introduccionBarraRetroceso' ||
              pasoActual === 'interaccionBarraRetroceso') && (
              <img
                className="imagen-teclado-retroceso"
                src={imagenTecladoRetroceso}
                alt="Imagen representativa de la tecla de retroceso en un teclado."
              />
            )}

            {/* Imagen de la barra espaciadora */}
            {(pasoActual === 'introduccionBarraEspaciadora' ||
              pasoActual === 'interaccionBarraEspaciadora') && (
              <img
                className="imagen-barra-espaciadora"
                src={imagenBarraEspaciadora}
                alt="Imagen ilustrativa de la tecla de barra espaciadora."
              />
            )}

            {/* Imagen de la barra espaciadora en un teclado */}
            {(pasoActual === 'introduccionBarraEspaciadora' ||
              pasoActual === 'interaccionBarraEspaciadora') && (
              <img
                className="imagen-teclado-espacio"
                src={imagenTecladoBarraEspaciadora}
                alt="Imagen representativa de la barra espaciadora en un teclado."
              />
            )}

            {/* Imagen de la tecla Enter */}
            {(pasoActual === 'interaccionSaltoDeLinea' ||
              pasoActual === 'aclaracionSaltoDeLinea') && (
              <img
                className="imagen-tecla-enter"
                src={imagenTeclaEnter}
                alt="Imagen ilustrativa de la tecla Enter."
              />
            )}

            {/* Imagen de la tecla Enter en un teclado */}
            {(pasoActual === 'interaccionSaltoDeLinea' ||
              pasoActual === 'aclaracionSaltoDeLinea') && (
              <img
                className="imagen-teclado-enter"
                src={imagenTecladoEnter}
                alt="Imagen representativa de la tecla Enter en un teclado."
              />
            )}

          </div>

          {/* Ejercicio interactivo de escritura. Barra de retroceso. */}
          {mostrarCuadroRetroceso && (
            <div className="terminal-ejercicio ejercicio-retroceso">

              <CuadroTexto
                texto={textoRetroceso}
                onCambiarTexto={gestionarRetroceso}
                etiqueta="Borra todo el contenido del cuadro."
                multilinea={false}
                enfocarAutomaticamente={permitirRetroceso}
                soloLectura={!permitirRetroceso}
              />

            </div>
          )}

          {/* Ejercicio interactivo de escritura. Barra espaciadora. */}
          {mostrarCuadroEspacio && (
            <div className="terminal-ejercicio ejercicio-espacio">

              <CuadroTexto
                texto={textoEspacio}
                onCambiarTexto={gestionarEspacio}
                onColocarCursor={gestionarCursorEspacio}
                etiqueta="Coloca un espacio entre las dos palabras."
                multilinea={false}
                soloLectura={!permitirEspacio}
              />

            </div>
          )}

          {/* Ejercicio interactivo de escritura. 'Enter' */}
          {mostrarCuadroEnter && (
            <div className="terminal-ejercicio ejercicio-enter">

              <CuadroTexto
                texto={textoEnter}
                onCambiarTexto={gestionarEnter}
                onColocarCursor={gestionarCursorEnter}
                etiqueta="Introduce un salto de línea al final del texto."
                multilinea={true}
                soloLectura={!permitirEnter}
              />

            </div>
          )}

        </div>

      </section>
    </main>
  )
}

export default Teclado22