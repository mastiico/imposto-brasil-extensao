# Imposto Brasil

![Logo do Imposto Brasil](./assets/branding/logo.png)

Extensao para Chrome e navegadores compativeis com Chromium que mostra uma estimativa de impostos embutidos em produtos anunciados no Mercado Livre e faz comparacao com cenarios de preco nos Estados Unidos.

O foco do projeto e transparencia e educacao tributaria. Os valores exibidos sao estimativas e nao substituem calculos fiscais oficiais.

## Recursos

- overlay nas paginas de produto do Mercado Livre;
- comparacao entre cenarios nacional e importado;
- detalhamento estimado de tributos;
- cotacao USD/BRL;
- comparacao internacional com referencia externa.

## Instalacao local

1. Clone este repositorio.
2. Abra `chrome://extensions`.
3. Ative `Modo do desenvolvedor`.
4. Clique em `Carregar sem compactacao`.
5. Selecione a pasta do projeto.
6. Abra uma pagina de produto em `mercadolivre.com.br`.

## Publicacao

Para gerar o pacote da extensao:

```powershell
.\scripts\package-extension.ps1
```

## Fluxo open source

- contribuicoes via pull request;
- `main` protegida para evitar pushes diretos;
- build automatico no GitHub Actions;
- release com zip versionado a partir de tags `v*`;
- publicacao do pacote fonte via GitHub Packages.

## Documentacao

- [Privacidade](./docs/privacy.md)
- [Contribuindo](./docs/contributing.md)
- [Seguranca](./docs/security.md)
- [Chrome Web Store](./docs/chrome-web-store.md)
- [Licenca MIT](./LICENSE)
