const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function emitirSenha(tipo) {
  const resposta = await fetch(`${API_URL}/senhas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo })
  });
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao emitir senha.");
  }
  return dados;
}

export async function chamarProximaSenha(guiche) {
  const resposta = await fetch(`${API_URL}/fila/chamar-proxima`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guiche })
  });
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao chamar próxima senha.");
  }
  return dados;
}

export async function chamarNovamenteSenha(id) {
  const resposta = await fetch(`${API_URL}/fila/senhas/${id}/chamar-novamente`, {
    method: "POST"
  });
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao chamar novamente.");
  }
  return dados;
}

export async function buscarPainel() {
  const resposta = await fetch(`${API_URL}/painel`);
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao carregar o painel.");
  }
  return dados.ultimasSenhas || [];
}

export async function loginUsuario(matricula, senha) {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricula, senha })
  });
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Falha ao realizar login.");
  }
  return dados.usuario;
}

export async function buscarRelatorioDiario(data = "") {
  const query = data ? `?data=${encodeURIComponent(data)}` : "";
  const resposta = await fetch(`${API_URL}/gestao/relatorios/diario${query}`);
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao carregar relatório diário.");
  }
  return dados;
}

export async function buscarAuditoria() {
  const resposta = await fetch(`${API_URL}/gestao/relatorios/auditoria`);
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao carregar auditoria.");
  }
  return dados.registros || [];
}
export async function iniciarAtendimento(id, guiche) {
  const resposta = await fetch(`${API_URL}/fila/senhas/${id}/iniciar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guiche })
  });
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao iniciar atendimento.");
  }
  return dados;
}

export async function finalizarAtendimento(id) {
  const resposta = await fetch(`${API_URL}/fila/senhas/${id}/finalizar`, {
    method: "POST"
  });
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao finalizar atendimento.");
  }
  return dados;
}