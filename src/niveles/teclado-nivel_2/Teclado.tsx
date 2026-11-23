import { useState } from 'react'
import Teclado21 from './secciones/teclado2-1/Teclado2-1'
import Teclado22 from './secciones/teclado2-2/Teclado2-2'
import Teclado23 from './secciones/teclado2-3/Teclado2-3'

function Teclado({ onTerminar }: { onTerminar: () => void }) {
  const [seccionActual, setSeccionActual] = useState(0)

  const TOTAL_SECCIONES = 7

  function avanzarSeccion() {
    if (seccionActual === TOTAL_SECCIONES - 1) {
      onTerminar()
      return
    }

    setSeccionActual((seccion) => seccion + 1)
  }

  return (
    <div onContextMenu={(evento) => evento.preventDefault()}>

      {seccionActual === 0 && <Teclado21 onTerminar={avanzarSeccion} />}
      {seccionActual === 1 && <Teclado22 onTerminar={avanzarSeccion} />}
      {seccionActual === 2 && <Teclado23 onTerminar={avanzarSeccion} />}

    </div>
  )
}
export default Teclado