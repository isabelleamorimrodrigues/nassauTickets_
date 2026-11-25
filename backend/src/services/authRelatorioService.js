const filaService = require("./filaService");

const USUARIOS = [
  {
    id: 1,
    nome: "Atendente Padrão",
    matricula: "ATD01",
    senha: "123",
    perfil: "ATENDENTE"
  },
  {
    id: 2,
    nome: "Gestor Operacional",
    matricula: "GES01",
    senha: "123",
    perfil: "GESTOR"
  }
];

function autenticar(matricula, senha) {
  const mat = String(matricula || "").trim().toUpperCase();
  const pass = String(senha || "").trim();

  const usuario = USUARIOS.find((u) => u.matricula === mat && u.senha === pass);
  if (!usuario) {
    return { erro: "Matrícula ou senha inválida." };
  }

  return {
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      matricula: usuario.matricula,
      perfil: usuario.perfil
    }
  };
}

function listarUsuarios() {
  return USUARIOS.map(({ senha, ...resto }) => resto);
}

function gerarRelatorioDiario(dataIso = new Date().toISOString().slice(0, 10)) {
  const senhas = filaService.senhas || [];
  const doDia = senhas.filter((s) => (s.emitidaEm || "").startsWith(dataIso));

  const porTipo = ["SP", "SE", "SG"].map((tipo) => {
    const grupo = doDia.filter((s) => s.tipo === tipo);
    const atendidas = grupo.filter((s) => s.estado === "ATENDIDA").length;
    return {
      tipo,
      emitidas: grupo.length,
      atendidas
    };
  });

  const totalEmitidas = doDia.length;
  const totalAtendidas = doDia.filter((s) => s.estado === "ATENDIDA").length;
  const naoCompareceram = doDia.filter((s) => s.estado === "NÃO_COMPARECEU").length;

  return {
    data: dataIso,
    totalEmitidas,
    totalAtendidas,
    naoCompareceram,
    porTipo,
    detalhado: doDia.map((s) => ({
      numero: s.numero,
      tipo: s.tipo,
      estado: s.estado,
      emitidaEm: s.emitidaEm,
      guiche: s.estado === "ATENDIDA" ? s.guiche : "",
      atendidoEm: s.estado === "ATENDIDA" ? s.atendidoEm || "" : ""
    }))
  };
}

function gerarRelatorioAuditoria() {
  const senhas = filaService.senhas || [];
  return senhas.map((s) => ({
    id: s.id,
    numero: s.numero,
    tipo: s.tipo,
    estado: s.estado,
    guiche: s.guiche || "-",
    chamadas: s.chamadas || 0,
    emitidaEm: s.emitidaEm,
    ultimaChamadaEm: s.ultimaChamadaEm || "-"
  }));
}

module.exports = {
  autenticar,
  listarUsuarios,
  gerarRelatorioDiario,
  gerarRelatorioAuditoria
};