# 06 Perguntas abertas

> Escrito para: dono do produto, InfoSec, jurídico e desenvolvimento. Responda cada item em **[Answer]**. Se não souber, escreva "padrão" e a sugestão será usada.

Cada pergunta traz a **sugestão padrão**, usada se não houver resposta. Respostas que já foram dadas estão preservadas como estavam escritas.

> **Mudança de escopo (2026-11-06):** o Firebase foi removido. Tudo fica no `localStorage` do iPad, e o site tem um login de equipe que libera o quiz. As perguntas sobre nuvem (antigas Q1 a Q3, Q10, Q11 e Q13) ficam registradas como removidas do escopo.

---

## Bloqueadores (precisam de resposta antes de publicar)

**Q1. InfoSec: o site público pode guardar dados pessoais no navegador do iPad?**
A política de guardrails diz "não processar nem armazenar PII em nenhuma forma", e o site vai ficar público no GitHub Pages. Os dados (nome, e-mail, telefone) ficam só no iPad, mas o site em si é público.
- Sugestão padrão: abrir o pedido de aprovação com este escopo (publicação pública, dados só no aparelho, login de equipe por hash) e registrar a referência em `PUBLISHING.md`.
- Opções: (a) aprovado com ressalvas; (b) aprovado só com dados anonimizados; (c) não aprovado, e o site não é publicado.
- [Answer]: B = O Site é publico mas os dados serão armazenados somente no dispositivo, então não serão acessados pela internet e nem armazenados em cloud
  - Registro: aprovação da InfoSec pela opção B, com a justificativa informada (site público, dados só no aparelho, sem envio pela internet). Anonimização não é exigida neste momento, por decisão do dono do produto. Reavaliar se o escopo mudar.

**Q2. Login de equipe em site público: aceitável que a proteção seja só um hash no código?**
As senhas ficam como hash PBKDF2 (salgado, 600 mil iterações) no bundle público. Quem ler o código pode testar senhas offline, e quem editar o `localStorage` pode forçar a sessão. Isso protege contra uso casual, não contra alguém determinado. Proteção real exigiria um servidor, que está fora do escopo.
- Sugestão padrão: aceitar, com senhas de 12 caracteres ou mais, limite de tentativas no aparelho (5 erros bloqueiam por 30 segundos) e registro do risco na InfoSec.
- [Answer]: Aceitar, visto que é apenas para uso exclusivo do evento e mesmo publico não expoe informações
  - Registro: aceito. Limite de 5 erros com bloqueio de 30 segundos implementado; senhas de 12 caracteres ou mais exigidas pelo gerador.

**Q3. Senhas das duas contas**
As senhas não ficam no repositório. Você gera cada uma com `printf '%s' "$PW" | npm run account:new -- <email> "<rótulo>"` e cola o resultado em `src/content/staff-accounts.js`. Sem entradas, ninguém entra no quiz.
- Sugestão padrão: senhas de 12 caracteres ou mais, guardadas em gerenciador de senhas da equipe, nunca no chat.
- [Answer]: Aceitar a senha proposta.
  - Registro: aceito o padrão de 12 caracteres ou mais, com o gerador `npm run account:new`. As contas Equipe 1 e Equipe 2 já estão configuradas em `staff-accounts.js`.

**Q4. Onde hospedar o site**
- Sugestão padrão: GitHub Pages, que já tem pipeline, `verify` obrigatório e deploy só pelo `main`.
- [Answer]: Github Pages

**Q5. E-mails e nomes das duas contas da equipe**
- Sugestão padrão: os e-mails entram na lista de contas (ficam visíveis no bundle público, junto com o hash). Os rótulos são "Equipe 1" e "Equipe 2".
- Informe se a conta deve ser de domínio corporativo da Thoughtworks e quem é o dono de cada conta.
- [Answer]: alison.duarte@thoughtworks.com e cgomes@thoughtworks.com

**Q6. Apagar tudo: exigir exportação antes?**
Apagar é irreversível, e agora os dados existem só neste iPad. O segundo toque evita erro, mas não evita perda de dados que ninguém exportou.
- Sugestão padrão: segundo toque, e o painel avisa se nenhum CSV foi baixado desde o último registro.
- [Answer]: Aceitar sugestão
  - Registro: implementado. Ao tocar em apagar, o painel avisa se há participantes que nunca foram exportados para CSV (data da última exportação guardada no aparelho).

