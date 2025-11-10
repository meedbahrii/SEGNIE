# SaveTo - Design Guidelines

## Design Approach

**Hybrid Strategy**: Material Design System foundation with Linear-inspired refinement for the dashboard, and Notion-like approachability for the landing page. The extension UI follows Chrome's extension best practices with a focus on speed and clarity.

**Key Principles**:
- **Speed & Clarity**: Every interaction should feel instant and unambiguous
- **Progressive Disclosure**: Free users see clear upgrade paths without feeling restricted
- **Trust & Credibility**: Professional polish that justifies premium pricing
- **Minimal Friction**: Save actions complete in 1-2 clicks maximum

---

## Typography

**Font Stack**:
- Primary: Inter (Google Fonts) - 400, 500, 600, 700
- Monospace: JetBrains Mono - for API keys, code snippets (400, 500)

**Hierarchy**:
- **Landing Hero**: text-5xl/text-6xl (60-72px), font-bold, tracking-tight
- **Section Headers**: text-3xl/text-4xl (36-48px), font-semibold
- **Card Titles**: text-xl (20px), font-semibold
- **Body Text**: text-base (16px), font-normal, leading-relaxed
- **UI Labels**: text-sm (14px), font-medium
- **Metadata/Captions**: text-xs (12px), font-normal

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16, 20, 24** (e.g., p-4, m-8, gap-12)

**Container Strategy**:
- Full-width sections: `w-full` with `max-w-7xl mx-auto px-6`
- Dashboard content: `max-w-6xl mx-auto`
- Extension popup: Fixed 400px width, auto height
- Reading content: `max-w-prose` for optimal readability

**Grid Systems**:
- Feature cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- Dashboard items: `grid grid-cols-1 gap-4` with list view
- Integration tiles: `grid grid-cols-2 md:grid-cols-4 gap-6`

---

## Component Library

### Landing Page Components

**Hero Section** (80vh):
- Large headline emphasizing "Save anything, anywhere, instantly"
- Subheadline explaining the one-click save concept
- Primary CTA: "Add to Chrome - Free" (large, prominent)
- Secondary CTA: "See How It Works" (video demo trigger)
- Hero visual: Screenshot/mockup of extension in action on a browser window
- Trust indicator: "Join 10,000+ users organizing their web" with small logos

**Feature Showcase** (3-column grid):
- Each card: Icon (64px), title, 2-3 line description
- Features: "One-Click Saves", "Multi-App Support", "Smart Organization", "Team Collaboration", "Export Anywhere", "Offline Access"
- Hover state: Subtle lift and glow effect

**How It Works** (4 steps, horizontal timeline):
- Step cards with large numbers (01, 02, 03, 04)
- Visual representations for: Install → Select → Save → Access
- Connecting line between steps

**Integration Gallery** (4x2 grid):
- Large, clear logos: Google Sheets, Notion, Trello, PDF, plus 4 "Coming Soon" slots
- Each tile: Logo, app name, "Connected" status or "Connect" button

**Pricing Comparison** (2-column table):
- Free tier (left): Single destination, unlimited saves, basic features
- Premium tier (right): All destinations, multi-account, advanced features, priority support
- Clear "Upgrade Now" CTA in Premium column
- Annual/monthly toggle above table

**Social Proof Section**:
- 3-column testimonial cards with user avatar (48px), quote, name, role
- Metrics bar: "50,000+ Saves", "99% Uptime", "< 2min Setup"

**Footer** (4-column):
- Product links, Resources, Company, Legal
- Newsletter signup: "Get productivity tips" with email input and subscribe button
- Social icons (24px, outlined style)

### Chrome Extension Components

**Popup Interface** (400px × auto):
- Header: SaveTo logo + settings icon (top-right)
- Quick Save section:
  - "Save to:" label
  - Grid of destination buttons (2×2): Google Sheets, Notion, Trello, PDF
  - Each button: Icon (32px), app name, connection status dot
  - Premium badge on multi-select feature (locked for free users)
- Recent Saves section (collapsible):
  - List of last 5 saves with timestamps
  - "View All" link to dashboard
- Footer: Upgrade button (if free user) or account dropdown

**Context Menu** (Native Chrome styling):
- "Save to SaveTo" → Submenu with destinations
- Icons for each destination in submenu

**Settings Panel**:
- Account Management section: Connected accounts list with "Add Account" buttons
- Preferences: Default save location, notification settings
- Subscription status card with upgrade CTA

### Dashboard Components

**Navigation Sidebar** (280px):
- Logo at top
- Main navigation: All Saves, By Source (Google Sheets, Notion, Trello, PDF), Tags, Settings
- Bottom section: Subscription status card, Upgrade button (if free)

**Header Bar**:
- Search input (left): "Search your saved content..." with icon
- Filter dropdown: By date, by source, by tags
- View toggle: Grid/List
- Profile dropdown (right)

**Saved Items Grid/List**:
- **Grid View**: Cards with thumbnail (if applicable), title, source icon, timestamp, tags
- **List View**: Table with columns: Content preview, Source, Date, Tags, Actions
- Each item: Hover reveals quick actions (Open, Delete, Add Tag)

**Item Detail View** (Modal/Slide-over):
- Full content preview
- Metadata: Source, saved date, URL (if applicable)
- Tags section with add/remove capability
- Actions: Open in app, Download, Delete

**Subscription Management**:
- Current plan card: Plan name, features list, renewal date
- Usage metrics: Saves this month, connected accounts
- Upgrade/Manage buttons

---

## Interaction Patterns

**Save Confirmation**:
- Toast notification (bottom-right): "Saved to Google Sheets" with checkmark icon
- 3-second auto-dismiss
- Action button: "View" to open in new tab

**Loading States**:
- Skeleton screens for dashboard loading
- Inline spinners for save actions (16px)
- Progressive loading: Show cached content first, update with fresh data

**Empty States**:
- Illustration (160px) + headline + helpful CTA
- "No saved items yet" → "Start saving from your browser"

**Error Handling**:
- Inline error messages with retry option
- Connection errors: "Check your Google Sheets connection"

---

## Images

**Landing Page**:
- **Hero Image**: Browser window mockup showing extension popup in action, demonstrating the save flow (full-width, positioned right of headline)
- **How It Works Section**: 4 isometric illustrations showing each step of the save process
- **Integration Logos**: Official brand logos for Google Sheets, Notion, Trello (ensure brand compliance)
- **Dashboard Preview**: Screenshot of the dashboard showing organized saved content (in a Features section)

**Extension**:
- App icons for each integration (32px, consistent styling)
- Empty state illustration for "No recent saves"

**Dashboard**:
- Thumbnails for saved web content (auto-generated or default placeholder)
- App source icons throughout the interface

---

## Responsive Behavior

**Landing Page**:
- Desktop (lg): Full multi-column layouts as described
- Tablet (md): 2-column grids, maintain visual hierarchy
- Mobile: Single column, stack all elements, larger touch targets (min 44px)

**Extension**: Fixed width, no responsive changes needed

**Dashboard**:
- Desktop: Full sidebar + content area
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation bar replacing sidebar