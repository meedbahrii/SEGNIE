# Chrome Extension Testing Guide

## Loading the Extension in Chrome

### Step 1: Enable Developer Mode
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Toggle "Developer mode" ON (top-right corner)

### Step 2: Load Unpacked Extension
1. Click "Load unpacked" button
2. Navigate to your project's `extension/` folder
3. Select the folder and click "Select Folder"
4. The Segnie extension should now appear in your extensions list

### Step 3: Pin the Extension
1. Click the puzzle icon (🧩) in Chrome toolbar
2. Find "Segnie - Save Anywhere Instantly"
3. Click the pin icon to keep it visible in your toolbar

## Testing the Full Save Flow

### Prerequisites
- Make sure the web app is running at `http://localhost:5000`
- The extension will automatically connect to localhost during development

### Test Scenario 1: First-Time User (Login Flow)

1. **Click the extension icon**
   - You should see the login screen with a lock icon
   - Message: "Welcome to Segnie - Please login to start saving content"

2. **Click "Login or Sign Up"**
   - Opens the web app in a new tab
   - Register a new account or login

3. **Return to the extension popup**
   - Close and reopen the extension
   - Should now show the authenticated interface

### Test Scenario 2: Quick Save Feature

1. **Navigate to any webpage** (e.g., a blog article)
2. **Select some text** on the page
3. **Click the extension icon**
   - Title should auto-fill with the page title
   - Content should auto-fill with your selected text

4. **Select a destination** (Google Sheets, Notion, or PDF)
   - Click on one or more destination buttons
   - Selected destinations will highlight in purple

5. **Click "Save Now"**
   - Button shows "Saving..." with loading state
   - Success message appears
   - Extension closes automatically after 1.5 seconds

6. **Verify the save**
   - Open Dashboard from quick links or go to `http://localhost:5000/dashboard`
   - Your saved item should appear in the list

### Test Scenario 3: Quick Save to Last Destination

1. **After saving at least once**, reopen the extension
2. **The Quick Save button** should now show: "⚡ Quick Save to [destination]"
3. **Navigate to a new page**
4. **Click "⚡ Quick Save"** button
   - Saves current page instantly to your last-used destination
   - No need to fill in forms or select destinations

### Test Scenario 4: Recent Saves

1. **After making several saves**, reopen extension
2. **Recent Saves section** should display your last 5 saves
3. **Click on a recent save item**
   - Opens the original source URL in a new tab

### Test Scenario 5: Save Counter & Limits

**Free Tier Test:**
1. With a free account, save counter shows: "Saves: X / 50"
2. Make saves and watch counter increment
3. When approaching limit (48-50 saves), "Upgrade to Premium" link appears

**Premium Tier Test:**
1. Upgrade account to Premium (via Subscribe page)
2. Save counter shows: "X saves (Unlimited) ✨"
3. No upgrade link displayed
4. Can save unlimited items

### Test Scenario 6: Context Menu (Right-Click)

1. **Right-click on any webpage**
2. **Look for "Save to Segnie" menu option**
3. **Hover to see submenu:**
   - Save to Google Sheets
   - Save to Notion
   - Save to PDF
4. **Click any option** to save current page instantly

### Test Scenario 7: Keyboard Shortcuts

1. **Press `Ctrl+Shift+E`** (or `Cmd+Shift+E` on Mac)
   - Opens the extension popup

2. **Press `Ctrl+Shift+S`** (or `Cmd+Shift+S` on Mac)
   - Quick saves to your last-used destination
   - Works from any webpage

### Test Scenario 8: Manual Save with Custom Content

1. **Open extension popup**
2. **Expand "Manual Save" section** if collapsed
3. **Enter custom title and content**
4. **Select content type** (Text, Article, Quote, Link, Image, Note)
5. **Choose destination(s)**
6. **Click "Save Now"**
7. **Verify in Dashboard** with correct content type label

## Common Issues & Troubleshooting

### Issue: "Authentication required" errors
- **Solution**: Make sure you're logged in to the web app
- Open `http://localhost:5000/login` and sign in
- Refresh the extension popup

### Issue: Extension shows login screen even though I'm logged in
- **Solution**: 
  - Clear browser cookies for localhost
  - Log in again to the web app
  - Restart Chrome
  - Reload the extension

### Issue: Content doesn't save
- **Solution**:
  - Check that the web app is running (`npm run dev`)
  - Check browser console for errors (F12 → Console)
  - Make sure you selected at least one destination
  - Verify you haven't hit your save limit (free tier)

### Issue: Selected text doesn't auto-fill
- **Solution**:
  - Make sure you selected text BEFORE opening the popup
  - Try selecting text again and reopening the popup
  - The content script may need permission on some sites

### Issue: Icons not showing
- **Solution**: 
  - Make sure all icon files exist in `extension/icons/`
  - Required: icon16.png, icon48.png, icon128.png
  - Reload the extension after adding icons

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Login flow works correctly
- [ ] Manual save with form inputs works
- [ ] Quick save to last destination works
- [ ] Recent saves display correctly
- [ ] Save counter updates after each save
- [ ] Free tier limit enforcement works
- [ ] Premium unlimited saves work
- [ ] Quick links to Dashboard/Connections work
- [ ] Right-click context menu appears
- [ ] Keyboard shortcuts work
- [ ] Selected text auto-fills content
- [ ] Page title auto-fills title
- [ ] Multiple destinations can be selected
- [ ] Extension popup UI looks correct
- [ ] Loading states display properly
- [ ] Success/error messages appear
- [ ] Extension closes after successful save

## Production Testing Notes

When testing with the deployed version:

1. **Update manifest.json:**
   - Change `homepage_url` to your production URL
   - Example: `"homepage_url": "https://your-app.vercel.app"`

2. **Test cross-origin requests:**
   - Extension should work with production API
   - Cookies/sessions should persist correctly

3. **Test on various websites:**
   - News sites, blogs, documentation, etc.
   - Verify content capture works across different sites

4. **Performance testing:**
   - Extension should open quickly (<500ms)
   - Saves should complete in <2 seconds
   - UI should be responsive

## Browser Console Debugging

If something isn't working:

1. **Extension popup console:**
   - Right-click extension icon → Inspect popup
   - View Console tab for errors

2. **Background script console:**
   - Go to `chrome://extensions/`
   - Find Segnie extension
   - Click "background page" or "service worker"
   - View Console tab

3. **Content script console:**
   - Open any webpage
   - Press F12 for DevTools
   - Console errors from content.js will appear here

## Next Steps After Testing

Once you've verified everything works:

1. **Package for Chrome Web Store** (see DEPLOYMENT.md)
2. **Create promotional screenshots**
3. **Write store description**
4. **Submit for review**
5. **Monitor user feedback**
