const express = require("express");
const gestaoController = require("../controllers/gestaoController");

const router = express.Router();

router.post("/auth/login", gestaoController.login);
router.get("/gestao/usuarios", gestaoController.usuarios);
router.get("/gestao/relatorios/diario", gestaoController.relatorioDiario);
router.get("/gestao/relatorios/auditoria", gestaoController.auditoria);

module.exports = router;