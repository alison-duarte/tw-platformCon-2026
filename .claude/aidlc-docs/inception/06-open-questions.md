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
  - **Q6** (`difficulty: advanced`): definição de DI platform (slide 30, citação de Evan Bottcher). Resposta correta: A.
  - **Q7** (`difficulty: advanced`): blocos da plataforma (slides 11 a 12 e 24 a 25): publicar e descobrir APIs cabe ao Services Hub. Resposta correta: B. Versão anterior (levantamento de produtividade) substituída a pedido do dono do produto.
  - Ambas seguem a regra de letras (sequência C, A, D, B, C, A, D) e as explicações citam o deck.
  - **Pendente:** revisão do dono do produto (DoD 1.4b). Antes de publicar, confirmar que o deck pode servir de base para conteúdo público: vários slides estão marcados como "Confidential". Os dados do levantamento são de 2017 e o deck é de 2022.

**Q16. Pontuação com 7 perguntas**
As faixas de pontuação (4.500 e 8.000 pontos) foram pensadas para 5 perguntas. Com 7, o máximo sobe e as faixas ficam mais fáceis de alcançar.
- Sugestão padrão: manter as faixas. Opções: (a) manter; (b) escalar pela proporção, para 6.300 e 11.200 pontos.
- [Answer]: escalar pela proporção
  - Registro: implementado. Faixas em 6.300 (herói) e 11.200 (visionário), com testes atualizados.
