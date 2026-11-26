export default function TerminalAtendente({
  guiche,
  setGuiche,
  chamadaAtual,
  onChamarProxima,
  onChamarNovamente,
  onIniciarAtendimento,
  onFinalizarAtendimento
}) {
  const podeIniciar = chamadaAtual && chamadaAtual.estado === "CHAMADA";
  const podeFinalizar =
    chamadaAtual &&
    (chamadaAtual.estado === "EM_ATENDIMENTO" || chamadaAtual.estado === "CHAMADA");

  return (
    <section className="card">
      <h2>Terminal do Atendente</h2>

      <form className="form-guiche" onSubmit={onChamarProxima}>
        <label htmlFor="input-guiche">Guichê:</label>
        <input
          id="input-guiche"
          type="text"
          value={guiche}
          onChange={(e) => setGuiche(e.target.value)}
          placeholder="Ex.: Guichê 01"
          required
        />
        <button type="submit" className="btn btn-primario">
          Chamar Próxima
        </button>
        <button
          type="button"
          className="btn btn-secundario"
          onClick={onChamarNovamente}
          disabled={!chamadaAtual || chamadaAtual.estado !== "CHAMADA"}
        >
          Chamar Novamente
        </button>
      </form>

      {chamadaAtual ? (
        <div className="chamada-box">
          <p>
            <strong>Senha atual:</strong> {chamadaAtual.numero} ({chamadaAtual.tipo})
          </p>
          <p>
            <strong>Guichê:</strong> {chamadaAtual.guiche} | <strong>Chamadas:</strong>{" "}
            {chamadaAtual.chamadas}/2 | <strong>Estado:</strong> {chamadaAtual.estado}
          </p>

          <div className="acoes-atendimento">
            <button
              type="button"
              className="btn btn-geral"
              onClick={onIniciarAtendimento}
              disabled={!podeIniciar}
            >
              Iniciar Atendimento
            </button>
            <button
              type="button"
              className="btn btn-exames"
              onClick={onFinalizarAtendimento}
              disabled={!podeFinalizar}
            >
              Finalizar Atendimento
            </button>
          </div>
        </div>
      ) : (
        <p className="vazio">Nenhuma senha chamada neste guichê ainda.</p>
      )}
    </section>
  );
}