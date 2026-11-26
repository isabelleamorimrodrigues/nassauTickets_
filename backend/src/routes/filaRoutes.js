const express = require("express");
const filaController = require("../controllers/filaController");

const router = express.Router();

router.post("/senhas", filaController.emitir);
router.post("/fila/chamar-proxima", filaController.chamarProxima);
router.post("/fila/senhas/:id/chamar-novamente", filaController.chamarNovamente);
router.get("/painel", filaController.painel);router.post("/fila/senhas/:id/iniciar", filaController.iniciar);
router.post("/fila/senhas/:id/finalizar", filaController.finalizar);

module.exports = router;