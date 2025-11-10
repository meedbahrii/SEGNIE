async function getAPIBaseURL() {
  const manifest = chrome.runtime.getManifest();
  const homepageUrl = manifest.homepage_url;
  
  if (homepageUrl && !homepageUrl.includes('YOUR-APP-NAME') && !homepageUrl.includes('localhost')) {
    return homepageUrl;
  }
  
  return 'http://localhost:5000';
}

let API_BASE_URL = 'http://localhost:5000';
getAPIBaseURL().then(url => { API_BASE_URL = url; });

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
  }
  
  await createContextMenus();
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'quick-save') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Cannot Save',
        message: 'Quick save is not available on this page.',
      });
      return;
    }
    
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      chrome.tabs.create({ url: `${API_BASE_URL}/login` });
      return;
    }

    const limitInfo = await checkSaveLimit();
    if (!limitInfo.canSave) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Save Limit Reached',
        message: 'Upgrade to Premium for unlimited saves!',
      });
      return;
    }

    const { lastUsedDestinations } = await chrome.storage.local.get(['lastUsedDestinations']);
    
    if (!lastUsedDestinations || lastUsedDestinations.length === 0) {
      chrome.action.openPopup();
      return;
    }

    try {
      const destinations = {};
      lastUsedDestinations.forEach(dest => {
        destinations[dest] = { saved: true };
      });

      const itemData = {
        title: tab.title,
        content: tab.url,
        contentType: 'article',
        sourceUrl: tab.url,
        destinations,
      };

      await incrementSaveCount();
      await saveItem(itemData);

      const remainingInfo = await checkSaveLimit();
      let message = `Quick saved to ${lastUsedDestinations.join(', ')}!`;
      if (!remainingInfo.isPremium) {
        message += ` (${remainingInfo.remaining} saves remaining)`;
      }

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Quick Save Successful',
        message: message,
      });
    } catch (error) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Quick Save Failed',
        message: 'Please try again or use the popup.',
      });
    }
  }
});

async function createContextMenus() {
  await chrome.contextMenus.removeAll();
  
  chrome.contextMenus.create({
    id: 'save-to-segnie',
    title: 'Save to Segnie',
    contexts: ['selection', 'link', 'image', 'page'],
  });

  const destinations = [
    { id: 'notion', title: 'Notion', icon: '📝' },
    { id: 'google-sheets', title: 'Google Sheets', icon: '📊' },
    { id: 'pdf', title: 'PDF', icon: '📄' },
  ];

  destinations.forEach(dest => {
    chrome.contextMenus.create({
      id: `save-${dest.id}`,
      title: `${dest.icon} ${dest.title}`,
      parentId: 'save-to-segnie',
      contexts: ['selection', 'link', 'image', 'page'],
    });

    chrome.contextMenus.create({
      id: `${dest.id}-page`,
      title: 'Save Page',
      parentId: `save-${dest.id}`,
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: `${dest.id}-screenshot`,
      title: 'Take Full Page Screenshot',
      parentId: `save-${dest.id}`,
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: `${dest.id}-zone`,
      title: 'Select Zone to Screenshot',
      parentId: `save-${dest.id}`,
      contexts: ['page'],
    });
  });
}

