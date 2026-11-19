import { useId } from 'react'
import './CuadroTexto.css'

type CuadroTextoProps = {
  // Contenido actual del cuadro de texto.
  texto: string

  // Comunica los cambios al componente padre.
  onCambiarTexto: (texto: string) => void

  // Configuración del cuadro.
  multilinea?: boolean
  placeholder?: string
  etiqueta: string
  deshabilitado?: boolean

  enfocarAutomaticamente?: boolean

  // Permite aplicar estilos adicionales.
  className?: string
}

function CuadroTexto({
  texto,
  onCambiarTexto,
  multilinea = false,
  placeholder = '',
  etiqueta,
  deshabilitado = false,
  enfocarAutomaticamente = false,
  className = '',
}: CuadroTextoProps) {

  // Identificador único para asociar el campo con su etiqueta.
  const identificador = useId()

  // Clases que se aplicarán al cuadro de texto.
  const clasesCuadro = [
    'cuadro-texto',
    multilinea ? 'cuadro-texto-multilinea' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="cuadro-texto-contenedor">

      {/* Etiqueta descriptiva del campo */}
      <label
        htmlFor={identificador}
        className="cuadro-texto-etiqueta"
      >
        {etiqueta}
      </label>

      {/* Campo para escribir varias líneas */}
      {multilinea ? (
        <textarea
          id={identificador}
          className={clasesCuadro}
          value={texto}
          placeholder={placeholder}
          disabled={deshabilitado}
          autoFocus={enfocarAutomaticamente}
          onChange={(evento) =>
            onCambiarTexto(evento.target.value)
          }
          rows={4}
        />
      ) : (

        /* Campo para escribir una sola línea */
        <input
          id={identificador}
          type="text"
          className={clasesCuadro}
          value={texto}
          placeholder={placeholder}
          disabled={deshabilitado}
          autoFocus={enfocarAutomaticamente}
          onChange={(evento) =>
            onCambiarTexto(evento.target.value)
          }
        />

      )}

    </div>
  )
}

export default CuadroTexto