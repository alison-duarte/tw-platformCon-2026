# Quiz de engenharia de plataforma e AI da Thoughtworks

Aplicação web para iPad usada no estande da Thoughtworks. O participante se registra, responde perguntas cronometradas (5 básicas e 2 avançadas, tiradas do deck) sobre engenharia de plataforma e AI, vê a pontuação e retira um brinde na mesa. A equipe exporta os dados dos participantes em CSV.

- Idiomas: português (padrão) e inglês, com troca instantânea.
- Stack: Vite e JavaScript puro, sem framework de interface. Single page application com conteúdo estático.
- Dados: somente no `localStorage` do iPad. Não há servidor, nuvem nem envio pela rede. O acesso à equipe é feito por login antes do quiz. Veja [aidlc-docs](../.claude/aidlc-docs/README.md).

## Como executar

Requer Node 22 ou superior.

```bash
cd app
npm install
npm run dev
```

O Vite mostra a URL local, normalmente `http://localhost:5173`.

| Objetivo | Comando |
|----------|---------|
| Abrir no iPad pela mesma rede Wi-Fi | `npm run dev -- --host` e abra a URL "Network" |
| Gerar a versão de produção | `npm run build` |
| Testar a versão de produção (com CSP) | `npm run preview`, em `http://localhost:4173` |
| Rodar os testes | `npm test` |
| Rodar todas as verificações | `npm run verify` (testes, build, limite de tamanho e auditoria) |

Para simular o iPad no Chrome, abra o DevTools (Cmd+Opt+I) e ative a barra de dispositivos (Cmd+Shift+M).

## Como usar no estande

0. A equipe entra com o e-mail e a senha da conta. Com o login validado, o quiz fica liberado até a equipe tocar em "Sair" no painel.
1. O participante preenche o cadastro, aceita o consentimento obrigatório e toca em "Começar o desafio".
2. Ele responde às perguntas (5 básicas e 2 avançadas), com 30 segundos cada. Depois de cada resposta, aparece um pop-up com um check (acerto), um X (erro) ou um relógio (tempo esgotado), seguido da visão da Thoughtworks.
3. Na tela de resultado, ele vê a pontuação e a mensagem para retirar o brinde na mesa.
4. A equipe toca em "Próximo participante" para limpar a tela para a próxima pessoa.

### Pontuação

Cada resposta correta vale 1.000 pontos, mais 50 por segundo que sobrou no cronômetro, mais 150 por cada acerto seguido anterior. O máximo de uma pergunta sem sequência é 2.500 pontos. Erro e tempo esgotado valem zero e zeram a sequência. As categorias mudam em 4.500 e 8.000 pontos.

O tempo por pergunta (30 segundos) está em uma única constante, `QUESTION_TIME_SECONDS`, em `src/domain/scoring.js`. Para mudá-lo, altere só esse valor e ajuste os testes de pontuação.

### Painel da equipe

Pressione e segure o logo `/thoughtworks` por cerca de 1,5 segundo, com a sessão da equipe ativa. Um toque rápido não abre o painel. Nele você pode:

- Ver a lista de participantes, com pontuação e horário. E-mail e telefone não aparecem na tela, apenas no CSV.
- Tocar em **Exportar CSV (.csv)** para baixar todos os dados.
- Tocar em **Apagar todos os dados**. Peça confirmação com um segundo toque.
- Tocar em **Sair** para encerrar a sessão da equipe. O próximo acesso pede o login.

### Arquivo CSV

- Nome: `participantes_thoughtworks_AAAA-MM-DD.csv`.
- Codificação UTF-8 com BOM, para o Excel exibir os acentos corretamente.
- Colunas: Nome, Empresa, Cargo, Email, Telefone, Pontuacao, Precisao, Aceitou_Newsletter, Consentimento, Idioma, Data_Hora.
- Células de texto que começam com `=`, `+`, `-` ou `@` recebem um apóstrofo na frente, para impedir execução de fórmulas no Excel ou no Google Sheets.

## Onde ficam os dados

Os resultados ficam no `localStorage` do iPad, na chave `tw-platform-quiz:v1:participants`. A sessão da equipe fica na chave `tw-platform-quiz:v1:session`, e assim sobrevive a recarregar a página. Não há expiração por inatividade: a sessão termina somente com "Sair" no painel.

Os dados somem, ou parecem sumir, nestes casos:

- **Aba privada do Safari:** tudo é apagado ao fechar.
- **Limpar dados do site** (Ajustes, Safari, Limpar Histórico e Dados): tudo é apagado.
- **Mudança de endereço:** o armazenamento pertence à origem (protocolo, host e porta). Trocar o IP, a porta ou o domínio abre um armazenamento vazio. Os dados antigos continuam no endereço antigo.
- **Safari sem uso por cerca de sete dias:** o Safari pode apagar dados do site. Apps adicionados à Tela de Início são isentos.
- **Pouco espaço no aparelho:** o iOS pode remover dados de sites para liberar espaço. É raro para o volume de um estande.

Se o salvamento falhar ao final do quiz, a tela de resultado mostra um aviso para o participante procurar a equipe.

