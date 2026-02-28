// ═══════════════════════════════════════════════════
//  js/app.js — Compiled from src/app.ts
//  Kurdish Arabic Learning System — Main Application
// ═══════════════════════════════════════════════════
"use strict";

/* ═══════════════════════════════════════
   STATE MANAGEMENT
═══════════════════════════════════════ */
const STATE_KEY = 'arabic_kurdish_app_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return {
    currentSection: 'home',
    xp: 0,
    streak: 0,
    lastVisit: '',
    learnedLetters: [],
    learnedVocab: [],
    favoriteVocab: [],
    vocabLastSeen: {},
    vocabNotes: {},
    dailyActivity: {},
    readStories: [],
    quizHistory: [],
    quizBestScores: {},
    quizMistakes: {},
    ttsSpeed: 1,
    dailyChallenge: null
  };
}

function saveState(state) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch(e) {}
}

let appState = loadState();

/* ═══════════════════════════════════════
   SPEECH (TTS)
═══════════════════════════════════════ */
const SpeechModule = {
  supported: typeof window !== 'undefined' && !!window.speechSynthesis,

  speak(text, lang = 'ar-SA') {
    if (!this.supported) { App.showToast('براوزەرەکەت دەنگ پشتگیری ناکات', 'error'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const speeds = [0.55, 0.78, 1.1];
    u.rate  = speeds[appState?.ttsSpeed ?? 1];
    u.pitch = 1.05;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  },

  setSpeed(n) {
    appState.ttsSpeed = n;
    saveState(appState);
    const labels = ['بەئاهەنگ', 'ئاسایی', 'خێرا'];
    App.showToast(`خێرایی دەنگ: ${labels[n]} 🔊`, 'info');
    document.querySelectorAll('.tts-speed-btn').forEach((b, i) => b.classList.toggle('active', i === n));
  },

  btn(text, extraClass = '') {
    const safe = text.replace(/"/g, '&quot;');
    return `<button class="speak-btn ${extraClass}" onclick="SpeechModule.speak(this.dataset.t)" data-t="${safe}" title="گوێبگرە">
      <i class="bi bi-volume-up-fill"></i>
    </button>`;
  }
};

/* ═══════════════════════════════════════
   SOUND EFFECTS
═══════════════════════════════════════ */
const SoundModule = {
  _ctx: null,
  _init() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    return this._ctx;
  },
  play(type) {
    const ctx = this._init();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    if (type === 'correct') {
      o.type = 'sine';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.45);
    } else {
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(250, ctx.currentTime);
      o.frequency.setValueAtTime(180, ctx.currentTime + 0.18);
      g.gain.setValueAtTime(0.22, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.5);
    }
  }
};

/* ═══════════════════════════════════════
   XP RANKS
═══════════════════════════════════════ */
const RANKS = [
  { min: 0,    name: 'نوێخواز',   icon: '🌱', color: '#10b981' },
  { min: 100,  name: 'خوێندنکار', icon: '📖', color: '#6366f1' },
  { min: 300,  name: 'زیرەک',    icon: '⚡',  color: '#f59e0b' },
  { min: 600,  name: 'شارەزا',   icon: '🎓', color: '#06b6d4' },
  { min: 1000, name: 'مامۆستا',  icon: '🏆', color: '#f59e0b' }
];

/* ═══════════════════════════════════════
   APP CORE
═══════════════════════════════════════ */
const App = {
  navigate(section) {
    // hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('section-' + section);
    if (!el) return;
    el.classList.add('active');
    // update top nav
    document.querySelectorAll('.nav-pill').forEach(a => {
      a.classList.toggle('active', a.dataset.section === section);
    });
    // update bottom mobile nav
    document.querySelectorAll('.mbn-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.section === section);
    });
    appState.currentSection = section;
    saveState(appState);
    // render section
    switch(section) {
      case 'home':     this.renderHome();       break;
      case 'letters':  LetterModule.render();   break;
      case 'vocab':    VocabModule.render();     break;
      case 'stories':  StoryModule.render();     break;
      case 'quiz':     QuizModule.renderMenu();  break;
      case 'progress': ProgressModule.render();  break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderHome() {
    // Quick letters preview (first 8)
    const container = document.getElementById('quickLetters');
    if (!container) return;
    container.innerHTML = '';
    ARABIC_LETTERS.slice(0, 8).forEach(letter => {
      const el = document.createElement('div');
      el.className = 'quick-letter-chip';
      el.innerHTML = `<span class="ql-arabic">${letter.arabic}</span><span class="ql-name">${letter.kurdishName}</span>`;
      el.title = letter.name;
      el.onclick = () => { App.navigate('letters'); setTimeout(() => LetterModule.openDetail(letter.id), 300); };
      container.appendChild(el);
    });
    // Due badge on vocab feature card
    const vBadge = document.getElementById('vocabHomeBadge');
    if (vBadge) {
      const now = Date.now(), reviewDelay = 12 * 3600 * 1000;
      const due = VOCABULARY.filter(w =>
        appState.learnedVocab.includes(w.id) &&
        (!appState.vocabLastSeen?.[w.id] || now - appState.vocabLastSeen[w.id] > reviewDelay)
      ).length;
      if (due > 0) {
        vBadge.textContent = `🔄 ${due} دووبارەکێژە`;
        vBadge.style.background = 'rgba(239,68,68,.18)';
        vBadge.style.color = '#f87171';
        vBadge.style.borderColor = 'rgba(239,68,68,.35)';
      } else {
        vBadge.textContent = 'مامناوەند';
        vBadge.style = '';
      }
    }
    this.renderWordOfDay();
    this.renderDailyGoals();
    DailyChallengeModule.render();
    this.renderWhatsNext();
    // Sync TTS speed buttons
    const spd = appState.ttsSpeed ?? 1;
    document.querySelectorAll('.tts-speed-btn').forEach((b, i) => b.classList.toggle('active', i === spd));
  },

  renderWordOfDay() {
    const el = document.getElementById('wordOfDay');
    if (!el) return;
    // Rotate daily based on date
    const dayIndex = Math.floor(Date.now() / 86400000) % VOCABULARY.length;
    const word = VOCABULARY[dayIndex];
    const cat = VOCAB_CATEGORIES[word.category];
    el.innerHTML = `
      <div class="wod-cat">${cat?.icon || ''} ${cat?.label || ''}</div>
      <div class="wod-arabic">${word.arabic}</div>
      <div class="wod-transliteration">[${word.transliteration}]</div>
      <div class="wod-kurdish">${word.kurdish}</div>
      <div class="d-flex align-items-center justify-content-center gap-2 mt-2">
        ${SpeechModule.btn(word.arabic, 'wod-speak')}
        <button class="btn btn-sm btn-outline-success" onclick="VocabModule.markLearned(${word.id})">فێربووم ✔</button>
      </div>`;
  },

  renderDailyGoals() {
    const el = document.getElementById('dailyGoals');
    if (!el) return;
    const lettersGoal = 5, vocabGoal = 5, storyGoal = 1;
    const lDone  = Math.min(appState.learnedLetters.length, lettersGoal);
    const vDone  = Math.min(appState.learnedVocab.length,   vocabGoal);
    const sDone  = Math.min(appState.readStories.length,     storyGoal);

    // 7-day activity dots
    const today = new Date();
    const dayNames = ['ی','د','س','چ','پ','هـ','ش'];
    const weekDots = Array.from({length: 7}, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      const hasActivity = !!(appState.dailyActivity?.[key]);
      const isToday = i === 6;
      return `<div class="week-dot-wrap">
        <div class="week-dot${hasActivity ? ' active' : ''}${isToday ? ' today' : ''}"></div>
        <span class="week-dot-label">${dayNames[d.getDay()]}</span>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div class="goal-item">
        <span>ﺃ ${lDone}/${lettersGoal} پیت</span>
        <div class="goal-bar"><div class="goal-fill" style="width:${(lDone/lettersGoal)*100}%"></div></div>
      </div>
      <div class="goal-item">
        <span>📖 ${vDone}/${vocabGoal} وشە</span>
        <div class="goal-bar"><div class="goal-fill" style="width:${(vDone/vocabGoal)*100}%"></div></div>
      </div>
      <div class="goal-item">
        <span>📚 ${sDone}/${storyGoal} چیرۆک</span>
        <div class="goal-bar"><div class="goal-fill" style="width:${(sDone/storyGoal)*100}%"></div></div>
      </div>
      <div class="week-dots-row">${weekDots}</div>`;
  },

  renderWhatsNext() {
    const el = document.getElementById('whatsNext');
    if (!el) return;
    const now = Date.now(), reviewDelay = 12 * 3600 * 1000;
    const nextLetter = ARABIC_LETTERS.find(l => !appState.learnedLetters.includes(l.id));
    const dueCount = VOCABULARY.filter(w =>
      appState.learnedVocab.includes(w.id) &&
      (!appState.vocabLastSeen?.[w.id] || now - appState.vocabLastSeen[w.id] > reviewDelay)
    ).length;
    const nextVocab = VOCABULARY.find(w => !appState.learnedVocab.includes(w.id));
    const nextStory = STORIES.find(s => !appState.readStories.includes(s.id));
    const items = [];
    if (nextLetter) items.push(`
      <div class="wn-card" onclick="App.navigate('letters')">
        <div class="wn-icon" style="background:rgba(99,102,241,.15)"><span style="font-family:'Noto Naskh Arabic';font-size:1.6rem;color:#a78bfa">${nextLetter.arabic}</span></div>
        <div class="wn-info">
          <div class="wn-label">پیتی دواتر فێربوو</div>
          <div class="wn-value">${nextLetter.kurdishName} — ${nextLetter.name}</div>
        </div>
        <i class="bi bi-arrow-left-circle wn-arrow"></i>
      </div>`);
    if (dueCount > 0) items.push(`
      <div class="wn-card" onclick="VocabModule.filterByCategory('review',null);App.navigate('vocab')">
        <div class="wn-icon" style="background:rgba(245,158,11,.15)"><i class="bi bi-arrow-repeat" style="color:#fbbf24;font-size:1.5rem"></i></div>
        <div class="wn-info">
          <div class="wn-label">دووبارەکردنەوە</div>
          <div class="wn-value">${dueCount} وشە چاوەڕوانی دووبارەکردنەوەی</div>
        </div>
        <i class="bi bi-arrow-left-circle wn-arrow"></i>
      </div>`);
    else if (nextVocab) items.push(`
      <div class="wn-card" onclick="App.navigate('vocab')">
        <div class="wn-icon" style="background:rgba(16,185,129,.12)"><span style="font-family:'Noto Naskh Arabic';font-size:1.4rem;color:#34d399">${nextVocab.arabic}</span></div>
        <div class="wn-info">
          <div class="wn-label">وشەی دواتر فێربوو</div>
          <div class="wn-value">${nextVocab.kurdish} [${nextVocab.transliteration}]</div>
        </div>
        <i class="bi bi-arrow-left-circle wn-arrow"></i>
      </div>`);
    if (nextStory) items.push(`
      <div class="wn-card" onclick="App.navigate('stories')">
        <div class="wn-icon" style="background:rgba(239,68,68,.1)"><i class="bi bi-book-half" style="color:#f87171;font-size:1.4rem"></i></div>
        <div class="wn-info">
          <div class="wn-label">چیرۆکی دواتر بخوێنەوە</div>
          <div class="wn-value">${nextStory.title}</div>
        </div>
        <i class="bi bi-arrow-left-circle wn-arrow"></i>
      </div>`);
    if (!items.length) {
      el.innerHTML = `<div class="wn-complete"><i class="bi bi-patch-check-fill text-success me-2"></i>ئافەرین! هەموو ئامانجەکانت تەواو کردووین 🎉</div>`;
      return;
    }
    el.innerHTML = `<div class="wn-header"><i class="bi bi-compass me-2"></i>بەردەوام بە لە فێربوون</div><div class="wn-items">${items.join('')}</div>`;
  },

  showToast(msg, type = 'info') {
    const toast = document.getElementById('appToast');
    const body  = document.getElementById('toastBody');
    if (!toast || !body) return;
    body.textContent = msg;
    toast.className = `app-toast toast align-items-center border-0 ${type}`;
    const bsToast = bootstrap.Toast.getOrCreateInstance(toast, { delay: 3000 });
    bsToast.show();
  },

  getRank() {
    const xp = appState.xp;
    let rank = RANKS[0], next = RANKS[1];
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (xp >= RANKS[i].min) { rank = RANKS[i]; next = RANKS[i + 1] || null; break; }
    }
    const pct = next ? Math.min(100, Math.round(((xp - rank.min) / (next.min - rank.min)) * 100)) : 100;
    return { rank, next, pct };
  },

  updateRankBadge() {
    const el = document.getElementById('rankBadge');
    if (!el) return;
    const { rank, next, pct } = this.getRank();
    el.textContent = `${rank.icon} ${rank.name}`;
    el.style.color = rank.color;
    el.title = next ? `${rank.name} → ${next.name} (${pct}%)` : `${rank.name} — ئاستی زۆرترین!`;
  },

  addXP(amount) {
    const oldRankName = this.getRank().rank.name;
    appState.xp += amount;
    const today = new Date().toISOString().split('T')[0];
    if (!appState.dailyActivity) appState.dailyActivity = {};
    appState.dailyActivity[today] = (appState.dailyActivity[today] || 0) + amount;
    saveState(appState);
    const el = document.getElementById('xpCount');
    if (el) el.textContent = appState.xp;
    this.updateRankBadge();
    this.showToast(`+${amount} XP کەسبکردت! 🌟`, 'success');
    const newRank = this.getRank().rank;
    if (newRank.name !== oldRankName) setTimeout(() => this.showRankUp(newRank), 800);
  },

  showRankUp(rank) {
    const el = document.createElement('div');
    el.className = 'rank-up-overlay';
    el.innerHTML = `
      <div class="rank-up-card">
        <div class="rank-up-sparkles">✨ ✨ ✨</div>
        <div class="rank-up-icon">${rank.icon}</div>
        <div class="rank-up-label">پلەی نوێ!</div>
        <div class="rank-up-name" style="color:${rank.color}">${rank.name}</div>
        <div class="rank-up-sub">پیرۆزبێت! 🎉</div>
      </div>`;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('show'), 50);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }, 3200);
  },

  updateStreakBadge() {
    const el = document.getElementById('streakCount');
    if (el) el.textContent = appState.streak;
  },

  checkStreak() {
    const today = new Date().toDateString();
    if (appState.lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      appState.streak = (appState.lastVisit === yesterday) ? appState.streak + 1 : 1;
      appState.lastVisit = today;
      saveState(appState);
    }
    this.updateStreakBadge();
  },

  init() {
    this.checkStreak();
    // migrate old state
    if (!appState.favoriteVocab)  { appState.favoriteVocab  = []; saveState(appState); }
    if (!appState.vocabLastSeen)  { appState.vocabLastSeen  = {}; saveState(appState); }
    if (!appState.vocabNotes)      { appState.vocabNotes      = {}; saveState(appState); }
    if (!appState.dailyActivity)   { appState.dailyActivity   = {}; saveState(appState); }
    if (!appState.quizBestScores)  { appState.quizBestScores  = {}; saveState(appState); }
    if (appState.ttsSpeed    === undefined) { appState.ttsSpeed    = 1;    saveState(appState); }
    if (appState.dailyChallenge === undefined) { appState.dailyChallenge = null; saveState(appState); }
    if (!appState.quizMistakes)  { appState.quizMistakes  = {};   saveState(appState); }
    const xpEl = document.getElementById('xpCount');
    if (xpEl) xpEl.textContent = appState.xp;
    // restore theme
    const savedTheme = localStorage.getItem('app_theme') || 'dark';
    document.body.dataset.theme = savedTheme;
    this.updateThemeIcon(savedTheme);
    this.navigate(appState.currentSection || 'home');
    // Scroll navbar effect
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    });
    this.updateRankBadge();
    // global keyboard shortcuts help trigger
    document.addEventListener('keydown', (e) => {
      if (e.key === '?' && document.activeElement.tagName !== 'INPUT') {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('shortcutsModal')).show();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        GlobalSearch.open();
      }
    });
    // Hide loading
    setTimeout(() => {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.classList.add('hidden');
    }, 800);
  },

  toggleTheme() {
    const current = document.body.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = next;
    localStorage.setItem('app_theme', next);
    this.updateThemeIcon(next);
  },

  updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerHTML = theme === 'dark'
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
  }
};

