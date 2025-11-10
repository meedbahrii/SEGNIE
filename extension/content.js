let isSelectingZone = false;
let selectionOverlay = null;
let selectionBox = null;
let startX = 0;
let startY = 0;
let currentDestination = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ selectedText });
  }
  
  if (request.action === 'getPageInfo') {
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      selectedText: window.getSelection().toString().trim(),
      images: Array.from(document.images)
        .slice(0, 5)
        .map(img => img.src)
        .filter(src => src.startsWith('http')),
    };
    sendResponse({ pageInfo });
  }

  if (request.action === 'startZoneSelection') {
    currentDestination = request.destination;
    startZoneSelection();
    sendResponse({ started: true });
  }

  if (request.action === 'captureFullPage') {
    (async () => {
      try {
        const canvas = await html2canvas(document.body, {
          allowTaint: true,
          useCORS: true,
          scrollY: -window.scrollY,
          scrollX: -window.scrollX,
          windowHeight: document.documentElement.scrollHeight,
          windowWidth: document.documentElement.scrollWidth,
        });
        const dataUrl = canvas.toDataURL('image/png');
        sendResponse(dataUrl);
      } catch (error) {
        console.error('Full page screenshot failed:', error);
        sendResponse(null);
      }
    })();
    return true;
  }

  if (request.action === 'generatePDF') {
    (async () => {
      try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        pdf.setFontSize(16);
        pdf.text(request.title || 'Document', 20, 20);
        
        if (request.screenshotData) {
          const imgWidth = 170;
          const imgHeight = 120;
          pdf.addImage(request.screenshotData, 'PNG', 20, 40, imgWidth, imgHeight);
        } else {
          pdf.setFontSize(12);
          pdf.text('Source: ' + (request.url || window.location.href), 20, 40);
          
          const pageText = document.body.innerText.substring(0, 5000);
          const splitText = pdf.splitTextToSize(pageText, 170);
          pdf.text(splitText, 20, 60);
        }
        
        const pdfDataUrl = pdf.output('dataurlstring');
        sendResponse(pdfDataUrl);
      } catch (error) {
        console.error('PDF generation failed:', error);
        sendResponse(null);
      }
    })();
    return true;
  }
  
  return true;
});

function startZoneSelection() {
  if (isSelectingZone) return;
  
  isSelectingZone = true;
  
  selectionOverlay = document.createElement('div');
  selectionOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999998;
    cursor: crosshair;
  `;
  
  selectionBox = document.createElement('div');
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px dashed #667eea;
    background: rgba(102, 126, 234, 0.1);
    z-index: 999999;
    pointer-events: none;
    display: none;
  `;
  
  document.body.appendChild(selectionOverlay);
  document.body.appendChild(selectionBox);
  
  const instructionBox = document.createElement('div');
  instructionBox.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #667eea;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;
  instructionBox.textContent = 'Click and drag to select an area. Press ESC to cancel.';
  document.body.appendChild(instructionBox);
  
  let isDragging = false;
  
  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.display = 'block';
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    
    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
  };
  
  const handleMouseUp = async (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    
    const rect = selectionBox.getBoundingClientRect();
    
    if (rect.width < 10 || rect.height < 10) {
      cleanup();
      return;
    }
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext('2d');
      
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      const captureArea = {
        x: rect.left + scrollX,
        y: rect.top + scrollY,
        width: rect.width,
        height: rect.height
      };
      
      cleanup();
      
      const tempCanvas = await html2canvas(document.body, {
        x: captureArea.x,
        y: captureArea.y,
        width: captureArea.width,
        height: captureArea.height,
        scrollX: -scrollX,
        scrollY: -scrollY,
        allowTaint: true,
        useCORS: true,
      });
      
      ctx.drawImage(tempCanvas, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      
      chrome.runtime.sendMessage({
        action: 'zoneSelected',
        dataUrl: dataUrl,
        destination: currentDestination
      });
    } catch (error) {
      console.error('Zone capture failed:', error);
      cleanup();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      cleanup();
    }
  };
  
  const cleanup = () => {
    isSelectingZone = false;
    if (selectionOverlay) {
      selectionOverlay.remove();
      selectionOverlay = null;
    }
    if (selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
    if (instructionBox) {
      instructionBox.remove();
    }
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('keydown', handleKeyDown);
  };
  
  selectionOverlay.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('keydown', handleKeyDown);
}

let selectionTimeout;
document.addEventListener('mouseup', () => {
  clearTimeout(selectionTimeout);
  selectionTimeout = setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      chrome.runtime.sendMessage({
        action: 'textSelected',
        text: selectedText,
      });
    }
  }, 100);
});
