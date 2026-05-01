/* ============================================================
   PROFILE CALCULATOR — BetBoost 2.0 Quiz
   Calcula o perfil do apostador baseado nas respostas
   ============================================================ */

const PROFILES = {
  A: {
    id: 'impulso',
    badge: 'Seu perfil: Apostador no impulso',
    badgeClass: 'badge-impulso',
    emoji: '🔴',
    title: 'Você não perde por falta de sorte. Você perde porque entra antes de ter motivo suficiente para entrar.',
    diagnosis: `Toda vez que você sente que o jogo "vai virar", você entra. Quando vê uma odd caindo, corre para apostar. E nos dias em que a sequência de Red começa, a reação é dobrar a stake para "recuperar rápido".\n\nEsse padrão é o mais comum entre apostadores que não conseguem crescer a banca. Porque o problema não está no quanto você sabe sobre futebol. Está em como você decide quando entrar.\n\nSem critério claro de entrada, qualquer jogo parece oportunidade. E quando tudo é oportunidade, nada é filtrado.`,
    methodTitle: 'O que muda com método:',
    methodItems: [
      'Critério objetivo de entrada baseado em dados, não em feeling',
      'Filtro automático que elimina jogos sem padrão estatístico',
      'Regra de stop loss que protege a banca nos dias ruins',
      'Sistema de stake proporcional que impede overbet',
      'Histórico de +8.500 jogos para validar cada decisão'
    ],
    depoimentos: [
      { src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.28-2.jpeg', alt: 'R$2.800 em poucos dias com Lay' },
      { src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.26.jpeg', alt: 'Faturou o mês todo na Bet365' }
    ],
    offerIntro: 'Você não precisa de mais força de vontade. Precisa de um sistema que tome a decisão por você antes de entrar no mercado. O BetBoost é esse sistema.'
  },
  B: {
    id: 'inconsistente',
    badge: 'Seu perfil: Apostador inconsistente',
    badgeClass: 'badge-inconsistente',
    emoji: '🟡',
    title: 'Você já sabe mais do que a maioria. O problema é que seu resultado ainda depende do seu humor no dia.',
    diagnosis: `Você tem noção de gestão. Sabe que não deveria apostar tudo em uma única entrada. Já pesquisou sobre mercados, já tentou seguir uma estratégia. Mas quando vem a pressão, a disciplina cai.\n\nNos dias bons, o resultado aparece. Nos dias ruins, volta ao padrão antigo. E a banca fica nessa gangorra: cresce, cai, cresce, cai.\n\nO que falta não é conhecimento. É um sistema que funcione nos dias em que você está cansado, frustrado ou sem paciência.`,
    methodTitle: 'O que muda com método:',
    methodItems: [
      'Sistema de filtros que funciona igual nos dias bons e ruins',
      'Alertas automáticos em tempo real — você não precisa ficar monitorando',
      'Controle de risco embutido no processo, não na sua disciplina',
      'Comunidade com +31k apostadores seguindo o mesmo padrão',
      'Dados validados que tiram a emoção da equação'
    ],
    depoimentos: [
      { src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.28-3.jpeg', alt: '16 operações, 16 greens seguidos' },
      { src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.26-3.jpeg', alt: '26 jogos, 23 acertos - 88.5%' }
    ],
    offerIntro: 'Você tem o conhecimento. O que falta é um sistema que mantenha sua operação consistente mesmo quando você não está no seu melhor dia. O BetBoost entrega exatamente isso.'
  },
  C: {
    id: 'estagnado',
    badge: 'Seu perfil: Apostador estagnado',
    badgeClass: 'badge-estagnado',
    emoji: '🟢',
    title: 'Você faz tudo certo e ainda assim a banca não cresce do jeito que deveria. O problema não é você. É o mercado que você está operando.',
    diagnosis: `Você já tem disciplina. Já controla stake, já evita overbet, já tem algum critério de entrada. Mas a banca estagnou. O lucro é pequeno demais para o tempo investido.\n\nIsso acontece quando o apostador está operando em mercados de margem baixa, sem as ferramentas certas para identificar oportunidades de alto retorno com risco controlado.\n\nVocê não precisa de mais disciplina. Precisa de acesso a dados, filtros e um mercado que pague melhor pelo seu tempo.`,
    methodTitle: 'O que muda com método:',
    methodItems: [
      'Acesso a mercados de placar exato com taxas acima de 93%',
      'Ferramenta Qual Placar com dados em tempo real',
      'Estratégias de Lay com histórico validado em +8.500 jogos',
      'Filtros de entrada que identificam oportunidades de alta margem',
      'Comunidade ativa com indicações diárias em 8 grupos'
    ],
    depoimentos: [
      { src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.28.jpeg', alt: '3 alavancagens de banca em 15 dias' },
      { src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.26-2.jpeg', alt: 'QualPlacar indispensável para entradas' }
    ],
    offerIntro: 'Você já tem a base. O que falta é a ferramenta certa para destravar o próximo nível. O BetBoost foi criado para apostadores como você.'
  }
};

/**
 * Cada pergunta tem 4 opções. Cada opção soma pontos para um perfil.
 * A = Impulso, B/C = Inconsistente, D = Estagnado
 */
const QUESTIONS = [
  {
    context: 'Vamos começar pelo básico.',
    title: 'Quantos dias por semana você faz apostas esportivas?',
    options: [
      { letter: 'A', text: 'Todos os dias, sem exceção', scores: { impulso: 2, inconsistente: 0, estagnado: 0 } },
      { letter: 'B', text: 'Quase todo dia, mas sem uma rotina definida', scores: { impulso: 1, inconsistente: 1, estagnado: 0 } },
      { letter: 'C', text: 'Alguns dias por semana, quando vejo que tem jogo bom', scores: { impulso: 0, inconsistente: 1, estagnado: 1 } },
      { letter: 'D', text: 'Só quando encontro oportunidade dentro do meu critério', scores: { impulso: 0, inconsistente: 0, estagnado: 2 } }
    ]
  },
  {
    context: 'Agora pense nos dias difíceis.',
    title: 'Quando você pega uma sequência de Red, o que faz?',
    options: [
      { letter: 'A', text: 'Aumento a stake para tentar recuperar rápido', scores: { impulso: 2, inconsistente: 0, estagnado: 0 } },
      { letter: 'B', text: 'Fico nervoso, mas tento manter o plano — nem sempre consigo', scores: { impulso: 1, inconsistente: 1, estagnado: 0 } },
      { letter: 'C', text: 'Paro por um tempo, respiro e volto depois', scores: { impulso: 0, inconsistente: 1, estagnado: 1 } },
      { letter: 'D', text: 'Sigo o stop loss e encerro o dia sem alterar a estratégia', scores: { impulso: 0, inconsistente: 0, estagnado: 2 } }
    ]
  },
  {
    context: 'Sobre sua gestão de banca.',
    title: 'Quanto da sua banca você costuma arriscar por entrada?',
    options: [
      { letter: 'A', text: 'Não controlo muito — depende da confiança no jogo', scores: { impulso: 2, inconsistente: 0, estagnado: 0 } },
      { letter: 'B', text: 'Tento manter um padrão, mas às vezes exagero', scores: { impulso: 1, inconsistente: 1, estagnado: 0 } },
      { letter: 'C', text: 'Uso de 2% a 5% da banca por entrada', scores: { impulso: 0, inconsistente: 1, estagnado: 1 } },
      { letter: 'D', text: 'Tenho uma regra fixa de stake e nunca passo', scores: { impulso: 0, inconsistente: 0, estagnado: 2 } }
    ]
  },
  {
    context: 'Hora da verdade.',
    title: 'Quando você sente que um jogo "vai dar Green", o que faz?',
    options: [
      { letter: 'A', text: 'Entro na hora, sem pensar muito', scores: { impulso: 2, inconsistente: 0, estagnado: 0 } },
      { letter: 'B', text: 'Entro, mas depois fico em dúvida se deveria ter entrado', scores: { impulso: 1, inconsistente: 1, estagnado: 0 } },
      { letter: 'C', text: 'Verifico rapidamente se faz sentido antes de entrar', scores: { impulso: 0, inconsistente: 1, estagnado: 1 } },
      { letter: 'D', text: 'Só entro se os dados confirmarem — nunca por feeling', scores: { impulso: 0, inconsistente: 0, estagnado: 2 } }
    ]
  },
  {
    context: 'Sobre sua metodologia.',
    title: 'Você usa algum tipo de filtro ou critério para escolher os jogos em que entra?',
    options: [
      { letter: 'A', text: 'Não — entro nos que parecem bons na hora', scores: { impulso: 2, inconsistente: 0, estagnado: 0 } },
      { letter: 'B', text: 'Às vezes olho as odds e o time, mas nada fixo', scores: { impulso: 1, inconsistente: 1, estagnado: 0 } },
      { letter: 'C', text: 'Uso alguns filtros simples (favorito, odd, liga)', scores: { impulso: 0, inconsistente: 1, estagnado: 1 } },
      { letter: 'D', text: 'Tenho um método com regras claras de entrada', scores: { impulso: 0, inconsistente: 0, estagnado: 2 } }
    ]
  },
  {
    context: 'Sobre foco.',
    title: 'Você aposta em um mercado específico ou varia bastante?',
    options: [
      { letter: 'A', text: 'Vario bastante — onde a odd parece boa, eu entro', scores: { impulso: 2, inconsistente: 0, estagnado: 0 } },
      { letter: 'B', text: 'Tenho preferência por um mercado, mas acabo variando', scores: { impulso: 1, inconsistente: 1, estagnado: 0 } },
      { letter: 'C', text: 'Foco em 2 ou 3 mercados que conheço melhor', scores: { impulso: 0, inconsistente: 1, estagnado: 1 } },
      { letter: 'D', text: 'Opero em um mercado só, com estratégia definida', scores: { impulso: 0, inconsistente: 0, estagnado: 2 } }
    ]
  },
  {
    context: 'Última pergunta. Reflita com sinceridade.',
    title: 'Na sua opinião, qual é o maior motivo da sua banca não crescer?',
    options: [
      { letter: 'A', text: 'Entro em jogos demais por impulso e sem critério', scores: { impulso: 2, inconsistente: 0, estagnado: 0 } },
      { letter: 'B', text: 'Falta disciplina — sei o que fazer, mas não consigo manter', scores: { impulso: 1, inconsistente: 1, estagnado: 0 } },
      { letter: 'C', text: 'Tenho consistência, mas o lucro é pequeno demais', scores: { impulso: 0, inconsistente: 1, estagnado: 1 } },
      { letter: 'D', text: 'Não encontrei ainda o mercado ou método certo', scores: { impulso: 0, inconsistente: 0, estagnado: 2 } }
    ]
  }
];

/**
 * Calcula o perfil baseado nos scores acumulados
 * @param {Object} scores - { impulso: N, inconsistente: N, estagnado: N }
 * @returns {string} - 'A', 'B' ou 'C'
 */
function calculateProfile(scores) {
  const { impulso, inconsistente, estagnado } = scores;

  if (impulso >= inconsistente && impulso >= estagnado) return 'A';
  if (inconsistente >= impulso && inconsistente >= estagnado) return 'B';
  return 'C';
}
