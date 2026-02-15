// Self-contained sidebar — left content panel + right chat

// ---- MCU Sort Order Maps ----
// Release date order (96 entries) — position = sort priority
const MCU_RELEASE_ORDER = {
  'iron_man_2008': 1, 'iron_man': 1,
  'the_incredible_hulk_2008': 2, 'the_incredible_hulk': 2,
  'iron_man_2_2010': 3, 'iron_man_2': 3, 'iron_man_2010': 3,
  'thor_2011': 4,
  'captain_america_the_first_avenger_2011': 5, 'captain_america_the_first_avenger': 5,
  'the_consultant_2011': 6, 'the_consultant': 6,
  'a_funny_thing_happened_on_the_way_to_thor_s_hammer_2011': 7,
  'the_avengers_2012': 8, 'the_avengers': 8, 'avengers_assemble': 8,
  'item_47_2012': 9, 'item_47': 9,
  'iron_man_3_2013': 10, 'iron_man_3': 10, 'iron_man_2013': 10,
  'agent_carter_one_shot_2013': 11,
  'thor_the_dark_world_2013': 13, 'thor_the_dark_world': 13,
  'all_hail_the_king_2014': 14, 'all_hail_the_king': 14,
  'captain_america_the_winter_soldier_2014': 15, 'captain_america_the_winter_soldier': 15,
  'guardians_of_the_galaxy_2014': 16, 'guardians_of_the_galaxy': 16,
  'avengers_age_of_ultron_2015': 20, 'avengers_age_of_ultron': 20,
  'ant_man_2015': 21, 'ant_man': 21,
  'captain_america_civil_war_2016': 26, 'captain_america_civil_war': 26,
  'team_thor_2016': 27, 'team_thor': 27,
  'doctor_strange_2016': 30, 'doctor_strange': 30,
  'team_thor_part_2_2017': 31, 'team_thor_part_2': 31,
  'guardians_of_the_galaxy_vol_2_2017': 33, 'guardians_of_the_galaxy_vol_2': 33,
  'spider_man_homecoming_2017': 34, 'spider_man_homecoming': 34,
  'thor_ragnarok_2017': 37, 'thor_ragnarok': 37,
  'black_panther_2018': 41, 'black_panther': 41,
  'team_darryl_2018': 42, 'team_darryl': 42,
  'avengers_infinity_war_2018': 44, 'avengers_infinity_war': 44,
  'ant_man_and_the_wasp_2018': 47, 'ant_man_and_the_wasp': 47,
  'captain_marvel_2019': 52, 'captain_marvel': 52,
  'avengers_endgame_2019': 54, 'avengers_endgame': 54,
  'spider_man_far_from_home_2019': 57, 'spider_man_far_from_home': 57,
  'black_widow_2021': 63, 'black_widow': 63,
  'shang_chi_and_the_legend_of_the_ten_rings_2021': 65, 'shang_chi_and_the_legend_of_the_ten_rings': 65, 'shang_chi': 65,
  'eternals_2021': 66, 'eternals': 66,
  'spider_man_no_way_home_2021': 68, 'spider_man_no_way_home': 68,
  'doctor_strange_in_the_multiverse_of_madness_2022': 70, 'doctor_strange_in_the_multiverse_of_madness': 70,
  'thor_love_and_thunder_2022': 72, 'thor_love_and_thunder': 72,
  'werewolf_by_night_2022': 75, 'werewolf_by_night': 75,
  'black_panther_wakanda_forever_2022': 76, 'black_panther_wakanda_forever': 76,
  'the_guardians_of_the_galaxy_holiday_special_2022': 77, 'the_guardians_of_the_galaxy_holiday_special': 77,
  'ant_man_and_the_wasp_quantumania_2023': 78, 'ant_man_and_the_wasp_quantumania': 78,
  'guardians_of_the_galaxy_vol_3_2023': 79, 'guardians_of_the_galaxy_vol_3': 79,
  'the_marvels_2023': 83, 'the_marvels': 83,
  'echo_2024': 85, 'echo': 85,
  'deadpool_wolverine_2024': 86, 'deadpool_wolverine': 86, 'deadpool_and_wolverine': 86,
  'captain_america_brave_new_world_2025': 89, 'captain_america_brave_new_world': 89,
  'thunderbolts_2025': 91, 'thunderbolts': 91,
  'the_fantastic_four_first_steps_2025': 93, 'the_fantastic_four_first_steps': 93,
  'eyes_of_wakanda_2025': 94, 'eyes_of_wakanda': 94,
  'marvel_zombies_2025': 95, 'marvel_zombies': 95,
  'wonder_man_2026': 96, 'wonder_man': 96
};

