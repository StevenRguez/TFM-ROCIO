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
import clicDerecho from '../../assets/clic_derecho.png'
import cuadroDialogo from '../../assets/cuadro_dialogo.png'
import './Raton.css'

const secuenciaRaton = [
  { audio: '/Audios_generados/Raton1-1-1.wav', subtitulos: 'presentacion' },
  { audio: '/Audios_generados/Raton1-1-2.wav', subtitulos: 'funcion' },
  { audio: '/Audios_generados/Raton1-1-3.wav', subtitulos: 'cursor' },
  { audio: '/Audios_generados/Raton1-1-4.wav', subtitulos: 'interaccionCursor' },
  { audio: '/Audios_generados/Raton1-1-5.wav', subtitulos: 'felicitacionCursor' },
  { audio: '/Audios_generados/Raton1-2-1.wav', subtitulos: 'introduccionClicIzquierdo' },
  { audio: '/Audios_generados/Raton1-2-2.wav', subtitulos: 'clicIzquierdoCirculoAmarillo' },
  { audio: '/Audios_generados/Raton1-2-3.wav', subtitulos: 'cambioColorCirculoAmarillo' },
  { audio: '/Audios_generados/Raton1-2-4.wav', subtitulos: 'cambioColorCirculoNaranja' },
  { audio: '/Audios_generados/Raton1-2-5.wav', subtitulos: 'explicacionBotonIzquierdo' },
  { audio: '/Audios_generados/Raton1-2-6.wav', subtitulos: 'ejemplosClicIzquierdo' },
  { audio: '/Audios_generados/Raton1-3-1.wav', subtitulos: 'aperturaClicDerecho' },
  { audio: '/Audios_generados/Raton1-3-2.wav', subtitulos: 'ubicacionClicDerecho' },
  { audio: '/Audios_generados/Raton1-3-3.wav', subtitulos: 'aparicionCuadroDialogo' },
  { audio: '/Audios_generados/Raton1-3-4.wav', subtitulos: 'comprobacionClicDerecho' },
  { audio: '/Audios_generados/Raton1-3-5.wav', subtitulos: 'explicacionClicDerecho' },
  { audio: '/Audios_generados/Raton1-3-6.wav', subtitulos: 'ejercicioClicDerecho' },
  { audio: '/Audios_generados/Raton1-3-7.wav', subtitulos: 'felicitacionClicDerecho' },
] as const

