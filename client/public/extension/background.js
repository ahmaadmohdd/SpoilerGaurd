// Background service worker for Spoiler Guard extension

let currentContext = {
  site: 'other',
  season: 1,
  episode: 1,
  timestamp: 0,
  isMovie: false,
  title: '',
  contentId: ''
};

let backendUrl = 'http://localhost:5000';

// Load backend URL from storage
chrome.storage.local.get(['backendUrl'], (result) => {
  if (result.backendUrl) backendUrl = result.backendUrl;
});

// Listen for storage changes to keep backendUrl in sync
chrome.storage.onChanged.addListener((changes) => {
  if (changes.backendUrl?.newValue) {
    backendUrl = changes.backendUrl.newValue;
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CONTEXT_UPDATE') {
    currentContext = { ...currentContext, ...message.context };
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'GET_CONTEXT') {
    sendResponse(currentContext);
    return true;
  }

  if (message.type === 'INGEST_TEXT') {
    // Content script sends subtitle text here; we fetch from the service worker
    // to avoid CORS / mixed-content issues on the page
    const data = message.data;
    fetch(`${backendUrl}/api/ingest/live`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
      console.log(`[SG] Ingested: "${data.text.substring(0, 40)}..." at ${data.timestamp}s`);
    })
    .catch(err => {
      console.error('[SG] Ingest fetch failed:', err.message);
    });

    sendResponse({ success: true });
    return true;
  }
});

console.log("[SG] Background service worker started");