const MCU_CHRONO_ORDER = {
  'eyes_of_wakanda_2025': 1, 'eyes_of_wakanda': 1,
  'captain_america_the_first_avenger_2011': 2, 'captain_america_the_first_avenger': 2,
  'agent_carter_one_shot_2013': 3,
  'captain_marvel_2019': 6, 'captain_marvel': 6,
  'iron_man_2008': 7, 'iron_man': 7,
  'iron_man_2_2010': 8, 'iron_man_2': 8, 'iron_man_2010': 8,
  'the_incredible_hulk_2008': 9, 'the_incredible_hulk': 9,
  'the_consultant_2011': 10, 'the_consultant': 10,
  'a_funny_thing_happened_on_the_way_to_thor_s_hammer_2011': 11,
  'thor_2011': 12,
  'the_avengers_2012': 13, 'the_avengers': 13, 'avengers_assemble': 13,
  'item_47_2012': 14, 'item_47': 14,
  'thor_the_dark_world_2013': 23, 'thor_the_dark_world': 23,
  'iron_man_3_2013': 24, 'iron_man_3': 24, 'iron_man_2013': 24,
  'all_hail_the_king_2014': 25, 'all_hail_the_king': 25,
  'captain_america_the_winter_soldier_2014': 26, 'captain_america_the_winter_soldier': 26,
  'guardians_of_the_galaxy_2014': 27, 'guardians_of_the_galaxy': 27,
  'guardians_of_the_galaxy_vol_2_2017': 28, 'guardians_of_the_galaxy_vol_2': 28,
  'daredevil_2018': 31, 'daredevil': 31,
  'avengers_age_of_ultron_2015': 37, 'avengers_age_of_ultron': 37,
  'ant_man_2015': 40, 'ant_man': 40,
  'captain_america_civil_war_2016': 43, 'captain_america_civil_war': 43,
  'team_thor_2016': 44, 'team_thor': 44,
  'team_thor_part_2_2017': 45, 'team_thor_part_2': 45,
  'black_widow_2021': 46, 'black_widow': 46,
  'doctor_strange_2016': 48, 'doctor_strange': 48,
  'black_panther_2018': 49, 'black_panther': 49,
  'spider_man_homecoming_2017': 50, 'spider_man_homecoming': 50,
  'thor_ragnarok_2017': 51, 'thor_ragnarok': 51,
  'team_darryl_2018': 52, 'team_darryl': 52,
  'ant_man_and_the_wasp_2018': 61, 'ant_man_and_the_wasp': 61,
  'avengers_infinity_war_2018': 62, 'avengers_infinity_war': 62,
  'avengers_endgame_2019': 63, 'avengers_endgame': 63,
  'marvel_zombies_2025': 69, 'marvel_zombies': 69,
  'deadpool_wolverine_2024': 71, 'deadpool_wolverine': 71, 'deadpool_and_wolverine': 71,
  'shang_chi_and_the_legend_of_the_ten_rings_2021': 72, 'shang_chi_and_the_legend_of_the_ten_rings': 72, 'shang_chi': 72,
  'eternals_2021': 74, 'eternals': 74,
  'spider_man_far_from_home_2019': 75, 'spider_man_far_from_home': 75,
  'spider_man_no_way_home_2021': 76, 'spider_man_no_way_home': 76,
  'doctor_strange_in_the_multiverse_of_madness_2022': 77, 'doctor_strange_in_the_multiverse_of_madness': 77,
  'black_panther_wakanda_forever_2022': 80, 'black_panther_wakanda_forever': 80,
  'echo_2024': 81, 'echo': 81,
  'thor_love_and_thunder_2022': 84, 'thor_love_and_thunder': 84,
  'werewolf_by_night_2022': 86, 'werewolf_by_night': 86,
  'the_guardians_of_the_galaxy_holiday_special_2022': 87, 'the_guardians_of_the_galaxy_holiday_special': 87,
  'ant_man_and_the_wasp_quantumania_2023': 88, 'ant_man_and_the_wasp_quantumania': 88,
  'guardians_of_the_galaxy_vol_3_2023': 89, 'guardians_of_the_galaxy_vol_3': 89,
  'the_marvels_2023': 91, 'the_marvels': 91,
  'captain_america_brave_new_world_2025': 94, 'captain_america_brave_new_world': 94,
  'thunderbolts_2025': 95, 'thunderbolts': 95,
  'the_fantastic_four_first_steps_2025': 96, 'the_fantastic_four_first_steps': 96,
  'wonder_man_2026': 97, 'wonder_man': 97
};

