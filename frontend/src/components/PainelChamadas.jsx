export default function PainelChamadas({ ultimasSenhas }) {
  const destaque = ultimasSenhas[0] || null;

  return (
    <section className="card">
      <h2>Painel de Chamadas</h2>

      {destaque ? (
        <div className="painel-destaque">
          <span>Senha Atual</span>
          <strong>{destaque.numero}</strong>
          <p>
            Prioridade: {destaque.tipo} — <strong>{destaque.guiche}</strong>
          </p>
        </div>
      ) : (
        <p className="vazio">Aguardando primeira chamada do dia.</p>
      )}

      <h3>Últimas 5 Senhas Chamadas</h3>
      {ultimasSenhas.length > 0 ? (
        <ul className="lista-painel">
          {ultimasSenhas.map((item) => (
            <li key={item.id} className="item-painel">
              <strong>{item.numero}</strong>
              <span>Tipo: {item.tipo}</span>
              <span>{item.guiche}</span>
              <span className="badge">{item.estado}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vazio">Nenhuma senha registrada no painel.</p>
      )}
    </section>
  );
}