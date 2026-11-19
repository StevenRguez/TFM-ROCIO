import logoTerminal from '@/assets/teclado/logo_terminal.png'

import '../../Teclado.css'

type Teclado21Props = { onTerminar: () => void }

function Teclado21({ onTerminar }: Teclado21Props) {
  return (
    <main className="pantalla-teclado">
      <section className="terminal">

        {/* Cabecera del nivel */}
        <header className="terminal-cabecera">
          ROCIO — NIVEL 02: TECLADO
        </header>

        {/* Área principal de la terminal */}
        <div className="terminal-contenido">
          {/* Logotipo del sistema */}
          <img
            className="logo-terminal"
            src={logoTerminal}
            alt="Logotipo de ROCIO"
          />
        </div>

      </section>
    </main>
  )
}
export default Teclado21