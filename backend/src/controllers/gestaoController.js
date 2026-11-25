const authRelatorioService = require("../services/authRelatorioService");

function login(req, res) {
  const { matricula, senha } = req.body;
  const resultado = authRelatorioService.autenticar(matricula, senha);

  if (resultado.erro) {
    return res.status(401).json({ erro: resultado.erro });
  }

  return res.status(200).json(resultado);
}

function usuarios(req, res) {
  return res.status(200).json({ usuarios: authRelatorioService.listarUsuarios() });
}

function relatorioDiario(req, res) {
  const { data } = req.query;
  return res.status(200).json(authRelatorioService.gerarRelatorioDiario(data));
}

function auditoria(req, res) {
  return res.status(200).json({ registros: authRelatorioService.gerarRelatorioAuditoria() });
}

module.exports = {
  login,
  usuarios,
  relatorioDiario,
  auditoria
};