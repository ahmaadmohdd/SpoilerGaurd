// content.js - Runs on supported streaming sites
console.log("[SG] Spoiler Guard Loaded");

let lastSubtitle = "";
let season = 1;
let episode = 1;
let currentSite = detectSite();
let lastTimestamp = 0;
let isMovie = false;
let contentTitle = "";
let contentId = "";

// Sidebar variables (must be declared before extractMetadata() runs)
let sidebarContainer = null;
let sidebarFrame = null;
let fabButton = null;
let sidebarOpen = false;
const SIDEBAR_WIDTH = 350;

function detectSite() {
  const host = window.location.hostname;
  if (host.includes('disneyplus.com')) return 'disney';
  if (host.includes('netflix.com')) return 'netflix';
  return 'generic';
}

// Site-specific selectors
const SELECTORS = {
  disney: {
    metadata: '.title-field, .metadata-field, .subtitle-metadata, [data-testid="title-metadata"], .btm-media-overlays-container',
    subtitles: '.shaka-text-container, .dplus-native-subtitles-container, *[class*="subtitle"], *[class*="caption"], *[class*="cue"], *[class*="text-container"]',
    episodePattern: /S(\d+)\s*[:\-]?\s*E(\d+)/i,
    titleSelector: '[data-testid="details-title"], .title-field, h1'
  },
  netflix: {
    metadata: '.video-title span, .ellipsize-text, [data-uia="video-title"], .player-title',
    subtitles: '.player-timedtext, .player-timedtext-text-container, [class*="player-timedtext"]',
    episodePattern: /S(\d+)\s*[:\-]?\s*E(\d+)|Season\s*(\d+).*Episode\s*(\d+)/i,
    titleSelector: '[data-uia="video-title"], .video-title, .title'
  },
  generic: {
    metadata: '*[class*="title"], *[class*="episode"], *[class*="season"]',
    subtitles: '*[class*="subtitle"], *[class*="caption"], *[class*="timedtext"]',
    episodePattern: /S(\d+)\s*[:\-]?\s*E(\d+)|Season\s*(\d+).*Episode\s*(\d+)/i,
    titleSelector: 'h1, .title'
  }
};

