# Segnie - Save Anything, Anywhere, Instantly

A comprehensive browser extension and web application that allows users to save web content to multiple destinations with one click. Save to Google Sheets, Notion, or export as PDF.

## 🚀 Features

### Core Features
- **One-Click Saves**: Right-click context menu or extension popup to save content instantly
- **Multi-App Support**: Save to Google Sheets, Notion, and PDF
- **Smart Organization**: Unified dashboard to search, filter, and manage all saved content
- **Multiple Content Types**: Save text, articles, quotes, links, images, and notes
- **Context Menu Integration**: Right-click anywhere to save selected content

### Premium Features
- **Multi-Destination Saves**: Save to multiple apps simultaneously
- **Multi-Account Support**: Connect multiple accounts per service
- **Advanced Search & Filters**: Powerful organization tools
- **Priority Support**: Get help when you need it
- **Export All**: Bulk export your entire collection

## 📋 Project Structure

```
segnie/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Landing, Dashboard)
│   │   └── lib/            # Utilities and query client
├── server/                  # Backend Express server
│   ├── db.ts               # Database configuration
│   ├── routes.ts           # API routes
│   └── storage.ts          # Storage interface (in-memory or DB)
├── shared/                  # Shared types and schemas
│   └── schema.ts           # Data models and validation schemas
├── extension/               # Browser extension
│   ├── manifest.json       # Extension configuration
│   ├── popup.html/js       # Extension popup UI
│   ├── background.js       # Service worker for API calls
│   └── content.js          # Content script for page interaction
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling

### Backend
- Express.js
- Drizzle ORM
- PostgreSQL (via Replit)
- Zod for validation

### Browser Extension
- Manifest V3
- Context menus API
- Chrome storage API
- Content scripts

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome/Edge/Brave browser (for extension)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start the Development Server**
```bash
npm run dev
```
The application will be available at `http://localhost:5000`

3. **Install the Browser Extension**

   a. Open Chrome and navigate to `chrome://extensions/`
   
   b. Enable "Developer mode" (top right toggle)
   
   c. Click "Load unpacked"
   
   d. Select the `extension` folder from this project
   
   e. The Segnie extension should now appear in your toolbar

### First Time Setup

1. Open the application at `http://localhost:5000`
2. Click "Get Started Free" to create an account
3. After registration, navigate to `/dashboard`
4. Click the Segnie extension icon in your browser
5. You're ready to start saving content!

## 📖 Usage

### Method 1: Extension Popup

1. Click the Segnie extension icon in your browser toolbar
2. The popup will auto-fill the current page's title
3. Enter or edit the content you want to save
4. Select content type (text, article, quote, link, image, note)
5. Choose one or more destinations (Google Sheets, Notion, PDF)
6. Click "Save Now"

### Method 2: Context Menu (Right-Click)

1. **Save Selected Text**: Select any text on a page, right-click, and choose "Save to Segnie" > "Save selected text"

2. **Save Link**: Right-click on any link and choose "Save to Segnie" > "Save this link"

3. **Save Image**: Right-click on any image and choose "Save to Segnie" > "Save this image"

4. **Save Page**: Right-click anywhere and choose "Save to Segnie" > "Save entire page"

### Dashboard

Access your saved items at `http://localhost:5000/dashboard`:

- **Search**: Find items by title or content
- **Filter**: Filter by content type
- **View**: See all your saved items with metadata
- **Delete**: Remove items you no longer need
- **Integrations**: Manage connected accounts

## 🔌 Integrations

Segnie supports multiple integrations for saving your content:

### Available Now
- **Google Sheets**: Save items as rows in a spreadsheet
- **Notion**: Create pages in your Notion workspace
- **PDF**: Export content as formatted PDF documents

### Coming Soon
- Airtable
- Evernote
- OneNote
- Slack
- Discord

See [INTEGRATIONS.md](./INTEGRATIONS.md) for detailed setup instructions.