function Raton({ onTerminar }: { onTerminar: () => void }) {

  const [indiceAudioActual, setIndiceAudioActual] = useState(0)
  const [reproducirAudio, setReproducirAudio] = useState(false)
  const [tiempoAudio, setTiempoAudio] = useState(-1)
  const [esperandoInteraccion, setEsperandoInteraccion] = useState(false)

  const audioActual = secuenciaRaton[indiceAudioActual]
  const transcripciones = subtitulosPorAudio[audioActual.subtitulos]

  useEffect(() => { setReproducirAudio(true) }, [])

  // Gestiona el final de cada audio
  function alTerminarAudio() {
    setTiempoAudio(-1)

    if (indiceAudioActual === 3 ||  // Interacción con la caja azul.
      indiceAudioActual === 6   ||  // Primer clic sobre el círculo amarillo.
      indiceAudioActual === 7   ||  // Esperar al segundo clic sobre el círculo rojo.
      indiceAudioActual === 14  ||  // Aparición del cuadro de diálogo
      indiceAudioActual === 16) {   // Interacción del cuadro de diálogo
      setReproducirAudio(false)
      setEsperandoInteraccion(true)
      return
    }

    // El último audio ha terminado: finalizamos el nivel.
    if (indiceAudioActual === 17) {
      setReproducirAudio(false)
      onTerminar()
      return
    }

    // En el resto de casos, se continúa automáticamente
    setIndiceAudioActual((indice) => indice + 1)
  }

  // Continúa la secuencia tras una interacción
  function continuarTrasInteraccion(indice: number) {
    if (!esperandoInteraccion) return

    setEsperandoInteraccion(false)
    setIndiceAudioActual(indice)
    setReproducirAudio(true)
  }

  const [colorCirculo, setColorCirculo] = useState('#e0fa1a')

  // Gestiona los dos clics sobre el mismo círculo.
  function interactuarConCirculo() {

    function modificarCirculo(color: string, indice: number) {
      setColorCirculo(color)
      continuarTrasInteraccion(indice + 1)
      return
    }

    if (!esperandoInteraccion) return

    if (indiceAudioActual === 6) {
      modificarCirculo('#e03535', 6) // Primer clic: amarillo a rojo.
    }

    if (indiceAudioActual === 7) {
      modificarCirculo('#ff7b00', 7) // Segundo clic: rojo a naranja.
    }
  
  }

  // Visibilidad del cuadro de diálogo
  const [menuVisible, setMenuVisible] = useState(false) 

  // Coordenadas donde aparecerá el cuadro de diálogo
  const [posicionMenu, setPosicionMenu] = useState({ x: 0, y: 0,}) 

  // Gestiona el menú contextual del navegador para que no aparezca al hacer clic derecho
  function gestionarMenuContextual(
    evento: React.MouseEvent<HTMLElement>
  ) {
    evento.preventDefault()
    setPosicionMenu({ x: evento.clientX, y: evento.clientY, }) // Coordenadas
    
    if (indiceAudioActual < 13) { return }

    setMenuVisible(true) // Mostrar el cuadro de diálogo solo si estamos en el paso correcto

    // Solo el primer clic derecho permite avanzar.
    if (indiceAudioActual === 14 && esperandoInteraccion) {
      continuarTrasInteraccion(15)
    }
  }
  
  // Función para hacer desaparecer el cuadro de diálogo
  function cerrarMenuContextual() {
    setMenuVisible(false)
  }

  return (
    <main className="pizarra" 
          onContextMenu={gestionarMenuContextual}
          onClick={cerrarMenuContextual}>
      
      <img
        className="logo"
        src={logoPizarra}
        alt="Logotipo del sistema dibujado con efecto tiza"
      />

      <GestorAudio
        src={audioActual.audio}
        reproducir={reproducirAudio}
        onTimeUpdate={setTiempoAudio}
        onEnded={alTerminarAudio}
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

        {indiceAudioActual === 5 && tiempoAudio >= 4 && (
          <img
            className="imagen-clic-izquierdo"
            src={clicIzquierdo}
            alt="Imagen de un ratón de ordenador haciendo clic izquierdo"
          />
        )}

        {indiceAudioActual >= 12 && indiceAudioActual <= 14 && (
          <img
            className="imagen-clic-derecho"
            src={clicDerecho}
            alt="Imagen de un ratón de ordenador haciendo clic derecho"
          />
        )}

        {indiceAudioActual >= 13 && indiceAudioActual <= 14 && (
          <img
            className="imagen-cuadro-dialogo"
            src={cuadroDialogo}
            alt="Imagen de un cuadro de diálogo esquemático que aparece 
            al hacer clic derecho con el ratón"
          />
        )}

      </div>  

      {/* Caja azul: interacción del movimiento del cursor */}
      {indiceAudioActual === 3 && (
        <Caja
          forma="cuadrado"
          color="#7bc5e5"
          tamano={200}
          interaccion="hover"
          posicion="aleatoria"
          onActivar={() => continuarTrasInteraccion(4)}
        />
      )}

      {/* Caja azul: interacción del movimiento del cursor */}
      {indiceAudioActual >= 6 && indiceAudioActual <= 8 && (
        <Caja
          forma="circulo"
          color={colorCirculo}
          tamano={200}
          interaccion="click"
          posicion="aleatoria"
          onActivar={interactuarConCirculo}
        />
      )}

      {/* Interacción con el cuadro de diálogo */}
      {menuVisible && (
        <div
          className="menu-contextual"
          style={{
            left: posicionMenu.x,
            top: posicionMenu.y,
          }}
          onClick={(evento) => evento.stopPropagation()}
        >
          <button type="button"
            disabled={indiceAudioActual !== 16}
          > Opción 1 </button>
          <button type="button" 
            disabled={indiceAudioActual !== 16}
          > Opción 2 </button>
          <button type="button"
            disabled={indiceAudioActual !== 16}
            onClick={() => {
              cerrarMenuContextual()
              continuarTrasInteraccion(17)
            }}
          >
            Ir al siguiente paso
          </button>
        </div>
      )}

    </main>
  )
}

export default Raton