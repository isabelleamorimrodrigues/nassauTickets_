import { useEffect, useState } from "react";
import { buscarAuditoria, buscarRelatorioDiario } from "../services/api";

export default function AreaGestor({ usuario }) {
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().slice(0, 10));
  const [relatorio, setRelatorio] = useState(null);
  const [auditoria, setAuditoria] = useState([]);
  const [erro, setErro] = useState("");

  async function carregarDados(dataSelecionada) {
    setErro("");
    try {
      const [dadosRelatorio, dadosAuditoria] = await Promise.all([
        buscarRelatorioDiario(dataSelecionada),
        buscarAuditoria()
      ]);
      setRelatorio(dadosRelatorio);
      setAuditoria(dadosAuditoria);
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
    carregarDados(dataFiltro);
  }, []);

  if (usuario?.perfil !== "GESTOR") {
    return (
      <section className="card">
        <h2>Área do Gestor</h2>
        <p className="alerta-erro">
          Acesso negado. Seu perfil atual é <strong>{usuario?.perfil || "SEM PERFIL"}</strong>.
          Apenas usuários com perfil <strong>GESTOR</strong> podem visualizar relatórios e auditoria.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Área do Gestor — Relatórios e Auditoria</h2>

      <div className="filtro-data">
        <label htmlFor="data-relatorio">Data do relatório diário:</label>
        <input
          id="data-relatorio"
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primario"
          onClick={() => carregarDados(dataFiltro)}
        >
          Atualizar Relatório
        </button>
      </div>

      {erro && <p className="alerta-erro">{erro}</p>}

      {relatorio && (
        <>
          <div className="resumo-grid">
            <div className="resumo-card">
              <span>Emitidas no dia</span>
              <strong>{relatorio.totalEmitidas}</strong>
            </div>
            <div className="resumo-card">
              <span>Atendidas no dia</span>
              <strong>{relatorio.totalAtendidas}</strong>
            </div>
            <div className="resumo-card">
              <span>Não compareceram</span>
              <strong>{relatorio.naoCompareceram}</strong>
            </div>
          </div>

          <h3>Resumo por Prioridade</h3>
          <table className="tabela-relatorio">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Emitidas</th>
                <th>Atendidas</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.porTipo.map((linha) => (
                <tr key={linha.tipo}>
                  <td>{linha.tipo}</td>
                  <td>{linha.emitidas}</td>
                  <td>{linha.atendidas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Auditoria de Senhas</h3>
      {auditoria.length > 0 ? (
        <table className="tabela-relatorio">
          <thead>
            <tr>
              <th>Senha</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Guichê</th>
              <th>Chamadas</th>
            </tr>
          </thead>
          <tbody>
            {auditoria.map((item) => (
              <tr key={item.id}>
                <td>{item.numero}</td>
                <td>{item.tipo}</td>
                <td>{item.estado}</td>
                <td>{item.guiche}</td>
                <td>{item.chamadas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="vazio">Nenhuma senha registrada na auditoria ainda.</p>
      )}
    </section>
  );
}
