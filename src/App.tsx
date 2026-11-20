import { useState, type ReactNode, type TransitionEvent } from 'react'

import Introduccion from './niveles/introduccion/Introduccion'
import RatonNivel1 from './niveles/raton-nivel_1/Raton'
import TecladoNivel2 from './niveles/teclado-nivel_2/Teclado'

import './App.css'

// Estados posibles de la transición visual.
type EstadoTransicion = | 'inactiva' | 'oscureciendo' | 'aclarando'

function App() {
  // Nivel que se está mostrando actualmente.
  const [nivelActual, setNivelActual] = useState(2)

  // Controla la transición entre niveles.
  const [transicion, setTransicion] = useState<EstadoTransicion>('inactiva')

  // Inicia el cambio de nivel.
  function avanzarNivel() {
    if (transicion !== 'inactiva') return

    // Solo aplicamos la transición entre
    // el nivel 1 (Ratón) y el nivel 2 (Teclado).
    const requiereTransicion = nivelActual === 1

    // Si no necesita transición, o el usuario
    // prefiere movimiento reducido, avanzamos directamente.
    if (!requiereTransicion ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0)
      setNivelActual((nivel) => nivel + 1)
      return
    }

    // Iniciamos el oscurecimiento de la pantalla.
    setTransicion('oscureciendo')
  }

  // Gestiona las fases de la transición.
  function finalizarTransicion(
    evento: TransitionEvent<HTMLDivElement>
  ) {
    // Solo nos interesa la transición de opacidad
    // de la capa principal.
    if (evento.target !== evento.currentTarget || 
        evento.propertyName !== 'opacity') {
      return
    }

    // La pantalla está completamente oscura.
    if (transicion === 'oscureciendo') {

      // Regresamos al inicio de la página.
      window.scrollTo(0, 0)

      // Montamos el siguiente nivel.
      setNivelActual((nivel) => nivel + 1)

      // Comenzamos a revelar la nueva pantalla.
      setTransicion('aclarando')
      return
    }

    // La nueva pantalla ya es visible.
    if (transicion === 'aclarando') {
      setTransicion('inactiva')
    }
  }

  // Seleccionamos el componente correspondiente.
  let contenidoNivel: ReactNode

  switch (nivelActual) {

    case 0:
      contenidoNivel = (
        <Introduccion onTerminar={avanzarNivel} />
      )
      break

    case 1:
      contenidoNivel = (
        <RatonNivel1 onTerminar={avanzarNivel} />
      )
      break

    case 2:
      contenidoNivel = (
        <TecladoNivel2 onTerminar={avanzarNivel} />
      )
      break

    default:
      contenidoNivel = <main className="pizarra" />
      break
  }

  return (
    <>
      {/* Nivel actualmente activo */}
      {contenidoNivel}

      {/* Capa de transición entre niveles */}
      <div
        className={[
          'transicion-nivel',
          transicion === 'oscureciendo' ? 'visible' : '',
          transicion !== 'inactiva' ? 'en-curso' : ''
        ].join(' ')}

        onTransitionEnd={finalizarTransicion}
        aria-hidden="true"
      />
    </>
  )
}

export default App