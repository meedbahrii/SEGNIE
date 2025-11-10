async function getAPIBaseURL() {
  const manifest = chrome.runtime.getManifest();
  const homepageUrl = manifest.homepage_url;
  
  if (homepageUrl && homepageUrl !== 'https://YOUR-APP-NAME.vercel.app') {
    return homepageUrl;
  }
  
  return 'http://localhost:5000';
}

let API_BASE_URL = 'http://localhost:5000';
let selectedDestinations = new Set();
let currentUser = null;
let lastUsedDestinations = null;
let checkAuthInterval = null;

async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
  return null;
}

async function getSaveLimit() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/save-limit`, {
      credentials: 'include',
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to get save limit:', error);
  }
  return null;
}

async function getRecentSaves() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-items?limit=5`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.items || [];
    }
  } catch (error) {
    console.error('Failed to get recent saves:', error);
  }
  return [];
}

async function init() {
  API_BASE_URL = await getAPIBaseURL();
  
  document.getElementById('open-dashboard').href = `${API_BASE_URL}/login`;
  
  const user = await checkAuth();
  
  if (!user) {
    return;
  }

  currentUser = user;
  await chrome.storage.local.set({ userId: user.id });
  showMainContent();
  
  loadLastUsedDestinations();
  
  document.getElementById('dashboard-link').href = `${API_BASE_URL}/dashboard`;
  document.getElementById('connections-link').href = `${API_BASE_URL}/connections`;
  document.getElementById('upgrade-link').href = `${API_BASE_URL}/subscribe`;
  
  const headerStatus = document.getElementById('header-status');
  headerStatus.textContent = `Welcome back, ${user.username}!`;
  
  const saveLimit = await getSaveLimit();
  if (saveLimit) {
    updateSaveCounter(saveLimit);
  }
  
  await loadRecentSaves();
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab) {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    
    titleInput.value = tab.title || '';
    
    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, (response) => {
      if (response && response.selectedText) {
        contentInput.value = response.selectedText;
      }
    });
  }
}

function startAuthPolling() {
  if (checkAuthInterval) return;
  
  checkAuthInterval = setInterval(async () => {
    const user = await checkAuth();
    if (user) {
      clearInterval(checkAuthInterval);
      checkAuthInterval = null;
      location.reload();
    }
  }, 2000);
}

