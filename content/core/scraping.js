(function initPaginaMercadoLivre(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};

  function parseBRL(texto) {
    const valorLimpo = texto.replace(/[R$\s]/g, '').replace(/reais|pesos/gi, '').trim();

    if (valorLimpo.includes(',')) {
      return parseFloat(valorLimpo.replace(/\./g, '').replace(',', '.'));
    }

    return parseFloat(valorLimpo.replace(/\./g, ''));
  }

  function extrairPreco() {
    const seletores = [
      '.ui-pdp-price__second-line .andes-money-amount__fraction',
      '.ui-pdp-price .andes-money-amount__fraction',
      '[class*="price-tag-fraction"]',
      '.price-tag-fraction',
    ];

    for (const seletor of seletores) {
      const elemento = document.querySelector(seletor);
      if (!elemento) continue;

      const fracao = elemento.textContent.trim().replace(/\./g, '');
      const container = elemento.closest('.andes-money-amount');
      const centavosEl = container && container.querySelector('.andes-money-amount__cents');
      const centavos = centavosEl ? centavosEl.textContent.trim().padEnd(2, '0') : '00';
      const preco = parseFloat(`${fracao}.${centavos}`);

      if (!Number.isNaN(preco) && preco > 0) {
        return preco;
      }
    }

    const ariaEl = document.querySelector('.andes-money-amount[aria-label]');
    if (ariaEl) {
      const label = ariaEl.getAttribute('aria-label');
      const match = label && label.match(/[\d.,]+/);

      if (match) {
        const valor = parseBRL(match[0]);
        if (!Number.isNaN(valor) && valor > 0) {
          return valor;
        }
      }
    }

    const metaSelectors = [
      'meta[itemprop="price"]',
      'meta[property="product:price:amount"]',
      'meta[name="twitter:data1"]',
    ];

    for (const seletor of metaSelectors) {
      const meta = document.querySelector(seletor);
      const bruto = meta?.getAttribute('content') || meta?.getAttribute('value');
      if (!bruto) continue;

      const valor = bruto.includes(',') ? parseBRL(bruto) : parseFloat(bruto.replace(/,/g, ''));
      if (!Number.isNaN(valor) && valor > 0) {
        return valor;
      }
    }

    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const data = JSON.parse(script.textContent);
        const offer = data.offers || (Array.isArray(data) && data[0] && data[0].offers);

        if (offer && offer.price) {
          const valor = parseFloat(offer.price);
          if (!Number.isNaN(valor) && valor > 0) {
            return valor;
          }
        }
      } catch (_) {}
    }

    return null;
  }

  function extrairTitulo() {
    return (
      document.querySelector('h1.ui-pdp-title')?.textContent?.trim()
      || document.querySelector('[class*="item-title"]')?.textContent?.trim()
      || document.title
    );
  }

  function isPaginaProduto() {
    const url = location.href;

    if (!url.includes('mercadolivre.com.br')) return false;
    if (url.includes('/search') || url.includes('?q=') || url.includes('/categoria/')) return false;

    return !!(url.includes('/p/MLB') || url.match(/MLB\d+/) || document.querySelector('h1.ui-pdp-title'));
  }

  ns.paginaMercadoLivre = {
    parseBRL,
    extrairPreco,
    extrairTitulo,
    isPaginaProduto,
  };
})(globalThis);
