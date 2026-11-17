
import { useRef, useState, type PointerEvent } from 'react'
import './Caja.css'

type CajaProps = {
  color?: string
  tamano?: number
  forma?: 'cuadrado' | 'circulo'
  interaccion?: 'hover' | 'click' | 'doubleClick' | 'dragDrop'
  posicion?: 'aleatoria' | 'fija'
  coordenadas?: {
    x: number
    y: number
  }
  onActivar?: () => void
  onSoltar?: (posicion: { x: number; y: number }) => void
}

function Caja({
  color = '#4E9FC1',
  tamano = 100,
  forma = 'cuadrado',
  interaccion = 'click',
  posicion = 'aleatoria',
  coordenadas = { x: 50, y: 50 },
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
    onActivar?.()
  }

  // Comienza el arrastre al pulsar el botón izquierdo.
  function iniciarArrastre(evento: PointerEvent<HTMLButtonElement>) {
    if (!evento.isPrimary || evento.button !== 0) return

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
      className="caja"
      style={{
        left: `${posicionInicial.x}%`,
        top: `${posicionInicial.y}%`,

        transform: `translate(
          calc(-50% + ${desplazamiento.x}px),
          calc(-50% + ${desplazamiento.y}px)
        )`,

        width: `${tamano}px`,
        height: `${tamano}px`,
        backgroundColor: color,
        borderRadius: forma === 'circulo' ? '50%' : '0%',

        // Evita que el navegador interprete el arrastre
        // como desplazamiento táctil de la página.
        touchAction: interaccion === 'dragDrop' ? 'none' : undefined,
        userSelect: interaccion === 'dragDrop' ? 'none' : undefined,

        cursor:
          interaccion === 'dragDrop'
            ? arrastrando ? 'grabbing' : 'grab'
            : undefined,
      }}

      onMouseEnter={
        interaccion === 'hover' ? activarCaja : undefined
      }

      onClick={
        interaccion === 'click' ? activarCaja : undefined
      }

      onDoubleClick={
        interaccion === 'doubleClick' ? activarCaja : undefined
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

      aria-label="Elemento interactivo"
    />
  )
}

export default Caja