// Extract title from URL (most reliable for Disney+ and Netflix)
function getTitleFromUrl() {
  const url = window.location.pathname;

  // Disney+: /ae/movies/iron-man/... or /ae/shows/family-guy/...
  const disneyMatch = url.match(/\/(movies|shows)\/([^/]+)/);
  if (disneyMatch) {
    // Convert slug to title: "iron-man" -> "Iron Man"
    return disneyMatch[2]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // Netflix: /watch/... with title in page
  // (Netflix URLs don't contain the title, so return null)
  return null;
}

// Detect if content is movie or series
function detectContentType() {
  const selectors = SELECTORS[currentSite] || SELECTORS.generic;

  // 1. Try DOM-based title detection
  let domTitle = '';
  const titleEl = document.querySelector(selectors.titleSelector);
  if (titleEl) {
    domTitle = titleEl.innerText?.trim() || '';
  }

  // 2. Try URL-based title detection (more reliable)
  const urlTitle = getTitleFromUrl();

  // Use DOM title if available, URL title as fallback
  contentTitle = domTitle || urlTitle || contentTitle;

  if (contentTitle) {
    console.log(`[SG] Title detected: "${contentTitle}" (source: ${domTitle ? 'DOM' : 'URL'})`);
  }

  // Check for season/episode indicators
  const metadataEls = document.querySelectorAll(selectors.metadata);
  let foundEpisodeInfo = false;

  for (const el of metadataEls) {
    const text = el.innerText || el.textContent || '';
    const match = text.match(selectors.episodePattern);
    if (match) {
      season = parseInt(match[1] || match[3]) || 1;
      episode = parseInt(match[2] || match[4]) || 1;
      foundEpisodeInfo = true;
      console.log(`[SG] Detected: Season ${season}, Episode ${episode}`);
      break;
    }
  }

  // Also check URL for season/episode
  if (!foundEpisodeInfo) {
    const urlSeMatch = window.location.pathname.match(/[Ss](\d+)[Ee](\d+)/);
    if (urlSeMatch) {
      season = parseInt(urlSeMatch[1]) || 1;
      episode = parseInt(urlSeMatch[2]) || 1;
      foundEpisodeInfo = true;
    }
  }

  isMovie = !foundEpisodeInfo;

  // Disney+ URL hint: /movies/ = movie, /shows/ = series
  if (currentSite === 'disney') {
    const path = window.location.pathname;
    if (path.includes('/movies/')) isMovie = true;
    if (path.includes('/shows/')) isMovie = false;
  }

  if (currentSite === 'netflix' && window.netflix?.reactContext?.models?.video) {
    try {
      const videoData = window.netflix.reactContext.models.video;
      if (videoData.type === 'movie') isMovie = true;
    } catch (e) {}
  }

  console.log(`[SG] Content: ${isMovie ? 'Movie' : 'Series'} - "${contentTitle}"`);
}

function extractMetadata() {
  detectContentType();
  sendContextToBackground();
  sendContextToSidebar();
}

setInterval(extractMetadata, 5000);
extractMetadata();

// Load manual overrides from storage
chrome.storage.local.get(['manualSeason', 'manualEpisode', 'useManual'], (result) => {
  if (result.useManual) {
    season = result.manualSeason || 1;
    episode = result.manualEpisode || 1;
    console.log(`[SG] Using manual settings: Season ${season}, Episode ${episode}`);
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.useManual?.newValue) {
    chrome.storage.local.get(['manualSeason', 'manualEpisode'], (result) => {
      season = result.manualSeason || 1;
      episode = result.manualEpisode || 1;
      console.log(`[SG] Manual override: Season ${season}, Episode ${episode}`);
      sendContextToBackground();
      sendContextToSidebar();
    });
  }
});

// ---- Video timestamp tracking ----
let videoTrackingInitialized = false;
let currentVideoElement = null;
let cueTrackingInitialized = false;

function setupVideoTracking() {
  const video = document.querySelector('video');
  if (!video) {
    setTimeout(setupVideoTracking, 1000);
    return;
  }

  if (videoTrackingInitialized && currentVideoElement === video) return;

  if (currentVideoElement && currentVideoElement !== video) {
    currentVideoElement.removeEventListener('timeupdate', onTimeUpdate);
  }

  currentVideoElement = video;
  videoTrackingInitialized = true;
  video.addEventListener('timeupdate', onTimeUpdate);
  console.log('[SG] Video tracking initialized');

  setupCueTracking(video);
}

function onTimeUpdate() {
  if (!currentVideoElement) return;
  const newTimestamp = Math.floor(currentVideoElement.currentTime);
  if (newTimestamp !== lastTimestamp) {
    lastTimestamp = newTimestamp;
    if (newTimestamp % 5 === 0) {
      sendContextToBackground();
      sendContextToSidebar();
    }
  }
}

// ---- VTTCue subtitle detection ----
function setupCueTracking(video) {
  if (cueTrackingInitialized) return;

  function attachCueListeners() {
    const tracks = video.textTracks;
    if (!tracks || tracks.length === 0) {
      setTimeout(() => attachCueListeners(), 2000);
      return;
    }

    console.log(`[SG] Found ${tracks.length} text tracks`);

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      console.log(`[SG] Track ${i}: kind=${track.kind}, label=${track.label}, mode=${track.mode}`);

      if (track.kind === 'subtitles' || track.kind === 'captions') {
        if (track.mode === 'disabled') {
          console.log(`[SG] Track ${i} is disabled, skipping`);
          continue;
        }

        track.addEventListener('cuechange', () => {
          const cues = track.activeCues;
          if (cues && cues.length > 0) {
            const text = Array.from(cues).map(c => c.text).join(' ').trim();
            if (text && text !== lastSubtitle && text.length > 0) {
              lastSubtitle = text;
              const timestamp = Math.floor(video.currentTime);
              console.log(`[SG] Cue subtitle: "${text.substring(0, 50)}..." at ${timestamp}s`);
              sendIngest(text, timestamp);
            }
          }
        });
        console.log(`[SG] Attached cuechange listener to track ${i}`);
      }
    }
    cueTrackingInitialized = true;
  }

  video.textTracks.addEventListener('addtrack', (e) => {
    console.log(`[SG] New text track added: kind=${e.track.kind}, label=${e.track.label}`);
    cueTrackingInitialized = false;
    attachCueListeners();
  });

  attachCueListeners();
}

// ---- Send context to background ----
function sendContextToBackground() {
  chrome.runtime.sendMessage({
    type: 'CONTEXT_UPDATE',
    context: { site: currentSite, season, episode, timestamp: lastTimestamp, isMovie, title: contentTitle, contentId }
  }).catch(() => {});
}