// Display name overrides — maps slugified backend title → clean UI name
const DISPLAY_NAMES = {
  'iron_man_2008': "Marvel Studios' Iron Man",
  'iron_man': "Marvel Studios' Iron Man",
  'the_incredible_hulk_2008': 'The Incredible Hulk',
  'the_incredible_hulk': 'The Incredible Hulk',
  'iron_man_2010': 'Iron Man 2',
  'iron_man_2_2010': 'Iron Man 2',
  'iron_man_2': 'Iron Man 2',
  'iron_man_2013': 'Iron Man 3',
  'iron_man_3_2013': 'Iron Man 3',
  'iron_man_3': 'Iron Man 3',
  'thor_2011': 'Thor',
  'captain_america_the_first_avenger_2011': 'Captain America: The First Avenger',
  'captain_america_the_first_avenger': 'Captain America: The First Avenger',
  'the_avengers_2012': 'The Avengers',
  'the_avengers': 'The Avengers',
  'thor_the_dark_world_2013': 'Thor: The Dark World',
  'thor_the_dark_world': 'Thor: The Dark World',
  'captain_america_the_winter_soldier_2014': 'Captain America: The Winter Soldier',
  'captain_america_the_winter_soldier': 'Captain America: The Winter Soldier',
  'guardians_of_the_galaxy_2014': 'Guardians of the Galaxy',
  'guardians_of_the_galaxy': 'Guardians of the Galaxy',
  'avengers_age_of_ultron_2015': 'Avengers: Age of Ultron',
  'avengers_age_of_ultron': 'Avengers: Age of Ultron',
  'ant_man_2015': 'Ant-Man',
  'ant_man': 'Ant-Man',
  'captain_america_civil_war_2016': 'Captain America: Civil War',
  'captain_america_civil_war': 'Captain America: Civil War',
  'doctor_strange_2016': 'Doctor Strange',
  'doctor_strange': 'Doctor Strange',
  'guardians_of_the_galaxy_vol_2_2017': 'Guardians of the Galaxy Vol. 2',
  'guardians_of_the_galaxy_vol_2': 'Guardians of the Galaxy Vol. 2',
  'spider_man_homecoming_2017': 'Spider-Man: Homecoming',
  'spider_man_homecoming': 'Spider-Man: Homecoming',
  'thor_ragnarok_2017': 'Thor: Ragnarok',
  'thor_ragnarok': 'Thor: Ragnarok',
  'black_panther_2018': 'Black Panther',
  'black_panther': 'Black Panther',
  'avengers_infinity_war_2018': 'Avengers: Infinity War',
  'avengers_infinity_war': 'Avengers: Infinity War',
  'ant_man_and_the_wasp_2018': 'Ant-Man and the Wasp',
  'ant_man_and_the_wasp': 'Ant-Man and the Wasp',
  'captain_marvel_2019': 'Captain Marvel',
  'captain_marvel': 'Captain Marvel',
  'avengers_endgame_2019': 'Avengers: Endgame',
  'avengers_endgame': 'Avengers: Endgame',
  'spider_man_far_from_home_2019': 'Spider-Man: Far From Home',
  'spider_man_far_from_home': 'Spider-Man: Far From Home',
  'black_widow_2021': 'Black Widow',
  'black_widow': 'Black Widow',
  'shang_chi_and_the_legend_of_the_ten_rings_2021': 'Shang-Chi and the Legend of the Ten Rings',
  'shang_chi_and_the_legend_of_the_ten_rings': 'Shang-Chi and the Legend of the Ten Rings',
  'shang_chi': 'Shang-Chi and the Legend of the Ten Rings',
  'eternals_2021': 'Eternals',
  'eternals': 'Eternals',
  'spider_man_no_way_home_2021': 'Spider-Man: No Way Home',
  'spider_man_no_way_home': 'Spider-Man: No Way Home',
  'doctor_strange_in_the_multiverse_of_madness_2022': 'Doctor Strange in the Multiverse of Madness',
  'doctor_strange_in_the_multiverse_of_madness': 'Doctor Strange in the Multiverse of Madness',
  'thor_love_and_thunder_2022': 'Thor: Love and Thunder',
  'thor_love_and_thunder': 'Thor: Love and Thunder',
  'werewolf_by_night_2022': 'Werewolf by Night',
  'werewolf_by_night': 'Werewolf by Night',
  'black_panther_wakanda_forever_2022': 'Black Panther: Wakanda Forever',
  'black_panther_wakanda_forever': 'Black Panther: Wakanda Forever',
  'the_guardians_of_the_galaxy_holiday_special_2022': 'The Guardians of the Galaxy Holiday Special',
  'the_guardians_of_the_galaxy_holiday_special': 'The Guardians of the Galaxy Holiday Special',
  'ant_man_and_the_wasp_quantumania_2023': 'Ant-Man and the Wasp: Quantumania',
  'ant_man_and_the_wasp_quantumania': 'Ant-Man and the Wasp: Quantumania',
  'guardians_of_the_galaxy_vol_3_2023': 'Guardians of the Galaxy Vol. 3',
  'guardians_of_the_galaxy_vol_3': 'Guardians of the Galaxy Vol. 3',
  'the_marvels_2023': 'The Marvels',
  'the_marvels': 'The Marvels',
  'echo_2024': 'Echo',
  'deadpool_wolverine_2024': 'Deadpool & Wolverine',
  'deadpool_wolverine': 'Deadpool & Wolverine',
  'deadpool_and_wolverine': 'Deadpool & Wolverine',
  'captain_america_brave_new_world_2025': 'Captain America: Brave New World',
  'captain_america_brave_new_world': 'Captain America: Brave New World',
  'thunderbolts_2025': 'Thunderbolts*',
  'thunderbolts': 'Thunderbolts*',
  'the_fantastic_four_first_steps_2025': 'The Fantastic Four: First Steps',
  'the_fantastic_four_first_steps': 'The Fantastic Four: First Steps',
  'eyes_of_wakanda_2025': 'Eyes of Wakanda',
  'eyes_of_wakanda': 'Eyes of Wakanda',
  'marvel_zombies_2025': 'Marvel Zombies',
  'marvel_zombies': 'Marvel Zombies',
  'wonder_man_2026': 'Wonder Man',
  'wonder_man': 'Wonder Man',
};

function getDisplayName(title) {
  const slug = slugifyTitle(title);
  return DISPLAY_NAMES[slug] || title;
}

function slugifyTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function getItemSortKey(title, orderMap) {
  const slug = slugifyTitle(title);
  // Direct match
  if (orderMap[slug] !== undefined) return orderMap[slug];
  // Partial match — find longest matching key
  let bestPos = Infinity, bestLen = 0;
  for (const [key, pos] of Object.entries(orderMap)) {
    if ((slug.includes(key) || key.includes(slug)) && key.length > bestLen) {
      bestPos = pos;
      bestLen = key.length;
    }
  }
  return bestPos;
}
const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const contextText = document.getElementById('context-text');
const panelToggle = document.getElementById('panel-toggle');
const contentSidebar = document.getElementById('content-sidebar');
const contentListEl = document.getElementById('content-list');
const reloadBtn = document.getElementById('reload-btn');
const universeSection = document.getElementById('universe-section');
const universeBtn = document.getElementById('universe-btn');
const universeBtnText = document.getElementById('universe-btn-text');
const universeDropdown = document.getElementById('universe-dropdown');
const nowPlayingEl = document.getElementById('now-playing');
const npTitleEl = document.getElementById('np-title');
const npMatchedEl = document.getElementById('np-matched');
const contentSearchEl = document.getElementById('content-search');
const searchClearBtn = document.getElementById('search-clear');
const siteBadgeEl = document.getElementById('site-badge');

let backendUrl = 'http://localhost:5000';
let isPending = false;
let sidebarOpen = true; // content sidebar open by default
let contentData = null;
let selectedUniverse = '';
let expandedSeries = new Set();
let expandedSeasons = new Set(); // Key: "contentId:season"
let universeDropdownOpen = false;
// Track which items are enabled (toggled on). Key: "contentId:season:episode"
let enabledItems = new Set();
let searchQuery = '';
let sortMode = 'release'; // 'release' or 'chrono'

// Current context
let ctx = {
  season: 1,
  episode: 1,
  timestamp: 0,
  isMovie: false,
  title: '',
  contentId: '',
  site: ''
};

// SVG icons
const CLOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const FILM_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="22" y2="7"/><line x1="2" y1="17" x2="22" y2="17"/></svg>`;
const TV_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`;
const CHEVRON_DOWN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
const CHEVRON_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const CHECK_ICON = `<svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const BOT_AVATAR = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 20v-4"/><path d="M18 20v-4"/></svg>`;
const USER_AVATAR = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const ALERT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const EYE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

// ---- Init ----
chrome.storage.local.get(['backendUrl', 'currentContext'], (result) => {
  if (result.backendUrl) backendUrl = result.backendUrl;
  if (result.currentContext) {
    ctx = { ...ctx, ...result.currentContext };
    updateContextBar();
    updateNowPlaying();
    updateSiteBadge();
  }
  fetchContent();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.backendUrl?.newValue) backendUrl = changes.backendUrl.newValue;
  if (changes.currentContext?.newValue) {
    const prev = ctx.title;
    ctx = { ...ctx, ...changes.currentContext.newValue };
    updateContextBar();
    updateNowPlaying();
    updateSiteBadge();
    if (ctx.title && ctx.title !== prev && contentData) {
      resolveContentId();
      renderContentList();
    }
  }
});

// ---- Content Sidebar Toggle ----
const csCloseBtn = document.getElementById('cs-close-btn');

function toggleContentSidebar() {
  sidebarOpen = !sidebarOpen;
  contentSidebar.classList.toggle('open', sidebarOpen);
  panelToggle.classList.toggle('active', sidebarOpen);
}

panelToggle.addEventListener('click', toggleContentSidebar);
csCloseBtn.addEventListener('click', toggleContentSidebar);

// Start closed so chat is visible first
sidebarOpen = false;

// ---- Universe dropdown toggle ----
universeBtn.addEventListener('click', () => {
  universeDropdownOpen = !universeDropdownOpen;
  universeDropdown.classList.toggle('open', universeDropdownOpen);
});

function selectUniverse(name) {
  selectedUniverse = name;
  universeBtnText.textContent = name;
  universeDropdownOpen = false;
  universeDropdown.classList.remove('open');
  renderUniverseDropdown();
  updateSortToggleVisibility();
  renderContentList();
}

// ---- Search ----
contentSearchEl.addEventListener('input', () => {
  searchQuery = contentSearchEl.value.trim().toLowerCase();
  searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
  renderContentList();
});
searchClearBtn.addEventListener('click', () => {
  contentSearchEl.value = '';
  searchQuery = '';
  searchClearBtn.classList.remove('visible');
  renderContentList();
});

function matchesSearch(title) {
  if (!searchQuery) return true;
  return title.toLowerCase().includes(searchQuery) || getDisplayName(title).toLowerCase().includes(searchQuery);
}

// ---- Sort Toggle ----
const sortToggleEl = document.getElementById('sort-toggle');

sortToggleEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cs-sort-btn');
  if (!btn) return;
  sortMode = btn.dataset.sort;
  sortToggleEl.querySelectorAll('.cs-sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort === sortMode));
  renderContentList();
});

function updateSortToggleVisibility() {
  const isMarvel = selectedUniverse.toLowerCase().includes('marvel');
  sortToggleEl.classList.toggle('visible', isMarvel);
}

// ---- Fetch content from backend ----
async function fetchContent() {
  try {
    const res = await fetch(`${backendUrl}/api/content`);
    if (!res.ok) {
      contentListEl.innerHTML = '<div class="cs-empty">Could not load content</div>';
      return;
    }
    contentData = await res.json();
    const universes = contentData.universes || [];

    // Auto-select first universe
    if (!selectedUniverse && universes.length > 0) {
      selectedUniverse = universes[0].name;
    }

    // Always show universe selector
    universeSection.classList.add('visible');

    universeBtnText.textContent = selectedUniverse || 'Select...';
    renderUniverseDropdown();
    updateSortToggleVisibility();
    initEnabledItems();
    resolveContentId();
    renderContentList();
    updateNowPlaying();
  } catch (e) {
    contentListEl.innerHTML = '<div class="cs-empty">Could not reach backend</div>';
  }
}

