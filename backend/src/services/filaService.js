const TIPOS_VALIDOS = ["SP", "SE", "SG"];

const ESTADOS = {
  EMITIDA: "EMITIDA",
  AGUARDANDO: "AGUARDANDO",
  CHAMADA: "CHAMADA",
  CHAMADA_NOVAMENTE: "CHAMADA_NOVAMENTE",
  EM_ATENDIMENTO: "EM_ATENDIMENTO",
  ATENDIDA: "ATENDIDA",
  NAO_COMPARECEU: "NÃO_COMPARECEU"
};

class FilaService {
  constructor() {
    this.senhas = [];
    this.sequenciaPorDiaTipo = {};
    this.ultimoTipoChamado = null;
  }

  dentroDoExpediente(data = new Date()) {
    const totalMinutos = data.getHours() * 60 + data.getMinutes();
    const inicioExpediente = 7 * 60; // 07:00
    const fimExpediente = 17 * 60; // 17:00
    return totalMinutos >= inicioExpediente && totalMinutos <= fimExpediente;
  }

  formatarDataYYMMDD(data = new Date()) {
    const yy = String(data.getFullYear()).slice(-2);
    const mm = String(data.getMonth() + 1).padStart(2, "0");
    const dd = String(data.getDate()).padStart(2, "0");
    return `${yy}${mm}${dd}`;
  }

  gerarNumeroSenha(tipo, data = new Date()) {
    const prefixo = this.formatarDataYYMMDD(data);
    const chave = `${prefixo}-${tipo}`;
    const proximoNumero = (this.sequenciaPorDiaTipo[chave] || 0) + 1;
    this.sequenciaPorDiaTipo[chave] = proximoNumero;
    const sq = String(proximoNumero).padStart(3, "0");
    return `${prefixo}-${tipo}${sq}`;
  }

  emitirSenha(tipoInformado) {
    const tipo = String(tipoInformado || "").toUpperCase();

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return { erro: "Tipo de senha inválido. Use SP, SE ou SG." };
    }

    if (!this.dentroDoExpediente()) {
      return { erro: "Fora do horário de expediente (07:00 às 17:00)." };
    }

    const agora = new Date();
    const senha = {
      id: this.senhas.length + 1,
      numero: this.gerarNumeroSenha(tipo, agora),
      tipo,
      estado: ESTADOS.AGUARDANDO,
      emitidaEm: agora.toISOString(),
      chamadas: 0,
      guiche: null,
      atendidoEm: null
    };

    this.senhas.push(senha);
    return { senha };
  }

  escolherProximaSenha() {
    const aguardando = (tipo) =>
      this.senhas.find((s) => s.tipo === tipo && s.estado === ESTADOS.AGUARDANDO);

    // Regra [SP] -> [SE|SG] -> [SP] -> [SE|SG]
    if (this.ultimoTipoChamado === "SP") {
      return aguardando("SE") || aguardando("SG") || aguardando("SP") || null;
    }

    return aguardando("SP") || aguardando("SE") || aguardando("SG") || null;
  }

  chamarProxima(guiche) {
    if (!guiche || !String(guiche).trim()) {
        return { erro: "Informe um guichê válido." };
    }

    const proxima = this.escolherProximaSenha();
    if (!proxima) {
      return { erro: "Não há senhas aguardando na fila." };
    }

    const agora = new Date().toISOString();
    proxima.estado = ESTADOS.CHAMADA;
    proxima.chamadas = 1;
    proxima.guiche = guiche;
    proxima.primeiraChamadaEm = agora;
    proxima.ultimaChamadaEm = agora;
    this.ultimoTipoChamado = proxima.tipo;

    return {
      senha: proxima,
      audio: `Senha ${proxima.numero}, prioridade ${proxima.tipo}, dirija-se ao guichê ${guiche}.`
    };
  }

  chamarNovamente(idSenha) {
    const senha = this.senhas.find((s) => s.id === Number(idSenha));
    if (!senha) {
      return { erro: "Senha não encontrada." };
    }

    if (senha.chamadas >= 2) {
      senha.estado = ESTADOS.NAO_COMPARECEU;
      return {
        erro: "Limite de chamadas atingido. Senha marcada como NÃO_COMPARECEU.",
        senha
      };
    }

    const agora = new Date().toISOString();
    senha.chamadas += 1;
    senha.estado = ESTADOS.CHAMADA_NOVAMENTE;
    senha.segundaChamadaEm = agora;
    senha.ultimaChamadaEm = agora;

    return {
      senha,
      audio: `Última chamada: senha ${senha.numero}, prioridade ${senha.tipo}, guichê ${senha.guiche}.`
    };
  }

  painelUltimasCinco() {
    return this.senhas
      .filter((s) => s.chamadas > 0 && s.ultimaChamadaEm)
      .sort((a, b) => new Date(b.ultimaChamadaEm) - new Date(a.ultimaChamadaEm))
      .slice(0, 5);
  }
}

module.exports = new FilaService();