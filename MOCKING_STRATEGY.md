# RoutePilot Backend Mocking Strategy

## 🎯 Objective

Create a comprehensive mocking strategy for the RoutePilot application backend to enable frontend development and testing while the actual backend services are being implemented.

## 📋 Mocking Approach

### Strategy: **Hybrid Mocking**
- **In-Memory Data Store**: For development and testing
- **JSON Files**: For persistent mock data between sessions
- **API Route Mocking**: Full REST API implementation with mock data
- **WebSocket Mocking**: Real-time features simulation

## 🏗 Implementation Plan

### Phase 1: Data Layer Mocking

#### 1.1 Expand Storage Interface
Extend the current `IStorage` interface to handle all entities:

```typescript
interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Routes
  createRoute(route: InsertRoute): Promise<Route>;
  getRoute(id: string): Promise<Route | undefined>;
  getRoutes(filters?: RouteFilters): Promise<Route[]>;
  updateRoute(id: string, updates: Partial<Route>): Promise<Route>;
  deleteRoute(id: string): Promise<boolean>;
  getUserRoutes(userId: string): Promise<Route[]>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getRouteBookings(routeId: string): Promise<Booking[]>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking>;

  // Messages
  createConversation(bookingId: string, driverId: string, customerId: string): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationByBooking(bookingId: string): Promise<Conversation | undefined>;
  addMessage(conversationId: string, message: InsertMessage): Promise<Message>;
  getMessages(conversationId: string): Promise<Message[]>;

  // Location Tracking
  updateLocation(userId: string, location: LocationUpdate): Promise<void>;
  getUserLocation(userId: string): Promise<LocationUpdate | undefined>;
  getLocationHistory(userId: string, limit?: number): Promise<LocationUpdate[]>;
}
```

#### 1.2 Create Mock Data Generator
```typescript
// server/mockData.ts
class MockDataGenerator {
  generateUsers(count: number): User[]
  generateRoutes(count: number, users: User[]): Route[]
  generateBookings(routes: Route[], customers: User[]): Booking[]
  generateMessages(conversations: Conversation[]): Message[]
  generateLocationHistory(users: User[]): LocationUpdate[]
}
```

### Phase 2: API Route Implementation

#### 2.1 Authentication Routes (`server/routes/auth.ts`)
```typescript
// Mock authentication with session simulation
POST /api/auth/register - Create new user account
POST /api/auth/login    - User login with mock session
POST /api/auth/logout   - Clear session
GET  /api/auth/me       - Get current user info
```

#### 2.2 User Routes (`server/routes/users.ts`)
```typescript
GET  /api/users/:id          - Get user profile
PUT  /api/users/:id          - Update user profile
GET  /api/users/:id/stats    - Get user statistics
```

#### 2.3 Route Routes (`server/routes/routes.ts`)
```typescript
GET    /api/routes           - Search/list routes with filters
POST   /api/routes           - Create new route
GET    /api/routes/:id       - Get route details
PUT    /api/routes/:id       - Update route
DELETE /api/routes/:id       - Delete route
GET    /api/routes/:id/bookings - Get route bookings
```

#### 2.4 Booking Routes (`server/routes/bookings.ts`)
```typescript
POST   /api/bookings                    - Create booking request
GET    /api/bookings/:id                - Get booking details
PUT    /api/bookings/:id/confirm        - Confirm booking (driver/customer)
PUT    /api/bookings/:id/reject         - Reject booking
PUT    /api/bookings/:id/cancel         - Cancel booking
GET    /api/users/:userId/bookings      - Get user bookings
```

#### 2.5 Chat Routes (`server/routes/chat.ts`)
```typescript
GET    /api/conversations/:bookingId                 - Get conversation
POST   /api/conversations/:conversationId/messages  - Send message
GET    /api/conversations/:conversationId/messages  - Get messages
```

#### 2.6 Location Routes (`server/routes/location.ts`)
```typescript
POST   /api/location/update                    - Update user location
GET    /api/location/user/:userId              - Get user location
GET    /api/location/user/:userId/history      - Get location history
```

### Phase 3: WebSocket Mocking

#### 3.1 WebSocket Events
```typescript
// Real-time events to mock
interface WebSocketEvents {
  'location-update': LocationUpdate;
  'booking-status-change': BookingStatusUpdate;
  'new-message': Message;
  'route-update': RouteUpdate;
  'driver-online': DriverStatus;
  'driver-offline': DriverStatus;
}
```

#### 3.2 WebSocket Mock Implementation
```typescript
// server/websocket.ts
class MockWebSocketServer {
  simulateLocationUpdates(driverId: string): void
  simulateBookingUpdates(): void
  simulateMessages(): void
  broadcastToRoom(room: string, event: string, data: any): void
}
```

## 📁 File Structure for Mocking