// ---- Reload knowledge base ----
reloadBtn.addEventListener('click', async () => {
  reloadBtn.classList.add('spinning');
  try {
    await fetch(`${backendUrl}/api/ingest/reload`, { method: 'POST' });
    await fetchContent();
  } catch (e) {}
  reloadBtn.classList.remove('spinning');
});

// ---- Render universe dropdown options ----
function renderUniverseDropdown() {
  if (!contentData) return;
  const universes = contentData.universes || [];
  universeDropdown.innerHTML = '';
  for (const u of universes) {
    const btn = document.createElement('button');
    btn.className = 'cs-universe-opt' + (u.name === selectedUniverse ? ' active' : '');
    btn.innerHTML = `${CHECK_ICON}<span>${escapeHtml(u.name)}</span>`;
    btn.addEventListener('click', () => selectUniverse(u.name));
    universeDropdown.appendChild(btn);
  }
}

// ---- Fuzzy match detected title to content_id ----
function normalize(s) {
  return s.toLowerCase().replace(/[_\-]/g, ' ').replace(/\b\d{4}\b/g, '').replace(/\s+/g, ' ').trim();
}

function resolveContentId() {
  if (!contentData || !ctx.title) return;
  const detected = normalize(ctx.title);
  for (const universe of contentData.universes || []) {
    for (const content of universe.content) {
      for (const item of content.items) {
        const title = normalize(item.title);
        if (title.includes(detected) || detected.includes(title)) {
          ctx.contentId = content.content_id;
          ctx.season = item.season;
          ctx.episode = item.episode;
          selectedUniverse = universe.name;
          universeBtnText.textContent = universe.name;
          renderUniverseDropdown();
          return;
        }
      }
    }
  }
}

// ---- Now Playing section ----
function updateNowPlaying() {
  if (ctx.title) {
    nowPlayingEl.classList.add('visible');
    npTitleEl.textContent = getDisplayName(ctx.title);
    // Check if matched
    if (ctx.contentId && contentData) {
      npMatchedEl.textContent = 'Matched with knowledge base';
    } else {
      npMatchedEl.textContent = '';
    }
  } else {
    nowPlayingEl.classList.remove('visible');
  }
}

// ---- Item key helper ----
function itemKey(cid, s, e) { return `${cid}:${s}:${e}`; }

// Enable all items for a content group
function enableAllItems(content) {
  for (const item of content.items) {
    enabledItems.add(itemKey(content.content_id, item.season, item.episode));
  }
}

// Initialize enabled set — enable everything on first load
function initEnabledItems() {
  if (!contentData) return;
  enabledItems.clear();
  for (const u of contentData.universes || []) {
    for (const c of u.content) {
      enableAllItems(c);
    }
  }
}

function renderSeriesHtml(content) {
  const filteredItems = content.items.filter(i => matchesSearch(content.title) || matchesSearch(i.title || `S${i.season}E${i.episode}`));
  const seriesMatches = matchesSearch(content.title);
  if (searchQuery && !seriesMatches && filteredItems.length === 0) return '';
  const isExpanded = expandedSeries.has(content.content_id) || (searchQuery && filteredItems.length > 0);
  const itemsToShow = searchQuery && !seriesMatches ? filteredItems : content.items;
  const allOn = itemsToShow.every(i => enabledItems.has(itemKey(content.content_id, i.season, i.episode)));
  let html = `<button class="cs-series-header" data-toggle="${escapeHtml(content.content_id)}">
    ${isExpanded ? CHEVRON_DOWN : CHEVRON_RIGHT}
    ${TV_ICON}
    <span>${escapeHtml(content.title)}</span>
    <span class="ep-count">(${content.items.length} ep)</span>
  </button>`;
  if (isExpanded) {
    html += `<div class="cs-episodes">
      <div class="cs-section-header" style="padding:0 6px;">
        <span></span>
        <button class="cs-select-all" data-cid="${escapeHtml(content.content_id)}" data-type="series">${allOn ? 'Deselect All' : 'Select All'}</button>
      </div>`;
    const seasons = groupBySeason(itemsToShow);
    for (const { season, episodes } of seasons) {
      const seasonKey = `${content.content_id}:${season}`;
      const seasonExpanded = expandedSeasons.has(seasonKey) || (searchQuery && episodes.length > 0);
      const seasonAllOn = episodes.every(i => enabledItems.has(itemKey(content.content_id, i.season, i.episode)));
      html += `<button class="cs-season-header" data-season-toggle="${escapeHtml(seasonKey)}">
        <div class="cs-season-header-left">
          ${seasonExpanded ? CHEVRON_DOWN : CHEVRON_RIGHT}
          <span>Season ${season}</span>
          <span class="ep-count">(${episodes.length} ep)</span>
        </div>
        <button class="cs-season-select-all" data-season-cid="${escapeHtml(content.content_id)}" data-season-num="${season}">${seasonAllOn ? 'Deselect' : 'Select All'}</button>
      </button>`;
      if (seasonExpanded) {
        for (const item of episodes) {
          const key = itemKey(content.content_id, item.season, item.episode);
          const isOn = enabledItems.has(key);
          const isSelected = ctx.contentId === content.content_id && ctx.season === item.season && ctx.episode === item.episode;
          html += `<div class="cs-item${isSelected ? ' selected' : ''}${isOn ? ' enabled' : ''}" data-cid="${escapeHtml(content.content_id)}" data-s="${item.season}" data-e="${item.episode}" style="margin-left:12px;">
            <div class="cs-item-row">
              <div class="cs-item-info" data-action="select">
                <span class="cs-item-title"><span class="cs-title-text">E${item.episode}S${item.season} ${escapeHtml(cleanEpisodeTitle(item.title, content.title))}</span></span>
              </div>
              <div class="toggle-track${isOn ? ' on' : ''}" data-action="toggle">
                <div class="toggle-thumb"></div>
              </div>
            </div>
          </div>`;
        }
      }
    }
    html += '</div>';
  }
  return html;
}

