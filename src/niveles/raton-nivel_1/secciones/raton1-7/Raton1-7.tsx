import { useEffect, useRef, useState, type MouseEvent } from 'react'

import { subtitulosPorAudio } from './subtitulos1-7'
import { useSecuenciasNarradas } from '@/componentes_reutilizables/Gestor_audios/useSecuenciasNarradas'
import { useDobleClic } from '@/componentes_reutilizables/Elementos_interactivos/useDobleClic'
import GestorAudio from '@/componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '@/componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import Caja from '@/componentes_reutilizables/Elementos_interactivos/Caja/Caja'
import MenuContextual from '@/componentes_reutilizables/Elementos_interactivos/MenuContextual/MenuContextual'

import logoPizarra from '@/assets/raton/logo_pizarra.png'
import imagenMovimientoRueda from '@/assets/raton/movimiento_rueda_raton.png'
import imagenClicDerecho from '@/assets/raton/clic_derecho.png'
import iconoClic from '@/assets/raton/clic_cuadrado_azul.png'
import iconoArrastrar from '@/assets/raton/arrastrar_cuadrado_amarillo.png'

import './Raton1-7.css'
import '../../Raton.css'

// Secuencia de narraciones de la prueba final.
const secuenciaRaton17 = [
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-1.wav',
    subtitulos: 'introduccionPruebaFinal'
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-2.wav',
    subtitulos: 'aparicionCajas'
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-3.wav',
    subtitulos: 'instruccionesCajas',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-4.wav',
    subtitulos: 'buscarMasCajasRuedaRaton',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-5.wav',
    subtitulos: 'cambiarCajas'
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-6.wav',
    subtitulos: 'explicacionCambiarCajas',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-7.wav',
    subtitulos: 'quedanSiete',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-8.wav',
    subtitulos: 'felicitacionFinal'
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-9.wav',
    subtitulos: 'consultaAvance',
    esperarInteraccion: true
  },
  {
    audio: '/Audios_generados/raton-nivel_1/1-7_Nivel_final/Raton1-7-10.wav',
    subtitulos: 'enlaceSiguienteNivel'
  }
] as const

type GrupoCajas = 'superior' | 'inferior' | 'nuevas'
type TipoCaja = 'azul' | 'amarilla'

type CajaEjercicio = {
  id: string
  tipo: TipoCaja
  grupo: GrupoCajas
  x: number
  y: number
}

// Límites de una caja respecto a la ventana.
// Se utilizan para comprobar su superposición con el contenedor.
type LimitesCaja = {
  left: number
  right: number
  top: number
  bottom: number
}

// Primera ronda: ocho cajas azules y cuatro amarillas.
// Las coordenadas se expresan en porcentajes de la pizarra.
const cajasIniciales: CajaEjercicio[] = [

  // Primera pantalla: cajas distribuidas por la pizarra.
  { id: 'a1', tipo: 'azul', grupo: 'superior', x: 12, y: 9  },
  { id: 'a2', tipo: 'azul', grupo: 'superior', x: 36, y: 17 },
  { id: 'a3', tipo: 'azul', grupo: 'superior', x: 58, y: 7  },
  { id: 'a4', tipo: 'azul', grupo: 'superior', x: 81, y: 12 },
  { id: 'a5', tipo: 'azul', grupo: 'superior', x: 23, y: 27 },
  { id: 'a6', tipo: 'azul', grupo: 'superior', x: 57, y: 31 },
  { id: 'y1', tipo: 'amarilla', grupo: 'superior', x: 8,  y: 38 },
  { id: 'y2', tipo: 'amarilla', grupo: 'superior', x: 31, y: 7  },
  { id: 'y3', tipo: 'amarilla', grupo: 'superior', x: 66, y: 18 },
  { id: 'y4', tipo: 'amarilla', grupo: 'superior', x: 87, y: 24 },

  // Cajas que se descubren desplazando la pantalla.
  { id: 'a7', tipo: 'azul', grupo: 'inferior', x: 15, y: 62 },
  { id: 'a8', tipo: 'azul', grupo: 'inferior', x: 38, y: 66 },
  { id: 'a9', tipo: 'azul', grupo: 'inferior', x: 60, y: 74 },
  { id: 'a10', tipo: 'azul', grupo: 'inferior', x: 20, y: 86 },
  { id: 'y5', tipo: 'amarilla', grupo: 'inferior', x: 59, y: 88 },
  { id: 'y6', tipo: 'amarilla', grupo: 'inferior', x: 40, y: 83 }
]

