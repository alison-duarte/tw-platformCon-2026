# 02 Requisitos

> Escrito para: desenvolvimento, produto e InfoSec. Estado: rascunho, aguarda G2 (respostas em [06-open-questions.md](06-open-questions.md)).

Os itens do quiz (perguntas, pontuação, cronômetro, pop-up, resultado) **não mudam** e continuam valendo como estão em `.claude/skills/quiz.md`. Esta lista cobre o que é novo ou muda.

## 1. Requisitos funcionais

| ID | Requisito | Critério de aceite |
|----|-----------|--------------------|
| FR-01 | Ao abrir o site sem sessão da equipe, a primeira tela é o **login** | Nenhum cadastro, quiz ou painel aparece antes do login |
| FR-02 | O login pede e-mail e senha, e valida contra as duas contas configuradas | Só uma das duas contas libera o quiz. Sem contas configuradas, ninguém entra |
| FR-03 | Erro de login é genérico ("E-mail ou senha inválidos.") e não diz qual campo está errado | Teste: e-mail desconhecido e senha errada geram a mesma mensagem |
| FR-04 | Após 5 erros seguidos, o login fica bloqueado por 30 segundos, com contagem na mensagem | Teste com relógio controlado. O acerto também espera o bloqueio |
| FR-05 | Campo de senha é limpo após cada tentativa e a senha nunca é guardada | Teste de interface e revisão de código |
| FR-06 | Com login validado, o quiz roda sem nova tela de login, do cadastro até o fim, quantas rodadas forem | Teste: duas rodadas seguidas sem tela de login (sem expiração, Q8) |
| FR-07 | A sessão da equipe fica no `localStorage` e sobrevive a recarregar a página | Teste de navegador: recarregar mantém o quiz liberado |
| FR-08 | Só "Sair", no painel da equipe, encerra a sessão e volta ao login | Após sair, recarregar a página pede o login de novo |
| FR-09 | Cada resultado é salvo no `localStorage` (`tw-platform-quiz:v1:participants`), como hoje | Teste de repositório: sobrevive ao recarregamento |
| FR-10 | Falha ao salvar é mostrada ao participante, nunca silenciosa | Regra 2.2 existente |
| FR-11 | Painel da equipe (long-press de 1,5 s no logo) só abre com sessão válida | Sem sessão, o long-press não abre nada |
| FR-12 | Painel lista participantes com pontuação e horário. Não mostra e-mail nem telefone | Regra 2.4 existente |
| FR-13 | "Exportar CSV (.csv)" baixa **todos** os registros do `localStorage`, uma linha por participante | Mesmas colunas, ordem, BOM UTF-8 e CRLF de hoje |
| FR-14 | "Apagar todos os dados" exige dois toques e apaga só o `localStorage` deste iPad. Inclui as linhas importadas para o placar (chave própria) | Regra 2.7 existente; teste em `leaderboard-app.test.js` |
| FR-15 | O tempo por pergunta continua em `QUESTION_TIME_SECONDS` | Nenhum valor fixo em tela ou texto |
| FR-16 | O cadastro e o consentimento obrigatório continuam como hoje | Texto de consentimento só muda após revisão jurídica (Q7) |

## 2. Requisitos não funcionais

| ID | Categoria | Requisito |
|----|-----------|-----------|
| NFR-01 | Segurança | Nenhuma senha em texto no repositório, nos testes ou nos logs. Só o salt e o hash PBKDF2 (SHA-256, 600 mil iterações) das contas ficam no código |
| NFR-02 | Segurança | Sem serviço externo, sem script remoto, sem fonte remota. A CSP continua `default-src 'self'` com `connect-src 'self'` |
| NFR-03 | Segurança | A limitação do login em site público é registrada (Q2) e não é apresentada como proteção forte |
| NFR-04 | Privacidade | Dados só no navegador do iPad. Nenhum envio de dados pela rede |
| NFR-05 | Privacidade | Coleta mínima: os campos de hoje. Retenção definida (Q9) e apagamento documentado |
| NFR-06 | Resiliência | O quiz funciona sem internet, porque não depende dela |
| NFR-07 | Desempenho | Tela inicial dentro de 40 kB gzip de JS (o login é código da entrada e precisa caber) |
| NFR-08 | Acessibilidade | Campos com rótulo, erro com `role="alert"`, alvos de toque de 48 px |
| NFR-09 | Movimento | Tudo que anima respeita `prefers-reduced-motion` |
| NFR-10 | Qualidade | Testes de acesso, dados e CSV sem rede e sem navegador. Teste de arquitetura continua verde |
| NFR-11 | Governança | Cada passo de IA registrado em [../audit.md](../audit.md) |

