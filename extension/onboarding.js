const API_BASE_URL = 'http://localhost:5000';

let currentScreen = 'welcome';
let currentUser = null;

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

async function getConnectedIntegrations() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/integrations`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.connections || [];
    }
  } catch (error) {
    console.error('Failed to fetch integrations:', error);
  }
  return [];
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  document.getElementById(screenId).classList.add('active');
  currentScreen = screenId;
}

async function init() {
  const user = await checkAuth();
  
  if (user) {
    currentUser = user;
    await chrome.storage.local.set({ 
      userId: user.id,
      onboardingComplete: false 
    });
    showScreen('connect-screen');
    await updateIntegrationStatus();
  } else {
    showScreen('welcome-screen');
  }
}

async function updateIntegrationStatus() {
  const connections = await getConnectedIntegrations();
  
  connections.forEach(conn => {
    const card = document.querySelector(`[data-integration="${conn.integrationType}"]`);
    if (card) {
      card.classList.add('connected');
      const btn = card.querySelector('.connect-btn');
      btn.textContent = 'Connected ✓';
      btn.disabled = true;
      btn.style.background = '#10b981';
    }
  });
}

async function connectIntegration(service) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/oauth/${service}/auth`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      window.open(data.authUrl, '_blank', 'width=600,height=700');
      
      const checkInterval = setInterval(async () => {
        const connections = await getConnectedIntegrations();
        const isConnected = connections.some(c => c.integrationType === service);
        
        if (isConnected) {
          clearInterval(checkInterval);
          await updateIntegrationStatus();
        }
      }, 2000);
    }
  } catch (error) {
    console.error('Failed to connect integration:', error);
    alert('Failed to connect. Please try again.');
  }
}

document.querySelectorAll('.connect-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const service = e.target.dataset.service;
    await connectIntegration(service);
  });
});

document.getElementById('skip-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  showScreen('complete-screen');
});

document.getElementById('done-btn')?.addEventListener('click', async () => {
  await chrome.storage.local.set({ onboardingComplete: true });
  window.close();
});

window.addEventListener('focus', async () => {
  if (currentScreen === 'connect-screen') {
    await updateIntegrationStatus();
  }
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('connected')) {
  setTimeout(async () => {
    await updateIntegrationStatus();
  }, 500);
}

init();