// Segunda ronda: siete cajas azules y dos amarillas.
const cajasNuevas: CajaEjercicio[] = [
  { id: 'n1', tipo: 'azul', grupo: 'nuevas', x: 16, y: 17 },
  { id: 'n2', tipo: 'azul', grupo: 'nuevas', x: 39, y: 19 },
  { id: 'n3', tipo: 'azul', grupo: 'nuevas', x: 62, y: 31 },
  { id: 'n4', tipo: 'azul', grupo: 'nuevas', x: 17, y: 36 },
  { id: 'n5', tipo: 'azul', grupo: 'nuevas', x: 42, y: 66 },
  { id: 'n6', tipo: 'azul', grupo: 'nuevas', x: 63, y: 75 },
  { id: 'n7', tipo: 'azul', grupo: 'nuevas', x: 21, y: 84 },
  { id: 'y7', tipo: 'amarilla', grupo: 'nuevas', x: 58, y: 46 },
  { id: 'y8', tipo: 'amarilla', grupo: 'nuevas', x: 42, y: 86 }
]

// Porcentaje mínimo de superposición necesario para aceptar una caja.
const PORCENTAJE_MINIMO_DEPOSITO = 0.10

type Raton17Props = { onTerminar: () => void }

function Raton17({ onTerminar }: Raton17Props) {

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
  } = useSecuenciasNarradas(secuenciaRaton17, onTerminar)

  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  // Estado de las cajas del ejercicio.
  const [cajas, setCajas] = useState<CajaEjercicio[]>(cajasIniciales)
  const [amarillasDepositadas, setAmarillasDepositadas] = useState(0)
  const [rondaNuevaActiva, setRondaNuevaActiva] = useState(false)

  // Contenedor donde deben soltarse las cajas amarillas.
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Menú contextual personalizado.
  const [menuVisible, setMenuVisible] = useState(false)
  const [posicionMenu, setPosicionMenu] = useState({ x: 0, y: 0 })

  // Scroll global de la pizarra.
  const [scrollHabilitado, setScrollHabilitado] = useState(false)

  // Identifica qué grupo de cajas debe completarse.
  const grupoEnCurso: GrupoCajas | null =
    pasoActual === 'instruccionesCajas' ? 'superior' :
    pasoActual === 'buscarMasCajasRuedaRaton' ? 'inferior' :
    (
      (pasoActual === 'explicacionCambiarCajas' && rondaNuevaActiva) ||
      pasoActual === 'quedanSiete'
    ) ? 'nuevas' :
    null

  // Las cajas aparecen a partir de la segunda narración.
  const mostrarCajas = [
    'aparicionCajas',
    'instruccionesCajas',
    'buscarMasCajasRuedaRaton',
    'cambiarCajas',
    'explicacionCambiarCajas',
    'quedanSiete'
  ].includes(pasoActual)

  // Cuenta las cajas pendientes del grupo actual.
  const cajasPendientes = cajas.filter(
    (caja) => caja.grupo === grupoEnCurso
  ).length

  // Al completar todas las cajas de un grupo, avanzamos.
  useEffect(() => {
    if (!esperandoInteraccion) return

    // Segunda ronda: narramos cuando quedan siete cajas.
    if (
      pasoActual === 'explicacionCambiarCajas' &&
      rondaNuevaActiva &&
      cajasPendientes === 7
    ) {
      continuarTrasInteraccion()
      return
    }

    // Finalización de los ejercicios de cada grupo.
    if (
      (
        pasoActual === 'instruccionesCajas' ||
        pasoActual === 'buscarMasCajasRuedaRaton' ||
        pasoActual === 'quedanSiete'
      ) &&
      cajasPendientes === 0
    ) {
      continuarTrasInteraccion()
    }

  }, [
    pasoActual,
    esperandoInteraccion,
    rondaNuevaActiva,
    cajasPendientes,
    continuarTrasInteraccion
  ])

  // Permitimos el scroll al terminar sus instrucciones.
  useEffect(() => {
    if (
      pasoActual === 'buscarMasCajasRuedaRaton' &&
      esperandoInteraccion
    ) {
      setScrollHabilitado(true)
    }
  }, [pasoActual, esperandoInteraccion])

  // Bloqueamos el desplazamiento antes del ejercicio de la rueda.
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.classList.toggle('scroll-bloqueado', !scrollHabilitado)
    body.classList.toggle('scroll-bloqueado', !scrollHabilitado)

    return () => {
      html.classList.remove('scroll-bloqueado')
      body.classList.remove('scroll-bloqueado')
    }
  }, [scrollHabilitado])

  // Al finalizar el ejercicio, regresamos al inicio
  // y bloqueamos nuevamente el desplazamiento.
  useEffect(() => {
    if (pasoActual === 'felicitacionFinal') {

      // Cerramos cualquier menú que permanezca abierto.
      setMenuVisible(false)

      // Regresamos al comienzo de la pizarra.
      window.scrollTo(0, 0)

      // Impedimos nuevos desplazamientos.
      setScrollHabilitado(false)
    }
  }, [pasoActual])

  // Elimina una caja azul cuando recibe el clic correcto.
  function seleccionarCajaAzul(caja: CajaEjercicio) {
    if (!esperandoInteraccion || caja.grupo !== grupoEnCurso) {
      return
    }

    setCajas((actuales) =>
      actuales.filter((elemento) => elemento.id !== caja.id)
    )
  }

  // Valida el depósito de una caja amarilla.
  function depositarCajaAmarilla (
    caja: CajaEjercicio,
    posicion: { x: number; y: number },
    limitesCaja?: LimitesCaja
  ) {

    console.log('INTENTO DE DEPÓSITO', {
      caja: caja.id,
      grupoCaja: caja.grupo,
      grupoEnCurso,
      pasoActual,
      esperandoInteraccion,
      contenedorDisponible: !!contenedorRef.current,
      posicion
    })

    // Solo admitimos cajas del grupo correspondiente al ejercicio.
    // No es necesario esperar a que termine la narración.
    if (caja.grupo !== grupoEnCurso) {
      return
    }

    const contenedor = contenedorRef.current
    if (!contenedor) return

    // Obtenemos los límites reales del contenedor rosa.
    const limites = contenedor.getBoundingClientRect()

    let depositoValido = false

    if (limitesCaja) {

      // Calculamos cuánto se superponen horizontalmente
      // la caja amarilla y el contenedor rosa.
      const interseccionX = Math.max(
        0,
        Math.min(limites.right, limitesCaja.right) -
        Math.max(limites.left, limitesCaja.left)
      )

      // Calculamos cuánto se superponen verticalmente
      // la caja amarilla y el contenedor rosa.
      const interseccionY = Math.max(
        0,
        Math.min(limites.bottom, limitesCaja.bottom) -
        Math.max(limites.top, limitesCaja.top)
      )

      // Calculamos el área total de la caja amarilla.
      const anchoCaja = limitesCaja.right - limitesCaja.left
      const altoCaja = limitesCaja.bottom - limitesCaja.top

      const areaCaja = anchoCaja * altoCaja

      // Calculamos qué proporción de la caja amarilla
      // se encuentra dentro del contenedor rosa.
      const porcentajeDentro =
        areaCaja > 0
          ? (interseccionX * interseccionY) / areaCaja
          : 0

      // Aceptamos el depósito si la superposición
      // alcanza el porcentaje mínimo establecido.
      depositoValido =
        porcentajeDentro >= PORCENTAJE_MINIMO_DEPOSITO

    } else {

      // Compatibilidad con versiones de Caja que solamente
      // comuniquen la posición del cursor al soltarla.
      depositoValido =
        posicion.x >= limites.left &&
        posicion.x <= limites.right &&
        posicion.y >= limites.top &&
        posicion.y <= limites.bottom
    }

    console.log('RESULTADO DEL DEPÓSITO', {
    caja: caja.id,
    depositoValido,
    limitesCaja,
    limitesContenedor: limites,
    scrollActual: window.scrollY
  })

    // Si la caja no está suficientemente dentro,
    // no consideramos válido el depósito.
    if (!depositoValido) return

    // Eliminamos la caja de la pizarra.
    setCajas((actuales) =>
      actuales.filter((elemento) => elemento.id !== caja.id)
    )

    // Registramos el depósito correcto.
    setAmarillasDepositadas((cantidad) => cantidad + 1)
  }

  // Abre el menú contextual donde se hace clic derecho.
  function gestionarMenuContextual(evento: MouseEvent<HTMLElement>) {
    evento.preventDefault()

    setPosicionMenu({
      x: evento.clientX,
      y: evento.clientY
    })

    setMenuVisible(true)
  }

  // Cierra el menú contextual.
  function cerrarMenuContextual() {
    setMenuVisible(false)
  }

  // Sustituye las cajas una vez completada la primera ronda.
  function cambiarCajas() {
    if (
      pasoActual !== 'explicacionCambiarCajas' ||
      !esperandoInteraccion ||
      rondaNuevaActiva
    ) {
      return
    }

    // Generamos la segunda ronda.
    setCajas(cajasNuevas)
    setAmarillasDepositadas(0)
    setRondaNuevaActiva(true)

    cerrarMenuContextual()

    // Regresamos al principio.
    window.scrollTo(0, 0)

    // No avanzamos todavía.
    // Esperaremos hasta que queden siete cajas.
  }

  // Gestiona el doble clic del botón final.
  function avanzarAlSiguienteNivel() {
    if (
      pasoActual !== 'consultaAvance' ||
      !esperandoInteraccion
    ) {
      return
    }

    // Reproduce el último audio de despedida.
    continuarTrasInteraccion()
  }

  // Detector de doble clic del botón final.
  const gestionarDobleClicFinal =
    useDobleClic(avanzarAlSiguienteNivel, 800)

  // Segundo exacto en el que la narradora menciona el cuadrado rosa.
  // El valor es ilustrativo: debe ajustarse escuchando Raton1-7-3.wav.
  const SEGUNDO_APARICION_CONTENEDOR = 7

  const mostrarContenedor = (
    pasoActual === 'instruccionesCajas' && (
      tiempoAudio >= SEGUNDO_APARICION_CONTENEDOR ||
      esperandoInteraccion
    )
  ) ||
    pasoActual === 'buscarMasCajasRuedaRaton' ||
    pasoActual === 'cambiarCajas' ||
    pasoActual === 'explicacionCambiarCajas' ||
    pasoActual === 'quedanSiete'

  return (
    <main
      className="pizarra pizarra-prueba-final"
      onContextMenu={gestionarMenuContextual}
      onClick={cerrarMenuContextual}
    >

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
        onTimeUpdate={actualizarTiempo}
        onEnded={alTerminarAudio}
      />

      {/* Subtítulos sincronizados */}
      <GestorSubtitulos
        tiempo={tiempoAudio}
        transcripciones={transcripciones}
      />

      {/* Imágenes ilustrativas */}
      <div className="imagenes-tutorial">

        {/* Imagen explicativa del ratón */}
        {(
          pasoActual === 'buscarMasCajasRuedaRaton' &&
          tiempoAudio >= 1
        ) &&
          !esperandoInteraccion && (
            <img
              className="imagen-explicativa-flotante"
              src={imagenMovimientoRueda}
              alt="Imagen ilustrativa que explica cómo se mueve la rueda de un ratón."
            />
          )}

        {pasoActual === 'explicacionCambiarCajas' &&
          !esperandoInteraccion && (
            <img
              className="imagen-explicativa-flotante"
              src={imagenClicDerecho}
              alt="Imagen ilustrativa que explica dónde se encuentra el clic derecho en un ratón."
            />
          )}

      </div>

      {/* Zona de destino para las cajas amarillas */}
      {mostrarContenedor && (
        <div
          ref={contenedorRef}
          className="contenedor-deposito"
          aria-label={`Zona de depósito. ${amarillasDepositadas} cajas depositadas`}
        />
      )}

      {/* Cajas interactivas de la actividad */}
      {mostrarCajas && cajas.map((caja) => (
        <Caja
          key={caja.id}
          forma="cuadrado"
          color="transparent"
          tamano={120}
          posicion="fija"
          coordenadas={{ x: caja.x, y: caja.y }}
          imagen={
            caja.tipo === 'azul'
              ? iconoClic
              : iconoArrastrar
          }
          interaccion={
            caja.tipo === 'azul'
              ? 'click'
              : 'dragDrop'
          }
          nombre={
            caja.tipo === 'azul'
              ? 'Caja azul: hacer clic'
              : 'Caja amarilla: arrastrar al contenedor rosa'
          }
          onActivar={
            caja.tipo === 'azul'
              ? () => seleccionarCajaAzul(caja)
              : undefined
          }

          // Comunicamos los límites de la caja al soltarla
          // para comprobar su superposición con el contenedor.
          onSoltar={
            caja.tipo === 'amarilla'
              ? (posicion, limitesCaja) =>
                  depositarCajaAmarilla(
                    caja,
                    posicion,
                    limitesCaja
                  )
              : undefined
          }
        />
      ))}

      {/* Menú contextual disponible durante toda la sección */}
      {menuVisible && (
        <MenuContextual
          posicion={posicionMenu}
          opciones={[
            {
              texto: 'Cambiar cajas',
              deshabilitada:
                pasoActual !== 'explicacionCambiarCajas' ||
                !esperandoInteraccion,
              alSeleccionar: cambiarCajas
            },
            {
              texto: 'Cerrar menú',
              alSeleccionar: cerrarMenuContextual
            }
          ]}
        />
      )}

      {/* Botón que completa el nivel mediante doble clic */}
      {pasoActual === 'consultaAvance' && (
        <button
          type="button"
          className="boton-avanzar-nivel"

          // No acepta clics mientras se reproduce la narración.
          disabled={!esperandoInteraccion}

          // Detector personalizado de doble clic.
          onClick={gestionarDobleClicFinal}

          aria-label="Avanzar al siguiente nivel mediante doble clic"
        >
          Avanzar al siguiente nivel
        </button>
      )}

    </main>
  )
}

export default Raton17