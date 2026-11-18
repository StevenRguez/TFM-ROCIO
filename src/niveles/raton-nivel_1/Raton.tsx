import { useState } from 'react'
import Raton11 from './secciones/raton1-1/Raton1-1'
import Raton12 from './secciones/raton1-2/Raton1-2'
import Raton13 from './secciones/raton1-3/Raton1-3'
import Raton14 from './secciones/raton1-4/Raton1-4'
import Raton15 from './secciones/raton1-5/Raton1-5'
import Raton16 from './secciones/raton1-6/Raton1-6'

function Raton({ onTerminar }: { onTerminar: () => void }) {
  const [seccionActual, setSeccionActual] = useState(5)

  function avanzarSeccion() {
    if (seccionActual === 2) {
      onTerminar()
      return
    }

    setSeccionActual((seccion) => seccion + 1)
  }

  return (
    <div onContextMenu={(evento) => evento.preventDefault()}>

      {seccionActual === 0 && <Raton11 onTerminar={avanzarSeccion} />}
      {seccionActual === 1 && <Raton12 onTerminar={avanzarSeccion} />}
      {seccionActual === 2 && <Raton13 onTerminar={avanzarSeccion} />}
      {seccionActual === 3 && <Raton14 onTerminar={avanzarSeccion} />}
      {seccionActual === 4 && <Raton15 onTerminar={avanzarSeccion} />}
      {seccionActual === 5 && <Raton16 onTerminar={avanzarSeccion} />}

    </div>
  )
}

export default Raton