import './Gestor_subtitulos.css'

type Subtitulo = {
  tiempo: number
  texto: string
}

type SubtitulosProps = {
  tiempo: number
  transcripciones: Subtitulo[]
}

function Subtitulos({ tiempo, transcripciones }: SubtitulosProps) {
  const subtituloActual = [...transcripciones]
    .reverse()
    .find((item) => item.tiempo <= tiempo)

  return (
    <div className="subtitulos" aria-live="polite">
      {subtituloActual?.texto ?? ''}
    </div>
  )
}

export default Subtitulos