async function loadRecentSaves() {
  const recentSaves = await getRecentSaves();
  const section = document.getElementById('recent-saves-section');
  const list = document.getElementById('recent-saves-list');
  
  if (recentSaves.length > 0) {
    section.style.display = 'block';
    
    list.innerHTML = recentSaves.map(item => {
      const destinations = Object.keys(item.destinations || {}).join(', ');
      const timeAgo = getTimeAgo(item.createdAt);
      
      return `
        <div class="recent-save-item" data-url="${item.sourceUrl || '#'}" data-id="${item.id}">
          <div class="recent-save-title">${escapeHtml(item.title || 'Untitled')}</div>
          <div class="recent-save-meta">
            <span>${destinations}</span>
            <span>•</span>
            <span>${timeAgo}</span>
          </div>
        </div>
      `;
    }).join('');
    
    document.querySelectorAll('.recent-save-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url && url !== '#') {
          chrome.tabs.create({ url });
        }
      });
    });
  } else {
    section.style.display = 'block';
    list.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 13px;">
        No saves yet. Start saving content!
      </div>
    `;
  }
}

function loadLastUsedDestinations() {
  chrome.storage.local.get(['lastUsedDestinations'], (result) => {
    if (result.lastUsedDestinations) {
      lastUsedDestinations = result.lastUsedDestinations;
      updateQuickSaveButton();
    }
  });
}

function updateQuickSaveButton() {
  const btn = document.getElementById('quick-save-btn');
  const hint = document.getElementById('quick-save-hint');
  
  if (lastUsedDestinations && lastUsedDestinations.length > 0) {
    const destNames = lastUsedDestinations.map(d => {
      const names = {
        'google-sheets': 'Sheets',
        'notion': 'Notion',
        'pdf': 'PDF'
      };
      return names[d] || d;
    }).join(', ');
    
    btn.innerHTML = `⚡ Quick Save to ${destNames}`;
    hint.textContent = 'One-click save to your last destination';
  } else {
    btn.innerHTML = '⚡ Quick Save';
    hint.textContent = 'Use manual save first to set your default';
    btn.disabled = true;
  }
}

function updateSaveCounter(saveLimit) {
  const counterEl = document.getElementById('save-counter');
  const counterText = document.getElementById('counter-text');
  const upgradeLink = document.getElementById('upgrade-link');
  const saveBtn = document.getElementById('save-btn');
  const quickSaveBtn = document.getElementById('quick-save-btn');
  
  counterEl.style.display = 'block';
  
  if (saveLimit.isPremium) {
    counterText.innerHTML = `<strong>${saveLimit.saveCount}</strong> saves (Unlimited) ✨`;
    counterEl.classList.remove('limit-reached');
    upgradeLink.style.display = 'none';
    
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Now';
    if (lastUsedDestinations && lastUsedDestinations.length > 0) {
      quickSaveBtn.disabled = false;
    }
  } else {
    counterText.innerHTML = `Saves: <strong>${saveLimit.saveCount} / ${saveLimit.limit}</strong>`;
    
    if (!saveLimit.canSave) {
      counterEl.classList.add('limit-reached');
      counterText.innerHTML = `<strong>Limit reached!</strong> (${saveLimit.saveCount}/${saveLimit.limit})`;
      upgradeLink.style.display = 'inline-block';
      
      saveBtn.disabled = true;
      saveBtn.textContent = 'Upgrade to Save More';
      quickSaveBtn.disabled = true;
      quickSaveBtn.innerHTML = '⚡ Upgrade to Save More';
    } else {
      counterEl.classList.remove('limit-reached');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Now';
      if (lastUsedDestinations && lastUsedDestinations.length > 0) {
        quickSaveBtn.disabled = false;
      }
      
      if (saveLimit.remaining <= 1) {
        upgradeLink.style.display = 'inline-block';
      } else {
        upgradeLink.style.display = 'none';
      }
    }
  }
}

function showLoginScreen() {
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('login-content').style.display = 'block';
}

function showMainContent() {
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('login-content').style.display = 'none';
}

document.querySelectorAll('.destination-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const destination = btn.dataset.destination;
    
    if (selectedDestinations.has(destination)) {
      selectedDestinations.delete(destination);
      btn.classList.remove('selected');
    } else {
      selectedDestinations.add(destination);
      btn.classList.add('selected');
    }
  });
});

document.getElementById('quick-save-btn')?.addEventListener('click', async () => {
  if (!lastUsedDestinations || lastUsedDestinations.length === 0) {
    showStatus('Please use manual save first to set a default destination', 'error');
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const title = tab?.title || 'Untitled';
  const content = tab?.url || '';

  await performSave(title, content, 'article', lastUsedDestinations);
});

document.getElementById('save-btn').addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const contentType = document.getElementById('content-type').value;
  
  if (!title || !content) {
    showStatus('Please enter both title and content', 'error');
    return;
  }

  if (selectedDestinations.size === 0) {
    showStatus('Please select at least one destination', 'error');
    return;
  }

  const destinationsArray = Array.from(selectedDestinations);
  await performSave(title, content, contentType, destinationsArray);
});

async function performSave(title, content, contentType, destinationsArray) {
  const saveBtn = document.getElementById('save-btn');
  const quickSaveBtn = document.getElementById('quick-save-btn');
  
  saveBtn.disabled = true;
  quickSaveBtn.disabled = true;
  
  const isQuickSave = destinationsArray === lastUsedDestinations;
  
  if (isQuickSave) {
    quickSaveBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
  } else {
    saveBtn.textContent = 'Saving...';
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const destinations = {};
    destinationsArray.forEach(dest => {
      destinations[dest] = { saved: true };
    });

    const response = await fetch(`${API_BASE_URL}/api/saved-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        title,
        content,
        contentType,
        sourceUrl: tab?.url || null,
        destinations,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }

    lastUsedDestinations = destinationsArray;
    await chrome.storage.local.set({ lastUsedDestinations: destinationsArray });

    showStatus('Saved successfully! ✓', 'success');
    
    const saveLimit = await getSaveLimit();
    if (saveLimit) {
      updateSaveCounter(saveLimit);
    }
    
    await loadRecentSaves();
    
    setTimeout(() => {
      window.close();
    }, 1500);
  } catch (error) {
    showStatus('Failed to save. Please try again.', 'error');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Now';
    quickSaveBtn.disabled = false;
    updateQuickSaveButton();
  }
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById('recent-saves-toggle')?.addEventListener('click', () => {
  const list = document.getElementById('recent-saves-list');
  const icon = document.querySelector('#recent-saves-toggle .toggle-icon');
  
  if (list.classList.contains('collapsed')) {
    list.classList.remove('collapsed');
    icon.classList.add('expanded');
  } else {
    list.classList.add('collapsed');
    icon.classList.remove('expanded');
  }
});

document.getElementById('manual-save-toggle')?.addEventListener('click', () => {
  const content = document.getElementById('manual-save-content');
  const icon = document.querySelector('#manual-save-toggle .toggle-icon');
  
  if (content.classList.contains('collapsed')) {
    content.classList.remove('collapsed');
    icon.classList.add('expanded');
  } else {
    content.classList.add('collapsed');
    icon.classList.remove('expanded');
  }
});

init();
