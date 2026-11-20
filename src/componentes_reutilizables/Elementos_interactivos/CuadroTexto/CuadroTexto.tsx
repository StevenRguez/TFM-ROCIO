import { useEffect, useId, useRef, type MouseEvent } from 'react'
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
  soloLectura?: boolean
  enfocarAutomaticamente?: boolean

  // Comunica la posición del cursor al componente padre.
  onColocarCursor?: (inicio: number, fin: number) => void

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
  soloLectura = false,
  enfocarAutomaticamente = false,
  onColocarCursor,
  className = '',
}: CuadroTextoProps) {

  // Identificador único para asociar el campo con su etiqueta.
  const identificador = useId()

  // Referencias para gestionar el enfoque del cuadro de texto.
  const referenciaInput = useRef<HTMLInputElement>(null)
  const referenciaTextarea = useRef<HTMLTextAreaElement>(null)

  // Clases que se aplicarán al cuadro de texto.
  const clasesCuadro = [
    'cuadro-texto',
    multilinea ? 'cuadro-texto-multilinea' : '',
    className
  ].filter(Boolean).join(' ')

  // Enfoca el cuadro cuando la sección lo solicita.
// Enfoca el cuadro cuando la sección lo solicita.
useEffect(() => {
  if (!enfocarAutomaticamente || deshabilitado) return

  const campo = multilinea
    ? referenciaTextarea.current
    : referenciaInput.current

  if (!campo) return

  campo.focus()

  // Colocamos el cursor al final del contenido.
  const posicionFinal = campo.value.length
  campo.setSelectionRange(posicionFinal, posicionFinal)

}, [enfocarAutomaticamente, deshabilitado, multilinea])

  // Comunica la posición del cursor cuando el usuario
  // hace clic dentro del cuadro de texto.
  function gestionarPosicionCursor(
    evento: MouseEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const campo = evento.currentTarget

    onColocarCursor?.(
      campo.selectionStart ?? 0,
      campo.selectionEnd ?? 0
    )
  }

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
          ref={referenciaTextarea}
          id={identificador}
          className={clasesCuadro}
          value={texto}
          placeholder={placeholder}
          disabled={deshabilitado}
          readOnly={soloLectura}
          onChange={(evento) =>
            onCambiarTexto(evento.target.value)
          }
          onClick={gestionarPosicionCursor}
          rows={4}
        />
      ) : (

        /* Campo para escribir una sola línea */
        <input
          ref={referenciaInput}
          id={identificador}
          type="text"
          className={clasesCuadro}
          value={texto}
          placeholder={placeholder}
          disabled={deshabilitado}
          readOnly={soloLectura}
          onChange={(evento) =>
            onCambiarTexto(evento.target.value)
          }
          onClick={gestionarPosicionCursor}
        />

      )}

    </div>
  )
}

export default CuadroTexto