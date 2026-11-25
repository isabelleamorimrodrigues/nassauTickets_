import { useEffect, useState } from "react";
import "./styles/App.css";
import {
  buscarPainel,
  chamarNovamenteSenha,
  chamarProximaSenha,
  emitirSenha,
  loginUsuario
} from "./services/api";
import TotemCliente from "./components/TotemCliente";
import TerminalAtendente from "./components/TerminalAtendente";
import PainelChamadas from "./components/PainelChamadas";
import LoginModal from "./components/LoginModal";
import AreaGestor from "./components/AreaGestor";

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState("totem");
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [senhaEmitida, setSenhaEmitida] = useState(null);
  const [guiche, setGuiche] = useState("Guichê 01");
  const [chamadaAtual, setChamadaAtual] = useState(null);
  const [ultimasSenhas, setUltimasSenhas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function falarAviso(texto) {
    if ("speechSynthesis" in window && texto) {
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = "pt-BR";
      window.speechSynthesis.speak(fala);
    }
  }

  async function carregarPainel() {
    try {
      const lista = await buscarPainel();
      setUltimasSenhas(lista);
    } catch {
      // Silencia falha momentânea de polling
    }
  }

  useEffect(() => {
    carregarPainel();
    const intervalo = setInterval(carregarPainel, 3000);
    return () => clearInterval(intervalo);
  }, []);

  async function handleLogin(matricula, senha) {
    setErro("");
    setMensagem("");
    try {
      const logado = await loginUsuario(matricula, senha);
      setUsuario(logado);
      setMostrarLogin(false);
      setMensagem(`Bem-vindo(a), ${logado.nome} (${logado.perfil}).`);
      setAbaAtiva(logado.perfil === "GESTOR" ? "gestor" : "atendente");
    } catch (err) {
      setErro(err.message);
    }
  }

  function handleLogout() {
    setUsuario(null);
    setMensagem("Sessão encerrada.");
    if (abaAtiva === "gestor" || abaAtiva === "atendente") {
      setAbaAtiva("totem");
    }
  }

  function abrirAbaRestrita(destino) {
    setErro("");
    if (!usuario) {
      setMostrarLogin(true);
      return;
    }
    setMostrarLogin(false);
    setAbaAtiva(destino);
  }

  async function handleEmitir(tipo) {
    setErro("");
    setMensagem("");
    try {
      const novaSenha = await emitirSenha(tipo);
      setSenhaEmitida(novaSenha);
      setMensagem(`Senha ${novaSenha.numero} emitida com sucesso.`);
      carregarPainel();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleChamarProxima(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    try {
      const resultado = await chamarProximaSenha(guiche);
      setChamadaAtual(resultado.senha);
      setMensagem(resultado.audio);
      falarAviso(resultado.audio);
      carregarPainel();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleChamarNovamente() {
    if (!chamadaAtual) return;
    setErro("");
    setMensagem("");
    try {
      const resultado = await chamarNovamenteSenha(chamadaAtual.id);
      setChamadaAtual(resultado.senha);
      setMensagem(resultado.audio);
      falarAviso(resultado.audio);
      carregarPainel();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <main className="container">
      <header className="topo topo-flex">
        <div>
          <h1>nassauTickets</h1>
          <p>Laboratório de Análises Clínicas — Controle de Atendimento</p>
        </div>

        <div className="sessao-box">
          {usuario ? (
            <>
              <span>
                <strong>{usuario.nome}</strong> ({usuario.perfil})
              </span>
              <button className="btn btn-neutro" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <button className="btn btn-primario" onClick={() => setMostrarLogin(true)}>
              Login Equipe
            </button>
          )}
        </div>
      </header>

      <nav className="tabs">
        <button
          className={abaAtiva === "totem" && !mostrarLogin ? "tab ativa" : "tab"}
          onClick={() => {
            setMostrarLogin(false);
            setAbaAtiva("totem");
          }}
        >
          Totem (Cliente)
        </button>
        <button
          className={abaAtiva === "atendente" && !mostrarLogin ? "tab ativa" : "tab"}
          onClick={() => abrirAbaRestrita("atendente")}
        >
          Terminal do Atendente
        </button>
        <button
          className={abaAtiva === "painel" && !mostrarLogin ? "tab ativa" : "tab"}
          onClick={() => {
            setMostrarLogin(false);
            setAbaAtiva("painel");
          }}
        >
          Painel de Chamadas
        </button>
        <button
          className={abaAtiva === "gestor" && !mostrarLogin ? "tab ativa" : "tab"}
          onClick={() => abrirAbaRestrita("gestor")}
        >
          Área do Gestor
        </button>
      </nav>

      {erro && <p className="alerta-erro">{erro}</p>}
      {mensagem && <p className="alerta-sucesso">{mensagem}</p>}

      {mostrarLogin ? (
        <LoginModal
          onLogin={handleLogin}
          onCancelar={() => {
            setMostrarLogin(false);
            setErro("");
          }}
        />
      ) : (
        <>
          {abaAtiva === "totem" && (
            <TotemCliente onEmitir={handleEmitir} senhaEmitida={senhaEmitida} />
          )}

          {abaAtiva === "atendente" && (
            <TerminalAtendente
              guiche={guiche}
              setGuiche={setGuiche}
              chamadaAtual={chamadaAtual}
              onChamarProxima={handleChamarProxima}
              onChamarNovamente={handleChamarNovamente}
            />
          )}

          {abaAtiva === "painel" && <PainelChamadas ultimasSenhas={ultimasSenhas} />}

          {abaAtiva === "gestor" && <AreaGestor usuario={usuario} />}
        </>
      )}
    </main>
  );
}