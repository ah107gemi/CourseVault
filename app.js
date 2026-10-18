/**
 * CourseVault — Modern Course Tracker & Offline PWA
 * Application Logic & Local Storage Store
 */

// ==========================================================================
// 1. Initial State & Defaults
// ==========================================================================

const STORAGE_KEY_COURSES = 'coursevault_courses_v1';
const STORAGE_KEY_CATEGORIES = 'coursevault_categories_v1';
const STORAGE_KEY_TOOLS = 'coursevault_tools_v1';

const DEFAULT_CATEGORIES = [
  { id: 'cat-general', name: 'General', color: '#6366f1' },
  { id: 'cat-python', name: 'Python', color: '#10b981' },
  { id: 'cat-webdev', name: 'Web Dev', color: '#06b6d4' },
  { id: 'cat-ai', name: 'AI & Data', color: '#ec4899' },
  { id: 'cat-design', name: 'Design', color: '#f59e0b' }
];

// Optional demo/starter pack: can be loaded on demand via Backup/Restore modal
const SAMPLE_COURSES = [
  {
    id: 'sample-course-1',
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
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-course-2',
    title: 'Python for Beginners – Full Course [Programming with Mosh]',
    url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    normalizedUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    videoId: '_uQrJ0TkZlc',
    playlistId: null,
    thumbnailUrl: 'https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg',
    customThumbnailUrl: '',
    category: 'Python',
    status: 'Completed',
    notes: 'Great 6-hour foundations on variables, loops, classes, and PyCharm setup.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-course-3',
    title: 'Build Autonomous AI Agents with LangChain & Python',
    url: 'https://www.youtube.com/watch?v=aywZrzNaKjs',
    normalizedUrl: 'https://www.youtube.com/watch?v=aywZrzNaKjs',
    videoId: 'aywZrzNaKjs',
    playlistId: null,
    thumbnailUrl: 'https://img.youtube.com/vi/aywZrzNaKjs/hqdefault.jpg',
    customThumbnailUrl: '',
    category: 'AI & Data',
    status: 'Want to Learn',
    notes: 'Multi-agent systems, function calling, and local LLM orchestration.',
    createdAt: new Date().toISOString()
  }
];

const SAMPLE_TOOLS = [
  {
    id: 'sample-tool-1',
    name: 'iLovePDF',
    url: 'https://www.ilovepdf.com',
    category: 'PDF',
    description: 'Every tool you need to work with PDFs in one place: merge, split, compress, and convert.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-2',
    name: 'TinyURL',
    url: 'https://tinyurl.com',
    category: 'Utility',
    description: 'Fast link shortener that creates clean, memorable URLs with analytics.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-3',
    name: 'Clippobot',
    url: 'https://clippobot.com',
    category: 'Downloader',
    description: 'Online media & video downloader and audio clipper without accounts or ads.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-4',
    name: 'Remove.bg',
    url: 'https://www.remove.bg',
    category: 'Design',
    description: 'Remove backgrounds from images automatically in 5 seconds with zero clicks.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-tool-5',
    name: 'Excalidraw',
    url: 'https://excalidraw.com',
    category: 'Productivity',
    description: 'Virtual collaborative whiteboard tool that lets you sketch diagrams and architectures.',
    createdAt: new Date().toISOString()
  }
];

class CourseVaultApp {
  constructor() {
    this.courses = [];
    this.categories = [];
    this.tools = [];
    this.activeView = 'courses';        // 'courses' or 'tools'
    this.activeToolCategory = 'all';    // 'all' or specific tool category
    this.activeCategoryFilter = 'all';  // 'all' or category name
    this.activeStatusFilter = 'all';    // 'all', 'Want to Learn', 'In Progress', 'Completed'
    this.searchQuery = '';
    this.sortOption = 'newest';
    this.itemToDelete = null;           // { type: 'course'|'tool', id: string, title: string }
    this.courseToDeleteId = null;       // backward compatibility
    this.deferredInstallPrompt = null;

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
    this.renderTools();
  }

