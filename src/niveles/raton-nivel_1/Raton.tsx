import { useState } from 'react'
import Raton11 from './secciones/raton1-1/Raton1-1'
import Raton12 from './secciones/raton1-2/Raton1-2'
import Raton13 from './secciones/raton1-3/Raton1-3'

function Raton({ onTerminar }: { onTerminar: () => void }) {
  const [seccionActual, setSeccionActual] = useState(0)

  function avanzarSeccion() {
    if (seccionActual === 2) {
      onTerminar()
      return
    }

    setSeccionActual((seccion) => seccion + 1)
  }

  return (
    <>
      {seccionActual === 0 && <Raton11 onTerminar={avanzarSeccion} />}
      {seccionActual === 1 && <Raton12 onTerminar={avanzarSeccion} />}
      {seccionActual === 2 && <Raton13 onTerminar={avanzarSeccion} />}
    </>
  )
}

export default Raton