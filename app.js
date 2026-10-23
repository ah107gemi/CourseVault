/**
 * CourseVault — Executive Dark-Tech Productivity Workstation & Mobile PWA
 * Application Logic, Multi-Workspace Engine, Lecture Tracker & Storage Store
 */

// ==========================================================================
// 1. Initial State & Storage Keys
// ==========================================================================

const STORAGE_KEY_COURSES = 'coursevault_courses_v1';
const STORAGE_KEY_CATEGORIES = 'coursevault_categories_v1';
const STORAGE_KEY_TOOLS = 'coursevault_tools_v1';
const STORAGE_KEY_SECTIONS = 'coursevault_sections_v2';
const STORAGE_KEY_VIEW_MODE = 'coursevault_view_mode_v2';

const DEFAULT_SECTIONS = [
  {
    id: 'courses',
    title: 'Courses & Masterclasses',
    shortName: 'Courses',
    icon: 'video',
    description: 'Curated technical courses, tutorials, and masterclasses.',
    isDefault: true
  },
  {
    id: 'tools',
    title: 'Tools & Utilities',
    shortName: 'Tools',
    icon: 'tools',
    description: 'Online utilities, developer tools, and productivity bookmarks.',
    isDefault: true
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'cat-general', name: 'General', color: '#D4AF37' },
  { id: 'cat-python', name: 'Python', color: '#10b981' },
  { id: 'cat-webdev', name: 'Web Dev', color: '#38bdf8' },
  { id: 'cat-ai', name: 'AI & Data', color: '#ec4899' },
  { id: 'cat-design', name: 'Design', color: '#f59e0b' }
];

