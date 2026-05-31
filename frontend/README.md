# FitConnect Ads - Next.js Frontend Application

A fitness platform application with public-facing gym directory pages and a gym owner dashboard for managing gyms, plans, classes, trainers, and content.

## Features

### Public Pages
- **Gym Listing Page**: Browse all gyms with featured and all sections
- **Individual Gym Page**: View gym details, classes, plans, and trainers
- **Login Page**: Authentication for gym owners

### Dashboard Pages (Protected)
- **Plans Management**: CRUD operations for membership plans
- **Classes Management**: CRUD operations for gym classes
- **Trainers Management**: CRUD operations for trainers
- **CMS/Branding**: Edit content and branding elements
- **Payment Gateway**: Process payments for premium features
- **Advertisement Payment**: Manage advertisement subscriptions with QR code

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Icons**: React Icons
- **QR Code**: qrcode.react

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel Deployment

The application is deployed on Vercel. To deploy your own instance:

1. **Connect to Vercel**: Import this repository in your [Vercel Dashboard](https://vercel.com/dashboard)
2. **Configure Project**: Vercel will auto-detect Next.js settings
3. **Deploy**: Click deploy - Vercel handles the rest

### Local Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deployment Configuration

- **Platform**: Vercel
- **Framework**: Next.js (auto-detected)
- **Root URL**: Deployed at root path (`/`)

## Project Structure

```
app/
├── (public)/          # Public pages
├── (dashboard)/       # Dashboard pages (protected)
components/
├── public/            # Public page components
├── dashboard/         # Dashboard components
└── shared/            # Shared UI components
styles/                # Global and page-specific styles
lib/                   # Types, constants, utilities
hooks/                 # Custom React hooks
contexts/              # React contexts
public/                # Static assets
```

## Authentication

The application uses mock authentication for Phase 1. Any email/password combination will work for login. In Phase 2, this will be replaced with real backend authentication.

## Mock Data

All data is currently stored in `lib/constants.ts` as mock data. In Phase 2, this will be replaced with API calls to a backend.

## Notes

- Phase 1 is frontend-only with mock data
- Authentication is mocked (no real backend)
- All CRUD operations work with local state/mock data
- Payment forms are UI-only (no actual payment processing)
- QR code is generated client-side
- Images are placeholder/mock images

## Phase 2 (Future)

- Backend integration
- Real authentication
- Database integration
- Payment processing
- Image uploads
- Email notifications





