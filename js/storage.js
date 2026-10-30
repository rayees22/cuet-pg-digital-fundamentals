/**
 * LocalStorage Auto-Save & Session Persistence Manager
 * Key: cuet_df_quiz_session_v1
 */

class StorageManager {
  constructor() {
    this.SESSION_KEY = 'cuet_df_quiz_session_v1';
    this.THEME_KEY = 'cuet_df_theme';
    this.BOOKMARKS_KEY = 'cuet_df_bookmarks';
  }

  // Session persistence
  saveSession(sessionData) {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({
        ...sessionData,
        lastUpdated: Date.now()
      }));
      return true;
    } catch (e) {
      console.warn('LocalStorage saveSession failed:', e);
      return false;
    }
  }

  loadSession() {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('LocalStorage loadSession failed:', e);
      return null;
    }
  }

  clearSession() {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  hasActiveSession() {
    const session = this.loadSession();
    const qList = session ? (session.activeQuestions || session.questions) : null;
    return !!(session && qList && qList.length > 0 && !session.isCompleted);
  }

  // Theme preference
  getTheme() {
    try {
      return localStorage.getItem(this.THEME_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  setTheme(theme) {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (e) {}
  }

  // Question Bookmarks / Flags
  getBookmarks() {
    try {
      const raw = localStorage.getItem(this.BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  isBookmarked(questionId) {
    const list = this.getBookmarks();
    return list.includes(questionId);
  }

  toggleBookmark(questionId) {
    let list = this.getBookmarks();
    if (list.includes(questionId)) {
      list = list.filter(id => id !== questionId);
    } else {
      list.push(questionId);
    }
    try {
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(list));
    } catch (e) {}
    return list.includes(questionId);
  }
}

window.quizStorage = new StorageManager();
