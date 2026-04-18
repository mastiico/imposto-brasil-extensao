(function initComparacaoInternacional(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};

  async function buscarCotacao() {
    const resposta = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    const data = await resposta.json();
    return parseFloat(data.USDBRL.bid);
  }

  function calcularComparacaoAPartirDeUSD(precoUSD, cotacao) {
    if (!Number.isFinite(precoUSD) || precoUSD <= 0) {
      throw new Error('Preço em USD inválido para comparação.');
    }

    let malaUSD;
    if (precoUSD <= 500) {
      malaUSD = precoUSD;
    } else {
      malaUSD = precoUSD + (precoUSD - 500) * 0.5;
    }

    const remessaUSD = (precoUSD * 1.2) / (1 - 0.17);

    return {
      cotacao,
      precoUSD,
      mala: { usd: malaUSD, brl: malaUSD * cotacao },
      remessa: { usd: remessaUSD, brl: remessaUSD * cotacao },
    };
  }

  function calcularComparacaoAPartirDeBRL(precoBRL, cotacao) {
    if (!Number.isFinite(precoBRL) || precoBRL <= 0) {
      throw new Error('Preço em BRL inválido para comparação.');
    }

    return calcularComparacaoAPartirDeUSD(precoBRL / cotacao, cotacao);
  }

  async function buscarPrecoAmazon(titulo) {
    try {
      const url = `https://www.amazon.com/s?k=${encodeURIComponent(titulo)}`;
      const resposta = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!resposta.ok) {
        throw new Error('Falha na requisição');
      }

      const html = await resposta.text();
      const match = html.match(/class="a-offscreen">\$([0-9,.]+)/);

      if (match) {
        const preco = parseFloat(match[1].replace(/,/g, ''));
        if (!Number.isNaN(preco) && preco > 0) {
          return { price_usd: preco, fonte: 'Amazon' };
        }
      }
    } catch (erro) {
      console.error('Erro ao buscar na Amazon:', erro);
    }

    return { price_usd: null, fonte: null };
  }

  ns.comparacaoInternacional = {
    buscarCotacao,
    calcularComparacaoAPartirDeUSD,
    calcularComparacaoAPartirDeBRL,
    buscarPrecoAmazon,
  };
})(globalThis);
