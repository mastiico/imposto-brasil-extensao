(function initRuntime(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};

  ns.runtime = {
    OVERLAY_ID: 'imposto-brasil-overlay',
    MAX_TENTATIVAS: 12,
    DELAY_MS: 700,
    IBPT_CSV_PATH: 'IBPT/f6a7e528b1f3f2a892b998998becac1f.csv',
  };
})(globalThis);
