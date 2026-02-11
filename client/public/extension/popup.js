// Settings popup logic
const backendUrlInput = document.getElementById('backend-url');
const saveBtn = document.getElementById('save-btn');
const statusEl = document.getElementById('status');

// Save settings
saveBtn.addEventListener('click', async () => {
  const backendUrl = backendUrlInput.value.trim() || 'http://localhost:5000';
  await chrome.storage.local.set({ backendUrl });
  statusEl.textContent = 'Settings saved!';
  setTimeout(() => { statusEl.textContent = 'Ready to sync subtitles...'; }, 2000);
});

// Load saved settings
async function init() {
  const result = await chrome.storage.local.get(['backendUrl']);
  if (result.backendUrl) {
    backendUrlInput.value = result.backendUrl;
  }
}

init();
