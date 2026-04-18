(function initOverlay(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};
  const { OVERLAY_ID } = ns.runtime;
  const { formatBRL, formatUSD } = ns.formatacao;
  const {
    buscarCotacao,
    calcularComparacaoAPartirDeUSD,
    calcularComparacaoAPartirDeBRL,
    buscarPrecoAmazon,
  } = ns.comparacaoInternacional;

  function criarOverlay(calcNac, calcImp, origemAuto, titulo) {
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;

    const ibptInfo = calcNac.ibpt || {};
    const fonteIbpt = ibptInfo.fallback
      ? 'Fallback local de aliquotas'
      : `IBPT ${ibptInfo.versao || ''}`.trim();
    const vigenciaIbpt = ibptInfo.vigenciainicio && ibptInfo.vigenciafim
      ? `vigencia ${ibptInfo.vigenciainicio} a ${ibptInfo.vigenciafim}`
      : 'vigencia nao informada';

    overlay.innerHTML = `
      <div class="ib-header">
        <span class="ib-logo">&#127463;&#127479; Imposto Brasil</span>
        <div class="ib-actions">
          <button class="ib-min" title="Minimizar">&#8722;</button>
          <button class="ib-close" title="Fechar">&#215;</button>
        </div>
      </div>
      <div class="ib-body">
        <div class="ib-cat">${calcNac.catNome} &nbsp;&#183;&nbsp; <span class="ib-ncm">NCM ${calcNac.ncm}</span></div>

        <div class="ib-toggle-row">
          <span class="ib-toggle-label">Origem:</span>
          <div class="ib-toggle">
            <button class="ib-tog-nac" data-orig="nac">&#127968; Nacional</button>
            <button class="ib-tog-imp" data-orig="imp">&#9992;&#65039; Importado</button>
          </div>
          <span class="ib-auto-badge">auto</span>
        </div>

        <div class="ib-preco-total">${formatBRL(calcNac.preco)}</div>

        <div class="ib-barra">
          <div class="ib-barra-imposto"></div>
          <div class="ib-barra-produto"></div>
        </div>
        <div class="ib-barra-labels">
          <span class="ib-label-imp"></span>
          <span class="ib-label-prod"></span>
        </div>

        <div class="ib-resumo">
          <div class="ib-linha">
            <span>Impostos embutidos</span>
            <span class="ib-val-imposto"></span>
          </div>
          <div class="ib-linha">
            <span>Produto sem imposto</span>
            <span class="ib-val-produto"></span>
          </div>
        </div>

        <details class="ib-detalhes">
          <summary>Ver detalhamento por imposto</summary>
          <table class="ib-tabela">
            <thead><tr><th>Componente</th><th>%</th><th>Valor</th></tr></thead>
            <tbody class="ib-tbody"></tbody>
          </table>
          <div class="ib-isento-wrap"></div>
          <p class="ib-obs">Fonte: ${fonteIbpt} (${vigenciaIbpt}). Federal inclui II, IPI, PIS/COFINS, IOF, IRPJ e CSLL acumulados na cadeia. Valores variam por estado e regime tributario.</p>
        </details>

        <button class="ib-usd-btn">&#128181; Comparar preco nos EUA</button>
        <div class="ib-usd-panel" style="display:none"></div>
      </div>
    `;

    const calcs = { nac: calcNac, imp: calcImp };
    let origemAtual = origemAuto;

    function renderOrigem(origem) {
      origemAtual = origem;

      const calculoAtual = calcs[origem];
      const percentualImposto = Math.round(calculoAtual.pct * 100);
      const cor = percentualImposto >= 45
        ? '#b71c1c'
        : percentualImposto >= 35
          ? '#c62828'
          : percentualImposto >= 25
            ? '#e65100'
            : '#f9a825';

      overlay.querySelector('.ib-barra-imposto').style.cssText = `width:${percentualImposto}%;background:${cor}`;
      overlay.querySelector('.ib-barra-produto').style.cssText = `width:${100 - percentualImposto}%`;
      overlay.querySelector('.ib-label-imp').textContent = `Imposto ${percentualImposto}%`;
      overlay.querySelector('.ib-label-imp').style.color = cor;
      overlay.querySelector('.ib-label-prod').textContent = `Produto ${100 - percentualImposto}%`;
      overlay.querySelector('.ib-val-imposto').textContent = formatBRL(calculoAtual.total);
      overlay.querySelector('.ib-val-produto').textContent = formatBRL(calculoAtual.precoSemImposto);

      overlay.querySelector('.ib-tbody').innerHTML = calculoAtual.itens.map((item) => `
        <tr>
          <td>${item.nome}</td>
          <td>${(item.taxa * 100).toFixed(2)}%</td>
          <td>${formatBRL(item.valor)}</td>
        </tr>
      `).join('');

      overlay.querySelector('.ib-isento-wrap').innerHTML = calculoAtual.isento
        ? '<div class="ib-isento">&#9989; Imune de ICMS/IPI/PIS/COFINS na venda ao consumidor. Valores refletem impostos na cadeia produtiva (IBPT).</div>'
        : '';

      overlay.querySelector('.ib-tog-nac').classList.toggle('ib-tog-ativo', origem === 'nac');
      overlay.querySelector('.ib-tog-imp').classList.toggle('ib-tog-ativo', origem === 'imp');
      overlay.querySelector('.ib-auto-badge').style.display = origem === origemAuto ? 'inline' : 'none';
    }

    overlay.querySelectorAll('.ib-toggle button').forEach((botao) => {
      botao.addEventListener('click', () => renderOrigem(botao.dataset.orig));
    });

    renderOrigem(origemAuto);

    const usdBtn = overlay.querySelector('.ib-usd-btn');
    const usdPanel = overlay.querySelector('.ib-usd-panel');
    let usdCarregado = false;

    usdBtn.addEventListener('click', async () => {
      if (usdCarregado) {
        usdPanel.style.display = usdPanel.style.display === 'none' ? 'block' : 'none';
        usdBtn.textContent = usdPanel.style.display === 'none'
          ? 'Abrir comparacao USD'
          : 'Fechar comparacao USD';
        return;
      }

      usdBtn.textContent = 'Buscando cotacao e preco...';
      usdBtn.disabled = true;

      try {
        const cotacao = await buscarCotacao();
        const calcAtual = calcs[origemAtual];

        let precoUSAReal = null;
        let fonteUSA = null;

        try {
          usdBtn.textContent = 'Buscando preco na Amazon...';
          const resultado = await buscarPrecoAmazon(titulo);
          if (resultado.price_usd) {
            precoUSAReal = resultado.price_usd;
            fonteUSA = resultado.fonte || 'Amazon';
          }
        } catch (_) {}

        const comparacao = precoUSAReal
          ? calcularComparacaoAPartirDeUSD(precoUSAReal, cotacao)
          : calcularComparacaoAPartirDeBRL(calcAtual.precoSemImposto, cotacao);

        const economiaMala = calcAtual.preco - comparacao.mala.brl;
        const economiaRemessa = calcAtual.preco - comparacao.remessa.brl;

        function linhaEconomia(economia) {
          if (economia > 0) return `<span class="ib-eco-pos">economia de ${formatBRL(economia)}</span>`;
          if (economia < 0) return `<span class="ib-eco-neg">mais caro em ${formatBRL(-economia)}</span>`;
          return '<span>mesmo preco</span>';
        }

        const badgePreco = precoUSAReal
          ? `<span class="ib-badge-real">&#9679; preco real na ${fonteUSA}</span>`
          : '<span class="ib-badge-est">&#9675; estimado</span>';

        usdPanel.innerHTML = `
          <div class="ib-usd-titulo">&#127482;&#127480; Comparacao com EUA</div>
          <div class="ib-usd-cambio">Cambio atual: <strong>R$ ${cotacao.toFixed(2)}</strong> / US$ 1</div>

          <div class="ib-usd-tabela">
            <div class="ib-usd-linha ib-usd-header">
              <span>Cenario</span><span>Total em R$</span><span>vs Brasil</span>
            </div>
            <div class="ib-usd-linha">
              <span>&#127482;&#127480; Preco EUA ${badgePreco}<br><small>(valor original em USD, convertido so para comparar)</small></span>
              <span>${formatBRL(comparacao.precoUSD * cotacao)}<br><small>${formatUSD(comparacao.precoUSD)}</small></span>
              <span>${linhaEconomia(calcAtual.preco - comparacao.precoUSD * cotacao)}</span>
            </div>
            <div class="ib-usd-linha">
              <span>Trazer na mala<br><small>isento ate US$500; acima +50%</small></span>
              <span>${formatBRL(comparacao.mala.brl)}<br><small>${formatUSD(comparacao.mala.usd)}</small></span>
              <span>${linhaEconomia(economiaMala)}</span>
            </div>
            <div class="ib-usd-linha">
              <span>Remessa Conforme<br><small>+20% II + 17% ICMS</small></span>
              <span>${formatBRL(comparacao.remessa.brl)}<br><small>${formatUSD(comparacao.remessa.usd)}</small></span>
              <span>${linhaEconomia(economiaRemessa)}</span>
            </div>
          </div>
        `;

        usdPanel.style.display = 'block';
        usdCarregado = true;
        usdBtn.textContent = 'Fechar comparacao USD';
        usdBtn.disabled = false;
      } catch (_) {
        usdBtn.textContent = 'Erro ao buscar cotacao';
        usdBtn.disabled = false;
      }
    });

    overlay.querySelector('.ib-close').addEventListener('click', () => overlay.remove());

    const body = overlay.querySelector('.ib-body');
    const minBtn = overlay.querySelector('.ib-min');
    let minimizado = false;

    minBtn.addEventListener('click', () => {
      minimizado = !minimizado;
      body.style.display = minimizado ? 'none' : 'block';
      minBtn.textContent = minimizado ? '+' : '-';
    });

    return overlay;
  }

  ns.overlay = {
    criarOverlay,
  };
})(globalThis);
