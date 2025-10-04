import { z } from "zod";

// Existing User types from schema.ts
export interface User {
  id: string;
  username: string;
  password: string;
  role?: 'driver' | 'customer';
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  totalTrips?: number;
  bio?: string;
}

export interface InsertUser {
  username: string;
  password: string;
  role?: 'driver' | 'customer';
  profile?: Partial<UserProfile>;
}

// Route types
export interface Route {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverRating: number;
  routeName: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  stops: RouteStop[];
  totalSeats: number;
  availableSeats: number;
  price: number;
  notes?: string;
  status: 'active' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  id: string;
  routeId: string;
  name: string;
  estimatedTime: string;
  order: number;
  latitude?: number;
  longitude?: number;
}

export interface InsertRoute {
  driverId: string;
  routeName: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  stops: Omit<RouteStop, 'id' | 'routeId'>[];
  totalSeats: number;
  price: number;
  notes?: string;
}

export interface RouteFilters {
  origin?: string;
  destination?: string;
  date?: string;
  minSeats?: number;
  maxPrice?: number;
  driverId?: string;
}

// Booking types
export interface Booking {
  id: string;
  routeId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  totalPrice: number;
  pricePerSeat: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  driverConfirmed: boolean;
  customerConfirmed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsertBooking {
  routeId: string;
  customerId: string;
  seats: number;
  notes?: string;
}

// Message and Chat types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'system';
}

export interface Conversation {
  id: string;
  bookingId: string;
  driverId: string;
  customerId: string;
  driverName: string;
  customerName: string;
  driverAvatar?: string;
  customerAvatar?: string;
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
}

export interface InsertMessage {
  senderId: string;
  text: string;
  type?: 'text' | 'system';
}

// Location types
export interface LocationUpdate {
  id?: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  speed?: number;
  heading?: number;
}

export interface LocationHistory {
  userId: string;
  userName: string;
  positions: LocationUpdate[];
}

// Statistics types
export interface DriverStats {
  activeRoutes: number;
  totalBookings: number;
  pendingBookings: number;
  completedTrips: number;
  earnings: number;
  rating: number;
  totalReviews: number;
}

export interface CustomerStats {
  totalBookings: number;
  completedTrips: number;
  totalSpent: number;
  favoriteRoutes: string[];
  savedMoney: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// WebSocket Event types
export interface WebSocketEvents {
  'location-update': LocationUpdate;
  'booking-status-change': {
    bookingId: string;
    status: Booking['status'];
    driverConfirmed: boolean;
    customerConfirmed: boolean;
  };
  'new-message': Message;
  'route-update': {
    routeId: string;
    availableSeats: number;
    status: Route['status'];
  };
  'driver-online': {
    driverId: string;
    location: LocationUpdate;
  };
  'driver-offline': {
    driverId: string;
  };
  'notification': {
    userId: string;
    type: 'booking' | 'message' | 'route' | 'system';
    title: string;
    message: string;
    data?: any;
  };
}

// Validation schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['driver', 'customer']),
  profile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
});

export const createRouteSchema = z.object({
  routeName: z.string().min(1, "Route name is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  totalSeats: z.number().min(1).max(8),
  price: z.number().min(0),
  stops: z.array(z.object({
    name: z.string().min(1),
    estimatedTime: z.string(),
    order: z.number(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })).min(2),
  notes: z.string().optional(),
});

export const createBookingSchema = z.object({
  routeId: z.string().min(1, "Route ID is required"),
  seats: z.number().min(1).max(8),
  notes: z.string().optional(),
});

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0),
  speed: z.number().optional(),
  heading: z.number().optional(),
});

export const sendMessageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty").max(1000),
  type: z.enum(['text', 'system']).optional(),
});