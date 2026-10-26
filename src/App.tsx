import { useState } from 'react'
import Introduccion from './niveles/introduccion/Introduccion'
import RatonNivel1 from './niveles/raton-nivel_1/Raton'

function App() {
  const [nivelActual, setNivelActual] = useState(0)

  switch (nivelActual) {
    case 0:
      return (
        <Introduccion
          onTerminar={() => setNivelActual(1)}
        />
      )

    case 1:
      return (
        <RatonNivel1
          onTerminar={() => setNivelActual(2)}
        />
      )

    default:
      return <main className="pizarra" />
  }
}

export default App