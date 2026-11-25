import { useState } from "react";

export default function LoginModal({ onLogin, onCancelar }) {
  const [matricula, setMatricula] = useState("GES01");
  const [senha, setSenha] = useState("123");

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(matricula, senha);
  }

  return (
    <section className="card">
      <h2>Acesso Restrito — Atendente / Gestor</h2>
      <p className="subtitulo">
        O Totem do Cliente continua anônimo. Informe sua matrícula e senha para acessar.
      </p>

      <form className="form-login" onSubmit={handleSubmit}>
        <label htmlFor="matricula">Matrícula:</label>
        <input
          id="matricula"
          type="text"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Ex.: GES01 ou ATD01"
          required
        />

        <label htmlFor="senha">Senha:</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          required
        />

        <div className="acoes-login">
          <button type="submit" className="btn btn-primario">
            Entrar
          </button>
          <button type="button" className="btn btn-neutro" onClick={onCancelar}>
            Voltar ao Totem
          </button>
        </div>
      </form>

      <small className="dica-teste">
        Teste rápido: Gestor = <strong>GES01</strong> / <strong>123</strong> | Atendente ={" "}
        <strong>ATD01</strong> / <strong>123</strong>
      </small>
    </section>
  );
}