// ---- Render content list ----
function renderContentList() {
  if (!contentData) return;
  const universes = contentData.universes || [];
  const universe = universes.find(u => u.name === selectedUniverse);
  if (!universe) {
    contentListEl.innerHTML = '<div class="cs-empty">No content loaded</div>';
    return;
  }

  const isMarvel = selectedUniverse.toLowerCase().includes('marvel');
  let html = '';

  if (isMarvel && sortMode === 'chrono') {
    // Chronological mode: interleave movies and series by timeline position
    const entries = [];
    let moviesContent = null;
    for (const content of universe.content) {
      if (content.type === 'movies') {
        moviesContent = content;
        for (const item of content.items) {
          if (searchQuery && !matchesSearch(item.title)) continue;
          entries.push({ kind: 'movie', content, item, pos: getItemSortKey(item.title, MCU_CHRONO_ORDER) });
        }
      } else {
        if (searchQuery) {
          const hasMatch = matchesSearch(content.title) || content.items.some(i => matchesSearch(i.title || `S${i.season}E${i.episode}`));
          if (!hasMatch) continue;
        }
        entries.push({ kind: 'series', content, pos: getItemSortKey(content.title, MCU_CHRONO_ORDER) });
      }
    }
    entries.sort((a, b) => a.pos - b.pos);

    if (moviesContent) {
      const allItems = searchQuery ? moviesContent.items.filter(i => matchesSearch(i.title)) : moviesContent.items;
      const allOn = allItems.every(i => enabledItems.has(itemKey(moviesContent.content_id, i.season, i.episode)));
      html += `<div class="cs-section-header">
        <div class="cs-section-label">${FILM_ICON}<span>Chronological Order</span></div>
        <button class="cs-select-all" data-cid="${escapeHtml(moviesContent.content_id)}" data-type="movies">${allOn ? 'Deselect All' : 'Select All'}</button>
      </div>`;
    }

    for (const entry of entries) {
      if (entry.kind === 'movie') {
        const { content, item } = entry;
        const key = itemKey(content.content_id, item.season, item.episode);
        const isOn = enabledItems.has(key);
        const isSelected = ctx.contentId === content.content_id && ctx.episode === item.episode;
        html += `<div class="cs-item${isSelected ? ' selected' : ''}${isOn ? ' enabled' : ''}" data-cid="${escapeHtml(content.content_id)}" data-s="${item.season}" data-e="${item.episode}">
          <div class="cs-item-row">
            <div class="cs-item-info" data-action="select">
              <span class="cs-item-title"><span class="cs-title-text">${escapeHtml(getDisplayName(item.title))}</span></span>
              <div class="cs-item-meta">${CLOCK_ICON}<span>${formatTime(item.maxTimestamp)}</span></div>
            </div>
            <div class="toggle-track${isOn ? ' on' : ''}" data-action="toggle">
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>`;
      } else {
        const { content } = entry;
        html += renderSeriesHtml(content);
      }
    }
  } else {
    for (const content of universe.content) {
      if (content.type === 'movies') {
        const orderMap = sortMode === 'chrono' ? MCU_CHRONO_ORDER : MCU_RELEASE_ORDER;
        const sortedAllItems = isMarvel
          ? [...content.items].sort((a, b) => getItemSortKey(a.title, orderMap) - getItemSortKey(b.title, orderMap))
          : content.items;
        const filteredItems = sortedAllItems.filter(i => matchesSearch(i.title));
        if (searchQuery && filteredItems.length === 0) continue;
        const itemsToShow = searchQuery ? filteredItems : sortedAllItems;
        const allOn = itemsToShow.every(i => enabledItems.has(itemKey(content.content_id, i.season, i.episode)));
        html += `<div class="cs-section-header">
          <div class="cs-section-label">${FILM_ICON}<span>All Movies</span></div>
          <button class="cs-select-all" data-cid="${escapeHtml(content.content_id)}" data-type="movies">${allOn ? 'Deselect All' : 'Select All'}</button>
        </div>`;
        for (const item of itemsToShow) {
          const key = itemKey(content.content_id, item.season, item.episode);
          const isOn = enabledItems.has(key);
          const isSelected = ctx.contentId === content.content_id && ctx.episode === item.episode;
          html += `<div class="cs-item${isSelected ? ' selected' : ''}${isOn ? ' enabled' : ''}" data-cid="${escapeHtml(content.content_id)}" data-s="${item.season}" data-e="${item.episode}">
            <div class="cs-item-row">
              <div class="cs-item-info" data-action="select">
                <span class="cs-item-title"><span class="cs-title-text">${escapeHtml(getDisplayName(item.title))}</span></span>
                <div class="cs-item-meta">${CLOCK_ICON}<span>${formatTime(item.maxTimestamp)}</span></div>
              </div>
              <div class="toggle-track${isOn ? ' on' : ''}" data-action="toggle">
                <div class="toggle-thumb"></div>
              </div>
            </div>
          </div>`;
        }
      } else {
        html += renderSeriesHtml(content);
      }
    }
  }

  if (!html && searchQuery) html = '<div class="cs-empty">No results for "' + escapeHtml(searchQuery) + '"</div>';
  else if (!html) html = '<div class="cs-empty">No content loaded</div>';
  contentListEl.innerHTML = html;

  // Attach click handlers — select item (click title area)
  contentListEl.querySelectorAll('.cs-item .cs-item-info').forEach(info => {
    info.addEventListener('click', () => {
      const item = info.closest('.cs-item');
      ctx.contentId = item.dataset.cid;
      ctx.season = parseInt(item.dataset.s);
      ctx.episode = parseInt(item.dataset.e);
      updateContextBar();
      updateNowPlaying();
      renderContentList();
    });
  });

  // Attach toggle handlers
  contentListEl.querySelectorAll('.cs-item .toggle-track').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = toggle.closest('.cs-item');
      const key = itemKey(item.dataset.cid, item.dataset.s, item.dataset.e);
      if (enabledItems.has(key)) {
        enabledItems.delete(key);
      } else {
        enabledItems.add(key);
      }
      renderContentList();
    });
  });

  // Attach select all / deselect all handlers
  contentListEl.querySelectorAll('.cs-select-all').forEach(btn => {
    btn.addEventListener('click', () => {
      const cid = btn.dataset.cid;
      const universe = (contentData.universes || []).find(u => u.name === selectedUniverse);
      if (!universe) return;
      const content = universe.content.find(c => c.content_id === cid);
      if (!content) return;
      const allOn = content.items.every(i => enabledItems.has(itemKey(cid, i.season, i.episode)));
      for (const item of content.items) {
        const key = itemKey(cid, item.season, item.episode);
        if (allOn) {
          enabledItems.delete(key);
        } else {
          enabledItems.add(key);
        }
      }
      renderContentList();
    });
  });

  contentListEl.querySelectorAll('.cs-series-header').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Don't toggle series if clicking the nested season select-all button
      if (e.target.closest('.cs-season-select-all')) return;
      const cid = btn.dataset.toggle;
      if (expandedSeries.has(cid)) expandedSeries.delete(cid);
      else expandedSeries.add(cid);
      renderContentList();
    });
  });

  // Attach season toggle handlers
  contentListEl.querySelectorAll('.cs-season-header').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.closest('.cs-season-select-all')) return;
      const sk = btn.dataset.seasonToggle;
      if (expandedSeasons.has(sk)) expandedSeasons.delete(sk);
      else expandedSeasons.add(sk);
      renderContentList();
    });
  });

  // Attach season select all / deselect all handlers
  contentListEl.querySelectorAll('.cs-season-select-all').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = btn.dataset.seasonCid;
      const seasonNum = parseInt(btn.dataset.seasonNum);
      const universe = (contentData.universes || []).find(u => u.name === selectedUniverse);
      if (!universe) return;
      const content = universe.content.find(c => c.content_id === cid);
      if (!content) return;
      const seasonEps = content.items.filter(i => i.season === seasonNum);
      const allOn = seasonEps.every(i => enabledItems.has(itemKey(cid, i.season, i.episode)));
      for (const item of seasonEps) {
        const key = itemKey(cid, item.season, item.episode);
        if (allOn) enabledItems.delete(key);
        else enabledItems.add(key);
      }
      renderContentList();
    });
  });

  // Hover slide animation for truncated titles
  contentListEl.querySelectorAll('.cs-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const titleEl = item.querySelector('.cs-item-title');
      const textEl = item.querySelector('.cs-title-text');
      if (!titleEl || !textEl) return;
      const overflow = textEl.scrollWidth - titleEl.clientWidth;
      if (overflow > 2) {
        const textWidth = textEl.scrollWidth;
        const itemWidth = item.clientWidth;
        const totalDist = textWidth + itemWidth;
        const duration = Math.max(4, totalDist / 40);
        item.style.setProperty('--slide-out', `-${textWidth + 10}px`);
        item.style.setProperty('--slide-in', `${itemWidth}px`);
        item.style.setProperty('--slide-duration', `${duration}s`);
        item.classList.add('overflows');
      }
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('overflows');
    });
  });
}

