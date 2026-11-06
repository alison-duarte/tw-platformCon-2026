# 03 Histórias de usuário

> Escrito para: produto e desenvolvimento. Estado: rascunho, aguarda G2.

Personas:
- **Participante:** pessoa do público que joga no iPad do estande. Não faz login.
- **Equipe:** uma das duas pessoas com login. Opera o estande, exporta o CSV e apaga os dados.

## Equipe

**US-01 Liberar o quiz com o login**
Como membro da equipe, quero entrar com meu e-mail e senha antes de qualquer participante jogar, para que o site público não seja usado por qualquer pessoa.
- Dado que abro o site sem sessão, quando a página carrega, então vejo a tela de login e nenhum cadastro.
- Dado que digito o e-mail e a senha de uma das contas, então o quiz abre no cadastro.
- Dado que erro a senha, então vejo "E-mail ou senha inválidos." e o campo de senha fica limpo.
- Dado que erro 5 vezes seguidas, então vejo o bloqueio de 30 segundos, com a contagem regressiva.

**US-02 Jogar sem novo login**
Como membro da equipe, quero que o login valha para todas as rodadas, para que os participantes joguem sem interrupções.
- Dado que o login foi validado, quando um participante termina o quiz e toca em "Próximo participante", então vejo o cadastro, sem tela de login.
- Dado que a página é recarregada no iPad, então o quiz continua liberado.

**US-03 Sair da sessão**
Como membro da equipe, quero encerrar a sessão ao fim do dia, para que o próximo a usar o iPad precise do login.
- Dado que estou no painel, quando toco em "Sair", então volto à tela de login.
- Dado que saí, quando a página é recarregada, então o login é pedido de novo.

**US-04 Ver os participantes**
Como membro da equipe, quero ver a lista de quem jogou, com pontuação e horário, para acompanhar o estande.
- A lista não mostra e-mail nem telefone.
- A lista vem do `localStorage` deste iPad.

**US-05 Baixar o CSV**
Como membro da equipe, quero baixar todos os dados em CSV, para o sorteio.
- O arquivo tem uma linha por participante, nas mesmas colunas e ordem de hoje.
- Vem do `localStorage` deste iPad.

**US-06 Apagar os dados com segurança**
Como responsável pelos dados, quero apagar tudo depois do evento, sem risco de um toque acidental.
- O botão pede um segundo toque de confirmação, com aviso para exportar antes (Q6).
- A exclusão afeta só este iPad.

## Participante

**US-07 Jogar do cadastro ao resultado**
Como participante, quero responder as perguntas (5 básicas e até 2 avançadas) com 30 segundos cada, para ver minha pontuação.
- Os itens do quiz são os de `quiz.md`, sem mudança.

**US-08 Consentir de forma clara**
Como participante, quero ler o que acontece com meus dados antes de aceitar.
- O texto de consentimento diz que os dados ficam neste iPad e por quanto tempo (Q7 e Q9). O texto final só após revisão jurídica.
- O consentimento é obrigatório para jogar. A newsletter é opcional.

**US-09 Saber quando o registro não foi salvo**
Como participante, quero ver um aviso se o resultado não foi salvo, para procurar a equipe.
- Dado que o salvamento falha, então vejo o aviso de falha (nunca uma falha silenciosa).

## Operação

**US-10 Preparar o aparelho**
Como equipe, quero um roteiro curto para deixar o iPad pronto.
- O roteiro cobre: URL fixa, Acesso Guiado, adicionar à Tela de Início, login da equipe, rodada de teste e CSV de teste.
