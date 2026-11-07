# 07 Conteúdo avançado: fontes das perguntas

> Escrito para: dono do produto e revisão de conteúdo. Estado: textos fornecidos pelo dono do produto; revisão de fontes feita pelo desenvolvimento.

Toda pergunta avançada (`difficulty: 'advanced'` em `app/src/content/questions.js`) precisa de uma linha nesta tabela. O teste `app/tests/advanced-content.test.js` falha se uma pergunta avançada não estiver listada.

Fonte: deck "Engineering platform, a key to maximize engineering effectiveness" (GLOBAL, © 2022 Thoughtworks). Os números dos slides seguem a ordem do PDF.

## Regras

1. A explicação cita ou parafraseia os slides indicados.
2. Qualquer afirmação que não esteja no deck vai na coluna "Além do deck", para que o dono do produto a aprove de forma explícita.
3. A resposta correta segue a regra de letras de `quiz.md` (sem letra mais de duas vezes, sem repetir em perguntas seguidas).

## Tabela

| Pergunta | Foco | Resposta | Slides do deck | Além do deck |
|----------|------|----------|----------------|--------------|
| Q6 | Arquitetura & divisão de papéis | B | 34 (habilidades que os times de aplicação precisam), 35 (modelo de responsabilidade compartilhada em prática: tolerância a falhas da aplicação e migração de banco no time de aplicação; node scaling e orquestração de containers no time de DI) | Opção C mistura "executors" (DI, slide 35) com "pipeline orchestration" (time de aplicação, slide 35). Pode ser lida como parcialmente correta. Revisar antes de publicar |
| Q7 | DevSecOps & automação de políticas | D | 6 (interfaces baseadas em tickets prendem os desenvolvedores a atividades manuais), 13 (policy as code), 29 (guardrails e automação de governança no caminho para produção), 60 (governança com fitness functions e alertas, shift-left), 77 (policy as code com ferramentas como OPA) | "Admission controllers" não aparece no deck. O deck cita OPA e fitness functions. Termo mantido a pedido do dono do produto |

## Status

- Q6 e Q7: textos fornecidos pelo dono do produto, em PT e EN. Pendente: decisão sobre a ambiguidade da opção C de Q6 e sobre o termo "admission controllers" em Q7.
- Pergunta básica Q5 (Backstage) não faz parte desta tabela. Sua explicação cita "esteiras de IA" e "criado pelo Spotify", que não estão no deck. Revisar à parte.
