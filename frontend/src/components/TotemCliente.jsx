export default function TotemCliente({ onEmitir, senhaEmitida }) {
  return (
    <section className="card">
      <h2>Totem de Autoatendimento</h2>
      <p className="subtitulo">Selecione o tipo de atendimento para retirar sua senha:</p>

      <div className="botoes-totem">
        <button className="btn btn-prioritaria" onClick={() => onEmitir("SP")}>
          Prioritária (SP)
        </button>
        <button className="btn btn-exames" onClick={() => onEmitir("SE")}>
          Retirada de Exames (SE)
        </button>
        <button className="btn btn-geral" onClick={() => onEmitir("SG")}>
          Geral (SG)
        </button>
      </div>

      {senhaEmitida && (
        <div className="ticket-box">
          <span>Sua senha é</span>
          <strong className="ticket-numero">{senhaEmitida.numero}</strong>
          <small>
            Tipo: {senhaEmitida.tipo} | Emitida às{" "}
            {new Date(senhaEmitida.emitidaEm).toLocaleTimeString("pt-BR")}
          </small>
        </div>
      )}
    </section>
  );
}
 