import { useEffect, useState } from 'react'
import { subtitulosPorAudio } from './subtitulos'
import GestorAudio from '../../componentes_reutilizables/Gestor_audios/Gestor_audios'
import GestorSubtitulos from '../../componentes_reutilizables/Gestor_subtitulos/Gestor_subtitulos'
import Caja from '../../componentes_reutilizables/Elementos_interactivos/Caja'
import logoPizarra from '../../assets/logo_pizarra.png'
import imagenRaton from '../../assets/raton.png'
import imagenCursor from '../../assets/cursor.png'
import imagenBotones from '../../assets/botones_raton.png'
import clicIzquierdo from '../../assets/clic_izquierdo.png'
import './Raton.css'

const secuenciaRaton = [
  {
    audio: '/Audios_generados/Raton1-1-1.wav',
    subtitulos: 'presentacion',
  },
  {
    audio: '/Audios_generados/Raton1-1-2.wav',
    subtitulos: 'funcion',
  },
  {
    audio: '/Audios_generados/Raton1-1-3.wav',
    subtitulos: 'cursor',
  },
  {
    audio: '/Audios_generados/Raton1-1-4.wav',
    subtitulos: 'interaccionCursor',
  },
  {
    audio: '/Audios_generados/Raton1-1-5.wav',
    subtitulos: 'felicitacionCursor',
  },
  {
    audio: '/Audios_generados/Raton1-2-1.wav',
    subtitulos: 'introduccionClicIzquierdo',
  },
  {
    audio: '/Audios_generados/Raton1-2-2.wav',
    subtitulos: 'clicIzquierdoCirculoAmarillo',
  },
  {
    audio: '/Audios_generados/Raton1-2-3.wav',
    subtitulos: 'cambioColorCirculoAmarillo',
  },
  {
    audio: '/Audios_generados/Raton1-2-4.wav',
    subtitulos: 'cambioColorCirculoNaranja',
  },
  {
    audio: '/Audios_generados/Raton1-2-5.wav',
    subtitulos: 'explicacionBotonIzquierdo',
  },
  {
    audio: '/Audios_generados/Raton1-2-6.wav',
    subtitulos: 'ejemplosClicIzquierdo',
  },
] as const

function Raton({ onTerminar }: { onTerminar: () => void }) {
  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  const [/*audioEnReproduccion*/, setAudioEnReproduccion] = useState(-1)

  const audioActual = secuenciaRaton[indiceAudioActual]
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  useEffect(() => {
    setReproducirAudio(true)
  }, [])

  function alTerminarAudio() {
    setTiempoAudio(-1)

    // Tras el cuarto audio, esperamos a que el usuario
    // complete la interacción con la caja azul.
    if (indiceAudioActual === 3 || indiceAudioActual === 6 || 
      indiceAudioActual === 7) {
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // El último audio ha terminado: finalizamos el nivel.
    if (indiceAudioActual === 10) {
      setReproducirAudio(false)
      onTerminar()
      return
    }

    // Los tres primeros audios avanzan automáticamente.
    setIndiceAudioActual((indice) => indice + 1)
  }

  function continuarTrasInteraccion(indice: number) {
    if (!esperandoInteraccion) return

    setEsperandoInteraccion(false)
    setIndiceAudioActual(indice)
    setReproducirAudio(true)
  }

  const [colorCirculo, setColorCirculo] = useState('#e0fa1a')

  function cambiarColorCirculo() {
    setColorCirculo('#ff7b00')
    setEsperandoInteraccion(false)
    setIndiceAudioActual(7)
    setReproducirAudio(true)
  }

  return (
    <main className="pizarra">
      <img
        className="logo"
        src={logoPizarra}
        alt="Logotipo del sistema dibujado con efecto tiza"
      />

      <GestorAudio
        src={audioActual.audio}
        reproducir={reproducirAudio}
        onTimeUpdate={setTiempoAudio}
        onPlay={() => setAudioEnReproduccion(indiceAudioActual)}
        onEnded={() => {
          setAudioEnReproduccion(-1)
          alTerminarAudio()
        }}  
      />

      <GestorSubtitulos
        tiempo={tiempoAudio}
        transcripciones={transcripciones}
      />

      <div className="imagenes-tutorial">

        {indiceAudioActual === 1 && (
          <img
            className="imagen-raton"
            src={imagenRaton}
            alt="Imagen del ratón de un ordenador"
          />
        )}

        {indiceAudioActual === 2 && (
          <img
            className="imagen-cursor"
            src={imagenCursor}
            alt="Imagen del cursor que aparece al realizar movimientos con 
            un ratón"
          />
        )}

        {indiceAudioActual === 5 && (
          <img
            className="imagen-botones-raton"
            src={imagenBotones}
            alt="Imagen de los distintos botones que puede tener un ratón"
          />
        )}

        {indiceAudioActual === 6 && (
          <img
            className="imagen-clic-izquierdo"
            src={clicIzquierdo}
            alt="Imagen de un ratón de ordenador haciendo clic izquierdo"
          />
        )}

      </div>  

      {esperandoInteraccion && indiceAudioActual === 3 && (
        <Caja
          forma="cuadrado"
          color="#7bc5e5"
          tamano={200}
          interaccion="hover"
          posicion="aleatoria"
          onActivar={() => continuarTrasInteraccion(4)}
        />
      )}

      {(esperandoInteraccion || indiceAudioActual === 7) && (
        <Caja
          forma="circulo"
          color="colorCirculo"
          tamano={200}
          interaccion="click"
          posicion="aleatoria"
          onActivar={() => cambiarColorCirculo()}
        />
      )}

      {esperandoInteraccion && indiceAudioActual === 7 && (
        <Caja
          forma="circulo"
          color="#ff7b00"
          tamano={200}
          interaccion="click"
          posicion="aleatoria"
          onActivar={() => continuarTrasInteraccion(8)}
        />
      )}

      </main>
  )
}

export default Raton