## Recomendações para o evento

### Antes do evento

1. **Defina um endereço fixo.** Publique a versão de produção em um host privado e com HTTPS, e use sempre a mesma URL em todos os dias do evento. Não use um IP de desenvolvimento, porque ele pode mudar.
2. **Adicione à Tela de Início.** No Safari, toque em Compartilhar e depois em "Adicionar à Tela de Início". Abra o app por esse ícone durante o evento.
3. **Não use aba privada.** Ela apaga os dados ao fechar.
4. **Teste no iPad real.** Faça um jogo completo e confira o som depois do primeiro toque, a orientação (retrato e paisagem) e o download do CSV. Esses testes ainda não foram feitos em um iPad real.
5. **Defina quem é o responsável pelos dados.** Escolha uma pessoa para exportar os arquivos e para apagar os dados depois do evento.
6. **Deixe o aparelho pronto para uso contínuo.** Mantenha o iPad carregado e com o bloqueio automático desativado, ou configure o Acesso Guiado para impedir que os participantes saiam do app.

### Durante o evento

1. **Exporte o CSV várias vezes ao dia**, por exemplo a cada pausa e ao fim de cada dia. O CSV é o único backup dos dados.
2. **Guarde cada arquivo exportado** fora do iPad (e-mail corporativo ou pasta aprovada pela empresa). Não envie os arquivos por canais não aprovados.
3. **Não mude a URL, a porta ou o domínio** com participantes já cadastrados.
4. **Não limpe os dados do Safari** nem use "Apagar todos os dados" antes de conferir que o CSV foi baixado.
5. **Se aparecer o aviso de falha ao salvar**, exporte o CSV imediatamente, anote o participante manualmente e avise a equipe técnica.

### Depois do evento

1. Exporte o CSV final e confira o número de linhas contra o número de participantes esperado.
2. Guarde o arquivo em local privado e com acesso controlado. Os dados são pessoais e foram coletados com consentimento para o quiz e o brinde.
3. Use a opção de newsletter apenas para quem marcou "Aceitou_Newsletter" como "Sim".
4. Toque em **Apagar todos os dados** no painel da equipe para remover os dados do iPad.
5. Defina e cumpra um prazo de retenção para o CSV, conforme a política da empresa e a LGPD.

## Arquitetura

O código fica em `src/`, em camadas e com funcionalidades carregadas sob demanda.

| Pasta | Responsabilidade |
|-------|------------------|
| `domain/` | Regras puras: pontuação, máquina de estados do quiz, validação do cadastro, CSV. Sem DOM e sem pacotes. |
| `application/` | Casos de uso (`create-quiz-app.js`) e contratos (`ports.js`). |
| `infrastructure/` | Adaptadores: `localStorage`, verificação de senha (WebCrypto), sessão da equipe, áudio (Tone.js), confete, download de arquivo. |
| `features/` | Telas independentes (shell, login, registro, pergunta, feedback, resultado, painel). Cada uma exporta `mount(host, ctx, props)` e retorna uma função de limpeza. |
| `composition/` | Único lugar que liga os adaptadores ao núcleo e registra as telas. |
| `content/` | Perguntas e dicionários PT e EN. |
| `kernel/` | Utilidades compartilhadas: DOM seguro, i18n, estado observável. |

Regras de dependência: `features` importam apenas `kernel`, nunca outra feature nem `infrastructure`. As regras são verificadas por `tests/guardrails.test.js`.

### Tarefas comuns

- **Mudar uma pergunta:** edite `src/content/questions.js`. Cada opção tem os dois idiomas no mesmo objeto. Os testes aceitam 5 ou 7 perguntas. Com 7, as duas avançadas vêm por último. As respostas corretas se espalham por A a D, sem letra mais de duas vezes e sem repetir a letra em perguntas seguidas.
- **Adicionar um texto de interface:** adicione a chave em `messages.pt.js` e em `messages.en.js`. Um teste falha se as chaves forem diferentes.
- **Trocar ou adicionar uma conta da equipe:** gere a entrada com `read -s PW && printf '%s' "$PW" | npm run account:new -- <email> "<rótulo>"` e cole o resultado em `src/content/staff-accounts.js`. A senha precisa de 12 caracteres ou mais e nunca vai para o código. Sem contas, ninguém entra.
- **Trocar o armazenamento:** escreva um novo adaptador que siga `ParticipantRepository` em `ports.js` e use-o em `composition/create-context.js`.

## Qualidade e segurança

- O critério de pronto está em [`DEFINITION_OF_DONE.md`](../.claude/skills/DEFINITION_OF_DONE.md).
- A versão de produção inclui uma Content Security Policy restritiva, sem scripts, estilos ou fontes de CDN.
- Não há `innerHTML`: os dados dos participantes são sempre exibidos como texto.
- O pipeline de CI está em `.harness/pipeline.yaml`. Ele ainda não foi validado em um projeto Harness real, e a varredura SAST/DAST ainda não está configurada.

> Este código foi gerado por IA. Ele precisa de revisão manual por pessoas e de varredura SAST/DAST antes da implantação.