// ---- Send context to sidebar via chrome.storage (reliable cross-origin) ----
function sendContextToSidebar() {
  chrome.storage.local.set({
    currentContext: { season, episode, timestamp: lastTimestamp, isMovie, title: contentTitle, contentId, site: currentSite }
  });
}

// ---- DOM subtitle observer (fallback) ----
const observer = new MutationObserver(() => {
  const selectors = SELECTORS[currentSite] || SELECTORS.generic;
  const subtitleEl = document.querySelector(selectors.subtitles);
  if (subtitleEl) {
    const text = subtitleEl.innerText?.trim() || subtitleEl.textContent?.trim() || '';
    if (text && text !== lastSubtitle && text.length > 0) {
      lastSubtitle = text;
      const video = document.querySelector('video');
      const timestamp = video ? Math.floor(video.currentTime) : lastTimestamp;
      console.log(`[SG] DOM subtitle: "${text.substring(0, 50)}..." at ${timestamp}s`);
      sendIngest(text, timestamp);
    }
  }
});

observer.observe(document.body, { subtree: true, childList: true, characterData: true });

// ---- Send ingest via background (avoids CORS) ----
function sendIngest(text, timestamp) {
  chrome.runtime.sendMessage({
    type: 'INGEST_TEXT',
    data: { text, season, episode, timestamp, source: currentSite, isMovie, title: contentTitle, content_id: contentId }
  }).catch((err) => {
    console.error('[SG] Failed to send ingest message:', err);
  });
}

// ---- Injected Sidebar ----
function createSidebar() {
  // Container: fixed on right side, full height
  sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'spoilerguard-sidebar';
  sidebarContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: ${SIDEBAR_WIDTH}px;
    height: 100vh;
    z-index: 2147483645;
    transform: translateX(${SIDEBAR_WIDTH}px);
    transition: transform 0.3s ease-in-out;
    box-shadow: -4px 0 20px rgba(0,0,0,0.5);
    background: #1a1d29;
  `;

  // Iframe pointing to extension's sidebar.html (chrome-extension:// URL)
  sidebarFrame = document.createElement('iframe');
  sidebarFrame.src = chrome.runtime.getURL('sidebar.html');
  sidebarFrame.style.cssText = `
    width: 100%; height: 100%; border: none; background: #1a1d29;
  `;
  sidebarFrame.setAttribute('allow', 'clipboard-read; clipboard-write');

  sidebarContainer.appendChild(sidebarFrame);
  document.body.appendChild(sidebarContainer);

  // Send context once sidebar iframe loads
  sidebarFrame.addEventListener('load', () => {
    setTimeout(sendContextToSidebar, 500);
  });
}

function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  if (sidebarContainer) {
    sidebarContainer.style.transform = sidebarOpen ? 'translateX(0)' : `translateX(${SIDEBAR_WIDTH}px)`;
  }
  // Move FAB to stay visible
  if (fabButton) {
    fabButton.style.right = sidebarOpen ? `${SIDEBAR_WIDTH + 12}px` : '24px';
  }
}

function createFabButton() {
  fabButton = document.createElement('div');
  fabButton.id = 'spoilerguard-fab';
  fabButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  fabButton.style.cssText = `
    position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
    width: 48px; height: 48px; border-radius: 50%;
    background: #0072d2; color: white; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 2147483646;
    box-shadow: 0 4px 16px rgba(0,114,210,0.4);
    transition: right 0.3s ease-in-out, transform 0.2s, box-shadow 0.2s;
  `;
  fabButton.addEventListener('mouseenter', () => {
    fabButton.style.transform = 'translateY(-50%) scale(1.1)';
    fabButton.style.boxShadow = '0 6px 20px rgba(0,114,210,0.6)';
  });
  fabButton.addEventListener('mouseleave', () => {
    fabButton.style.transform = 'translateY(-50%) scale(1)';
    fabButton.style.boxShadow = '0 4px 16px rgba(0,114,210,0.4)';
  });
  fabButton.addEventListener('click', toggleSidebar);
  document.body.appendChild(fabButton);
}

// ---- Initialize ----
function init() {
  setupVideoTracking();
  sendContextToBackground();
  createSidebar();
  createFabButton();

  // Re-init on SPA navigation
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => {
        extractMetadata();
        setupVideoTracking();
        cueTrackingInitialized = false;
      }, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
