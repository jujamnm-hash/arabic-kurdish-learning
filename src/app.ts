// ═══════════════════════════════════════════════════
//  app.ts — Main Application TypeScript Source
//  Kurdish Arabic Learning System
//  Compiles to: js/app.js (tsconfig: module:none)
//
//  NOTE: Data types declared via ambient declarations
//        (no import needed — data.js loads globally)
// ═══════════════════════════════════════════════════

// ── Ambient Declarations (from data.js) ────────────
declare const ARABIC_LETTERS: ArabicLetter[];
declare const VOCABULARY: VocabWord[];
declare const STORIES: Story[];
declare const QUIZ_CATEGORIES: { id: string; title: string; description: string; icon: string; count: number }[];
declare const QUIZ_QUESTIONS: QuizQuestion[];
declare const VOCAB_CATEGORIES: Record<string, { label: string; icon: string }>;
declare const bootstrap: {
  Modal: {
    getOrCreateInstance(el: HTMLElement): { show(): void; hide(): void };
    getInstance(el: HTMLElement | null): { hide(): void } | null;
  };
  Toast: { getOrCreateInstance(el: HTMLElement, opts?: object): { show(): void } };
};

// ── State Interface ────────────────────────────────
interface AppState {
  currentSection: string;
  xp: number;
  streak: number;
  lastVisit: string;
  learnedLetters: number[];
  learnedVocab: number[];
  readStories: number[];
  quizHistory: { date: string; score: number; category: string }[];
}

// ── State helpers ──────────────────────────────────
function loadState(): AppState { return {} as AppState; }         // impl in app.js
function saveState(_s: AppState): void {}                          // impl in app.js
declare let appState: AppState;

// ── Speech Module ──────────────────────────────────
declare const SpeechModule: {
  supported: boolean;
  speak(text: string, lang?: string): void;
  btn(text: string, extraClass?: string): string;
};

// ── App ────────────────────────────────────────────
declare const App: {
  navigate(section: string): void;
  renderHome(): void;
  renderWordOfDay(): void;
  renderDailyGoals(): void;
  showToast(msg: string, type?: string): void;
  addXP(amount: number): void;
  checkStreak(): void;
  init(): void;
};

// ── Letter Module ──────────────────────────────────
declare const LetterModule: {
  currentFilter: string;
  render(): void;
  filter(type: string, btn?: HTMLElement): void;
  search(query: string): void;
  renderFiltered(type: string): void;
  typeLabel(type: string): string;
  openDetail(id: number): void;
  markLearned(id: number): void;
};

// ── Vocab Module ───────────────────────────────────
declare const VocabModule: {
  currentCategory: string;
  searchQuery: string;
  render(category?: string): void;
  renderCategoryTabs(): void;
  filterByCategory(cat: string, btn: HTMLElement): void;
  search(query: string): void;
  getFiltered(): VocabWord[];
  renderCards(): void;
  flip(card: HTMLElement, id: number): void;
  markLearned(id: number): void;
};

// ── Story Module ───────────────────────────────────
declare const StoryModule: {
  currentStory: Story | null;
  render(): void;
  levelLabel(level: string): string;
  open(id: number): void;
  back(): void;
  markRead(id: number): void;
};

// ── Quiz Module ────────────────────────────────────
declare const QuizModule: {
  currentQuestions: QuizQuestion[];
  currentIndex: number;
  score: number;
  correctCount: number;
  answered: boolean;
  currentCategory: string;
  timerInterval: ReturnType<typeof setInterval> | null;
  timeLeft: number;
  renderMenu(): void;
  start(category: string, count: number): void;
  stopTimer(): void;
  startTimer(seconds?: number): void;
  renderQuestion(): void;
  stopQuiz(): void;
  renderKeyHint(): void;
  answer(index: number, btn: HTMLElement): void;
  next(): void;
  finish(): void;
  restart(): void;
  launchConfetti(): void;
  toPersianNum(n: number): string;
};

// ── Progress Module ────────────────────────────────
declare const ProgressModule: {
  render(): void;
  renderOverview(): void;
  renderLetterProgress(): void;
  renderAchievements(): void;
  reset(): void;
};

// ── Init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
