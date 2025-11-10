# Segnie Project

## Overview
Segnie is a browser extension and web application designed to streamline saving web content. It allows users to save content to various destinations like Google Sheets and Notion with a single click. The project aims to provide a robust content-saving solution, featuring a comprehensive landing page, a user dashboard for managing saved items, and a powerful Chrome extension. This platform targets individuals and professionals seeking efficient content curation and organization across different tools.

## User Preferences
None specified yet.

## System Architecture

### UI/UX Decisions
The project utilizes a modern design aesthetic with a purple gradient color scheme (`#667eea` to `#764ba2`). It leverages Shadcn UI for consistent, reusable components and Tailwind CSS for utility-first styling, ensuring a responsive design across all screen sizes.

### Technical Implementations
- **Frontend**: Built with React, TypeScript, Wouter for routing, TanStack Query for data fetching, and Shadcn UI with Tailwind CSS for the user interface.
- **Backend**: An Express.js server handles API requests. It uses Drizzle ORM for database interactions (configured for PostgreSQL) and Zod for schema validation. Currently, an in-memory storage solution acts as a fallback.
- **Extension**: A Chrome Manifest V3 extension, featuring a popup UI, context menu integration, content scripts for text extraction, and a background service worker for API communication.
- **Authentication**: A robust system with full auth context, protected routes, and secure session management using HttpOnly cookies and password hashing (bcrypt).
- **Integrations**: Direct integrations with Google Sheets and Notion allow automatic syncing of saved content.
- **Subscription**: Stripe is integrated for managing premium subscriptions and payment processing.
- **Data Models**: Defined schemas for Users, Saved Items, and Integration Connections ensure data integrity.
- **Performance Optimizations**: 
  - HTTP compression (gzip/brotli) reduces payload sizes by ~70%
  - Smart caching with ETags and 304 responses for blog content
  - React Query configured with 5-minute staleTime for optimal cache performance
  - Non-blocking blog post initialization using Promise.all
  - Memoized computations in performance-critical components
  - Blog endpoints excluded from rate limiting for faster content delivery
  - Trust proxy configured for single-hop deployment (production security)

### Feature Specifications
- **Landing Page**: Includes Hero, Features, Interactive Demo Section, Integrations, Pricing, and Call-to-Action sections.
- **Interactive Demo Section**: Homepage section allowing users to test the actual right-click context menu feature on sample content cards, providing hands-on experience before installation.
- **User Dashboard**: Allows users to view, manage, and organize their saved content.
- **Content Saving**: Supports saving various content types (text, article, quote, link, image, note) and destinations.
- **Browser Extension**: Provides one-click saving via popup or right-click context menu, with content extraction and screenshot capabilities (full page, zone selection).
- **OAuth Integration System**: Facilitates secure connection to third-party services.
- **Save Limit System**: Implements free-tier restrictions with a premium upgrade path.
- **PDF Generation**: Allows generating and saving PDFs from web content.

### System Design Choices
The architecture separates concerns into `server/`, `client/`, `extension/`, and `shared/` directories. The `shared/` directory centralizes data models and validation schemas for consistency across the frontend, backend, and extension. The backend is designed to be database-agnostic, currently supporting in-memory storage with a clear path to PostgreSQL. Security is prioritized with comprehensive authentication, input validation, and per-user data scoping.

### Security Implementations (November 2025)
- **Extension Security**: Browser extension uses only manifest-defined homepage_url or localhost, preventing API hijacking via malicious tab scanning.
- **CORS Protection**: Strict origin whitelisting for extension IDs in production, with development fallback for testing.
- **CSRF Strategy**: Extension bypasses CSRF (trusted first-party code with session cookies), while web app maintains full CSRF protection.
- **Atomic Save Limits**: Server-side enforcement with increment-before-save and automatic rollback on failure, preventing race conditions.
- **Multi-User Isolation**: Google Sheets integration properly scopes credentials per-user, supporting both workspace-level Replit connector and per-user OAuth tokens.
- **Environment Validation**: Production mode requires ALLOWED_EXTENSION_IDS configuration with comma-separated list support and whitespace trimming.

## External Dependencies

- **Google Sheets**: Integrated via Replit Connector for seamless content syncing.
- **Notion**: OAuth 2.0 integration for creating databases and saving content as pages.
- **Stripe**: Used for subscription management, payment processing, and webhooks.
- **Chrome API**: Utilized for browser extension functionalities (Manifest V3, context menus, storage API).
- **Drizzle ORM**: For interacting with relational databases (PostgreSQL).
- **html2canvas**: For capturing full-page and selected zone screenshots.
- **jsPDF**: For generating PDF documents from web content.