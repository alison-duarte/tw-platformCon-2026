# Especificação AI-DLC: quiz de engenharia de plataforma e AI

Esta pasta é a especificação viva do projeto, feita com o método AI-DLC (AI-Driven Development Lifecycle, da AWS). A IA rascunha os artefatos, e a equipe valida cada um em um portão antes de a construção começar.

> Escrito para: equipe de produto, InfoSec e desenvolvimento do estande.

## Escopo atual

Site estático (SPA) com dados só no `localStorage` do iPad, login da equipe antes do quiz, e CSV exportado do `localStorage`. Sem Firebase e sem nuvem. A versão com Firebase foi removida em 2026-11-06.

## Como ler

| Ordem | Arquivo | Pergunta que responde |
|-------|---------|----------------------|
| 1 | [inception/01-intent.md](inception/01-intent.md) | Por que estamos fazendo isto e o que é sucesso? |
| 2 | [inception/02-requirements.md](inception/02-requirements.md) | O que o sistema deve fazer e com quais restrições? |
| 3 | [inception/03-user-stories.md](inception/03-user-stories.md) | Como cada pessoa usa o sistema, com critérios de aceite? |
| 4 | [inception/04-units-and-bolts.md](inception/04-units-and-bolts.md) | Em que ordem construir, em quais pedaços? |
| 5 | [inception/05-architecture.md](inception/05-architecture.md) | Como a SPA, o login e o `localStorage` se relacionam? |
| 6 | [inception/06-open-questions.md](inception/06-open-questions.md) | O que precisa de decisão ou resposta antes de publicar? |
| 7 | [inception/07-advanced-content.md](inception/07-advanced-content.md) | De qual slide do deck vem cada pergunta avançada, e o que vai além do deck? |
| - | [audit.md](audit.md) | Quem gerou o quê, quando, e quem aprovou. |

## Portões (gates)

| Portão | Artefato | Estado | Bloqueado por |
|--------|----------|--------|---------------|
| G1 Intenção aprovada | `01-intent.md` | Rascunho | Aprovação do dono do produto |
| G2 Requisitos aprovados | `02-requirements.md`, `03-user-stories.md` | Rascunho | Respostas de [06-open-questions.md](inception/06-open-questions.md) |
| G3 Unidades aprovadas | `04-units-and-bolts.md`, `05-architecture.md` | Rascunho | G2 |
| G4 Publicação aprovada | Site público e dados no iPad | Não iniciado | Aprovação da InfoSec (Q1 e Q2) |
| G5 Construção por unidade | Código e testes da unidade | U1 e U2 construídas localmente | G3 para publicar |

## Ciclo de construção (por unidade)

Cada unidade segue: design funcional, verificação de requisitos não funcionais, geração de código, build e testes (`npm run verify`), e smoke test no navegador para o que toca a tela.
