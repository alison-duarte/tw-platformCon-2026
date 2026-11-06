# 01 Intenção

> Escrito para: dono do produto e equipe de desenvolvimento. Estado: rascunho, aguarda G1.

## Problema

O quiz precisa rodar em um iPad de estande, em uma página pública, sem expor os dados dos participantes a terceiros. Os dados do quiz (cadastro e pontuação) ficam no navegador do iPad, e a equipe baixa o CSV para o sorteio. Sem um login, qualquer pessoa com a URL poderia começar a jogar no iPad ou mexer no painel.

## Intenção

1. Servir o quiz como **site estático (SPA)**, sem servidor e sem nenhum serviço em nuvem.
2. Guardar os dados dos participantes **somente no `localStorage` do iPad**.
3. Exigir **login da equipe antes de jogar**. Com o login validado, a equipe pode jogar sem interrupções, rodada após rodada, até tocar em "Sair".
4. Manter a exportação de **CSV a partir dos dados do `localStorage`**, com o mesmo formato de hoje.

## Resultado esperado (critérios de sucesso)

| Medida | Meta |
|--------|------|
| Dados em nuvem ou em serviço de terceiros | Nenhum |
| Jogar sem login válido | Impossível pela interface |
| Rodadas consecutivas após um login | Sem nova tela de login |
| Recarregar a página no iPad | Mantém a sessão da equipe |
| CSV exportado | Mesmas colunas e formato de hoje, com uma linha por participante |
| Tempo até a tela inicial (JS) | Dentro de 40 kB gzip |

## Fora de escopo

- Servidor próprio, banco de dados em nuvem e sincronização entre aparelhos.
- Cadastro público de equipe, perfis com níveis de permissão, recuperação de senha.
- Painel público com ranking ou QR code (já excluído pelo `quiz.md`).
- Expiração de sessão por inatividade (decisão Q8).
- Proteção de segurança real para o login. Por ser um site público, o login só barra o uso casual (ver Q2).

## Restrições conhecidas

- **Site público:** o GitHub Pages é público. A publicação depende da aprovação da InfoSec (Q1).
- **Dados pessoais no navegador:** nome, e-mail e telefone ficam no `localStorage` do iPad. Isso precisa aparecer no consentimento (Q7) e na retenção (Q9).
- **Dispositivo:** iPad com Safari, em retrato e paisagem, em modo quiosque.
- **Sem framework de interface** e sem dependência nova sem justificativa escrita.

## Premissas

- O iPad é o único lugar onde os dados existem. Quem exporta o CSV precisa fazê-lo antes de apagar ou trocar de aparelho.
- O estande pode não ter internet. Como não há nuvem, o quiz não depende dela.
- Os dois usuários da equipe são pessoas conhecidas (Q5), e as senhas são definidas pela equipe (Q3).