## 🗄️ Database Schema

### Users
- `id`: Unique identifier
- `username`: Unique username
- `password`: Hashed password
- `isPremium`: Premium subscription status

### Saved Items
- `id`: Unique identifier
- `userId`: Owner reference
- `contentType`: Type of content (text, article, quote, etc.)
- `title`: Item title
- `content`: Main content
- `sourceUrl`: Original URL (optional)
- `imageUrl`: Associated image (optional)
- `tags`: Array of tags (optional)
- `destinations`: JSON object of where item was saved
- `createdAt`: Timestamp

### Integration Connections
- `id`: Unique identifier
- `userId`: Owner reference
- `integrationType`: Type (google-sheets, notion, etc.)
- `accountName`: Display name for the connection
- `credentials`: Encrypted credentials (JSON)
- `isActive`: Connection status
- `createdAt`: Timestamp

## 🔐 Security

### Implemented
- ✅ Password hashing with bcrypt (salt rounds = 10)
- ✅ Session-based authentication with httpOnly cookies
- ✅ Session regeneration on login (prevents fixation)
- ✅ requireAuth middleware on all protected routes
- ✅ SameSite cookie attribute
- ✅ Input validation with Zod schemas

### Production Requirements
Before deploying to production, you MUST implement:
- ⚠️ **CSRF protection** (critical)
- ⚠️ **Redis/PostgreSQL session store** (critical - MemoryStore is dev-only)
- ⚠️ **Strong SESSION_SECRET** via environment variable
- ⚠️ **Rate limiting** on authentication endpoints
- ⚠️ **HTTPS** (required for secure cookies)

See [SECURITY.md](./SECURITY.md) for complete security documentation and production checklist.

## 🚢 Deployment

### Backend Deployment (Replit)

The application is designed to be deployed on Replit:

1. The backend and frontend are served from the same Express server
2. Frontend is built using Vite and served as static files
3. Database uses Replit's built-in PostgreSQL

### Extension Distribution

To publish the extension:

1. Update `manifest.json` with production API URL
2. Replace placeholder icons with proper branded icons
3. Create a ZIP file of the extension folder
4. Submit to Chrome Web Store

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Saved Items
- `GET /api/saved-items` - Get all saved items for user
- `GET /api/saved-items/:id` - Get specific item
- `POST /api/saved-items` - Create new saved item
- `DELETE /api/saved-items/:id` - Delete saved item

### Integrations
- `GET /api/integrations` - Get all connections for user
- `POST /api/integrations` - Create new integration connection
- `DELETE /api/integrations/:id` - Delete integration connection

All endpoints (except auth) require `X-User-Id` header for authentication.

## 🎨 Design System

The application uses a hybrid design approach:
- Material Design foundation
- Linear-inspired dashboard aesthetics
- Notion-like approachability for landing page
- Chrome extension best practices for the extension UI

Color scheme:
- Primary: Purple gradient (#667eea to #764ba2)
- Accent: Customizable in `index.css`
- Uses CSS variables for theming

## 🤝 Contributing

This is a demonstration project showcasing:
- Full-stack TypeScript development
- React + Express integration
- Browser extension development
- API design and data modeling
- UI/UX best practices

## 📄 License

MIT License - feel free to use this project as a template or learning resource.

## 👨‍💻 Developer

**Mohammed Bahri**
- LinkedIn: [https://www.linkedin.com/in/bahrimeed/](https://www.linkedin.com/in/bahrimeed/)

## 🙏 Acknowledgments

- Built with Replit
- UI components from Shadcn UI
- Icons from Lucide React and React Icons
- Design inspiration from Linear and Notion

---

**Note**: This project uses in-memory storage by default. For production use, switch to PostgreSQL by updating the storage implementation in `server/storage.ts` and running database migrations.

For questions or support, visit the dashboard or consult the documentation.
