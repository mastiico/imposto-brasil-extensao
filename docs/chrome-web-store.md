# Chrome Web Store

Material de apoio para publicar a extensao `Imposto Brasil` na Chrome Web Store.

## Estado do projeto

- Manifest V3: sim
- Icones da extensao: sim
- Logo principal do projeto: sim
- README publico: sim
- Politica de privacidade: sim
- Licenca open source: sim
- Guia de contribuicao: sim
- Script de empacotamento: sim

## Checklist de submissao

1. Registrar ou acessar a conta de desenvolvedor da Chrome Web Store.
2. Gerar o zip com `.\scripts\package-extension.ps1`.
3. Fazer upload da extensao no painel.
4. Preencher a Store listing com nome, descricoes, categoria e imagens.
5. Preencher a aba de privacidade com as respostas consistentes com `docs/privacy.md`.
6. Informar a URL publica da politica de privacidade.
7. Revisar as permissoes justificadas no dashboard.
8. Enviar para revisao.

## Textos-base para a listing

### Nome

`Imposto Brasil`

### Resumo curto

Veja estimativas de impostos embutidos em produtos do Mercado Livre e compare com valores nos EUA.

### Descricao longa

`Imposto Brasil` e uma extensao para Chrome que adiciona um painel nas paginas de produto do Mercado Livre para mostrar uma estimativa da carga tributaria embutida no preco anunciado.

Com a extensao, o usuario pode:

- visualizar o valor estimado de tributos embutidos;
- ver o valor aproximado do produto sem impostos;
- comparar cenarios de origem nacional e importada;
- consultar a cotacao atual do dolar;
- comparar o preco local com um preco de referencia nos Estados Unidos.

O projeto tem foco educativo e informativo. Os valores exibidos sao estimativas baseadas em heuristicas, base local do IBPT e consultas externas necessarias para a comparacao internacional. Nao se trata de calculo fiscal oficial.

### Categoria sugerida

`Shopping`

### Idioma principal

`Portuguese (Brazil)`

## Privacidade e permissoes

Sugestao de enquadramento para o painel de privacidade da loja:

- A extensao usa dados do conteudo da pagina atual apenas para entregar sua funcionalidade principal.
- A extensao nao vende dados pessoais.
- A extensao nao usa dados para publicidade.
- A extensao nao usa dados para score de credito.
- A extensao nao coleta historico remoto de navegacao do usuario em backend proprio.

## Justificativa das permissoes

### `storage`

Usado para armazenar configuracoes locais da extensao e preferencia de experiencia do usuario, quando aplicavel.

### `*://*.mercadolivre.com.br/*`

Necessario para executar o content script nas paginas de produto do Mercado Livre e calcular a estimativa tributaria no contexto correto.

### `https://economia.awesomeapi.com.br/*`

Necessario para consultar a cotacao USD/BRL usada na comparacao internacional exibida ao usuario.

### `https://www.amazon.com/*`

Necessario para tentar localizar um preco de referencia internacional relacionado ao produto aberto pelo usuario.

## Assets que voce ainda precisa preparar manualmente

Mesmo com o repositorio organizado, a Chrome Web Store normalmente exigira itens visuais no painel:

- screenshots da extensao em funcionamento;
- opcionalmente imagem promocional, se voce quiser caprichar na listing.

O projeto ja possui uma logo base em `logo.png` e uma copia organizada em `assets/branding/logo.png`, alem dos icones quadrados derivados para a extensao.

## Observacoes de conformidade

Com base na documentacao oficial da Chrome Web Store consultada em 18 de abril de 2026:

- a extensao precisa manter um proposito unico, claro e facil de entender;
- a listing precisa ter descricao, icone e screenshots;
- os campos de privacidade do painel precisam ser consistentes com a politica de privacidade e com o comportamento real da extensao;
- permissoes em excesso podem gerar rejeicao na revisao.

## Fontes oficiais consultadas

- Listing requirements: https://developer.chrome.com/docs/webstore/program-policies/listing-requirements/
- Quality guidelines: https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines/
- Single purpose FAQ: https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines-faq
- Privacy fields in dashboard: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Developer account registration: https://developer.chrome.com/docs/webstore/register/
