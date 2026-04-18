# Politica de Privacidade

Ultima atualizacao: 18 de abril de 2026

## Resumo

A extensao `Imposto Brasil` foi criada para exibir estimativas tributarias em paginas de produto do Mercado Livre. O projeto nao foi desenhado para coletar dados pessoais sensiveis do usuario, criar perfis de navegacao ou vender informacoes a terceiros.

## Quais dados a extensao usa

A extensao usa apenas os dados necessarios para entregar sua funcionalidade principal:

- titulo do produto exibido na pagina aberta pelo usuario;
- preco do produto exibido na pagina aberta pelo usuario;
- URL da pagina atual para verificar se a pagina e um produto do Mercado Livre;
- configuracoes locais eventualmente armazenadas pelo proprio navegador via `chrome.storage`.

## Como esses dados sao usados

Esses dados sao usados para:

- identificar a categoria tributaria mais provavel do item;
- calcular estimativas de impostos embutidos;
- montar o overlay exibido ao usuario;
- comparar o valor local com cenarios internacionais.

## Consultas externas

A extensao faz consultas externas apenas para suportar a funcionalidade descrita acima:

- `https://economia.awesomeapi.com.br/` para obter a cotacao atual de USD/BRL;
- `https://www.amazon.com/` para tentar localizar um preco de referencia internacional com base no titulo do produto.

Essas consultas nao existem para publicidade, rastreamento ou revenda de dados.

## O que a extensao nao faz

Esta extensao nao foi projetada para:

- coletar senhas;
- coletar emails, mensagens ou dados bancarios;
- vender dados de usuarios;
- criar historico remoto de navegacao do usuario;
- enviar dados para um servidor proprio do projeto.

## Compartilhamento de dados

O projeto nao compartilha dados pessoais do usuario com corretores de dados ou plataformas de anuncios. As consultas externas existentes ocorrem somente para viabilizar a cotacao cambial e a comparacao internacional descritas na funcionalidade da extensao.

## Armazenamento

Quando houver uso de armazenamento local da extensao, ele sera restrito a configuracoes necessarias para a experiencia do usuario. O projeto nao possui backend proprio para persistencia de perfis de usuarios.

## Seguranca

Este projeto busca solicitar apenas as permissoes necessarias para o seu proposito unico. Se voce identificar qualquer comportamento inesperado relacionado a privacidade ou seguranca, consulte `docs/security.md`.

## Transparencia para a Chrome Web Store

Esta extensao possui proposito unico: mostrar estimativas tributarias contextuais em paginas de produto do Mercado Livre. As permissoes e acessos declarados devem ser entendidos dentro desse escopo.

## Contato

Repositorio oficial: `https://github.com/mastiico/imposto-brasil-extensao`
