import imagenCursor from '@/assets/raton/cursor.png'
import botonesRaton from '@/assets/raton/botones_raton.png'
import clicIzquierdo from '@/assets/raton/clic_izquierdo.png'

import './AnimacionArrastre.css'

type AnimacionArrastreProps = {
  posicionX?: string
  posicionY?: string
  escala?: number
}

function AnimacionArrastre({
  posicionX = '50%',
  posicionY = '45%',
  escala = 1,
}: AnimacionArrastreProps) {

  return (
    <div
      className="animacion-arrastre"
      style={{
        left: posicionX,
        top: posicionY,
        transform: `translate(-50%, -50%) scale(${escala})`,
      }}
      role="img"
      aria-label="El cursor mantiene pulsado el botón izquierdo, arrastra un cuadrado y lo suelta en una zona de destino."
    >

      {/* Demostración del arrastre */}
      <div className="animacion-arrastre-escena">

        <div className="animacion-arrastre-destino" />

        <div className="animacion-arrastre-caja" />

        <img
          className="animacion-arrastre-cursor"
          src={imagenCursor}
          alt=""
          draggable={false}
        />

      </div>

      {/* Representación del botón izquierdo */}
      <div className="animacion-arrastre-indicador">

        <div className="animacion-arrastre-raton">

          <img
            className="animacion-arrastre-raton-libre"
            src={botonesRaton}
            alt=""
            draggable={false}
          />

          <img
            className="animacion-arrastre-raton-pulsado"
            src={clicIzquierdo}
            alt=""
            draggable={false}
          />

        </div>

        <span>Botón izquierdo</span>

      </div>

    </div>
  )
}

export default AnimacionArrastre