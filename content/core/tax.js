(function initCalculos(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};
  const { CATEGORIAS, PALAVRAS_CHAVE } = ns.dadosTributarios;
  const { IBPT_CSV_PATH } = ns.runtime;
  let ibptPromise = null;

  function normalizarNcm(ncm) {
    return String(ncm || '').replace(/\D/g, '');
  }

  function normalizarTexto(texto) {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function parseNumeroIBPT(valor) {
    const numero = parseFloat(String(valor || '').replace(',', '.'));
    return Number.isFinite(numero) ? numero : 0;
  }

  function dividirLinhaCsv(linha) {
    const colunas = [];
    let atual = '';
    let dentroDeAspas = false;

    for (let i = 0; i < linha.length; i += 1) {
      const caractere = linha[i];

      if (caractere === '"') {
        const proximo = linha[i + 1];

        if (dentroDeAspas && proximo === '"') {
          atual += '"';
          i += 1;
        } else {
          dentroDeAspas = !dentroDeAspas;
        }

        continue;
      }

      if (caractere === ';' && !dentroDeAspas) {
        colunas.push(atual);
        atual = '';
        continue;
      }

      atual += caractere;
    }

    colunas.push(atual);
    return colunas;
  }

  function criarMediaIBPT(registros, ncmConsultado) {
    const total = registros.length;

    if (!total) {
      return null;
    }

    const soma = registros.reduce((acc, registro) => {
      acc.nacionalfederal += registro.nacionalfederal;
      acc.importadosfederal += registro.importadosfederal;
      acc.estadual += registro.estadual;
      acc.municipal += registro.municipal;
      return acc;
    }, {
      nacionalfederal: 0,
      importadosfederal: 0,
      estadual: 0,
      municipal: 0,
    });

    const referencia = registros[0];

    return {
      ncm: ncmConsultado,
      descricao: referencia.descricao,
      nacionalfederal: soma.nacionalfederal / total,
      importadosfederal: soma.importadosfederal / total,
      estadual: soma.estadual / total,
      municipal: soma.municipal / total,
      vigenciainicio: referencia.vigenciainicio,
      vigenciafim: referencia.vigenciafim,
      versao: referencia.versao,
      fonte: referencia.fonte,
      quantidadeBase: total,
    };
  }

  function selecionarRegistrosPorPrefixo(registros, prefixo) {
    return registros.filter((registro) => registro.codigo.startsWith(prefixo));
  }

  function indexarIbpt(csvText) {
    const linhas = csvText
      .split(/\r?\n/)
      .map((linha) => linha.trim())
      .filter(Boolean);

    if (linhas.length < 2) {
      throw new Error('Arquivo IBPT sem dados suficientes.');
    }

    const cabecalho = dividirLinhaCsv(linhas[0]);
    const registros = [];
    const mapaExato = new Map();

    for (const linha of linhas.slice(1)) {
      const colunas = dividirLinhaCsv(linha);

      if (colunas.length !== cabecalho.length) {
        continue;
      }

      const registro = Object.fromEntries(cabecalho.map((chave, indice) => [chave, colunas[indice]]));
      const codigo = normalizarNcm(registro.codigo);

      if (!codigo) {
        continue;
      }

      const item = {
        codigo,
        ex: registro.ex || '',
        descricao: registro.descricao || '',
        nacionalfederal: parseNumeroIBPT(registro.nacionalfederal),
        importadosfederal: parseNumeroIBPT(registro.importadosfederal),
        estadual: parseNumeroIBPT(registro.estadual),
        municipal: parseNumeroIBPT(registro.municipal),
        vigenciainicio: registro.vigenciainicio || '',
        vigenciafim: registro.vigenciafim || '',
        versao: registro.versao || '',
        fonte: registro.fonte || '',
      };

      registros.push(item);

      if (!mapaExato.has(codigo)) {
        mapaExato.set(codigo, []);
      }

      mapaExato.get(codigo).push(item);
    }

    return {
      registros,
      mapaExato,
    };
  }

  async function carregarBaseIbpt() {
    if (!ibptPromise) {
      ibptPromise = (async () => {
        const caminho = global.chrome?.runtime?.getURL
          ? global.chrome.runtime.getURL(IBPT_CSV_PATH)
          : IBPT_CSV_PATH;
        const resposta = await fetch(caminho);

        if (!resposta.ok) {
          throw new Error(`Falha ao carregar IBPT: HTTP ${resposta.status}`);
        }

        const csv = await resposta.text();
        return indexarIbpt(csv);
      })().catch((erro) => {
        console.error('[Imposto Brasil] Nao foi possivel carregar a base IBPT local.', erro);
        ibptPromise = null;
        return null;
      });
    }

    return ibptPromise;
  }

  function obterFaixaIbpt(baseIbpt, ncm) {
    if (!baseIbpt) {
      return null;
    }

    const ncmNormalizado = normalizarNcm(ncm);

    if (!ncmNormalizado) {
      return null;
    }

    const correspondenciasExatas = baseIbpt.mapaExato.get(ncmNormalizado);
    if (correspondenciasExatas?.length) {
      const semEx = correspondenciasExatas.filter((registro) => !registro.ex);
      return criarMediaIBPT(semEx.length ? semEx : correspondenciasExatas, ncmNormalizado);
    }

    const porPrefixo = selecionarRegistrosPorPrefixo(baseIbpt.registros, ncmNormalizado);
    if (!porPrefixo.length) {
      return null;
    }

    const semEx = porPrefixo.filter((registro) => !registro.ex);
    return criarMediaIBPT(semEx.length ? semEx : porPrefixo, ncmNormalizado);
  }

  function obterAliquotasFallback(categoria, categoriaKey) {
    return {
      ncm: categoria.ncm,
      descricao: categoria.nome,
      nacionalfederal: categoria.federal_nac,
      importadosfederal: categoria.federal_imp,
      estadual: categoria.estadual,
      municipal: categoria.municipal || 0,
      vigenciainicio: '',
      vigenciafim: '',
      versao: '',
      fonte: 'fallback-local',
      quantidadeBase: 0,
      fallback: true,
      categoriaKey,
    };
  }

  async function obterAliquotasCategoria(categoriaKey) {
    const categoria = CATEGORIAS[categoriaKey];
    const baseIbpt = await carregarBaseIbpt();
    const faixaIbpt = obterFaixaIbpt(baseIbpt, categoria.ncm);

    if (faixaIbpt) {
      return {
        ...faixaIbpt,
        fallback: false,
        categoriaKey,
      };
    }

    return obterAliquotasFallback(categoria, categoriaKey);
  }

  function detectarCategoria(titulo) {
    const tituloNormalizado = normalizarTexto(titulo);

    for (const [categoria, palavras] of Object.entries(PALAVRAS_CHAVE)) {
      if (palavras.some((palavra) => tituloNormalizado.includes(normalizarTexto(palavra)))) {
        return categoria;
      }
    }

    return 'geral';
  }

  function detectarOrigem(preco, categoriaKey, titulo) {
    const categoria = CATEGORIAS[categoriaKey];

    if (!categoria.detectarOrigem) {
      return 'nac';
    }

    return categoria.detectarOrigem(normalizarTexto(titulo), preco);
  }

  async function calcularImpostos(preco, categoriaKey, origem) {
    const categoria = CATEGORIAS[categoriaKey];
    const aliquotas = await obterAliquotasCategoria(categoriaKey);
    const produtoImportado = origem === 'imp';
    const federal = produtoImportado ? aliquotas.importadosfederal : aliquotas.nacionalfederal;
    const estadual = aliquotas.estadual;
    const municipal = aliquotas.municipal || 0;

    const valorFederal = (preco * federal) / 100;
    const valorEstadual = (preco * estadual) / 100;
    const valorMunicipal = (preco * municipal) / 100;
    const total = valorFederal + valorEstadual + valorMunicipal;

    const origemLabelFull = produtoImportado
      ? 'II + IPI + PIS/COFINS + IOF + IRPJ/CSLL'
      : 'IPI + PIS/COFINS + IOF + IRPJ/CSLL';

    const itens = [
      { nome: `Tributos Federais (${origemLabelFull})`, taxa: federal / 100, valor: valorFederal },
      { nome: 'ICMS (Estadual)', taxa: estadual / 100, valor: valorEstadual },
    ];

    if (municipal > 0) {
      itens.push({ nome: 'Tributos Municipais', taxa: municipal / 100, valor: valorMunicipal });
    }

    return {
      catKey: categoriaKey,
      catNome: categoria.nome,
      ncm: aliquotas.ncm || categoria.ncm,
      isento: !!categoria.isento,
      preco,
      itens,
      total,
      precoSemImposto: preco - total,
      pct: total / preco,
      ibpt: {
        descricao: aliquotas.descricao,
        vigenciainicio: aliquotas.vigenciainicio,
        vigenciafim: aliquotas.vigenciafim,
        versao: aliquotas.versao,
        fonte: aliquotas.fonte,
        quantidadeBase: aliquotas.quantidadeBase,
        fallback: aliquotas.fallback,
      },
    };
  }

  ns.calculos = {
    detectarCategoria,
    detectarOrigem,
    calcularImpostos,
    carregarBaseIbpt,
  };
})(globalThis);