/* ═══════════════════════════════════════
   LETTER MODULE
═══════════════════════════════════════ */
const LetterModule = {
  currentFilter: 'all',

  render() {
    const grid = document.getElementById('lettersGrid');
    if (!grid) return;
    this.renderFiltered(this.currentFilter);
    this.renderMasteryGrid();
  },

  filter(type, btn) {
    this.currentFilter = type;
    document.querySelectorAll('#letterFilterTabs .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    // clear search
    const si = document.getElementById('letterSearch');
    if (si) si.value = '';
    this.renderFiltered(type);
  },

  renderFiltered(type) {
    const grid = document.getElementById('lettersGrid');
    if (!grid) return;
    const letters = type === 'all' ? ARABIC_LETTERS : ARABIC_LETTERS.filter(l => l.type === type);
    grid.innerHTML = '';
    letters.forEach((letter, idx) => {
      const learned = appState.learnedLetters.includes(letter.id);
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-3 col-xl-2';
      col.innerHTML = `
        <div class="letter-card ${learned ? 'learned' : ''}" onclick="LetterModule.openDetail(${letter.id})"
             style="animation-delay:${idx * 0.04}s">
          <div class="lc-num">${idx + 1}</div>
          <span class="lc-arabic">${letter.arabic}</span>
          <div class="lc-name">${letter.name}</div>
          <div class="lc-kurdish">${letter.kurdishName}</div>
          <span class="lc-type-badge badge-${letter.type}">${this.typeLabel(letter.type)}</span>
        </div>`;
      grid.appendChild(col);
    });
  },

  typeLabel(type) {
    return {shamsieh:'شەمسیە', qamariyeh:'قەمەریە', 'long-vowels':'دەنگبەزیک'}[type] || type;
  },

  renderMasteryGrid() {
    const el = document.getElementById('letterMasteryGrid');
    if (!el) return;
    el.innerHTML = ARABIC_LETTERS.map(l => {
      const lrn = appState.learnedLetters.includes(l.id);
      return `<div class="lmg-tile ${lrn ? 'lmg-learned' : ''}" title="${l.name} — ${l.kurdishName}" onclick="LetterModule.openDetail(${l.id})">${l.arabic}</div>`;
    }).join('');
    const cnt = document.getElementById('lmgCount');
    if (cnt) cnt.textContent = appState.learnedLetters.length;
  },

  openDetail(id) {
    const letter = ARABIC_LETTERS.find(l => l.id === id);
    if (!letter) return;
    const body = document.getElementById('letterModalBody');
    if (!body) return;

    const formsHtml = `
      <div class="lm-forms">
        ${[['ئیزۆلە','isolated'],['سەرەوە','initial'],['ناوەڕاست','medial'],['کۆتایی','final']].map(([label, key]) => `
          <div class="lm-form-item">
            <span class="lm-form-arabic">${letter.forms[key]}</span>
            <span class="lm-form-label">${label}</span>
          </div>`).join('')}
      </div>`;

    const examplesHtml = `
      <div class="lm-examples">
        <h6 class="mb-3" style="color:var(--light-text)">نموونەکان:</h6>
        ${letter.examples.map(ex => `
          <div class="lm-example-item">
            <span class="lm-ex-arabic">${ex.arabic}</span>
            ${SpeechModule.btn(ex.arabic, 'speak-btn-sm')}
            <span class="lm-ex-meaning">${ex.meaning}</span>
            <span class="lm-ex-pronunciation">[${ex.pronunciation}]</span>
          </div>`).join('')}
      </div>`;

    body.innerHTML = `
      <div class="text-center mb-3">
        <div class="lm-letter-display">${letter.arabic}</div>
        <div class="d-flex justify-content-center align-items-center gap-2 mt-1">
          <h4 style="color:var(--secondary);margin:0">${letter.name}</h4>
          ${SpeechModule.btn(letter.arabic, 'lm-speak')}
        </div>
        <p style="color:var(--light-text);font-size:.9rem;margin-top:.4rem">${letter.kurdishName} — <em>${letter.transliteration}</em></p>
      </div>
      <p style="color:var(--light-text);background:rgba(255,255,255,.03);padding:1rem;border-radius:10px;border-right:3px solid var(--primary)">
        ${letter.kurdishDescription}
      </p>
      ${formsHtml}
      ${examplesHtml}
      <div class="d-flex justify-content-center gap-3 mt-4">
        <button class="btn btn-success btn-sm" onclick="LetterModule.markLearned(${letter.id})">
          <i class="bi bi-check-circle-fill me-1"></i>فێربووم
        </button>
      </div>`;

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('letterModal'));
    modal.show();
  },

  markLearned(id) {
    if (!appState.learnedLetters.includes(id)) {
      appState.learnedLetters.push(id);
      saveState(appState);
      App.addXP(10);
      this.renderFiltered(this.currentFilter);
      bootstrap.Modal.getInstance(document.getElementById('letterModal'))?.hide();
    } else {
      App.showToast('پێشتر فێربووتە ئەم پیتەیە ✔', 'info');
    }
  }
};