async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function checkSaveLimit() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/save-limit`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Failed to check save limit:', error);
  }
  return { canSave: false, remaining: 0 };
}

async function incrementSaveCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/increment-save`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Save limit reached');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function saveItem(itemData) {
  const response = await fetch(`${API_BASE_URL}/api/saved-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    throw new Error('Failed to save item');
  }

  return await response.json();
}

async function captureScreenshot(tabId, type = 'full') {
  try {
    if (type === 'zone') {
      await chrome.tabs.sendMessage(tabId, { action: 'startZoneSelection' });
      return null;
    }

    const dataUrl = await chrome.tabs.sendMessage(tabId, { action: 'captureFullPage' });
    return dataUrl;
  } catch (error) {
    console.error('Screenshot failed:', error);
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
    return dataUrl;
  }
}

async function generatePDF(tabId, title, content) {
  try {
    const pdfDataUrl = await chrome.tabs.sendMessage(tabId, { 
      action: 'generatePDF',
      title,
      content 
    });
    return pdfDataUrl;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return null;
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    chrome.tabs.create({ url: `${API_BASE_URL}/?action=login` });
    return;
  }

  const limitInfo = await checkSaveLimit();
  
  if (!limitInfo.canSave) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Save Limit Reached',
      message: `You've used all ${limitInfo.limit} free saves. Upgrade to Premium for unlimited saves!`,
      buttons: [{ title: 'Upgrade Now' }]
    });
    
    chrome.tabs.create({ url: `${API_BASE_URL}/?upgrade=true` });
    return;
  }

  const menuId = info.menuItemId;
  const parts = menuId.split('-');
  
  if (parts.length < 2) return;

  const destination = parts[0];
  const action = parts.slice(1).join('-');

  let itemData = {
    title: '',
    content: '',
    contentType: 'text',
    sourceUrl: tab.url,
    imageUrl: null,
    destinations: { [destination]: { saved: true } },
  };

  try {
    if (action === 'page') {
      const pdfDataUrl = await chrome.tabs.sendMessage(tab.id, { 
        action: 'generatePDF',
        title: tab.title,
        url: tab.url,
        screenshotData: null
      });
      
      if (pdfDataUrl) {
        itemData.title = `${tab.title} (PDF)`;
        itemData.content = tab.url;
        itemData.contentType = 'pdf';
        itemData.assetUrl = pdfDataUrl;
        itemData.assetType = 'pdf';
        
        if (destination === 'pdf') {
          chrome.downloads.download({
            url: pdfDataUrl,
            filename: `${tab.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
            saveAs: false
          });
        }
      } else {
        throw new Error('Failed to generate PDF');
      }
    } 
    else if (action === 'screenshot') {
      const dataUrl = await captureScreenshot(tab.id, 'full');
      if (dataUrl) {
        itemData.title = `Screenshot: ${tab.title}`;
        itemData.content = 'Full page screenshot';
        itemData.contentType = 'screenshot';
        itemData.assetUrl = dataUrl;
        itemData.assetType = 'image';
        
        if (destination === 'pdf') {
          chrome.downloads.download({
            url: dataUrl,
            filename: `screenshot_${Date.now()}.png`,
            saveAs: false
          });
        }
      } else {
        throw new Error('Failed to capture screenshot');
      }
    }
    else if (action === 'zone') {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'startZoneSelection',
        destination: destination
      });
      return;
    }

    await incrementSaveCount();
    
    await saveItem(itemData);

    const remainingInfo = await checkSaveLimit();
    
    let message = `Saved to ${destination}!`;
    if (!remainingInfo.isPremium) {
      message += ` (${remainingInfo.remaining} saves remaining)`;
    }

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Save Successful',
      message: message,
    });
  } catch (error) {
    console.error('Save failed:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Save Failed',
      message: error.message || 'Failed to save. Please try again.',
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'zoneSelected') {
    (async () => {
      try {
        const limitInfo = await checkSaveLimit();
        
        if (!limitInfo.canSave) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Save Limit Reached',
            message: 'Upgrade to Premium for unlimited saves!',
          });
          return;
        }

        const itemData = {
          title: `Zone Screenshot: ${sender.tab.title}`,
          content: 'Zone screenshot',
          contentType: 'screenshot',
          sourceUrl: sender.tab.url,
          assetUrl: message.dataUrl,
          assetType: 'image',
          destinations: { [message.destination]: { saved: true } },
        };
        
        if (message.destination === 'pdf') {
          chrome.downloads.download({
            url: message.dataUrl,
            filename: `zone_screenshot_${Date.now()}.png`,
            saveAs: false
          });
        }

        await incrementSaveCount();
        await saveItem(itemData);

        const remainingInfo = await checkSaveLimit();
        let msg = `Zone saved to ${message.destination}!`;
        if (!remainingInfo.isPremium) {
          msg += ` (${remainingInfo.remaining} saves remaining)`;
        }

        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Save Successful',
          message: msg,
        });
      } catch (error) {
        console.error('Zone save failed:', error);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Save Failed',
          message: 'Failed to save zone screenshot.',
        });
      }
    })();
  }
  return true;
});
