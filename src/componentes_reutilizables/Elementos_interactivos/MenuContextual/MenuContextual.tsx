
type OpcionMenu = {
  texto: string
  alSeleccionar?: () => void
  deshabilitada?: boolean
}

type MenuContextualProps = {
  posicion: {
    x: number
    y: number
  }
  opciones: OpcionMenu[]
}

function MenuContextual({
  posicion,
  opciones
}: MenuContextualProps) {

  return (
    <div
      className="menu-contextual"
      style={{
        left: posicion.x,
        top: posicion.y,
      }}
      onClick={(evento) => evento.stopPropagation()}
    >
      {opciones.map((opcion, indice) => (
        <button
          key={indice}
          type="button"
          disabled={
            opcion.deshabilitada ||
            !opcion.alSeleccionar
          }
          onClick={opcion.alSeleccionar}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  )
}

export default MenuContextual
