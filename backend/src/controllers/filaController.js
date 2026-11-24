const filaService = require("../services/filaService");

function emitir(req, res) {
  const { tipo } = req.body;
  const resultado = filaService.emitirSenha(tipo);

  if (resultado.erro) {
    return res.status(400).json({ erro: resultado.erro });
  }

  return res.status(201).json(resultado.senha);
}

function chamarProxima(req, res) {
  const { guiche } = req.body;
  const resultado = filaService.chamarProxima(guiche);

  if (resultado.erro) {
    return res.status(400).json({ erro: resultado.erro });
  }

  return res.status(200).json(resultado);
}

function chamarNovamente(req, res) {
  const { id } = req.params;
  const resultado = filaService.chamarNovamente(id);

  if (resultado.erro) {
    return res.status(400).json({ erro: resultado.erro });
  }

  return res.status(200).json(resultado);
}

function painel(req, res) {
  const ultimasSenhas = filaService.painelUltimasCinco();
  return res.status(200).json({ ultimasSenhas });
}

module.exports = {
  emitir,
  chamarProxima,
  chamarNovamente,
  painel
};
