import { useState, useEffect, useRef } from 'react'

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
import imagenTeclaBloqMayus from '@/assets/teclado/tecla_bloqueo_mayusculas.png'
import imagenTecladoBloqMayus from '@/assets/teclado/teclado_bloqueo_mayusculas.png'

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
    subtitulos: 'introduccionBloqueoMayusculas',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-12.wav',
    subtitulos: 'explicacionBloqueoMayusculas',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-13.wav',
    subtitulos: 'introduccionEjercicioBloqueoMayusculas',
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-14.wav',
    subtitulos: 'ejercicioBloqueoMayusculas',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/teclado-nivel_2/2-2_Teclas_especiales/Teclado2-2-15.wav',
    subtitulos: 'felicitacionFinDeNivel',
  }
] as const

// Textos utilizados durante las actividades.
const TEXTO_ERRONEO = 'MwenaP0l3d'
const TEXTO_SIN_ESPACIO = 'MentaPoleo'
const TEXTO_CON_ESPACIO = 'Menta Poleo'
const TEXTO_CON_SALTO = 'Menta Poleo\n'
const TEXTO_FINAL = 'Menta Poleo\nEs mi infusión favorita.'
const TEXTO_ESPERADO_MAYUSCULAS = 'ROCIO rocio'

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

  // EJERCICIO DE RETROCESO

  // Estado del ejercicio de Retroceso.
  const [textoRetroceso, setTextoRetroceso] = useState('')

  // Detecta cuándo debe comenzar a escribirse el texto erróneo.
  const iniciarEscrituraRetroceso =
    pasoActual === 'introduccionBarraRetroceso' &&
    tiempoAudio >= SEGUNDO_APARICION_TEXTO

  // Garantiza que el texto esté completo antes de comenzar el ejercicio.
  useEffect(() => {
    if (!iniciarEscrituraRetroceso) return

    return escribirProgresivamente(TEXTO_ERRONEO, setTextoRetroceso)
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

  // EJERCICIO DE BARRA ESPACIADORA

  // Estado del ejercicio de la barra espaciadora.
  const [textoEspacio, setTextoEspacio] = useState('')

  // Detecta cuándo debe comenzar a escribirse el segundo texto.
  const iniciarEscrituraEspacio =
    pasoActual === 'felicitacionBarraRetroceso' &&
    tiempoAudio >= SEGUNDO_APARICION_SEGUNDO_TEXTO

  // Escribe progresivamente las palabras sin espacio.
  useEffect(() => {
    if (!iniciarEscrituraEspacio) return

    return escribirProgresivamente(TEXTO_SIN_ESPACIO, setTextoEspacio)
  }, [iniciarEscrituraEspacio])

  // Garantiza que las palabras estén completas antes del ejercicio.
  useEffect(() => {
    if (pasoActual === 'introduccionBarraEspaciadora') {
      setTextoEspacio(TEXTO_SIN_ESPACIO)
    }
  }, [pasoActual])

  // Determina cuándo debe aparecer el cuadro de Enter
  // durante la introducción del salto de línea.
  const mostrarEnterDuranteIntroduccion =
    pasoActual === 'introduccionSaltoDeLinea' &&
    (tiempoAudio >= 2.5 || esperandoInteraccion)

  // Cuadro de texto del ejercicio de la barra espaciadora.
  // Aparece tras completar el ejercicio de Retroceso.
  const mostrarCuadroEspacio =
    (pasoActual === 'felicitacionBarraRetroceso' &&
     tiempoAudio >= SEGUNDO_APARICION_SEGUNDO_TEXTO) ||
     pasoActual === 'introduccionBarraEspaciadora' ||
     pasoActual === 'clicIzquierdoBarraEspaciadora' ||
     pasoActual === 'interaccionBarraEspaciadora' ||
    (pasoActual === 'introduccionSaltoDeLinea' &&
    !mostrarEnterDuranteIntroduccion)

  // Determina cuándo el usuario puede modificar cada texto.
  const permitirEspacio =
    pasoActual === 'interaccionBarraEspaciadora' && esperandoInteraccion
  
  // EJERCICIO DE SALTO DE LINEA

  // Estado del ejercicio de Enter.
  const [textoEnter, setTextoEnter] = useState(TEXTO_CON_ESPACIO)

  // Completa progresivamente la frase tras el salto de línea.
  useEffect(() => {
    if (pasoActual !== 'aclaracionSaltoDeLinea') return

    return escribirProgresivamente(TEXTO_FINAL, setTextoEnter,
      TEXTO_CON_SALTO.length)
  }, [pasoActual])

  // Cuadro de texto del ejercicio de Enter.
  // Aparece cuando comienza la explicación del salto de línea.
  const mostrarCuadroEnter =
    mostrarEnterDuranteIntroduccion ||
    pasoActual === 'interaccionSaltoDeLinea' ||
    pasoActual === 'aclaracionSaltoDeLinea'

  // Determina cuándo el usuario puede modificar cada texto.
  const permitirEnter =
    pasoActual === 'interaccionSaltoDeLinea' && esperandoInteraccion

  // EJERCICIO DE BLOQUEO DE MAYÚSCULAS
  
  // Estado del ejercicio de bloqueo de mayúsculas.
  const [textoMayusculas, setTextoMayusculas] = useState('')

  // Registra la primera pulsación de Bloq Mayús.
  const [bloqueoMayusculasPulsado, setBloqueoMayusculasPulsado] =
    useState(false)

  // Evita continuar dos veces una misma interacción.
  const avancesBloqueo = useRef({
    activacion: false,
    ejercicio: false
  })

  // Cuadro de texto del ejercicio de bloqueo de mayúsculas.
  const mostrarCuadroMayusculas =
    pasoActual === 'introduccionEjercicioBloqueoMayusculas' ||
    pasoActual === 'ejercicioBloqueoMayusculas' ||
    pasoActual === 'felicitacionBloqueoMayusculas' ||
    pasoActual === 'felicitacionFinDeNivel'

  // Determina cuándo el usuario puede modificar el texto.
  const permitirMayusculas =
    pasoActual === 'ejercicioBloqueoMayusculas' &&
    esperandoInteraccion

  // Detecta las pulsaciones físicas de la tecla Bloq Mayús.
  useEffect(() => {

    // Primera pulsación: activar Bloq Mayús.
    const esperandoActivacion =
      pasoActual === 'introduccionBloqueoMayusculas'

    if (!esperandoActivacion) return

    function gestionarTecla(evento: KeyboardEvent) {

      // Solo nos interesa la tecla de bloqueo de mayúsculas.
      if (evento.key !== 'CapsLock' && evento.code !== 'CapsLock') {
        return
      }

      // Evita registrar pulsaciones repetidas al mantenerla presionada.
      if (evento.repeat) return

      if (esperandoActivacion) {
        setBloqueoMayusculasPulsado(true)
      }
    }

    // Escuchamos la pulsación aunque el usuario no esté escribiendo.
    window.addEventListener('keydown', gestionarTecla)
    window.addEventListener('keyup', gestionarTecla)

    // Dejamos de escuchar cuando cambia la fase del ejercicio.
    return () => {
      window.removeEventListener('keydown', gestionarTecla)
      window.removeEventListener('keyup', gestionarTecla)
    }

  }, [
    pasoActual,
    bloqueoMayusculasPulsado
  ])

  // Continúa cuando se ha pulsado Bloq Mayús y termina la narración.
  useEffect(() => {

    if (pasoActual !== 'introduccionBloqueoMayusculas' ||
        !esperandoInteraccion ||
        !bloqueoMayusculasPulsado ||
        avancesBloqueo.current.activacion) {
      return
    }

    avancesBloqueo.current.activacion = true
    continuarTrasInteraccion()

  }, [
    pasoActual,
    esperandoInteraccion,
    bloqueoMayusculasPulsado,
    continuarTrasInteraccion
  ])

  // Finaliza el ejercicio cuando el usuario ha escrito 
  // correctamente ambos nombres.
  useEffect(() => {

    if (pasoActual !== 'ejercicioBloqueoMayusculas' ||
        !esperandoInteraccion ||
        textoMayusculas !== TEXTO_ESPERADO_MAYUSCULAS ||
        avancesBloqueo.current.ejercicio) {
      return
    }

    avancesBloqueo.current.ejercicio = true
    continuarTrasInteraccion()

  }, [
    pasoActual,
    esperandoInteraccion,
    textoMayusculas,
    continuarTrasInteraccion
  ])

  // GESTIÓN DE LAS INTERACCIONES

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

  // Ejercicio de Bloq Mayús: escribir en mayúsculas y minúsculas.
  function gestionarMayusculas(nuevoTexto: string) {

    // Impedimos modificaciones fuera del ejercicio.
    if (!permitirMayusculas) return

    // Actualizamos el contenido del cuadro.
    setTextoMayusculas(nuevoTexto)

    // La validación final se realiza cuando también se ha
    // registrado la segunda pulsación de Bloq Mayús.
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


  // Mantiene visibles las imágenes de Bloq Mayús
  // hasta que el usuario complete la interacción.
  const mostrarImagenBloqMayus =
    (pasoActual === 'introduccionBloqueoMayusculas' &&
     (tiempoAudio >= 7 || esperandoInteraccion)) ||
    pasoActual === 'ejercicioBloqueoMayusculas'

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

            {/* Imagen de la tecla Bloq. Mayus. */}
            {mostrarImagenBloqMayus && (
              <img
                className="imagen-tecla-bloq-mayus"
                src={imagenTeclaBloqMayus}
                alt="Imagen ilustrativa de la tecla de bloqueo 
                     de mayúsculas."
              />
            )}

            {/* Imagen de la tecla Bloq. Mayus. en un teclado */}
            {mostrarImagenBloqMayus && (
              <img
                className="imagen-teclado-bloq-mayus"
                src={imagenTecladoBloqMayus}
                alt="Imagen representativa de la tecla de 
                     bloqueo de mayúsculas en un teclado."
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

          {/* Ejercicio interactivo de escritura. Bloqueo de mayúsculas. */}
          {mostrarCuadroMayusculas && (
            <div className="terminal-ejercicio ejercicio-mayusculas">

              <CuadroTexto
                texto={textoMayusculas}
                onCambiarTexto={gestionarMayusculas}
                etiqueta="Escribe 'ROCIO rocio'. No olvides el espacio."
                enfocarAutomaticamente={permitirMayusculas}
                soloLectura={!permitirMayusculas}
              />

            </div>
          )}

        </div>

      </section>
    </main>
  )
}

export default Teclado22