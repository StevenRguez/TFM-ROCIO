import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode
} from 'react'

import { useDobleClic } from '../useDobleClic'
import './Caja.css'

// Límites de una caja respecto a la ventana.
type LimitesCaja = {
  left: number
  right: number
  top: number
  bottom: number
}

type CajaProps = {
  color?: string
  imagen?: string
  icono?: ReactNode
  nombre?: string

  tamano?: number
  forma?: 'cuadrado' | 'circulo'
  interaccion?: 'hover' | 'click' | 'doubleClick' | 'dragDrop'
  posicion?: 'aleatoria' | 'fija'
  coordenadas?: {
    x: number
    y: number
  }

  habilitada?: boolean

  onActivar?: () => void

  // Comunica la posición del cursor y los límites finales
  // de la caja cuando termina una operación de arrastre.
  onSoltar?: (
    posicion: { x: number; y: number },
    limitesCaja?: LimitesCaja
  ) => void
}

function Caja({
  color = '#4E9FC1',
  imagen,
  icono,
  nombre = 'Elemento interactivo',

  tamano = 100,
  forma = 'cuadrado',
  interaccion = 'click',
  posicion = 'aleatoria',
  coordenadas = { x: 50, y: 50 },

  habilitada = true,
  onActivar,
  onSoltar,
}: CajaProps) {

  // Generamos una posición aleatoria una sola vez.
  const [coordenadasAleatorias] = useState(() => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 70 + 15,
  }))

  // Seleccionamos las coordenadas que utilizará la caja.
  const posicionInicial =
    posicion === 'aleatoria'
      ? coordenadasAleatorias
      : coordenadas

  // Desplazamiento respecto a la posición inicial.
  const [desplazamiento, setDesplazamiento] = useState({
    x: 0,
    y: 0,
  })

  // Indica si estamos arrastrando la caja.
  const [arrastrando, setArrastrando] = useState(false)

  // Guarda la información necesaria para el arrastre.
  const datosArrastre = useRef<{
    pointerId: number
    inicioX: number
    inicioY: number
    origenX: number
    origenY: number
    desplazamientoDetectado: boolean

    // Límites reales de la caja al comenzar el arrastre.
    limitesIniciales: LimitesCaja

    // Desplazamiento de la página al comenzar el arrastre.
    scrollInicialX: number
    scrollInicialY: number
  } | null>(null)

  // Permite eliminar los detectores globales al terminar el arrastre.
  const limpiarDetectores = useRef<(() => void) | null>(null)

  // Eliminamos los detectores si el componente desaparece.
  useEffect(() => {
    return () => {
      limpiarDetectores.current?.()
    }
  }, [])

  // Gestiona las interacciones tradicionales.
  function activarCaja() {
    if (!habilitada) return
    onActivar?.()
  }

  // Detector personalizado de doble clic.
  const gestionarDobleClic = useDobleClic(
    activarCaja,
    800
  )

  // =========================================
  // GESTIÓN DEL ARRASTRE
  // =========================================

  // Comienza el arrastre al pulsar el botón izquierdo.
  function iniciarArrastre(evento: ReactPointerEvent<HTMLButtonElement>) {

    // Solo aceptamos el puntero principal y el botón izquierdo.
    if (!habilitada || !evento.isPrimary || evento.button !== 0) {
      return
    }

    // Evitamos iniciar dos operaciones simultáneas.
    if (datosArrastre.current) return

    const elemento = evento.currentTarget
    const pointerId = evento.pointerId

    // Obtenemos los límites reales de la caja antes de moverla.
    const limites = elemento.getBoundingClientRect()

    // Guardamos la información inicial del arrastre.
    datosArrastre.current = {
      pointerId,
      inicioX: evento.clientX,
      inicioY: evento.clientY,
      origenX: desplazamiento.x,
      origenY: desplazamiento.y,
      desplazamientoDetectado: false,

      // Guardamos los límites iniciales.
      limitesIniciales: {
        left: limites.left,
        right: limites.right,
        top: limites.top,
        bottom: limites.bottom
      },

      // Guardamos el desplazamiento inicial de la página.
      scrollInicialX: window.scrollX,
      scrollInicialY: window.scrollY
    }

    setArrastrando(true)

    // Mantiene los eventos vinculados a la caja,
    // aunque el cursor salga de sus límites.
    elemento.setPointerCapture(pointerId)

    // Actualiza la posición mientras se arrastra.
    function mover(evento: PointerEvent) {
      const datos = datosArrastre.current

      if (!datos || datos.pointerId !== evento.pointerId) {
        return
      }

      const diferenciaX = evento.clientX - datos.inicioX
      const diferenciaY = evento.clientY - datos.inicioY

      // Evitamos considerar como arrastre un movimiento mínimo.
      if (Math.hypot(diferenciaX, diferenciaY) >= 8) {
        datos.desplazamientoDetectado = true
      }

      // Actualizamos la posición visual de la caja.
      setDesplazamiento({
        x: datos.origenX + diferenciaX,
        y: datos.origenY + diferenciaY
      })
    }

    // Elimina los detectores asociados al arrastre.
    function limpiar() {

      window.removeEventListener('pointermove', mover, true)
      window.removeEventListener('pointerup', finalizar, true)
      window.removeEventListener('pointercancel', cancelarPorEvento, true)
      window.removeEventListener('blur', cancelar)

      elemento.removeEventListener(
        'lostpointercapture',
        gestionarPerdidaCaptura
      )

      // Liberamos la captura del puntero si sigue activa.
      if (elemento.hasPointerCapture(pointerId)) {
        elemento.releasePointerCapture(pointerId)
      }

      limpiarDetectores.current = null
    }

    // Finaliza el arrastre cuando se suelta el botón.
    function finalizar(evento: PointerEvent) {
      const datos = datosArrastre.current

      if (!datos || datos.pointerId !== evento.pointerId) {
        return
      }

      // Calculamos cuánto se ha desplazado el cursor.
      const diferenciaX = evento.clientX - datos.inicioX
      const diferenciaY = evento.clientY - datos.inicioY

      // Comprobamos también la distancia final por seguridad.
      const seHaArrastrado =
        datos.desplazamientoDetectado ||
        Math.hypot(diferenciaX, diferenciaY) >= 8

      // Calculamos cuánto se ha desplazado la página.
      const diferenciaScrollX =
        window.scrollX - datos.scrollInicialX

      const diferenciaScrollY =
        window.scrollY - datos.scrollInicialY

      // Calculamos los límites finales de la caja.
      // Este cálculo corresponde a cajas posicionadas de forma
      // absoluta dentro de la pizarra desplazable.
      const limitesFinales: LimitesCaja = {
        left:
          datos.limitesIniciales.left +
          diferenciaX -
          diferenciaScrollX,

        right:
          datos.limitesIniciales.right +
          diferenciaX -
          diferenciaScrollX,

        top:
          datos.limitesIniciales.top +
          diferenciaY -
          diferenciaScrollY,

        bottom:
          datos.limitesIniciales.bottom +
          diferenciaY -
          diferenciaScrollY
      }

      // Actualizamos también la última posición de la caja.
      setDesplazamiento({
        x: datos.origenX + diferenciaX,
        y: datos.origenY + diferenciaY
      })

      // Finalizamos la operación y eliminamos sus detectores.
      datosArrastre.current = null
      limpiar()
      setArrastrando(false)

      // Notifica la interacción si realmente hubo arrastre.
      if (seHaArrastrado) {

        if (onSoltar) {

          // Comunicamos la posición del cursor y los límites
          // finales de la caja al componente padre.
          onSoltar(
            {
              x: evento.clientX,
              y: evento.clientY
            },
            limitesFinales
          )

        } else {

          // Mantiene la compatibilidad con ejercicios
          // que utilizan onActivar al terminar el arrastre.
          onActivar?.()
        }
      }
    }

    // Cancela el arrastre sin activar la caja.
    function cancelar() {
      const datos = datosArrastre.current

      if (!datos) return

      // Recuperamos la posición anterior para que la caja
      // no permanezca desplazada después de una cancelación.
      setDesplazamiento({
        x: datos.origenX,
        y: datos.origenY
      })

      datosArrastre.current = null
      limpiar()
      setArrastrando(false)
    }

    // Atiende una cancelación del puntero activo.
    function cancelarPorEvento(evento: PointerEvent) {
      if (datosArrastre.current?.pointerId === evento.pointerId) {
        cancelar()
      }
    }

    // Detecta si el navegador pierde inesperadamente
    // la captura del puntero durante el arrastre.
    function gestionarPerdidaCaptura(evento: PointerEvent) {
      if (datosArrastre.current?.pointerId === evento.pointerId) {
        cancelar()
      }
    }

    // Registramos los eventos a nivel de ventana.
    // No dependemos de recibir pointerup sobre la propia caja.
    window.addEventListener('pointermove', mover, true)
    window.addEventListener('pointerup', finalizar, true)
    window.addEventListener('pointercancel', cancelarPorEvento, true)
    window.addEventListener('blur', cancelar)

    // Detectamos también una pérdida inesperada de captura.
    elemento.addEventListener(
      'lostpointercapture',
      gestionarPerdidaCaptura
    )

    // Guardamos cómo eliminar los detectores.
    limpiarDetectores.current = limpiar
  }

  return (
    <button
      type="button"
      className={[
        'caja',
        imagen || icono ? 'caja-con-imagen' : '',
        arrastrando ? 'caja-arrastrando' : ''
      ].filter(Boolean).join(' ')}

      disabled={!habilitada}

      style={{
        left: `${posicionInicial.x}%`,
        top: `${posicionInicial.y}%`,

        transform: `translate(
          calc(-50% + ${desplazamiento.x}px),
          calc(-50% + ${desplazamiento.y}px)
        )`,

        width: `${tamano}px`,
        height: `${tamano}px`,

        backgroundColor: imagen || icono
          ? 'transparent'
          : color ?? '#4E9FC1',

        borderRadius: forma === 'circulo' ? '50%' : '0%',

        // Evita que el navegador interprete el arrastre
        // como desplazamiento táctil de la página.
        touchAction: interaccion === 'dragDrop'
          ? 'none'
          : undefined,

        userSelect: interaccion === 'dragDrop'
          ? 'none'
          : undefined,

        cursor: interaccion === 'dragDrop'
          ? arrastrando ? 'grabbing' : 'grab'
          : undefined,
      }}

      onMouseEnter={
        interaccion === 'hover'
          ? activarCaja
          : undefined
      }

      // Gestiona tanto el clic sencillo como el doble clic.
      onClick={
        interaccion === 'click'
          ? activarCaja
          : interaccion === 'doubleClick'
            ? gestionarDobleClic
            : undefined
      }

      // Comienza el arrastre de la caja.
      // El movimiento y la liberación se gestionan
      // mediante los detectores globales.
      onPointerDown={
        interaccion === 'dragDrop'
          ? iniciarArrastre
          : undefined
      }

      aria-label={nombre}
    >
      {imagen ? (
        <img
          className="caja-imagen"
          src={imagen}
          alt=""
          draggable={false}
        />
      ) : icono ? (
        <span
          className="caja-icono"
          aria-hidden="true"
        >
          {icono}
        </span>
      ) : null}
    </button>
  )
}

export default Caja