```
server/
├── mock/
│   ├── data/
│   │   ├── users.json          # Sample user data
│   │   ├── routes.json         # Sample route data
│   │   ├── bookings.json       # Sample booking data
│   │   └── messages.json       # Sample message data
│   ├── generators/
│   │   ├── userGenerator.ts    # User data generator
│   │   ├── routeGenerator.ts   # Route data generator
│   │   ├── bookingGenerator.ts # Booking data generator
│   │   └── messageGenerator.ts # Message data generator
│   └── mockStorage.ts          # Enhanced mock storage implementation
├── routes/
│   ├── auth.ts                 # Authentication routes
│   ├── users.ts                # User management routes
│   ├── routes.ts               # Route management routes
│   ├── bookings.ts             # Booking management routes
│   ├── chat.ts                 # Chat/messaging routes
│   └── location.ts             # Location tracking routes
├── middleware/
│   ├── auth.ts                 # Mock authentication middleware
│   ├── validation.ts           # Request validation middleware
│   └── rateLimiting.ts         # Rate limiting middleware
├── websocket.ts                # WebSocket mock server
└── index.ts                    # Updated main server file
```

## 🎲 Mock Data Specifications

### Sample Data Volumes
- **Users**: 50 (25 drivers, 25 customers)
- **Routes**: 100 active routes
- **Bookings**: 200 total bookings (various statuses)
- **Messages**: 500 messages across conversations
- **Location Updates**: 1000 historical points per driver

### Data Relationships
- Each driver has 2-5 active routes
- Each route has 0-3 bookings
- 60% of bookings have associated conversations
- Each conversation has 3-15 messages
- Active drivers have location updates every 30 seconds

## ⚙️ Mock Behaviors

### 1. Authentication Simulation
- **Login**: Accept any username/password combination
- **Session**: Store session in memory with 1-hour expiration
- **Roles**: Toggle between driver/customer modes
- **Security**: Mock JWT generation without actual encryption

### 2. Real-time Simulation
- **Location Updates**: Simulate driver movement along predefined routes
- **Booking Status**: Auto-confirm bookings after random delays
- **Messages**: Simulate automated responses from other users
- **Notifications**: Generate mock push notifications

### 3. Business Logic Simulation
- **Route Matching**: Filter routes by location proximity
- **Booking Validation**: Check seat availability
- **Price Calculation**: Basic distance-based pricing
- **Status Transitions**: Implement booking state machine

### 4. Error Simulation
- **Network Delays**: Random 100-500ms response delays
- **Failures**: 5% chance of random 500 errors
- **Validation Errors**: Proper error responses for bad data
- **Rate Limiting**: Mock rate limiting responses

## 🚀 Implementation Timeline

### Week 1: Foundation
- [ ] Set up enhanced storage interface
- [ ] Create mock data generators
- [ ] Implement basic CRUD operations
- [ ] Add authentication mocking

### Week 2: API Routes
- [ ] Implement all REST endpoints
- [ ] Add request validation
- [ ] Create error handling middleware
- [ ] Add rate limiting

### Week 3: Real-time Features
- [ ] WebSocket server implementation
- [ ] Location tracking simulation
- [ ] Real-time messaging
- [ ] Push notification mocking

### Week 4: Polish & Testing
- [ ] Add comprehensive mock data
- [ ] Implement business logic
- [ ] Error simulation
- [ ] Documentation and testing

## 🧪 Testing Strategy

### Unit Testing
- Mock data generators
- Storage operations
- API endpoint responses
- WebSocket event handling

### Integration Testing
- Full API workflow testing
- Frontend-backend integration
- Real-time feature testing
- Error scenario testing

### Performance Testing
- Response time simulation
- Concurrent user simulation
- WebSocket connection limits
- Memory usage monitoring

## 📊 Mock Configuration

### Environment Variables
```env
# Mock configuration
MOCK_MODE=true
MOCK_DELAY_MIN=100
MOCK_DELAY_MAX=500
MOCK_ERROR_RATE=0.05
MOCK_AUTO_CONFIRM=true
MOCK_WEBSOCKET=true

# Data configuration
MOCK_USERS_COUNT=50
MOCK_ROUTES_COUNT=100
MOCK_BOOKINGS_COUNT=200
MOCK_LOCATION_UPDATES=true
```

### Mock Feature Flags
```typescript
interface MockConfig {
  enableDelays: boolean;
  enableErrors: boolean;
  autoConfirmBookings: boolean;
  simulateMovement: boolean;
  enableChatBots: boolean;
  persistData: boolean;
}
```

## 🎯 Success Criteria

### Functional Requirements
- ✅ All frontend API calls return appropriate responses
- ✅ Real-time features work with WebSocket simulation
- ✅ Authentication flow works end-to-end
- ✅ CRUD operations for all entities
- ✅ Business logic simulation (booking workflow)

### Non-Functional Requirements
- ✅ Response times under 500ms
- ✅ Support for 10+ concurrent users
- ✅ Data persistence between server restarts
- ✅ Comprehensive error simulation
- ✅ Easy configuration and setup

## 🔄 Migration Strategy

### From Mock to Real Backend
1. **Gradual Replacement**: Replace mock endpoints one by one
2. **Feature Flags**: Toggle between mock and real implementations
3. **Data Migration**: Export mock data for real database seeding
4. **API Compatibility**: Maintain API contracts during transition
5. **Testing**: Ensure mock and real implementations return identical responses

This mocking strategy will enable full frontend development and testing while providing a clear path to real backend implementation.