**Q7. Texto de consentimento e base legal**
O texto atual diz que os dados ficam no aparelho, o que agora é verdade. O texto precisa dizer também por quanto tempo ficam e com quem são compartilhados (com o CSV exportado para o sorteio). Quem é o controlador dos dados (Thoughtworks ou outra empresa)?
- Sugestão padrão: eu escrevo a minuta em PT e EN, marcada como "não aprovada", e o jurídico revisa.
- [Answer]: Dizer que os dados serão usados para sorteio somente e que serão excluidos após o evento
  - Registro: texto de consentimento e de privacidade atualizados em PT e EN (finalidade: só o sorteio; exclusão após o evento). Aprovado pelo dono do produto. Revisão jurídica dispensada neste momento. Quem é o controlador dos dados segue sem resposta.

**Q8. Sessão da equipe**
- Sugestão padrão: expirar após 15 minutos de inatividade e ter botão "Sair".
- [Answer]: Não expirar a sessão, porque a aplicação vai ficar rodando por muito tempo
- Registro: a sessão fica ativa até a equipe tocar em "Sair" no painel. Não há expiração por inatividade.

**Q9. Retenção e responsável**
Quanto tempo os dados ficam no iPad depois do evento, e quem apaga?
- Sugestão padrão: apagar até 30 dias após o evento, com o responsável nomeado no runbook.
- [Answer]: Vai ficar somente 2 dias disponiveis
- Registro: entendi como "os dados ficam disponíveis por 2 dias após o evento, e depois são apagados". O runbook registra isso. Hoje o app não apaga sozinho. Se quiser apagamento automático, é uma história nova. Confirme (Q9b).

**Q9b. Confirmação da retenção de 2 dias**
- Você quer apenas o procedimento manual (o runbook manda apagar em até 2 dias), ou um apagamento automático dentro do app?
- [Answer]: Manual

**Q12. Data do evento**
Determina os prazos de publicação e de aprovação.
- [Answer]: 07/11/2026
  - Registro: evento em 07/11/2026. Com a retenção de 2 dias (Q9), os dados devem ser apagados até 09/11/2026.

**Q14. Bolts e revisão**
Quem revisa cada bolt antes de ir para o `main`? Eu sugiro o `code-reviewer` como primeira revisão e uma pessoa da equipe como segunda.
- [Answer]: Desconsiderada pelo dono do produto.

---

## Removidas do escopo (Firebase)

**Q10. Plano e custo.** Removida: não há mais serviço pago nem nuvem.

**Q11. Projeto Firebase e propriedade.** Removida: não há projeto Firebase.

**Q13. Offline: o participante pode aguardar o envio?** Resolvida sem envio: o resultado é salvo no iPad e fica disponível para exportação. Não há mais estado "pendente".

## Conteúdo do quiz

**Q15. As 2 perguntas avançadas (tiradas do deck)**
A spec agora aceita 5 ou 7 perguntas: as 5 básicas e 2 avançadas, por último. O repositório não tem o deck, então eu não escrevi as perguntas para não inventar a posição da Thoughtworks. Envie o deck (ou os trechos) e eu redijo as duas em PT e EN, com explicação baseada no deck, para sua revisão.
- Sugestão padrão: enviar o deck ou os trechos que devem virar pergunta.
- [Answer]: Deck recebido ("Engineering platform, a key to maximize engineering effectiveness", GLOBAL, © 2022 Thoughtworks). Redigi as duas perguntas avançadas a partir dele, em PT e EN, em `app/src/content/questions.js`:
  - **Q6** (`difficulty: advanced`): divisão de responsabilidades (slide 35). Resposta correta: B. Fontes em `07-advanced-content.md`.
  - **Q7** (`difficulty: advanced`): governança no ponto de mudança (slides 60, 77 e 29). Resposta correta: D. Fontes em `07-advanced-content.md`. Termo "admission controllers" fora do deck, mantido a pedido do dono do produto.
  - Ambas seguem a regra de letras (sequência C, A, D, B, C, B, D).
  - **Pendente:** revisão do dono do produto (DoD 1.4b). Antes de publicar, confirmar que o deck pode servir de base para conteúdo público: vários slides estão marcados como "Confidential". Os dados do levantamento são de 2017 e o deck é de 2022.

**Q16. Pontuação com 7 perguntas**
As faixas de pontuação (4.500 e 8.000 pontos) foram pensadas para 5 perguntas. Com 7, o máximo sobe e as faixas ficam mais fáceis de alcançar.
- Sugestão padrão: manter as faixas. Opções: (a) manter; (b) escalar pela proporção, para 6.300 e 11.200 pontos.
- [Answer]: escalar pela proporção
  - Registro: implementado. Faixas em 6.300 (herói) e 11.200 (visionário), com testes atualizados.

---

## Placar (pedido em 2026-11-07, bloqueia a U4)

> Estas perguntas bloqueiam a construção do placar. Nada de código do placar até as respostas de Q17 e Q18.

