(function initConteudo(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};
  const runtime = ns.runtime;
  const calculos = ns.calculos;
  const paginaMercadoLivre = ns.paginaMercadoLivre;
  const overlayApi = ns.overlay;

  if (!runtime || !calculos || !paginaMercadoLivre || !overlayApi) {
    console.error('[Imposto Brasil] Falha ao inicializar modulos do content script.', {
      runtime: !!runtime,
      calculos: !!calculos,
      paginaMercadoLivre: !!paginaMercadoLivre,
      overlay: !!overlayApi,
      url: location.href,
    });
    return;
  }

  const { OVERLAY_ID, MAX_TENTATIVAS, DELAY_MS } = runtime;
  const { detectarCategoria, detectarOrigem, calcularImpostos } = calculos;
  const { extrairPreco, extrairTitulo, isPaginaProduto } = paginaMercadoLivre;
  const { criarOverlay } = overlayApi;

  let tentativas = 0;

  async function tentarInjetar() {
    try {
      if (tentativas >= MAX_TENTATIVAS) return;
      tentativas += 1;

      if (!isPaginaProduto()) return;

      const titulo = extrairTitulo();
      const preco = extrairPreco();

      if (!preco || preco <= 0) {
        setTimeout(tentarInjetar, DELAY_MS);
        return;
      }

      document.getElementById(OVERLAY_ID)?.remove();

      const categoriaKey = detectarCategoria(titulo || '');
      const origemAuto = detectarOrigem(preco, categoriaKey, titulo || '');
      const [calcNac, calcImp] = await Promise.all([
        calcularImpostos(preco, categoriaKey, 'nac'),
        calcularImpostos(preco, categoriaKey, 'imp'),
      ]);
      const overlay = criarOverlay(calcNac, calcImp, origemAuto, titulo || '');

      if (!document.body) {
        console.warn('[Imposto Brasil] document.body indisponivel no momento da injecao.', {
          url: location.href,
          titulo,
        });
        setTimeout(tentarInjetar, DELAY_MS);
        return;
      }

      document.body.appendChild(overlay);
    } catch (erro) {
      console.error('[Imposto Brasil] Erro ao injetar overlay.', {
        erro,
        url: location.href,
        readyState: document.readyState,
      });
    }
  }

  function injetar() {
    document.getElementById(OVERLAY_ID)?.remove();
    tentativas = 0;
    setTimeout(() => {
      tentarInjetar();
    }, 600);
  }

  let ultimaUrl = location.href;

  new MutationObserver(() => {
    if (location.href !== ultimaUrl) {
      ultimaUrl = location.href;
      injetar();
    }
  }).observe(document.documentElement, { subtree: true, childList: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injetar);
  } else {
    injetar();
  }
})(globalThis);