function groupBySeason(items) {
  const map = {};
  for (const item of items) {
    if (!map[item.season]) map[item.season] = [];
    map[item.season].push(item);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([s, eps]) => ({ season: Number(s), episodes: eps.sort((a, b) => a.episode - b.episode) }));
}

// ---- Utilities ----
function updateSiteBadge() {
  const site = ctx.site || '';
  if (site === 'disney') {
    siteBadgeEl.textContent = 'Disney+';
    siteBadgeEl.className = 'site-badge site-disney';
  } else if (site === 'netflix') {
    siteBadgeEl.textContent = 'Netflix';
    siteBadgeEl.className = 'site-badge site-netflix';
  } else if (site) {
    siteBadgeEl.textContent = site;
    siteBadgeEl.className = 'site-badge site-generic';
  } else {
    siteBadgeEl.textContent = '--';
    siteBadgeEl.className = 'site-badge site-generic';
  }
}

function updateContextBar() {
  if (ctx.title) {
    if (ctx.isMovie) {
      contextText.innerHTML = `<span class="badge">${escapeHtml(getDisplayName(ctx.title))}</span>`;
    } else {
      contextText.innerHTML = `<span class="badge">${escapeHtml(getDisplayName(ctx.title))}</span> S${ctx.season} E${ctx.episode}`;
    }
  } else if (ctx.contentId && contentData) {
    for (const u of contentData.universes || []) {
      for (const c of u.content) {
        if (c.content_id === ctx.contentId) {
          contextText.innerHTML = `<span class="badge">${escapeHtml(c.title)}</span> Selected`;
          return;
        }
      }
    }
  } else {
    contextText.textContent = 'Detecting content...';
  }
}