/* ═══════════════════════════════════════
   VOCABULARY MODULE
═══════════════════════════════════════ */
const VocabModule = {
  currentCategory: 'all',
  searchQuery: '',

  render(category) {
    if (category) this.currentCategory = category;
    this.renderCategoryTabs();
    this.renderCards();
  },

  renderCategoryTabs() {
    const container = document.getElementById('vocabCategoryTabs');
    if (!container) return;
    const favCount  = (appState.favoriteVocab || []).length;
    const now = Date.now();
    const reviewDelay = 12 * 3600 * 1000;
    const dueCount = VOCABULARY.filter(w =>
      appState.learnedVocab.includes(w.id) &&
      (!appState.vocabLastSeen || !appState.vocabLastSeen[w.id] ||
       now - appState.vocabLastSeen[w.id] > reviewDelay)
    ).length;

    const allBtn = `<button class="vocab-cat-btn ${this.currentCategory === 'all' ? 'active' : ''}" onclick="VocabModule.filterByCategory('all', this)">🌐 هەموو <span class="cat-count-badge">${VOCABULARY.length}</span></button>`;

    const catBtns = Object.entries(VOCAB_CATEGORIES).map(([key, val]) => {
      const total   = VOCABULARY.filter(w => w.category === key).length;
      const learned = VOCABULARY.filter(w => w.category === key && appState.learnedVocab.includes(w.id)).length;
      const done    = total > 0 && learned === total;
      return `<button class="vocab-cat-btn ${this.currentCategory === key ? 'active' : ''}" onclick="VocabModule.filterByCategory('${key}', this)">
        ${val.icon} ${val.label} <span class="cat-count-badge${done ? ' cat-count-done' : ''}">${done ? '★' : learned + '/' + total}</span>
      </button>`;
    }).join('');

    const reviewBtn = dueCount > 0 ? `<button class="vocab-cat-btn review-btn ${this.currentCategory === 'review' ? 'active' : ''}" onclick="VocabModule.filterByCategory('review', this)">🔄 دووبارەکردنەوە <span class="fav-count-badge" style="background:#f59e0b">${dueCount}</span></button>` : '';
    const favBtn    = `<button class="vocab-cat-btn fav-btn ${this.currentCategory === 'favorites' ? 'active' : ''}" onclick="VocabModule.filterByCategory('favorites', this)">❤️ مورد علاقە${favCount ? ` <span class="fav-count-badge">${favCount}</span>` : ''}</button>`;

    // Build progress summary
    const progBars = Object.entries(VOCAB_CATEGORIES).map(([key, val]) => {
      const total   = VOCABULARY.filter(w => w.category === key).length;
      const learned = VOCABULARY.filter(w => w.category === key && appState.learnedVocab.includes(w.id)).length;
      const pct = total ? Math.round(learned / total * 100) : 0;
      return `<div class="vcp-item" onclick="VocabModule.filterByCategory('${key}',null)">
        <div class="vcp-top"><span>${val.icon} ${val.label}</span><span class="vcp-nums">${learned}/${total}</span></div>
        <div class="vcp-bar-bg"><div class="vcp-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
    }).join('');

    const recentCount = appState.learnedVocab.length;
    const recentBtn = recentCount > 0 ? `<button class="vocab-cat-btn recent-btn ${this.currentCategory === 'recent' ? 'active' : ''}" onclick="VocabModule.filterByCategory('recent', this)">🕐 تازەفێربووی <span class="cat-count-badge">${Math.min(recentCount, 10)}</span></button>` : '';

    container.innerHTML = allBtn + catBtns + recentBtn + reviewBtn + favBtn
      + `<div class="vocab-cat-progress" id="vcpRow">${progBars}</div>`;
  },

  filterByCategory(cat, btn) {
    this.currentCategory = cat;
    this.searchQuery = '';
    const searchInput = document.getElementById('vocabSearch');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.vocab-cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderCards();
  },

  toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    if (!appState.favoriteVocab) appState.favoriteVocab = [];
    const idx = appState.favoriteVocab.indexOf(id);
    if (idx === -1) { appState.favoriteVocab.push(id); App.showToast('بە مورد علاقەکانت زیادکرا ❤️', 'success'); }
    else { appState.favoriteVocab.splice(idx, 1); App.showToast('لە مورد علاقەکان دەرکرا', 'info'); }
    saveState(appState);
    this.renderCards();
  },

  search(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.renderCards();
  },

  getFiltered() {
    const favs = appState.favoriteVocab || [];
    let words = VOCABULARY;
    if (this.currentCategory === 'review') {
      const now = Date.now();
      const reviewDelay = 12 * 3600 * 1000;
      words = words.filter(w =>
        appState.learnedVocab.includes(w.id) &&
        (!appState.vocabLastSeen || !appState.vocabLastSeen[w.id] ||
         now - appState.vocabLastSeen[w.id] > reviewDelay)
      );
      words = [...words].sort((a, b) =>
        (appState.vocabLastSeen?.[a.id] || 0) - (appState.vocabLastSeen?.[b.id] || 0)
      );
    } else if (this.currentCategory === 'favorites') {
      words = words.filter(w => favs.includes(w.id));
    } else if (this.currentCategory === 'recent') {
      words = words.filter(w => appState.learnedVocab.includes(w.id));
      words = [...words].sort((a, b) =>
        (appState.vocabLastSeen?.[b.id] || 0) - (appState.vocabLastSeen?.[a.id] || 0)
      ).slice(0, 10);
    } else if (this.currentCategory !== 'all') {
      words = words.filter(w => w.category === this.currentCategory);
    }
    if (this.searchQuery) {
      words = words.filter(w =>
        w.arabic.includes(this.searchQuery) ||
        w.kurdish.toLowerCase().includes(this.searchQuery) ||
        w.transliteration.toLowerCase().includes(this.searchQuery)
      );
    }
    return words;
  },

  renderCards() {
    const grid = document.getElementById('vocabGrid');
    if (!grid) return;
    const words = this.getFiltered();
    if (words.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center py-5" style="color:var(--light-text)">
        <i class="bi bi-search" style="font-size:3rem;opacity:.3"></i>
        <p class="mt-3">هیچ وشەیەک نەدۆزرایەوە</p>
      </div>`;
      return;
    }
    grid.innerHTML = '';
    words.forEach((word, idx) => {
      const learned = appState.learnedVocab.includes(word.id);
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-3';
      col.innerHTML = `
        <div class="vocab-card${learned ? ' learned' : ''}" onclick="VocabModule.flip(this, ${word.id})"
             style="animation-delay:${idx * 0.04}s">
          <div class="vc-category-badge">${VOCAB_CATEGORIES[word.category]?.icon || ''}</div>
          <div class="vc-front">
            <button class="vocab-fav-btn${(appState.favoriteVocab||[]).includes(word.id) ? ' active' : ''}" onclick="event.stopPropagation();VocabModule.toggleFavorite(${word.id},event)" title="بە مورد علاقە زیادبکە"><i class="bi bi-heart${(appState.favoriteVocab||[]).includes(word.id) ? '-fill' : ''}"></i></button>
            <div class="d-flex align-items-center justify-content-center gap-1">
              <span class="vc-arabic">${word.arabic}</span>
              <button class="speak-btn speak-btn-sm" onclick="event.stopPropagation();SpeechModule.speak(this.dataset.t)" data-t="${word.arabic.replace(/"/g,'&quot;')}" title="گوێبگرە"><i class="bi bi-volume-up-fill"></i></button>
            </div>
            <span class="vc-transliteration">[${word.transliteration}]</span>
            <span class="vc-kurdish">${word.kurdish}</span>
          </div>
          <div class="vc-back">
            <div class="vc-back-content">
              ${word.exampleSentence ? `
                <span class="vc-example-sentence">${word.exampleSentence}</span>
                <p class="vc-example-translation">${word.exampleTranslation}</p>
              ` : `<p style="color:var(--light-text)">بۆ پشتڕاستکردن کلیک بکە دووبارە</p>`}
              <div class="d-flex gap-2 justify-content-center mt-2">
                <button class="speak-btn" onclick="event.stopPropagation();SpeechModule.speak(this.dataset.t)" data-t="${word.arabic.replace(/"/g,'&quot;')}" title="گوێبگرە"><i class="bi bi-volume-up-fill"></i></button>
                <button class="btn btn-success btn-sm" onclick="event.stopPropagation();VocabModule.markLearned(${word.id})">
                  <i class="bi bi-check-circle me-1"></i>فێربووم
                </button>
              </div>
            </div>
          </div>
        </div>`;
      grid.appendChild(col);
    });
  },

  flip(card, id) {
    card.classList.toggle('flipped');
    // Track review timestamp when user flips back to front
    if (!card.classList.contains('flipped')) {
      if (!appState.vocabLastSeen) appState.vocabLastSeen = {};
      appState.vocabLastSeen[id] = Date.now();
      saveState(appState);
    }
  },

  markLearned(id) {
    if (!appState.learnedVocab.includes(id)) {
      appState.learnedVocab.push(id);
      if (!appState.vocabLastSeen) appState.vocabLastSeen = {};
      appState.vocabLastSeen[id] = Date.now();
      saveState(appState);
      App.addXP(5);
    }
  },

  editNote(id) {
    const area  = document.getElementById(`note-area-${id}`);
    if (!area) return;
    const existing = appState.vocabNotes?.[id] || '';
    area.innerHTML = `
      <textarea class="vocab-note-input" rows="2" placeholder="یادداشت..." onclick="event.stopPropagation()">${existing}</textarea>
      <div class="d-flex gap-1 mt-1">
        <button class="btn btn-primary btn-sm" style="font-size:.72rem;padding:.15rem .5rem" onclick="event.stopPropagation();VocabModule.saveNote(${id}, this.closest('.vocab-note-area').querySelector('textarea').value)">سەندکردن</button>
        <button class="btn btn-outline-secondary btn-sm" style="font-size:.72rem;padding:.15rem .5rem" onclick="event.stopPropagation();VocabModule.renderCards()">داخستن</button>
      </div>`;
    area.querySelector('textarea')?.focus();
  },

  saveNote(id, text) {
    if (!appState.vocabNotes) appState.vocabNotes = {};
    const trimmed = (text || '').trim();
    if (trimmed) appState.vocabNotes[id] = trimmed;
    else delete appState.vocabNotes[id];
    saveState(appState);
    this.renderCards();
    App.showToast('یادداشت سەندکرا 📝', 'success');
  },

  exportLearned() {
    const learned = VOCABULARY.filter(w => appState.learnedVocab.includes(w.id));
    if (!learned.length) { App.showToast('هێشتا هیچ وشەیەک فێرنەبووی', 'error'); return; }
    const catLabel = id => VOCAB_CATEGORIES[id]?.label || id;
    const lines = [
      'فێربوونی زمانی عەرەبی — وشەی فێربووەکان',
      '══════════════════════════════════════',
      '',
      ...learned.map((w, i) => [
        `${i + 1}. ${w.arabic}  [${w.transliteration}]  —  ${w.kurdish}`,
        `   دەستەبژێر: ${catLabel(w.category)}`,
        w.exampleSentence ? `   نموونە: ${w.exampleSentence}` : '',
        w.exampleTranslation ? `   وەرگێڕان: ${w.exampleTranslation}` : '',
        ''
      ].filter(Boolean).join('\n')),
      '══════════════════════════════════════',
      `کۆی وشە: ${learned.length} لە ${VOCABULARY.length}`,
      `بەروار: ${new Date().toLocaleDateString('en-GB')}`
    ];
    const text = lines.join('\n');
    const blob = new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arabic-learned-vocab.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    App.showToast(`${learned.length} وشە هاوردەکرا ⬇️`, 'success');
  }
};

/* ═══════════════════════════════════════
   FLASHCARD MODULE
═══════════════════════════════════════ */
const FlashcardModule = {
  deck: [],
  idx: 0,
  flipped: false,
  _keyHandler: null,

  open(category) {
    category = category || VocabModule.currentCategory;
    const words = (category === 'all' ? [...VOCABULARY] : VOCABULARY.filter(w => w.category === category))
      .sort(() => Math.random() - 0.5);
    if (!words.length) { App.showToast('هیچ وشەیەک نەدۆزرایەوە', 'error'); return; }
    this.deck = words;
    this.idx = 0;
    this.flipped = false;
    document.getElementById('flashcardOverlay').classList.remove('d-none');
    this._render();
    // keyboard
    this._keyHandler = (e) => {
      if (e.key === ' ' || e.key.toLowerCase() === 'f') { e.preventDefault(); this.flip(); }
      else if (e.key === 'ArrowLeft')  this.next();
      else if (e.key === 'ArrowRight') this.prev();
      else if (e.key === 'Enter' && this.flipped) this.markLearned();
      else if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this._keyHandler);
    // Touch swipe support
    const overlay = document.getElementById('flashcardOverlay');
    let _tx = 0, _ty = 0;
    this._touchStart = e => { _tx = e.touches[0].clientX; _ty = e.touches[0].clientY; };
    this._touchEnd = e => {
      const dx = e.changedTouches[0].clientX - _tx;
      const dy = e.changedTouches[0].clientY - _ty;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
        if (dx < 0) this.next(); else this.prev();
      } else if (dy < -45 && Math.abs(dy) > Math.abs(dx)) {
        this.flip();
      }
    };
    overlay.addEventListener('touchstart', this._touchStart, { passive: true });
    overlay.addEventListener('touchend',   this._touchEnd,   { passive: true });
  },

  close() {
    const overlay = document.getElementById('flashcardOverlay');
    overlay.classList.add('d-none');
    if (this._keyHandler)  { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
    if (this._touchStart)  { overlay.removeEventListener('touchstart', this._touchStart); this._touchStart = null; }
    if (this._touchEnd)    { overlay.removeEventListener('touchend',   this._touchEnd);   this._touchEnd   = null; }
  },

  _render() {
    const word = this.deck[this.idx];
    if (!word) return;
    const learned = appState.learnedVocab.includes(word.id);
    const cat = VOCAB_CATEGORIES[word.category];

    document.getElementById('fcCat').textContent = `${cat?.icon || ''} ${cat?.label || ''}`;
    document.getElementById('fcProgress').textContent = `${this.idx + 1} / ${this.deck.length}`;
    document.getElementById('fcProgressInner').style.width = `${((this.idx + 1) / this.deck.length) * 100}%`;
    document.getElementById('fcLearnedBadge').style.display = learned ? 'flex' : 'none';
    document.getElementById('fcArabic').textContent = word.arabic;
    document.getElementById('fcTranslit').textContent = `[${word.transliteration}]`;
    document.getElementById('fcKurdish').textContent = word.kurdish;
    document.getElementById('fcExample').textContent = word.exampleSentence || '';
    document.getElementById('fcExampleTr').textContent = word.exampleTranslation || '';
    document.getElementById('fcSpeakFront').dataset.t = word.arabic;
    document.getElementById('fcSpeakBack').dataset.t = word.arabic;
    const mb = document.getElementById('fcMarkBtn');
    mb.textContent = learned ? '✔ فێربووتت' : 'فێربووم ✔';
    mb.className = `btn ${learned ? 'btn-success' : 'btn-outline-success'} btn-sm`;
    // reset flip
    document.getElementById('fcCard').classList.remove('flipped');
    this.flipped = false;
    // auto-speak
    SpeechModule.speak(word.arabic);
  },

  flip() {
    this.flipped = !this.flipped;
    document.getElementById('fcCard').classList.toggle('flipped', this.flipped);
  },

  next() {
    if (this.idx < this.deck.length - 1) { this.idx++; this._render(); }
    else { App.showToast('هەموو کارتەکانت تەواو کرد! 🎉 +10 XP', 'success'); App.addXP(10); this.close(); }
  },

  prev() {
    if (this.idx > 0) { this.idx--; this._render(); }
  },

  markLearned() {
    const word = this.deck[this.idx];
    if (!appState.learnedVocab.includes(word.id)) {
      appState.learnedVocab.push(word.id);
      saveState(appState);
      App.addXP(5);
    }
    document.getElementById('fcLearnedBadge').style.display = 'flex';
    const mb = document.getElementById('fcMarkBtn');
    mb.textContent = '✔ فێربووتت';
    mb.className = 'btn btn-success btn-sm';
    setTimeout(() => this.next(), 350);
  }
};

/* ═══════════════════════════════════════
   STORY MODULE
═══════════════════════════════════════ */
const StoryModule = {
  currentStory: null,
  _listenActive: false,
  _listenIdx: 0,
  currentLevel: 'all',

  render() {
    document.getElementById('storiesList').classList.remove('d-none');
    document.getElementById('storyReader').classList.add('d-none');
    this._renderLevelFilter();
    const grid = document.getElementById('storyCards');
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = this.currentLevel === 'all' ? STORIES : STORIES.filter(s => s.level === this.currentLevel);
    filtered.forEach((story, idx) => {
      const read = appState.readStories.includes(story.id);
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';
      col.innerHTML = `
        <div class="story-list-card" onclick="StoryModule.open(${story.id})"
             style="animation-delay:${idx * 0.1}s">
          <div class="story-card-banner" style="background:${story.color}">
            <span style="position:relative;z-index:1">${story.emoji}</span>
          </div>
          <div class="story-card-body">
            <span class="story-card-level level-${story.level}">${this.levelLabel(story.level)}</span>
            <h5 class="story-card-title" style="font-family:var(--font-arabic)">${story.titleArabic}</h5>
            <p class="story-card-title" style="font-size:.9rem;color:var(--secondary)">${story.titleKurdish}</p>
            <p class="story-card-desc">${story.description}</p>
            <div class="story-card-meta">
              <span><i class="bi bi-clock me-1"></i>${story.readTime} خولەک</span>
              <span><i class="bi bi-chat-left-text me-1"></i>${story.wordCount} وشە</span>
              ${read ? '<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i>خوێندراوەتەوە</span>' : ''}
            </div>
          </div>
        </div>`;
      grid.appendChild(col);
    });
  },

  _renderLevelFilter() {
    let el = document.getElementById('storyLevelFilter');
    if (!el) {
      el = document.createElement('div');
      el.id = 'storyLevelFilter';
      el.className = 'filter-tabs mb-4';
      document.getElementById('storiesList').prepend(el);
    }
    const levels = [
      {id:'all', label:'هەموو', icon:'🌐'},
      {id:'beginner', label:'بنچینەیی', icon:'🌱'},
      {id:'intermediate', label:'مامناوەند', icon:'📚'},
      {id:'advanced', label:'پێشکەوتوو', icon:'★'}
    ];
    el.innerHTML = levels.map(l => `
      <button class="filter-btn${this.currentLevel === l.id ? ' active' : ''}" onclick="StoryModule.setLevel('${l.id}',this)">
        ${l.icon} ${l.label}
      </button>`).join('');
  },

  setLevel(level, btn) {
    this.currentLevel = level;
    this.render();
  },

  levelLabel(level) {
    return {beginner:'بنچینەیی', intermediate:'مامناوەند', advanced:'پێشکەوتوو'}[level] || level;
  },

  open(id) {
    const story = STORIES.find(s => s.id === id);
    if (!story) return;
    this.currentStory = story;
    document.getElementById('storiesList').classList.add('d-none');
    const reader = document.getElementById('storyReader');
    reader.classList.remove('d-none');

    const paragraphsHtml = story.paragraphs.map((p, i) => `
      <div class="story-paragraph" style="animation-delay:${i * 0.1}s">
        <div class="d-flex align-items-start gap-2">
          <span class="sp-arabic" style="flex:1">${p.arabic}</span>
          <button class="speak-btn flex-shrink-0 mt-1" onclick="SpeechModule.speak(this.dataset.t)" data-t="${p.arabic.replace(/"/g,'&quot;')}" title="گوێبگرە"><i class="bi bi-volume-up-fill"></i></button>
          <button class="sp-toggle-btn flex-shrink-0 mt-1" onclick="StoryModule.toggleTranslation(${i})" title="شاردنەوەی وەرگێڕان"><i class="bi bi-eye" id="sp-eye-${i}"></i></button>
        </div>
        <div class="sp-translation" id="sp-tr-${i}">
          <strong style="color:var(--primary-light);font-size:.8rem">وەرگێڕان:</strong><br>
          ${p.translation}
        </div>
        <div class="sp-vocab">
          ${p.vocab.map(v => `
            <span class="sp-vocab-word" title="${v.ku}" onclick="SpeechModule.speak('${v.ar.replace(/'/g, '&#39;')}')">
              <span class="sv-ar">${v.ar}</span>
              <span class="sv-ku">= ${v.ku}</span>
              <i class="bi bi-volume-up sv-speak-icon"></i>
            </span>`).join('')}
        </div>
      </div>`).join('');

    document.getElementById('storyContent').innerHTML = `
      <div class="story-header">
        <div class="d-flex align-items-center gap-3 mb-2">
          <span style="font-size:2.5rem">${story.emoji}</span>
          <div>
            <span class="story-title-ar">${story.titleArabic}</span>
            <span class="story-title-ku">${story.titleKurdish}</span>
          </div>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-3 mt-2" style="font-size:.82rem;color:rgba(255,255,255,.6)">
          <span><i class="bi bi-clock me-1"></i>${story.readTime} خولەک</span>
          <span><i class="bi bi-chat-dots me-1"></i>${story.wordCount} وشە</span>
          <span class="story-card-level level-${story.level} ms-2">${this.levelLabel(story.level)}</span>
          <button class="listen-btn" id="listenBtn" onclick="StoryModule.startListen()"><i class="bi bi-headphones me-2"></i>گوێگرتن</button>
          <button class="sp-hideall-btn" id="hideAllBtn" onclick="StoryModule.toggleAllTranslations()"><i class="bi bi-eye-slash me-1"></i>دۆخی پێشکەوتوو</button>
          <div class="fs-controls ms-auto">
            <button class="fs-btn" onclick="StoryModule.changeFontSize(-1)" title="کچکتر">A−</button>
            <button class="fs-btn" onclick="StoryModule.changeFontSize(0)" title="بەبێدەبینەوە">A</button>
            <button class="fs-btn" onclick="StoryModule.changeFontSize(1)" title="uگووڵتر">A+</button>
          </div>
        </div>
      </div>
      <div class="story-body">
        ${paragraphsHtml}
        <div class="story-moral">
          <div class="story-moral-title"><i class="bi bi-lightbulb-fill"></i> ئەندیشەی چیرۆک</div>
          <p class="story-moral-text">${story.moral}</p>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-success btn-lg" onclick="StoryModule.markRead(${story.id})">
            <i class="bi bi-book-fill me-2"></i>خوێندمەوە — +15 XP
          </button>
        </div>
      </div>`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  back() {
    this.stopListen();
    if (this._scrollHandler) { window.removeEventListener('scroll', this._scrollHandler); this._scrollHandler = null; }
    const progressBar = document.getElementById('storyScrollBar');
    if (progressBar) progressBar.style.width = '0%';
    this.currentStory = null;
    document.getElementById('storiesList').classList.remove('d-none');
    document.getElementById('storyReader').classList.add('d-none');
  },

  startListen() {
    const paragraphs = this.currentStory?.paragraphs;
    if (!paragraphs) return;
    if (!SpeechModule.supported) { App.showToast('براوزەرەکەت دەنگ پشتگیری ناکات', 'error'); return; }
    this._listenActive = true;
    this._listenIdx = 0;
    const btn = document.getElementById('listenBtn');
    if (btn) { btn.innerHTML = '<i class="bi bi-stop-circle-fill me-2"></i>وەستان'; btn.onclick = () => StoryModule.stopListen(); btn.classList.add('listening'); }
    this._readNext();
  },

  stopListen() {
    this._listenActive = false;
    window.speechSynthesis?.cancel();
    document.querySelectorAll('.story-paragraph').forEach(p => p.classList.remove('listening'));
    const btn = document.getElementById('listenBtn');
    if (btn) { btn.innerHTML = '<i class="bi bi-headphones me-2"></i>گوێگرتن'; btn.onclick = () => StoryModule.startListen(); btn.classList.remove('listening'); }
  },

  _readNext() {
    if (!this._listenActive) return;
    const paragraphs = this.currentStory?.paragraphs;
    if (!paragraphs || this._listenIdx >= paragraphs.length) { this.stopListen(); return; }
    const els = document.querySelectorAll('.story-paragraph');
    els.forEach((el, i) => el.classList.toggle('listening', i === this._listenIdx));
    els[this._listenIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const text = paragraphs[this._listenIdx].arabic;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA'; u.rate = 0.78; u.pitch = 1.05;
    u.onend = () => {
      if (!this._listenActive) return;
      this._listenIdx++;
      setTimeout(() => this._readNext(), 700);
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  },

  toggleTranslation(idx) {
    const tr  = document.getElementById(`sp-tr-${idx}`);
    const eye = document.getElementById(`sp-eye-${idx}`);
    if (!tr) return;
    const hidden = tr.style.display === 'none';
    tr.style.display = hidden ? '' : 'none';
    if (eye) eye.className = hidden ? 'bi bi-eye' : 'bi bi-eye-slash';
  },

  toggleAllTranslations() {
    const btn = document.getElementById('hideAllBtn');
    const translations = document.querySelectorAll('.sp-translation');
    if (!translations.length) return;
    const anyVisible = Array.from(translations).some(t => t.style.display !== 'none');
    translations.forEach((t, i) => {
      t.style.display = anyVisible ? 'none' : '';
      const eye = document.getElementById(`sp-eye-${i}`);
      if (eye) eye.className = anyVisible ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
    if (btn) btn.innerHTML = anyVisible
      ? '<i class="bi bi-eye me-1"></i>پیشاندانی وەرگێڕانەکان'
      : '<i class="bi bi-eye-slash me-1"></i>دۆخی پێشکەوتوو';
  },

  _fontSize: 1,   // 0=small 1=medium 2=large 3=xlarge
  _fontSizes: ['.95rem', '1.15rem', '1.35rem', '1.6rem'],
  changeFontSize(dir) {
    if (dir === 0) { this._fontSize = 1; }
    else { this._fontSize = Math.max(0, Math.min(3, this._fontSize + dir)); }
    const size = this._fontSizes[this._fontSize];
    document.querySelectorAll('.sp-arabic').forEach(el => el.style.fontSize = size);
    document.querySelectorAll('.sp-translation').forEach(el => el.style.fontSize = dir === 0 ? '' : `calc(${size} * 0.72)`);
  },

  markRead(id) {
    if (!appState.readStories.includes(id)) {
      appState.readStories.push(id);
      saveState(appState);
      App.addXP(15);
      App.showToast('چیرۆکەکەت خوێندەوە! 📚 +15 XP', 'success');
      this.render();
      this.back();
    } else {
      App.showToast('پێشتر ئەم چیرۆکەت خوێندەوە', 'info');
    }
  }
};

/* ═══════════════════════════════════════
   GLOBAL SEARCH
═══════════════════════════════════════ */
const GlobalSearch = {
  _activeIdx: -1,
  _results: [],

  open() {
    document.getElementById('globalSearchOverlay').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
    const inp = document.getElementById('gsInput');
    inp.value = '';
    document.getElementById('gsResults').innerHTML = '<p class="gs-hint">داوای بیکە بنووسە...</p>';
    this._results = []; this._activeIdx = -1;
    setTimeout(() => inp.focus(), 80);
  },

  close() {
    document.getElementById('globalSearchOverlay').classList.add('d-none');
    document.body.style.overflow = '';
  },

  closeOnBg(e) { if (e.target.id === 'globalSearchOverlay') this.close(); },

  onKey(e) {
    const items = document.querySelectorAll('.gs-item');
    if (e.key === 'Escape') { this.close(); return; }
    if (e.key === 'ArrowDown')  { e.preventDefault(); this._activeIdx = Math.min(this._activeIdx + 1, items.length - 1); this._hi(items); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); this._activeIdx = Math.max(this._activeIdx - 1, 0); this._hi(items); }
    if (e.key === 'Enter' && this._activeIdx >= 0 && items[this._activeIdx]) items[this._activeIdx].click();
  },

  _hi(items) {
    items.forEach((el, i) => el.classList.toggle('gs-active', i === this._activeIdx));
    if (items[this._activeIdx]) items[this._activeIdx].scrollIntoView({ block: 'nearest' });
  },

  query(q) {
    q = (q || '').trim();
    const el = document.getElementById('gsResults');
    if (!q || q.length < 2) {
      el.innerHTML = '<p class="gs-hint">داوای بیکە بنووسە...</p>';
      this._results = []; this._activeIdx = -1; return;
    }
    const lq = q.toLowerCase();
    const results = [];
    ARABIC_LETTERS.forEach(l => {
      if (l.arabic.includes(q) || l.name.toLowerCase().includes(lq) || l.kurdishName.toLowerCase().includes(lq) || l.transliteration.toLowerCase().includes(lq))
        results.push({ icon: '🔤', title: `${l.arabic} — ${l.kurdishName}`, sub: `پیت • ${l.name}`, action: () => { this.close(); App.navigate('letters'); setTimeout(() => LetterModule.openDetail(l.id), 350); } });
    });
    VOCABULARY.forEach(w => {
      if (w.arabic.includes(q) || w.kurdish.toLowerCase().includes(lq) || w.transliteration.toLowerCase().includes(lq)) {
        const cat = VOCAB_CATEGORIES[w.category];
        results.push({ icon: cat?.icon || '📖', title: `${w.arabic} — ${w.kurdish}`, sub: `وشە • [${w.transliteration}]  ${cat?.label || ''}`, action: () => { this.close(); App.navigate('vocab'); setTimeout(() => { VocabModule.filterByCategory('all'); setTimeout(() => VocabModule.search(q), 100); }, 350); } });
      }
    });
    STORIES.forEach(s => {
      if (s.titleArabic.includes(q) || s.titleKurdish.toLowerCase().includes(lq) || s.description.toLowerCase().includes(lq))
        results.push({ icon: s.emoji, title: `${s.titleArabic} — ${s.titleKurdish}`, sub: `چیرۆک • ${s.description}`, action: () => { this.close(); App.navigate('stories'); setTimeout(() => StoryModule.open(s.id), 350); } });
    });
    this._results = results; this._activeIdx = -1;
    if (!results.length) { el.innerHTML = `<p class="gs-hint">هیچ ئەنجام نەدۆزرایەوە بۆ «${q}»</p>`; return; }
    el.innerHTML = results.slice(0, 12).map((r, i) => `
      <div class="gs-item" onclick="GlobalSearch._results[${i}].action()">
        <span class="gs-item-icon">${r.icon}</span>
        <div class="gs-item-info">
          <div class="gs-item-title">${r.title}</div>
          <div class="gs-item-sub">${r.sub}</div>
        </div>
        <i class="bi bi-arrow-left gs-item-arrow"></i>
      </div>`).join('');
  }
};

/* ═══════════════════════════════════════
   DAILY CHALLENGE MODULE
═══════════════════════════════════════ */
const DailyChallengeModule = {
  _questions: [],
  _idx: 0,
  _score: 0,
  _answered: false,

  _todayKey() { return new Date().toISOString().split('T')[0]; },

  _buildQuestions() {
    const seed = Math.floor(Date.now() / 86400000);
    const pool = [...QUIZ_QUESTIONS].sort((a, b) => {
      let h = seed;
      const sh = s => { for (let i = 0; i < s.length; i++) { h = Math.imul(31, h) + s.charCodeAt(i) | 0; } return h; };
      return sh(a.question) - sh(b.question);
    });
    return pool.slice(0, 3);
  },

  render() {
    const el = document.getElementById('dailyChallenge');
    if (!el) return;
    const today = this._todayKey();
    const dc = appState.dailyChallenge;
    if (dc && dc.date === today && dc.done) {
      el.innerHTML = `
        <div class="dc-card dc-done">
          <div class="dc-done-icon">🏅</div>
          <div>
            <div class="dc-done-title">چالەنجی ئەمرۆ تەواو کردت!</div>
            <div class="dc-done-sub">${dc.score}/3 وەڵامی دروست — +${dc.earnedXP} XP</div>
          </div>
          <div class="dc-done-check"><i class="bi bi-check-circle-fill"></i></div>
        </div>`;
      return;
    }
    this._questions = this._buildQuestions();
    this._idx = 0; this._score = 0; this._answered = false;
    this._renderQuestion();
  },

  _renderQuestion() {
    const el = document.getElementById('dailyChallenge');
    if (!el) return;
    if (this._idx >= this._questions.length) { this._finish(); return; }
    const q = this._questions[this._idx];
    this._answered = false;
    el.innerHTML = `
      <div class="dc-card">
        <div class="dc-header">
          <span class="dc-badge"><i class="bi bi-lightning-charge-fill me-1"></i>چالەنجی ڕۆژانە</span>
          <span class="dc-counter">${this._idx + 1}/3</span>
        </div>
        <div class="dc-question">${q.question}</div>
        ${q.arabicText ? `<div class="dc-arabic">${q.arabicText}</div>` : ''}
        <div class="dc-options">
          ${q.options.map((opt, i) => `<button class="dc-opt" onclick="DailyChallengeModule.answer(${i}, this)">${opt}</button>`).join('')}
        </div>
        <div class="dc-feedback d-none" id="dcFeedback"></div>
      </div>`;
    if (q.arabicText) setTimeout(() => SpeechModule.speak(q.arabicText), 400);
  },

  answer(idx, btn) {
    if (this._answered) return;
    this._answered = true;
    const q = this._questions[this._idx];
    const correct = q.options[idx] === q.correctAnswer;
    document.querySelectorAll('.dc-opt').forEach((b, i) => {
      b.disabled = true;
      if (q.options[i] === q.correctAnswer) b.classList.add('dc-correct');
    });
    if (!correct) btn.classList.add('dc-wrong');
    else this._score++;
    SoundModule.play(correct ? 'correct' : 'wrong');
    const fb = document.getElementById('dcFeedback');
    fb.className = `dc-feedback ${correct ? 'dc-fb-ok' : 'dc-fb-no'}`;
    fb.textContent = correct ? `✔ دروستە! — ${q.explanation}` : `✘ وەڵامی دروست: ${q.correctAnswer}`;
    setTimeout(() => { this._idx++; this._renderQuestion(); }, correct ? 1200 : 2000);
  },

  _finish() {
    const today = this._todayKey();
    const xp = [10, 20, 35][this._score] || 10;
    appState.dailyChallenge = { date: today, done: true, score: this._score, earnedXP: xp };
    saveState(appState);
    App.addXP(xp);
    const el = document.getElementById('dailyChallenge');
    if (!el) return;
    const stars = ['⭐','⭐⭐','⭐⭐⭐'][this._score] || '⭐';
    el.innerHTML = `
      <div class="dc-card dc-done dc-finish-anim">
        <div class="dc-done-icon">${this._score === 3 ? '🏆' : this._score >= 2 ? '🥈' : '🥉'}</div>
        <div>
          <div class="dc-done-title">${stars} ${this._score}/3 وەڵامی دروست!</div>
          <div class="dc-done-sub">+${xp} XP کەسبکردت — سبەی دووبارە وێنەبێت!</div>
        </div>
        <div class="dc-done-check" style="color:#f59e0b"><i class="bi bi-star-fill"></i></div>
      </div>`;
  }
};

/* ═══════════════════════════════════════
   GRAMMAR MODULE
═══════════════════════════════════════ */
const GrammarModule = {
  rules: [
    {
      icon: '☀️🌙', title: 'شەمسیە و قەمەریە',
      body: `کاتێک <strong>ئەڵ (ال)</strong> پێش پیتی شەمسیە دەهێنرێت، <em>ل</em> بووە دەنگی ئەو پیتە. بۆ نموونە: <span class="gram-ar">الشَّمْس</span> (خۆر) = ئەش-شەمس.<br>کاتێک پێش پیتی قەمەریە دێت، <em>ل</em>ی خۆی دەندێت: <span class="gram-ar">الْقَمَر</span> (مانگ) = ئەل-قەمەر.`
    },
    {
      icon: '♂️♀️', title: 'نێر و مێ (مذکر و مؤنث)',
      body: `زۆرینەی ناوە مێیەکان بە <strong>ة (تا مربوطە)</strong> کۆتایی دێن.<br>نموونە: <span class="gram-ar">مُعَلِّم</span> (مامۆستای نێر) ← <span class="gram-ar">مُعَلِّمَة</span> (مامۆستای مێ).<br>چەند ناوێکیش بەبێ ة مێن: <span class="gram-ar">أُمّ، أُخْت</span> (دایک، خوشک).`
    },
    {
      icon: '1️⃣2️⃣', title: 'ژمارەی کرداری (جمع)',
      body: `عەرەبی سێ جۆر ژمارە هەیە: <strong>تاک (مفرد)</strong>، <strong>دووی (مثنی)</strong>، <strong>زۆر (جمع)</strong>.<br>دووی: <span class="gram-ar">كِتَاب</span> ← <span class="gram-ar">كِتَابـَان</span> (دوو کتێب).<br>زۆری ناسراو: <span class="gram-ar">كُتُب</span> — پێویستی بە ئەزبەرکردن هەیە.`
    },
    {
      icon: '🔤', title: 'حەرفەکانی کێشەدان (حروف الجر)',
      body: `حەرفە گرەکانی سەرەکی:<br>
        <span class="gram-ar">في</span> = لە (ناوەوە) &nbsp;
        <span class="gram-ar">من</span> = لە (لەژووردا) &nbsp;
        <span class="gram-ar">إلى</span> = بۆ &nbsp;
        <span class="gram-ar">على</span> = سەر &nbsp;
        <span class="gram-ar">مع</span> = لەگەڵ &nbsp;
        <span class="gram-ar">عن</span> = دەربارەی`
    },
    {
      icon: '⏰', title: 'کاتی ئێستا و ئایندە (المضارع)',
      body: `کردار لە کاتی ئێستا/ئایندەدا پێشگری دەگرێت: <strong>أَ/تَ/يَ/نَ</strong>.<br>
        <span class="gram-ar">كَتَبَ</span> (نووسی) ← <span class="gram-ar">يَكْتُبُ</span> (دەنووسێت).<br>
        نمووەکانی سەرەکی:<br>
        <span class="gram-ar">يَذْهَبُ</span> دەچێت &nbsp; <span class="gram-ar">يَأْكُلُ</span> دەخوات &nbsp; <span class="gram-ar">يَقُولُ</span> دەڵێت`
    },
    {
      icon: '🔤', title: 'وانەی نکرە و مەعرفە',
      body: `<strong>نکرە</strong> (نەناسراو) = بەبێ ئەڵ: <span class="gram-ar">بَيْت</span> (خانوویەک).<br>
        <strong>مەعرفە</strong> (ناسراو) = لەگەڵ ئەڵ: <span class="gram-ar">البَيْت</span> (ئەو خانووەی).<br>
        تانوین (ـٌ ـً ـٍ) نیشانەی نکرەیە: <span class="gram-ar">كِتَابٌ</span> = کتێبێک.`
    }
  ],

  show() {
    const body = document.getElementById('grammarModalBody');
    if (!body) return;
    body.innerHTML = this.rules.map((r, i) => `
      <div class="gram-rule">
        <div class="gram-rule-header" onclick="GrammarModule.toggle(${i})">
          <span class="gram-rule-icon">${r.icon}</span>
          <span class="gram-rule-title">${r.title}</span>
          <i class="bi bi-chevron-down gram-chevron" id="gram-chev-${i}"></i>
        </div>
        <div class="gram-rule-body" id="gram-body-${i}">${r.body}</div>
      </div>`).join('');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('grammarModal')).show();
  },

  toggle(i) {
    const b = document.getElementById(`gram-body-${i}`);
    const c = document.getElementById(`gram-chev-${i}`);
    if (!b) return;
    const open = b.style.display !== 'none';
    b.style.display = open ? 'none' : '';
    if (c) c.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
  }
};

/* ═══════════════════════════════════════
   LISTEN QUIZ MODULE  (گوێدان + هەڵبژارتن)
═══════════════════════════════════════ */
const ListenQuizModule = {
  _words: [], _idx: 0, _score: 0, _answered: false, _total: 10,

  open() {
    this._words = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, this._total);
    this._idx = 0; this._score = 0; this._answered = false;
    const ov = document.getElementById('listenQuizOverlay');
    if (ov) { ov.classList.remove('d-none'); this._renderQ(); }
  },

  close() {
    const ov = document.getElementById('listenQuizOverlay');
    if (ov) ov.classList.add('d-none');
    window.speechSynthesis.cancel();
  },

  _renderQ() {
    const q = this._words[this._idx];
    this._answered = false;
    const others = VOCABULARY.filter(w => w.id !== q.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...others.map(w => ({text:w.kurdish, correct:false})), {text:q.kurdish, correct:true}]
      .sort(() => Math.random() - 0.5);
    const el = document.getElementById('lqzContent');
    if (!el) return;
    el.innerHTML = `
      <div class="lqz-bar-row">
        <div class="lqz-progress"><div class="lqz-progress-inner" style="width:${this._idx/this._total*100}%"></div></div>
        <span class="lqz-counter">${this._idx+1}/${this._total}</span>
      </div>
      <div class="lqz-listen-area">
        <button class="lqz-play-btn" id="lqzPlayBtn" onclick="ListenQuizModule.playWord()">
          <i class="bi bi-headphones"></i><span>گوێ بگرە</span>
        </button>
        <div class="lqz-arabic-hint" id="lqzHint" style="opacity:0"></div>
      </div>
      <p class="lqz-question">مانای ئەم وشەیە بە کوردی چییە؟</p>
      <div class="lqz-options">
        ${opts.map(o => `<button class="lqz-opt" data-correct="${o.correct}" onclick="ListenQuizModule.answer(this, ${o.correct})">${o.text}</button>`).join('')}
      </div>
      <div class="lqz-feedback d-none" id="lqzFeedback"></div>`;
    setTimeout(() => this.playWord(), 500);
  },

  playWord() {
    const q = this._words[this._idx];
    SpeechModule.speak(q.arabic);
    const btn = document.getElementById('lqzPlayBtn');
    if (btn) { btn.classList.add('lqz-playing'); setTimeout(() => btn.classList.remove('lqz-playing'), 1600); }
  },

  answer(btn, correct) {
    if (this._answered) return;
    this._answered = true;
    const q = this._words[this._idx];
    if (correct) this._score++;
    else {
      appState.quizMistakes = appState.quizMistakes || {};
      appState.quizMistakes[q.arabic] = (appState.quizMistakes[q.arabic] || 0) + 1;
      saveState(appState);
    }
    document.querySelectorAll('.lqz-opt').forEach(b => { b.disabled = true; if (b.dataset.correct === 'true') b.classList.add('lqz-correct'); });
    if (!correct) btn.classList.add('lqz-wrong');
    SoundModule.play(correct ? 'correct' : 'wrong');
    const hint = document.getElementById('lqzHint');
    if (hint) { hint.textContent = `${q.arabic} — [${q.transliteration}]`; hint.style.opacity = '1'; }
    const fb = document.getElementById('lqzFeedback');
    if (fb) { fb.className = `lqz-feedback ${correct ? 'lqz-fb-ok' : 'lqz-fb-no'}`; fb.textContent = correct ? `✔ ئافەرین! — ${q.kurdish}` : `✘ دروست: ${q.kurdish}`; }
    setTimeout(() => { this._idx++; if (this._idx < this._total) this._renderQ(); else this._finish(); }, correct ? 1100 : 2000);
  },

  _finish() {
    const xp = Math.round(this._score * 5);
    App.addXP(xp);
    const el = document.getElementById('lqzContent');
    if (!el) return;
    const pct = Math.round(this._score / this._total * 100);
    el.innerHTML = `
      <div class="lqz-result">
        <div class="lqz-result-icon">${pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '📚'}</div>
        <div class="lqz-result-score">${this._score}/${this._total}</div>
        <div class="lqz-result-msg">${pct >= 80 ? 'گوێدانت سەرور باشە!' : pct >= 50 ? 'باشە — بەردەوام بە!' : 'گوێدان پڕاکتیزی زیاتر دەخوازێت!'}</div>
        <div class="lqz-result-xp">+${xp} XP کەسبکردت</div>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <button class="btn btn-primary" onclick="ListenQuizModule.open()">جارێکی تر</button>
          <button class="btn btn-outline-secondary" onclick="ListenQuizModule.close()">داخستن</button>
        </div>
      </div>`;
  }
};

/* ═══════════════════════════════════════
   MATCH GAME MODULE  (یاری دووبەرد)
═══════════════════════════════════════ */
const MatchGameModule = {
  _pairs: [], _selected: null, _matched: 0, _timer: null, _startTime: 0,

  open() {
    this._pairs = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, 5);
    this._selected = null; this._matched = 0;
    const ov = document.getElementById('matchGameOverlay');
    if (ov) { ov.classList.remove('d-none'); this._render(); }
  },

  close() {
    const ov = document.getElementById('matchGameOverlay');
    if (ov) ov.classList.add('d-none');
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  },

  _render() {
    const el = document.getElementById('matchGameContent');
    if (!el) return;
    const tiles = [
      ...this._pairs.map(p => ({id:p.id, text:p.arabic, arabic:true})),
      ...this._pairs.map(p => ({id:p.id, text:p.kurdish, arabic:false}))
    ].sort(() => Math.random() - 0.5);
    el.innerHTML = `
      <div class="mg-header">
        <span class="mg-badge"><i class="bi bi-grid-3x3-gap-fill me-1"></i>یاری دووبەرد</span>
        <span class="mg-timer-disp" id="mgTimerDisp">⏱ 0s</span>
        <button class="mg-close-btn" onclick="MatchGameModule.close()"><i class="bi bi-x-lg"></i></button>
      </div>
      <p class="mg-instruction">جوتە عەرەبی+کوردییەکانیان دریابکەرەوە!</p>
      <div class="mg-grid" id="mgGrid">
        ${tiles.map(t => `
          <div class="mg-tile" data-id="${t.id}" data-arabic="${t.arabic}" onclick="MatchGameModule.pick(this)">
            <span class="${t.arabic ? 'mg-arabic-text' : 'mg-kurdish-text'}">${t.text}</span>
          </div>`).join('')}
      </div>
      <div class="mg-status" id="mgStatus">0/5 جوتی دریایەوە</div>`;
    this._startTime = Date.now();
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      const d = document.getElementById('mgTimerDisp');
      if (d) d.textContent = `⏱ ${Math.floor((Date.now()-this._startTime)/1000)}s`;
    }, 1000);
  },

  pick(tile) {
    if (tile.classList.contains('mg-done') || tile.classList.contains('mg-shake')) return;
    if (!this._selected) {
      this._selected = tile; tile.classList.add('mg-selected');
      if (tile.dataset.arabic === 'true') SpeechModule.speak(tile.querySelector('.mg-arabic-text').textContent);
    } else {
      if (this._selected === tile) { tile.classList.remove('mg-selected'); this._selected = null; return; }
      const match = this._selected.dataset.id === tile.dataset.id &&
                    this._selected.dataset.arabic !== tile.dataset.arabic;
      if (match) {
        [this._selected, tile].forEach(t => { t.classList.remove('mg-selected'); t.classList.add('mg-done'); });
        SoundModule.play('correct'); this._matched++;
        const s = document.getElementById('mgStatus');
        if (s) s.textContent = `${this._matched}/5 جوتی دریایەوە`;
        if (this._matched === 5) setTimeout(() => this._finish(), 400);
      } else {
        const prev = this._selected;
        [prev, tile].forEach(t => t.classList.add('mg-shake'));
        SoundModule.play('wrong');
        setTimeout(() => { [prev, tile].forEach(t => { t.classList.remove('mg-selected','mg-shake'); }); }, 650);
      }
      this._selected = null;
    }
  },

  _finish() {
    clearInterval(this._timer); this._timer = null;
    const secs = Math.floor((Date.now()-this._startTime)/1000);
    App.addXP(25);
    const el = document.getElementById('matchGameContent');
    if (!el) return;
    el.innerHTML = `
      <div class="mg-result">
        <div class="mg-result-icon">🎉</div>
        <div class="mg-result-title">هەموو جوتەکانت دریاند!</div>
        <div class="mg-result-time">⏱ ${secs} چرکە</div>
        <div class="mg-result-xp">+25 XP</div>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <button class="btn btn-primary" onclick="MatchGameModule.open()">جارێکی تر</button>
          <button class="btn btn-outline-secondary" onclick="MatchGameModule.close()">داخستن</button>
        </div>
      </div>`;
  }
};

