# Requisitos do Sistema — nassauTickets

## 1. Visão Geral e Agentes
O **nassauTickets** é um sistema de controle de atendimento para um Laboratório de Análises Clínicas[cite: 1, 13].

- **AS (Agente Sistema):** executa as ações do sistema, comunica-se com o banco de dados e demais infraestruturas, emite senhas, atualiza o painel e responde aos comandos dos demais agentes[cite: 3, 13].
- **AA (Agente Atendente):** responsável por chamar o próximo cliente e realizar o atendimento no guichê[cite: 3, 13]. Um único atendente possui perfil adicional de **gestor**, responsável por cadastros e relatórios[cite: 6, 17].
- **AC (Agente Cliente):** interage de forma anônima por meio do totem para emitir senha e aguarda a chamada no painel[cite: 4, 6, 13].

## 2. Tipos de Senha e Numeração
- **SP:** Senha Prioritária[cite: 4, 14].
- **SG:** Senha Geral[cite: 4, 16].
- **SE:** Senha para retirada de Exames[cite: 4, 14].
- **Padrão de numeração:** `YYMMDD-PPSQ`, onde `YY` é o ano (2 dígitos), `MM` é o mês (2 dígitos), `DD` é o dia (2 dígitos), `PP` é o tipo da senha (2 caracteres) e `SQ` é a sequência por prioridade (3 dígitos) com reinício diário[cite: 4, 16].

## 3. Regras de Negócio e Atendimento
- **Priorização:** segue a ordem $[SP] \rightarrow [SE|SG] \rightarrow [SP] \rightarrow [SE|SG]$ (após SP, quando disponível, entra SE quando disponível e depois SG)[cite: 4, 15].
- **Guichês:** qualquer guichê pode atender qualquer tipo de senha[cite: 4, 16].
- **Expediente:** ocorre das **7h às 17h**[cite: 4, 15]. Atendimentos já iniciados devem ser concluídos e encerrados pelo AA; senhas que sobrarem na fila ao final do expediente são descartadas[cite: 4, 15].
- **Não comparecimento:** após duas chamadas sem comparecimento ao guichê, o sistema avança para a próxima prioridade e marca a senha como `NÃO_COMPARECEU`[cite: 4, 5, 16, 18]. Historicamente, cerca de 5% das senhas emitidas não são atendidas[cite: 4, 16].

## 4. Painel, Máquina de Estados e Relatórios
- **Painel de chamadas:** exibe as **5 últimas senhas chamadas** e não exibe a próxima senha[cite: 4, 5, 15]. Inclui áudio na chamada (prioridade, senha e guichê) e, no **Chamar Novamente**, repete o áudio precedido por `"Última chamada"`[cite: 6, 17].
- **Máquina de estados:** `EMITIDA` $\rightarrow$ `AGUARDANDO` $\rightarrow$ `CHAMADA` $\rightarrow$ `CHAMADA_NOVAMENTE` $\rightarrow$ `EM_ATENDIMENTO` $\rightarrow$ `ATENDIDA`, além de `NÃO_COMPARECEU`[cite: 5, 17, 18].
- **Relatórios (diário e mensal):** contemplam quantitativo geral e por prioridade de senhas emitidas e atendidas, relatório detalhado (campos de atendimento em branco quando não atendida), tempo médio de atendimento (TM) e relatório de auditoria (atendente, guichê, senha, horários da 1ª chamada, 2ª chamada se houver, início e finalização)[cite: 5, 6, 16, 17].

## 5. Requisitos Não Funcionais e Desafios
- **Concorrência:** tratamento quando dois ou mais AA chamam a próxima senha quase ao mesmo tempo[cite: 6, 17].
- **Disponibilidade e falhas:** comportamento do frontend e do painel diante de falhas do backend ou do banco de dados[cite: 6, 18].
- **Segurança, auditoria, desempenho, LGPD e acessibilidade:** autenticação para AA/gestor, registro de eventos, anonimato do AC no totem e recursos como aviso sonoro[cite: 3, 6, 17, 18].