  loadState() {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (storedCategories) {
        this.categories = JSON.parse(storedCategories);
      } else {
        this.categories = [...DEFAULT_CATEGORIES];
        this.saveCategories();
      }

      const storedCourses = localStorage.getItem(STORAGE_KEY_COURSES);
      if (storedCourses) {
        this.courses = JSON.parse(storedCourses);
      } else {
        // First-time visitor: start with clean personalized workspace
        this.courses = [];
        this.saveCourses();
      }

      const storedTools = localStorage.getItem(STORAGE_KEY_TOOLS);
      if (storedTools) {
        this.tools = JSON.parse(storedTools);
      } else {
        // First-time visitor: start with clean personalized workspace
        this.tools = [];
        this.saveTools();
      }

      // Heal & migrate any existing courses if present
      this.migrateExistingCourses();
    } catch (e) {
      console.error('Failed to parse localStorage data:', e);
      this.categories = [...DEFAULT_CATEGORIES];
      this.courses = [];
      this.tools = [];
    }
  }

  /**
   * Automatically heals and migrates existing courses stored in browser localStorage.
   * Priority: Custom Image URL > Auto YouTube Video Thumbnail > Default generic placeholder
   */
  migrateExistingCourses() {
    let hasChanges = false;
    this.courses = this.courses.map(course => {
      const videoId = this.extractYouTubeVideoId(course.url) || course.videoId || null;
      const playlistId = this.extractYouTubePlaylistId(course.url) || course.playlistId || null;
      const customCover = (course.customThumbnailUrl || course.customCoverUrl || '').trim();
      
      // Strict priority: Custom Image URL > Auto YouTube Video Thumbnail > Default generic placeholder
      let thumb = '';
      if (customCover) {
        thumb = customCover;
      } else if (videoId) {
        thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      if (course.videoId !== videoId || course.thumbnailUrl !== thumb || course.playlistId !== playlistId || course.customThumbnailUrl !== customCover) {
        hasChanges = true;
      }

      return {
        ...course,
        videoId: videoId,
        playlistId: playlistId,
        thumbnailUrl: thumb,
        customThumbnailUrl: customCover
      };
    });

    if (hasChanges) {
      this.saveCourses();
      console.log('[CourseVault] Courses healed & migrated with Custom Cover priority.');
    }
  }

  saveCourses() {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(this.courses));
    } catch (err) {
      console.error('[CourseVault] Failed to save courses to localStorage:', err);
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        this.showToast('Storage quota reached! Delete unused courses or large custom covers.', 'danger');
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
      console.error('[CourseVault] Failed to save tools to localStorage:', err);
      this.showToast('Could not save tools to browser storage.', 'danger');
    }
  }

  // Setup Service Worker & PWA Install Prompts
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

    // PWA Install Prompt
    const installBtn = document.getElementById('installPwaBtn');
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (installBtn) {
        installBtn.classList.remove('hidden');
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('[CourseVault] PWA installed successfully');
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
  // 3. URL Normalization & Duplicate Detection
  // ==========================================================================

  /**
   * Extracts YouTube 11-character Video ID from:
   * 1. Standard watch links: watch?v=VIDEO_ID (including with playlist or tracking attached)
   * 2. Short links: youtu.be/VIDEO_ID
   * 3. Playlist links with video attached: playlist?list=...&v=VIDEO_ID or watch?v=...&list=...
   * 4. Shorts, Embed, Live, and /v/ links
   */
  extractYouTubeVideoId(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const clean = rawUrl.trim();

    // 1. Any URL containing 'v=' query param (e.g. watch?v=..., playlist?v=..., etc.)
    const vMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
    if (vMatch && vMatch[1]) return vMatch[1];

    // 2. Short links: youtu.be/VIDEO_ID or youtu.be/VIDEO_ID?list=...
    const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
    if (shortMatch && shortMatch[1]) return shortMatch[1];

    // 3. Path links: /embed/ID, /shorts/ID, /live/ID, /v/ID
    const pathMatch = clean.match(/\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/i);
    if (pathMatch && pathMatch[1]) return pathMatch[1];

    // 4. Raw 11-character video ID directly entered
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;

    return null;
  }

  /**
   * Extracts YouTube Playlist ID from list= query parameter
   */
  extractYouTubePlaylistId(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const match = rawUrl.trim().match(/[?&]list=([a-zA-Z0-9_-]+)/i);
    return match && match[1] ? match[1] : null;
  }

  /**
   * Resolves the cover thumbnail according to strict priority:
   * 1. Custom Cover Image URL (takes top precedence)
   * 2. Auto YouTube Video Thumbnail (hqdefault.jpg)
   * 3. Default generic placeholder (url: null)
   */
  resolveCoverThumbnail(item) {
    if (!item) return { url: null, isCustom: false };
    const custom = (item.customThumbnailUrl || item.customCoverUrl || '').trim();
    if (custom) {
      return { url: custom, isCustom: true };
    }

    const videoId = item.videoId || this.extractYouTubeVideoId(item.url);
    if (videoId) {
      return { url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, isCustom: false };
    }

    return { url: null, isCustom: false };
  }

  /**
   * Reads and compresses a local image file using an offscreen HTML canvas.
   * Scales image down to maxWidth (~640px) proportionally and outputs a base64 JPEG string at quality ~0.7.
   * @param {File} file - Selected image file (.jpg, .png, .webp)
   * @param {number} maxWidth - Maximum width in pixels (default: 640)
   * @param {number} quality - JPEG compression quality (default: 0.7)
   * @returns {Promise<string>} Base64 data URL
   */
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

          // Proportionally constrain to maxWidth (~640px)
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          // Fill background for transparency safety in dark theme
          ctx.fillStyle = '#0b0f17';
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
      reader.onerror = () => reject(new Error('Failed to read file from device'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Resets local file upload state for cover image
   */
  clearUploadedFileCover() {
    if (this.courseCoverFileInput) this.courseCoverFileInput.value = '';
    if (this.fileBadgeInfo) this.fileBadgeInfo.classList.add('hidden');
    if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
    if (this.courseThumbnailInput && this.courseThumbnailInput.value.startsWith('data:image/')) {
      this.courseThumbnailInput.value = '';
    }
    this.updateThumbnailPreview();
  }

  /**
   * Generates high-quality YouTube thumbnail or custom cover URL
   */
  getThumbnailUrl(videoId, customUrl = '') {
    if (customUrl && typeof customUrl === 'string' && customUrl.trim()) {
      return customUrl.trim();
    }
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return '';
  }

  /**
   * Normalizes incoming URLs by:
   * 1. Stripping tracking parameters (si, t, utm_*, fbclid, etc.)
   * 2. Canonicalizing YouTube desktop vs mobile vs shortlinks
   * 3. Retaining clean videoId and playlistId
   */
  normalizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
      return { normalized: '', videoId: null, playlistId: null, isYouTube: false };
    }

    const videoId = this.extractYouTubeVideoId(rawUrl);
    const playlistId = this.extractYouTubePlaylistId(rawUrl);

    if (videoId) {
      // Standardize to canonical YouTube watch link
      const norm = playlistId
        ? `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`
        : `https://www.youtube.com/watch?v=${videoId}`;
      return {
        normalized: norm,
        videoId: videoId,
        playlistId: playlistId,
        isYouTube: true
      };
    }

    if (playlistId) {
      // Pure playlist link
      return {
        normalized: `https://www.youtube.com/playlist?list=${playlistId}`,
        videoId: null,
        playlistId: playlistId,
        isYouTube: true
      };
    }

    // Generic / Non-YouTube URLs: strip tracking query params
    let trimmed = rawUrl.trim();
    if (!/^https?:\/\//i.test(trimmed)) trimmed = 'https://' + trimmed;
    try {
      const parsed = new URL(trimmed);
      const trackingParams = ['si', 't', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
      trackingParams.forEach((param) => parsed.searchParams.delete(param));
      
      let cleanHref = parsed.origin + parsed.pathname.replace(/\/+$/, '');
      if (parsed.search) cleanHref += parsed.search;

      return {
        normalized: cleanHref,
        videoId: null,
        playlistId: null,
        isYouTube: false
      };
    } catch (e) {
      return { normalized: trimmed, videoId: null, playlistId: null, isYouTube: false };
    }
  }

  /**
   * Checks if a normalized link already exists in storage.
   * If excludeId is provided, ignores that course (used when editing).
   */
  findDuplicateCourse(rawUrl, excludeId = null) {
    const { normalized } = this.normalizeUrl(rawUrl);
    if (!normalized) return null;

    return this.courses.find(c => {
      if (excludeId && c.id === excludeId) return false;
      return c.normalizedUrl.toLowerCase() === normalized.toLowerCase();
    }) || null;
  }

  // ==========================================================================
  // 4. DOM Bindings & Event Listeners
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

    // Primary View Switching
    this.navAllCourses = document.getElementById('navAllCourses');
    this.navTools = document.getElementById('navTools');
    this.countTools = document.getElementById('countTools');
    this.coursesViewPanel = document.getElementById('coursesViewPanel');
    this.toolsViewPanel = document.getElementById('toolsViewPanel');

    // Mobile Bottom Bar
    this.mobileNavChannelsBtn = document.getElementById('mobileNavChannelsBtn');
    this.mobileNavToolsBtn = document.getElementById('mobileNavToolsBtn');
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
    this.sidebarBackupBtn = document.getElementById('sidebarBackupBtn');

    // Main Content (Courses)
    this.activeCategoryTitle = document.getElementById('activeCategoryTitle');
    this.activeFilterCount = document.getElementById('activeFilterCount');
    this.statusTabsContainer = document.getElementById('statusTabsContainer');
    this.sortSelect = document.getElementById('sortSelect');
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

    // Tool Modal
    this.toolModalOverlay = document.getElementById('toolModalOverlay');
    this.closeToolModalBtn = document.getElementById('closeToolModalBtn');
    this.cancelToolBtn = document.getElementById('cancelToolBtn');
    this.toolForm = document.getElementById('toolForm');
    this.toolModalTitle = document.getElementById('toolModalTitle');
    this.toolEditId = document.getElementById('toolEditId');
    this.toolNameInput = document.getElementById('toolNameInput');
    this.toolUrlInput = document.getElementById('toolUrlInput');
    this.toolCategoryInput = document.getElementById('toolCategoryInput');
    this.toolQuickCategoryChips = document.getElementById('toolQuickCategoryChips');
    this.toolDescriptionInput = document.getElementById('toolDescriptionInput');
    this.saveToolBtnText = document.getElementById('saveToolBtnText');

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
    this.deleteCourseTitle = document.getElementById('deleteCourseTitle');
    this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Toast Container
    this.toastStack = document.getElementById('toastStack');
  }

  setupEventListeners() {
    // Mobile Drawer Toggling
    const toggleDrawer = () => {
      const isOpen = this.sidebarChannels.classList.contains('open');
      if (isOpen) {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    };

    if (this.mobileMenuBtn) this.mobileMenuBtn.addEventListener('click', toggleDrawer);
    if (this.mobileNavChannelsBtn) {
      this.mobileNavChannelsBtn.addEventListener('click', () => {
        this.switchView('courses');
      });
    }
    if (this.mobileNavToolsBtn) {
      this.mobileNavToolsBtn.addEventListener('click', () => {
        this.switchView('tools');
      });
    }
    if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', () => this.closeDrawer());

    // Primary View Switching (Sidebar)
    if (this.navAllCourses) {
      this.navAllCourses.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeCategoryFilter = 'all';
        this.activeStatusFilter = 'all';
        this.switchView('courses');
        this.closeDrawer();
      });
    }

    if (this.navTools) {
      this.navTools.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('tools');
        this.closeDrawer();
      });
    }

    // Search Input
    const executeSearch = (val) => {
      this.searchQuery = val.trim().toLowerCase();
      if (this.searchQuery) {
        this.clearSearchBtn.classList.remove('hidden');
      } else {
        this.clearSearchBtn.classList.add('hidden');
      }
      if (this.activeView === 'tools') {
        this.renderTools();
      } else {
        this.renderCourses();
      }
    };

    this.searchInput.addEventListener('input', (e) => executeSearch(e.target.value));
    this.searchInput.addEventListener('search', () => executeSearch(this.searchInput.value));

    this.clearSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.searchInput.value = '';
      executeSearch('');
      this.searchInput.focus();
    });

    // PWA Install Button
    if (this.installPwaBtn) {
      this.installPwaBtn.addEventListener('click', async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const { outcome } = await this.deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          this.installPwaBtn.classList.add('hidden');
        }
        this.deferredInstallPrompt = null;
      });
    }

    // Modal Triggers: Add Course or Tool (Context-Aware)
    const handleAddItem = () => {
      if (this.activeView === 'tools') {
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

    this.closeCourseModalBtn.addEventListener('click', () => this.closeCourseModal());
    this.cancelCourseBtn.addEventListener('click', () => this.closeCourseModal());

    // Tool Modal Actions
    if (this.closeToolModalBtn) this.closeToolModalBtn.addEventListener('click', () => this.closeToolModal());
    if (this.cancelToolBtn) this.cancelToolBtn.addEventListener('click', () => this.closeToolModal());
    if (this.toolForm) this.toolForm.addEventListener('submit', (e) => this.handleToolSubmit(e));

    // Tool Modal Quick Category Chips
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

    // Modal Triggers: New Category
    const openAddCat = () => this.openCategoryModal();
    if (this.inlineAddCategoryBtn) this.inlineAddCategoryBtn.addEventListener('click', openAddCat);
    if (this.sidebarAddCatBtn) this.sidebarAddCatBtn.addEventListener('click', openAddCat);
    if (this.inlineAddCategoryTriggerBtn) this.inlineAddCategoryTriggerBtn.addEventListener('click', openAddCat);

    this.closeCategoryModalBtn.addEventListener('click', () => this.closeCategoryModal());
    this.cancelCategoryBtn.addEventListener('click', () => this.closeCategoryModal());

    // Modal Triggers: Backup & Restore
    const openBackup = () => this.openBackupModal();
    if (this.backupModalBtn) this.backupModalBtn.addEventListener('click', openBackup);
    if (this.mobileNavBackupBtn) this.mobileNavBackupBtn.addEventListener('click', openBackup);
    if (this.sidebarBackupBtn) this.sidebarBackupBtn.addEventListener('click', openBackup);

    this.closeBackupModalBtn.addEventListener('click', () => this.closeBackupModal());
    this.closeBackupFooterBtn.addEventListener('click', () => this.closeBackupModal());

    // Live Duplicate URL Detection & Thumbnail Preview in Form
    const handleUrlChange = () => {
      this.checkLiveDuplicate();
      this.updateThumbnailPreview();
    };
    this.courseUrlInput.addEventListener('input', handleUrlChange);
    this.courseUrlInput.addEventListener('paste', () => setTimeout(handleUrlChange, 50));

    // Custom Cover URL Input Listener
    if (this.courseThumbnailInput) {
      const handleCustomUrlChange = () => {
        const val = this.courseThumbnailInput.value.trim();
        // If user typed/pasted a regular web URL, reset any local file upload state
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

    // Local Device File Upload Listener (FileReader + Offscreen Canvas Compression)
    if (this.courseCoverFileInput) {
      this.courseCoverFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // Verify valid image MIME type or extension
        if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i) && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
          this.showToast('Please select a valid image file (.jpg, .png, .webp).', 'warning');
          this.courseCoverFileInput.value = '';
          return;
        }

        try {
          if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Optimizing image...';
          
          // Compress using offscreen HTML canvas (max width 640px, JPEG quality 0.7)
          const compressedBase64 = await this.compressImageFile(file, 640, 0.7);

          // Populate the custom thumbnail field with Base64 data URL
          if (this.courseThumbnailInput) {
            this.courseThumbnailInput.value = compressedBase64;
          }

          // Compute size details for user confirmation
          const originalKb = Math.round(file.size / 1024);
          const compressedKb = Math.round((compressedBase64.length * 3 / 4) / 1024);

          // Update UI badge
          if (this.fileBadgeText) {
            this.fileBadgeText.textContent = `${file.name} (~${compressedKb} KB)`;
          }
          if (this.fileBadgeInfo) {
            this.fileBadgeInfo.classList.remove('hidden');
          }
          if (this.coverUploadBtnText) {
            this.coverUploadBtnText.textContent = 'Change Uploaded Image';
          }

          // Live thumbnail preview updates immediately
          this.updateThumbnailPreview();
          this.showToast(`Cover loaded & compressed (${originalKb} KB → ~${compressedKb} KB)`, 'success');
        } catch (err) {
          console.error('[CourseVault] File upload conversion failed:', err);
          this.showToast('Could not process this image file.', 'danger');
          if (this.coverUploadBtnText) {
            this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
          }
        }
      });
    }

    // Remove uploaded file cover button
    if (this.removeFileCoverBtn) {
      this.removeFileCoverBtn.addEventListener('click', () => {
        this.clearUploadedFileCover();
        this.showToast('Removed uploaded image cover', 'info');
      });
    }

    // Reset Custom Cover to Auto YouTube Thumbnail
    if (this.clearCustomCoverBtn) {
      this.clearCustomCoverBtn.addEventListener('click', () => {
        this.clearUploadedFileCover();
        if (this.courseThumbnailInput) this.courseThumbnailInput.value = '';
        this.updateThumbnailPreview();
        this.showToast('Reset to automatic YouTube thumbnail', 'info');
      });
    }

    // Course Form Submit
    this.courseForm.addEventListener('submit', (e) => this.handleCourseSubmit(e));

    // Category Form Submit
    this.categoryForm.addEventListener('submit', (e) => this.handleCategorySubmit(e));

    // Status Filter Tabs
    this.statusTabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.status-tab');
      if (!tab) return;
      this.statusTabsContainer.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      this.activeStatusFilter = tab.dataset.tabStatus;
      this.renderCourses();
    });

    // Sort Select
    this.sortSelect.addEventListener('change', (e) => {
      this.sortOption = e.target.value;
      this.renderCourses();
    });

    // Reset Filters from Empty State
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

    // Sidebar Channel Clicks
    this.sidebarChannels.addEventListener('click', (e) => {
      const channelBtn = e.target.closest('.channel-item, .cat-channel-item');
      if (!channelBtn) return;

      if (channelBtn.dataset.category) {
        this.activeCategoryFilter = channelBtn.dataset.category;
        if (this.activeView !== 'courses') {
          this.switchView('courses');
        }
      } else if (channelBtn.dataset.statusFilter) {
        this.activeStatusFilter = channelBtn.dataset.statusFilter;
        this.statusTabsContainer.querySelectorAll('.status-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.tabStatus === this.activeStatusFilter);
        });
        if (this.activeView !== 'courses') {
          this.switchView('courses');
        }
      }

      this.closeDrawer();
      this.render();
    });

    // Delete Modal
    this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    this.confirmDeleteBtn.addEventListener('click', () => this.handleConfirmDelete());

    // Backup & Restore Handlers
    this.exportJsonBtn.addEventListener('click', () => this.exportBackupJson());
    this.importDropzone.addEventListener('click', () => this.importFileInput.click());
    this.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));

    // Drag and Drop on Import Dropzone
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

    // Sample Demo & Clear Data Handlers
    if (this.loadSampleDataBtn) {
      this.loadSampleDataBtn.addEventListener('click', () => this.loadSampleData());
    }
    if (this.clearAllDataBtn) {
      this.clearAllDataBtn.addEventListener('click', () => this.clearAllData());
    }

    // Tools Reset Filter Button from Empty State
    if (this.toolsResetFilterBtn) {
      this.toolsResetFilterBtn.addEventListener('click', () => {
        this.activeToolCategory = 'all';
        if (this.toolsCategoryTabs) {
          this.toolsCategoryTabs.querySelectorAll('.tools-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.toolCategory === 'all');
          });
        }
        this.renderTools();
      });
    }
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
  // 5. Course CRUD Operations
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

  /**
   * Updates the live thumbnail preview box in the Add/Edit Course modal
   */
  updateThumbnailPreview() {
    if (!this.thumbPreviewImg || !this.thumbPreviewFallback) return;

    const rawUrl = this.courseUrlInput.value.trim();
    const customThumb = this.courseThumbnailInput ? this.courseThumbnailInput.value.trim() : '';
    const videoId = this.extractYouTubeVideoId(rawUrl);
    const playlistId = this.extractYouTubePlaylistId(rawUrl);

    // Toggle reset/clear button for custom cover
    if (this.clearCustomCoverBtn) {
      if (customThumb) {
        this.clearCustomCoverBtn.classList.remove('hidden');
      } else {
        this.clearCustomCoverBtn.classList.add('hidden');
      }
    }

    // 1. Priority 1: Custom Cover Image URL (Takes precedence over auto thumbnail)
    if (customThumb) {
      this.thumbPreviewImg.src = customThumb;
      this.thumbPreviewImg.classList.remove('hidden');
      this.thumbPreviewFallback.classList.add('hidden');
      if (this.thumbPreviewStatus) {
        const isDeviceUpload = customThumb.startsWith('data:image/');
        this.thumbPreviewStatus.textContent = isDeviceUpload ? 'Device Upload Cover Active' : 'Custom Cover URL Active';
        this.thumbPreviewStatus.style.color = '#38bdf8';
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

    // 2. Priority 2: Auto YouTube Video Thumbnail (hqdefault.jpg)
    if (videoId) {
      const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      this.thumbPreviewImg.src = hqUrl;
      this.thumbPreviewImg.classList.remove('hidden');
      this.thumbPreviewFallback.classList.add('hidden');
      if (this.thumbPreviewStatus) {
        this.thumbPreviewStatus.textContent = playlistId ? 'Auto Video Thumbnail (Video + Playlist)' : 'Auto YouTube Thumbnail (hqdefault.jpg)';
        this.thumbPreviewStatus.style.color = '#10b981';
      }

      this.thumbPreviewImg.onerror = () => {
        // Fallback to mqdefault if hqdefault is unavailable
        if (this.thumbPreviewImg.src.includes('hqdefault.jpg')) {
          this.thumbPreviewImg.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          if (this.thumbPreviewStatus) this.thumbPreviewStatus.textContent = 'Auto-detected (mqdefault.jpg)';
        } else {
          this.thumbPreviewImg.classList.add('hidden');
          this.thumbPreviewFallback.classList.remove('hidden');
          if (this.thumbPreviewText) this.thumbPreviewText.textContent = 'Thumbnail preview unavailable';
          if (this.thumbPreviewStatus) {
            this.thumbPreviewStatus.textContent = 'Preview error';
            this.thumbPreviewStatus.style.color = '#f59e0b';
          }
        }
      };
      return;
    }

    // 3. Priority 3: Pure YouTube Playlist without a video attached (Generic Icon)
    if (playlistId) {
      this.thumbPreviewImg.classList.add('hidden');
      this.thumbPreviewFallback.classList.remove('hidden');
      if (this.thumbPreviewText) {
        this.thumbPreviewText.innerHTML = '<strong>YouTube Playlist (Generic Icon)</strong><br><span style="font-size:0.75rem; color:#94a3b8;">Paste a Custom Cover Image URL above to override this generic playlist icon!</span>';
      }
      if (this.thumbPreviewStatus) {
        this.thumbPreviewStatus.textContent = 'Generic Playlist Icon';
        this.thumbPreviewStatus.style.color = '#f59e0b';
      }
      return;
    }

    // 4. Default placeholder: Awaiting URL input
    this.thumbPreviewImg.classList.add('hidden');
    this.thumbPreviewFallback.classList.remove('hidden');
    if (this.thumbPreviewText) this.thumbPreviewText.textContent = 'Thumbnail will auto-render from YouTube link or Custom Cover';
    if (this.thumbPreviewStatus) {
      this.thumbPreviewStatus.textContent = 'Awaiting URL...';
      this.thumbPreviewStatus.style.color = 'var(--text-muted)';
    }
  }

  handleCourseSubmit(e) {
    e.preventDefault();

    const title = this.courseTitleInput.value.trim();
    const rawUrl = this.courseUrlInput.value.trim();
    const category = this.courseCategorySelect.value;
    const notes = this.courseNotesInput.value.trim();
    const customThumbnail = this.courseThumbnailInput ? this.courseThumbnailInput.value.trim() : '';
    const statusRadio = this.courseForm.querySelector('input[name="courseStatus"]:checked');
    const status = statusRadio ? statusRadio.value : 'Want to Learn';
    const editId = this.courseEditId.value;

    if (!title) {
      this.showToast('Please enter a course title.', 'warning');
      this.courseTitleInput.focus();
      return;
    }

    if (!rawUrl) {
      this.showToast('Please enter a valid YouTube URL.', 'warning');
      this.courseUrlInput.focus();
      return;
    }

    // Duplicate Check Enforcement (skip duplicate check against itself when editing)
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
    
    // Strict priority: Custom Cover Image URL > Auto YouTube Video Thumbnail > Default generic placeholder
    const cover = this.resolveCoverThumbnail({
      url: rawUrl,
      videoId: videoId,
      customThumbnailUrl: customThumbnail
    });
    const thumbnailUrl = cover.url || '';

    if (editId) {
      // Edit existing course
      const course = this.courses.find(c => c.id === editId);
      if (course) {
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
        this.showToast(`Updated "${title}" cover & details!`, 'success');
      }
    } else {
      // Create new course
      const newCourse = {
        id: 'course-' + Date.now(),
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
        createdAt: new Date().toISOString()
      };
      this.courses.unshift(newCourse);
      this.showToast(`Saved "${title}" to CourseVault`, 'success');
    }

    this.saveCourses();
    this.closeCourseModal();
    this.render();
  }

  updateCourseStatus(courseId, newStatus) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    course.status = newStatus;
    this.saveCourses();
    this.render();
    this.showToast(`Status updated to "${newStatus}"`, 'info');
  }

  switchView(viewName) {
    this.activeView = viewName;
    if (viewName === 'tools') {
      if (this.coursesViewPanel) this.coursesViewPanel.classList.add('hidden');
      if (this.toolsViewPanel) this.toolsViewPanel.classList.remove('hidden');
      if (this.navAllCourses) this.navAllCourses.classList.remove('active');
      if (this.navTools) this.navTools.classList.add('active');
      if (this.mobileNavChannelsBtn) this.mobileNavChannelsBtn.classList.remove('active');
      if (this.mobileNavToolsBtn) this.mobileNavToolsBtn.classList.add('active');
      if (this.headerAddText) this.headerAddText.textContent = 'Add Tool';
      if (this.searchInput) this.searchInput.placeholder = 'Search tools, tags, URLs...';
      this.renderTools();
    } else {
      if (this.coursesViewPanel) this.coursesViewPanel.classList.remove('hidden');
      if (this.toolsViewPanel) this.toolsViewPanel.classList.add('hidden');
      if (this.navAllCourses) this.navAllCourses.classList.add('active');
      if (this.navTools) this.navTools.classList.remove('active');
      if (this.mobileNavChannelsBtn) this.mobileNavChannelsBtn.classList.add('active');
      if (this.mobileNavToolsBtn) this.mobileNavToolsBtn.classList.remove('active');
      if (this.headerAddText) this.headerAddText.textContent = 'Add Course';
      if (this.searchInput) this.searchInput.placeholder = 'Search courses, tags...';
      this.render();
    }
    this.renderCounts();
  }

  confirmDeleteItem(type, id, title) {
    this.itemToDelete = { type, id, title };
    this.courseToDeleteId = (type === 'course') ? id : null;
    const itemTitleEl = this.deleteItemTitle || this.deleteCourseTitle;
    if (itemTitleEl) itemTitleEl.textContent = `"${title}"`;
    if (this.deleteModalTitle) {
      this.deleteModalTitle.textContent = type === 'tool' ? 'Delete Web Tool?' : 'Delete Course?';
    }
    this.deleteConfirmModal.classList.remove('hidden');
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
    this.deleteConfirmModal.classList.add('hidden');
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
    this.populateCategoryDropdown();
    this.duplicateWarningAlert.classList.add('hidden');

    const submitBtn = document.getElementById('saveCourseSubmitBtn');

    if (editCourse) {
      this.courseModalTitle.textContent = 'Edit Course Cover & Details';
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Save Changes</span>
        `;
      }
      this.courseEditId.value = editCourse.id;
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

      // Check if attached cover is an uploaded Base64 image
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
      this.courseModalTitle.textContent = 'Save Course to Vault';
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          <span>Save Course</span>
        `;
      }
      this.courseEditId.value = '';
      this.courseForm.reset();
      if (this.courseThumbnailInput) {
        this.courseThumbnailInput.value = '';
      }
      if (this.courseCoverFileInput) {
        this.courseCoverFileInput.value = '';
      }
      if (this.fileBadgeInfo) {
        this.fileBadgeInfo.classList.add('hidden');
      }
      if (this.coverUploadBtnText) {
        this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
      }
      
      // Default to currently selected category filter if specific
      if (this.activeCategoryFilter !== 'all') {
        this.courseCategorySelect.value = this.activeCategoryFilter;
      }
    }

    this.updateThumbnailPreview();
    this.courseModalOverlay.classList.remove('hidden');
    setTimeout(() => {
      if (editCourse) {
        // Focus the custom thumbnail input if editing an existing playlist without cover
        if (!editCourse.videoId && !editCourse.customThumbnailUrl && this.courseThumbnailInput) {
          this.courseThumbnailInput.focus();
        } else {
          this.courseTitleInput.focus();
        }
      } else {
        this.courseUrlInput.focus();
      }
    }, 100);
  }

  closeCourseModal() {
    this.courseModalOverlay.classList.add('hidden');
    this.duplicateWarningAlert.classList.add('hidden');
    if (this.courseCoverFileInput) this.courseCoverFileInput.value = '';
    if (this.fileBadgeInfo) this.fileBadgeInfo.classList.add('hidden');
    if (this.coverUploadBtnText) this.coverUploadBtnText.textContent = 'Upload Cover Image from Device';
  }

  // ==========================================================================
  // 6. Category Management
  // ==========================================================================

  populateCategoryDropdown() {
    this.courseCategorySelect.innerHTML = '';
    this.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = cat.name;
      this.courseCategorySelect.appendChild(opt);
    });
  }

  openCategoryModal() {
    this.categoryForm.reset();
    this.catNameErrorMsg.classList.add('hidden');
    this.categoryModalOverlay.classList.remove('hidden');
    setTimeout(() => this.newCategoryNameInput.focus(), 100);
  }

  closeCategoryModal() {
    this.categoryModalOverlay.classList.add('hidden');
  }

  handleCategorySubmit(e) {
    e.preventDefault();
    const name = this.newCategoryNameInput.value.trim();
    if (!name) return;

    // Check duplicate category name
    const exists = this.categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      this.catNameErrorMsg.classList.remove('hidden');
      return;
    }

    const colorRadio = this.categoryForm.querySelector('input[name="catColor"]:checked');
    const color = colorRadio ? colorRadio.value : '#6366f1';

    const newCategory = {
      id: 'cat-' + Date.now(),
      name: name,
      color: color
    };

    this.categories.push(newCategory);
    this.saveCategories();
    this.populateCategoryDropdown();
    this.courseCategorySelect.value = name;
    this.closeCategoryModal();
    this.render();
    this.showToast(`Category "${name}" created!`, 'success');
  }

  // ==========================================================================
  // 7. Backup & Restore (JSON Export / Import)
  // ==========================================================================

  openBackupModal() {
    this.importFeedback.classList.add('hidden');
    this.backupModalOverlay.classList.remove('hidden');
  }

  closeBackupModal() {
    this.backupModalOverlay.classList.add('hidden');
  }

  exportBackupJson() {
    const backupData = {
      app: 'CourseVault',
      version: '1.1.0',
      exportedAt: new Date().toISOString(),
      categories: this.categories,
      courses: this.courses,
      tools: this.tools
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

    this.showToast('Backup JSON exported successfully!', 'success');
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

        if (!data || !Array.isArray(data.courses)) {
          this.showImportFeedback('Invalid file: JSON must contain a "courses" array.', 'error');
          return;
        }

        let newCategoriesCount = 0;
        let newCoursesCount = 0;
        let newToolsCount = 0;

        // Merge Categories
        if (Array.isArray(data.categories)) {
          data.categories.forEach(importedCat => {
            if (!importedCat.name) return;
            const exists = this.categories.some(c => c.name.toLowerCase() === importedCat.name.toLowerCase());
            if (!exists) {
              this.categories.push({
                id: importedCat.id || ('cat-' + Date.now() + Math.random()),
                name: importedCat.name,
                color: importedCat.color || '#6366f1'
              });
              newCategoriesCount++;
            }
          });
          this.saveCategories();
        }

        // Merge Courses (prevent duplicate normalized URLs)
        data.courses.forEach(importedCourse => {
          if (!importedCourse.url || !importedCourse.title) return;
          const videoId = this.extractYouTubeVideoId(importedCourse.url) || importedCourse.videoId || null;
          const playlistId = this.extractYouTubePlaylistId(importedCourse.url) || importedCourse.playlistId || null;
          const { normalized } = this.normalizeUrl(importedCourse.url);
          const customThumb = importedCourse.customThumbnailUrl || '';
          const thumbUrl = this.getThumbnailUrl(videoId, customThumb || importedCourse.thumbnailUrl);
          
          const duplicate = this.courses.find(c => c.normalizedUrl.toLowerCase() === normalized.toLowerCase());
          if (!duplicate) {
            this.courses.unshift({
              id: importedCourse.id || ('course-' + Date.now() + Math.random()),
              title: importedCourse.title,
              url: importedCourse.url,
              normalizedUrl: normalized,
              videoId: videoId,
              playlistId: playlistId,
              thumbnailUrl: thumbUrl,
              customThumbnailUrl: customThumb,
              category: importedCourse.category || 'General',
              status: ['Want to Learn', 'In Progress', 'Completed'].includes(importedCourse.status) ? importedCourse.status : 'Want to Learn',
              notes: importedCourse.notes || '',
              createdAt: importedCourse.createdAt || new Date().toISOString()
            });
            newCoursesCount++;
          }
        });

        // Merge Tools
        if (Array.isArray(data.tools)) {
          data.tools.forEach(importedTool => {
            if (!importedTool.name || !importedTool.url) return;
            const cleanUrl = importedTool.url.trim().toLowerCase();
            const duplicate = this.tools.find(t => (t.url || '').trim().toLowerCase() === cleanUrl);
            if (!duplicate) {
              this.tools.push({
                id: importedTool.id || ('tool-' + Date.now() + Math.random()),
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

        this.saveCourses();
        this.render();
        this.renderTools();

        let msg = `Success! Restored ${newCoursesCount} courses, ${newCategoriesCount} categories`;
        if (newToolsCount > 0) msg += ` & ${newToolsCount} tools`;
        msg += '.';
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
    this.renderTools();
    this.closeBackupModal();
    this.showToast(`Loaded ${coursesAdded} demo courses & ${toolsAdded} demo web tools!`, 'success');
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all saved courses and web tools on this device? (This cannot be undone without a JSON backup)')) {
      this.courses = [];
      this.tools = [];
      this.saveCourses();
      this.saveTools();
      this.render();
      this.renderTools();
      this.closeBackupModal();
      this.showToast('Workspace reset to clean state.', 'info');
    }
  }

  // ==========================================================================
  // Tools & Web Utilities CRUD Engine
  // ==========================================================================

  openToolModal(editTool = null) {
    if (editTool) {
      if (this.toolModalTitle) this.toolModalTitle.textContent = 'Edit Web Tool';
      if (this.saveToolBtnText) this.saveToolBtnText.textContent = 'Save Changes';
      if (this.toolEditId) this.toolEditId.value = editTool.id;
      if (this.toolNameInput) this.toolNameInput.value = editTool.name;
      if (this.toolUrlInput) this.toolUrlInput.value = editTool.url;
      if (this.toolCategoryInput) this.toolCategoryInput.value = editTool.category || 'Utility';
      if (this.toolDescriptionInput) this.toolDescriptionInput.value = editTool.description || '';
    } else {
      if (this.toolModalTitle) this.toolModalTitle.textContent = 'Add Web Tool / Utility';
      if (this.saveToolBtnText) this.saveToolBtnText.textContent = 'Save Tool';
      if (this.toolEditId) this.toolEditId.value = '';
      if (this.toolForm) this.toolForm.reset();
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
    this.renderTools();
    this.renderCounts();
  }

  renderTools() {
    if (!this.toolsGrid) return;

    let filtered = [...this.tools];

    // Filter by Category Tab
    if (this.activeToolCategory !== 'all') {
      filtered = filtered.filter(t => (t.category || '').toLowerCase() === this.activeToolCategory.toLowerCase());
    }

    // Filter by Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(t => {
        const nameMatch = (t.name || '').toLowerCase().includes(this.searchQuery);
        const catMatch = (t.category || '').toLowerCase().includes(this.searchQuery);
        const descMatch = (t.description || '').toLowerCase().includes(this.searchQuery);
        const urlMatch = (t.url || '').toLowerCase().includes(this.searchQuery);
        return nameMatch || catMatch || descMatch || urlMatch;
      });
    }

    // Sort alphabetically by name
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

    let domain = '';
    try {
      domain = new URL(tool.url).hostname.replace(/^www\./, '');
    } catch (e) {
      domain = tool.url;
    }

    const initials = (tool.name || 'WT').substring(0, 2).toUpperCase();
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : '';

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

    // Edit listener
    const editBtn = card.querySelector('.btn-edit');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.openToolModal(tool));
    }

    // Delete listener
    const deleteBtn = card.querySelector('.btn-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.confirmDeleteTool(tool.id));
    }

    return card;
  }

  // ==========================================================================
  // 8. Rendering & Filtering Engine
  // ==========================================================================

  render() {
    this.renderCategoryChannels();
    this.renderCounts();
    this.renderCourses();
  }

  renderCategoryChannels() {
    this.categoryChannelsList.innerHTML = '';

    this.categories.forEach(cat => {
      const count = this.courses.filter(c => c.category === cat.name).length;
      const isActive = this.activeCategoryFilter === cat.name;

      const btn = document.createElement('button');
      btn.className = `cat-channel-item ${isActive ? 'active' : ''}`;
      btn.dataset.category = cat.name;
      btn.style.setProperty('--cat-accent', cat.color);

      btn.innerHTML = `
        <span class="cat-bullet"></span>
        <span class="channel-name">${escapeHtml(cat.name)}</span>
        <span class="badge">${count}</span>
      `;

      this.categoryChannelsList.appendChild(btn);
    });

    // Update active highlight on "All Courses"
    const allCoursesBtn = document.querySelector('.channel-item[data-category="all"]');
    if (allCoursesBtn) {
      allCoursesBtn.classList.toggle('active', this.activeCategoryFilter === 'all' && this.activeStatusFilter === 'all');
    }

    // Update status channel active highlights
    document.querySelectorAll('.channel-item[data-status-filter]').forEach(item => {
      item.classList.toggle('active', this.activeStatusFilter === item.dataset.statusFilter);
    });
  }

  renderCounts() {
    const total = this.courses.length;
    const wantCount = this.courses.filter(c => c.status === 'Want to Learn').length;
    const progressCount = this.courses.filter(c => c.status === 'In Progress').length;
    const completedCount = this.courses.filter(c => c.status === 'Completed').length;

    if (this.countAll) this.countAll.textContent = total;
    if (this.countWant) this.countWant.textContent = wantCount;
    if (this.countProgress) this.countProgress.textContent = progressCount;
    if (this.countCompleted) this.countCompleted.textContent = completedCount;
    if (this.countTools) this.countTools.textContent = this.tools.length;
  }

  renderCourses() {
    let filtered = [...this.courses];

    // Filter by Category
    if (this.activeCategoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === this.activeCategoryFilter);
      this.activeCategoryTitle.textContent = this.activeCategoryFilter;
    } else {
      this.activeCategoryTitle.textContent = 'All Courses';
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
        return titleMatch || catMatch || notesMatch;
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
      } else if (this.sortOption === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    this.activeFilterCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'course' : 'courses'}`;

    // Empty state vs Cards grid
    if (filtered.length === 0) {
      this.coursesGrid.innerHTML = '';
      this.emptyState.classList.remove('hidden');

      if (this.searchQuery) {
        if (this.emptyTitle) this.emptyTitle.textContent = 'No Courses Found';
        this.emptyDescription.textContent = `No courses found matching "${this.searchQuery}".`;
        this.emptyResetFilterBtn.classList.remove('hidden');
      } else if (this.activeCategoryFilter !== 'all' || this.activeStatusFilter !== 'all') {
        if (this.emptyTitle) this.emptyTitle.textContent = 'No Courses Found';
        this.emptyDescription.textContent = `No courses in "${this.activeCategoryFilter}" with status "${this.activeStatusFilter}".`;
        this.emptyResetFilterBtn.classList.remove('hidden');
      } else {
        if (this.emptyTitle) this.emptyTitle.textContent = 'No Courses Added Yet';
        this.emptyDescription.textContent = "No courses added yet. Tap '+ Add Course' to get started!";
        this.emptyResetFilterBtn.classList.add('hidden');
      }
      return;
    }

    this.emptyState.classList.add('hidden');
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

    // Find category color
    const catObj = this.categories.find(c => c.name === course.category);
    const catColor = catObj ? catObj.color : '#6366f1';

    // Status Pill Class
    let statusPillClass = 'card-status-want';
    if (course.status === 'In Progress') statusPillClass = 'card-status-progress';
    if (course.status === 'Completed') statusPillClass = 'card-status-completed';

    // Video ID, Playlist ID, and Cover Resolution (Custom Image > Auto YouTube Thumbnail > Default Generic)
    const videoId = course.videoId || this.extractYouTubeVideoId(course.url);
    const playlistId = course.playlistId || this.extractYouTubePlaylistId(course.url);
    const cover = this.resolveCoverThumbnail(course);
    const thumbUrl = cover.url;

    // Thumbnail markup
    let thumbnailHtml = '';
    if (thumbUrl) {
      thumbnailHtml = `
        <div class="card-thumbnail-wrap">
          <img 
            class="card-thumbnail-img" 
            src="${escapeHtml(thumbUrl)}" 
            alt="${escapeHtml(course.title)}" 
            loading="lazy" 
            onerror="if (this.src.includes('hqdefault.jpg')) { this.src = this.src.replace('hqdefault.jpg', 'mqdefault.jpg'); } else { this.style.display='none'; this.nextElementSibling.classList.remove('hidden'); }"
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
          ${cover.isCustom ? `<div class="card-type-badge badge-custom-cover"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Custom Cover</div>` : (playlistId ? `<div class="card-type-badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg> Playlist</div>` : '')}
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
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>
              </div>
            </div>
            <div class="playlist-meta-info">
              <span class="playlist-label">YouTube Playlist</span>
              <span class="playlist-sub">${escapeHtml(course.category)}</span>
            </div>
          </div>
          <div class="card-thumb-overlay">
            <div class="thumb-play-btn">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>
            </div>
          </div>
          <div class="card-type-badge">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>
            Playlist
          </div>
          <div class="card-status-pill ${statusPillClass}">${course.status}</div>
        </div>
      `;
    }

    // Date formatted
    const dateFormatted = new Date(course.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });

    // Notes markup
    const notesHtml = course.notes ? `<div class="card-notes">${escapeHtml(course.notes)}</div>` : '';

    card.innerHTML = `
      ${thumbnailHtml}
      <div class="card-content">
        <div class="card-meta-row">
          <span class="category-tag" style="--cat-color: ${catColor};" data-filter-cat="${escapeHtml(course.category)}">
            # ${escapeHtml(course.category)}
          </span>
          <span class="card-date">${dateFormatted}</span>
        </div>

        <h3 class="card-title" title="${escapeHtml(course.title)}">${escapeHtml(course.title)}</h3>
        ${notesHtml}

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

        <!-- Footer Actions -->
        <div class="card-actions-footer">
          <a href="${escapeHtml(course.url)}" target="_blank" rel="noopener noreferrer" class="btn-watch-yt">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span>Watch on YouTube</span>
          </a>

          <button class="card-icon-action copy-link-btn" title="Copy clean course link" aria-label="Copy course link">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </button>

          <button class="card-icon-action edit-course-btn" title="Edit course" aria-label="Edit course">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>

          <button class="card-icon-action delete-action delete-course-btn" title="Delete course" aria-label="Delete course">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Event Listeners on Card
    // Status segment button
    card.querySelectorAll('.status-segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateCourseStatus(course.id, btn.dataset.setStatus);
      });
    });

    // Category tag filter click
    const tag = card.querySelector('.category-tag');
    if (tag) {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activeCategoryFilter = course.category;
        this.render();
      });
    }

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
    const editBtn = card.querySelector('.edit-course-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.openCourseModal(course);
      });
    }

    // Delete button
    const deleteBtn = card.querySelector('.delete-course-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.confirmDelete(course.id);
      });
    }

    return card;
  }

  // ==========================================================================
  // 9. Toast Notifications System
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
      <span class="toast-msg">${escapeHtml(message)}</span>
    `;

    this.toastStack.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 200);
    }, 3200);
  }
}

// Utility function to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Bootstrap CourseVault on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.courseVault = new CourseVaultApp();
});