/* ═══════════════════════════════════════
   LETTER SEARCH
═══════════════════════════════════════ */
LetterModule.search = function(query) {
  const q = query.toLowerCase().trim();
  const grid = document.getElementById('lettersGrid');
  if (!grid) return;
  document.querySelectorAll('.letter-card').forEach(card => {
    const col = card.parentElement;
    const name = card.querySelector('.lc-name')?.textContent.toLowerCase() || '';
    const kname = card.querySelector('.lc-kurdish')?.textContent.toLowerCase() || '';
    const arabic = card.querySelector('.lc-arabic')?.textContent || '';
    col.style.display = (!q || name.includes(q) || kname.includes(q) || arabic.includes(q)) ? '' : 'none';
  });
};

/* ═══════════════════════════════════════
   LETTER QUIZ MODULE
═══════════════════════════════════════ */
const LetterQuizModule = {
  questions: [],
  index: 0,
  score: 0,
  answered: false,

  start() {
    const pool = [...ARABIC_LETTERS].sort(() => Math.random() - 0.5).slice(0, 10);
    this.questions = pool.map(letter => {
      const wrongs = ARABIC_LETTERS
        .filter(l => l.id !== letter.id)
        .sort(() => Math.random() - 0.5).slice(0, 3)
        .map(l => l.kurdishName);
      const options = [...wrongs, letter.kurdishName].sort(() => Math.random() - 0.5);
      return { letter, correct: letter.kurdishName, options };
    });
    this.index = 0;
    this.score = 0;
    this.answered = false;
    const overlay = document.getElementById('lqOverlay');
    overlay.classList.remove('d-none');
    document.getElementById('lqQuestion').classList.remove('d-none');
    document.getElementById('lqResult').classList.add('d-none');
    this.render();
  },

  close() {
    document.getElementById('lqOverlay').classList.add('d-none');
  },

  render() {
    const q = this.questions[this.index];
    if (!q) { this.finish(); return; }
    this.answered = false;
    document.getElementById('lqCounter').textContent = `${this.index + 1} / ${this.questions.length}`;
    document.getElementById('lqProgressBar').style.width = `${Math.round((this.index / this.questions.length) * 100)}%`;
    document.getElementById('lqLetterBig').textContent = q.letter.arabic;
    document.getElementById('lqLetterName').textContent = q.letter.name;
    document.getElementById('lqOptions').innerHTML = q.options.map((opt, i) =>
      `<button class="lq-opt-btn" onclick="LetterQuizModule.answer(${i}, this)">${opt}</button>`
    ).join('');
    const fb = document.getElementById('lqFeedback');
    fb.className = 'lq-feedback d-none';
    document.getElementById('lqNext').classList.add('d-none');
    SpeechModule.speak(q.letter.arabic);
  },

  answer(idx, btn) {
    if (this.answered) return;
    this.answered = true;
    const q = this.questions[this.index];
    const isCorrect = q.options[idx] === q.correct;
    document.querySelectorAll('.lq-opt-btn').forEach((b, i) => {
      b.disabled = true;
      if (q.options[i] === q.correct) b.classList.add('lq-correct');
    });
    if (!isCorrect) btn.classList.add('lq-wrong');
    else this.score++;
    SoundModule.play(isCorrect ? 'correct' : 'wrong');
    const fb = document.getElementById('lqFeedback');
    fb.className = `lq-feedback ${isCorrect ? 'lq-fb-correct' : 'lq-fb-wrong'}`;
    fb.textContent = isCorrect
      ? `✔ دروستە! — [${q.letter.transliteration}]`
      : `✘ وەڵامی دروست: ${q.correct}`;
    document.getElementById('lqNext').classList.remove('d-none');
    if (isCorrect) setTimeout(() => this.next(), 1100);
  },

  next() {
    this.index++;
    if (this.index >= this.questions.length) { this.finish(); return; }
    this.render();
  },

  finish() {
    const total = this.questions.length;
    const pct   = Math.round((this.score / total) * 100);
    document.getElementById('lqQuestion').classList.add('d-none');
    const res = document.getElementById('lqResult');
    res.classList.remove('d-none');
    res.innerHTML = `
      <div class="text-center py-3">
        <div style="font-size:3.5rem">${pct >= 70 ? '🏆' : pct >= 50 ? '📖' : '🌱'}</div>
        <h4 class="mt-3" style="color:var(--primary-light)">${pct >= 70 ? 'ئاوایت کرد!' : 'بەردەوام بێ!'}</h4>
        <p style="color:var(--light-text)">${this.score} لە ${total} وەڵامی دروست</p>
        <div class="lq-pct-big">${pct}%</div>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <button class="btn btn-primary" onclick="LetterQuizModule.start()">
            <i class="bi bi-arrow-counterclockwise me-2"></i>دووبارە
          </button>
          <button class="btn btn-outline-secondary" onclick="LetterQuizModule.close()">داخستن</button>
        </div>
      </div>`;
    if (pct >= 70) App.addXP(20);
  }
};