**Q17. Quem vê o placar, e onde? (bloqueador: nome e consentimento)**
O texto de consentimento aprovado (Q7) diz que os dados são usados "somente para participar do quiz e para o sorteio do brinde". Mostrar nomes num placar visível a quem está no estande é outra finalidade. Além disso, a intenção diz "sem expor os dados dos participantes a terceiros".
- Sugestão padrão: **placar só para a equipe**, no painel, com sessão. Não muda o consentimento e não expõe nomes ao público.
- [Answer]: Placar só para a equipe, no painel, com nome, sobrenome e pontuação (opção a).
  - Registro: opção (a). Não há exibição ao público, então o texto de consentimento não muda.
- Opções:
  - (a) Só equipe, no painel (padrão).
  - (b) Público, no iPad, com nome e pontuação. Exige novo texto de consentimento em PT e EN, aprovado pelo dono do produto e registrado (Q7), e a aprovação de InfoSec do uso (Q1).
  - (c) Público, mas só pontuação, sem nome. Não conflita com o consentimento.
- [Answer]:

**Q18. De onde vêm os dados do placar? (bloqueador: fonte)**
As duas planilhas enviadas são de 07/11/2026 e parecem exportações do iPad. Se foram geradas em **dois iPads**, um placar só com o `localStorage` deste aparelho não mostra os dois conjuntos. O placar não pode sincronizar entre aparelhos (fora de escopo).
- Sugestão padrão: opção (a), só o `localStorage` deste iPad.
- Opções:
  - (a) Só os dados deste iPad.
  - (b) Importar CSVs exportados no painel (a equipe escolhe o arquivo). Precisa de validação de formato no app.
  - (c) Lista fixa no código, gerada das planilhas. **Não recomendado e não será feito:** publicaria nomes de participantes no site público, contra a regra 5 do `CLAUDE.md` e contra a aprovação de Q1.
- Confirme também quantos iPads coletaram os dados do evento.
- [Answer]: Mesclar as duas planilhas (ambas de 07/11/2026).
  - Registro: opção (b). A equipe importa os dois CSV no painel do iPad, e o app mescla com os resultados que já estão neste aparelho. Os dados reais não entram no repositório.
  - Q18b [Answer]: Sim, guardar no `localStorage`, em chave própria, sem alterar o CSV de origem.
  - Registro: chave `tw-platform-quiz:v1:leaderboard-import`, separada de `participants`. Os resultados do próprio iPad continuam em `participants`.

**Q19. Como mostrar "Nome/Sobrenome"?**
O campo do cadastro é "Nome completo". Os nomes digitados têm problemas de capitalização e de digitação, e há nomes de uma palavra e nomes com três ou mais partes.
- Sugestão padrão: **primeiro e último nome**, com capitalização corrigida na tela. Nome de uma palavra aparece como está. O dado guardado não muda.
- Opções: (a) primeiro e último nome (padrão); (b) nome completo, como digitado; (c) primeiro nome e inicial do sobrenome.
- [Answer]: Nome e sobrenome.
  - Registro: opção (a), primeiro e último nome, com capitalização corrigida na tela (FR-19).

**Q20. Duplicados, registros de teste e empates**
Nas planilhas, uma mesma pessoa aparece mais de uma vez, com pontuações diferentes. Há também linhas com o nome da própria equipe, com horário anterior ao início do evento, que parecem testes. Nada será excluído sem confirmação.
- Sugestão padrão:
  - Uma linha por pessoa, com a **melhor pontuação**. A pessoa é identificada pelo e-mail normalizado (minúsculas, sem espaços).
  - Empate: o resultado mais antigo fica acima (FR-18).
  - Testes: a equipe informa quais registros são de teste. O placar os exclui, e o CSV continua com todas as linhas (FR-20).
- Opções: (a) padrão; (b) uma linha por resultado, sem agrupar; (c) excluir por horário anterior à abertura do evento (precisa do horário de abertura).
- [Answer]: Mesclar e excluir a equipe. Mesmo nome, mesmo sobrenome e mesmo e-mail são a mesma pessoa, e fica a maior pontuação.
  - Registro: chave de duplicado = primeiro e último nome + e-mail, normalizados (minúsculas, sem acento, sem espaços extras). Empate de pontuação: fica o resultado mais antigo. Nomes digitados com grafia diferente não se mesclam, e isso é aceito.
  - Equipe excluída: e-mail de uma das contas da equipe (Q5) ou qualquer e-mail do domínio `thoughtworks.com`. Padrão a confirmar: o domínio inteiro, que inclui a conta de Alison Duarte.
  - Não aplicado: exclusão por horário (opção c). Os registros de teste entram na mesclagem, a menos que tenham e-mail da equipe.
