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
| FR-14 | "Apagar todos os dados" exige dois toques e apaga só o `localStorage` deste iPad | Regra 2.7 existente |
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
