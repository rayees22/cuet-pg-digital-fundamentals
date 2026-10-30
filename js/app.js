/**
 * Main UI Controller & Keyboard Navigation Handler
 * Modeled on NTA CUET PG Testing Platform Architecture
 */

(function () {
  'use strict';

  // Core singletons
  const audio = window.quizAudio;
  const storage = window.quizStorage;
  const data = window.CUET_DF_DATA;

  if (!data || !Array.isArray(data.questions)) {
    console.error('CUET_DF_DATA question bank missing or invalid!');
    return;
  }

  const engine = new window.QuizEngine(data);

  // App UI State
  let timerInterval = null;
  let currentReviewFilter = 'all';

  // HTML Entity Escaper for safe innerHTML interpolation
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // DOM Elements - Screens
  const screenSetup = document.getElementById('screen-setup');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenResults = document.getElementById('screen-results');

  // Header Elements
  const headerBrand = document.getElementById('header-brand');
  const btnPaletteToggle = document.getElementById('btn-palette-toggle');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  // Setup Screen Elements
  const resumeBanner = document.getElementById('resume-banner');
  const resumeSummary = document.getElementById('resume-summary');
  const btnResumeSession = document.getElementById('btn-resume-session');
  const btnDiscardSession = document.getElementById('btn-discard-session');
  const topicSelectorContainer = document.getElementById('topic-selector-container');
  const topicSelectedBadge = document.getElementById('topic-selected-badge');
  const countSelectorGroup = document.getElementById('count-selector-group');
  const btnStartQuiz = document.getElementById('btn-start-quiz');

  // Quiz Arena Elements
  const arenaScopeBadge = document.getElementById('arena-scope-badge');
  const arenaCorrectCount = document.getElementById('arena-correct-count');
  const arenaIncorrectCount = document.getElementById('arena-incorrect-count');
  const arenaScoreDisplay = document.getElementById('arena-score-display');
  const arenaTimerDisplay = document.getElementById('arena-timer-display');
  const progressStatusText = document.getElementById('progress-status-text');
  const progressPercentageText = document.getElementById('progress-percentage-text');
  const progressBarFill = document.getElementById('progress-bar-fill');

  const qCounterBadge = document.getElementById('q-counter-badge');
  const qBankBadge = document.getElementById('q-bank-badge');
  const qUnitBadge = document.getElementById('q-unit-badge');
  const qDiffBadge = document.getElementById('q-diff-badge');
  const btnBookmarkQuestion = document.getElementById('btn-bookmark-question');
  const iconBookmarkEmpty = document.getElementById('icon-bookmark-empty');
  const iconBookmarkFilled = document.getElementById('icon-bookmark-filled');
  const bookmarkLabel = document.getElementById('bookmark-label');
  const qStatementText = document.getElementById('q-statement-text');
  const optionsContainer = document.getElementById('options-container');

  const solutionContainer = document.getElementById('solution-container');
  const feedbackBanner = document.getElementById('feedback-banner');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');
  const explanationContentText = document.getElementById('explanation-content-text');
  const trapContentText = document.getElementById('trap-content-text');

  const btnPrevQuestion = document.getElementById('btn-prev-question');
  const btnSkipQuestion = document.getElementById('btn-skip-question');
  const btnRestartQuiz = document.getElementById('btn-restart-quiz');
  const btnNextQuestion = document.getElementById('btn-next-question');
  const nextButtonLabel = document.getElementById('next-button-label');

  // Results Screen Elements
  const scoreCircleBar = document.getElementById('score-circle-bar');
  const resultScoreBig = document.getElementById('result-score-big');
  const resultScoreTotal = document.getElementById('result-score-total');
  const resultTierBadge = document.getElementById('result-tier-badge');
  const resultHeadingText = document.getElementById('result-heading-text');
  const resultCommentText = document.getElementById('result-comment-text');
  const resultNetMarks = document.getElementById('result-net-marks');

  const metricAttempted = document.getElementById('metric-attempted');
  const metricCorrect = document.getElementById('metric-correct');
  const metricIncorrect = document.getElementById('metric-incorrect');
  const metricSkipped = document.getElementById('metric-skipped');
  const metricAccuracy = document.getElementById('metric-accuracy');
  const metricTime = document.getElementById('metric-time');

  const btnActionReviewMistakes = document.getElementById('btn-action-review-mistakes');
  const btnActionRetakeMissed = document.getElementById('btn-action-retake-missed');
  const btnActionRestartThis = document.getElementById('btn-action-restart-this');
  const btnActionNewQuiz = document.getElementById('btn-action-new-quiz');

  const unitBreakdownContainer = document.getElementById('unit-breakdown-container');
  const reviewItemsContainer = document.getElementById('review-items-container');

  const filterAll = document.getElementById('filter-all');
  const filterMistakes = document.getElementById('filter-mistakes');
  const filterSkipped = document.getElementById('filter-skipped');
  const filterCorrect = document.getElementById('filter-correct');

  // Drawer Elements
  const paletteDrawer = document.getElementById('palette-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const paletteChipsGrid = document.getElementById('palette-chips-grid');
  const drawerCountBadge = document.getElementById('drawer-count-badge');

  // Modal Elements
  const modalRestart = document.getElementById('modal-restart');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalConfirmRestart = document.getElementById('btn-modal-confirm-restart');

  // ==========================================
  // INITIALIZATION & THEME / SOUND SETUP
  // ==========================================
  function initApp() {
    initTheme();
    initSound();
    initTopicList();
    checkOngoingSession();
    bindGlobalEvents();
  }

  function initTheme() {
    const savedTheme = storage.getTheme();
    applyTheme(savedTheme);

    btnThemeToggle.addEventListener('click', () => {
      audio.playClick();
      const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storage.setTheme(next);
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      iconSun.classList.add('hidden');
      iconMoon.classList.remove('hidden');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    }
  }

  function initSound() {
    updateSoundIcons();
    btnSoundToggle.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      updateSoundIcons();
      if (!isMuted) audio.playClick();
    });
  }

  function updateSoundIcons() {
    if (audio.isMuted()) {
      iconSoundOn.classList.add('hidden');
      iconSoundOff.classList.remove('hidden');
      btnSoundToggle.classList.add('muted');
    } else {
      iconSoundOff.classList.add('hidden');
      iconSoundOn.classList.remove('hidden');
      btnSoundToggle.classList.remove('muted');
    }
  }

  // Populate 12 Units list on Setup Screen
  function initTopicList() {
    data.sections.forEach(sec => {
      const label = document.createElement('label');
      label.className = 'topic-item';
      label.dataset.sectionId = sec.id;
      label.innerHTML = `
        <input type="radio" name="quiz-topic" value="${sec.id}">
        <div class="topic-info">
          <div class="topic-title">Unit ${sec.id}: ${escapeHtml(sec.title)}</div>
          <div class="topic-desc">High-yield numericals, Boolean minimization, and CUET PG trap questions</div>
        </div>
        <div class="topic-count-pill">${sec.questionCount} MCQs</div>
      `;
      topicSelectorContainer.appendChild(label);
    });

    // Topic Click delegation for bulletproof label/radio sync
    topicSelectorContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.topic-item');
      if (!item) return;
      const radio = item.querySelector('input[name="quiz-topic"]');
      if (radio && !radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Topic Selection Handler
    topicSelectorContainer.addEventListener('change', (e) => {
      if (e.target.name === 'quiz-topic') {
        audio.playClick();
        const selectedId = Number(e.target.value);
        document.querySelectorAll('.topic-item').forEach(item => {
          item.classList.toggle('selected', Number(item.dataset.sectionId) === selectedId);
        });

        if (selectedId === 0) {
          topicSelectedBadge.textContent = 'All 12 Units Selected';
        } else {
          const sec = data.sections.find(s => s.id === selectedId);
          topicSelectedBadge.textContent = sec ? `Unit ${sec.id} Selected` : `Unit ${selectedId}`;
        }
      }
    });

    // Count Pill Selection Handler
    countSelectorGroup.addEventListener('click', (e) => {
      const pill = e.target.closest('.count-pill');
      if (!pill) return;
      audio.playClick();
      document.querySelectorAll('.count-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  }

  // Check for saved unfinished session
  function checkOngoingSession() {
    if (storage.hasActiveSession()) {
      const session = storage.loadSession();
      const answeredCount = Object.keys(session.answers || {}).length;
      const totalCount = session.activeQuestions ? session.activeQuestions.length : 0;
      const correctCount = Object.values(session.answers || {}).filter(a => a.isCorrect).length;
      const timeStr = formatTimer(session.elapsedSeconds || 0);

      resumeSummary.textContent = `Progress: ${answeredCount} of ${totalCount} Answered • Score: ${correctCount} • Elapsed Time: ${timeStr}`;
      resumeBanner.classList.remove('hidden');
    } else {
      resumeBanner.classList.add('hidden');
    }
  }

  // ==========================================
  // NAVIGATION & SCREEN SWITCHING
  // ==========================================
  function switchScreen(targetScreen) {
    [screenSetup, screenQuiz, screenResults].forEach(s => s.classList.remove('active'));
    targetScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // TIMER FUNCTIONS
  // ==========================================
  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      engine.elapsedSeconds++;
      arenaTimerDisplay.textContent = formatTimer(engine.elapsedSeconds);

      // Auto-save session every 5 seconds
      if (engine.elapsedSeconds % 5 === 0) {
        storage.saveSession(engine.getStateForStorage());
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function formatTimer(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // ==========================================
  // START QUIZ LOGIC
  // ==========================================
  btnStartQuiz.addEventListener('click', () => {
    audio.playClick();
    const selectedRadio = document.querySelector('input[name="quiz-topic"]:checked');
    const sectionId = selectedRadio ? Number(selectedRadio.value) : 0;

    const activeCountPill = document.querySelector('.count-pill.active');
    const countVal = activeCountPill ? activeCountPill.dataset.count : 'all';

    launchQuiz({ sectionId, count: countVal });
  });

  btnResumeSession.addEventListener('click', () => {
    audio.playClick();
    const session = storage.loadSession();
    if (session && engine.restoreSession(session)) {
      switchScreen(screenQuiz);
      startTimer();
      renderCurrentQuestion();
      updatePaletteChips();
    }
  });

  btnDiscardSession.addEventListener('click', () => {
    audio.playClick();
    storage.clearSession();
    resumeBanner.classList.add('hidden');
  });

  function launchQuiz(config) {
    engine.startNewQuiz(config);
    storage.saveSession(engine.getStateForStorage());
    switchScreen(screenQuiz);
    startTimer();
    renderCurrentQuestion();
    updatePaletteChips();
  }

  // ==========================================
  // QUIZ ARENA RENDERING
  // ==========================================
  function renderCurrentQuestion() {
    const q = engine.getCurrentQuestion();
    if (!q) return;

    const total = engine.activeQuestions.length;
    const currentNum = engine.currentIndex + 1;
    const isAnswered = engine.isAnswered(engine.currentIndex);
    const answer = engine.getAnswer(engine.currentIndex);

    // 1. Top Bar & Metrics
    arenaScopeBadge.textContent = engine.scopeTitle;
    arenaCorrectCount.textContent = engine.getCorrectCount();
    arenaIncorrectCount.textContent = engine.getIncorrectCount();
    arenaScoreDisplay.textContent = `${engine.getCorrectCount()} / ${total}`;
    arenaTimerDisplay.textContent = formatTimer(engine.elapsedSeconds);

    const answeredCount = engine.getAttemptedCount();
    const percent = Math.round((answeredCount / total) * 100);
    progressStatusText.textContent = `Question ${currentNum} of ${total}`;
    progressPercentageText.textContent = `${percent}% Completed (${answeredCount}/${total})`;
    progressBarFill.style.width = `${percent}%`;

    // 2. Card Header
    qCounterBadge.textContent = `Q${currentNum} of ${total}`;
    qBankBadge.textContent = `Bank #${q.originalNum}`;
    qUnitBadge.textContent = `Unit ${q.sectionId}: ${q.sectionTitle}`;
    qDiffBadge.textContent = q.difficulty;
    qDiffBadge.className = `q-badge diff-badge ${q.difficulty}`;

    // Bookmark State
    const isFlagged = storage.isBookmarked(q.id);
    btnBookmarkQuestion.classList.toggle('flagged', isFlagged);
    iconBookmarkEmpty.classList.toggle('hidden', isFlagged);
    iconBookmarkFilled.classList.toggle('hidden', !isFlagged);
    bookmarkLabel.textContent = isFlagged ? 'Flagged' : 'Flag';

    // 3. Question Statement
    qStatementText.textContent = q.question;

    // 4. Render 4 Options
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt-btn';
      btn.dataset.key = opt.key;

      const keySpan = document.createElement('span');
      keySpan.className = 'opt-key-pill';
      keySpan.textContent = opt.key;

      const textSpan = document.createElement('span');
      textSpan.className = 'opt-text';
      textSpan.textContent = opt.text;

      btn.appendChild(keySpan);
      btn.appendChild(textSpan);

      if (isAnswered) {
        btn.disabled = true;
        if (opt.key === answer.selectedKey) {
          btn.classList.add(answer.isCorrect ? 'correct' : 'incorrect');
        } else if (!answer.isCorrect && opt.key === q.correctKey) {
          btn.classList.add('correct');
        }
      } else {
        btn.addEventListener('click', () => handleOptionSelection(opt.key));
      }

      optionsContainer.appendChild(btn);
    });

    // 5. Solution & Feedback Container
    if (isAnswered) {
      solutionContainer.classList.remove('hidden');
      btnSkipQuestion.classList.add('hidden');

      if (answer.isCorrect) {
        feedbackBanner.className = 'feedback-banner correct';
        feedbackIcon.textContent = '✓';
        feedbackText.textContent = `Correct Answer! Option (${answer.selectedKey}) is right. (+1 Point)`;
      } else {
        feedbackBanner.className = 'feedback-banner incorrect';
        feedbackIcon.textContent = '✗';
        feedbackText.textContent = `Incorrect Choice! You selected (${answer.selectedKey}), but correct option is (${q.correctKey}).`;
      }

      explanationContentText.textContent = q.explanation;
      trapContentText.textContent = q.trap;
    } else {
      solutionContainer.classList.add('hidden');
      btnSkipQuestion.classList.remove('hidden');
    }

    // 6. Navigation Buttons
    btnPrevQuestion.disabled = (engine.currentIndex === 0);
    if (engine.currentIndex === total - 1) {
      nextButtonLabel.textContent = isAnswered ? 'Submit Quiz' : 'Finish Quiz';
    } else {
      nextButtonLabel.textContent = 'Next Question';
    }

    // Sync palette drawer chips
    updatePaletteChips();
  }

  // Handle Option Selection
  function handleOptionSelection(selectedKey) {
    if (engine.isAnswered(engine.currentIndex)) return;

    const res = engine.answerQuestion(engine.currentIndex, selectedKey);
    if (!res) return;

    if (res.isCorrect) {
      audio.playCorrect();
    } else {
      audio.playIncorrect();
    }

    // Save state
    storage.saveSession(engine.getStateForStorage());

    // Re-render question card with solution
    renderCurrentQuestion();
  }

  // ==========================================
  // NAVIGATION ACTIONS
  // ==========================================
  btnNextQuestion.addEventListener('click', () => {
    audio.playClick();
    if (engine.currentIndex === engine.activeQuestions.length - 1) {
      finishQuiz();
    } else {
      engine.nextQuestion();
      storage.saveSession(engine.getStateForStorage());
      renderCurrentQuestion();
    }
  });

  btnPrevQuestion.addEventListener('click', () => {
    audio.playClick();
    engine.previousQuestion();
    storage.saveSession(engine.getStateForStorage());
    renderCurrentQuestion();
  });

  btnSkipQuestion.addEventListener('click', () => {
    audio.playClick();
    if (engine.currentIndex === engine.activeQuestions.length - 1) {
      finishQuiz();
    } else {
      engine.nextQuestion();
      storage.saveSession(engine.getStateForStorage());
      renderCurrentQuestion();
    }
  });

  // Bookmark / Flag Toggle
  btnBookmarkQuestion.addEventListener('click', () => {
    const q = engine.getCurrentQuestion();
    if (!q) return;
    audio.playClick();
    storage.toggleBookmark(q.id);
    renderCurrentQuestion();
  });

  // Restart Modal Handlers
  btnRestartQuiz.addEventListener('click', () => {
    audio.playClick();
    modalRestart.classList.remove('hidden');
  });

  btnModalCancel.addEventListener('click', () => {
    audio.playClick();
    modalRestart.classList.add('hidden');
  });

  btnModalConfirmRestart.addEventListener('click', () => {
    audio.playClick();
    modalRestart.classList.add('hidden');
    engine.answers = {};
    engine.currentIndex = 0;
    engine.elapsedSeconds = 0;
    engine.isCompleted = false;
    storage.saveSession(engine.getStateForStorage());
    renderCurrentQuestion();
  });

  // ==========================================
  // QUESTION PALETTE DRAWER
  // ==========================================
  btnPaletteToggle.addEventListener('click', () => {
    audio.playClick();
    paletteDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    updatePaletteChips();
  });

  function closeDrawer() {
    paletteDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
  }

  btnCloseDrawer.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  function updatePaletteChips() {
    if (!engine.activeQuestions || engine.activeQuestions.length === 0) return;
    drawerCountBadge.textContent = `${engine.activeQuestions.length} Questions`;
    paletteChipsGrid.innerHTML = '';

    engine.activeQuestions.forEach((q, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'palette-chip';
      chip.textContent = idx + 1;

      if (idx === engine.currentIndex) {
        chip.classList.add('current');
      }

      const ans = engine.getAnswer(idx);
      if (ans) {
        chip.classList.add(ans.isCorrect ? 'correct' : 'incorrect');
      } else if (storage.isBookmarked(q.id)) {
        chip.classList.add('flagged');
      }

      chip.addEventListener('click', () => {
        audio.playClick();
        engine.goToQuestion(idx);
        storage.saveSession(engine.getStateForStorage());
        renderCurrentQuestion();
        closeDrawer();
      });

      paletteChipsGrid.appendChild(chip);
    });
  }

  // ==========================================
  // FINISH QUIZ & RESULTS SCREEN
  // ==========================================
  function finishQuiz() {
    stopTimer();
    engine.isCompleted = true;
    storage.clearSession(); // Clears in-progress state

    audio.playComplete();
    const results = engine.getResults();

    // 1. Hero Score & Progress Ring
    resultScoreBig.textContent = results.correct;
    resultScoreTotal.textContent = `/ ${results.total}`;

    // SVG Circle Animation
    const circumference = 2 * Math.PI * 58; // r = 58 -> ~364.4
    const offset = circumference - (results.accuracy / 100) * circumference;
    scoreCircleBar.style.strokeDashoffset = offset;
    scoreCircleBar.style.stroke = results.tier.color;

    resultTierBadge.textContent = results.tier.badge;
    resultTierBadge.style.backgroundColor = `${results.tier.color}22`;
    resultTierBadge.style.color = results.tier.color;
    resultTierBadge.style.borderColor = `${results.tier.color}55`;

    resultHeadingText.textContent = `Scored ${results.correct} out of ${results.total} (${results.accuracy}%)`;
    resultCommentText.textContent = results.tier.comment;
    resultNetMarks.textContent = `${results.netMarksCUET > 0 ? '+' : ''}${results.netMarksCUET} / ${results.maxMarksCUET} Marks`;

    // 2. 6 Stat Metric Cards
    metricAttempted.textContent = `${results.attempted} / ${results.total}`;
    metricCorrect.textContent = `+${results.correct}`;
    metricIncorrect.textContent = `-${results.incorrect}`;
    metricSkipped.textContent = results.skipped;
    metricAccuracy.textContent = `${results.accuracy}%`;
    metricTime.textContent = formatTimer(results.elapsedSeconds);

    // 3. Retake Missed Only button visibility
    if (results.missedQuestionIds.length > 0) {
      btnActionRetakeMissed.classList.remove('hidden');
      btnActionRetakeMissed.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        <span>Retake Missed (${results.missedQuestionIds.length}) Questions</span>
      `;
    } else {
      btnActionRetakeMissed.classList.add('hidden');
    }

    // 4. Render Syllabus Breakdown
    renderSyllabusBreakdown(results.unitBreakdown);

    // 5. Render Filterable Review List
    renderReviewSection();

    switchScreen(screenResults);
  }

  function renderSyllabusBreakdown(unitBreakdown) {
    unitBreakdownContainer.innerHTML = '';
    unitBreakdown.forEach(u => {
      const item = document.createElement('div');
      item.className = 'unit-bar-item';

      let barColor = 'var(--emerald-500)';
      if (u.accuracy < 60) barColor = 'var(--rose-500)';
      else if (u.accuracy < 80) barColor = 'var(--amber-500)';

      item.innerHTML = `
        <div class="unit-bar-header">
          <span class="unit-bar-title">Unit ${u.sectionId}: ${escapeHtml(u.sectionTitle)}</span>
          <span class="unit-bar-stats">${u.correct}/${u.total} Correct (${u.accuracy}%)</span>
        </div>
        <div class="unit-bar-track">
          <div class="unit-bar-fill" style="width: ${u.accuracy}%; background-color: ${barColor};"></div>
        </div>
      `;
      unitBreakdownContainer.appendChild(item);
    });
  }

  function renderReviewSection() {
    const total = engine.activeQuestions.length;
    const mistakes = engine.activeQuestions.filter((q, idx) => engine.answers[idx] && !engine.answers[idx].isCorrect).length;
    const skipped = engine.activeQuestions.filter((q, idx) => !engine.answers[idx]).length;
    const correct = engine.activeQuestions.filter((q, idx) => engine.answers[idx] && engine.answers[idx].isCorrect).length;

    filterAll.textContent = `All (${total})`;
    filterMistakes.textContent = `Mistakes (${mistakes})`;
    filterSkipped.textContent = `Skipped (${skipped})`;
    filterCorrect.textContent = `Correct (${correct})`;

    applyReviewFilter(currentReviewFilter);
  }

  function applyReviewFilter(filterType) {
    currentReviewFilter = filterType;
    [filterAll, filterMistakes, filterSkipped, filterCorrect].forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterType);
    });

    reviewItemsContainer.innerHTML = '';

    engine.activeQuestions.forEach((q, idx) => {
      const ans = engine.answers[idx];
      let matches = false;

      if (filterType === 'all') matches = true;
      else if (filterType === 'mistakes' && ans && !ans.isCorrect) matches = true;
      else if (filterType === 'skipped' && !ans) matches = true;
      else if (filterType === 'correct' && ans && ans.isCorrect) matches = true;

      if (!matches) return;

      const card = document.createElement('div');
      card.className = 'review-card';

      let statusBadge = '<span class="q-badge" style="background:#64748b;color:#fff;">Skipped</span>';
      if (ans) {
        statusBadge = ans.isCorrect
          ? '<span class="q-badge" style="background:var(--emerald-500);color:#fff;">Correct (+1)</span>'
          : '<span class="q-badge" style="background:var(--rose-500);color:#fff;">Incorrect (-1)</span>';
      }

      const selectedOpt = ans ? q.options.find(o => o.key === ans.selectedKey) : null;
      const correctOpt = q.options.find(o => o.key === q.correctKey);

      card.innerHTML = `
        <div class="review-card-top">
          <div class="q-header-badges">
            <span class="q-badge counter-badge">Q${idx + 1}</span>
            <span class="q-badge unit-badge">Unit ${q.sectionId}</span>
            ${statusBadge}
          </div>
        </div>

        <div class="review-card-q">${escapeHtml(q.question)}</div>

        <div class="review-answers-box">
          ${ans ? `
            <div class="review-answer-row ${ans.isCorrect ? 'user-correct' : 'user-wrong'}">
              <strong>Your Choice:</strong> (${escapeHtml(ans.selectedKey)}) ${selectedOpt ? escapeHtml(selectedOpt.text) : ''} ${ans.isCorrect ? '✓' : '✗'}
            </div>
          ` : `
            <div class="review-answer-row" style="background:rgba(100,116,139,0.15);color:var(--text-secondary);">
              <strong>Status:</strong> Question was skipped
            </div>
          `}
          ${(!ans || !ans.isCorrect) ? `
            <div class="review-answer-row correct-target">
              <strong>Correct Answer:</strong> (${escapeHtml(q.correctKey)}) ${correctOpt ? escapeHtml(correctOpt.text) : ''} ✓
            </div>
          ` : ''}
        </div>

        <div class="explanation-box" style="margin-bottom:10px;">
          <div class="explanation-title">Hinglish Explanation & Derivation</div>
          <div class="explanation-content">${escapeHtml(q.explanation)}</div>
        </div>

        <div class="trap-box">
          <div class="trap-title">⚠️ Exam Trap & Shortcut</div>
          <div class="trap-content">${escapeHtml(q.trap)}</div>
        </div>
      `;

      reviewItemsContainer.appendChild(card);
    });

    if (reviewItemsContainer.children.length === 0) {
      reviewItemsContainer.innerHTML = `
        <div style="text-align:center;padding:30px;color:var(--text-secondary);">
          No questions matching filter "<strong>${filterType}</strong>".
        </div>
      `;
    }
  }

  // Filter Click Handlers
  [filterAll, filterMistakes, filterSkipped, filterCorrect].forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick();
      applyReviewFilter(btn.dataset.filter);
    });
  });

  // Results Actions
  btnActionReviewMistakes.addEventListener('click', () => {
    audio.playClick();
    applyReviewFilter('mistakes');
    document.querySelector('.review-section-card').scrollIntoView({ behavior: 'smooth' });
  });

  btnActionRetakeMissed.addEventListener('click', () => {
    audio.playClick();
    const results = engine.getResults();
    if (results.missedQuestionIds.length > 0) {
      launchQuiz({ questionIds: results.missedQuestionIds });
    }
  });

  btnActionRestartThis.addEventListener('click', () => {
    audio.playClick();
    engine.answers = {};
    engine.currentIndex = 0;
    engine.elapsedSeconds = 0;
    engine.isCompleted = false;
    storage.saveSession(engine.getStateForStorage());
    switchScreen(screenQuiz);
    startTimer();
    renderCurrentQuestion();
  });

  btnActionNewQuiz.addEventListener('click', () => {
    audio.playClick();
    switchScreen(screenSetup);
    checkOngoingSession();
  });

  // Header Brand click returns home
  headerBrand.addEventListener('click', () => {
    audio.playClick();
    if (screenQuiz.classList.contains('active')) {
      // In quiz arena: show restart confirmation modal
      modalRestart.classList.remove('hidden');
    } else {
      switchScreen(screenSetup);
      checkOngoingSession();
    }
  });

  // ==========================================
  // KEYBOARD NAVIGATION HANDLER
  // ==========================================
  function bindGlobalEvents() {
    window.addEventListener('keydown', (e) => {
      // If typing in an input, ignore
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      // Escape closes drawer or modal
      if (e.key === 'Escape') {
        closeDrawer();
        modalRestart.classList.add('hidden');
        return;
      }

      // Quiz Arena Shortcuts
      if (screenQuiz.classList.contains('active') && modalRestart.classList.contains('hidden')) {
        const key = e.key.toUpperCase();

        // 1-4 or A-D: Select Option
        const optMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D' };
        if (optMap[key]) {
          handleOptionSelection(optMap[key]);
          return;
        }

        // N or Enter or ArrowRight: Next Question
        if (key === 'N' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault();
          btnNextQuestion.click();
          return;
        }

        // P or ArrowLeft: Previous Question
        if (key === 'P' || e.key === 'ArrowLeft') {
          e.preventDefault();
          btnPrevQuestion.click();
          return;
        }

        // S: Skip
        if (key === 'S') {
          e.preventDefault();
          btnSkipQuestion.click();
          return;
        }

        // F: Flag / Bookmark
        if (key === 'F') {
          e.preventDefault();
          btnBookmarkQuestion.click();
          return;
        }
      }
    });
  }

  // Run App Initialization on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
