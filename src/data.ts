// ═══════════════════════════════════════════════════
//  data.ts — Kurdish Arabic Learning System
//  All data: letters, vocabulary, stories, quiz
// ═══════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────

export interface ArabicLetter {
  id: number;
  arabic: string;
  name: string;
  kurdishName: string;
  transliteration: string;
  type: 'shamsieh' | 'qamariyeh' | 'long-vowels';
  forms: { isolated: string; initial: string; medial: string; final: string };
  examples: Array<{ arabic: string; meaning: string; pronunciation: string }>;
  kurdishDescription: string;
}

export interface VocabWord {
  id: number;
  arabic: string;
  kurdish: string;
  transliteration: string;
  category: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface StoryParagraph {
  arabic: string;
  translation: string;
  vocab: Array<{ ar: string; ku: string }>;
}

export interface Story {
  id: number;
  titleArabic: string;
  titleKurdish: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  emoji: string;
  description: string;
  moral: string;
  paragraphs: StoryParagraph[];
  wordCount: number;
  readTime: number;
  color: string;
}

export interface QuizQuestion {
  id: number;
  type: 'letter-to-name' | 'name-to-letter' | 'word-meaning' | 'fill-blank' | 'story-q';
  question: string;
  arabicText?: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  category: string;
}

// ── Arabic Letters (28) ────────────────────────────

export const ARABIC_LETTERS: ArabicLetter[] = [
  {
    id: 1, arabic: 'ا', name: 'أَلِف', kurdishName: 'ئالیف', transliteration: 'ā',
    type: 'qamariyeh',
    forms: { isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا' },
    kurdishDescription: 'یەکەم پیتی ئەلفوبێی عەرەبی — دەنگی درێژی (آ) دەدات',
    examples: [
      { arabic: 'أَب', meaning: 'باوک', pronunciation: 'ab' },
      { arabic: 'أَخ', meaning: 'برا', pronunciation: 'akh' },
      { arabic: 'أُمّ', meaning: 'دایک', pronunciation: 'umm' }
    ]
  },
  {
    id: 2, arabic: 'ب', name: 'بَاء', kurdishName: 'با', transliteration: 'b',
    type: 'qamariyeh',
    forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
    kurdishDescription: 'دودانی دوو لێوە — وەک «ب» لە کوردی',
    examples: [
      { arabic: 'بَيْت', meaning: 'ماڵ', pronunciation: 'bayt' },
      { arabic: 'بَاب', meaning: 'دەرگا', pronunciation: 'bāb' },
      { arabic: 'بَنَات', meaning: 'کچەکان', pronunciation: 'banāt' }
    ]
  },
  {
    id: 3, arabic: 'ت', name: 'تَاء', kurdishName: 'تا', transliteration: 't',
    type: 'shamsieh',
    forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
    kurdishDescription: 'دەنگی «ت» وەک بە کوردی — دوو خاڵی سەرەوە هەیە',
    examples: [
      { arabic: 'تَمْر', meaning: 'خورما', pronunciation: 'tamr' },
      { arabic: 'تِلْمِيذ', meaning: 'قوتابی', pronunciation: 'tilmīdh' },
      { arabic: 'تُفَّاح', meaning: 'سێو', pronunciation: 'tuffāḥ' }
    ]
  },
  {
    id: 4, arabic: 'ث', name: 'ثَاء', kurdishName: 'ثا', transliteration: 'th',
    type: 'shamsieh',
    forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
    kurdishDescription: 'دەنگی نێوانی «س» و «ز» — سێ خاڵی سەرەوە هەیە',
    examples: [
      { arabic: 'ثَعْلَب', meaning: 'ڕووباه', pronunciation: 'thaʿlab' },
      { arabic: 'ثَمَر', meaning: 'میوە', pronunciation: 'thamar' },
      { arabic: 'ثَلْج', meaning: 'بەفر', pronunciation: 'thalj' }
    ]
  },
  {
    id: 5, arabic: 'ج', name: 'جِيم', kurdishName: 'جیم', transliteration: 'j',
    type: 'qamariyeh',
    forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
    kurdishDescription: 'دەنگی «ج» وەک بە کوردی',
    examples: [
      { arabic: 'جَبَل', meaning: 'چیا', pronunciation: 'jabal' },
      { arabic: 'جَمِيل', meaning: 'جوان', pronunciation: 'jamīl' },
      { arabic: 'جَنَّة', meaning: 'بهەشت', pronunciation: 'janna' }
    ]
  },
  {
    id: 6, arabic: 'ح', name: 'حَاء', kurdishName: 'حا', transliteration: 'ḥ',
    type: 'qamariyeh',
    forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
    kurdishDescription: 'دەنگی «ح» گوازراوە لە گەڕووی کیرس — جیاوازە لە «هـ»',
    examples: [
      { arabic: 'حُبّ', meaning: 'خۆشەویستی', pronunciation: 'ḥubb' },
      { arabic: 'حَيَاة', meaning: 'ژیان', pronunciation: 'ḥayāt' },
      { arabic: 'حَر', meaning: 'گەرم', pronunciation: 'ḥarr' }
    ]
  },
  {
    id: 7, arabic: 'خ', name: 'خَاء', kurdishName: 'خا', transliteration: 'kh',
    type: 'qamariyeh',
    forms: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
    kurdishDescription: 'دەنگی «خ» — وەک «خ» بە کوردی',
    examples: [
      { arabic: 'خُبْز', meaning: 'نان', pronunciation: 'khubz' },
      { arabic: 'خَيْر', meaning: 'باشی', pronunciation: 'khayr' },
      { arabic: 'خَطّ', meaning: 'هێڵ / نووسین', pronunciation: 'khaṭṭ' }
    ]
  },
  {
    id: 8, arabic: 'د', name: 'دَال', kurdishName: 'دال', transliteration: 'd',
    type: 'shamsieh',
    forms: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
    kurdishDescription: 'دەنگی «د» — ئەم پیتە وەصڵ ناکرێت لە دوایی',
    examples: [
      { arabic: 'دَرْس', meaning: 'وانە', pronunciation: 'dars' },
      { arabic: 'دَار', meaning: 'ماڵ / شار', pronunciation: 'dār' },
      { arabic: 'دُكَّان', meaning: 'دوکان', pronunciation: 'dukkān' }
    ]
  },
  {
    id: 9, arabic: 'ذ', name: 'ذَال', kurdishName: 'ذال', transliteration: 'dh',
    type: 'shamsieh',
    forms: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
    kurdishDescription: 'دەنگی نێوانی «د» و «ز» — وەصڵ ناکرێت لە دوایی',
    examples: [
      { arabic: 'ذَهَب', meaning: 'زێڕ / چوو', pronunciation: 'dhahab' },
      { arabic: 'ذَكِيّ', meaning: 'زیرەک', pronunciation: 'dhakiyy' },
      { arabic: 'ذِئْب', meaning: 'گورگ', pronunciation: 'dhiʾb' }
    ]
  },
  {
    id: 10, arabic: 'ر', name: 'رَاء', kurdishName: 'ڕا', transliteration: 'r',
    type: 'shamsieh',
    forms: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
    kurdishDescription: 'دەنگی «ر» — وەصڵ ناکرێت لە دوایی',
    examples: [
      { arabic: 'رَجُل', meaning: 'پیاو', pronunciation: 'rajul' },
      { arabic: 'رَحْمَة', meaning: 'میرهومەت', pronunciation: 'raḥma' },
      { arabic: 'رَأْس', meaning: 'سەر', pronunciation: 'raʾs' }
    ]
  },
  {
    id: 11, arabic: 'ز', name: 'زَاي', kurdishName: 'زای', transliteration: 'z',
    type: 'shamsieh',
    forms: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
    kurdishDescription: 'دەنگی «ز» — وەصڵ ناکرێت لە دوایی',
    examples: [
      { arabic: 'زَهْرَة', meaning: 'گوڵ', pronunciation: 'zahra' },
      { arabic: 'زَمَان', meaning: 'کات / سەردەم', pronunciation: 'zamān' },
      { arabic: 'زَيْت', meaning: 'رووني', pronunciation: 'zayt' }
    ]
  },
  {
    id: 12, arabic: 'س', name: 'سِين', kurdishName: 'سین', transliteration: 's',
    type: 'shamsieh',
    forms: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
    kurdishDescription: 'دەنگی «س» — سێ دەنگپێکگیراوی لەژێر هەیە',
    examples: [
      { arabic: 'سَمَاء', meaning: 'ئاسمان', pronunciation: 'samāʾ' },
      { arabic: 'سَمَك', meaning: 'ماسی', pronunciation: 'samak' },
      { arabic: 'سَلَام', meaning: 'ئاشتی / سڵاو', pronunciation: 'salām' }
    ]
  },
  {
    id: 13, arabic: 'ش', name: 'شِين', kurdishName: 'شین', transliteration: 'sh',
    type: 'shamsieh',
    forms: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
    kurdishDescription: 'دەنگی «ش» — وەک بە کوردی، سێ خاڵی سەرەوە هەیە',
    examples: [
      { arabic: 'شَمْس', meaning: 'خۆر', pronunciation: 'shams' },
      { arabic: 'شَجَرَة', meaning: 'دار', pronunciation: 'shajara' },
      { arabic: 'شَارِع', meaning: 'کۆلان', pronunciation: 'shāriʿ' }
    ]
  },
  {
    id: 14, arabic: 'ص', name: 'صَاد', kurdishName: 'سواد', transliteration: 'ṣ',
    type: 'shamsieh',
    forms: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
    kurdishDescription: 'دەنگی «س» ی قووڵ — لە دەرونی دەهانەوە دەردەکەوێت',
    examples: [
      { arabic: 'صَبَاح', meaning: 'بەیانی', pronunciation: 'ṣabāḥ' },
      { arabic: 'صَدِيق', meaning: 'هاوڕێ', pronunciation: 'ṣadīq' },
      { arabic: 'صُورَة', meaning: 'وێنە', pronunciation: 'ṣūra' }
    ]
  },
  {
    id: 15, arabic: 'ض', name: 'ضَاد', kurdishName: 'ضواد', transliteration: 'ḍ',
    type: 'shamsieh',
    forms: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
    kurdishDescription: 'دەنگی «د» ی قووڵ — تایبەت بە زمانی عەرەبی',
    examples: [
      { arabic: 'ضَرَبَ', meaning: 'دایلێدا', pronunciation: 'ḍaraba' },
      { arabic: 'ضَوء', meaning: 'ڕووناکی', pronunciation: 'ḍawʾ' },
      { arabic: 'ضَخْم', meaning: 'مەزن', pronunciation: 'ḍakhm' }
    ]
  },
  {
    id: 16, arabic: 'ط', name: 'طَاء', kurdishName: 'تا', transliteration: 'ṭ',
    type: 'shamsieh',
    forms: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
    kurdishDescription: 'دەنگی «ت» ی قووڵ — لە دەرونی دەهانەوە دەردەکەوێت',
    examples: [
      { arabic: 'طَرِيق', meaning: 'ڕێگا', pronunciation: 'ṭarīq' },
      { arabic: 'طَعَام', meaning: 'خواردن', pronunciation: 'ṭaʿām' },
      { arabic: 'طِفْل', meaning: 'منداڵ', pronunciation: 'ṭifl' }
    ]
  },
  {
    id: 17, arabic: 'ظ', name: 'ظَاء', kurdishName: 'ظا', transliteration: 'ẓ',
    type: 'shamsieh',
    forms: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
    kurdishDescription: 'دەنگی «ذ» ی قووڵ — تایبەت بە عەرەبی',
    examples: [
      { arabic: 'ظَهْر', meaning: 'پاشی / نیوەڕۆ', pronunciation: 'ẓuhr' },
      { arabic: 'ظَلَام', meaning: 'تاریکی', pronunciation: 'ẓalām' },
      { arabic: 'ظَرِيف', meaning: 'جوانکار', pronunciation: 'ẓarīf' }
    ]
  },
  {
    id: 18, arabic: 'ع', name: 'عَيْن', kurdishName: 'عەین', transliteration: 'ʿ',
    type: 'qamariyeh',
    forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
    kurdishDescription: 'دەنگی ئازارکاری — لە گەڕووی صوندەوک دادەکرێت',
    examples: [
      { arabic: 'عَيْن', meaning: 'چاو', pronunciation: 'ʿayn' },
      { arabic: 'عِلْم', meaning: 'زانست', pronunciation: 'ʿilm' },
      { arabic: 'عَرَبِيّ', meaning: 'عەرەبی', pronunciation: 'ʿarabiyy' }
    ]
  },
  {
    id: 19, arabic: 'غ', name: 'غَيْن', kurdishName: 'غەین', transliteration: 'gh',
    type: 'qamariyeh',
    forms: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
    kurdishDescription: 'دەنگی «غ» — وەک «غ» بە کوردی',
    examples: [
      { arabic: 'غَابَة', meaning: 'دارستان', pronunciation: 'ghāba' },
      { arabic: 'غُرْفَة', meaning: 'ژوور', pronunciation: 'ghurfa' },
      { arabic: 'غَنِيّ', meaning: 'دەوڵەمەند', pronunciation: 'ghaniyy' }
    ]
  },
  {
    id: 20, arabic: 'ف', name: 'فَاء', kurdishName: 'فا', transliteration: 'f',
    type: 'qamariyeh',
    forms: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
    kurdishDescription: 'دەنگی «ف» — وەک «ف» بە کوردی',
    examples: [
      { arabic: 'فَتَى', meaning: 'کوڕ / جوانمێرد', pronunciation: 'fatā' },
      { arabic: 'فَرَح', meaning: 'شادی', pronunciation: 'faraḥ' },
      { arabic: 'فَهِمَ', meaning: 'تێگەیشت', pronunciation: 'fahima' }
    ]
  },
  {
    id: 21, arabic: 'ق', name: 'قَاف', kurdishName: 'قاف', transliteration: 'q',
    type: 'qamariyeh',
    forms: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
    kurdishDescription: 'دەنگی «ق» ی قووڵ — لەگەلی دوو خاڵی سەرەوە',
    examples: [
      { arabic: 'قَلْب', meaning: 'دڵ', pronunciation: 'qalb' },
      { arabic: 'قَمَر', meaning: 'مانگ', pronunciation: 'qamar' },
      { arabic: 'قُرآن', meaning: 'قورئان', pronunciation: 'qurʾān' }
    ]
  },
  {
    id: 22, arabic: 'ك', name: 'كَاف', kurdishName: 'کاف', transliteration: 'k',
    type: 'qamariyeh',
    forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
    kurdishDescription: 'دەنگی «ک» — وەک «ک» بە کوردی',
    examples: [
      { arabic: 'كِتَاب', meaning: 'کتێب', pronunciation: 'kitāb' },
      { arabic: 'كَلِمَة', meaning: 'وشە', pronunciation: 'kalima' },
      { arabic: 'كَبِير', meaning: 'مەزن', pronunciation: 'kabīr' }
    ]
  },
  {
    id: 23, arabic: 'ل', name: 'لَام', kurdishName: 'لام', transliteration: 'l',
    type: 'shamsieh',
    forms: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
    kurdishDescription: 'دەنگی «ل» — وەک «ل» بە کوردی',
    examples: [
      { arabic: 'لَوْن', meaning: 'رەنگ', pronunciation: 'lawn' },
      { arabic: 'لَيْل', meaning: 'شەو', pronunciation: 'layl' },
      { arabic: 'لُغَة', meaning: 'زمان', pronunciation: 'lugha' }
    ]
  },
  {
    id: 24, arabic: 'م', name: 'مِيم', kurdishName: 'میم', transliteration: 'm',
    type: 'qamariyeh',
    forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
    kurdishDescription: 'دەنگی «م» — وەک «م» بە کوردی',
    examples: [
      { arabic: 'مَاء', meaning: 'ئاو', pronunciation: 'māʾ' },
      { arabic: 'مَدِينَة', meaning: 'شار', pronunciation: 'madīna' },
      { arabic: 'مَدْرَسَة', meaning: 'خوێندنگا', pronunciation: 'madrasa' }
    ]
  },
  {
    id: 25, arabic: 'ن', name: 'نُون', kurdishName: 'نون', transliteration: 'n',
    type: 'shamsieh',
    forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
    kurdishDescription: 'دەنگی «ن» — خاڵێکی سەرەوە هەیە',
    examples: [
      { arabic: 'نَهَر', meaning: 'ڕووبار', pronunciation: 'nahr' },
      { arabic: 'نَوْم', meaning: 'خەو', pronunciation: 'nawm' },
      { arabic: 'نُجُوم', meaning: 'ئەستێرەکان', pronunciation: 'nujūm' }
    ]
  },
  {
    id: 26, arabic: 'ه', name: 'هَاء', kurdishName: 'ها', transliteration: 'h',
    type: 'qamariyeh',
    forms: { isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
    kurdishDescription: 'دەنگی «ه» — وەک «ه» بە کوردی',
    examples: [
      { arabic: 'هَوَاء', meaning: 'هەوا', pronunciation: 'hawāʾ' },
      { arabic: 'هِلَال', meaning: 'مانگی نوێ', pronunciation: 'hilāl' },
      { arabic: 'هَنِيء', meaning: 'گوارا', pronunciation: 'hanīʾ' }
    ]
  },
  {
    id: 27, arabic: 'و', name: 'وَاو', kurdishName: 'واو', transliteration: 'w/ū',
    type: 'long-vowels',
    forms: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
    kurdishDescription: 'دەنگبەزیکی درێژی (وو) — هەروەها دەنگی «و» دەدات',
    examples: [
      { arabic: 'وَلَد', meaning: 'کوڕ', pronunciation: 'walad' },
      { arabic: 'وَرْد', meaning: 'گوڵی سووری', pronunciation: 'ward' },
      { arabic: 'نُور', meaning: 'ڕووناکی', pronunciation: 'nūr' }
    ]
  },
  {
    id: 28, arabic: 'ي', name: 'يَاء', kurdishName: 'یا', transliteration: 'y/ī',
    type: 'long-vowels',
    forms: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
    kurdishDescription: 'دەنگبەزیکی درێژی (یی) — هەروەها دەنگی «ی» دەدات',
    examples: [
      { arabic: 'يَوْم', meaning: 'ڕۆژ', pronunciation: 'yawm' },
      { arabic: 'يَد', meaning: 'دەست', pronunciation: 'yad' },
      { arabic: 'بَيْت', meaning: 'ماڵ', pronunciation: 'bayt' }
    ]
  }
];

// ── Vocabulary ─────────────────────────────────────

export const VOCABULARY: VocabWord[] = [
  // Greetings
  { id: 1,  arabic: 'مَرْحَبًا',      kurdish: 'مەرحەبا / خوشامدێ',  transliteration: 'marḥaban',    category: 'silaw',     exampleSentence: 'مَرْحَبًا يَا صَدِيقِي', exampleTranslation: 'مەرحەبا هاوڕێم' },
  { id: 2,  arabic: 'السَّلَامُ عَلَيْكُمْ', kurdish: 'سڵاوتان لەسەر بێت', transliteration: 'as-salāmu ʿalaykum', category: 'silaw', exampleSentence: 'السَّلَامُ عَلَيْكُمْ جَمِيعًا', exampleTranslation: 'سڵاوتان لەسەر بێت هەموو' },
  { id: 3,  arabic: 'صَبَاحُ الْخَيْر',  kurdish: 'بەیانیت باش',      transliteration: 'ṣabāḥ al-khayr', category: 'silaw', exampleSentence: 'صَبَاحُ الْخَيْرِ يَا أُمِّي', exampleTranslation: 'بەیانیت باش داییکم' },
  { id: 4,  arabic: 'مَسَاءُ الْخَيْر',  kurdish: 'ئێوارەت باش',      transliteration: 'masāʾ al-khayr', category: 'silaw' },
  { id: 5,  arabic: 'شُكْرًا',          kurdish: 'سوپاس / مەمنوون',   transliteration: 'shukran',        category: 'silaw' },
  { id: 6,  arabic: 'مِنْ فَضْلِك',     kurdish: 'تکایە / خواستەکەت', transliteration: 'min faḍlik',     category: 'silaw' },
  { id: 7,  arabic: 'مَعَ السَّلَامَة',  kurdish: 'بە سەلامەتی',      transliteration: 'maʿa s-salāma',  category: 'silaw' },
  { id: 8,  arabic: 'أَهْلاً وَسَهْلاً', kurdish: 'بەخێربێیت',        transliteration: 'ahlan wa-sahlan', category: 'silaw' },
  // Family
  { id: 9,  arabic: 'أَب',             kurdish: 'باوک',               transliteration: 'ab',             category: 'family', exampleSentence: 'أَبِي طَبِيب', exampleTranslation: 'باوکم دکتۆرە' },
  { id: 10, arabic: 'أُمّ',            kurdish: 'دایک',               transliteration: 'umm',            category: 'family' },
  { id: 11, arabic: 'أَخ',             kurdish: 'برا',                transliteration: 'akh',            category: 'family' },
  { id: 12, arabic: 'أُخْت',           kurdish: 'خوشک',               transliteration: 'ukht',           category: 'family' },
  { id: 13, arabic: 'جَدّ',            kurdish: 'باپیر',              transliteration: 'jadd',           category: 'family' },
  { id: 14, arabic: 'جَدَّة',           kurdish: 'دایباپیر',           transliteration: 'jadda',          category: 'family' },
  { id: 15, arabic: 'ابْن',            kurdish: 'کوڕ',                transliteration: 'ibn',             category: 'family' },
  { id: 16, arabic: 'بِنْت',           kurdish: 'کچ',                 transliteration: 'bint',            category: 'family' },
  // Numbers
  { id: 17, arabic: 'وَاحِد',          kurdish: 'یەک',                transliteration: 'wāḥid',          category: 'numbers' },
  { id: 18, arabic: 'اثْنَان',         kurdish: 'دوو',                transliteration: 'ithnān',         category: 'numbers' },
  { id: 19, arabic: 'ثَلَاثَة',         kurdish: 'سێ',                 transliteration: 'thalātha',        category: 'numbers' },
  { id: 20, arabic: 'أَرْبَعَة',        kurdish: 'چوار',               transliteration: 'arbaʿa',          category: 'numbers' },
  { id: 21, arabic: 'خَمْسَة',          kurdish: 'پێنج',               transliteration: 'khamsa',          category: 'numbers' },
  { id: 22, arabic: 'سِتَّة',          kurdish: 'شەش',                transliteration: 'sitta',           category: 'numbers' },
  { id: 23, arabic: 'سَبْعَة',          kurdish: 'حەوت',               transliteration: 'sabʿa',           category: 'numbers' },
  { id: 24, arabic: 'ثَمَانِيَة',        kurdish: 'هەشت',               transliteration: 'thamāniya',       category: 'numbers' },
  { id: 25, arabic: 'تِسْعَة',          kurdish: 'نۆ',                 transliteration: 'tisʿa',           category: 'numbers' },
  { id: 26, arabic: 'عَشَرَة',          kurdish: 'دە',                 transliteration: 'ʿashara',          category: 'numbers' },
  // Colors
  { id: 27, arabic: 'أَحْمَر',          kurdish: 'سوور',               transliteration: 'aḥmar',           category: 'colors' },
  { id: 28, arabic: 'أَزْرَق',          kurdish: 'شین',                transliteration: 'azraq',           category: 'colors' },
  { id: 29, arabic: 'أَخْضَر',          kurdish: 'سەوز',               transliteration: 'akhḍar',          category: 'colors' },
  { id: 30, arabic: 'أَصْفَر',          kurdish: 'زەرد',               transliteration: 'aṣfar',           category: 'colors' },
  { id: 31, arabic: 'أَبْيَض',          kurdish: 'سپی',                transliteration: 'abyaḍ',           category: 'colors' },
  { id: 32, arabic: 'أَسْوَد',          kurdish: 'ڕەش',                transliteration: 'aswad',           category: 'colors' },
  { id: 33, arabic: 'بُرْتُقَالِي',     kurdish: 'پرتەقاڵی',          transliteration: 'burtuqālī',        category: 'colors' },
  { id: 34, arabic: 'بَنَفْسَجِي',      kurdish: 'مۆر',                transliteration: 'banafsajī',        category: 'colors' },
  // Nature
  { id: 35, arabic: 'شَمْس',           kurdish: 'خۆر',                transliteration: 'shams',           category: 'nature' },
  { id: 36, arabic: 'قَمَر',           kurdish: 'مانگ',               transliteration: 'qamar',           category: 'nature' },
  { id: 37, arabic: 'نَجْم',           kurdish: 'ئەستێرە',            transliteration: 'najm',            category: 'nature' },
  { id: 38, arabic: 'بَحْر',           kurdish: 'دەریا',              transliteration: 'baḥr',            category: 'nature' },
  { id: 39, arabic: 'جَبَل',           kurdish: 'چیا',                transliteration: 'jabal',           category: 'nature' },
  { id: 40, arabic: 'نَهَر',           kurdish: 'ڕووبار',             transliteration: 'nahr',            category: 'nature' },
  { id: 41, arabic: 'شَجَرَة',         kurdish: 'دار',                transliteration: 'shajara',         category: 'nature' },
  { id: 42, arabic: 'زَهْرَة',         kurdish: 'گوڵ',                transliteration: 'zahra',           category: 'nature' },
  // Food
  { id: 43, arabic: 'خُبْز',           kurdish: 'نان',                transliteration: 'khubz',           category: 'food' },
  { id: 44, arabic: 'مَاء',            kurdish: 'ئاو',                transliteration: 'māʾ',             category: 'food' },
  { id: 45, arabic: 'لَبَن',           kurdish: 'شیر',                transliteration: 'laban',           category: 'food' },
  { id: 46, arabic: 'عَسَل',           kurdish: 'هەنگوین',            transliteration: 'ʿasal',           category: 'food' },
  { id: 47, arabic: 'تَمْر',           kurdish: 'خورما',              transliteration: 'tamr',            category: 'food' },
  { id: 48, arabic: 'تُفَّاح',         kurdish: 'سێو',                transliteration: 'tuffāḥ',          category: 'food' },
  { id: 49, arabic: 'عِنَب',           kurdish: 'ترێ',                transliteration: 'ʿinab',           category: 'food' },
  { id: 50, arabic: 'أَرُز',           kurdish: 'برنج',               transliteration: 'aruzz',           category: 'food' },
  // School
  { id: 51, arabic: 'كِتَاب',          kurdish: 'کتێب',               transliteration: 'kitāb',           category: 'school', exampleSentence: 'هَذَا كِتَابِي', exampleTranslation: 'ئەمە کتێبمە' },
  { id: 52, arabic: 'قَلَم',           kurdish: 'پێنووس',             transliteration: 'qalam',           category: 'school' },
  { id: 53, arabic: 'مَدْرَسَة',        kurdish: 'خوێندنگا',           transliteration: 'madrasa',         category: 'school' },
  { id: 54, arabic: 'مُعَلِّم',         kurdish: 'مامۆستا',            transliteration: 'muʿallim',        category: 'school' },
  { id: 55, arabic: 'دَرْس',           kurdish: 'وانە',               transliteration: 'dars',            category: 'school' },
  { id: 56, arabic: 'سَبُّورَة',        kurdish: 'تەختە',              transliteration: 'sabbūra',         category: 'school' },
  // Daily life
  { id: 57, arabic: 'بَيْت',           kurdish: 'ماڵ / خانوو',        transliteration: 'bayt',            category: 'daily' },
  { id: 58, arabic: 'شَارِع',          kurdish: 'کۆلان',              transliteration: 'shāriʿ',          category: 'daily' },
  { id: 59, arabic: 'سَيَّارَة',        kurdish: 'ئۆتۆمبێل',          transliteration: 'sayyāra',          category: 'daily' },
  { id: 60, arabic: 'هَاتِف',          kurdish: 'تەلەفۆن',           transliteration: 'hātif',           category: 'daily' },
];

// ── Stories ────────────────────────────────────────

export const STORIES: Story[] = [
  {
    id: 1,
    titleArabic: 'الأَسَدُ وَالْفَأْر',
    titleKurdish: 'شێر و مشک',
    level: 'beginner',
    emoji: '🦁',
    description: 'چیرۆکی شێر و مشکەکە — دەربارەی قەدرزانی و یارمەتیدان',
    moral: 'کەسانی بچووک دەتوانن یارمەتی کەسانی مەزن بدەن',
    wordCount: 180,
    readTime: 5,
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    paragraphs: [
      {
        arabic: 'كَانَ هُنَاكَ أَسَدٌ كَبِيرٌ يَنَامُ فِي الْغَابَةِ.',
        translation: 'شێرێکی مەزن لە دارستانەکە خەو دەکرد.',
        vocab: [{ ar: 'أَسَد', ku: 'شێر' }, { ar: 'غَابَة', ku: 'دارستان' }, { ar: 'يَنَام', ku: 'خەو دەکات' }]
      },
      {
        arabic: 'مَرَّ فَأْرٌ صَغِيرٌ بِجَانِبِهِ وَأَيْقَظَهُ مِنْ نَوْمِهِ.',
        translation: 'مشکێکی بچووک لەلایەکی تێپەڕی و ئەو لە خەوی هەڵستاند.',
        vocab: [{ ar: 'فَأْر', ku: 'مشک' }, { ar: 'صَغِير', ku: 'بچووک' }, { ar: 'أَيْقَظَ', ku: 'هەڵستاند' }]
      },
      {
        arabic: 'غَضِبَ الأَسَدُ وَأَمْسَكَ الْفَأْرَ الصَّغِيرَ بِيَدِهِ الْكَبِيرَةِ.',
        translation: 'شێرەکە تووڕە بوو و مشکی بچووکی بە دەستی مەزنەکەی گرت.',
        vocab: [{ ar: 'غَضِبَ', ku: 'تووڕە بوو' }, { ar: 'أَمْسَكَ', ku: 'گرت' }, { ar: 'يَد', ku: 'دەست' }]
      },
      {
        arabic: 'قَالَ الْفَأْرُ: "أَرْجُوكَ، أَطْلِقْنِي! سَأُسَاعِدُكَ يَوْمًا مَا."',
        translation: 'مشکەکە گوتی: "تکایە ئازادم بکە! ڕۆژێک یارمەتیت دەدەم."',
        vocab: [{ ar: 'أَطْلِقْنِي', ku: 'ئازادم بکە' }, { ar: 'سَأُسَاعِدُك', ku: 'یارمەتیت دەدەم' }, { ar: 'يَوْمًا', ku: 'ڕۆژێک' }]
      },
      {
        arabic: 'ضَحِكَ الأَسَدُ أَمَامَ هَذِهِ الكَلِمَاتِ، لَكِنَّهُ أَطْلَقَهُ.',
        translation: 'شێرەکە بەرانبەر ئەم وشانە پێی کرد، بەڵام ئازادی کرد.',
        vocab: [{ ar: 'ضَحِكَ', ku: 'پێی کرد' }, { ar: 'أَطْلَقَ', ku: 'ئازاد کرد' }, { ar: 'لَكِن', ku: 'بەڵام' }]
      },
      {
        arabic: 'بَعْدَ أَيَّامٍ، سَقَطَ الأَسَدُ فِي شَبَكَةِ الصَّيَّادِ.',
        translation: 'چەند ڕۆژێک دواتر، شێرەکە کەوتە تەڵی ئێگرەکە.',
        vocab: [{ ar: 'سَقَطَ', ku: 'کەوت' }, { ar: 'شَبَكَة', ku: 'تەڵ' }, { ar: 'صَيَّاد', ku: 'ئێگر' }]
      },
      {
        arabic: 'جَاءَ الْفَأْرُ وَقَطَعَ الشَّبَكَةَ بِأَسْنَانِهِ الصَّغِيرَةِ وَأَنْقَذَ الأَسَدَ.',
        translation: 'مشکەکە هات و تەڵەکەی بە دەندانی بچووکەکانی برِی و شێرەکەی ڕزگار کرد.',
        vocab: [{ ar: 'قَطَعَ', ku: 'برِی' }, { ar: 'أَسْنَان', ku: 'دەندانەکان' }, { ar: 'أَنْقَذَ', ku: 'ڕزگار کرد' }]
      }
    ]
  },
  {
    id: 2,
    titleArabic: 'الطِّفْلُ الشَّاطِر',
    titleKurdish: 'منداڵی زیرەک',
    level: 'beginner',
    emoji: '👦',
    description: 'چیرۆکی منداڵێکی زیرەک کە بە تێكۆشان موادەی خوێندنی دەخوێنێتەوە',
    moral: 'تێکۆشان و خوێندن گەنجینەیەکی بەهادارە',
    wordCount: 150,
    readTime: 4,
    color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    paragraphs: [
      {
        arabic: 'يُحِبُّ أَحْمَدُ الذَّهَابَ إِلَى الْمَدْرَسَةِ كُلَّ يَوْمٍ.',
        translation: 'ئەحمەد خۆشی دەوێت هەموو ڕۆژێک بچێتە خوێندنگا.',
        vocab: [{ ar: 'يُحِب', ku: 'خۆشی دەوێت' }, { ar: 'مَدْرَسَة', ku: 'خوێندنگا' }, { ar: 'كُلَّ يَوْم', ku: 'هەموو ڕۆژ' }]
      },
      {
        arabic: 'يَقْرَأُ الْكُتُبَ وَيَكْتُبُ الدُّرُوسَ بِاهْتِمَامٍ كَبِيرٍ.',
        translation: 'کتێبەکان دەخوێنێت و وانەکانی بە گوێدانی زۆر دەنووسێت.',
        vocab: [{ ar: 'يَقْرَأ', ku: 'دەخوێنێت' }, { ar: 'يَكْتُب', ku: 'دەنووسێت' }, { ar: 'اهْتِمَام', ku: 'گوێدان' }]
      },
      {
        arabic: 'قَالَ الْمُعَلِّمُ: "أَحْمَدُ طَالِبٌ مُتَمَيِّزٌ وَمُجْتَهِدٌ."',
        translation: 'مامۆستاکە گوتی: "ئەحمەد قوتابییەکی تایبەت و تێکۆشانکارە."',
        vocab: [{ ar: 'مُعَلِّم', ku: 'مامۆستا' }, { ar: 'طَالِب', ku: 'قوتابی' }, { ar: 'مُجْتَهِد', ku: 'تێکۆشانکار' }]
      },
      {
        arabic: 'فَرِحَ أَحْمَدُ كَثِيرًا وَعَزَمَ عَلَى الاجْتِهَادِ أَكْثَرَ.',
        translation: 'ئەحمەد زۆر شاد بوو و بڕیاری داد بیشتر تێبکۆشێت.',
        vocab: [{ ar: 'فَرِحَ', ku: 'شاد بوو' }, { ar: 'عَزَمَ', ku: 'بڕیاری دا' }, { ar: 'أَكْثَر', ku: 'بیشتر' }]
      }
    ]
  },
  {
    id: 3,
    titleArabic: 'الرَّاعِي وَالذِّئْب',
    titleKurdish: 'شوانەکە و گورگ',
    level: 'intermediate',
    emoji: '🐺',
    description: 'چیرۆکی شوانەکە کە دروستکاری کرد و دواجار گورگ هاتەوە',
    moral: 'دروستکاری هێشتا به پێناویت نابوێت',
    wordCount: 220,
    readTime: 6,
    color: 'linear-gradient(135deg, #10b981, #059669)',
    paragraphs: [
      {
        arabic: 'كَانَ هُنَاكَ رَاعٍ شَابٌّ يَرْعَى الأَغْنَامَ فِي الْجَبَل.',
        translation: 'شوانێکی گەنج لە چیاکەدا مەڕ دەچەرئاند.',
        vocab: [{ ar: 'رَاعٍ', ku: 'شوان' }, { ar: 'أَغْنَام', ku: 'مەڕەکان' }, { ar: 'جَبَل', ku: 'چیا' }]
      },
      {
        arabic: 'كَانَ يَشْعُرُ بِالْمَلَلِ فَبَدَأَ يَصْرُخُ: "الذِّئْبُ! الذِّئْبُ!"',
        translation: 'کەللە دەکرد هەڵدەکرا، دەستی کرد بە قیژکردن: "گورگ! گورگ!"',
        vocab: [{ ar: 'مَلَل', ku: 'کەللەکردن' }, { ar: 'يَصْرُخ', ku: 'قیژدەکات' }, { ar: 'ذِئْب', ku: 'گورگ' }]
      },
      {
        arabic: 'رَكَضَ النَّاسُ مِنَ الْقَرْيَةِ لِمُسَاعَدَتِهِ.',
        translation: 'خەڵکەکان لە گوندەکەوە ڕاکەوتن بۆ یارمەتیی.',
        vocab: [{ ar: 'رَكَضَ', ku: 'ڕاکەوت' }, { ar: 'قَرْيَة', ku: 'گوند' }, { ar: 'مُسَاعَدَة', ku: 'یارمەتی' }]
      },
      {
        arabic: 'لَمْ يَجِدُوا ذِئْبًا، فَعَادُوا غَاضِبِينَ.',
        translation: 'گورگیان نەدیت، تووڕە گەڕانەوە.',
        vocab: [{ ar: 'لَمْ يَجِد', ku: 'نەیدیت' }, { ar: 'عَادَ', ku: 'گەڕایەوە' }, { ar: 'غَاضِب', ku: 'تووڕە' }]
      },
      {
        arabic: 'كَرَّرَ الرَّاعِي هَذِهِ اللُّعْبَةَ مَرَّتَيْنِ.',
        translation: 'شوانەکە ئەم یارییەی دووجار کردەوە.',
        vocab: [{ ar: 'كَرَّرَ', ku: 'کردەوە' }, { ar: 'لُعْبَة', ku: 'یاری' }, { ar: 'مَرَّتَيْن', ku: 'دووجار' }]
      },
      {
        arabic: 'ثُمَّ جَاءَ ذِئْبٌ حَقِيقِيٌّ وَهَاجَمَ الأَغْنَامَ.',
        translation: 'دواتر گورگێکی ڕاستەقینە هات و هێرشی کرد بەسەر مەڕەکان.',
        vocab: [{ ar: 'حَقِيقِي', ku: 'ڕاستەقینە' }, { ar: 'هَاجَمَ', ku: 'هێرشی کرد' }]
      },
      {
        arabic: 'صَرَخَ الرَّاعِي بِكُلِّ قُوَّتِهِ، لَكِنْ لَمْ يَأْتِ أَحَدٌ.',
        translation: 'شوانەکە بە هەموو هێزەکەیەوە قیژی کرد، بەڵام هیچ کەس نەهات.',
        vocab: [{ ar: 'قُوَّة', ku: 'هێز' }, { ar: 'لَكِن', ku: 'بەڵام' }, { ar: 'أَحَد', ku: 'هیچ کەس' }]
      }
    ]
  },
  {
    id: 4,
    titleArabic: 'الْعَصَا وَالأَبْنَاء',
    titleKurdish: 'دار و کوڕەکان',
    level: 'intermediate',
    emoji: '🌿',
    description: 'چیرۆکی باوکێک و کوڕانی — دەربارەی یەکگرتوویی و هێز',
    moral: 'یەکگرتوویی هێزی پتوتر دروست دەکات',
    wordCount: 200,
    readTime: 5,
    color: 'linear-gradient(135deg, #f59e0b, #b45309)',
    paragraphs: [
      {
        arabic: 'كَانَ لِرَجُلٍ عَجُوزٍ ثَلَاثَةُ أَبْنَاءٍ يَتَشَاجَرُونَ دَائِمًا.',
        translation: 'پیاوێکی پیر سێ کوڕی هەبوو کە هەمیشە دیل دەکردن.',
        vocab: [{ ar: 'عَجُوز', ku: 'پیر' }, { ar: 'أَبْنَاء', ku: 'کوڕەکان' }, { ar: 'يَتَشَاجَر', ku: 'دیل دەکات' }]
      },
      {
        arabic: 'فَكَّرَ الرَّجُلُ كَيْفَ يُعَلِّمُهُمْ قِيمَةَ الاتِّحَاد.',
        translation: 'پیاوەکە بیری کرد چۆن فەرزانەیی یەکگرتوویی فێریان بکات.',
        vocab: [{ ar: 'فَكَّرَ', ku: 'بیری کرد' }, { ar: 'قِيمَة', ku: 'فەرزانەیی / بەها' }, { ar: 'اتِّحَاد', ku: 'یەکگرتوویی' }]
      },
      {
        arabic: 'جَمَعَ حُزْمَةً مِنَ الْعِصِيِّ وَطَلَبَ مِنْ كُلِّ ابْنٍ أَنْ يَكْسِرَهَا.',
        translation: 'چەند داری کۆکردەوە و لە هەر کوڕێک داوا کرد بیشکێندێت.',
        vocab: [{ ar: 'حُزْمَة', ku: 'کۆمەڵ' }, { ar: 'عِصِيّ', ku: 'داران' }, { ar: 'يَكْسِر', ku: 'دەشکێنێت' }]
      },
      {
        arabic: 'لَمْ يَسْتَطِعْ أَيٌّ مِنْهُمْ كَسْرَهَا.',
        translation: 'هیچ کوڕێک نەی توانی بیشکێنێت.',
        vocab: [{ ar: 'لَمْ يَسْتَطِع', ku: 'نەی توانی' }, { ar: 'أَيّ', ku: 'هیچ کام' }]
      },
      {
        arabic: 'ثُمَّ فَرَّقَهَا وَطَلَبَ مِنْهُمْ كَسْرَ كُلِّ عَصَا عَلَى حِدَة.',
        translation: 'دواتر تەک تەکیان کردەوە و داوا کرد هەر داری تاکی بشکێنن.',
        vocab: [{ ar: 'فَرَّقَ', ku: 'تەک تەک کرد' }, { ar: 'عَلَى حِدَة', ku: 'جیاجیا / تاکانە' }]
      },
      {
        arabic: 'كَسَرُوهَا بِسُهُولَةٍ. فَقَالَ: "أَنْتُمْ مِثْلَ هَذِهِ الْعِصِيِّ."',
        translation: 'بە ئاسانی شکاندیان. ئەوانیش گوتی: "ئێوە وەک ئەم داراناین."',
        vocab: [{ ar: 'سُهُولَة', ku: 'ئاسانی' }, { ar: 'مِثْل', ku: 'وەک / وەها' }]
      }
    ]
  },
  {
    id: 5,
    titleArabic: 'النَّمْلَةُ وَالْجُنْدُب',
    titleKurdish: 'مورچە و مرچەلۆکە',
    level: 'beginner',
    emoji: '🐜',
    description: 'چیرۆکی کلاسیکی مورچەو مرچەلۆکە — تێکۆشان و هووشیاری',
    moral: 'ئیشکردن لە کاتی باشدا بۆ گشتی ئازمێشتە',
    wordCount: 160,
    readTime: 4,
    color: 'linear-gradient(135deg, #ef4444, #dc2626)',
    paragraphs: [
      {
        arabic: 'فِي الصَّيْفِ، كَانَتِ النَّمْلَةُ تَعْمَلُ طَوَالَ الْيَوْمِ.',
        translation: 'لە هاوینەدا، مورچەکە تەواوی ڕۆژ کاردەکرد.',
        vocab: [{ ar: 'صَيْف', ku: 'هاوین' }, { ar: 'نَمْلَة', ku: 'مورچە' }, { ar: 'طَوَال', ku: 'تەواوی' }]
      },
      {
        arabic: 'كَانَتْ تَجْمَعُ الطَّعَامَ وَتَخْزِنُهُ لِفَصْلِ الشِّتَاءِ.',
        translation: 'خواردن کۆدەکردەوى و بۆ زستان ذەخیرەی دەکرد.',
        vocab: [{ ar: 'تَجْمَع', ku: 'کۆدەکات' }, { ar: 'تَخْزِن', ku: 'ذەخیرە دەکات' }, { ar: 'شِتَاء', ku: 'زستان' }]
      },
      {
        arabic: 'أَمَّا الْجُنْدُبُ فَكَانَ يُغَنِّي وَيَلْعَبُ طُولَ الْيَوْمِ.',
        translation: 'بەڵام مرچەلۆکەکە تەواوی ڕۆژ گۆرانی دەوت و یاری دەکرد.',
        vocab: [{ ar: 'جُنْدُب', ku: 'مرچەلۆکە' }, { ar: 'يُغَنِّي', ku: 'گۆرانی دەوت' }, { ar: 'يَلْعَب', ku: 'یاری دەکات' }]
      },
      {
        arabic: 'حَلَّ الشِّتَاءُ وَلَمْ يَجِدِ الْجُنْدُبُ مَا يَأْكُلُهُ.',
        translation: 'زستان هاتەوە و مرچەلۆکەکە خواردنی نەدیت.',
        vocab: [{ ar: 'حَلَّ', ku: 'هاتەوە' }, { ar: 'يَأْكُل', ku: 'دەخوات' }]
      },
      {
        arabic: 'ذَهَبَ إِلَى النَّمْلَةِ يَطْلُبُ طَعَامًا.',
        translation: 'چوو بۆ لای مورچەکە خواردن داوا بکات.',
        vocab: [{ ar: 'ذَهَبَ', ku: 'چوو' }, { ar: 'يَطْلُب', ku: 'داوا دەکات' }]
      },
      {
        arabic: 'قَالَتِ النَّمْلَةُ: "لَقَدْ غَنَّيْتَ صَيْفًا كَامِلاً، فَارْقُصِ الآنَ!"',
        translation: 'مورچەکە گوتی: "هاوینی تەواو گۆرانی تت وتووە، ئێستا برەقسێ!"',
        vocab: [{ ar: 'غَنَّيْت', ku: 'گۆرانیت وت' }, { ar: 'ارْقُص', ku: 'برەقسێ' }, { ar: 'الآن', ku: 'ئێستا' }]
      }
    ]
  },
  {
    id: 6,
    titleArabic: 'الثَّعْلَبُ وَالْغُرَاب',
    titleKurdish: 'ڕووباهەکە و قیژبازەکە',
    level: 'intermediate',
    emoji: '🦊',
    description: 'چیرۆکی ناسراوی ئیسۆپ — دەربارەی خوشامەندی و بەزەی',
    moral: 'خوشامەند مەبی چونکە ئەوەی پێیت دەوترێت ڕاست نییە',
    wordCount: 190,
    readTime: 5,
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    paragraphs: [
      {
        arabic: 'كَانَ غُرَابٌ يَجْلِسُ عَلَى غُصْنِ شَجَرَةٍ وَفِي مِنْقَارِهِ قِطْعَةُ جُبْنٍ.',
        translation: 'قیژبازەکە نشتبوو لەسەر لقی داری، لە کوێرەکەیدا پارچەیەکی پەنیر هەبوو.',
        vocab: [{ ar: 'غُرَاب', ku: 'قیژباز' }, { ar: 'مِنْقَار', ku: 'کوێرە' }, { ar: 'جُبْن', ku: 'پەنیر' }]
      },
      {
        arabic: 'جَاءَ ثَعْلَبٌ مَاكِرٌ وَرَأَى الْجُبْنَ، فَطَمِعَ فِيهِ.',
        translation: 'ڕووباهێکی مەکر هات و پەنیرەکەی بیند، تامی لێ هات.',
        vocab: [{ ar: 'ثَعْلَب', ku: 'ڕووبا' }, { ar: 'مَاكِر', ku: 'مەکر' }, { ar: 'طَمِعَ', ku: 'تامی لێ هات' }]
      },
      {
        arabic: 'قَالَ الثَّعْلَبُ: "يَا غُرَابُ، مَا أَجْمَلَكَ وَمَا أَرْوَعَ رِيشَكَ!"',
        translation: 'ڕووباهەکە گوتی: "ئەی قیژباز، چەند جوانی و چەند بەرز پەڕووتەکانت!"',
        vocab: [{ ar: 'أَجْمَل', ku: 'چەند جوان' }, { ar: 'رِيش', ku: 'پەڕووت' }]
      },
      {
        arabic: '"أَظُنُّ أَنَّ صَوْتَكَ رَائِعٌ أَيْضًا. هَلْ يُمْكِنُكَ أَنْ تُغَنِّيَ لِي؟"',
        translation: '"دەزانم دەنگتیش بەرزە. دەتوانیت بۆم گۆرانی بوێژیت؟"',
        vocab: [{ ar: 'صَوْت', ku: 'دەنگ' }, { ar: 'رَائِع', ku: 'بەرز / سەرسوڕهێنەر' }, { ar: 'يُغَنِّي', ku: 'گۆرانی دەوێژێت' }]
      },
      {
        arabic: 'فَتَحَ الْغُرَابُ مِنْقَارَهُ لِيُغَنِّيَ، فَسَقَطَتِ الْجُبْنَةُ.',
        translation: 'قیژبازەکە کوێرەکەی کردەوە بۆ گۆرانی وتن، پەنیرەکە کەوت.',
        vocab: [{ ar: 'فَتَحَ', ku: 'کردەوە' }, { ar: 'سَقَطَ', ku: 'کەوت' }]
      },
      {
        arabic: 'أَخَذَ الثَّعْلَبُ الْجُبْنَةَ وَقَالَ: "دَرْسٌ مَجَّانِيٌّ: احْذَرِ الْمَادِحِينَ!"',
        translation: 'ڕووباهەکە پەنیرەکەی لێگرت و گوتی: "وانەیەکی بەخشین: ئاگابە لە خوشامەندان!"',
        vocab: [{ ar: 'مَجَّانِي', ku: 'بەخشین / بەبێ بەها' }, { ar: 'احْذَر', ku: 'ئاگابە' }, { ar: 'مَادِح', ku: 'خوشامەند' }]
      }
    ]
  },
  {
    id: 7,
    titleArabic: 'الأَمِيرَةُ الصَّامِتَة',
    titleKurdish: 'شازادەی بێدەنگ',
    level: 'advanced',
    emoji: '👑',
    description: 'چیرۆکی شازادەیەکی ئیلهامبخش کە بە دڵی پاک فێری قووڵترین ئەندیشە دەبێت',
    moral: 'بێدەنگی کاتجار قووڵترین وتەکانەوە بەرپرسیارە',
    wordCount: 280,
    readTime: 7,
    color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    paragraphs: [
      {
        arabic: 'فِي مَمْلَكَةٍ بَعِيدَةٍ، كَانَتْ هُنَاكَ أَمِيرَةٌ جَمِيلَةٌ لَا تَتَكَلَّمُ أَبَدًا.',
        translation: 'لە پاشایەتییەکی دووری، شازادەیەکی جوان هەبوو کە هیچ قسەی نەدەکرد.',
        vocab: [{ ar: 'مَمْلَكَة', ku: 'پاشایەتی' }, { ar: 'أَمِيرَة', ku: 'شازادە (مێ)' }, { ar: 'لَا تَتَكَلَّم', ku: 'قسە نادات' }]
      },
      {
        arabic: 'كَانَتْ تُعَبِّرُ عَنْ مَشَاعِرِهَا بِالرَّسْمِ وَالشِّعْرِ الْمَكْتُوبِ.',
        translation: 'هەستوهزرەکانی بە وێنەکێشان و شیعری نووسراو نیشاندەدا.',
        vocab: [{ ar: 'تُعَبِّر', ku: 'نیشاندەدات' }, { ar: 'مَشَاعِر', ku: 'هەستوهزر' }, { ar: 'شِعْر', ku: 'شیعر' }]
      },
      {
        arabic: 'يَوْمًا مَا، غَزَا عَدُوٌّ قَوِيٌّ مَمْلَكَتَهَا.',
        translation: 'ڕۆژێک دوژمنێکی بەهێز هێرشی کردە سەر پاشایەتیەکەی.',
        vocab: [{ ar: 'غَزَا', ku: 'هێرشی کرد' }, { ar: 'عَدُوّ', ku: 'دوژمن' }, { ar: 'قَوِيّ', ku: 'بەهێز' }]
      },
      {
        arabic: 'وَقَفَ الْجَمِيعُ عَاجِزًا حَتَّى تَقَدَّمَتِ الأَمِيرَةُ.',
        translation: 'هەموان ئەڕووی ئاتومان ماندووبوون تا شازادەکە پێشخت.',
        vocab: [{ ar: 'عَاجِز', ku: 'ئاتومان' }, { ar: 'تَقَدَّمَ', ku: 'پێشخت' }]
      },
      {
        arabic: 'كَتَبَتْ رِسَالَةً إِلَى الْعَدُوِّ تَدْعُوهُ إِلَى السَّلَامِ.',
        translation: 'نامەیەکی بۆ دوژمنەکە نووسی و داواکاری ئاشتیی کرد.',
        vocab: [{ ar: 'رِسَالَة', ku: 'نامە' }, { ar: 'تَدْعُو', ku: 'داواکاری دەکات' }, { ar: 'سَلَام', ku: 'ئاشتی' }]
      },
      {
        arabic: 'تَأَثَّرَ الْعَدُوُّ بِكَلِمَاتِهَا الْحَكِيمَةِ وَوَافَقَ عَلَى السَّلَامِ.',
        translation: 'دوژمنەکە کارگێڕ بوو بە وشەکانی حکیمانەی و ڕازی بوو بۆ ئاشتی.',
        vocab: [{ ar: 'تَأَثَّرَ', ku: 'کارگێڕ بوو' }, { ar: 'حَكِيم', ku: 'حکیم / زیرەک' }, { ar: 'وَافَقَ', ku: 'ڕازی بوو' }]
      },
      {
        arabic: 'عَلِمَ النَّاسُ أَنَّ الصَّمْتَ الْحَكِيمَ أَقْوَى مِنَ الصَّخَبِ الأَجْوَفِ.',
        translation: 'خەڵکەکان زانیان کە بێدەنگی حکیمانە قووڵتر لە دەنگوبانگی وورووپووڕەیە.',
        vocab: [{ ar: 'صَمْت', ku: 'بێدەنگی' }, { ar: 'أَقْوَى', ku: 'قووڵتر' }, { ar: 'صَخَب', ku: 'دەنگوبانگ' }]
      }
    ]
  },
  {
    id: 8,
    titleArabic: 'الْحِكْمَةُ وَالذَّهَب',
    titleKurdish: 'دانایی و زێڕ',
    level: 'advanced',
    emoji: '⚖️',
    description: 'چیرۆکی پیرمەردێک کە دیاریی بەهادارتر لە زێڕ دەبەخشێت',
    moral: 'دانایی بەهایەکی بەرزتری لە هەر دەوڵەمەندییەکی دروستی هەیە',
    wordCount: 260,
    readTime: 7,
    color: 'linear-gradient(135deg, #d97706, #92400e)',
    paragraphs: [
      {
        arabic: 'عَاشَ حَكِيمٌ عَجُوزٌ فِي قَرْيَةٍ صَغِيرَةٍ وَكَانَ النَّاسُ يَقْصِدُونَهُ لِطَلَبِ النَّصِيحَة.',
        translation: 'دانایێکی پیر لە گوندێکی بچووکدا ژیاو گەل بۆ پێشکەشکردنی ئامۆژگاری دەیانگەیاند.',
        vocab: [{ ar: 'حَكِيم', ku: 'دانا' }, { ar: 'نَصِيحَة', ku: 'ئامۆژگاری' }, { ar: 'يَقْصِد', ku: 'دەیگاتەوە' }]
      },
      {
        arabic: 'جَاءَهُ رَجُلٌ ثَرِيٌّ وَقَالَ: "عِنْدِي ذَهَبٌ كَثِيرٌ لَكِنِّي لَا أَشْعُرُ بِالسَّعَادَةِ."',
        translation: 'پیاوێکی دەوڵەمەند هاتەوییو گوتی: "زێڕی زۆرم هەیە بەڵام ئازاد حەز ناکەم."',
        vocab: [{ ar: 'ثَرِيّ', ku: 'دەوڵەمەند' }, { ar: 'ذَهَب', ku: 'زێڕ' }, { ar: 'سَعَادَة', ku: 'خۆشحاڵی' }]
      },
      {
        arabic: 'قَالَ الْحَكِيمُ: "أَرِنِي ذَهَبَكَ وَسَأُرِيكَ مَا هُوَ أَثَمَنُ مِنْه."',
        translation: 'دانایەکە گوتی: "زێڕەکەت بۆم نیشانبدە و من پێت نیشاندەم کەی گرانبەهاتر لێیە."',
        vocab: [{ ar: 'أَثَمَن', ku: 'گرانبەهاتر' }, { ar: 'أَرِنِي', ku: 'بۆم نیشانبدە' }]
      },
      {
        arabic: 'فَتَحَ الرَّجُلُ حَقِيبَتَهُ وَأَخْرَجَ كِيسًا مَلْيئًا بِالذَّهَب.',
        translation: 'پیاوەکە چەنتەکەی کردەوە و کیسێکی پڕ لە زێڕی دەرکرد.',
        vocab: [{ ar: 'حَقِيبَة', ku: 'چەنتە' }, { ar: 'كِيس', ku: 'کیس' }, { ar: 'مَلْيء', ku: 'پڕ' }]
      },
      {
        arabic: 'نَظَرَ الْحَكِيمُ وَقَالَ: "هَذَا يَشْتَرِي الطَّعَامَ لَكِنَّهُ لَا يَشْتَرِي الصَّدِيقَ الْوَفِيّ."',
        translation: 'دانایەکە تەماشای کرد و گوتی: "ئەوە خواردن دەکڕیت بەڵام هاوڕێی دڵسۆز نادەکڕیت."',
        vocab: [{ ar: 'يَشْتَرِي', ku: 'دەکڕيت' }, { ar: 'صَدِيق وَفِيّ', ku: 'هاوڕێی دڵسۆز' }]
      },
      {
        arabic: '"يَشْتَرِي الدَّوَاءَ لَكِنَّهُ لَا يَشْتَرِي الصِّحَّةَ وَالْعُمْرَ."',
        translation: '"دەرمانی دەکڕيت بەڵام تەندروستی و ئومر نادەکڕيت."',
        vocab: [{ ar: 'دَوَاء', ku: 'دەرمان' }, { ar: 'صِحَّة', ku: 'تەندروستی' }, { ar: 'عُمْر', ku: 'ئومر' }]
      },
      {
        arabic: 'أَدْرَكَ الرَّجُلُ أَنَّ الْحِكْمَةَ وَالْمَحَبَّةَ هُمَا الْكَنْزُ الْحَقِيقِيّ.',
        translation: 'پیاوەکە تێگەیشت کە دانایی و خۆشەویستی گەنجینەی ڕاستیرتن.',
        vocab: [{ ar: 'أَدْرَكَ', ku: 'تێگەیشت' }, { ar: 'مَحَبَّة', ku: 'خۆشەویستی' }, { ar: 'كَنْز', ku: 'گەنجینە' }]
      }
    ]
  }
];

// ── Quiz Questions ─────────────────────────────────

export const QUIZ_CATEGORIES = [
  {
    id: 'letters',
    title: 'پیتەکانی عەرەبی',
    description: 'ناوی پیتەکان و شێوەکانیان بناسە',
    icon: '🔤',
    count: 10
  },
  {
    id: 'vocab',
    title: 'وشەکان',
    description: 'مانای وشەکانی رۆژانە',
    icon: '📖',
    count: 15
  },
  {
    id: 'story',
    title: 'تێگەیشتن لە چیرۆک',
    description: 'پرسیاری لە چیرۆکەکان',
    icon: '📚',
    count: 10
  },
  {
    id: 'mixed',
    title: 'تێکەڵ',
    description: 'هەموو جۆرەکانەوە',
    icon: '🎯',
    count: 20
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Letter questions
  {
    id: 1, type: 'letter-to-name', category: 'letters',
    question: 'ناوی ئەم پیتەی عەرەبی چییە؟', arabicText: 'ب',
    correctAnswer: 'بَاء', options: ['أَلِف', 'بَاء', 'تَاء', 'جِيم'],
    explanation: 'پیتی «ب» ناوی «بَاء» هەیە و دەنگی \"B\" دەدات — وەک «ب» بە کوردی'
  },
  {
    id: 2, type: 'letter-to-name', category: 'letters',
    question: 'ئەم پیتە چی دەوترێت؟', arabicText: 'ش',
    correctAnswer: 'شِين', options: ['سِين', 'شِين', 'صَاد', 'ضَاد'],
    explanation: '«ش» ناوی «شِين» هەیە — هەمان دەنگی «ش» بە کوردی دەدات'
  },
  {
    id: 3, type: 'letter-to-name', category: 'letters',
    question: 'ناوی ئەم پیتەی عەرەبی چییە؟', arabicText: 'ع',
    correctAnswer: 'عَيْن', options: ['غَيْن', 'عَيْن', 'حَاء', 'هَاء'],
    explanation: '«ع» ناوی «عَيْن» هەیە — دەنگێکی تایبەتە کە لە کوردیدا نییە'
  },
  {
    id: 4, type: 'name-to-letter', category: 'letters',
    question: 'کام پیتە ناوی «قَاف» هەیە؟', arabicText: '',
    correctAnswer: 'ق', options: ['ك', 'غ', 'ق', 'ف'],
    explanation: '«ق» ناوی «قَاف» هەیە — دەنگی «ق» ی قووڵ دەدات'
  },
  {
    id: 5, type: 'name-to-letter', category: 'letters',
    question: 'پیتی «لَام» کامە؟', arabicText: '',
    correctAnswer: 'ل', options: ['ن', 'ل', 'ر', 'م'],
    explanation: '«ل» ناوی «لَام» هەیە — وەک «ل» بە کوردی'
  },
  {
    id: 6, type: 'name-to-letter', category: 'letters',
    question: 'کام پیتەی عەرەبی دەنگی «S» ی قووڵ دەدات؟', arabicText: '',
    correctAnswer: 'ص', options: ['س', 'ش', 'ص', 'ث'],
    explanation: '«ص» دەنگی «س» ی قووڵدەدات — ناوی «صَاد» ی هەیە'
  },
  {
    id: 7, type: 'letter-to-name', category: 'letters',
    question: 'ناوی ئەم پیتەی عەرەبی چییە؟', arabicText: 'خ',
    correctAnswer: 'خَاء', options: ['حَاء', 'خَاء', 'هَاء', 'غَيْن'],
    explanation: '«خ» ناوی «خَاء» هەیە — هەمان دەنگی «خ» بە کوردی دەدات'
  },
  {
    id: 8, type: 'letter-to-name', category: 'letters',
    question: 'ئەم پیتە چی دەوترێت؟', arabicText: 'م',
    correctAnswer: 'مِيم', options: ['نُون', 'مِيم', 'وَاو', 'يَاء'],
    explanation: '«م» ناوی «مِيم» هەیە — وەک «م» بە کوردی'
  },
  {
    id: 9, type: 'name-to-letter', category: 'letters',
    question: 'کام پیتە «دَال» دەوترێت؟', arabicText: '',
    correctAnswer: 'د', options: ['ذ', 'د', 'ر', 'ز'],
    explanation: '«د» ناوی «دَال» هەیە — ناویکردنی بکە لەگەڵ «ذ» کە «ذَال» دەوترێت'
  },
  {
    id: 10, type: 'letter-to-name', category: 'letters',
    question: 'ناوی ئەم پیتەی عەرەبی چییە؟', arabicText: 'ر',
    correctAnswer: 'رَاء', options: ['رَاء', 'زَاي', 'وَاو', 'نُون'],
    explanation: '«ر» ناوی «رَاء» هەیە — وەک «ر» بە کوردی'
  },
  // Vocabulary questions
  {
    id: 11, type: 'word-meaning', category: 'vocab',
    question: 'مانای ئەم وشەیە چییە؟', arabicText: 'كِتَاب',
    correctAnswer: 'کتێب', options: ['قەڵەم', 'کتێب', 'خوێندنگا', 'وانە'],
    explanation: 'كِتَاب = کتێب — لە عەرەبی بۆ «کتاب» یان «بووک» ئیشتیخانەمان لێ کرد'
  },
  {
    id: 12, type: 'word-meaning', category: 'vocab',
    question: 'ئەم وشەی عەرەبی مانایی چییە؟', arabicText: 'شَمْس',
    correctAnswer: 'خۆر', options: ['مانگ', 'خۆر', 'ئەستێرە', 'ئاسمان'],
    explanation: 'شَمْس = خۆر — یەکێک لە وشە ناسراوەکانی عەرەبی'
  },
  {
    id: 13, type: 'word-meaning', category: 'vocab',
    question: 'مانای «بَيْت» چییە؟', arabicText: 'بَيْت',
    correctAnswer: 'ماڵ', options: ['ماڵ', 'کۆلان', 'دەرگا', 'کانسی'],
    explanation: 'بَيْت = ماڵ یان خانوو'
  },
  {
    id: 14, type: 'word-meaning', category: 'vocab',
    question: 'ئەم وشەیە مانایی چییە؟', arabicText: 'قَلَم',
    correctAnswer: 'پێنووس', options: ['کتێب', 'تەختە', 'پێنووس', 'کاغەز'],
    explanation: 'قَلَم = پێنووس — ئەم وشەیە بە کوردی هەروا دەوترێت «قەڵەم»'
  },
  {
    id: 15, type: 'word-meaning', category: 'vocab',
    question: 'مانای «أُمّ» چییە؟', arabicText: 'أُمّ',
    correctAnswer: 'دایک', options: ['باوک', 'برا', 'کچ', 'دایک'],
    explanation: 'أُمّ = دایک — وشەیەکی خۆشی دڵگیرکەر'
  },
  {
    id: 16, type: 'word-meaning', category: 'vocab',
    question: 'ئەم وشەی عەرەبی مانایی چییە؟', arabicText: 'ماء',
    correctAnswer: 'ئاو', options: ['ئاو', 'نان', 'شیر', 'پیاو'],
    explanation: 'مَاء = ئاو — تی هێمای مەددەی هاتووە.'
  },
  {
    id: 17, type: 'word-meaning', category: 'vocab',
    question: 'مانای «أَحْمَر» چییە؟', arabicText: 'أَحْمَر',
    correctAnswer: 'سوور', options: ['شین', 'سەوز', 'سوور', 'زەرد'],
    explanation: 'أَحْمَر = سوور — رەنگی سووری ئەرابی'
  },
  {
    id: 18, type: 'word-meaning', category: 'vocab',
    question: 'ئەم وشەیە مانایی چییە؟', arabicText: 'صَدِيق',
    correctAnswer: 'هاوڕێ', options: ['هاوڕێ', 'دوژمن', 'مامۆستا', 'منداڵ'],
    explanation: 'صَدِيق = هاوڕێ'
  },
  {
    id: 19, type: 'word-meaning', category: 'vocab',
    question: 'مانای «خُبْز» چییە؟', arabicText: 'خُبْز',
    correctAnswer: 'نان', options: ['ئاو', 'نان', 'گۆشت', 'میوە'],
    explanation: 'خُبْز = نان'
  },
  {
    id: 20, type: 'word-meaning', category: 'vocab',
    question: 'ئەم وشەیە مانایی چییە؟', arabicText: 'شُكْرًا',
    correctAnswer: 'سوپاس', options: ['سوپاس', 'بەخێربێیت', 'بەیانیت باش', 'تکایە'],
    explanation: 'شُكْرًا = سوپاس / مەمنوون — زۆر بەکاردەهێنرێت بە عەرەبی'
  },
  // Story comprehension
  {
    id: 21, type: 'story-q', category: 'story',
    question: 'لە چیرۆکی «شێر و مشک»، بۆچی شێرەکە مشکی ئازاد کرد؟',
    arabicText: '',
    correctAnswer: 'چونکە مشکەکە پاڵنی دا کە ڕۆژێک یارمەتیدەی',
    options: [
      'چونکە ترسا لێیەوە',
      'چونکە مشکەکە پاڵنی دا کە ڕۆژێک یارمەتیدەی',
      'چونکە زۆر بچووک بوو',
      'چونکە شێرەکە گرسی بوو'
    ],
    explanation: 'مشکەکە گوتی «ڕۆژێک یارمەتیت دەدەم» و شێرەکە پێی خەندی بەڵام ئازادی کرد'
  },
  {
    id: 22, type: 'story-q', category: 'story',
    question: 'لە چیرۆکی «مورچە و مرچەلۆکە»، بۆچی مرچەلۆکەکە زستانەکەیدا بێ خواردن ماوە؟',
    arabicText: '',
    correctAnswer: 'چونکە لە کاتی هاوینی یاری و گۆرانی کردووە نەی ذەخیرەکرد',
    options: [
      'چونکە نەیتوانی ذەخیرە بکات',
      'چونکە ماڵیی نەبوو',
      'چونکە لە کاتی هاوینی یاری و گۆرانی کردووە نەی ذەخیرەکرد',
      'چونکە مورچەکە هەموو خواردنەکەی بردووە'
    ],
    explanation: 'مرچەلۆکەکە لە هاوین تەواوی کاتی لە یاری و گۆرانی تێپەڕاند بێیانکو ذەخیرەی بۆ زستان بکات'
  },
  {
    id: 23, type: 'story-q', category: 'story',
    question: 'لە چیرۆکی «شوانەکە و گورگ»، مەبەستی چیرۆکەکە چییە؟',
    arabicText: '',
    correctAnswer: 'دروستکاری هێشتا بەپێناویت نابوێت',
    options: [
      'گورگ فڕووقانی بکە',
      'دروستکاری هێشتا بەپێناویت نابوێت',
      'کومەڵای گوندی خراپن',
      'شوانکاری کاری ئاسانە'
    ],
    explanation: 'شوانەکە دروستکاری کرد و گەل باوەڕیان پێ نەکرد، ئەگەرچی گورگی ڕاستی هات'
  },
  {
    id: 24, type: 'story-q', category: 'story',
    question: 'لە چیرۆکی «داران و کوڕەکان»، سازکاریی باوکەکە یازگار چوون بوو؟',
    arabicText: '',
    correctAnswer: 'داران کۆکردن و داوا کردن هەر کوڕێک بیشکێنن، دواتر تەک تەک',
    options: [
      'زێڕی پێدان',
      'داران کۆکردن و داوا کردن هەر کوڕێک بیشکێنن، دواتر تەک تەک',
      'کوتان بەسەریان',
      'ئازاریان دا'
    ],
    explanation: 'باوکەکە کۆمەڵی داری نەشکرا نیشاندا، دواتر تەک تەکی داری ئاسان دەشکاندرا'
  },
  {
    id: 25, type: 'story-q', category: 'story',
    question: 'لە چیرۆکی «ڕووباهەکە و قیژبازەکە»، چۆن ڕووباهەکە پەنیرەکەی وەرگرت؟',
    arabicText: '',
    correctAnswer: 'قیژبازەکەی خوشامەند کرد تا گۆرانی بوێژێت و پەنیرەکە کەوت',
    options: [
      'بە هێز ژێریی کرد',
      'خواستی',
      'قیژبازەکەی خوشامەند کرد تا گۆرانی بوێژێت و پەنیرەکە کەوت',
      'دارێکیی دا'
    ],
    explanation: 'ڕووباهەکە گوتی چەند دەنگی جوانە تا قیژبازەکە کوێرەکەی کردەوە بۆ گۆرانی وتن'
  },
  // Mixed additional questions
  {
    id: 26, type: 'word-meaning', category: 'mixed',
    question: 'مانای «مَدِينَة» چییە؟', arabicText: 'مَدِينَة',
    correctAnswer: 'شار', options: ['گوند', 'شار', 'کۆلان', 'ماڵ'],
    explanation: 'مَدِينَة = شار — وشەیەکی بەکارهاتووی عەرەبی'
  },
  {
    id: 27, type: 'word-meaning', category: 'mixed',
    question: 'ئەم وشەیە مانایی چییە؟', arabicText: 'قَلْب',
    correctAnswer: 'دڵ', options: ['سەر', 'دڵ', 'دەست', 'چاو'],
    explanation: 'قَلْب = دڵ — جسمانی و مەعنەوی دوویان دەخولێنرێ'
  },
  {
    id: 28, type: 'word-meaning', category: 'mixed',
    question: 'مانای «جَبَل» چییە؟', arabicText: 'جَبَل',
    correctAnswer: 'چیا', options: ['ڕووبار', 'دەریا', 'چیا', 'دارستان'],
    explanation: 'جَبَل = چیا'
  },
  {
    id: 29, type: 'word-meaning', category: 'mixed',
    question: 'ئەم وشەیە مانایی چییە؟', arabicText: 'عِلْم',
    correctAnswer: 'زانست', options: ['کتێب', 'زانست', 'مامۆستا', 'خوێندن'],
    explanation: 'عِلْم = زانست / زانین'
  },
  {
    id: 30, type: 'word-meaning', category: 'mixed',
    question: 'مانای «لَيْل» چییە؟', arabicText: 'لَيْل',
    correctAnswer: 'شەو', options: ['ڕۆژ', 'شەو', 'بەیانی', 'نیوەڕۆ'],
    explanation: 'لَيْل = شەو — لێکدانەوەی عەرەبیی بۆ کات'
  }
];

// ─── Vocabulary Category Labels ──────────────────

export const VOCAB_CATEGORIES: Record<string, { label: string; icon: string }> = {
  all:     { label: 'هەموو',     icon: '🌐' },
  silaw:   { label: 'ملوانپێی', icon: '👋' },
  family:  { label: 'خێزان',    icon: '👨‍👩‍👧' },
  numbers: { label: 'ژمارەکان', icon: '🔢' },
  colors:  { label: 'رەنگەکان', icon: '🎨' },
  nature:  { label: 'سروشت',    icon: '🌿' },
  food:    { label: 'خواردن',   icon: '🍎' },
  school:  { label: 'خوێندن',  icon: '📚' },
  daily:   { label: 'ژیانی ڕۆژانە', icon: '🏠' }
};