function cleanEpisodeTitle(title, seriesTitle) {
  if (!title) return '';
  let clean = title;
  // Remove series name prefix (e.g. "Daredevil - ")
  if (seriesTitle) {
    const re = new RegExp('^\\s*' + seriesTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[-–—]\\s*', 'i');
    clean = clean.replace(re, '');
  }
  // Remove episode numbering patterns like "1x01 - ", "1x01 – ", "01 - ", etc.
  clean = clean.replace(/^\d+x\d+\s*[-–—]\s*/i, '');
  clean = clean.replace(/^\d+\s*[-–—]\s*/, '');
  return clean.trim();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---- Chat messages ----
function addMessage(role, content) {
  const isUser = role === 'user';
  const div = document.createElement('div');
  div.className = `message${isUser ? ' user-msg' : ''}`;
  div.innerHTML = `
    <div class="message-avatar ${isUser ? 'user' : 'bot'}">${isUser ? USER_AVATAR : BOT_AVATAR}</div>
    <div class="message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}">
      <div class="message-content">${escapeHtml(content)}</div>
    </div>
  `;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function addSpoilerWarning(warning, question) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `
    <div class="message-avatar bot">${BOT_AVATAR}</div>
    <div class="message-bubble spoiler-bubble">
      <div class="spoiler-inner">
        <div class="spoiler-header">${ALERT_ICON}<span>Spoiler Alert!</span></div>
        <p class="spoiler-text">${escapeHtml(warning)}</p>
        <button class="reveal-btn">${EYE_ICON} Reveal Anyway</button>
      </div>
    </div>
  `;
  const revealBtn = div.querySelector('.reveal-btn');
  revealBtn.addEventListener('click', () => {
    revealBtn.style.opacity = '0.5';
    revealBtn.style.pointerEvents = 'none';
    revealBtn.textContent = 'Loading...';
    sendChat(question, true);
  });
  messagesEl.appendChild(div);
  scrollToBottom();
}

function showLoading() {
  const div = document.createElement('div');
  div.id = 'loading-msg';
  div.className = 'loading-skeleton';
  div.innerHTML = `<div class="skel-avatar"></div><div class="skel-body"><div class="skel-line"></div><div class="skel-line"></div></div>`;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function hideLoading() {
  const el = document.getElementById('loading-msg');
  if (el) el.remove();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ---- Chat API ----
async function sendChat(question, allowSpoilers = false) {
  isPending = true;
  updateSendBtn();
  showLoading();

  try {
    const res = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        season: ctx.season,
        episode: ctx.episode,
        timestamp: ctx.timestamp,
        allow_spoilers: allowSpoilers,
        content_id: ctx.contentId || ''
      })
    });

    hideLoading();

    if (!res.ok) {
      addMessage('assistant', 'Sorry, something went wrong. Please make sure the backend is running.');
      return;
    }

    const data = await res.json();

    if (data.warning && data.is_spoiler && !allowSpoilers) {
      addSpoilerWarning(data.warning, question);
    } else {
      addMessage('assistant', data.answer);
    }
  } catch (err) {
    hideLoading();
    addMessage('assistant', `Could not reach the backend at ${backendUrl}. Is the server running?`);
  } finally {
    isPending = false;
    updateSendBtn();
  }
}

// ---- Input handling ----
function updateSendBtn() {
  const hasText = inputEl.value.trim().length > 0;
  const canSend = hasText && !isPending;
  sendBtn.disabled = !canSend;
  sendBtn.className = canSend ? 'send-btn active' : 'send-btn disabled';
}

function handleSend() {
  const text = inputEl.value.trim();
  if (!text || isPending) return;
  addMessage('user', text);
  inputEl.value = '';
  updateSendBtn();
  sendChat(text);
}

inputEl.addEventListener('input', updateSendBtn);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
});
sendBtn.addEventListener('click', handleSend);

// ---- Welcome ----
addMessage('assistant', "Hello! I'm your spoiler-aware companion. I know exactly where you are in the show, so feel free to ask questions without fear of spoilers. What's on your mind?");
updateContextBar();
