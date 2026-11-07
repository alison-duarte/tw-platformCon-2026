# 04 Unidades e bolts

> Escrito para: desenvolvimento e produto. Estado: rascunho, aguarda G3.

No AI-DLC, a unidade de trabalho substitui o épico, e o bolt (ciclo curto e intenso) substitui a sprint.

## Unidades

| ID | Unidade | Entrega | Estado |
|----|---------|---------|--------|
| U1 | Acesso da equipe | Login gate, contas por hash, limite de tentativas, sessão que sobrevive ao recarregamento, "Sair" | Construída e testada localmente |
| U2 | Dados no iPad | Repositório no `localStorage`, CSV, apagar tudo, aviso de falha ao salvar, sem nuvem | Construída e testada localmente (mesma base de antes, sem nuvem) |
| U3 | Publicação e verificação no iPad | Aprovação da InfoSec (Q1), texto de consentimento (Q7), retenção (Q9), runbook, teste real em iPad | Pendente, depende de respostas |
| U4 | Placar | Projeção pura de nome e pontuação, tela de placar (equipe e, se Q17 pedir, público), importação de dois CSV e mescla (Q18, decidida) | Construída localmente (Q17, Q18, Q18b e Q19 respondidas). Testes e `npm run verify` verdes. Não verificada no navegador nem no iPad |

## Ordem e bolts

| Bolt | Unidades | Saída verificável |
|------|----------|-------------------|
| B1 | U1 e U2 | `npm run verify` verde; smoke test no Chrome com o build de produção: login, jogo sem novo login, sair, CSV |
| B2 | U3 (documentos e InfoSec) | Aprovação de Q1 e Q2 registrada; texto de consentimento aprovado |
| B3 | U3 (iPad) | Checklist de iPad preenchido por uma pessoa, com data e aparelho |
| B4 | U4 (placar) | Respostas de Q17 a Q20 registradas; `npm run verify` verde; teste de projeção (sem e-mail nem telefone); smoke test no Chrome com sessão da equipe e com o placar vazio |

B4 depende de B1. Não depende de B2 e B3 para o desenvolvimento, mas o placar público só vai ao ar com a publicação aprovada.

Nenhum bolt entra em produção sem `npm run verify` verde e sem a aprovação da InfoSec para publicar.

## Como as contas são criadas (U1)

Não há tela de cadastro. Cada conta é gerada na máquina de quem mantém o projeto:

```bash
read -s PW && printf '%s' "$PW" | npm run account:new -- <email> "Equipe 1"
```

O script imprime uma entrada com salt e hash. Cole-a em `app/src/content/staff-accounts.js`. A senha precisa de 12 caracteres ou mais.

## Critérios de pronto

Além de [DEFINITION_OF_DONE.md](../../.claude/skills/DEFINITION_OF_DONE.md):

- **U1:** teste de login válido, inválido e bloqueado; teste de sessão após recarregamento; teste de que duas rodadas não pedem login; teste de que sem contas ninguém entra; smoke test no navegador.
- **U2:** teste de CSV com todas as linhas e o formato de hoje; teste de apagar tudo; teste de falha de salvamento.
- **U3:** aprovação da InfoSec registrada, texto de consentimento aprovado, checklist de iPad preenchido.
