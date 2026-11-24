const express = require("express");
const filaController = require("../controllers/filaController");

const router = express.Router();

router.post("/senhas", filaController.emitir);
router.post("/fila/chamar-proxima", filaController.chamarProxima);
router.post("/fila/senhas/:id/chamar-novamente", filaController.chamarNovamente);
router.get("/painel", filaController.painel);

module.exports = router;