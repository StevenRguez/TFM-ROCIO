import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useDobleClic } from '../useDobleClic'
import './Caja.css'

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
  onSoltar?: (posicion: { x: number; y: number }) => void
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
  } | null>(null)

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

  // Comienza el arrastre al pulsar el botón izquierdo.
  function iniciarArrastre(evento: PointerEvent<HTMLButtonElement>) {
    if (!habilitada || !evento.isPrimary || evento.button !== 0) return

    datosArrastre.current = {
      pointerId: evento.pointerId,
      inicioX: evento.clientX,
      inicioY: evento.clientY,
      origenX: desplazamiento.x,
      origenY: desplazamiento.y,
      desplazamientoDetectado: false,
    }

    setArrastrando(true)

    // Mantiene los eventos vinculados a la caja,
    // aunque el cursor salga de sus límites.
    evento.currentTarget.setPointerCapture(evento.pointerId)
  }

  // Actualiza la posición mientras se arrastra.
  function moverCaja(evento: PointerEvent<HTMLButtonElement>) {
    const datos = datosArrastre.current

    if (!datos || datos.pointerId !== evento.pointerId) return

    const diferenciaX = evento.clientX - datos.inicioX
    const diferenciaY = evento.clientY - datos.inicioY

    // Evitamos considerar como arrastre un movimiento mínimo.
    if (Math.hypot(diferenciaX, diferenciaY) >= 8) {
      datos.desplazamientoDetectado = true
    }

    setDesplazamiento({
      x: datos.origenX + diferenciaX,
      y: datos.origenY + diferenciaY,
    })
  }

  // Finaliza el arrastre cuando se suelta el botón.
  function finalizarArrastre(evento: PointerEvent<HTMLButtonElement>) {
    const datos = datosArrastre.current

    if (!datos || datos.pointerId !== evento.pointerId) return

    moverCaja(evento)

    const seHaArrastrado = datos.desplazamientoDetectado

    datosArrastre.current = null
    setArrastrando(false)

    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId)
    }

    // Notifica la interacción si realmente hubo arrastre.
    if (seHaArrastrado) {
      if (onSoltar) {
        onSoltar({
          x: evento.clientX,
          y: evento.clientY,
        })
      } else {
        onActivar?.()
      }
    }
  }

  // Cancela el arrastre sin activar la caja.
  function cancelarArrastre() {
    datosArrastre.current = null
    setArrastrando(false)
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
        touchAction: interaccion === 'dragDrop' ? 'none' : undefined,
        userSelect: interaccion === 'dragDrop' ? 'none' : undefined,

        cursor: interaccion === 'dragDrop'
          ? arrastrando ? 'grabbing' : 'grab'
          : undefined,
      }}

      onMouseEnter={
        interaccion === 'hover' ? activarCaja : undefined
      }

      // Gestiona tanto el clic sencillo como el doble clic.
      onClick={
        interaccion === 'click'
          ? activarCaja
          : interaccion === 'doubleClick'
            ? gestionarDobleClic
            : undefined
      }

      onPointerDown={
        interaccion === 'dragDrop' ? iniciarArrastre : undefined
      }

      onPointerMove={
        interaccion === 'dragDrop' ? moverCaja : undefined
      }

      onPointerUp={
        interaccion === 'dragDrop' ? finalizarArrastre : undefined
      }

      onPointerCancel={
        interaccion === 'dragDrop' ? cancelarArrastre : undefined
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
        <span className="caja-icono" aria-hidden="true">
          {icono}
        </span>
      ) : null}
    </button>
  )
}

export default Caja