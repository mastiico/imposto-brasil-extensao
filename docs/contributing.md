# Contribuindo

Obrigado por querer contribuir com o `Imposto Brasil`.

## Antes de abrir uma issue ou PR

- verifique se o problema ja foi relatado;
- descreva claramente o comportamento atual e o esperado;
- inclua link, print ou exemplo de produto quando isso ajudar no contexto;
- evite enviar mudancas grandes e desconectadas no mesmo pull request.

## Fluxo recomendado

1. Faca um fork do repositorio.
2. Crie uma branch para a sua mudanca.
3. Implemente a correcao ou melhoria.
4. Atualize a documentacao quando necessario.
5. Abra um pull request explicando o problema e a solucao.

## Tipos de contribuicao bem-vindos

- melhoria na extracao de titulo e preco;
- ajuste das heuristicas de categoria e origem;
- revisao das aliquotas de fallback;
- testes automatizados;
- melhorias de UI e acessibilidade;
- documentacao;
- preparacao da extensao para publicacao e manutencao.

## Diretrizes

- mantenha o escopo das alteracoes focado;
- prefira nomes claros e mudancas pequenas;
- nao adicione permissoes sem justificativa forte;
- nao introduza coleta de dados fora do proposito central da extensao;
- mantenha compatibilidade com Manifest V3.

## Commits

Use mensagens curtas e com prefixo padrao.

Prefixos recomendados:

- `feat:` para nova funcionalidade;
- `fix:` para correcao de bug;
- `docs:` para documentacao;
- `chore:` para manutencao e ajustes internos;
- `refactor:` para reorganizacao de codigo sem mudar comportamento;
- `ci:` para GitHub Actions e automacao;
- `test:` para testes.

Exemplos bons:

- `feat: overlay ibpt`
- `fix: amazon fallback`
- `docs: commit pattern`
- `chore: clean release flow`

Evite mensagens longas, genericas ou vagas.

## Discussao de produto

Se a mudanca alterar o proposito da extensao, aumentar as permissoes solicitadas ou introduzir novas integracoes externas, abra uma discussao antes do pull request.