## 3. Restrições técnicas

- Vite e JavaScript puro, sem framework de interface (regra existente).
- Sem Firebase, sem servidor próprio e sem nuvem.
- Hospedagem: GitHub Pages (Q4), com o pipeline de `verify` existente.
- iPad com Safari (`target: safari15`). A verificação de senha usa WebCrypto, disponível em HTTPS.
- Dependências novas exigem justificativa escrita no pull request e `npm audit` limpo.

## 4. Lacunas do repositório atual

| Lacuna | Onde | Ação |
|--------|------|------|
| `.harness/pipeline.yaml` citado, mas não existe | `app/README.md`, `quiz.md`, `DEFINITION_OF_DONE.md` 7.5 | Atualizar as referências para `.github/workflows/ci.yml` |
| `PUBLISHING.md` ainda não existe | Skill `publish-github-pages` | Criado somente após a aprovação da InfoSec (Q1) |
| Teste real em iPad não feito | `DEFINITION_OF_DONE.md` 5.5 | Unidade U3 |
| SAST/DAST não configurado | `DEFINITION_OF_DONE.md` 6.8 | Escopo a combinar com a InfoSec |
| `quiz.md` e Definition of Done ainda citam nuvem em alguns pontos | `.claude/skills/` | Revisar na U3 |
| `quiz.md` seção 3 e DoD 1.7 proíbem placar na tela de resultado | `.claude/skills/` | Mantidos. O placar é outra tela. Atualizar só se o placar for aprovado (seção 5) |

## 5. Placar (em revisão, aguarda Q17 a Q20)

> Estado: Q17 a Q19 e Q18b respondidas em 2026-11-07 (placar só para a equipe, com nome, sobrenome e pontuação). Construído localmente, aguarda revisão humana e teste no navegador e no iPad.

O placar mostra quem jogou e a pontuação, ordenados. Os dados vêm dos resultados que já existem no `localStorage` deste iPad (ou de um CSV importado, se Q18 pedir). Nada muda na coleta: nenhum campo novo é pedido ao participante.

| ID | Requisito | Critério de aceite |
|----|-----------|--------------------|
| FR-17 | Cada linha do placar mostra só **nome e sobrenome** e a **pontuação** | Teste de projeção: a saída não contém e-mail, telefone, empresa, cargo, precisão, horário nem idioma |
| FR-18 | Ordem por pontuação, do maior para o menor. Empate: o resultado mais antigo fica primeiro | Teste de domínio com empates e com um único participante |
| FR-19 | O nome exibido segue a regra de Q19 (primeiro e último nome, capitalização corrigida na tela). O dado guardado não muda | Teste com nome em minúsculas e nome com três partes (ex.: "nome exemplo sobrenome"): exibe primeiro e último nome com a capitalização corrigida; nome de uma palavra é exibido como está |
| FR-20 | Pessoas da equipe saem do placar. Duplicados (mesmo primeiro e último nome e mesmo e-mail, normalizados) viram uma linha com a **maior pontuação**. O CSV não muda | Teste: duplicados mesclados com a maior pontuação; e-mail da equipe excluído; o CSV exportado continua com todas as linhas |
| FR-23 | A equipe importa dois CSV no painel, e o app mescla com os resultados deste iPad (Q18) | Teste: cabeçalho inválido é recusado; linha inválida é contada e não entra; o arquivo de origem não é alterado |
| FR-21 | O placar fica só no painel da equipe (sessão válida). Não aparece para o público (Q17) | Revisão de código: o placar só é montado pelo painel, e o painel só abre com sessão |
| FR-22 | O placar não aparece na tela de resultado do participante (`quiz.md` seção 3) | Teste de conteúdo do resultado, já existente |
| NFR-12 | Privacidade | Nome e pontuação são o mínimo. Nada do placar sai do aparelho. Sem serviço de placar em nuvem |
| NFR-13 | Bilíngue | Rótulos do placar em `messages.pt.js` e `messages.en.js` |

Fora deste item: placar entre vários iPads ao vivo (exigiria sincronização, que está fora do escopo).