/* ═══════════════════════════════════════
   QUIZ MODULE
═══════════════════════════════════════ */
const QuizModule = {
  currentQuestions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  answered: false,
  currentCategory: '',
  timerInterval: null,
  timeLeft: 0,

  renderMenu() {
    document.getElementById('quizMenu').classList.remove('d-none');
    document.getElementById('quizActive').classList.add('d-none');
    document.getElementById('quizResult').classList.add('d-none');
    const grid = document.getElementById('quizTypeCards');
    if (!grid) return;
    grid.innerHTML = '';
    QUIZ_CATEGORIES.forEach((cat, idx) => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      const best = (appState.quizBestScores || {})[cat.id];
      const bestBadge = best !== undefined
        ? `<span class="qt-best-badge">🏆 ${best}%</span>`
        : `<span class="qt-best-badge qt-no-best">تاقی نەکردووە</span>`;
      col.innerHTML = `
        <div class="quiz-type-card" onclick="QuizModule.start('${cat.id}',${cat.count})"
             style="animation-delay:${idx * 0.1}s">
          <span class="qt-icon">${cat.icon}</span>
          <div class="qt-title">${cat.title}</div>
          <p class="qt-desc">${cat.description}</p>
          <div class="d-flex align-items-center justify-content-between mt-2 gap-2">
            <span class="qt-count">${cat.count} پرسیار</span>
            ${bestBadge}
          </div>
        </div>`;
      grid.appendChild(col);
    });
  },

  start(category, count) {
    this.currentCategory = category;
    let pool;
    if (category === 'mixed') {
      pool = [...QUIZ_QUESTIONS];
    } else {
      pool = QUIZ_QUESTIONS.filter(q => q.category === category);
    }
    // shuffle
    pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
    this.currentQuestions = pool;
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.answered = false;

    document.getElementById('quizMenu').classList.add('d-none');
    document.getElementById('quizActive').classList.remove('d-none');
    document.getElementById('quizResult').classList.add('d-none');
    this.renderQuestion();
    // keyboard shortcut: 1-4 for answers, Enter for next
    this._keyHandler = (e) => {
      const k = e.key;
      if (!this.answered && ['1','2','3','4'].includes(k)) {
        const idx = parseInt(k) - 1;
        const btns = document.querySelectorAll('.quiz-opt-btn');
        if (btns[idx]) { btns[idx].click(); }
      } else if (this.answered && (k === 'Enter' || k === ' ')) {
        const nb = document.getElementById('quizNextBtn');
        if (nb && !nb.classList.contains('d-none')) nb.click();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  },

  startTimer(seconds = 20) {
    this.stopTimer();
    this.timeLeft = seconds;
    const el = document.getElementById('quizTimer');
    if (el) { el.textContent = this.toPersianNum(this.timeLeft); el.className = 'quiz-timer'; }
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (el) {
        el.textContent = this.toPersianNum(this.timeLeft);
        if (this.timeLeft <= 5) el.className = 'quiz-timer danger';
      }
      if (this.timeLeft <= 0) {
        this.stopTimer();
        // Auto-submit as wrong if not answered
        if (!this.answered) {
          this.answered = true;
          const q = this.currentQuestions[this.currentIndex];
          document.querySelectorAll('.quiz-opt-btn').forEach((b) => {
            b.disabled = true;
            if (q.options[Array.from(document.querySelectorAll('.quiz-opt-btn')).indexOf(b)] === q.correctAnswer)
              b.classList.add('correct');
          });
          const feedbackEl = document.getElementById('quizFeedback');
          feedbackEl.className = 'quiz-feedback wrong';
          feedbackEl.innerHTML = `<i class="bi bi-alarm me-2"></i>کاتت تەواو بوو! وەڵامی دروست: <strong>${q.correctAnswer}</strong>`;
          const isLast = this.currentIndex === this.currentQuestions.length - 1;
          const nb = document.getElementById('quizNextBtn');
          nb.textContent = isLast ? '🏁 نتیجەکان ببینە' : 'پرسیاری دواتر';
          if (!isLast) nb.innerHTML += ' <i class="bi bi-arrow-left ms-2"></i>';
          nb.classList.remove('d-none');
        }
      }
    }, 1000);
  },

  renderQuestion() {
    const q = this.currentQuestions[this.currentIndex];
    if (!q) { this.finish(); return; }
    this.answered = false;
    this._hintUsed = false;
    const hintBtn  = document.getElementById('quizHintBtn');
    const hintText = document.getElementById('quizHintText');
    if (hintBtn)  { hintBtn.style.display  = q.arabicText ? 'inline-flex' : 'none'; hintBtn.disabled = false; }
    if (hintText) { hintText.style.display = 'none'; hintText.textContent = ''; }
    const total = this.currentQuestions.length;
    const current = this.currentIndex + 1;
    const pct = Math.round(((current - 1) / total) * 100);

    document.getElementById('quizProgressText').textContent = `پرسیار ${this.toPersianNum(current)} لە ${this.toPersianNum(total)}`;
    document.getElementById('quizScoreText').textContent = `نمرە: ${this.toPersianNum(this.score)}`;
    document.getElementById('quizProgressBar').style.width = pct + '%';
    document.getElementById('quizQuestionText').textContent = q.question;
    document.getElementById('quizArabicText').textContent = q.arabicText || '';
    document.getElementById('quizArabicText').style.display = q.arabicText ? 'block' : 'none';

    const optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = q.options.map((opt, i) => `
      <button class="quiz-opt-btn" onclick="QuizModule.answer(${i}, this)" data-index="${i}">
        ${opt}
      </button>`).join('');

    document.getElementById('quizFeedback').classList.add('d-none');
    document.getElementById('quizFeedback').className = 'quiz-feedback d-none';
    document.getElementById('quizNextBtn').classList.add('d-none');
    this.startTimer(20);
    if (q.arabicText) setTimeout(() => SpeechModule.speak(q.arabicText), 500);
  },

  useHint() {
    if (this._hintUsed || this.answered) return;
    this._hintUsed = true;
    const q = this.currentQuestions[this.currentIndex];
    const hintBtn  = document.getElementById('quizHintBtn');
    const hintText = document.getElementById('quizHintText');
    if (hintBtn) hintBtn.disabled = true;
    let hint = '';
    if (q.arabicText) {
      const match = VOCABULARY.find(v => v.arabic === q.arabicText);
      hint = match ? `[${match.transliteration}] – ${match.kurdish}` : q.arabicText;
    }
    if (hintText && hint) { hintText.textContent = `💡 ${hint}`; hintText.style.display = 'block'; }
  },

  stopQuiz() {
    this.stopTimer();
    this.cancelAutoAdvance();
    if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
  },

  answer(index, btn) {
    if (this.answered) return;
    this.answered = true;
    this.stopTimer();
    const q = this.currentQuestions[this.currentIndex];
    const selected = q.options[index];
    const isCorrect = selected === q.correctAnswer;

    document.querySelectorAll('.quiz-opt-btn').forEach((b, i) => {
      b.disabled = true;
      if (q.options[i] === q.correctAnswer) b.classList.add('correct');
    });

    if (!isCorrect) {
      btn.classList.add('wrong');
      // Track mistake
      const key = q.arabicText || q.question;
      if (key) { appState.quizMistakes = appState.quizMistakes || {}; appState.quizMistakes[key] = (appState.quizMistakes[key] || 0) + 1; saveState(appState); }
    } else { this.score += 10; this.correctCount++; }

    SoundModule.play(isCorrect ? 'correct' : 'wrong');

    document.getElementById('quizScoreText').textContent = `نمرە: ${this.toPersianNum(this.score)}`;

    const feedbackEl = document.getElementById('quizFeedback');
    feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackEl.innerHTML = isCorrect
      ? `<i class="bi bi-check-circle-fill me-2"></i>ئافەرین! وەڵامی دروستت دا 🎉<br><small>${q.explanation}</small>`
      : `<i class="bi bi-x-circle-fill me-2"></i>وەڵامی دروست: <strong>${q.correctAnswer}</strong><br><small>${q.explanation}</small>`;

    const nextBtn = document.getElementById('quizNextBtn');
    const isLast = this.currentIndex === this.currentQuestions.length - 1;
    nextBtn.textContent = isLast ? '🏁 نتیجەکان ببینە' : 'پرسیاری دواتر';
    nextBtn.innerHTML += isLast ? '' : ' <i class="bi bi-arrow-left ms-2"></i>';
    nextBtn.classList.remove('d-none');

    // Auto-advance on correct answer after 1.5s
    if (isCorrect) {
      this._autoAdvance = setTimeout(() => {
        if (this.answered) this.next();
      }, 1500);
    }
  },

  cancelAutoAdvance() {
    if (this._autoAdvance) { clearTimeout(this._autoAdvance); this._autoAdvance = null; }
  },

  next() {
    this.cancelAutoAdvance();
    this.currentIndex++;
    if (this.currentIndex >= this.currentQuestions.length) {
      this.finish();
    } else {
      this.renderQuestion();
    }
  },

  renderKeyHint() {
    const el = document.getElementById('quizKeyHint');
    if (el) el.innerHTML = '<i class="bi bi-keyboard me-1"></i>کلیلی ١-٤ بۆ وەڵام، Enter بۆ دواتر';
  },

  finish() {
    document.getElementById('quizActive').classList.add('d-none');
    document.getElementById('quizResult').classList.remove('d-none');
    const pct = Math.round((this.correctCount / this.currentQuestions.length) * 100);

    // Best score tracking
    if (!appState.quizBestScores) appState.quizBestScores = {};
    const prevBest = appState.quizBestScores[this.currentCategory];
    const isNewBest = prevBest === undefined || pct > prevBest;
    if (isNewBest) appState.quizBestScores[this.currentCategory] = pct;

    let emoji, title;
    if (pct >= 90)      { emoji = '🏆'; title = 'ئاوایت کرد! دابەشت زۆرە!'; }
    else if (pct >= 70) { emoji = '🌟'; title = 'باشبوو! تێکۆشانکاری!'; }
    else if (pct >= 50) { emoji = '👍'; title = 'قبووڵی! بەردەوام بە!'; }
    else                { emoji = '📚'; title = 'دووبارە تاقیبکەرەوە!'; }

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = title;
    if (isNewBest && prevBest !== undefined) {
      document.getElementById('resultTitle').innerHTML +=
        ' <span class="result-new-best">🏆 ریکۆردی نوێ!</span>';
    }
    document.getElementById('resultSubtitle').textContent = `تاقیکردنەوەی «${QUIZ_CATEGORIES.find(c=>c.id===this.currentCategory)?.title || ''}»`;
    document.getElementById('resultScore').textContent = this.toPersianNum(this.score);
    document.getElementById('resultCorrect').textContent = `${this.toPersianNum(this.correctCount)}/${this.toPersianNum(this.currentQuestions.length)}`;
    document.getElementById('resultPercent').textContent = this.toPersianNum(pct) + '%';
    this.stopQuiz();
    if (pct >= 70) this.launchConfetti();

    // Save to history
    appState.quizHistory.push({
      date: new Date().toLocaleDateString('en-US'),
      score: this.score,
      pct: Math.round((this.correctCount / this.currentQuestions.length) * 100),
      category: this.currentCategory
    });
    App.addXP(this.score);
    saveState(appState);
  },

  restart() {
    this.start(this.currentCategory, QUIZ_CATEGORIES.find(c=>c.id===this.currentCategory)?.count || 10);
  },

  launchConfetti() {
    const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#06b6d4','#f472b6'];
    for (let i = 0; i < 80; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.cssText = `left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};
        animation-duration:${0.8 + Math.random()*1.5}s;animation-delay:${Math.random()*0.5}s;
        width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;border-radius:${Math.random()>0.5?'50%':'2px'}`;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  },

  toPersianNum(n) {
    return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  }
};

