import { useState } from 'react'
import './Caja.css'

type CajaProps = {
  color?: string
  tamano?: number
  interaccion?: 'hover' | 'click'
  posicion?: 'aleatoria' | 'fija'
  onActivar: () => void
}

function Caja({
  color = '#4E9FC1',
  tamano = 100,
  interaccion = 'click',
  posicion = 'aleatoria',
  onActivar,
}: CajaProps) {
  const [activada, setActivada] = useState(false)

  const estiloPosicion =
    posicion === 'aleatoria'
      ? {
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 70 + 15}%`,
          transform: 'translate(-50%, -50%)',
        }
      : {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }

  function activarCaja() {
    if (activada) return

    setActivada(true)
    onActivar()
  }

  return (
    <button
      type="button"
      className="caja"
      style={{
        ...estiloPosicion,
        width: `${tamano}px`,
        height: `${tamano}px`,
        backgroundColor: color,
      }}
      onMouseEnter={
        interaccion === 'hover' ? activarCaja : undefined
      }
      onClick={
        interaccion === 'click' ? activarCaja : undefined
      }
      aria-label="Caja interactiva"
      disabled={activada}
    />
  )
}

export default Caja