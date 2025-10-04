# TrackRide - Real-time Driver & Passenger Tracking System

A real-time tracking application for connecting drivers and passengers with live location updates, route scheduling, seat booking, and instant chat functionality.

## Features

- **Dual User Roles**: Driver and Customer dashboards with role-specific functionality
- **Route Management**: Create and manage routes with multiple stops and scheduling
- **Real-time Location Tracking**: Live GPS tracking with position history visualization
- **Seat Booking System**: Event-driven booking workflow with dual confirmation
- **WebSocket Chat**: Real-time messaging between drivers and customers
- **Live Notifications**: Instant updates for booking requests and confirmations
- **Interactive Maps**: Visual route display with driver position and accuracy indicators

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- WebSocket for real-time features

**Backend:**
- Express.js server
- TypeScript
- WebSocket (ws library)
- In-memory storage (MemStorage)
- RESTful API architecture

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd trackride
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (optional, as defaults are provided):

```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-secret-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend & Backend**: http://localhost:5000

The dev server includes:
- Hot Module Replacement (HMR)
- Automatic server restart on changes
- Vite dev server integration

### 5. TypeScript Type Checking

```bash
npm run check
```

## Production Build

### Build for Production

```bash
npm run build
```

This command:
1. Builds the frontend with Vite → `dist/public`
2. Bundles the backend with esbuild → `dist/index.js`

### Run Production Server

```bash
npm start
```

Or manually:

```bash
NODE_ENV=production node dist/index.js
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t trackride .
```

### Run Docker Container

```bash
docker run -p 5000:5000 \
  -e SESSION_SECRET=your-secret-key \
  trackride
```

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  trackride:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - SESSION_SECRET=your-secret-key-here
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Project Structure

```
trackride/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (dashboards)
│   │   ├── lib/           # Utilities and configurations
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── index.html
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite integration
├── shared/               # Shared types and schemas
│   └── schema.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## API Integration

### External Location Tracking API

The app is designed to consume location data from an external tracking service:

```bash
curl --location 'https://141.147.106.84:8443/locations/subscribe?deviceId=DEV_0&limit=5' \
--header 'Authorization: Basic ZGV2ZWxvcGVyOmQzNjBhYWU4LTVmNWMtNGMxOS04MWVlLTI4MjY5ZmZiZmMwYQ=='
```

**Response format:**
```json
{
  "timestamp": "2025-10-04T17:46:17.336Z",
  "deviceId": "DEV_0",
  "latitude": 42.141296,
  "longitude": -8.234724,
  "accuracy": 20.0
}
```

To integrate real location tracking:
1. Update the API endpoint in the respective components
2. Add authentication headers as needed
3. Implement WebSocket or polling for real-time updates

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema (if using database) |

## Key Components

### Driver Dashboard
- Live location tracking with route visualization
- Route creation and management
- Booking request handling
- Real-time position history (last 10 positions)

### Customer Dashboard
- Route search and filtering
- Seat booking with confirmation workflow
- Live map tracking of driver location
- Booking history and status

### Shared Features
- Real-time WebSocket chat
- Push notifications
- Dark mode support
- Responsive mobile-first design

## Development Notes

### Mock Data
The current implementation uses mock data for demonstration purposes. Comments marked with `//todo: remove mock functionality` indicate where mock data should be replaced with real API calls.

### Storage
The app currently uses in-memory storage (`MemStorage`). For production:
- Implement database persistence (PostgreSQL recommended)
- Update the storage interface in `server/storage.ts`
- Configure database connections

### WebSocket Integration
WebSocket setup is included via the blueprint. To enable:
1. Implement WebSocket server in `server/routes.ts`
2. Add client-side WebSocket connection
3. Handle real-time events for chat and notifications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