const SAMPLE_COURSES = [
  {
    id: 'sample-course-1',
    sectionId: 'courses',
    title: 'Free CCNA 200-301 Complete Course - Day 1 to Day 60',
    url: 'https://www.youtube.com/playlist?list=PLxbwE86Cz83-cgvEt-p_0dJ8c_4jXgXmZ',
    normalizedUrl: 'https://www.youtube.com/playlist?list=PLxbwE86Cz83-cgvEt-p_0dJ8c_4jXgXmZ',
    videoId: null,
    playlistId: 'PLxbwE86Cz83-cgvEt-p_0dJ8c_4jXgXmZ',
    thumbnailUrl: '',
    customThumbnailUrl: '',
    category: 'General',
    status: 'In Progress',
    notes: 'Jeremy\'s IT Lab. Complete 200-301 syllabus with packet tracer labs and Anki flashcards.',
    lectures: [
      { id: 'lec-1', title: 'Day 1 - Network Devices & Topology Architecture', completed: true, linkUrl: 'https://github.com/jeremy-ccna', notes: 'Core router and switch definitions.' },
      { id: 'lec-2', title: 'Day 2 - Interfaces, Cables, and Fiber Optics', completed: true, linkUrl: '', notes: 'Single-mode vs multimode fiber.' },
      { id: 'lec-3', title: 'Day 3 - OSI Model and TCP/IP Encapsulation', completed: false, linkUrl: '', notes: 'Headers, payloads, and bit frames.' },
      { id: 'lec-4', title: 'Day 4 - IPv4 Addressing & Subnet Masks', completed: false, linkUrl: '', notes: 'Binary conversion drill.' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-course-2',
    sectionId: 'courses',
    title: 'Python for Beginners – Full Course [Programming with Mosh]',
    url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    normalizedUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    videoId: '_uQrJ0TkZlc',
    playlistId: null,
    thumbnailUrl: 'https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',
    customThumbnailUrl: '',
    category: 'Python',
    status: 'Completed',
    notes: 'Great 6-hour foundations on variables, loops, classes, and PyCharm setup.',
    lectures: [
      { id: 'lec-201', title: '01 - Variables, Input & Type Conversion', completed: true, linkUrl: '', notes: 'Syntax fundamentals.' },
      { id: 'lec-202', title: '02 - Strings, Math & Logical Operators', completed: true, linkUrl: '', notes: 'String indexing and methods.' },
      { id: 'lec-203', title: '03 - Lists, Tuples & Dictionaries', completed: true, linkUrl: '', notes: 'Data structures.' },
      { id: 'lec-204', title: '04 - Classes & Object Oriented Programming', completed: true, linkUrl: '', notes: 'Inheritance and dunder methods.' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-course-3',
    sectionId: 'courses',
    title: 'Build Autonomous AI Agents with LangChain & Python',
    url: 'https://www.youtube.com/watch?v=aywZrzNaKjs',
    normalizedUrl: 'https://www.youtube.com/watch?v=aywZrzNaKjs',
    videoId: 'aywZrzNaKjs',
    playlistId: null,
    thumbnailUrl: 'https://img.youtube.com/vi/aywZrzNaKjs/maxresdefault.jpg',
    customThumbnailUrl: '',
    category: 'AI & Data',
    status: 'Want to Learn',
    notes: 'Multi-agent systems, function calling, and local LLM orchestration.',
    lectures: [
      { id: 'lec-301', title: '01 - LangGraph Setup and Agent Loop', completed: false, linkUrl: 'https://github.com/langchain-ai', notes: 'State graph architecture.' },
      { id: 'lec-302', title: '02 - Tool Calling & Structured Outputs', completed: false, linkUrl: '', notes: 'Pydantic integration.' }
    ],
    createdAt: new Date().toISOString()
  }
];

const SAMPLE_TOOLS = [
  {
    id: 'sample-tool-1',
    sectionId: 'tools',
    name: 'iLovePDF',
    url: 'https://www.ilovepdf.com',
    category: 'PDF',
    description: 'Every tool you need to work with PDFs in one place: merge, split, compress, and convert.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-2',
    sectionId: 'tools',
    name: 'TinyURL',
    url: 'https://tinyurl.com',
    category: 'Utility',
    description: 'Fast link shortener that creates clean, memorable URLs with analytics.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-3',
    sectionId: 'tools',
    name: 'Clippobot',
    url: 'https://clippobot.com',
    category: 'Downloader',
    description: 'Online media & video downloader and audio clipper without accounts or ads.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-4',
    sectionId: 'tools',
    name: 'Remove.bg',
    url: 'https://www.remove.bg',
    category: 'Design',
    description: 'Remove backgrounds from images automatically in 5 seconds with zero clicks.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-5',
    sectionId: 'tools',
    name: 'Excalidraw',
    url: 'https://excalidraw.com',
    category: 'Productivity',
    description: 'Virtual collaborative whiteboard tool that lets you sketch diagrams and architectures.',
    createdAt: new Date().toISOString()
  }
];

function getWorkspaceIconSvg(icon, size = 16) {
  switch (icon) {
    case 'video':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.5" ry="2.5"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>`;
    case 'tools':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
    case 'code':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    case 'book':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    case 'globe':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
    case 'star':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    case 'cpu':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`;
    case 'terminal':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`;
    case 'bookmark':
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
    case 'folder':
    default:
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
  }
}

class CourseVaultApp {
  constructor() {
    this.sections = [];
    this.activeSectionId = 'courses';
    this.viewMode = 'grid'; // 'grid' | 'compact' | 'list'
    this.courses = [];
    this.categories = [];
    this.tools = [];
    this.activeToolCategory = 'all';
    this.activeCategoryFilter = 'all';
    this.activeStatusFilter = 'all';
    this.searchQuery = '';
    this.sortOption = 'newest';
    this.itemToDelete = null;
    this.courseToDeleteId = null;
    this.deferredInstallPrompt = null;
    this.expandedLecturesCourseIds = new Set();
    this.activeEditingCourseId = null;
    this.activeEditingLectures = [];

    this.init();
  }

  // ==========================================================================
  // 2. Initialization & Service Worker
  // ==========================================================================

  init() {
    this.loadState();
    this.bindDomElements();
    this.setupEventListeners();
    this.setupPwa();
    this.render();
  }

  loadState() {
    try {
      // 1. Sections / Workspaces
      const storedSections = localStorage.getItem(STORAGE_KEY_SECTIONS);
      if (storedSections) {
        this.sections = JSON.parse(storedSections);
      } else {
        this.sections = [...DEFAULT_SECTIONS];
        this.saveSections();
      }

      // 2. View Mode
      const storedViewMode = localStorage.getItem(STORAGE_KEY_VIEW_MODE);
      if (storedViewMode && ['grid', 'compact', 'list'].includes(storedViewMode)) {
        this.viewMode = storedViewMode;
      }

      // 3. Categories
      const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (storedCategories) {
        this.categories = JSON.parse(storedCategories);
      } else {
        this.categories = [...DEFAULT_CATEGORIES];
        this.saveCategories();
      }

      // 4. Courses
      const storedCourses = localStorage.getItem(STORAGE_KEY_COURSES);
      if (storedCourses) {
        this.courses = JSON.parse(storedCourses);
      } else {
        this.courses = [];
        this.saveCourses();
      }

      // 5. Tools
      const storedTools = localStorage.getItem(STORAGE_KEY_TOOLS);
      if (storedTools) {
        this.tools = JSON.parse(storedTools);
      } else {
        this.tools = [];
        this.saveTools();
      }

      this.migrateDataSchema();
    } catch (e) {
      console.error('Failed to parse localStorage data:', e);
      this.sections = [...DEFAULT_SECTIONS];
      this.categories = [...DEFAULT_CATEGORIES];
      this.courses = [];
      this.tools = [];
    }
  }

  /**
   * Seamlessly migrates existing courses and tools into multi-workspace schema with lectures
   */
  migrateDataSchema() {
    let hasChanges = false;

    this.courses = this.courses.map(course => {
      const videoId = this.extractYouTubeVideoId(course.url) || course.videoId || null;
      const playlistId = this.extractYouTubePlaylistId(course.url) || course.playlistId || null;
      const customCover = (course.customThumbnailUrl || course.customCoverUrl || '').trim();
      const sectionId = course.sectionId || 'courses';
      const lectures = Array.isArray(course.lectures) ? course.lectures : [];

      let thumb = '';
      if (customCover) {
        thumb = customCover;
      } else if (videoId) {
        thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else if (playlistId) {
        thumb = this.generatePlaylistCoverSvg(course.title, course.category);
      }

      if (course.sectionId !== sectionId || !Array.isArray(course.lectures) || course.thumbnailUrl !== thumb) {
        hasChanges = true;
      }

      return {
        ...course,
        sectionId: sectionId,
        videoId: videoId,
        playlistId: playlistId,
        thumbnailUrl: thumb,
        customThumbnailUrl: customCover,
        lectures: lectures
      };
    });

    this.tools = this.tools.map(tool => {
      const sectionId = tool.sectionId || 'tools';
      if (tool.sectionId !== sectionId) hasChanges = true;
      return {
        ...tool,
        sectionId: sectionId
      };
    });

    if (hasChanges) {
      this.saveCourses();
      this.saveTools();
      console.log('[CourseVault] Schema migrated to v2 (workspaces & lectures intact).');
    }
  }

  saveSections() {
    try {
      localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(this.sections));
    } catch (err) {
      console.error('[CourseVault] Failed to save workspaces:', err);
    }
  }

  saveViewMode() {
    localStorage.setItem(STORAGE_KEY_VIEW_MODE, this.viewMode);
  }

  saveCourses() {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(this.courses));
    } catch (err) {
      console.error('[CourseVault] Failed to save courses:', err);
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        this.showToast('Storage quota reached! Delete unused entries or large custom covers.', 'danger');
      } else {
        this.showToast('Could not save data to browser storage.', 'danger');
      }
    }
  }

  saveCategories() {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(this.categories));
  }

  saveTools() {
    try {
      localStorage.setItem(STORAGE_KEY_TOOLS, JSON.stringify(this.tools));
    } catch (err) {
      console.error('[CourseVault] Failed to save tools:', err);
      this.showToast('Could not save tools to browser storage.', 'danger');
    }
  }

  setupPwa() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then((reg) => {
            console.log('[CourseVault SW] Registered with scope:', reg.scope);
            const badge = document.getElementById('pwaBadge');
            if (badge) badge.textContent = 'Offline Ready';
          })
          .catch((err) => {
            console.warn('[CourseVault SW] Registration failed:', err);
          });
      });
    }

    const installBtn = document.getElementById('installPwaBtn');
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (installBtn) installBtn.classList.remove('hidden');
    });

    window.addEventListener('appinstalled', () => {
      if (installBtn) installBtn.classList.add('hidden');
      this.showToast('CourseVault installed to home screen!', 'success');
      this.deferredInstallPrompt = null;
    });

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      const badge = document.getElementById('pwaBadge');
      if (badge) badge.textContent = 'Standalone App';
      if (installBtn) installBtn.classList.add('hidden');
    }
  }

  // ==========================================================================
  // 3. Media & URL Helpers
  // ==========================================================================

  extractYouTubeVideoId(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const clean = rawUrl.trim();

    const vMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
    if (vMatch && vMatch[1]) return vMatch[1];

    const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
    if (shortMatch && shortMatch[1]) return shortMatch[1];

    const pathMatch = clean.match(/\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/i);
    if (pathMatch && pathMatch[1]) return pathMatch[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;

    return null;
  }

  extractYouTubePlaylistId(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const match = rawUrl.trim().match(/[?&]list=([a-zA-Z0-9_-]+)/i);
    return match && match[1] ? match[1] : null;
  }

  generatePlaylistCoverSvg(title, category) {
    const rawTitle = (title && typeof title === 'string' ? title.trim() : 'YouTube Playlist') || 'YouTube Playlist';
    const rawCat = (category && typeof category === 'string' ? category.trim() : 'Curriculum') || 'Curriculum';
    const safeTitle = rawTitle.slice(0, 38).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
    const safeCat = rawCat.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141822"/>
          <stop offset="60%" stop-color="#10131B"/>
          <stop offset="100%" stop-color="#0B0D11"/>
        </linearGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#D4AF37"/>
          <stop offset="100%" stop-color="#F3E5AB"/>
        </linearGradient>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="640" height="360" fill="url(#bg)"/>
      <rect width="640" height="360" fill="url(#grid)"/>
      <circle cx="560" cy="70" r="160" fill="rgba(212,175,55,0.06)" filter="blur(40px)"/>
      <circle cx="80" cy="320" r="130" fill="rgba(212,175,55,0.04)" filter="blur(30px)"/>
      <g transform="translate(48, 50)">
        <rect width="60" height="60" rx="14" fill="rgba(212,175,55,0.12)" stroke="rgba(212,175,55,0.35)" stroke-width="1.5"/>
        <path d="M20 22 h20 M20 30 h20 M20 38 h12 M36 36 l8 4 -8 4 z" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <rect x="122" y="66" width="96" height="26" rx="13" fill="rgba(212,175,55,0.14)" stroke="rgba(212,175,55,0.35)" stroke-width="1"/>
      <text x="170" y="83" fill="#F3E5AB" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">PLAYLIST</text>
      <text x="50" y="235" fill="#F3F4F6" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="22" font-weight="700" letter-spacing="-0.3">${safeTitle}</text>
      <text x="50" y="270" fill="#9CA3AF" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="13" font-weight="500">${safeCat} • CourseVault</text>
      <rect x="0" y="356" width="640" height="4" fill="url(#gold)"/>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  extractDomain(rawUrl) {
    if (!rawUrl) return '';
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return '';
    }
  }

  /**
   * Resolves item media: YouTube cover (video/playlist), custom cover, domain favicon, or monogram placeholder
   */
  resolveItemMedia(item) {
    if (!item) return { url: null, type: 'none' };
    const custom = (item.customThumbnailUrl || item.customCoverUrl || '').trim();
    if (custom) {
      return { url: custom, isCustom: true, type: 'custom' };
    }

    const videoId = item.videoId || this.extractYouTubeVideoId(item.url);
    if (videoId) {
      return {
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        fallbackUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        isCustom: false,
        type: 'youtube',
        videoId: videoId
      };
    }

    const playlistId = item.playlistId || this.extractYouTubePlaylistId(item.url);
    if (playlistId) {
      return {
        url: this.generatePlaylistCoverSvg(item.title, item.category),
        isCustom: false,
        type: 'playlist',
        playlistId: playlistId
      };
    }

    const domain = this.extractDomain(item.url);
    if (domain) {
      return {
        url: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
        domain: domain,
        initial: (item.title || domain || 'CV').charAt(0).toUpperCase(),
        isCustom: false,
        type: 'website'
      };
    }

    return {
      url: this.generatePlaylistCoverSvg(item.title, item.category || 'Course'),
      initial: (item.title || 'CV').charAt(0).toUpperCase(),
      isCustom: false,
      type: 'placeholder'
    };
  }

  compressImageFile(file, maxWidth = 640, quality = 0.7) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Selected file is not an image'));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#0B0D11';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          try {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('Failed to parse image data'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  normalizeUrl(rawUrl) {
    if (!rawUrl) return { normalized: '', isYouTube: false };
    const clean = rawUrl.trim();
    const videoId = this.extractYouTubeVideoId(clean);
    const playlistId = this.extractYouTubePlaylistId(clean);

    if (videoId && playlistId) {
      return { normalized: `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`, isYouTube: true };
    }
    if (videoId) {
      return { normalized: `https://www.youtube.com/watch?v=${videoId}`, isYouTube: true };
    }
    if (playlistId) {
      return { normalized: `https://www.youtube.com/playlist?list=${playlistId}`, isYouTube: true };
    }
    return { normalized: clean, isYouTube: false };
  }

  findDuplicateCourse(rawUrl, excludeId = null) {
    if (!rawUrl) return null;
    const { normalized } = this.normalizeUrl(rawUrl);
    const videoId = this.extractYouTubeVideoId(rawUrl);
    const playlistId = this.extractYouTubePlaylistId(rawUrl);

    return this.courses.find(course => {
      if (excludeId && course.id === excludeId) return false;
      if (course.normalizedUrl && normalized && course.normalizedUrl.toLowerCase() === normalized.toLowerCase()) {
        return true;
      }
      if (videoId && course.videoId && course.videoId === videoId) {
        return true;
      }
      if (playlistId && course.playlistId && course.playlistId === playlistId) {
        return true;
      }
      return false;
    }) || null;
  }

  // ==========================================================================
  // 4. Lecture Tracker & Progress Engine
  // ==========================================================================

  calculateCourseProgress(course) {
    if (course.lectures && course.lectures.length > 0) {
      const done = course.lectures.filter(l => l.completed).length;
      const pct = Math.round((done / course.lectures.length) * 100);
      return {
        pct: pct,
        done: done,
        total: course.lectures.length,
        hasLectures: true
      };
    }
    const pct = course.status === 'Completed' ? 100 : (course.status === 'In Progress' ? 50 : 0);
    return {
      pct: pct,
      done: 0,
      total: 0,
      hasLectures: false
    };
  }

  toggleLecture(courseId, lectureId, isCompleted) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course || !course.lectures) return;

    const lecture = course.lectures.find(l => l.id === lectureId);
    if (!lecture) return;

    lecture.completed = isCompleted;

    const progress = this.calculateCourseProgress(course);
    if (progress.pct === 100 && course.status !== 'Completed') {
      course.status = 'Completed';
      this.showToast(`🎉 100% Completed! All lectures finished for "${course.title}".`, 'success');
    } else if (progress.pct > 0 && progress.pct < 100 && course.status === 'Want to Learn') {
      course.status = 'In Progress';
    }

    this.saveCourses();
    this.render();
  }

  addLecture(courseId, title, linkUrl = '', notes = '') {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    if (!Array.isArray(course.lectures)) {
      course.lectures = [];
    }

    const newLecture = {
      id: 'lec-' + Date.now(),
      title: title.trim(),
      linkUrl: linkUrl.trim(),
      notes: notes.trim(),
      completed: false
    };

    course.lectures.push(newLecture);
    this.saveCourses();
    this.render();
    this.showToast(`Lecture added to "${course.title}"`, 'success');
  }

  deleteLecture(courseId, lectureId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course || !course.lectures) return;

    course.lectures = course.lectures.filter(l => l.id !== lectureId);
    this.saveCourses();
    this.render();
    this.showToast('Lecture removed', 'info');
  }

  // ==========================================================================
  // 5. DOM Binding & Event Listeners
  // ==========================================================================

  bindDomElements() {
    // Header & Navigation
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.sidebarChannels = document.getElementById('sidebarChannels');
    this.drawerBackdrop = document.getElementById('drawerBackdrop');
    this.searchInput = document.getElementById('searchInput');
    this.clearSearchBtn = document.getElementById('clearSearchBtn');
    this.openAddCourseModalBtn = document.getElementById('openAddCourseModalBtn');
    this.headerAddText = document.getElementById('headerAddText');
    this.installPwaBtn = document.getElementById('installPwaBtn');
    this.backupModalBtn = document.getElementById('backupModalBtn');

    // Dynamic Workspaces Container & Add Button
    this.workspacesNavList = document.getElementById('workspacesNavList');
    this.openAddWorkspaceBtn = document.getElementById('openAddWorkspaceBtn');

    // Mobile Bottom Bar
    this.bottomNavMenuBtn = document.getElementById('bottomNavMenuBtn');
    this.mobileFabAddBtn = document.getElementById('mobileFabAddBtn');
    this.mobileNavBackupBtn = document.getElementById('mobileNavBackupBtn');

    // Sidebar items
    this.categoryChannelsList = document.getElementById('categoryChannelsList');
    this.countAll = document.getElementById('countAll');
    this.countWant = document.getElementById('countWant');
    this.countProgress = document.getElementById('countProgress');
    this.countCompleted = document.getElementById('countCompleted');
    this.inlineAddCategoryBtn = document.getElementById('inlineAddCategoryBtn');
    this.sidebarAddCatBtn = document.getElementById('sidebarAddCatBtn');
    this.openManageCategoriesBtn = document.getElementById('openManageCategoriesBtn');
    this.sidebarBackupBtn = document.getElementById('sidebarBackupBtn');

    // Sidebar Global Omnisearch
    this.sidebarOmnisearchWrap = document.getElementById('sidebarOmnisearchWrap');
    this.globalSidebarSearchInput = document.getElementById('globalSidebarSearchInput');
    this.globalSidebarSearchClear = document.getElementById('globalSidebarSearchClear');
    this.sidebarSearchResults = document.getElementById('sidebarSearchResults');
    this.sidebarSearchKbd = document.getElementById('sidebarSearchKbd');
    if (this.sidebarSearchKbd) {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      this.sidebarSearchKbd.textContent = isMac ? '⌘K' : 'Ctrl K';
    }

    // Main Content
    this.coursesViewPanel = document.getElementById('coursesViewPanel');
    this.toolsViewPanel = document.getElementById('toolsViewPanel');
    this.activeCategoryTitle = document.getElementById('activeCategoryTitle');
    this.activeFilterCount = document.getElementById('activeFilterCount');
    this.statusTabsContainer = document.getElementById('statusTabsContainer');
    this.sortSelect = document.getElementById('sortSelect');
    this.viewModeSwitcher = document.getElementById('viewModeSwitcher');
    this.coursesGrid = document.getElementById('coursesGrid');
    this.emptyState = document.getElementById('emptyState');
    this.emptyTitle = document.getElementById('emptyTitle');
    this.emptyDescription = document.getElementById('emptyDescription');
    this.emptyAddCourseBtn = document.getElementById('emptyAddCourseBtn');
    this.emptyResetFilterBtn = document.getElementById('emptyResetFilterBtn');

    // Tools Dashboard Elements
    this.toolsCountTag = document.getElementById('toolsCountTag');
    this.openAddToolBtn = document.getElementById('openAddToolBtn');
    this.toolsCategoryTabs = document.getElementById('toolsCategoryTabs');
    this.toolsGrid = document.getElementById('toolsGrid');
    this.toolsEmptyState = document.getElementById('toolsEmptyState');
    this.toolsEmptyTitle = document.getElementById('toolsEmptyTitle');
    this.toolsEmptyDescription = document.getElementById('toolsEmptyDescription');
    this.toolsEmptyAddBtn = document.getElementById('toolsEmptyAddBtn');
    this.toolsResetFilterBtn = document.getElementById('toolsResetFilterBtn');

    // Course Modal
    this.courseModalOverlay = document.getElementById('courseModalOverlay');
    this.closeCourseModalBtn = document.getElementById('closeCourseModalBtn');
    this.cancelCourseBtn = document.getElementById('cancelCourseBtn');
    this.courseForm = document.getElementById('courseForm');
    this.courseModalTitle = document.getElementById('courseModalTitle');
    this.courseEditId = document.getElementById('courseEditId');
    this.courseSectionSelect = document.getElementById('courseSectionSelect');
    this.courseTitleInput = document.getElementById('courseTitleInput');
    this.courseUrlInput = document.getElementById('courseUrlInput');
    this.courseCategorySelect = document.getElementById('courseCategorySelect');
    this.courseNotesInput = document.getElementById('courseNotesInput');
    this.courseThumbnailInput = document.getElementById('courseThumbnailInput');
    this.courseCoverFileInput = document.getElementById('courseCoverFileInput');
    this.courseCoverFileLabel = document.getElementById('courseCoverFileLabel');
    this.coverUploadBtnText = document.getElementById('coverUploadBtnText');
    this.fileBadgeInfo = document.getElementById('fileBadgeInfo');
    this.fileBadgeText = document.getElementById('fileBadgeText');
    this.removeFileCoverBtn = document.getElementById('removeFileCoverBtn');
    this.thumbPreviewImg = document.getElementById('thumbPreviewImg');
    this.thumbPreviewFallback = document.getElementById('thumbPreviewFallback');
    this.thumbPreviewStatus = document.getElementById('thumbPreviewStatus');
    this.thumbPreviewText = document.getElementById('thumbPreviewText');
    this.clearCustomCoverBtn = document.getElementById('clearCustomCoverBtn');
    this.saveCourseSubmitBtn = document.getElementById('saveCourseSubmitBtn');
    this.inlineAddCategoryTriggerBtn = document.getElementById('inlineAddCategoryTriggerBtn');
    this.duplicateWarningAlert = document.getElementById('duplicateWarningAlert');
    this.duplicateWarningText = document.getElementById('duplicateWarningText');

    // Dedicated Lecture Modal Elements
    this.courseLecturesGroup = document.getElementById('courseLecturesGroup');
    this.openLectureModalBtn = document.getElementById('openLectureModalBtn');
    this.lectureCountBadge = document.getElementById('lectureCountBadge');
    this.lectureModalOverlay = document.getElementById('lectureModalOverlay');
    this.closeLectureModalBtn = document.getElementById('closeLectureModalBtn');
    this.saveAndCloseLectureModalBtn = document.getElementById('saveAndCloseLectureModalBtn');
    this.lectureModalTitle = document.getElementById('lectureModalTitle');
    this.lectureModalSubtitle = document.getElementById('lectureModalSubtitle');
    this.batchLectureCountInput = document.getElementById('batchLectureCountInput');
    this.batchGenerateLecturesBtn = document.getElementById('batchGenerateLecturesBtn');
    this.lectureModalStats = document.getElementById('lectureModalStats');
    this.lectureModalList = document.getElementById('lectureModalList');
    this.lectureModalAddForm = document.getElementById('lectureModalAddForm');
    this.newLectureTitle = document.getElementById('newLectureTitle');
    this.newLectureLink = document.getElementById('newLectureLink');
    this.newLectureNotes = document.getElementById('newLectureNotes');

    // Tool Modal
    this.toolModalOverlay = document.getElementById('toolModalOverlay');
    this.closeToolModalBtn = document.getElementById('closeToolModalBtn');
    this.cancelToolBtn = document.getElementById('cancelToolBtn');
    this.toolForm = document.getElementById('toolForm');
    this.toolModalTitle = document.getElementById('toolModalTitle');
    this.toolEditId = document.getElementById('toolEditId');
    this.toolSectionSelect = document.getElementById('toolSectionSelect');
    this.toolNameInput = document.getElementById('toolNameInput');
    this.toolUrlInput = document.getElementById('toolUrlInput');
    this.toolCategoryInput = document.getElementById('toolCategoryInput');
    this.toolQuickCategoryChips = document.getElementById('toolQuickCategoryChips');
    this.toolDescriptionInput = document.getElementById('toolDescriptionInput');
    this.saveToolBtnText = document.getElementById('saveToolBtnText');

    // Workspace Modal
    this.workspaceModalOverlay = document.getElementById('workspaceModalOverlay');
    this.closeWorkspaceModalBtn = document.getElementById('closeWorkspaceModalBtn');
    this.cancelWorkspaceBtn = document.getElementById('cancelWorkspaceBtn');
    this.workspaceForm = document.getElementById('workspaceForm');
    this.workspaceModalTitle = document.getElementById('workspaceModalTitle');
    this.workspaceEditId = document.getElementById('workspaceEditId');
    this.workspaceTitleInput = document.getElementById('workspaceTitleInput');
    this.workspaceShortNameInput = document.getElementById('workspaceShortNameInput');
    this.workspaceDescInput = document.getElementById('workspaceDescInput');
    this.workspaceIconPicker = document.getElementById('workspaceIconPicker');
    this.workspaceSelectedIcon = document.getElementById('workspaceSelectedIcon');
    this.deleteWorkspaceBtn = document.getElementById('deleteWorkspaceBtn');
    this.saveWorkspaceSubmitBtnText = document.getElementById('saveWorkspaceSubmitBtnText');

    // Manage Categories Modal
    this.manageCategoriesModalOverlay = document.getElementById('manageCategoriesModalOverlay');
    this.closeManageCategoriesModalBtn = document.getElementById('closeManageCategoriesModalBtn');
    this.closeManageCategoriesFooterBtn = document.getElementById('closeManageCategoriesFooterBtn');
    this.manageCategoriesList = document.getElementById('manageCategoriesList');
    this.inlineCategoryForm = document.getElementById('inlineCategoryForm');
    this.manageNewCatName = document.getElementById('manageNewCatName');
    this.manageNewCatColor = document.getElementById('manageNewCatColor');

    // Category Modal
    this.categoryModalOverlay = document.getElementById('categoryModalOverlay');
    this.closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    this.cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    this.categoryForm = document.getElementById('categoryForm');
    this.newCategoryNameInput = document.getElementById('newCategoryNameInput');
    this.catNameErrorMsg = document.getElementById('catNameErrorMsg');

    // Backup Modal
    this.backupModalOverlay = document.getElementById('backupModalOverlay');
    this.closeBackupModalBtn = document.getElementById('closeBackupModalBtn');
    this.closeBackupFooterBtn = document.getElementById('closeBackupFooterBtn');
    this.exportJsonBtn = document.getElementById('exportJsonBtn');
    this.importDropzone = document.getElementById('importDropzone');
    this.importFileInput = document.getElementById('importFileInput');
    this.importFeedback = document.getElementById('importFeedback');
    this.loadSampleDataBtn = document.getElementById('loadSampleDataBtn');
    this.clearAllDataBtn = document.getElementById('clearAllDataBtn');

    // Delete Modal
    this.deleteConfirmModal = document.getElementById('deleteConfirmModal');
    this.deleteModalTitle = document.getElementById('deleteModalTitle');
    this.deleteItemTitle = document.getElementById('deleteItemTitle');
    this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Toast Container
    this.toastStack = document.getElementById('toastStack');
  }

  setupEventListeners() {
    // Drawer
    const toggleDrawer = () => {
      const isOpen = this.sidebarChannels.classList.contains('open');
      if (isOpen) this.closeDrawer();
      else this.openDrawer();
    };

    if (this.mobileMenuBtn) this.mobileMenuBtn.addEventListener('click', toggleDrawer);
    if (this.bottomNavMenuBtn) this.bottomNavMenuBtn.addEventListener('click', toggleDrawer);
    if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', () => this.closeDrawer());

    // View Mode Switcher
    if (this.viewModeSwitcher) {
      this.viewModeSwitcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-mode-btn');
        if (!btn || !btn.dataset.viewMode) return;
        this.setViewMode(btn.dataset.viewMode);
      });
    }

    // Workspaces
    if (this.openAddWorkspaceBtn) {
      this.openAddWorkspaceBtn.addEventListener('click', () => {
        this.closeDrawer();
        this.openWorkspaceModal();
      });
    }
    if (this.closeWorkspaceModalBtn) {
      this.closeWorkspaceModalBtn.addEventListener('click', () => this.closeWorkspaceModal());
    }
    if (this.cancelWorkspaceBtn) {
      this.cancelWorkspaceBtn.addEventListener('click', () => this.closeWorkspaceModal());
    }
    if (this.workspaceForm) {
      this.workspaceForm.addEventListener('submit', (e) => this.handleWorkspaceSubmit(e));
    }
    if (this.deleteWorkspaceBtn) {
      this.deleteWorkspaceBtn.addEventListener('click', () => this.handleDeleteWorkspace());
    }

    // Manage Categories
    if (this.openManageCategoriesBtn) {
      this.openManageCategoriesBtn.addEventListener('click', () => {
        this.closeDrawer();
        this.openManageCategoriesModal();
      });
    }
    if (this.closeManageCategoriesModalBtn) {
      this.closeManageCategoriesModalBtn.addEventListener('click', () => this.closeManageCategoriesModal());
    }
    if (this.closeManageCategoriesFooterBtn) {
      this.closeManageCategoriesFooterBtn.addEventListener('click', () => this.closeManageCategoriesModal());
    }
    if (this.inlineCategoryForm) {
      this.inlineCategoryForm.addEventListener('submit', (e) => this.handleInlineCategorySubmit(e));
    }

    // Dedicated Lecture Modal
    if (this.openLectureModalBtn) {
      this.openLectureModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openLectureModal();
      });
    }
    if (this.closeLectureModalBtn) {
      this.closeLectureModalBtn.addEventListener('click', () => this.closeLectureModal());
    }
    if (this.saveAndCloseLectureModalBtn) {
      this.saveAndCloseLectureModalBtn.addEventListener('click', () => this.saveAndCloseLectureModal());
    }
    if (this.batchGenerateLecturesBtn) {
      this.batchGenerateLecturesBtn.addEventListener('click', () => this.handleBatchGenerateLectures());
    }
    if (this.lectureModalAddForm) {
      this.lectureModalAddForm.addEventListener('submit', (e) => this.handleSingleLectureAdd(e));
    }

    // Search
    const executeSearch = (val) => {
      this.searchQuery = val.trim().toLowerCase();
      if (this.searchQuery) {
        this.clearSearchBtn.classList.remove('hidden');
      } else {
        this.clearSearchBtn.classList.add('hidden');
      }
      if (this.activeSectionId === 'tools') {
        this.renderTools();
      } else {
        this.renderCourses();
      }
    };

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => executeSearch(e.target.value));
      this.searchInput.addEventListener('search', () => executeSearch(this.searchInput.value));
    }

    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.searchInput.value = '';
        executeSearch('');
        this.searchInput.focus();
      });
    }

    // Context-Aware Add Button
    const handleAddItem = () => {
      if (this.activeSectionId === 'tools') {
        this.openToolModal();
      } else {
        this.openCourseModal();
      }
    };
    if (this.openAddCourseModalBtn) this.openAddCourseModalBtn.addEventListener('click', handleAddItem);
    if (this.mobileFabAddBtn) this.mobileFabAddBtn.addEventListener('click', handleAddItem);
    if (this.emptyAddCourseBtn) this.emptyAddCourseBtn.addEventListener('click', () => this.openCourseModal());
    if (this.openAddToolBtn) this.openAddToolBtn.addEventListener('click', () => this.openToolModal());
    if (this.toolsEmptyAddBtn) this.toolsEmptyAddBtn.addEventListener('click', () => this.openToolModal());

    // Course Modal
    if (this.closeCourseModalBtn) this.closeCourseModalBtn.addEventListener('click', () => this.closeCourseModal());
    if (this.cancelCourseBtn) this.cancelCourseBtn.addEventListener('click', () => this.closeCourseModal());
    if (this.courseForm) this.courseForm.addEventListener('submit', (e) => this.handleCourseSubmit(e));

    // Tool Modal
    if (this.closeToolModalBtn) this.closeToolModalBtn.addEventListener('click', () => this.closeToolModal());
    if (this.cancelToolBtn) this.cancelToolBtn.addEventListener('click', () => this.closeToolModal());
    if (this.toolForm) this.toolForm.addEventListener('submit', (e) => this.handleToolSubmit(e));

    if (this.toolQuickCategoryChips) {
      this.toolQuickCategoryChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip-item');
        if (chip && chip.dataset.fillCat && this.toolCategoryInput) {
          this.toolCategoryInput.value = chip.dataset.fillCat;
        }
      });
    }

    // Tools Category Filter Tabs
    if (this.toolsCategoryTabs) {
      this.toolsCategoryTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.tools-tab');
        if (!tab) return;
        this.toolsCategoryTabs.querySelectorAll('.tools-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeToolCategory = tab.dataset.toolCategory || 'all';
        this.renderTools();
      });
    }

    // New Category Modal
    const openAddCat = () => {
      this.closeDrawer();
      this.openCategoryModal();
    };
    if (this.inlineAddCategoryBtn) this.inlineAddCategoryBtn.addEventListener('click', openAddCat);
    if (this.sidebarAddCatBtn) this.sidebarAddCatBtn.addEventListener('click', openAddCat);
    if (this.inlineAddCategoryTriggerBtn) this.inlineAddCategoryTriggerBtn.addEventListener('click', openAddCat);
    if (this.closeCategoryModalBtn) this.closeCategoryModalBtn.addEventListener('click', () => this.closeCategoryModal());
    if (this.cancelCategoryBtn) this.cancelCategoryBtn.addEventListener('click', () => this.closeCategoryModal());
    if (this.categoryForm) this.categoryForm.addEventListener('submit', (e) => this.handleCategorySubmit(e));

    // Backup & Restore
    const openBackup = () => {
      this.closeDrawer();
      this.openBackupModal();
    };
    if (this.backupModalBtn) this.backupModalBtn.addEventListener('click', openBackup);
    if (this.mobileNavBackupBtn) this.mobileNavBackupBtn.addEventListener('click', openBackup);
    if (this.sidebarBackupBtn) this.sidebarBackupBtn.addEventListener('click', openBackup);
    if (this.closeBackupModalBtn) this.closeBackupModalBtn.addEventListener('click', () => this.closeBackupModal());
    if (this.closeBackupFooterBtn) this.closeBackupFooterBtn.addEventListener('click', () => this.closeBackupModal());
    if (this.exportJsonBtn) this.exportJsonBtn.addEventListener('click', () => this.exportBackupJson());
    if (this.importDropzone) this.importDropzone.addEventListener('click', () => this.importFileInput.click());
    if (this.importFileInput) this.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));

    if (this.importDropzone) {
      this.importDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.importDropzone.classList.add('dragover');
      });
      this.importDropzone.addEventListener('dragleave', () => {
        this.importDropzone.classList.remove('dragover');
      });
      this.importDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.importDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.processImportJson(e.dataTransfer.files[0]);
        }
      });
    }

    if (this.loadSampleDataBtn) this.loadSampleDataBtn.addEventListener('click', () => this.loadSampleData());
    if (this.clearAllDataBtn) this.clearAllDataBtn.addEventListener('click', () => this.clearAllData());

    // Live URL Detection & Thumbnail Preview
    const handleUrlChange = () => {
      this.checkLiveDuplicate();
      this.updateThumbnailPreview();
    };
    if (this.courseUrlInput) {
      this.courseUrlInput.addEventListener('input', handleUrlChange);
      this.courseUrlInput.addEventListener('paste', () => setTimeout(handleUrlChange, 50));
    }

    if (this.courseTitleInput) {
      this.courseTitleInput.addEventListener('input', () => {
        const rawUrl = this.courseUrlInput ? this.courseUrlInput.value.trim() : '';
        const playlistId = this.extractYouTubePlaylistId(rawUrl);
        const videoId = this.extractYouTubeVideoId(rawUrl);
        const customThumb = this.courseThumbnailInput ? this.courseThumbnailInput.value.trim() : '';
        if (playlistId && !videoId && !customThumb) {
          this.updateThumbnailPreview();
        }
      });
    }

    if (this.courseSectionSelect) {
      this.courseSectionSelect.addEventListener('change', () => {
        this.populateCategoryDropdown(this.courseSectionSelect.value);
      });
    }

    if (this.courseThumbnailInput) {
      const handleCustomUrlChange = () => {
        const val = this.courseThumbnailInput.value.trim();
        if (val && !val.startsWith('data:image/')) {
          if (this.courseCoverFileInput) this.courseCoverFileInput.value = '';
          if (this.fileBadgeInfo) this.fileBadgeInfo.classList.add('hidden');
          if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
        }
        this.updateThumbnailPreview();
      };
      this.courseThumbnailInput.addEventListener('input', handleCustomUrlChange);
      this.courseThumbnailInput.addEventListener('paste', () => setTimeout(handleCustomUrlChange, 50));
    }

    if (this.courseCoverFileInput) {
      this.courseCoverFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i) && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
          this.showToast('Please select a valid image file (.jpg, .png, .webp).', 'warning');
          this.courseCoverFileInput.value = '';
          return;
        }

        try {
          if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Optimizing image...';
          const compressedBase64 = await this.compressImageFile(file, 640, 0.7);

          if (this.courseThumbnailInput) this.courseThumbnailInput.value = compressedBase64;
          const compressedKb = Math.round((compressedBase64.length * 3 / 4) / 1024);

          if (this.fileBadgeText) this.fileBadgeText.textContent = `${file.name} (~${compressedKb} KB)`;
          if (this.fileBadgeInfo) this.fileBadgeInfo.classList.remove('hidden');
          if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Change Uploaded Image';

          this.updateThumbnailPreview();
          this.showToast(`Cover loaded & optimized (~${compressedKb} KB)`, 'success');
        } catch (err) {
          console.error('[CourseVault] File upload conversion failed:', err);
          this.showToast('Could not process this image file.', 'danger');
          if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
        }
      });
    }

    if (this.removeFileCoverBtn) {
      this.removeFileCoverBtn.addEventListener('click', () => {
        this.clearUploadedFileCover();
        this.showToast('Removed uploaded image cover', 'info');
      });
    }

    if (this.clearCustomCoverBtn) {
      this.clearCustomCoverBtn.addEventListener('click', () => {
        this.clearUploadedFileCover();
        if (this.courseThumbnailInput) this.courseThumbnailInput.value = '';
        this.updateThumbnailPreview();
        this.showToast('Reset to automatic preview', 'info');
      });
    }

    // Status Tabs
    if (this.statusTabsContainer) {
      this.statusTabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.status-tab');
        if (!tab) return;
        this.statusTabsContainer.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeStatusFilter = tab.dataset.tabStatus;
        this.renderCourses();
      });
    }

    // Sort
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.sortOption = e.target.value;
        this.renderCourses();
      });
    }

    // Reset Filters from Empty State
    if (this.emptyResetFilterBtn) {
      this.emptyResetFilterBtn.addEventListener('click', () => {
        this.activeCategoryFilter = 'all';
        this.activeStatusFilter = 'all';
        this.searchQuery = '';
        this.searchInput.value = '';
        this.clearSearchBtn.classList.add('hidden');
        this.statusTabsContainer.querySelectorAll('.status-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.tabStatus === 'all');
        });
        this.render();
      });
    }

    // Delete Modal
    if (this.cancelDeleteBtn) this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    if (this.confirmDeleteBtn) this.confirmDeleteBtn.addEventListener('click', () => this.handleConfirmDelete());

    // Global Omnisearch
    this.setupGlobalOmnisearch();
  }

  openDrawer() {
    this.sidebarChannels.classList.add('open');
    this.drawerBackdrop.classList.add('active');
  }

  closeDrawer() {
    this.sidebarChannels.classList.remove('open');
    this.drawerBackdrop.classList.remove('active');
  }

  // ==========================================================================
  // Global Omnisearch Engine
  // ==========================================================================

  setupGlobalOmnisearch() {
    if (!this.globalSidebarSearchInput) return;

    // Real-time input handling
    this.globalSidebarSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (!query) {
        if (this.globalSidebarSearchClear) this.globalSidebarSearchClear.classList.add('hidden');
        if (this.sidebarSearchResults) this.sidebarSearchResults.classList.add('hidden');
      } else {
        if (this.globalSidebarSearchClear) this.globalSidebarSearchClear.classList.remove('hidden');
        this.renderOmnisearchResults(query);
      }
    });

    // Clear button
    if (this.globalSidebarSearchClear) {
      this.globalSidebarSearchClear.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.globalSidebarSearchInput.value = '';
        this.globalSidebarSearchClear.classList.add('hidden');
        if (this.sidebarSearchResults) this.sidebarSearchResults.classList.add('hidden');
        this.globalSidebarSearchInput.focus();
      });
    }

    // Re-open results on focus if input has value
    this.globalSidebarSearchInput.addEventListener('focus', () => {
      const query = this.globalSidebarSearchInput.value.trim();
      if (query && this.sidebarSearchResults) {
        this.renderOmnisearchResults(query);
      }
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
      if (this.sidebarOmnisearchWrap && !this.sidebarOmnisearchWrap.contains(e.target)) {
        if (this.sidebarSearchResults) {
          this.sidebarSearchResults.classList.add('hidden');
        }
      }
    });

    // Global keyboard shortcuts (Ctrl+K / Cmd+K or /)
    document.addEventListener('keydown', (e) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrlK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      const isSlash = e.key === '/' && !isTyping;

      if (isCmdOrCtrlK || isSlash) {
        e.preventDefault();
        if (this.sidebarChannels && !this.sidebarChannels.classList.contains('open') && window.innerWidth <= 768) {
          this.openDrawer();
        }
        if (this.globalSidebarSearchInput) {
          this.globalSidebarSearchInput.focus();
          this.globalSidebarSearchInput.select();
          const query = this.globalSidebarSearchInput.value.trim();
          if (query) this.renderOmnisearchResults(query);
        }
      }

      if (e.key === 'Escape') {
        if (document.activeElement === this.globalSidebarSearchInput) {
          if (this.globalSidebarSearchInput.value) {
            this.globalSidebarSearchInput.value = '';
            if (this.globalSidebarSearchClear) this.globalSidebarSearchClear.classList.add('hidden');
            if (this.sidebarSearchResults) this.sidebarSearchResults.classList.add('hidden');
          } else {
            this.globalSidebarSearchInput.blur();
            if (this.sidebarSearchResults) this.sidebarSearchResults.classList.add('hidden');
          }
        }
      }
    });
  }

  renderOmnisearchResults(rawQuery) {
    if (!this.sidebarSearchResults) return;
    const q = (rawQuery || '').trim().toLowerCase();
    if (!q) {
      this.sidebarSearchResults.classList.add('hidden');
      return;
    }

    const matchedCourses = [];
    const matchedTools = [];

    // Helper to highlight matching text
    const highlight = (text) => {
      if (!text) return '';
      const str = String(text);
      const idx = str.toLowerCase().indexOf(q);
      if (idx === -1) return escapeHtml(str);
      const before = escapeHtml(str.slice(0, idx));
      const match = escapeHtml(str.slice(idx, idx + q.length));
      const after = escapeHtml(str.slice(idx + q.length));
      return `${before}<strong class="omni-highlight-text">${match}</strong>${after}`;
    };

    // 1. Scan Courses across all workspaces
    this.courses.forEach(course => {
      let matched = false;
      let matchType = '';
      let matchDetail = '';

      const titleMatch = (course.title || '').toLowerCase().includes(q);
      const categoryMatch = (course.category || '').toLowerCase().includes(q);
      const notesMatch = (course.notes || '').toLowerCase().includes(q);
      const statusMatch = (course.status || '').toLowerCase().includes(q);

      if (titleMatch) {
        matched = true;
        matchType = 'Course Title';
        matchDetail = course.category;
      } else if (categoryMatch) {
        matched = true;
        matchType = 'Category';
        matchDetail = course.category;
      } else if (notesMatch) {
        matched = true;
        matchType = 'Notes';
        matchDetail = course.notes.length > 50 ? course.notes.slice(0, 50) + '...' : course.notes;
      } else if (statusMatch) {
        matched = true;
        matchType = 'Status';
        matchDetail = course.status;
      } else if (Array.isArray(course.lectures) && course.lectures.length > 0) {
        // Scan lectures
        const matchingLec = course.lectures.find(l => 
          (l.title && l.title.toLowerCase().includes(q)) || 
          (l.notes && l.notes.toLowerCase().includes(q)) || 
          (l.linkUrl && l.linkUrl.toLowerCase().includes(q))
        );
        if (matchingLec) {
          matched = true;
          matchType = 'Lecture';
          matchDetail = `Lecture: ${matchingLec.title}`;
        }
      }

      if (matched) {
        matchedCourses.push({
          type: 'course',
          id: course.id,
          title: course.title,
          category: course.category,
          sectionId: course.sectionId || 'courses',
          matchType: matchType,
          matchDetail: matchDetail,
          item: course
        });
      }
    });

    // 2. Scan Tools
    this.tools.forEach(tool => {
      let matched = false;
      let matchType = '';
      let matchDetail = '';

      const nameMatch = (tool.name || '').toLowerCase().includes(q);
      const categoryMatch = (tool.category || '').toLowerCase().includes(q);
      const descMatch = (tool.description || '').toLowerCase().includes(q);
      const urlMatch = (tool.url || '').toLowerCase().includes(q);

      if (nameMatch) {
        matched = true;
        matchType = 'Tool Name';
        matchDetail = tool.category;
      } else if (categoryMatch) {
        matched = true;
        matchType = 'Category';
        matchDetail = tool.category;
      } else if (descMatch) {
        matched = true;
        matchType = 'Description';
        matchDetail = tool.description.length > 50 ? tool.description.slice(0, 50) + '...' : tool.description;
      } else if (urlMatch) {
        matched = true;
        matchType = 'Link URL';
        matchDetail = tool.url;
      }

      if (matched) {
        matchedTools.push({
          type: 'tool',
          id: tool.id,
          title: tool.name,
          category: tool.category,
          sectionId: tool.sectionId || 'tools',
          matchType: matchType,
          matchDetail: matchDetail,
          item: tool
        });
      }
    });

    const totalMatches = matchedCourses.length + matchedTools.length;

    if (totalMatches === 0) {
      this.sidebarSearchResults.innerHTML = `
        <div class="omni-empty-state">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" style="color: var(--accent-gold); opacity: 0.85;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <div>No matches found for <strong class="omni-highlight-text">"${escapeHtml(rawQuery)}"</strong></div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Try searching for course titles, categories, notes, or lectures.</div>
        </div>
      `;
      this.sidebarSearchResults.classList.remove('hidden');
      return;
    }

    let resultsHtml = '';

    // Group 1: Courses
    if (matchedCourses.length > 0) {
      resultsHtml += `
        <div class="omni-group-title">
          <span>Courses & Curriculum</span>
          <span class="omni-group-badge">${matchedCourses.length}</span>
        </div>
      `;
      matchedCourses.slice(0, 10).forEach(m => {
        resultsHtml += `
          <button type="button" class="omni-result-item" data-omni-type="course" data-omni-id="${m.id}" role="option">
            <div class="omni-item-icon">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <div class="omni-item-content">
              <div class="omni-item-title">${highlight(m.title)}</div>
              <div class="omni-item-match-badge">
                <span class="omni-tag-pill"># ${escapeHtml(m.category)}</span>
                <span>${highlight(m.matchDetail)}</span>
              </div>
            </div>
          </button>
        `;
      });
    }

    // Group 2: Tools
    if (matchedTools.length > 0) {
      resultsHtml += `
        <div class="omni-group-title">
          <span>Tools & Utilities</span>
          <span class="omni-group-badge">${matchedTools.length}</span>
        </div>
      `;
      matchedTools.slice(0, 10).forEach(m => {
        resultsHtml += `
          <button type="button" class="omni-result-item" data-omni-type="tool" data-omni-id="${m.id}" role="option">
            <div class="omni-item-icon" style="color: #60a5fa;">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </div>
            <div class="omni-item-content">
              <div class="omni-item-title">${highlight(m.title)}</div>
              <div class="omni-item-match-badge">
                <span class="omni-tag-pill"># ${escapeHtml(m.category)}</span>
                <span>${highlight(m.matchDetail)}</span>
              </div>
            </div>
          </button>
        `;
      });
    }

    this.sidebarSearchResults.innerHTML = resultsHtml;
    this.sidebarSearchResults.classList.remove('hidden');

    // Attach click listeners to result rows
    this.sidebarSearchResults.querySelectorAll('.omni-result-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.omniType;
        const id = btn.dataset.omniId;
        const match = type === 'course' 
          ? matchedCourses.find(c => c.id === id)
          : matchedTools.find(t => t.id === id);
        if (match) {
          this.jumpToOmnisearchResult(match);
        }
      });
    });
  }

  jumpToOmnisearchResult(match) {
    if (!match) return;

    if (match.type === 'tool') {
      this.switchWorkspace('tools');
      this.activeToolCategory = 'all';
      if (this.toolsCategoryTabs) {
        this.toolsCategoryTabs.querySelectorAll('.tools-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.toolCategory === 'all');
        });
      }
      this.renderTools();
    } else {
      const targetSec = match.item.sectionId || 'courses';
      this.switchWorkspace(targetSec);
      this.activeCategoryFilter = 'all';
      this.activeStatusFilter = 'all';
      if (this.statusTabsContainer) {
        this.statusTabsContainer.querySelectorAll('.status-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.tabStatus === 'all');
        });
      }
      this.renderCourses();
    }

    // Hide dropdown & close mobile drawer
    if (this.sidebarSearchResults) {
      this.sidebarSearchResults.classList.add('hidden');
    }
    this.closeDrawer();

    // Scroll into view & pulse animation
    setTimeout(() => {
      const selector = match.type === 'course' 
        ? `.course-card[data-id="${match.item.id}"]`
        : `.tool-card[data-id="${match.item.id}"]`;
      const card = document.querySelector(selector);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.remove('highlight-pulse');
        void card.offsetWidth; // Trigger reflow for animation restart
        card.classList.add('highlight-pulse');
        setTimeout(() => card.classList.remove('highlight-pulse'), 2500);
      }
      this.showToast(`Found "${match.title}"`, 'success');
    }, 120);
  }

  // ==========================================================================
  // 6. View Mode Switching
  // ==========================================================================

  setViewMode(mode) {
    if (!['grid', 'compact', 'list'].includes(mode)) return;
    this.viewMode = mode;
    this.saveViewMode();

    if (this.viewModeSwitcher) {
      this.viewModeSwitcher.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.viewMode === mode);
      });
    }

    if (this.coursesGrid) {
      this.coursesGrid.classList.remove('view-mode-grid', 'view-mode-compact', 'view-mode-list');
      this.coursesGrid.classList.add(`view-mode-${mode}`);
    }

    this.renderCourses();
  }

  // ==========================================================================
  // 7. Workspace Management (Dynamic Sections)
  // ==========================================================================

  renderWorkspacesNav() {
    if (!this.workspacesNavList) return;
    this.workspacesNavList.innerHTML = '';

    this.sections.forEach(sec => {
      const btn = document.createElement('button');
      const isActive = this.activeSectionId === sec.id;
      btn.className = `workspace-nav-item ${isActive ? 'active' : ''}`;
      btn.dataset.sectionId = sec.id;

      // Count items in this workspace
      let count = 0;
      if (sec.id === 'tools') {
        count = this.tools.length;
      } else {
        count = this.courses.filter(c => (c.sectionId || 'courses') === sec.id).length;
      }

      btn.innerHTML = `
        <span class="workspace-icon">${getWorkspaceIconSvg(sec.icon || 'folder', 16)}</span>
        <span class="workspace-name">${escapeHtml(sec.shortName || sec.title)}</span>
        <span class="badge ${sec.id === 'tools' ? 'badge-tools' : ''}">${count}</span>
        <span class="workspace-actions">
          <button type="button" class="workspace-action-btn edit-sec" title="Edit Workspace" aria-label="Edit workspace">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
        </span>
      `;

      btn.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-sec');
        if (editBtn) {
          e.stopPropagation();
          this.closeDrawer();
          this.openWorkspaceModal(sec);
          return;
        }
        this.switchWorkspace(sec.id);
        this.closeDrawer();
      });

      this.workspacesNavList.appendChild(btn);
    });
  }

  switchWorkspace(sectionId) {
    this.activeSectionId = sectionId;
    this.activeCategoryFilter = 'all';
    this.activeToolCategory = 'all';
    const curSection = this.sections.find(s => s.id === sectionId) || this.sections[0];

    if (sectionId === 'tools') {
      if (this.coursesViewPanel) this.coursesViewPanel.classList.add('hidden');
      if (this.toolsViewPanel) this.toolsViewPanel.classList.remove('hidden');
      if (this.headerAddText) this.headerAddText.textContent = 'Add Tool';
      if (this.searchInput) this.searchInput.placeholder = 'Search tools, tags, URLs...';
      this.renderTools();
    } else {
      if (this.coursesViewPanel) this.coursesViewPanel.classList.remove('hidden');
      if (this.toolsViewPanel) this.toolsViewPanel.classList.add('hidden');
      if (this.headerAddText) this.headerAddText.textContent = `Add to ${curSection.shortName}`;
      if (this.searchInput) this.searchInput.placeholder = `Search in ${curSection.shortName}...`;
      if (this.activeCategoryTitle) this.activeCategoryTitle.textContent = curSection.title;
      this.renderCourses();
    }

    this.renderWorkspacesNav();
    this.renderCategoryChannels();
    this.renderCounts();
  }

  openWorkspaceModal(editSection = null) {
    const icons = ['folder', 'video', 'tools', 'code', 'book', 'globe', 'star', 'cpu', 'terminal', 'bookmark'];
    if (this.workspaceIconPicker) {
      this.workspaceIconPicker.innerHTML = '';
      icons.forEach(ic => {
        const chip = document.createElement('div');
        chip.className = `icon-choice-chip ${ic === (editSection ? editSection.icon : 'folder') ? 'selected' : ''}`;
        chip.dataset.icon = ic;
        chip.innerHTML = `${getWorkspaceIconSvg(ic, 16)} <span>${ic}</span>`;
        chip.addEventListener('click', () => {
          this.workspaceIconPicker.querySelectorAll('.icon-choice-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          if (this.workspaceSelectedIcon) this.workspaceSelectedIcon.value = ic;
        });
        this.workspaceIconPicker.appendChild(chip);
      });
    }

    if (editSection) {
      if (this.workspaceModalTitle) this.workspaceModalTitle.textContent = 'Edit Workspace';
      if (this.saveWorkspaceSubmitBtnText) this.saveWorkspaceSubmitBtnText.textContent = 'Save Changes';
      if (this.workspaceEditId) this.workspaceEditId.value = editSection.id;
      if (this.workspaceTitleInput) this.workspaceTitleInput.value = editSection.title;
      if (this.workspaceShortNameInput) this.workspaceShortNameInput.value = editSection.shortName;
      if (this.workspaceDescInput) this.workspaceDescInput.value = editSection.description || '';
      if (this.workspaceSelectedIcon) this.workspaceSelectedIcon.value = editSection.icon || 'folder';
      if (this.deleteWorkspaceBtn) {
        if (!editSection.isDefault) this.deleteWorkspaceBtn.classList.remove('hidden');
        else this.deleteWorkspaceBtn.classList.add('hidden');
      }
    } else {
      if (this.workspaceModalTitle) this.workspaceModalTitle.textContent = 'Create Workspace';
      if (this.saveWorkspaceSubmitBtnText) this.saveWorkspaceSubmitBtnText.textContent = 'Create Workspace';
      if (this.workspaceEditId) this.workspaceEditId.value = '';
      if (this.workspaceForm) this.workspaceForm.reset();
      if (this.workspaceSelectedIcon) this.workspaceSelectedIcon.value = 'folder';
      if (this.deleteWorkspaceBtn) this.deleteWorkspaceBtn.classList.add('hidden');
    }

    if (this.workspaceModalOverlay) this.workspaceModalOverlay.classList.remove('hidden');
    setTimeout(() => {
      if (this.workspaceTitleInput) this.workspaceTitleInput.focus();
    }, 100);
  }

  closeWorkspaceModal() {
    if (this.workspaceModalOverlay) this.workspaceModalOverlay.classList.add('hidden');
    if (this.workspaceForm) this.workspaceForm.reset();
  }

  handleWorkspaceSubmit(e) {
    e.preventDefault();
    const title = this.workspaceTitleInput ? this.workspaceTitleInput.value.trim() : '';
    const shortName = this.workspaceShortNameInput ? this.workspaceShortNameInput.value.trim() : title;
    const desc = this.workspaceDescInput ? this.workspaceDescInput.value.trim() : '';
    const icon = this.workspaceSelectedIcon ? this.workspaceSelectedIcon.value : 'folder';
    const editId = this.workspaceEditId ? this.workspaceEditId.value : '';

    if (!title) {
      this.showToast('Please provide a workspace title.', 'warning');
      return;
    }

    if (editId) {
      const sec = this.sections.find(s => s.id === editId);
      if (sec) {
        sec.title = title;
        sec.shortName = shortName;
        sec.description = desc;
        sec.icon = icon;
        this.saveSections();
        if (this.activeSectionId === editId) {
          if (this.activeCategoryTitle) this.activeCategoryTitle.textContent = title;
          if (this.headerAddText && editId !== 'tools') this.headerAddText.textContent = `Add to ${shortName}`;
        }
        this.showToast(`Updated workspace "${title}"`, 'success');
      }
    } else {
      const newSec = {
        id: 'sec-' + Date.now(),
        title: title,
        shortName: shortName,
        icon: icon,
        description: desc,
        isDefault: false
      };
      this.sections.push(newSec);
      this.saveSections();
      this.showToast(`Created workspace "${title}"`, 'success');
      this.switchWorkspace(newSec.id);
    }

    this.closeWorkspaceModal();
    this.renderWorkspacesNav();
  }

  handleDeleteWorkspace() {
    const editId = this.workspaceEditId ? this.workspaceEditId.value : '';
    if (!editId) return;

    const sec = this.sections.find(s => s.id === editId);
    if (!sec || sec.isDefault) return;

    if (confirm(`Delete workspace "${sec.title}"? Any items inside will be safely moved to Courses.`)) {
      this.courses.forEach(c => {
        if (c.sectionId === editId) c.sectionId = 'courses';
      });
      this.tools.forEach(t => {
        if (t.sectionId === editId) t.sectionId = 'tools';
      });

      this.sections = this.sections.filter(s => s.id !== editId);
      this.saveSections();
      this.saveCourses();
      this.saveTools();

      this.closeWorkspaceModal();
      this.switchWorkspace('courses');
      this.showToast(`Workspace "${sec.title}" deleted.`, 'info');
    }
  }

  // ==========================================================================
  // 8. Universal Category Management
  // ==========================================================================

  openManageCategoriesModal() {
    this.renderManageCategoriesList();
    if (this.manageCategoriesModalOverlay) this.manageCategoriesModalOverlay.classList.remove('hidden');
  }

  closeManageCategoriesModal() {
    if (this.manageCategoriesModalOverlay) this.manageCategoriesModalOverlay.classList.add('hidden');
    this.renderCategoryChannels();
  }

  renderManageCategoriesList() {
    if (!this.manageCategoriesList) return;
    this.manageCategoriesList.innerHTML = '';

    this.categories.forEach(cat => {
      const count = this.courses.filter(c => c.category === cat.name).length;
      const row = document.createElement('div');
      row.className = 'category-manage-row';

      row.innerHTML = `
        <div class="cat-row-left">
          <span class="cat-row-color" style="background-color: ${cat.color};"></span>
          <span class="cat-row-name">${escapeHtml(cat.name)}</span>
          <span class="cat-row-count">${count} items</span>
        </div>
        <div class="cat-row-actions">
          <button type="button" class="cat-action-btn edit-cat" title="Rename Category" aria-label="Rename Category">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button type="button" class="cat-action-btn delete-cat" title="Delete Category" aria-label="Delete Category">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      const editBtn = row.querySelector('.edit-cat');
      editBtn.addEventListener('click', () => {
        const nameSpan = row.querySelector('.cat-row-name');
        const actionsDiv = row.querySelector('.cat-row-actions');
        const currentName = cat.name;

        // Toggle row into inline edit mode
        nameSpan.innerHTML = `<input type="text" class="cat-inline-edit-input" value="${escapeHtml(currentName)}" />`;
        const input = nameSpan.querySelector('input');
        input.focus();
        input.select();

        actionsDiv.innerHTML = `
          <button type="button" class="cat-action-btn save-edit-cat" title="Save Rename" aria-label="Save Rename" style="color: var(--accent-gold);">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button type="button" class="cat-action-btn cancel-edit-cat" title="Cancel" aria-label="Cancel">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        `;

        const doSave = () => {
          const newName = input.value.trim();
          if (!newName) {
            this.showToast('Category name cannot be empty.', 'warning');
            return;
          }
          if (newName === currentName) {
            this.renderManageCategoriesList();
            return;
          }
          if (this.categories.some(c => c.id !== cat.id && c.name.toLowerCase() === newName.toLowerCase())) {
            this.showToast(`Category "${newName}" already exists.`, 'warning');
            return;
          }

          const oldName = cat.name;
          cat.name = newName;

          // Cascade to courses
          this.courses.forEach(c => {
            if (c.category === oldName) c.category = newName;
          });

          // Cascade to tools
          this.tools.forEach(t => {
            if (t.category === oldName) t.category = newName;
          });

          if (this.activeCategoryFilter === oldName) {
            this.activeCategoryFilter = newName;
          }

          this.saveCategories();
          this.saveCourses();
          this.saveTools();
          this.populateCategoryDropdown();
          this.renderManageCategoriesList();
          this.render();
          this.showToast(`Category renamed to "${newName}"`, 'success');
        };

        const saveBtn = actionsDiv.querySelector('.save-edit-cat');
        const cancelBtn = actionsDiv.querySelector('.cancel-edit-cat');

        saveBtn.addEventListener('click', doSave);
        cancelBtn.addEventListener('click', () => {
          this.renderManageCategoriesList();
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            doSave();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            this.renderManageCategoriesList();
          }
        });
      });

      const delBtn = row.querySelector('.delete-cat');
      delBtn.addEventListener('click', () => {
        if (this.categories.length <= 1) {
          this.showToast('At least one category is required.', 'warning');
          return;
        }
        if (confirm(`Delete category "${cat.name}"? Items in it will move to General.`)) {
          this.courses.forEach(c => {
            if (c.category === cat.name) c.category = 'General';
          });
          this.tools.forEach(t => {
            if (t.category === cat.name) t.category = 'General';
          });
          this.categories = this.categories.filter(c => c.id !== cat.id);
          this.saveCategories();
          this.saveCourses();
          this.saveTools();
          this.populateCategoryDropdown();
          this.renderManageCategoriesList();
          this.render();
          this.showToast(`Deleted category "${cat.name}"`, 'info');
        }
      });

      this.manageCategoriesList.appendChild(row);
    });
  }

  handleInlineCategorySubmit(e) {
    e.preventDefault();
    const name = this.manageNewCatName ? this.manageNewCatName.value.trim() : '';
    const color = this.manageNewCatColor ? this.manageNewCatColor.value : '#D4AF37';

    if (!name) return;
    if (this.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      this.showToast('Category name already exists.', 'warning');
      return;
    }

    const newCat = {
      id: 'cat-' + Date.now(),
      name: name,
      color: color,
      sectionId: this.activeSectionId || 'courses'
    };

    this.categories.push(newCat);
    this.saveCategories();
    if (this.manageNewCatName) this.manageNewCatName.value = '';
    this.renderManageCategoriesList();
    this.render();
    this.showToast(`Added category "${name}"`, 'success');
  }

  populateSectionDropdowns(selectedSectionId = 'courses') {
    if (this.courseSectionSelect) {
      this.courseSectionSelect.innerHTML = '';
      this.sections.forEach(sec => {
        const opt = document.createElement('option');
        opt.value = sec.id;
        opt.textContent = `${sec.title} (${sec.shortName})`;
        if (sec.id === selectedSectionId) opt.selected = true;
        this.courseSectionSelect.appendChild(opt);
      });
    }

    if (this.toolSectionSelect) {
      this.toolSectionSelect.innerHTML = '';
      this.sections.forEach(sec => {
        const opt = document.createElement('option');
        opt.value = sec.id;
        opt.textContent = `${sec.title} (${sec.shortName})`;
        if (sec.id === (selectedSectionId || 'tools')) opt.selected = true;
        this.toolSectionSelect.appendChild(opt);
      });
    }
  }

  populateCategoryDropdown(targetSectionId = null) {
    if (!this.courseCategorySelect) return;
    const secId = targetSectionId || (this.courseSectionSelect ? this.courseSectionSelect.value : this.activeSectionId) || 'courses';
    this.courseCategorySelect.innerHTML = '';

    const scoped = this.getWorkspaceScopedCategories(secId);
    const scopedNames = new Set(scoped.map(c => c.name));

    scoped.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = cat.name;
      this.courseCategorySelect.appendChild(opt);
    });

    const others = this.categories.filter(c => !scopedNames.has(c.name));
    if (others.length > 0) {
      const group = document.createElement('optgroup');
      group.label = 'Other Categories';
      others.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.name;
        opt.textContent = cat.name;
        group.appendChild(opt);
      });
      this.courseCategorySelect.appendChild(group);
    }
  }

  openCategoryModal() {
    if (this.categoryForm) this.categoryForm.reset();
    if (this.catNameErrorMsg) this.catNameErrorMsg.classList.add('hidden');
    if (this.categoryModalOverlay) this.categoryModalOverlay.classList.remove('hidden');
    setTimeout(() => {
      if (this.newCategoryNameInput) this.newCategoryNameInput.focus();
    }, 100);
  }

  closeCategoryModal() {
    if (this.categoryModalOverlay) this.categoryModalOverlay.classList.add('hidden');
  }

  handleCategorySubmit(e) {
    e.preventDefault();
    const name = this.newCategoryNameInput.value.trim();
    if (!name) return;

    const exists = this.categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      if (this.catNameErrorMsg) this.catNameErrorMsg.classList.remove('hidden');
      return;
    }

    const colorRadio = this.categoryForm.querySelector('input[name="catColor"]:checked');
    const color = colorRadio ? colorRadio.value : '#D4AF37';

    const newCategory = {
      id: 'cat-' + Date.now(),
      name: name,
      color: color,
      sectionId: this.activeSectionId || 'courses'
    };

    this.categories.push(newCategory);
    this.saveCategories();
    this.populateCategoryDropdown();
    if (this.courseCategorySelect) this.courseCategorySelect.value = name;
    this.closeCategoryModal();
    this.render();
    this.showToast(`Category "${name}" created!`, 'success');
  }

  // ==========================================================================
  // 9. Course & Item CRUD Operations
  // ==========================================================================

  checkLiveDuplicate() {
    const rawUrl = this.courseUrlInput.value.trim();
    const editId = this.courseEditId.value || null;

    if (!rawUrl) {
      this.duplicateWarningAlert.classList.add('hidden');
      return null;
    }

    const duplicate = this.findDuplicateCourse(rawUrl, editId);
    if (duplicate) {
      this.duplicateWarningText.innerHTML = `This course is already in CourseVault as: <br><strong>"${escapeHtml(duplicate.title)}"</strong> in category <strong>${escapeHtml(duplicate.category)}</strong>.`;
      this.duplicateWarningAlert.classList.remove('hidden');
      return duplicate;
    } else {
      this.duplicateWarningAlert.classList.add('hidden');
      return null;
    }
  }

  updateThumbnailPreview() {
    if (!this.thumbPreviewImg || !this.thumbPreviewFallback) return;

    const rawUrl = this.courseUrlInput.value.trim();
    const customThumb = this.courseThumbnailInput ? this.courseThumbnailInput.value.trim() : '';
    const videoId = this.extractYouTubeVideoId(rawUrl);
    const playlistId = this.extractYouTubePlaylistId(rawUrl);
    const domain = this.extractDomain(rawUrl);

    if (this.clearCustomCoverBtn) {
      if (customThumb) this.clearCustomCoverBtn.classList.remove('hidden');
      else this.clearCustomCoverBtn.classList.add('hidden');
    }

    // 1. Priority 1: Custom Cover Image URL or Base64
    if (customThumb) {
      this.thumbPreviewImg.src = customThumb;
      this.thumbPreviewImg.classList.remove('hidden');
      this.thumbPreviewFallback.classList.add('hidden');
      if (this.thumbPreviewStatus) {
        const isDeviceUpload = customThumb.startsWith('data:image/');
        this.thumbPreviewStatus.textContent = isDeviceUpload ? 'Device Image Attached' : 'Custom Cover URL Active';
        this.thumbPreviewStatus.style.color = '#E5C578';
      }
      this.thumbPreviewImg.onerror = () => {
        this.thumbPreviewImg.classList.add('hidden');
        this.thumbPreviewFallback.classList.remove('hidden');
        if (this.thumbPreviewText) this.thumbPreviewText.textContent = 'Invalid custom image URL or failed to load';
        if (this.thumbPreviewStatus) {
          this.thumbPreviewStatus.textContent = 'Image Load Error';
          this.thumbPreviewStatus.style.color = '#ef4444';
        }
      };
      return;
    }

    // 2. Priority 2: Auto YouTube Video Thumbnail (hqdefault.jpg with fallback)
    if (videoId) {
      const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      this.thumbPreviewImg.src = hqUrl;
      this.thumbPreviewImg.classList.remove('hidden');
      this.thumbPreviewFallback.classList.add('hidden');
      if (this.thumbPreviewStatus) {
        this.thumbPreviewStatus.textContent = playlistId ? 'Auto Video Thumbnail (Video + Playlist)' : 'Auto YouTube Preview (hqdefault.jpg)';
        this.thumbPreviewStatus.style.color = '#D4AF37';
      }

      this.thumbPreviewImg.onerror = () => {
        if (this.thumbPreviewImg.src.includes('hqdefault.jpg')) {
          this.thumbPreviewImg.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        } else {
          const fallbackCover = this.generatePlaylistCoverSvg(this.courseTitleInput ? this.courseTitleInput.value : '', 'Video');
          this.thumbPreviewImg.src = fallbackCover;
        }
      };
      return;
    }

    // 3. Priority 3: YouTube Playlist Without Video ID
    if (playlistId) {
      const title = this.courseTitleInput ? this.courseTitleInput.value.trim() : 'YouTube Playlist';
      const cat = this.courseCategorySelect ? this.courseCategorySelect.value : 'Playlist';
      const playlistCover = this.generatePlaylistCoverSvg(title, cat);
      this.thumbPreviewImg.src = playlistCover;
      this.thumbPreviewImg.classList.remove('hidden');
      this.thumbPreviewFallback.classList.add('hidden');
      if (this.thumbPreviewStatus) {
        this.thumbPreviewStatus.textContent = 'Auto Playlist Cover Active';
        this.thumbPreviewStatus.style.color = '#D4AF37';
      }
      return;
    }

    // 4. Priority 4: Standard Website link (Favicon / Monogram)
    if (domain) {
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
      this.thumbPreviewImg.src = faviconUrl;
      this.thumbPreviewImg.classList.remove('hidden');
      this.thumbPreviewFallback.classList.add('hidden');
      if (this.thumbPreviewStatus) {
        this.thumbPreviewStatus.textContent = `Web Favicon (${domain})`;
        this.thumbPreviewStatus.style.color = '#38bdf8';
      }
      this.thumbPreviewImg.onerror = () => {
        this.thumbPreviewImg.classList.add('hidden');
        this.thumbPreviewFallback.classList.remove('hidden');
        if (this.thumbPreviewText) this.thumbPreviewText.textContent = domain;
      };
      return;
    }

    // Default: Awaiting URL
    this.thumbPreviewImg.classList.add('hidden');
    this.thumbPreviewFallback.classList.remove('hidden');
    if (this.thumbPreviewText) this.thumbPreviewText.textContent = 'Thumbnail auto-generates from YouTube, Favicon, or Custom Image';
    if (this.thumbPreviewStatus) {
      this.thumbPreviewStatus.textContent = 'Awaiting URL...';
      this.thumbPreviewStatus.style.color = 'var(--text-muted)';
    }
  }

  handleCourseSubmit(e) {
    e.preventDefault();

    const title = this.courseTitleInput.value.trim();
    const rawUrl = this.courseUrlInput.value.trim();
    const sectionId = this.courseSectionSelect ? this.courseSectionSelect.value : (this.activeSectionId || 'courses');
    const category = this.courseCategorySelect.value;
    const notes = this.courseNotesInput.value.trim();
    const customThumbnail = this.courseThumbnailInput ? this.courseThumbnailInput.value.trim() : '';
    const statusRadio = this.courseForm.querySelector('input[name="courseStatus"]:checked');
    const status = statusRadio ? statusRadio.value : 'Want to Learn';
    const editId = this.courseEditId.value;

    if (!title) {
      this.showToast('Please enter a course or item title.', 'warning');
      this.courseTitleInput.focus();
      return;
    }

    if (!rawUrl) {
      this.showToast('Please enter a valid URL.', 'warning');
      this.courseUrlInput.focus();
      return;
    }

    const duplicate = this.findDuplicateCourse(rawUrl, editId);
    if (duplicate) {
      this.duplicateWarningAlert.classList.remove('hidden');
      this.duplicateWarningText.innerHTML = `<strong>Blocked:</strong> Duplicate link! Already saved as "${escapeHtml(duplicate.title)}" in [${escapeHtml(duplicate.category)}].`;
      this.showToast('Duplicate link found! Save blocked.', 'danger');
      return;
    }

    const videoId = this.extractYouTubeVideoId(rawUrl);
    const playlistId = this.extractYouTubePlaylistId(rawUrl);
    const { normalized } = this.normalizeUrl(rawUrl);

    let thumbnailUrl = customThumbnail;
    if (!thumbnailUrl && videoId) {
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else if (!thumbnailUrl && playlistId) {
      thumbnailUrl = this.generatePlaylistCoverSvg(title, category);
    }

    if (editId) {
      const course = this.courses.find(c => c.id === editId);
      if (course) {
        course.sectionId = sectionId;
        course.title = title;
        course.url = rawUrl;
        course.normalizedUrl = normalized;
        course.videoId = videoId;
        course.playlistId = playlistId;
        course.thumbnailUrl = thumbnailUrl;
        course.customThumbnailUrl = customThumbnail;
        course.category = category;
        course.status = status;
        course.notes = notes;
        course.lectures = this.activeEditingLectures || course.lectures || [];
        this.showToast(`Updated "${title}"!`, 'success');
      }
    } else {
      const newCourse = {
        id: 'course-' + Date.now(),
        sectionId: sectionId,
        title: title,
        url: rawUrl,
        normalizedUrl: normalized,
        videoId: videoId,
        playlistId: playlistId,
        thumbnailUrl: thumbnailUrl,
        customThumbnailUrl: customThumbnail,
        category: category,
        status: status,
        notes: notes,
        lectures: this.activeEditingLectures || [],
        createdAt: new Date().toISOString()
      };
      this.courses.unshift(newCourse);
      this.showToast(`Saved "${title}" to CourseVault`, 'success');
    }

    this.saveCourses();
    this.closeCourseModal();

    // If item was placed in a different workspace, switch to it
    if (sectionId !== this.activeSectionId) {
      this.switchWorkspace(sectionId);
    } else {
      this.render();
    }
  }

  updateCourseStatus(courseId, newStatus) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    course.status = newStatus;
    this.saveCourses();
    this.render();
    this.showToast(`Status updated to "${newStatus}"`, 'info');
  }

  confirmDeleteItem(type, id, title) {
    this.itemToDelete = { type, id, title };
    this.courseToDeleteId = (type === 'course') ? id : null;
    if (this.deleteItemTitle) this.deleteItemTitle.textContent = `"${title}"`;
    if (this.deleteModalTitle) {
      this.deleteModalTitle.textContent = type === 'tool' ? 'Delete Web Tool?' : 'Delete Item?';
    }
    if (this.deleteConfirmModal) this.deleteConfirmModal.classList.remove('hidden');
  }

  confirmDelete(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    this.confirmDeleteItem('course', course.id, course.title);
  }

  confirmDeleteTool(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) return;
    this.confirmDeleteItem('tool', tool.id, tool.name);
  }

  closeDeleteModal() {
    this.itemToDelete = null;
    this.courseToDeleteId = null;
    if (this.deleteConfirmModal) this.deleteConfirmModal.classList.add('hidden');
  }

  handleConfirmDelete() {
    if (!this.itemToDelete && !this.courseToDeleteId) return;
    const item = this.itemToDelete || { type: 'course', id: this.courseToDeleteId };

    if (item.type === 'tool') {
      const idx = this.tools.findIndex(t => t.id === item.id);
      if (idx !== -1) {
        const removed = this.tools.splice(idx, 1)[0];
        this.saveTools();
        this.renderTools();
        this.renderCounts();
        this.showToast(`Deleted tool "${removed.name}"`, 'info');
      }
    } else {
      const idx = this.courses.findIndex(c => c.id === item.id);
      if (idx !== -1) {
        const removed = this.courses.splice(idx, 1)[0];
        this.saveCourses();
        this.render();
        this.showToast(`Deleted "${removed.title}"`, 'info');
      }
    }
    this.closeDeleteModal();
  }

  openCourseModal(editCourse = null) {
    this.populateSectionDropdowns(editCourse ? editCourse.sectionId : this.activeSectionId);
    this.populateCategoryDropdown();
    this.duplicateWarningAlert.classList.add('hidden');

    this.activeEditingCourseId = editCourse ? editCourse.id : null;
    this.activeEditingLectures = (editCourse && Array.isArray(editCourse.lectures))
      ? JSON.parse(JSON.stringify(editCourse.lectures))
      : [];
    this.updateLectureBadge();

    if (this.courseLecturesGroup) {
      this.courseLecturesGroup.classList.remove('hidden');
      this.courseLecturesGroup.style.display = 'block';
    }

    const submitBtn = document.getElementById('saveCourseSubmitBtn');

    if (editCourse) {
      this.courseModalTitle.textContent = 'Edit Item & Cover';
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Save Changes</span>
        `;
      }
      this.courseEditId.value = editCourse.id;
      if (this.courseSectionSelect) this.courseSectionSelect.value = editCourse.sectionId || 'courses';
      this.courseTitleInput.value = editCourse.title;
      this.courseUrlInput.value = editCourse.url;
      this.courseCategorySelect.value = editCourse.category;
      this.courseNotesInput.value = editCourse.notes || '';
      if (this.courseThumbnailInput) {
        this.courseThumbnailInput.value = editCourse.customThumbnailUrl || '';
      }
      if (this.courseCoverFileInput) {
        this.courseCoverFileInput.value = '';
      }

      const existingThumb = (editCourse.customThumbnailUrl || '').trim();
      if (existingThumb.startsWith('data:image/')) {
        if (this.fileBadgeText) this.fileBadgeText.textContent = 'Device image currently attached';
        if (this.fileBadgeInfo) this.fileBadgeInfo.classList.remove('hidden');
        if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Replace Image from Device';
      } else {
        if (this.fileBadgeInfo) this.fileBadgeInfo.classList.add('hidden');
        if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
      }

      const radio = this.courseForm.querySelector(`input[name="courseStatus"][value="${editCourse.status}"]`);
      if (radio) radio.checked = true;
    } else {
      this.courseModalTitle.textContent = 'Save Item to Vault';
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          <span>Save Item</span>
        `;
      }
      this.courseEditId.value = '';
      this.courseForm.reset();
      if (this.courseSectionSelect) this.courseSectionSelect.value = this.activeSectionId || 'courses';
      if (this.courseThumbnailInput) this.courseThumbnailInput.value = '';
      if (this.courseCoverFileInput) this.courseCoverFileInput.value = '';
      if (this.fileBadgeInfo) this.fileBadgeInfo.classList.add('hidden');
      if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';

      if (this.activeCategoryFilter !== 'all') {
        this.courseCategorySelect.value = this.activeCategoryFilter;
      }
    }

    this.updateThumbnailPreview();
    this.courseModalOverlay.classList.remove('hidden');
    setTimeout(() => {
      if (editCourse) this.courseTitleInput.focus();
      else this.courseUrlInput.focus();
    }, 100);
  }

  closeCourseModal() {
    this.courseModalOverlay.classList.add('hidden');
    this.duplicateWarningAlert.classList.add('hidden');
    if (this.courseCoverFileInput) this.courseCoverFileInput.value = '';
    if (this.fileBadgeInfo) this.fileBadgeInfo.classList.add('hidden');
    if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
  }

  clearUploadedFileCover() {
    if (this.courseCoverFileInput) this.courseCoverFileInput.value = '';
    if (this.fileBadgeInfo) this.fileBadgeInfo.classList.add('hidden');
    if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
  }

  // ==========================================================================
  // Dedicated Course Curriculum & Lecture Management Modal
  // ==========================================================================

  updateLectureBadge() {
    if (!this.lectureCountBadge) return;
    const count = this.activeEditingLectures ? this.activeEditingLectures.length : 0;
    this.lectureCountBadge.textContent = `${count} lecture${count === 1 ? '' : 's'}`;
  }

  openLectureModal() {
    if (!this.activeEditingLectures) this.activeEditingLectures = [];
    const course = this.activeEditingCourseId ? this.courses.find(c => c.id === this.activeEditingCourseId) : null;
    if (this.lectureModalTitle) {
      this.lectureModalTitle.textContent = course ? `Manage Lectures: ${course.title}` : 'Manage Lectures & Curriculum';
    }
    this.renderLectureModalList();
    if (this.lectureModalOverlay) this.lectureModalOverlay.classList.remove('hidden');
  }

  closeLectureModal() {
    if (this.lectureModalOverlay) this.lectureModalOverlay.classList.add('hidden');
    this.updateLectureBadge();
  }

  saveAndCloseLectureModal() {
    if (this.activeEditingCourseId) {
      const course = this.courses.find(c => c.id === this.activeEditingCourseId);
      if (course) {
        course.lectures = this.activeEditingLectures;
        this.saveCourses();
        this.render();
      }
    }
    this.updateLectureBadge();
    this.closeLectureModal();
    this.showToast('Curriculum & lectures updated!', 'success');
  }

  handleBatchGenerateLectures() {
    const input = this.batchLectureCountInput;
    const num = input ? parseInt(input.value, 10) : 0;
    if (!num || num <= 0 || num > 100) {
      this.showToast('Please enter a valid count between 1 and 100', 'warning');
      return;
    }
    const currentCount = this.activeEditingLectures.length;
    for (let i = 1; i <= num; i++) {
      const idx = currentCount + i;
      const pad = idx < 10 ? '0' + idx : '' + idx;
      this.activeEditingLectures.push({
        id: 'lec-' + Date.now() + '-' + i,
        title: `Lecture ${pad}`,
        linkUrl: '',
        notes: '',
        completed: false
      });
    }
    if (input) input.value = '';
    this.renderLectureModalList();
    this.updateLectureBadge();
    this.showToast(`Generated ${num} new lecture slots!`, 'success');
  }

  handleSingleLectureAdd(e) {
    if (e) e.preventDefault();
    const title = this.newLectureTitle ? this.newLectureTitle.value.trim() : '';
    const linkUrl = this.newLectureLink ? this.newLectureLink.value.trim() : '';
    const notes = this.newLectureNotes ? this.newLectureNotes.value.trim() : '';

    if (!title) {
      this.showToast('Please enter a lecture title', 'warning');
      return;
    }

    const newLec = {
      id: 'lec-' + Date.now(),
      title: title,
      linkUrl: linkUrl,
      notes: notes,
      completed: false
    };

    this.activeEditingLectures.push(newLec);
    if (this.lectureModalAddForm) this.lectureModalAddForm.reset();
    this.renderLectureModalList();
    this.updateLectureBadge();
    this.showToast(`Added "${title}"`, 'success');
  }

  renderLectureModalList() {
    if (!this.lectureModalList) return;
    this.lectureModalList.innerHTML = '';

    const lectures = this.activeEditingLectures || [];
    const doneCount = lectures.filter(l => l.completed).length;
    const pct = lectures.length > 0 ? Math.round((doneCount / lectures.length) * 100) : 0;

    if (this.lectureModalStats) {
      this.lectureModalStats.textContent = `${lectures.length} lecture${lectures.length === 1 ? '' : 's'} (${pct}% completed)`;
    }

    if (lectures.length === 0) {
      this.lectureModalList.innerHTML = `
        <div style="text-align: center; padding: 24px 12px; color: var(--text-muted); font-size: 0.85rem;">
          No lectures created yet. Use <strong>Batch Create</strong> above or add a lecture below.
        </div>
      `;
      return;
    }

    lectures.forEach((lec, idx) => {
      const card = document.createElement('div');
      card.className = `lecture-manage-card ${lec.completed ? 'completed' : ''}`;
      card.dataset.lectureId = lec.id;

      card.innerHTML = `
        <input type="checkbox" class="lecture-card-checkbox" ${lec.completed ? 'checked' : ''} title="Mark completed" />
        <div class="lecture-card-content">
          <input type="text" class="lecture-title-edit-input" value="${escapeHtml(lec.title)}" placeholder="Lecture title..." />
          <div class="lecture-meta-inputs-row">
            <input type="url" class="form-input form-input-xs lecture-link-edit" value="${escapeHtml(lec.linkUrl || '')}" placeholder="Companion URL (GitHub, slides)..." />
            <input type="text" class="form-input form-input-xs lecture-notes-edit" value="${escapeHtml(lec.notes || '')}" placeholder="Notes / topics..." />
            ${lec.linkUrl ? `<a href="${escapeHtml(lec.linkUrl)}" target="_blank" rel="noopener noreferrer" class="cat-action-btn" title="Open companion link" style="color: var(--accent-gold);"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : ''}
          </div>
        </div>
        <button type="button" class="lecture-delete-action-btn" title="Delete lecture">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      // Checkbox toggle
      const cb = card.querySelector('.lecture-card-checkbox');
      cb.addEventListener('change', () => {
        lec.completed = cb.checked;
        card.classList.toggle('completed', cb.checked);
        const newDone = lectures.filter(l => l.completed).length;
        const newPct = Math.round((newDone / lectures.length) * 100);
        if (this.lectureModalStats) {
          this.lectureModalStats.textContent = `${lectures.length} lecture${lectures.length === 1 ? '' : 's'} (${newPct}% completed)`;
        }
      });

      // Title edit
      const titleInput = card.querySelector('.lecture-title-edit-input');
      titleInput.addEventListener('input', () => {
        lec.title = titleInput.value;
      });

      // Link edit
      const linkInput = card.querySelector('.lecture-link-edit');
      linkInput.addEventListener('input', () => {
        lec.linkUrl = linkInput.value.trim();
      });

      // Notes edit
      const notesInput = card.querySelector('.lecture-notes-edit');
      notesInput.addEventListener('input', () => {
        lec.notes = notesInput.value.trim();
      });

      // Delete lecture
      const delBtn = card.querySelector('.lecture-delete-action-btn');
      delBtn.addEventListener('click', () => {
        this.activeEditingLectures = this.activeEditingLectures.filter(l => l.id !== lec.id);
        this.renderLectureModalList();
        this.updateLectureBadge();
      });

      this.lectureModalList.appendChild(card);
    });
  }

  // ==========================================================================
  // 10. Tools & Web Utilities CRUD
  // ==========================================================================

  openToolModal(editTool = null) {
    this.populateSectionDropdowns(editTool ? editTool.sectionId : 'tools');

    if (editTool) {
      if (this.toolModalTitle) this.toolModalTitle.textContent = 'Edit Web Tool';
      if (this.saveToolBtnText) this.saveToolBtnText.textContent = 'Save Changes';
      if (this.toolEditId) this.toolEditId.value = editTool.id;
      if (this.toolSectionSelect) this.toolSectionSelect.value = editTool.sectionId || 'tools';
      if (this.toolNameInput) this.toolNameInput.value = editTool.name;
      if (this.toolUrlInput) this.toolUrlInput.value = editTool.url;
      if (this.toolCategoryInput) this.toolCategoryInput.value = editTool.category || 'Utility';
      if (this.toolDescriptionInput) this.toolDescriptionInput.value = editTool.description || '';
    } else {
      if (this.toolModalTitle) this.toolModalTitle.textContent = 'Add Web Tool / Utility';
      if (this.saveToolBtnText) this.saveToolBtnText.textContent = 'Save Tool';
      if (this.toolEditId) this.toolEditId.value = '';
      if (this.toolForm) this.toolForm.reset();
      if (this.toolSectionSelect) this.toolSectionSelect.value = 'tools';
      if (this.toolCategoryInput && this.activeToolCategory !== 'all') {
        this.toolCategoryInput.value = this.activeToolCategory;
      }
    }
    if (this.toolModalOverlay) this.toolModalOverlay.classList.remove('hidden');
    setTimeout(() => {
      if (this.toolNameInput) this.toolNameInput.focus();
    }, 100);
  }

  closeToolModal() {
    if (this.toolModalOverlay) this.toolModalOverlay.classList.add('hidden');
    if (this.toolForm) this.toolForm.reset();
  }

  handleToolSubmit(e) {
    e.preventDefault();
    const name = this.toolNameInput ? this.toolNameInput.value.trim() : '';
    let url = this.toolUrlInput ? this.toolUrlInput.value.trim() : '';
    const sectionId = this.toolSectionSelect ? this.toolSectionSelect.value : 'tools';
    const category = (this.toolCategoryInput ? this.toolCategoryInput.value.trim() : '') || 'Utility';
    const description = this.toolDescriptionInput ? this.toolDescriptionInput.value.trim() : '';
    const editId = this.toolEditId ? this.toolEditId.value : '';

    if (!name || !url) {
      this.showToast('Please provide both Tool Name and URL.', 'warning');
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    if (editId) {
      const tool = this.tools.find(t => t.id === editId);
      if (tool) {
        tool.sectionId = sectionId;
        tool.name = name;
        tool.url = url;
        tool.category = category;
        tool.description = description;
        this.saveTools();
        this.showToast(`Updated "${name}"`, 'success');
      }
    } else {
      const newTool = {
        id: 'tool-' + Date.now(),
        sectionId: sectionId,
        name: name,
        url: url,
        category: category,
        description: description,
        createdAt: new Date().toISOString()
      };
      this.tools.unshift(newTool);
      this.saveTools();
      this.showToast(`Added "${name}" to Tools`, 'success');
    }

    this.closeToolModal();
    if (sectionId === 'tools') {
      this.renderTools();
    }
    this.renderCounts();
  }

  renderTools() {
    if (!this.toolsGrid) return;
    let filtered = [...this.tools];

    if (this.activeToolCategory !== 'all') {
      filtered = filtered.filter(t => (t.category || '').toLowerCase() === this.activeToolCategory.toLowerCase());
    }

    if (this.searchQuery) {
      filtered = filtered.filter(t => {
        const nameMatch = (t.name || '').toLowerCase().includes(this.searchQuery);
        const catMatch = (t.category || '').toLowerCase().includes(this.searchQuery);
        const descMatch = (t.description || '').toLowerCase().includes(this.searchQuery);
        const urlMatch = (t.url || '').toLowerCase().includes(this.searchQuery);
        return nameMatch || catMatch || descMatch || urlMatch;
      });
    }

    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    if (this.toolsCountTag) {
      this.toolsCountTag.textContent = `${filtered.length} ${filtered.length === 1 ? 'tool' : 'tools'}`;
    }

    if (filtered.length === 0) {
      this.toolsGrid.innerHTML = '';
      if (this.toolsEmptyState) {
        this.toolsEmptyState.classList.remove('hidden');
        if (this.toolsEmptyDescription) {
          if (this.searchQuery) {
            if (this.toolsEmptyTitle) this.toolsEmptyTitle.textContent = 'No Tools Found';
            this.toolsEmptyDescription.textContent = `No tools found matching "${this.searchQuery}".`;
            if (this.toolsResetFilterBtn) this.toolsResetFilterBtn.classList.remove('hidden');
          } else if (this.activeToolCategory !== 'all') {
            if (this.toolsEmptyTitle) this.toolsEmptyTitle.textContent = 'No Tools Found';
            this.toolsEmptyDescription.textContent = `No tools in category "${this.activeToolCategory}".`;
            if (this.toolsResetFilterBtn) this.toolsResetFilterBtn.classList.remove('hidden');
          } else {
            if (this.toolsEmptyTitle) this.toolsEmptyTitle.textContent = 'No Web Tools Saved Yet';
            this.toolsEmptyDescription.textContent = "No web tools saved yet. Tap '+ Add Tool' to get started!";
            if (this.toolsResetFilterBtn) this.toolsResetFilterBtn.classList.add('hidden');
          }
        }
      }
      return;
    }

    if (this.toolsEmptyState) this.toolsEmptyState.classList.add('hidden');
    this.toolsGrid.innerHTML = '';

    filtered.forEach(tool => {
      const card = this.createToolCardElement(tool);
      this.toolsGrid.appendChild(card);
    });
  }

  createToolCardElement(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.id = tool.id;

    let domain = this.extractDomain(tool.url) || tool.url;
    const initials = (tool.name || 'WT').substring(0, 2).toUpperCase();
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128` : '';

    card.innerHTML = `
      <div class="tool-card-header">
        <div class="tool-avatar-wrap">
          ${faviconUrl ? `<img class="tool-avatar-img" src="${escapeHtml(faviconUrl)}" alt="${escapeHtml(tool.name)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');">` : ''}
          <div class="tool-avatar-fallback ${faviconUrl ? 'hidden' : ''}">
            ${escapeHtml(initials)}
          </div>
        </div>
        <div class="tool-card-meta">
          <h3 class="tool-card-title" title="${escapeHtml(tool.name)}">${escapeHtml(tool.name)}</h3>
          <div class="tool-card-domain">${escapeHtml(domain)}</div>
          <span class="tool-category-badge">${escapeHtml(tool.category || 'Utility')}</span>
        </div>
      </div>

      <p class="tool-description">${escapeHtml(tool.description || 'Quick online tool & web utility.')}</p>

      <div class="tool-card-footer">
        <a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener noreferrer" class="btn-tool-launch">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Open Tool</span>
        </a>

        <div class="tool-actions-group">
          <button class="tool-icon-btn btn-edit" title="Edit tool" aria-label="Edit tool">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="tool-icon-btn btn-delete" title="Delete tool" aria-label="Delete tool">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;

    const editBtn = card.querySelector('.btn-edit');
    if (editBtn) editBtn.addEventListener('click', () => this.openToolModal(tool));

    const deleteBtn = card.querySelector('.btn-delete');
    if (deleteBtn) deleteBtn.addEventListener('click', () => this.confirmDeleteTool(tool.id));

    return card;
  }

  // ==========================================================================
  // 11. Rendering & Filtering Engine
  // ==========================================================================

  render() {
    this.renderWorkspacesNav();
    this.renderCategoryChannels();
    this.renderCounts();
    if (this.activeSectionId === 'tools') {
      this.renderTools();
    } else {
      this.renderCourses();
    }
  }

  getWorkspaceScopedCategories(targetSectionId = null) {
    const activeSecId = targetSectionId || this.activeSectionId || 'courses';

    let activeItems = [];
    if (activeSecId === 'tools') {
      activeItems = this.tools;
    } else {
      activeItems = this.courses.filter(c => (c.sectionId || 'courses') === activeSecId);
    }

    const usedCategoryNames = new Set(
      activeItems
        .map(i => i.category)
        .filter(Boolean)
    );

    return this.categories.filter(cat => {
      // 1. Used by at least one item in this workspace
      if (usedCategoryNames.has(cat.name)) return true;

      // 2. Explicitly associated with this workspace
      if (cat.sectionId && cat.sectionId === activeSecId) return true;

      // 3. For default 'courses' workspace, also include default categories with no sectionId
      if (activeSecId === 'courses' && (!cat.sectionId || cat.sectionId === 'courses')) {
        return true;
      }

      return false;
    });
  }

  renderCategoryChannels() {
    if (!this.categoryChannelsList) return;
    this.categoryChannelsList.innerHTML = '';

    const isTools = this.activeSectionId === 'tools';
    const activeItems = isTools 
      ? this.tools 
      : this.courses.filter(c => (c.sectionId || 'courses') === this.activeSectionId);
    const scopedCats = this.getWorkspaceScopedCategories();

    if (scopedCats.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'sidebar-empty-categories';
      emptyDiv.innerHTML = `
        <span class="empty-cat-text">No categories in workspace</span>
        <button type="button" class="empty-cat-add-btn" title="Add category to this workspace">+ Add</button>
      `;
      const addBtn = emptyDiv.querySelector('.empty-cat-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.closeDrawer();
          this.openCategoryModal();
        });
      }
      this.categoryChannelsList.appendChild(emptyDiv);
    } else {
      scopedCats.forEach(cat => {
        const count = activeItems.filter(c => c.category === cat.name).length;
        const isActive = this.activeCategoryFilter === cat.name;

        const btn = document.createElement('button');
        btn.className = `cat-channel-item ${isActive ? 'active' : ''}`;
        btn.dataset.category = cat.name;
        btn.style.setProperty('--cat-accent', cat.color || '#D4AF37');

        btn.innerHTML = `
          <span class="cat-bullet"></span>
          <span class="channel-name">${escapeHtml(cat.name)}</span>
          <span class="badge">${count}</span>
        `;

        btn.addEventListener('click', () => {
          if (this.activeCategoryFilter === cat.name) {
            this.activeCategoryFilter = 'all';
          } else {
            this.activeCategoryFilter = cat.name;
          }
          if (isTools) {
            this.activeToolCategory = this.activeCategoryFilter;
            this.renderTools();
          } else {
            this.renderCourses();
          }
          this.renderCategoryChannels();
          this.closeDrawer();
        });

        this.categoryChannelsList.appendChild(btn);
      });
    }

    // Handle All filter click
    const allCoursesBtn = document.querySelector('.channel-item[data-category="all"]');
    if (allCoursesBtn) {
      allCoursesBtn.classList.toggle('active', this.activeCategoryFilter === 'all' && this.activeStatusFilter === 'all');
    }

    document.querySelectorAll('.channel-item[data-status-filter]').forEach(item => {
      item.classList.toggle('active', this.activeStatusFilter === item.dataset.statusFilter);
      item.onclick = () => {
        this.activeStatusFilter = item.dataset.statusFilter;
        if (this.statusTabsContainer) {
          this.statusTabsContainer.querySelectorAll('.status-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tabStatus === this.activeStatusFilter);
          });
        }
        this.renderCourses();
        this.closeDrawer();
      };
    });
  }

  renderCounts() {
    const secCourses = this.courses.filter(c => (c.sectionId || 'courses') === this.activeSectionId);
    const total = secCourses.length;
    const wantCount = secCourses.filter(c => c.status === 'Want to Learn').length;
    const progressCount = secCourses.filter(c => c.status === 'In Progress').length;
    const completedCount = secCourses.filter(c => c.status === 'Completed').length;

    if (this.countAll) this.countAll.textContent = total;
    if (this.countWant) this.countWant.textContent = wantCount;
    if (this.countProgress) this.countProgress.textContent = progressCount;
    if (this.countCompleted) this.countCompleted.textContent = completedCount;
    if (this.countTools) this.countTools.textContent = this.tools.length;
  }

  renderCourses() {
    if (!this.coursesGrid) return;

    // Filter by Active Workspace Section
    let filtered = this.courses.filter(c => (c.sectionId || 'courses') === this.activeSectionId);

    // Filter by Category
    if (this.activeCategoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === this.activeCategoryFilter);
      if (this.activeCategoryTitle) this.activeCategoryTitle.textContent = this.activeCategoryFilter;
    } else {
      const curSection = this.sections.find(s => s.id === this.activeSectionId) || this.sections[0];
      if (this.activeCategoryTitle) this.activeCategoryTitle.textContent = curSection.title;
    }

    // Filter by Status Tab
    if (this.activeStatusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === this.activeStatusFilter);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(c => {
        const titleMatch = c.title.toLowerCase().includes(this.searchQuery);
        const catMatch = c.category.toLowerCase().includes(this.searchQuery);
        const notesMatch = c.notes && c.notes.toLowerCase().includes(this.searchQuery);
        const lecturesMatch = c.lectures && c.lectures.some(l => l.title.toLowerCase().includes(this.searchQuery));
        return titleMatch || catMatch || notesMatch || lecturesMatch;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (this.sortOption === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (this.sortOption === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (this.sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (this.sortOption === 'progress') {
        return this.calculateCourseProgress(b).pct - this.calculateCourseProgress(a).pct;
      } else if (this.sortOption === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    if (this.activeFilterCount) {
      this.activeFilterCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`;
    }

    if (filtered.length === 0) {
      this.coursesGrid.innerHTML = '';
      if (this.emptyState) {
        this.emptyState.classList.remove('hidden');
        if (this.searchQuery) {
          if (this.emptyTitle) this.emptyTitle.textContent = 'No Items Found';
          if (this.emptyDescription) this.emptyDescription.textContent = `No items found matching "${this.searchQuery}".`;
          if (this.emptyResetFilterBtn) this.emptyResetFilterBtn.classList.remove('hidden');
        } else if (this.activeCategoryFilter !== 'all' || this.activeStatusFilter !== 'all') {
          if (this.emptyTitle) this.emptyTitle.textContent = 'No Items Found';
          if (this.emptyDescription) this.emptyDescription.textContent = `No items in "${this.activeCategoryFilter}" with status "${this.activeStatusFilter}".`;
          if (this.emptyResetFilterBtn) this.emptyResetFilterBtn.classList.remove('hidden');
        } else {
          const curSec = this.sections.find(s => s.id === this.activeSectionId) || this.sections[0];
          if (this.emptyTitle) this.emptyTitle.textContent = `No items in ${curSec.shortName}`;
          if (this.emptyDescription) this.emptyDescription.textContent = `No courses or bookmarks saved here yet. Tap '+ Add to ${curSec.shortName}' to start!`;
          if (this.emptyResetFilterBtn) this.emptyResetFilterBtn.classList.add('hidden');
        }
      }
      return;
    }

    if (this.emptyState) this.emptyState.classList.add('hidden');
    this.coursesGrid.innerHTML = '';

    filtered.forEach(course => {
      const card = this.createCourseCardElement(course);
      this.coursesGrid.appendChild(card);
    });
  }

  createCourseCardElement(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.dataset.id = course.id;

    const catObj = this.categories.find(c => c.name === course.category);
    const catColor = catObj ? catObj.color : '#D4AF37';

    let statusPillClass = 'card-status-want';
    if (course.status === 'In Progress') statusPillClass = 'card-status-progress';
    if (course.status === 'Completed') statusPillClass = 'card-status-completed';

    const media = this.resolveItemMedia(course);
    const progress = this.calculateCourseProgress(course);
    const dateFormatted = new Date(course.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    // Thumbnail markup
    let thumbnailHtml = '';
    if (media.url) {
      thumbnailHtml = `
        <div class="card-thumbnail-wrap">
          <img 
            class="card-thumbnail-img" 
            src="${escapeHtml(media.url)}" 
            alt="${escapeHtml(course.title)}" 
            loading="lazy" 
            onerror="if (this.src.includes('maxresdefault.jpg')) { this.src = this.src.replace('maxresdefault.jpg', 'hqdefault.jpg'); } else if (this.src.includes('hqdefault.jpg')) { this.src = this.src.replace('hqdefault.jpg', 'mqdefault.jpg'); } else { this.style.display='none'; this.nextElementSibling.classList.remove('hidden'); }"
          />
          <div class="card-thumbnail-fallback hidden">
            <div class="fallback-glow"></div>
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span class="fallback-tag">${escapeHtml(course.category)}</span>
          </div>
          <div class="card-thumb-overlay">
            <div class="thumb-play-btn">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>
            </div>
          </div>
          ${media.isCustom ? `<div class="card-type-badge badge-custom-cover">Custom Cover</div>` : (course.playlistId ? `<div class="card-type-badge">Playlist</div>` : '')}
          <div class="card-status-pill ${statusPillClass}">${course.status}</div>
        </div>
      `;
    } else {
      thumbnailHtml = `
        <div class="card-thumbnail-wrap card-thumbnail-playlist">
          <div class="playlist-header-art">
            <div class="playlist-cards-stack">
              <div class="stack-card stack-back"></div>
              <div class="stack-card stack-mid"></div>
              <div class="stack-card stack-front">
                <span style="font-weight:700; font-size: 0.9rem;">${escapeHtml(media.initial || 'CV')}</span>
              </div>
            </div>
            <div class="playlist-meta-info">
              <span class="playlist-label">${escapeHtml(course.category)}</span>
            </div>
          </div>
          <div class="card-thumb-overlay">
            <div class="thumb-play-btn">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>
            </div>
          </div>
          <div class="card-status-pill ${statusPillClass}">${course.status}</div>
        </div>
      `;
    }

    // LIST VIEW ROW MARKUP
    const listRowHtml = `
      <div class="list-row-main">
        ${thumbnailHtml}
        <div class="list-info-col">
          <div class="list-title-row">
            <h3 class="card-title" title="${escapeHtml(course.title)}">${escapeHtml(course.title)}</h3>
          </div>
          <div class="list-meta-row">
            <span class="category-tag" style="--cat-color: ${catColor};"># ${escapeHtml(course.category)}</span>
            <span class="card-date">${dateFormatted}</span>
          </div>
        </div>

        <div class="list-progress-col">
          <div class="progress-header">
            <span>${progress.hasLectures ? `${progress.done}/${progress.total} done` : 'Progress'}</span>
            <span class="progress-pct-badge">${progress.pct}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${progress.pct}%;"></div>
          </div>
        </div>

        <div class="list-actions-col">
          <a href="${escapeHtml(course.url)}" target="_blank" rel="noopener noreferrer" class="btn-watch-yt">
            <span>Watch</span>
          </a>
          <div class="card-actions-group">
            <button type="button" class="card-icon-action edit-course-btn" title="Edit course & lectures" aria-label="Edit course">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button type="button" class="card-icon-action delete-action delete-course-btn" title="Delete course" aria-label="Delete course">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // GRID & COMPACT CARD CONTENT MARKUP
    const notesHtml = course.notes ? `<div class="card-notes">${escapeHtml(course.notes)}</div>` : '';

    const gridContentHtml = `
      <div class="card-content">
        <div class="card-meta-row">
          <span class="category-tag" style="--cat-color: ${catColor};">
            # ${escapeHtml(course.category)}
          </span>
          <span class="card-date">${dateFormatted}</span>
        </div>

        <h3 class="card-title" title="${escapeHtml(course.title)}">${escapeHtml(course.title)}</h3>
        ${notesHtml}

        <!-- Dynamic Course Progress Bar -->
        <div class="course-progress-wrap">
          <div class="progress-header">
            <span>${progress.hasLectures ? `${progress.done} of ${progress.total} Lectures` : 'Completion Progress'}</span>
            <span class="progress-pct-badge">${progress.pct}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${progress.pct}%;"></div>
          </div>
        </div>

        <!-- Status Segment Control -->
        <div class="card-status-toggle-wrap">
          <button class="status-segment-btn ${course.status === 'Want to Learn' ? 'active-want' : ''}" data-set-status="Want to Learn">
            Want to Learn
          </button>
          <button class="status-segment-btn ${course.status === 'In Progress' ? 'active-progress' : ''}" data-set-status="In Progress">
            In Progress
          </button>
          <button class="status-segment-btn ${course.status === 'Completed' ? 'active-completed' : ''}" data-set-status="Completed">
            Completed
          </button>
        </div>

        <!-- Footer Actions (Aligned row, no overlap) -->
        <div class="card-actions-footer">
          <a href="${escapeHtml(course.url)}" target="_blank" rel="noopener noreferrer" class="btn-watch-yt">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span>Watch on YouTube</span>
          </a>

          <div class="card-actions-group">
            <button class="card-icon-action copy-link-btn" title="Copy clean link" aria-label="Copy course link">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </button>

            <button class="card-icon-action edit-course-btn" title="Edit course & lectures" aria-label="Edit course">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>

            <button class="card-icon-action delete-action delete-course-btn" title="Delete course" aria-label="Delete course">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    card.innerHTML = `
      <div class="card-grid-view">
        ${thumbnailHtml}
        ${gridContentHtml}
      </div>
      ${listRowHtml}
    `;

    // Event Listeners on Card
    // Status segment button
    card.querySelectorAll('.status-segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateCourseStatus(course.id, btn.dataset.setStatus);
      });
    });

    // Category tag filter click
    card.querySelectorAll('.category-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activeCategoryFilter = course.category;
        this.render();
      });
    });

    // Copy clean link
    const copyBtn = card.querySelector('.copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const linkToCopy = course.normalizedUrl || course.url;
        navigator.clipboard.writeText(linkToCopy).then(() => {
          this.showToast('Course link copied to clipboard!', 'info');
        }).catch(() => {
          this.showToast('Could not copy link.', 'warning');
        });
      });
    }

    // Edit button
    card.querySelectorAll('.edit-course-btn').forEach(btn => {
      btn.addEventListener('click', () => this.openCourseModal(course));
    });

    // Delete button
    card.querySelectorAll('.delete-course-btn').forEach(btn => {
      btn.addEventListener('click', () => this.confirmDelete(course.id));
    });

    return card;
  }

  // ==========================================================================
  // 12. Backup & Restore (JSON Export / Import)
  // ==========================================================================

  openBackupModal() {
    if (this.importFeedback) this.importFeedback.classList.add('hidden');
    if (this.backupModalOverlay) this.backupModalOverlay.classList.remove('hidden');
  }

  closeBackupModal() {
    if (this.backupModalOverlay) this.backupModalOverlay.classList.add('hidden');
  }

  exportBackupJson() {
    const backupData = {
      app: 'CourseVault',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      sections: this.sections,
      categories: this.categories,
      courses: this.courses,
      tools: this.tools,
      viewMode: this.viewMode
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `coursevault-backup-${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Complete backup exported successfully!', 'success');
  }

  handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      this.processImportJson(file);
    }
  }

  processImportJson(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (!data || (!Array.isArray(data.courses) && !Array.isArray(data.tools))) {
          this.showImportFeedback('Invalid file: JSON must contain courses or tools.', 'error');
          return;
        }

        let newCategoriesCount = 0;
        let newCoursesCount = 0;
        let newToolsCount = 0;
        let newSectionsCount = 0;

        // Restore Workspaces / Sections
        if (Array.isArray(data.sections)) {
          data.sections.forEach(sec => {
            if (!sec.id || !sec.title) return;
            const exists = this.sections.some(s => s.id === sec.id);
            if (!exists) {
              this.sections.push(sec);
              newSectionsCount++;
            }
          });
          this.saveSections();
        }

        // Restore Categories
        if (Array.isArray(data.categories)) {
          data.categories.forEach(importedCat => {
            if (!importedCat.name) return;
            const exists = this.categories.some(c => c.name.toLowerCase() === importedCat.name.toLowerCase());
            if (!exists) {
              this.categories.push({
                id: importedCat.id || ('cat-' + Date.now() + Math.random()),
                name: importedCat.name,
                color: importedCat.color || '#D4AF37'
              });
              newCategoriesCount++;
            }
          });
          this.saveCategories();
        }

        // Restore Courses & Lectures
        if (Array.isArray(data.courses)) {
          data.courses.forEach(importedCourse => {
            if (!importedCourse.url || !importedCourse.title) return;
            const videoId = this.extractYouTubeVideoId(importedCourse.url) || importedCourse.videoId || null;
            const playlistId = this.extractYouTubePlaylistId(importedCourse.url) || importedCourse.playlistId || null;
            const { normalized } = this.normalizeUrl(importedCourse.url);
            const customThumb = importedCourse.customThumbnailUrl || '';

            const duplicate = this.courses.find(c => c.normalizedUrl && normalized && c.normalizedUrl.toLowerCase() === normalized.toLowerCase());
            if (!duplicate) {
              this.courses.unshift({
                id: importedCourse.id || ('course-' + Date.now() + Math.random()),
                sectionId: importedCourse.sectionId || 'courses',
                title: importedCourse.title,
                url: importedCourse.url,
                normalizedUrl: normalized,
                videoId: videoId,
                playlistId: playlistId,
                thumbnailUrl: customThumb || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''),
                customThumbnailUrl: customThumb,
                category: importedCourse.category || 'General',
                status: ['Want to Learn', 'In Progress', 'Completed'].includes(importedCourse.status) ? importedCourse.status : 'Want to Learn',
                notes: importedCourse.notes || '',
                lectures: Array.isArray(importedCourse.lectures) ? importedCourse.lectures : [],
                createdAt: importedCourse.createdAt || new Date().toISOString()
              });
              newCoursesCount++;
            }
          });
          this.saveCourses();
        }

        // Restore Tools
        if (Array.isArray(data.tools)) {
          data.tools.forEach(importedTool => {
            if (!importedTool.name || !importedTool.url) return;
            const cleanUrl = importedTool.url.trim().toLowerCase();
            const duplicate = this.tools.find(t => (t.url || '').trim().toLowerCase() === cleanUrl);
            if (!duplicate) {
              this.tools.push({
                id: importedTool.id || ('tool-' + Date.now() + Math.random()),
                sectionId: importedTool.sectionId || 'tools',
                name: importedTool.name,
                url: importedTool.url,
                category: importedTool.category || 'Utility',
                description: importedTool.description || '',
                createdAt: importedTool.createdAt || new Date().toISOString()
              });
              newToolsCount++;
            }
          });
          this.saveTools();
        }

        if (data.viewMode && ['grid', 'compact', 'list'].includes(data.viewMode)) {
          this.viewMode = data.viewMode;
          this.saveViewMode();
        }

        this.render();
        let msg = `Restored ${newCoursesCount} items, ${newCategoriesCount} categories, ${newToolsCount} tools`;
        if (newSectionsCount > 0) msg += `, ${newSectionsCount} workspaces`;
        msg += '!';
        this.showImportFeedback(msg, 'success');
        this.showToast(msg, 'success');
      } catch (err) {
        console.error('Import parse error:', err);
        this.showImportFeedback('Failed to read JSON: syntax or schema error.', 'error');
      }
    };

    reader.readAsText(file);
  }

  showImportFeedback(text, type) {
    if (!this.importFeedback) return;
    this.importFeedback.textContent = text;
    this.importFeedback.className = `import-feedback ${type}`;
    this.importFeedback.classList.remove('hidden');
  }

  loadSampleData() {
    let coursesAdded = 0;
    SAMPLE_COURSES.forEach(sc => {
      const exists = this.courses.some(c => c.normalizedUrl.toLowerCase() === sc.normalizedUrl.toLowerCase());
      if (!exists) {
        this.courses.push({ ...sc });
        coursesAdded++;
      }
    });

    let toolsAdded = 0;
    SAMPLE_TOOLS.forEach(st => {
      const exists = this.tools.some(t => t.url.toLowerCase() === st.url.toLowerCase());
      if (!exists) {
        this.tools.push({ ...st });
        toolsAdded++;
      }
    });

    this.saveCourses();
    this.saveTools();
    this.render();
    this.closeBackupModal();
    this.showToast(`Loaded ${coursesAdded} demo courses & ${toolsAdded} demo web tools!`, 'success');
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all data on this device? (This cannot be undone without a backup)')) {
      this.courses = [];
      this.tools = [];
      this.sections = [...DEFAULT_SECTIONS];
      this.categories = [...DEFAULT_CATEGORIES];
      this.saveSections();
      this.saveCategories();
      this.saveCourses();
      this.saveTools();
      this.switchWorkspace('courses');
      this.closeBackupModal();
      this.showToast('Workspace reset to clean state.', 'info');
    }
  }

  // ==========================================================================
  // 13. Toast Notifications
  // ==========================================================================

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon success" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg class="toast-icon danger" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg class="toast-icon warning" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon info" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    if (this.toastStack) {
      this.toastStack.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 250);
      }, 3200);
    }
  }
}

// Utility: HTML Escaping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.courseVault = new CourseVaultApp();
});
