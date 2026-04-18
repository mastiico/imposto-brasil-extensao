(function initDadosTributarios(global) {
  'use strict';

  const ns = global.ImpostoBrasil = global.ImpostoBrasil || {};

  const CATEGORIAS = {
    smartphone: {
      nome: 'Smartphone / Celular',
      ncm: '8517.18',
      federal_nac: 15.53,
      federal_imp: 22.72,
      estadual: 18.0,
      detectarOrigem(t, preco) {
        if (['iphone', 'apple', 'pixel ', 'oneplus', 'poco ', 'redmi ', 'xiaomi ', 'realme', 'oppo', 'nothing phone'].some((b) => t.includes(b))) return 'imp';
        if (t.includes('galaxy s') || t.includes('galaxy z') || t.includes('galaxy fold') || t.includes('galaxy flip')) return 'imp';
        if (t.includes('samsung') || t.includes('galaxy a') || t.includes('galaxy m') || t.includes('galaxy f')) return 'nac';
        if (['motorola', 'moto g', 'moto e', 'moto edge'].some((b) => t.includes(b))) return 'nac';
        if (['positivo', 'multilaser'].some((b) => t.includes(b))) return 'nac';
        return preco >= 3000 ? 'imp' : 'nac';
      },
    },

    notebook: {
      nome: 'Notebook / Laptop',
      ncm: '8471.30',
      federal_nac: 21.28,
      federal_imp: 31.56,
      estadual: 18.0,
      detectarOrigem(t, preco) {
        if (['macbook', 'apple', 'surface', 'razer blade'].some((b) => t.includes(b))) return 'imp';
        if (['positivo', 'multilaser', 'avell'].some((b) => t.includes(b))) return 'nac';
        return preco >= 5000 ? 'imp' : 'nac';
      },
    },

    tablet: {
      nome: 'Tablet',
      ncm: '8471.41',
      federal_nac: 19.67,
      federal_imp: 31.33,
      estadual: 18.0,
      detectarOrigem(t, preco) {
        if (['ipad', 'apple', 'galaxy tab', 'samsung tab'].some((b) => t.includes(b))) return 'imp';
        if (['positivo', 'multilaser'].some((b) => t.includes(b))) return 'nac';
        return preco >= 2000 ? 'imp' : 'nac';
      },
    },

    tv: {
      nome: 'TV / Monitor',
      ncm: '8528.72',
      federal_nac: 23.95,
      federal_imp: 35.56,
      estadual: 18.0,
      detectarOrigem() {
        return 'nac';
      },
    },

    eletrodomestico: {
      nome: 'Eletrodoméstico',
      ncm: '8418.21',
      federal_nac: 18.87,
      federal_imp: 30.18,
      estadual: 18.0,
      detectarOrigem(t) {
        if (['brastemp', 'consul', 'electrolux', 'panasonic', 'lg ', 'samsung'].some((b) => t.includes(b))) return 'nac';
        return 'nac';
      },
    },

    games: {
      nome: 'Games / Console',
      ncm: '9504.50',
      federal_nac: 25.12,
      federal_imp: 37.8,
      estadual: 25.0,
      detectarOrigem() {
        return 'imp';
      },
    },

    audio: {
      nome: 'Áudio (Fone / Caixa de Som)',
      ncm: '8518.30',
      federal_nac: 15.92,
      federal_imp: 22.17,
      estadual: 18.0,
      detectarOrigem(t, preco) {
        if (['airpods', 'apple', 'sony wh', 'sony wf', 'bose', 'jbl ', 'samsung buds', 'galaxy buds', 'beats'].some((b) => t.includes(b))) return 'imp';
        if (['multilaser', 'positivo', 'mondial'].some((b) => t.includes(b))) return 'nac';
        return preco >= 500 ? 'imp' : 'nac';
      },
    },

    camera: {
      nome: 'Câmera Fotográfica / Filmadora',
      ncm: '8525.60',
      federal_nac: 15.92,
      federal_imp: 20.63,
      estadual: 18.0,
      detectarOrigem() {
        return 'imp';
      },
    },

    drone: {
      nome: 'Drone',
      ncm: '8806.22',
      federal_nac: 14.85,
      federal_imp: 16.85,
      estadual: 18.0,
      detectarOrigem() {
        return 'imp';
      },
    },

    componente_pc: {
      nome: 'Componente PC (GPU / CPU / SSD / RAM)',
      ncm: '8471.70',
      federal_nac: 19.58,
      federal_imp: 28.97,
      estadual: 18.0,
      detectarOrigem() {
        return 'imp';
      },
    },

    impressora: {
      nome: 'Impressora / Multifuncional',
      ncm: '8443.31',
      federal_nac: 20.56,
      federal_imp: 30.36,
      estadual: 18.0,
      detectarOrigem(t, preco) {
        if (['epson', 'canon', 'hp ', 'brother'].some((b) => t.includes(b))) return 'imp';
        return preco >= 600 ? 'imp' : 'nac';
      },
    },

    relogio: {
      nome: 'Relógio / Smartwatch',
      ncm: '9101',
      federal_nac: 15.15,
      federal_imp: 19.01,
      estadual: 18.0,
      detectarOrigem(t, preco) {
        if (['apple watch', 'galaxy watch', 'garmin', 'fossil', 'tissot', 'casio', 'orient'].some((b) => t.includes(b))) return 'imp';
        return preco >= 800 ? 'imp' : 'nac';
      },
    },

    vestuario: {
      nome: 'Roupa / Calçado',
      ncm: '6109',
      federal_nac: 13.45,
      federal_imp: 18.61,
      estadual: 18.0,
      detectarOrigem(t) {
        if (['nike', 'adidas', 'puma', 'new balance', 'tommy', 'lacoste', 'ralph lauren', 'levi'].some((b) => t.includes(b))) return 'imp';
        return 'nac';
      },
    },

    cosmetico: {
      nome: 'Cosmético / Maquiagem',
      ncm: '3304',
      federal_nac: 25.96,
      federal_imp: 41.9,
      estadual: 25.0,
      detectarOrigem(t, preco) {
        if (['mac ', 'nars', 'urban decay', 'charlotte', 'lancome', 'dior', 'chanel', 'ysl ', 'armani'].some((b) => t.includes(b))) return 'imp';
        if (['natura', 'avon', 'boticario', 'o boticario', 'quem disse', 'payot'].some((b) => t.includes(b))) return 'nac';
        return preco >= 200 ? 'imp' : 'nac';
      },
    },

    perfume: {
      nome: 'Perfume / Fragrância',
      ncm: '3303',
      federal_nac: 34.9,
      federal_imp: 50.84,
      estadual: 25.0,
      detectarOrigem(t, preco) {
        if (['dior', 'chanel', 'gucci', 'versace', 'armani', 'ysl', 'prada', 'burberry', 'lancome', 'hugo boss', 'carolina herrera', 'azzaro'].some((b) => t.includes(b))) return 'imp';
        if (['natura', 'boticario', 'o boticario', 'avon', 'eudora'].some((b) => t.includes(b))) return 'nac';
        return preco >= 300 ? 'imp' : 'nac';
      },
    },

    livro: {
      nome: 'Livro',
      ncm: '4901',
      federal_nac: 13.45,
      federal_imp: 15.45,
      estadual: 18.0,
      detectarOrigem() {
        return 'nac';
      },
      isento: true,
    },

    movel: {
      nome: 'Móvel / Decoração',
      ncm: '9401.61',
      federal_nac: 13.83,
      federal_imp: 17.53,
      estadual: 12.0,
      detectarOrigem() {
        return 'nac';
      },
    },

    brinquedo: {
      nome: 'Brinquedo',
      ncm: '9503',
      federal_nac: 14.19,
      federal_imp: 18.22,
      estadual: 18.0,
      detectarOrigem(t) {
        if (['lego', 'playmobil', 'nerf', 'hasbro', 'mattel'].some((b) => t.includes(b))) return 'imp';
        return 'nac';
      },
    },

    esporte: {
      nome: 'Esporte / Academia',
      ncm: '8712',
      federal_nac: 14.3,
      federal_imp: 19.22,
      estadual: 18.0,
      detectarOrigem(t) {
        if (['specialized', 'trek', 'cannondale', 'scott '].some((b) => t.includes(b))) return 'imp';
        return 'nac';
      },
    },

    ferramenta: {
      nome: 'Ferramenta / Equipamento',
      ncm: '8467',
      federal_nac: 15.02,
      federal_imp: 23.16,
      estadual: 18.0,
      detectarOrigem(t) {
        if (['makita', 'dewalt', 'bosch', 'stanley', 'black+decker', 'black & decker'].some((b) => t.includes(b))) return 'imp';
        return 'nac';
      },
    },

    suplemento: {
      nome: 'Suplemento Alimentar',
      ncm: '2106',
      federal_nac: 13.45,
      federal_imp: 26.64,
      estadual: 18.0,
      detectarOrigem(t) {
        if (['optimum nutrition', 'on whey', 'dymatize', 'muscletech', 'bsn ', 'usn '].some((b) => t.includes(b))) return 'imp';
        if (['integralmedica', 'max titanium', 'growth', 'probiotica', 'darkness'].some((b) => t.includes(b))) return 'nac';
        return 'nac';
      },
    },

    medicamento: {
      nome: 'Medicamento / Farmácia',
      ncm: '3004',
      federal_nac: 13.45,
      federal_imp: 16.81,
      estadual: 12.0,
      detectarOrigem() {
        return 'nac';
      },
    },

    alimento: {
      nome: 'Alimento / Bebida',
      ncm: '0901',
      federal_nac: 13.45,
      federal_imp: 15.45,
      estadual: 18.0,
      detectarOrigem() {
        return 'nac';
      },
    },

    pneu: {
      nome: 'Pneu / Peça Automotiva',
      ncm: '4011.10',
      federal_nac: 17.5,
      federal_imp: 28.61,
      estadual: 18.0,
      detectarOrigem(t) {
        if (['michelin', 'pirelli', 'bridgestone', 'continental', 'goodyear', 'dunlop'].some((b) => t.includes(b))) return 'imp';
        if (['fate', 'firestone'].some((b) => t.includes(b))) return 'nac';
        return 'nac';
      },
    },

    instrumento: {
      nome: 'Instrumento Musical',
      ncm: '9202',
      federal_nac: 13.45,
      federal_imp: 17.15,
      estadual: 18.0,
      detectarOrigem(t, preco) {
        if (['fender', 'gibson', 'marshall', 'yamaha', 'roland', 'korg'].some((b) => t.includes(b))) return 'imp';
        if (['tagima', 'giannini', 'rozini'].some((b) => t.includes(b))) return 'nac';
        return preco >= 1500 ? 'imp' : 'nac';
      },
    },

    geral: {
      nome: 'Produto Geral',
      ncm: '0000',
      federal_nac: 13.45,
      federal_imp: 15.45,
      estadual: 18.0,
      detectarOrigem() {
        return 'nac';
      },
    },
  };

  const PALAVRAS_CHAVE = {
    smartphone: ['celular', 'smartphone', 'iphone', 'galaxy', 'motorola', 'xiaomi', 'redmi', 'poco', 'realme', 'oneplus', 'pixel', 'moto g', 'moto e'],
    notebook: ['notebook', 'laptop', 'macbook', 'ultrabook', 'chromebook'],
    tablet: ['tablet', 'ipad', 'kindle'],
    tv: ['smart tv', 'televisão', 'televisor', 'tv led', 'tv qled', 'tv oled', 'tv 4k', 'tv 8k', 'polegadas'],
    eletrodomestico: ['geladeira', 'fogão', 'lavadora', 'máquina de lavar', 'ar condicionado', 'microondas', 'lava-louça', 'lava louça', 'secadora', 'freezer', 'ventilador', 'purificador'],
    games: ['playstation', 'xbox', 'nintendo', 'ps4', 'ps5', 'switch', 'jogo para', 'game para', 'console'],
    vestuario: ['roupa', 'camisa', 'camiseta', 'calça', 'vestido', 'tênis', 'sapato', 'calçado', 'jaqueta', 'bermuda', 'shorts', 'casaco', 'moletom', 'blusa', 'saia', 'legging', 'regata', 'meia ', 'cueca', 'sutiã', 'pijama', 'bota', 'sandália', 'chinelo', 'agasalho'],
    perfume: ['perfume', 'eau de parfum', 'eau de toilette', 'eau de cologne', 'fragrância', 'deo parfum'],
    cosmetico: ['cosmético', 'maquiagem', 'batom', 'creme facial', 'shampoo', 'condicionador', 'base liquida', 'blush', 'sombra'],
    livro: ['livro', ' book ', 'romance ', 'mangá', 'quadrinho', 'gibi'],
    audio: ['fone de ouvido', 'headphone', 'headset', 'caixa de som', 'alto-falante', 'soundbar', 'earphone', 'airpods', 'earbuds', 'speaker'],
    camera: ['câmera', 'camera ', 'filmadora', 'lente ', 'dslr', 'mirrorless', 'gopro', 'action cam'],
    drone: ['drone', 'dji ', 'quadricóptero'],
    componente_pc: ['placa de vídeo', 'placa mãe', 'processador', 'memória ram', ' ram ', ' ssd ', ' hd ', 'fonte atx', 'cooler', 'gabinete', 'rtx ', 'rx ', 'ryzen', 'intel core', 'nvme'],
    impressora: ['impressora', 'scanner', 'multifuncional', 'cartucho', 'toner'],
    relogio: ['relógio', 'smartwatch', 'apple watch', 'galaxy watch', 'relogio'],
    movel: ['sofá', 'cadeira', 'mesa ', 'guarda-roupa', 'cama ', 'colchão', 'estante', 'armário', 'rack ', 'escrivaninha', 'prateleira'],
    brinquedo: ['brinquedo', 'boneca', 'carrinho de brinquedo', 'lego', 'playmobil', 'nerf', 'massinha'],
    esporte: ['bicicleta', 'haltere', 'kettlebell', 'esteira', 'bola ', 'raquete', 'patins', 'skate', 'musculação', 'prancha'],
    ferramenta: ['furadeira', 'parafusadeira', 'marreta', 'chave de fenda', 'alicate', 'serrote', 'makita', 'dewalt', 'bosch'],
    suplemento: ['whey', 'creatina', 'suplemento', 'proteína em pó', 'bcaa', 'pré-treino', 'termogênico'],
    medicamento: ['remédio', 'medicamento', 'comprimido', 'cápsula ', 'pomada', 'antibiótico', 'vitamina ', 'dipirona', 'ibuprofeno'],
    alimento: ['café ', 'chocolate', 'biscoito', 'suco ', 'leite ', 'arroz ', 'feijão', 'macarrão', 'azeite', 'bebida '],
    pneu: ['pneu', 'amortecedor', 'pastilha de freio', 'filtro de óleo', 'óleo motor', 'escapamento'],
    instrumento: ['violão', 'guitarra', 'teclado musical', 'bateria ', 'contrabaixo', 'ukulele', 'saxofone', 'trompete', 'flauta'],
  };

  ns.dadosTributarios = {
    CATEGORIAS,
    PALAVRAS_CHAVE,
  };
})(globalThis);
