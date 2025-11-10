# Segnie Browser Extension

## Installation Instructions

### For Chrome/Edge/Brave

1. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

2. Enable "Developer mode" (toggle in the top right corner)

3. Click "Load unpacked"

4. Select the `extension` folder from this project

5. The Segnie extension should now appear in your extensions list

### Setup

1. Click the Segnie extension icon in your browser toolbar
2. You'll see a login prompt - click "Login or Sign Up"
3. Register or login to your account
4. The extension will automatically detect when you're logged in - no need to refresh!
5. Start saving content!

## Usage

### Method 1: Quick Save (Fastest!)
1. **Click the extension icon** and use the green "⚡ Quick Save" button
   - Saves to your last-used destination instantly
   - Perfect for rapid content collection
2. **Or use keyboard shortcut**: `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac)
   - Save any page without even opening the popup!

### Method 2: Manual Save with Options
1. Click the Segnie extension icon (or press `Ctrl+Shift+E`)
2. Expand "Manual Save" section
3. Enter a title and content (auto-filled from current page)
4. Select one or more destinations (Google Sheets, Notion, Trello, or PDF)
5. Click "Save Now"

### Method 3: Context Menu
1. Select text, right-click, and choose "Save to Segnie" > destination
2. Right-click on a link and choose "Save to Segnie" > destination
3. Right-click on an image and choose "Save to Segnie" > destination
4. Right-click anywhere and choose "Save to Segnie" > destination > "Save Page"

## Features

### ⚡ Quick Save
- **One-Click Saves**: Save to your last-used destination instantly
- **Keyboard Shortcut**: Press `Ctrl+Shift+S` to save any page in under a second
- **Smart Defaults**: Automatically remembers your preferred destinations

### 📋 Recent Saves
- **View Last 5 Saves**: See your recent items right in the popup
- **Click to Open**: Quickly access any saved item's source URL
- **Time Tracking**: See when each item was saved

### 🔐 Auto-Login Detection
- **No Manual Refresh**: Extension automatically detects when you log in
- **Seamless Experience**: Just login and the popup updates instantly

### 🎨 Enhanced UI
- **Loading States**: Clear feedback during save operations
- **Collapsible Sections**: Organize your workflow with expandable panels
- **Save Counter**: Track your usage and upgrade prompts for free users
- **Beautiful Animations**: Smooth transitions and hover effects

### 🎯 Multiple Save Methods
- **Multiple Destinations**: Save to Google Sheets, Notion, Trello, and PDF
- **Context Menu Integration**: Right-click to save selected content
- **Smart Content Detection**: Automatically detects page title and URL
- **Screenshot Capture**: Full page or zone selection screenshots

### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+S` (or `Cmd+Shift+S`): Quick save to last destination
- `Ctrl+Shift+E` (or `Cmd+Shift+E`): Open extension popup

## Development

To modify the extension:

1. Make your changes to the files in the `extension` folder
2. Go to your browser's extension page
3. Click the refresh icon on the Segnie extension card
4. Test your changes

## Notes

- The extension requires the backend server to be running on http://localhost:5000
- For production use, update the API_BASE_URL in popup.js and background.js
- Icons are placeholder - replace with proper icons before publishing