/* ═══════════════════════════════════════
   PROGRESS MODULE
═══════════════════════════════════════ */
const ProgressModule = {
  render() {
    this.renderRank();
    this.renderOverview();
    this.renderLetterProgress();
    this.renderAchievements();
    this.renderQuizHistory();
    this.renderActivityHeatmap();
    this.renderWeakSpots();
  },

  copyProgress() {
    const { rank } = App.getRank();
    const lines = [
      `📊 دەربارەی پێشکەوتنم لە فێربوونی زمانی عەرەبی:`,
      `⭐ کۆی XP: ${appState.xp}`,
      `${rank.icon} پلە: ${rank.name}`,
      `🔥 ڕیزی ڕۆژانە: ${appState.streak} ڕۆژ`,
      `فeا پیتی فێربووی: ${appState.learnedLetters.length}/28`,
      `📖 وشەی فێربووی: ${appState.learnedVocab.length}/60`,
      `📚 چیڕۆکی خوێندراوە: ${appState.readStories.length}/${STORIES.length}`,
      `🎯 تاقیکردنەوە: ${appState.quizHistory.length}`,
      ``,
      `دربست فێربکەی 🚀 — فێربوونی عەرەبی بە کوردی`
    ];
    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => App.showToast('کۆپیکرا — بە هەر شوێن بوێنەوە بڵە 📋', 'success'));
    } else {
      prompt('کۆپیکە:', text);
    }
  },

  renderRank() {
    const el = document.getElementById('rankCard');
    if (!el) return;
    const { rank, next, pct } = App.getRank();
    el.innerHTML = `
      <div class="rank-display">
        <div class="rank-icon-big">${rank.icon}</div>
        <div class="rank-info">
          <div class="rank-name" style="color:${rank.color}">${rank.name}</div>
          <div class="rank-xp">${appState.xp} XP گشتی</div>
          ${next ? `
            <div class="rank-next">بۆ <strong>${next.name}</strong>: ${next.min - appState.xp} XP ماوە</div>
            <div class="rank-bar-wrap">
              <div class="rank-bar-fill" style="width:${pct}%;background:${rank.color}"></div>
            </div>` : '<div class="rank-next" style="color:#f59e0b">🎉 ئاستی زۆرترین گەیشتوویت!</div>'}
        </div>
        <div class="rank-badges-row">
          ${RANKS.map(r => `<div class="rank-pip ${appState.xp >= r.min ? 'active' : ''}" title="${r.name} (${r.min} XP)" style="${appState.xp >= r.min ? 'background:'+r.color : ''}">${r.icon}</div>`).join('')}
        </div>
      </div>`;
  },

  renderOverview() {
    const container = document.getElementById('progressOverview');
    if (!container) return;
    const totalXP  = appState.xp;
    const letters  = appState.learnedLetters.length;
    const vocab    = appState.learnedVocab.length;
    const stories  = appState.readStories.length;
    const quizzes  = appState.quizHistory.length;

    const items = [
      { icon: '⭐', value: totalXP,  label: 'کۆی XP', color: '#f59e0b' },
      { icon: 'ﺃ',  value: `${letters}/28`, label: 'پیتی فێربووی', color: '#6366f1' },
      { icon: '📖', value: `${vocab}/60`,   label: 'وشەی فێربووی', color: '#10b981' },
      { icon: '📚', value: `${stories}/${STORIES.length}`, label: 'چیرۆکی خوێندراوە', color: '#ef4444' },
      { icon: '🎯', value: quizzes,  label: 'تاقیکردنەوە', color: '#06b6d4' }
    ];

    container.innerHTML = items.map(item => `
      <div class="col-6 col-md-4 col-lg">
        <div class="progress-stat-card">
          <span class="psc-icon">${item.icon}</span>
          <span class="psc-value" style="color:${item.color}">${item.value}</span>
          <span class="psc-label">${item.label}</span>
        </div>
      </div>`).join('');
  },

  renderLetterProgress() {
    const container = document.getElementById('letterProgress');
    if (!container) return;
    const total = ARABIC_LETTERS.length;
    const learned = appState.learnedLetters.length;
    container.innerHTML = `
      <div class="lp-ring-wrap">
        <svg class="lp-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--primary)" stroke-width="10"
            stroke-dasharray="${(2*Math.PI*50).toFixed(1)}"
            stroke-dashoffset="${((1 - learned/total) * 2*Math.PI*50).toFixed(1)}"
            stroke-linecap="round" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1s ease"/>
        </svg>
        <div class="lp-ring-label"><span class="lp-num">${learned}</span><span class="lp-total">/${total}</span></div>
      </div>` +
      ARABIC_LETTERS.map(l => {
        const lrn = appState.learnedLetters.includes(l.id);
        return `
          <div class="letter-prog-item">
            <span class="lpi-letter">${l.arabic}</span>
            <div class="lpi-bar"><div class="lpi-fill" style="width:${lrn ? '100' : '0'}%"></div></div>
            <span class="lpi-pct${lrn ? ' learned' : ''}">${lrn ? '✔' : '—'}</span>
          </div>`;
      }).join('');
  },

  renderAchievements() {
    const container = document.getElementById('achievements');
    if (!container) return;
    const achievements = [
      { icon:'🌱', name:'دەستپێکار',      desc:'یەکەم پیتت فێربووی',          unlocked: appState.learnedLetters.length >= 1 },
      { icon:'📚', name:'خوێندنکار',      desc:'یەکەم چیرۆکت خوێندەوە',       unlocked: appState.readStories.length >= 1 },
      { icon:'🔢', name:'ژمارەدان',       desc:'ژمارەکانی ١ تا ١٠ فێربووی',   unlocked: appState.learnedVocab.filter(id => VOCABULARY.find(v=>v.id===id && v.category==='numbers')).length >= 10 },
      { icon:'🌟', name:'ستێرەی زانست', desc:'١٠٠ XP کەسبکردت',              unlocked: appState.xp >= 100 },
      { icon:'📖', name:'وشەزانی',       desc:'٢٠ وشەت فێربووی',              unlocked: appState.learnedVocab.length >= 20 },
      { icon:'🏆', name:'قاچەی عەرەبی', desc:'هەموو ٢٨ پیتت فێربووی',        unlocked: appState.learnedLetters.length >= 28 },
      { icon:'🎯', name:'تاقیکەرەوە',   desc:'٥ تاقیکردنەوەت کردووە',        unlocked: appState.quizHistory.length >= 5 },
      { icon:'💫', name:'مەستەر',        desc:'٥٠٠ XP کەسبکردت',              unlocked: appState.xp >= 500 }
    ];
    container.innerHTML = achievements.map(a => `
      <div class="achievement-item ${a.unlocked ? 'unlocked' : ''}">
        <span class="ai-icon">${a.icon}</span>
        <div class="ai-info">
          <div class="ai-name">${a.name}</div>
          <div class="ai-desc">${a.desc}</div>
        </div>
        ${a.unlocked
          ? '<span class="text-warning"><i class="bi bi-patch-check-fill"></i></span>'
          : '<span class="ai-locked"><i class="bi bi-lock-fill"></i></span>'
        }
      </div>`).join('');
  },

  renderQuizHistory() {
    const el = document.getElementById('quizHistory');
    if (!el) return;
    const history = appState.quizHistory.slice(-10).reverse();
    if (!history.length) {
      el.innerHTML = `<p style="color:var(--light-text);text-align:center;padding:2rem 0"><i class="bi bi-bar-chart" style="font-size:2rem;opacity:.3"></i><br>هێشتا تاقیکردنەوەت نەکردووە</p>`;
      return;
    }
    el.innerHTML = history.map(h => {
      const pct = h.pct !== undefined ? h.pct : Math.min(100, h.score);
      const catLabel = QUIZ_CATEGORIES.find(c => c.id === h.category)?.title || h.category;
      const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
      return `
        <div class="qh-row">
          <div class="qh-meta">
            <span class="qh-label">${catLabel}</span>
            <span class="qh-date">${h.date}</span>
          </div>
          <div class="qh-bar-wrap">
            <div class="qh-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <span class="qh-pct" style="color:${color}">${pct}%</span>
        </div>`;
    }).join('');
  },

  renderActivityHeatmap() {
    const el = document.getElementById('activityHeatmap');
    if (!el) return;
    const activity = appState.dailyActivity || {};
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().split('T')[0];
      const val = activity[key] || 0;
      const level = val === 0 ? 0 : val <= 10 ? 1 : val <= 30 ? 2 : val <= 60 ? 3 : 4;
      const label = d.toLocaleDateString('ckb', { month: 'short', day: 'numeric' });
      cells.push(`<div class="hm-cell hm-lv${level}" title="${label}: ${val} XP"></div>`);
    }
    // Day labels (Mo/We/Fr)
    const dayRow = `<div class="hm-days">${['ی','د','س','چ','پ','ه','ش'].map(d =>
      `<span class="hm-day">${d}</span>`).join('')}</div>`;
    el.innerHTML = `<div class="hm-grid">${cells.join('')}</div><div class="hm-legend">
      <span style="color:var(--light-text);font-size:.72rem">کەمتر</span>
      ${[0,1,2,3,4].map(l => `<div class="hm-cell hm-lv${l}"></div>`).join('')}
      <span style="color:var(--light-text);font-size:.72rem">زیاتر</span>
    </div>`;
  },

  renderWeakSpots() {
    const el = document.getElementById('weakSpots');
    if (!el) return;
    const mistakes = appState.quizMistakes || {};
    const sorted = Object.entries(mistakes).sort((a,b) => b[1]-a[1]).slice(0, 6);
    if (!sorted.length) {
      el.innerHTML = `<p class="text-center py-3" style="color:var(--muted-text);font-size:.85rem"><i class="bi bi-patch-check-fill text-success me-2"></i>هێشتا هیچ هەڵەی تۆمارکراوت نییە — تاقیکردنەوە بکە!</p>`;
      return;
    }
    const maxCount = sorted[0][1];
    el.innerHTML = sorted.map(([key, count]) => {
      const word = VOCABULARY.find(v => v.arabic === key);
      const label = key;
      const meaning = word ? word.kurdish : '';
      const pct = Math.round(count / maxCount * 100);
      return `
        <div class="ws-item">
          <div class="ws-info">
            <span class="ws-arabic">${label}</span>
            ${meaning ? `<span class="ws-kurdish">${meaning}</span>` : ''}
          </div>
          <div class="ws-bar-wrap">
            <div class="ws-bar-fill" style="width:${pct}%;background:${count >= 4 ? '#ef4444' : count >= 2 ? '#f59e0b' : '#6366f1'}"></div>
          </div>
          <span class="ws-count">${count}x</span>
          <button class="ws-speak" onclick="SpeechModule.speak('${label.replace(/'/g,"\\'")}')"><i class="bi bi-volume-up-fill"></i></button>
        </div>`;
    }).join('');
  },

  reset() {
    if (!confirm('دڵنیای لە سڕینەوەی هەموو پێشکەوتنت؟')) return;
    appState = {
      currentSection: 'home',
      xp: 0,
      streak: 0,
      lastVisit: new Date().toDateString(),
      learnedLetters: [],
      learnedVocab: [],
      favoriteVocab: [],
      vocabLastSeen: {},
      vocabNotes: {},
      dailyActivity: {},
      readStories: [],
      quizHistory: [],
      quizBestScores: {},
      quizMistakes: {},
      ttsSpeed: 1,
      dailyChallenge: null
    };
    saveState(appState);
    document.getElementById('xpCount').textContent = '0';
    document.getElementById('streakCount').textContent = '0';
    this.render();
    App.showToast('هەموو پێشکەوتنەکانت سڕایەوە', 'error');
  }
};

