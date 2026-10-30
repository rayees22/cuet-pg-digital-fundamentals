/**
 * Double Fisher-Yates Randomization & Assessment Analytics Engine
 * Zero external dependencies
 */

class QuizEngine {
  constructor(allQuestionsData) {
    this.allQuestions = allQuestionsData ? allQuestionsData.questions : [];
    this.sections = allQuestionsData ? allQuestionsData.sections : [];
    this.reset();
  }

  reset() {
    this.activeQuestions = [];
    this.currentIndex = 0;
    this.answers = {}; // { [index]: { selectedKey, isCorrect, timeSpent } }
    this.elapsedSeconds = 0;
    this.isCompleted = false;
    this.scopeTitle = "All 12 Units";
    this.scopeSectionId = 0;
    this.timerInterval = null;
  }

  // Pure Fisher-Yates shuffle
  static shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Initializes a new quiz session with Double Fisher-Yates Randomization:
   * 1. Shuffles questions array
   * 2. Shuffles the 4 options per question with zero position bias
   */
  startNewQuiz(config = {}) {
    this.reset();
    const {
      sectionId = 0,     // 0 = All sections
      count = 'all',     // 10, 25, 50, 100, 'all'
      questionIds = null // specific IDs for retakes
    } = config;

    let pool = [];

    if (Array.isArray(questionIds) && questionIds.length > 0) {
      pool = this.allQuestions.filter(q => questionIds.includes(q.id));
      this.scopeTitle = "Retake Missed Questions";
      this.scopeSectionId = 0;
    } else if (sectionId > 0) {
      pool = this.allQuestions.filter(q => q.sectionId === Number(sectionId));
      const sec = this.sections.find(s => s.id === Number(sectionId));
      this.scopeTitle = sec ? `Unit ${sec.id}: ${sec.title}` : `Unit ${sectionId}`;
      this.scopeSectionId = Number(sectionId);
    } else {
      pool = [...this.allQuestions];
      this.scopeTitle = "All 12 Units";
      this.scopeSectionId = 0;
    }

    // Shuffle questions
    let shuffledQuestions = QuizEngine.shuffle(pool);

    // Slice requested count
    if (count !== 'all' && Number(count) > 0) {
      shuffledQuestions = shuffledQuestions.slice(0, Math.min(Number(count), shuffledQuestions.length));
    }

    // Double Randomization: Shuffle options of each question
    this.activeQuestions = shuffledQuestions.map((rawQ, qIdx) => {
      // Clone options and mark true correctness
      const rawOptions = rawQ.options.map(opt => ({
        originalKey: opt.key,
        text: opt.text,
        isCorrect: opt.key === rawQ.correctAnswer
      }));

      // Shuffle the 4 options
      const shuffledOpts = QuizEngine.shuffle(rawOptions);

      // Re-assign display keys A, B, C, D
      const displayKeys = ['A', 'B', 'C', 'D'];
      const finalOptions = shuffledOpts.map((opt, oIdx) => ({
        key: displayKeys[oIdx],
        text: opt.text,
        raw: `${displayKeys[oIdx]}) ${opt.text}`,
        isCorrect: opt.isCorrect,
        originalKey: opt.originalKey
      }));

      // Identify the new key that has isCorrect === true
      const correctOption = finalOptions.find(o => o.isCorrect);

      return {
        quizIndex: qIdx,
        id: rawQ.id,
        originalNum: rawQ.originalNum,
        sectionId: rawQ.sectionId,
        sectionTitle: rawQ.sectionTitle,
        question: rawQ.question,
        options: finalOptions,
        correctKey: correctOption ? correctOption.key : 'A',
        difficulty: rawQ.difficulty,
        explanation: rawQ.explanation,
        trap: rawQ.trap
      };
    });

    this.currentIndex = 0;
    this.isCompleted = false;
    this.elapsedSeconds = 0;
    return this.activeQuestions;
  }

  // Restore session from saved storage
  restoreSession(savedState) {
    if (!savedState || !savedState.activeQuestions) return false;
    this.activeQuestions = savedState.activeQuestions;
    this.currentIndex = savedState.currentIndex || 0;
    this.answers = savedState.answers || {};
    this.elapsedSeconds = savedState.elapsedSeconds || 0;
    this.isCompleted = !!savedState.isCompleted;
    this.scopeTitle = savedState.scopeTitle || "Ongoing Quiz";
    this.scopeSectionId = savedState.scopeSectionId || 0;
    return true;
  }

