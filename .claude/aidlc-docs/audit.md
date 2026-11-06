# Registro de uso de IA (audit)

> Escrito para: InfoSec e auditoria ISO 27001. Cada passo com IA neste projeto entra aqui, conforme a regra "no shadow AI" da política de guardrails.

| Data | Fase | Quem gerou | O que foi gerado | Revisão humana | Estado |
|------|------|-----------|------------------|----------------|--------|
| 2026-11-06 | Inception | Claude (Haiku 5.5), a pedido de Alison Duarte | `aidlc-docs/` (intenção, requisitos, histórias, unidades, arquitetura, perguntas), `CLAUDE.md` reescrito, `README.md` da raiz com diagrama | Pendente | Rascunho, não aprovado (G1 a G3 abertos) |
| 2026-11-06 | Construção U1 a U4 (local) | Claude (Haiku 5.5), a pedido de Alison Duarte | `firebase/` (regras do Firestore, configuração, 21 testes de regras no emulador); outbox local, sincronização, adaptadores Firebase lazy, login da equipe, painel e CSV na nuvem, testes do app (69) e guardrails novos; `app/.env.example`; `overrides` de segurança para `@grpc/grpc-js` e `uuid` | Pendente | Construído e verificado localmente. Não implantado. Nenhum projeto Firebase real conectado. G4 (InfoSec) aberto |
| 2026-11-06 | Construção, verificação | Claude (Haiku 5.5) | Build de produção, orçamento de bundle (12,7 kB gzip de entrada), auditoria do app (0 vulnerabilidades), auditoria do `firebase/` (0 altas, 14 moderadas em ferramentas de desenvolvimento), smoke test no Chrome com o build de produção e a CSP | Pendente | Fluxo local verificado. Não verificado em iPad real (U6) |
| 2026-11-06 | Mudança de escopo | Claude (Haiku 5.5), a pedido de Alison Duarte | Firebase removido por completo (`firebase/`, dependências, regras, adaptadores, CSP e orçamento). Login da equipe como porta de entrada do quiz, com contas por hash PBKDF2 (`staff-accounts.js`, `scripts/staff-account.mjs`). Dados e CSV de volta ao `localStorage`. Especificação reescrita. | Pendente | Construído e testado localmente (66 testes, verify verde). Smoke test no Chrome com conta temporária, depois removida. Não publicado. G4 aberto |
| 2026-11-06 | Conteúdo do quiz | Claude (Haiku 5.5), a pedido de Alison Duarte, a partir do deck enviado pelo usuário | Perguntas avançadas Q6 e Q7 (PT e EN) em `questions.js`; Q15 respondida em `06-open-questions.md` | Pendente | Escritas e verificadas (66 testes, verify verde). Revisão do dono do produto e confirmação de uso público do conteúdo do deck pendentes |
| 2026-11-06 | Respostas do dono do produto | Claude (Haiku 5.5), a pedido de Alison Duarte | Pontuação escalada para 7 perguntas (faixas 6.300 e 11.200, `scoring.js`); aviso de exportação antes de apagar (`hasUnexportedRecords`, `local-export-log.js`); minuta de consentimento e privacidade em PT e EN (`messages`); DoD 1.6 atualizado | Pendente | Verify verde (67 testes). Minuta de consentimento não aprovada pelo jurídico. Q1 registrada com possível divergência (opção B) |
| 2026-11-06 | Decisão do dono do produto | Claude (Haiku 5.5), a pedido de Alison Duarte | Revisão jurídica do consentimento dispensada; anonimização dos dados não exigida neste momento. Atualizados CLAUDE.md, DoD 6.6 e skill event-operations | Pendente | Texto de consentimento aprovado pelo dono do produto. Reavaliar anonimização se o escopo mudar |
| 2026-11-06 | Data do evento | Claude (Haiku 5.5), a pedido de Alison Duarte | Evento em 07/11/2026; prazo de apagamento 09/11/2026. Q14 desconsiderada. Runbook atualizado | Pendente | Publicação e testes no iPad ainda não confirmados; ver prazo |

## Regras de registro

- Cada linha corresponde a uma sessão ou a um artefato entregue.
- "Revisão humana" fica "Pendente" até uma pessoa nomeada revisar e aprovar o artefato. Só então o portão correspondente é fechado em [README.md](README.md).
- Não registrar dados de participantes, senhas ou identificadores de projeto Firebase neste arquivo.

> Este conteúdo foi gerado por IA. Requer revisão humana por pessoas e varredura SAST/DAST antes de qualquer implantação.
