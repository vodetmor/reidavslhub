/* ============================================================
   QUIZ ENGINE — BetBoost 2.0
   State machine que controla o fluxo do quiz
   ============================================================ */

(function () {
  'use strict';

  // ─── State ───
  const state = {
    currentScreen: 'intro',
    currentQuestion: 0,
    scores: { impulso: 0, inconsistente: 0, estagnado: 0 },
    answers: [],
    profile: null
  };

  // ─── DOM References ───
  const screens = {
    intro: document.getElementById('screen-intro'),
    question: document.getElementById('screen-question'),
    preResult: document.getElementById('screen-pre-result'),
    vsl: document.getElementById('screen-vsl'),
    postVsl: document.getElementById('screen-post-vsl'),
    result: document.getElementById('screen-result'),
    cta: document.getElementById('screen-cta')
  };

  const els = {
    btnStart: document.getElementById('btnStart'),
    btnSeeHow: document.getElementById('btnSeeHow'),
    btnSeeResult: document.getElementById('btnSeeResult'),
    btnSeeDiagnosis: document.getElementById('btnSeeDiagnosis'),
    btnSeeOffer: document.getElementById('btnSeeOffer'),
    progressLabel: document.getElementById('progressLabel'),
    progressFill: document.getElementById('progressFill'),
    questionContent: document.getElementById('questionContent'),
    loadingPhase: document.getElementById('loadingPhase'),
    diagnosisPhase: document.getElementById('diagnosisPhase'),
    resultBadge: document.getElementById('resultBadge'),
    resultProfileType: document.getElementById('resultProfileType'),
    resultDiagnosis: document.getElementById('resultDiagnosis'),
    resultMethodList: document.getElementById('resultMethodList'),
    resultSwiperTrack: document.getElementById('resultSwiperTrack'),
    resultSwiperDots: document.getElementById('resultSwiperDots'),
    resultOfferIntro: document.getElementById('resultOfferIntro')
  };

  // ─── Background Map ───
  const bgMap = {
    intro: 'bg-intro',
    question: 'bg-question',
    preResult: 'bg-pre-result',
    vsl: null,
    postVsl: 'bg-post-vsl',
    result: 'bg-result',
    cta: 'bg-cta'
  };

  // ─── Screen Management ───
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    state.currentScreen = name;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Switch background layers
    document.querySelectorAll('.screen-bg').forEach(bg => bg.classList.remove('active'));
    const bgId = bgMap[name];
    if (bgId) {
      const bgEl = document.getElementById(bgId);
      if (bgEl) bgEl.classList.add('active');
    }
  }

  // ─── Render Question ───
  function renderQuestion(index) {
    const q = QUESTIONS[index];
    const num = index + 1;

    els.progressLabel.textContent = `Pergunta ${num} de 7`;
    els.progressFill.style.width = `${(num / 7) * 100}%`;

    els.questionContent.innerHTML = `
      <p class="question-context">${q.context}</p>
      <h3 class="question-title">${q.title}</h3>
      <div class="options-list" id="optionsList">
        ${q.options.map((opt, i) => `
          <div class="option-card" data-index="${i}" tabindex="0" role="button" aria-label="Opção ${opt.letter}">
            <span class="option-letter">${opt.letter}</span>
            <span class="option-text">${opt.text}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Re-trigger animation
    els.questionContent.style.animation = 'none';
    void els.questionContent.offsetHeight;
    els.questionContent.style.animation = '';

    // Bind option clicks
    document.querySelectorAll('#optionsList .option-card').forEach(card => {
      card.addEventListener('click', () => handleAnswer(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAnswer(card);
        }
      });
    });
  }

  let isProcessingAnswer = false;

  // ─── Handle Answer ───
  function handleAnswer(card) {
    if (isProcessingAnswer) return;
    isProcessingAnswer = true;

    const index = parseInt(card.dataset.index);
    const q = QUESTIONS[state.currentQuestion];
    const opt = q.options[index];

    // Block interaction during transition
    const optionsList = document.getElementById('optionsList');
    if (optionsList) optionsList.style.pointerEvents = 'none';

    // Visual feedback
    document.querySelectorAll('#optionsList .option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    // Record
    state.answers.push({ question: state.currentQuestion, answer: opt.letter });
    state.scores.impulso += opt.scores.impulso;
    state.scores.inconsistente += opt.scores.inconsistente;
    state.scores.estagnado += opt.scores.estagnado;

    // Advance after short delay
    setTimeout(() => {
      state.currentQuestion++;
      isProcessingAnswer = false;
      if (state.currentQuestion < QUESTIONS.length) {
        renderQuestion(state.currentQuestion);
      } else {
        goToPreResult();
      }
    }, 400);
  }

  // ─── Pre-Result Screen ───
  function goToPreResult() {
    showScreen('preResult');
    els.loadingPhase.style.display = '';
    els.diagnosisPhase.style.display = 'none';

    // Calculate profile while loading
    state.profile = calculateProfile(state.scores);

    // Show diagnosis after loading
    setTimeout(() => {
      els.loadingPhase.style.display = 'none';
      els.diagnosisPhase.style.display = '';
    }, 2800);
  }

  // ─── Render Result ───
  function renderResult() {
    const p = PROFILES[state.profile];

    els.resultBadge.textContent = `${p.emoji} Diagnóstico completo`;
    els.resultBadge.className = `badge ${p.badgeClass}`;

    els.resultProfileType.textContent = p.badge.replace('Seu perfil: ', '');
    els.resultDiagnosis.innerHTML = p.diagnosis.replace(/\n\n/g, '<br><br>');

    els.resultMethodList.innerHTML = p.methodItems.map(item =>
      `<div class="benefit-item"><span class="check-icon">✅</span><span class="benefit-text">${item}</span></div>`
    ).join('');

    // Build depoimentos swiper
    els.resultSwiperTrack.innerHTML = p.depoimentos.map(d =>
      `<div class="swiper-slide">
        <div class="depoimento-thumb" onclick="openLightbox('${d.src}')">
          <img src="${d.src}" alt="${d.alt}" loading="lazy">
        </div>
      </div>`
    ).join('');

    els.resultOfferIntro.textContent = p.offerIntro;

    // Init swiper after content is built
    setTimeout(() => {
      initSwiper('resultSwiperTrack', 'resultSwiperDots');
    }, 50);
  }

  // ─── Event Bindings ───
  els.btnStart.addEventListener('click', () => {
    showScreen('question');
    renderQuestion(0);
  });

  els.btnSeeHow.addEventListener('click', () => {
    showScreen('vsl');
  });

  els.btnSeeResult.addEventListener('click', () => {
    showScreen('postVsl');
  });

  els.btnSeeDiagnosis.addEventListener('click', () => {
    renderResult();
    showScreen('result');
  });

  els.btnSeeOffer.addEventListener('click', () => {
    showScreen('cta');
  });

})();