  getStateForStorage() {
    return {
      activeQuestions: this.activeQuestions,
      currentIndex: this.currentIndex,
      answers: this.answers,
      elapsedSeconds: this.elapsedSeconds,
      isCompleted: this.isCompleted,
      scopeTitle: this.scopeTitle,
      scopeSectionId: this.scopeSectionId
    };
  }

  getCurrentQuestion() {
    if (this.activeQuestions.length === 0) return null;
    return this.activeQuestions[this.currentIndex];
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.activeQuestions.length) {
      this.currentIndex = index;
      return this.getCurrentQuestion();
    }
    return null;
  }

  nextQuestion() {
    if (this.currentIndex < this.activeQuestions.length - 1) {
      this.currentIndex++;
      return this.getCurrentQuestion();
    }
    return null;
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.getCurrentQuestion();
    }
    return null;
  }

  isAnswered(index) {
    return !!this.answers[index];
  }

  getAnswer(index) {
    return this.answers[index] || null;
  }

  // Record student's selection
  answerQuestion(index, selectedKey) {
    const q = this.activeQuestions[index];
    if (!q) return null;

    // Prevent re-answering if already locked
    if (this.answers[index]) {
      return this.answers[index];
    }

    const selectedOption = q.options.find(o => o.key === selectedKey);
    const isCorrect = selectedOption ? !!selectedOption.isCorrect : false;

    const answerRecord = {
      selectedKey: selectedKey,
      isCorrect: isCorrect,
      correctKey: q.correctKey,
      answeredAt: Date.now()
    };

    this.answers[index] = answerRecord;
    return answerRecord;
  }

  // Total correct count
  getCorrectCount() {
    return Object.values(this.answers).filter(a => a.isCorrect).length;
  }

  // Total incorrect count
  getIncorrectCount() {
    return Object.values(this.answers).filter(a => !a.isCorrect).length;
  }

  getAttemptedCount() {
    return Object.keys(this.answers).length;
  }

  getSkippedCount() {
    return this.activeQuestions.length - this.getAttemptedCount();
  }

  // Complete Assessment Report
  getResults() {
    const total = this.activeQuestions.length;
    const attempted = this.getAttemptedCount();
    const correct = this.getCorrectCount();
    const incorrect = this.getIncorrectCount();
    const skipped = total - attempted;

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const netMarksCUET = (correct * 4) - (incorrect * 1);
    const maxMarksCUET = total * 4;

    // Performance Tier Rating
    let tier = {
      badge: "Needs Revision",
      color: "#f43f5e",
      comment: "Focus on fundamental concepts and review the step-by-step master study notes."
    };

    if (accuracy >= 90) {
      tier = {
        badge: "Top Ranker (90%+ Ready)",
        color: "#10b981",
        comment: "Outstanding performance! You are primed for top ranks in DU, BHU, and JNU MCA."
      };
    } else if (accuracy >= 75) {
      tier = {
        badge: "CUET PG High Rank Tier",
        color: "#3b82f6",
        comment: "Strong preparation! A targeted review of missed topics will push you into the top 1%."
      };
    } else if (accuracy >= 60) {
      tier = {
        badge: "Good Foundation",
        color: "#f59e0b",
        comment: "Good conceptual base. Review the dedicated exam trap callouts to minimize negative marking."
      };
    }

    // Unit-wise Syllabus Breakdown
    const unitMap = {};
    this.activeQuestions.forEach((q, idx) => {
      const secId = q.sectionId;
      if (!unitMap[secId]) {
        unitMap[secId] = {
          sectionId: secId,
          sectionTitle: q.sectionTitle,
          total: 0,
          attempted: 0,
          correct: 0
        };
      }
      unitMap[secId].total++;
      if (this.answers[idx]) {
        unitMap[secId].attempted++;
        if (this.answers[idx].isCorrect) {
          unitMap[secId].correct++;
        }
      }
    });

    const unitBreakdown = Object.values(unitMap).map(u => ({
      ...u,
      accuracy: u.attempted > 0 ? Math.round((u.correct / u.attempted) * 100) : 0
    }));

    // Missed Questions List (for Retake Missed Only)
    const missedQuestionIds = [];
    this.activeQuestions.forEach((q, idx) => {
      if (this.answers[idx] && !this.answers[idx].isCorrect) {
        missedQuestionIds.push(q.id);
      }
    });

    return {
      total,
      attempted,
      correct,
      incorrect,
      skipped,
      accuracy,
      netMarksCUET,
      maxMarksCUET,
      elapsedSeconds: this.elapsedSeconds,
      tier,
      unitBreakdown,
      missedQuestionIds
    };
  }
}

window.QuizEngine = QuizEngine;