/* ═══════════════════════════════════════
   TYPING PRACTICE MODULE
═══════════════════════════════════════ */
const TypingPracticeModule = {
  _words: [], _idx: 0, _score: 0, _total: 8,

  open() {
    this._words = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, this._total);
    this._idx = 0; this._score = 0;
    const ov = document.getElementById('typingPracticeOverlay');
    if (ov) { ov.classList.remove('d-none'); this._renderQ(); }
  },

  close() {
    const ov = document.getElementById('typingPracticeOverlay');
    if (ov) ov.classList.add('d-none');
    window.speechSynthesis.cancel();
  },

  _norm(s) { return s.toLowerCase().trim().replace(/[\s\u200c\u200d\-_]/g, ''); },

  _renderQ() {
    const q = this._words[this._idx];
    const el = document.getElementById('tpContent');
    if (!el) return;
    const aEsc = q.arabic.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    el.innerHTML = `
      <div class="tp-bar-row">
        <div class="tp-progress"><div class="tp-progress-inner" style="width:${this._idx/this._total*100}%"></div></div>
        <span class="tp-counter">${this._idx+1}/${this._total}</span>
      </div>
      <div class="tp-word-display">
        <div class="tp-arabic-word">${q.arabic}</div>
        <button class="tp-play-btn" onclick="SpeechModule.speak('${aEsc}')"><i class="bi bi-volume-up-fill"></i></button>
      </div>
      <div class="tp-translit">[${q.transliteration}]</div>
      <p class="tp-instruction">مانای کوردیی ئەم وشەیە بنووسە:</p>
      <div class="tp-input-group">
        <input type="text" id="tpInput" class="tp-input" placeholder="وەڵامت بنووسە..."
          autocomplete="off" autocorrect="off" spellcheck="false"
          onkeydown="if(event.key==='Enter')TypingPracticeModule.submit()" />
        <button class="tp-submit-btn" onclick="TypingPracticeModule.submit()"><i class="bi bi-check-lg"></i></button>
      </div>
      <div class="tp-feedback d-none" id="tpFeedback"></div>
      <button class="btn btn-link text-muted mt-1" style="font-size:.78rem" onclick="TypingPracticeModule.skip()">تێپەڕاندن →</button>`;
    setTimeout(() => { const i = document.getElementById('tpInput'); if(i) i.focus(); SpeechModule.speak(q.arabic); }, 350);
  },

  submit() {
    const inp = document.getElementById('tpInput');
    if (!inp || !inp.value.trim()) return;
    const q = this._words[this._idx];
    const input = this._norm(inp.value);
    const correct = this._norm(q.kurdish);
    const translit = this._norm(q.transliteration);
    const ok = input === correct
      || (correct.includes(input) && input.length >= 2)
      || input.includes(correct)
      || input === translit
      || (translit.includes(input) && input.length >= 3);
    if (ok) this._score++;
    else {
      appState.quizMistakes = appState.quizMistakes || {};
      appState.quizMistakes[q.arabic] = (appState.quizMistakes[q.arabic] || 0) + 1;
      saveState(appState);
    }
    inp.disabled = true;
    const sb = document.querySelector('.tp-submit-btn'); if (sb) sb.disabled = true;
    SoundModule.play(ok ? 'correct' : 'wrong');
    const fb = document.getElementById('tpFeedback');
    if (fb) {
      fb.className = `tp-feedback ${ok ? 'tp-fb-ok' : 'tp-fb-no'}`;
      fb.innerHTML = ok
        ? `✔ ئافەرین! <strong>${q.kurdish}</strong>`
        : `✘ وەڵامی دروست: <strong>${q.kurdish}</strong> [${q.transliteration}]`;
    }
    setTimeout(() => { this._idx++; if (this._idx < this._total) this._renderQ(); else this._finish(); }, ok ? 1000 : 2300);
  },

  skip() { this._idx++; if (this._idx < this._total) this._renderQ(); else this._finish(); },

  _finish() {
    const xp = this._score * 6;
    App.addXP(xp);
    const el = document.getElementById('tpContent');
    if (!el) return;
    const pct = Math.round(this._score / this._total * 100);
    el.innerHTML = `
      <div class="tp-result">
        <div class="tp-result-icon">${pct >= 75 ? '🏆' : pct >= 50 ? '⭐' : '📚'}</div>
        <div class="tp-result-score">${this._score}/${this._total}</div>
        <div class="tp-result-msg">${pct >= 75 ? 'نووسینت زۆر باشە!' : pct >= 50 ? 'باشە! بەردەوام بە!' : 'دووبارە هەوڵ بدە — ئێ دەکریات!'}</div>
        <div class="tp-result-xp">+${xp} XP</div>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <button class="btn btn-primary" onclick="TypingPracticeModule.open()">جارێکی تر</button>
          <button class="btn btn-outline-secondary" onclick="TypingPracticeModule.close()">داخستن</button>
        </div>
      </div>`;
  }
};

