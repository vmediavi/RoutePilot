# Design Guidelines: Route Tracking & Booking Platform

## Design Approach
**Reference-Based**: Drawing inspiration from mobility platforms (Uber, BlaBlaCar, Moovit) with emphasis on map-centric design, real-time updates, and trust-building elements. The design balances operational efficiency with approachable, friendly aesthetics for both driver and customer roles.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 217 91% 60% (trustworthy blue - navigation, CTAs)
- Secondary: 142 76% 36% (success green - confirmations, active routes)
- Accent: 38 92% 50% (amber - notifications, pending actions)
- Neutral: 220 9% slate scale (backgrounds, text, borders)

**Dark Mode:**
- Primary: 217 91% 70%
- Secondary: 142 71% 45%
- Accent: 38 92% 60%
- Backgrounds: 220 13% 18% (base), 220 13% 23% (elevated)

### B. Typography
- **Primary Font**: Inter (headers, UI labels) - weights 500, 600, 700
- **Secondary Font**: System UI stack (body text, forms) - weights 400, 500
- **Scale**: text-xs (10px), text-sm (12px), text-base (14px), text-lg (16px), text-xl (18px), text-2xl (24px)

### C. Layout System
**Spacing Primitives**: Tailwind units of 1, 2, 4, 6, 8, 12, 16 (gaps, padding, margins)
**Grid**: 12-column responsive grid, max-w-7xl container
**Map Integration**: Full-bleed maps with floating controls and info cards

### D. Component Library

**Navigation:**
- Dual-mode header with role switcher (Driver/Customer)
- Persistent bottom navigation on mobile (Home, Routes, Bookings, Profile)
- Contextual action buttons floating over map views

**Core Components:**

*Map Interface:*
- Full-screen map canvas with route polylines
- Floating driver location markers (car icon with direction indicator)
- Stop markers with numbered badges and estimated times
- Current location pulse indicator
- Zoom/center controls bottom-right

*Route Cards:*
- Compact horizontal cards showing: route name, start/end locations, departure time, available seats
- Visual timeline with stops and arrival estimates
- Driver avatar with rating badge
- Quick-book CTA button
- Expandable detail view with full stop list and calendar selector

*Calendar Selector:*
- Week view with recurring route indicators (subtle background pattern)
- Day/time picker with time slot grid
- Selected dates highlighted with primary color

*Booking Flow:*
- Multi-step confirmation: Select seats → Review → Confirm
- Real-time seat availability counter
- Status badges (Pending/Confirmed/Completed) with color coding
- Dual confirmation interface showing both driver and customer status

*Chat Interface:*
- Message bubbles with user avatars
- Timestamp grouping by day
- Typing indicators and read receipts
- File/location sharing capabilities
- Floating compose bar at bottom

*Notification Panel:*
- Toast notifications for real-time updates (top-right)
- Notification center with categorized alerts (booking requests, route updates, messages)
- Unread badge indicators

**Forms & Inputs:**
- Floating labels on text inputs
- Autocomplete for location search (Google Places style)
- Time pickers with 15-minute increments
- Multi-select for recurring days (toggle chips)
- Seat number stepper with +/- controls

**Data Displays:**
- List views with alternating subtle backgrounds
- Empty states with friendly illustrations and CTAs
- Loading states with skeleton screens
- Error states with retry actions

### E. Animations
**Minimal & Purposeful:**
- Map marker transitions (smooth position updates every 5s)
- Notification toast slide-in (200ms ease-out)
- Modal/drawer transitions (300ms)
- No parallax or complex scroll effects

## Role-Specific Design

**Driver Dashboard:**
- Active route monitoring with live passenger list
- Route creation wizard (step-by-step: stops → schedule → capacity)
- Booking request queue with accept/reject actions
- Earnings/stats summary cards

**Customer Interface:**
- Route search with filters (date, time, origin, destination)
- Saved locations for quick booking
- Booking history with status timeline
- Driver profiles with ratings and reviews

## Images
- **Driver Profile Photos**: Circular avatars (40px standard, 64px profile view)
- **Vehicle Photos**: Rectangular cards (16:9 aspect) in route details
- **Empty State Illustrations**: Friendly line-art style for "no routes found", "no bookings yet"
- **No Hero Image**: This is a utility app - launch directly into functional interface

## Key Interactions
- Real-time location updates on map (5-second polling)
- WebSocket-driven chat and notifications (instant)
- Optimistic UI updates for booking actions
- Pull-to-refresh on route lists
- Swipe actions on booking cards (cancel/contact)