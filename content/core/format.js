(function initFormatacao(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};

  function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatUSD(valor) {
    return valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  ns.formatacao = {
    formatBRL,
    formatUSD,
  };
})(globalThis);