/* ═══════════════════════════════════════
   NUMBER SPEED DRILL
═══════════════════════════════════════ */
const NumberDrillModule = {
  _NUMS: [
    {ar:'٠',v:0},{ar:'١',v:1},{ar:'٢',v:2},{ar:'٣',v:3},{ar:'٤',v:4},
    {ar:'٥',v:5},{ar:'٦',v:6},{ar:'٧',v:7},{ar:'٨',v:8},{ar:'٩',v:9},
    {ar:'١٠',v:10},{ar:'١١',v:11},{ar:'١٢',v:12},{ar:'١٣',v:13},
    {ar:'١٥',v:15},{ar:'٢٠',v:20},{ar:'٢٥',v:25},{ar:'١٠٠',v:100}
  ],
  _q: [], _idx: 0, _score: 0, _total: 10,

  open() {
    this._q = [...this._NUMS].sort(() => Math.random() - 0.5).slice(0, this._total);
    this._idx = 0; this._score = 0;
    const ov = document.getElementById('numberDrillOverlay');
    if (ov) { ov.classList.remove('d-none'); this._renderQ(); }
  },

  close() { const ov = document.getElementById('numberDrillOverlay'); if (ov) ov.classList.add('d-none'); },

  _renderQ() {
    const el = document.getElementById('ndContent');
    if (!el) return;
    const q = this._q[this._idx];
    const wrongs = this._NUMS.filter(n => n.v !== q.v).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [{v: q.v}, ...wrongs].sort(() => Math.random() - 0.5);
    el.innerHTML = `
      <div class="nd-header">
        <span class="nd-badge"><i class="bi bi-123 me-1"></i>دڕیلی ژمارەکان</span>
        <span class="nd-counter">${this._idx+1}/${this._total}</span>
      </div>
      <div class="nd-progress-bar"><div class="nd-progress-inner" style="width:${this._idx/this._total*100}%"></div></div>
      <div class="nd-num-display">${q.ar}</div>
      <p class="nd-question">ئەم ژمارەی عەرەبی چەندە؟</p>
      <div class="nd-options">
        ${opts.map(o => `<button class="nd-opt" onclick="NumberDrillModule.answer(${o.v}, this, ${q.v})">${o.v}</button>`).join('')}
      </div>
      <div class="nd-feedback d-none" id="ndFeedback"></div>`;
  },

  answer(sel, btn, correct) {
    const ok = sel === correct;
    if (ok) this._score++;
    document.querySelectorAll('.nd-opt').forEach(b => {
      b.disabled = true;
      if (parseInt(b.textContent) === correct) b.classList.add('nd-correct');
    });
    if (!ok) btn.classList.add('nd-wrong');
    SoundModule.play(ok ? 'correct' : 'wrong');
    const fb = document.getElementById('ndFeedback');
    if (fb) {
      fb.className = `nd-feedback ${ok ? 'nd-fb-ok' : 'nd-fb-no'}`;
      fb.textContent = ok ? `✔ ئافەرین! ${this._q[this._idx].ar} = ${correct}` : `✘ وەڵامی دروست: ${correct}`;
    }
    setTimeout(() => { this._idx++; if (this._idx < this._total) this._renderQ(); else this._finish(); }, ok ? 900 : 1600);
  },

  _finish() {
    const xp = this._score * 4;
    App.addXP(xp);
    const el = document.getElementById('ndContent');
    if (!el) return;
    const pct = Math.round(this._score / this._total * 100);
    el.innerHTML = `
      <div class="nd-result">
        <div style="font-size:3rem">${pct >= 80 ? '🏆' : '⭐'}</div>
        <div style="font-size:2.5rem;font-weight:800;margin:.25rem 0">${this._score}/${this._total}</div>
        <div style="color:var(--muted-text);font-size:.9rem;margin-bottom:.5rem">${pct >= 80 ? 'ژمارەکانی عەرەبی خۆتبووە!' : 'بەردەوام بە!'}</div>
        <div class="nd-result-xp">+${xp} XP</div>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <button class="btn btn-primary" onclick="NumberDrillModule.open()">جارێکی تر</button>
          <button class="btn btn-outline-secondary" onclick="NumberDrillModule.close()">داخستن</button>
        </div>
      </div>`;
  }
};

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => App.init());
