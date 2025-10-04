import { type User, type InsertUser } from "@shared/schema";
import {
  type Route, type InsertRoute, type RouteFilters,
  type Booking, type InsertBooking,
  type Conversation, type Message, type InsertMessage,
  type LocationUpdate, type DriverStats, type CustomerStats
} from "@shared/types";
import { randomUUID } from "crypto";

// Enhanced storage interface for all entities
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;

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
  deleteBooking(id: string): Promise<boolean>;

  // Messages & Conversations
  createConversation(bookingId: string, driverId: string, customerId: string): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationByBooking(bookingId: string): Promise<Conversation | undefined>;
  getUserConversations(userId: string): Promise<Conversation[]>;
  addMessage(conversationId: string, message: InsertMessage): Promise<Message>;
  getMessages(conversationId: string): Promise<Message[]>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;

  // Location Tracking
  updateLocation(userId: string, location: LocationUpdate): Promise<void>;
  getUserLocation(userId: string): Promise<LocationUpdate | undefined>;
  getLocationHistory(userId: string, limit?: number): Promise<LocationUpdate[]>;
  clearLocationHistory(userId: string): Promise<void>;

  // Statistics
  getDriverStats(driverId: string): Promise<DriverStats>;
  getCustomerStats(customerId: string): Promise<CustomerStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private routes: Map<string, Route> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private locations: Map<string, LocationUpdate> = new Map();
  private locationHistory: Map<string, LocationUpdate[]> = new Map();

  constructor() {
    // Mock data will be initialized separately to avoid circular dependencies
  }

  // Method to trigger mock data initialization
  async initializeWithMockData(): Promise<void> {
    if (this.users.size === 0) {
      const { initializeMockData } = await import('./mockDataGenerator');
      await initializeMockData(this);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Route methods
  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const driver = await this.getUser(insertRoute.driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const stops = insertRoute.stops.map((stop, index) => ({
      ...stop,
      id: randomUUID(),
      routeId: id,
      order: index,
    }));

    const route: Route = {
      ...insertRoute,
      id,
      driverName: driver.profile?.firstName + ' ' + driver.profile?.lastName || driver.username,
      driverAvatar: driver.profile?.avatar,
      driverRating: driver.profile?.rating || 4.5,
      availableSeats: insertRoute.totalSeats,
      stops,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.routes.set(id, route);
    return route;
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    let routes = Array.from(this.routes.values());

    if (filters) {
      routes = routes.filter(route => {
        if (filters.origin && !route.origin.toLowerCase().includes(filters.origin.toLowerCase())) {
          return false;
        }
        if (filters.destination && !route.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
          return false;
        }
        if (filters.date && route.departureDate !== filters.date) {
          return false;
        }
        if (filters.minSeats && route.availableSeats < filters.minSeats) {
          return false;
        }
        if (filters.maxPrice && route.price > filters.maxPrice) {
          return false;
        }
        if (filters.driverId && route.driverId !== filters.driverId) {
          return false;
        }
        return true;
      });
    }

    return routes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateRoute(id: string, updates: Partial<Route>): Promise<Route> {
    const route = this.routes.get(id);
    if (!route) {
      throw new Error('Route not found');
    }
    const updatedRoute = {
      ...route,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.routes.set(id, updatedRoute);
    return updatedRoute;
  }

  async deleteRoute(id: string): Promise<boolean> {
    return this.routes.delete(id);
  }

  async getUserRoutes(userId: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(route => route.driverId === userId);
  }

  // Booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const route = await this.getRoute(insertBooking.routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    const customer = await this.getUser(insertBooking.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    if (route.availableSeats < insertBooking.seats) {
      throw new Error('Not enough seats available');
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const booking: Booking = {
      id,
      routeId: insertBooking.routeId,
      customerId: insertBooking.customerId,
      customerName: customer.profile?.firstName + ' ' + customer.profile?.lastName || customer.username,
      customerAvatar: customer.profile?.avatar,
      driverId: route.driverId,
      driverName: route.driverName,
      driverAvatar: route.driverAvatar,
      origin: route.origin,
      destination: route.destination,
      date: route.departureDate,
      time: route.departureTime,
      seats: insertBooking.seats,
      pricePerSeat: route.price,
      totalPrice: route.price * insertBooking.seats,
      status: 'pending',
      driverConfirmed: false,
      customerConfirmed: true,
      notes: insertBooking.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.bookings.set(id, booking);

    // Update available seats
    await this.updateRoute(route.id, {
      availableSeats: route.availableSeats - insertBooking.seats
    });

    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.customerId === userId || booking.driverId === userId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRouteBookings(routeId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.routeId === routeId);
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (booking) {
      // Return seats to route
      const route = await this.getRoute(booking.routeId);
      if (route) {
        await this.updateRoute(route.id, {
          availableSeats: route.availableSeats + booking.seats
        });
      }
    }
    return this.bookings.delete(id);
  }

  // Conversation and Message methods
  async createConversation(bookingId: string, driverId: string, customerId: string): Promise<Conversation> {
    const booking = await this.getBooking(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const driver = await this.getUser(driverId);
    const customer = await this.getUser(customerId);

    if (!driver || !customer) {
      throw new Error('Driver or customer not found');
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const conversation: Conversation = {
      id,
      bookingId,
      driverId,
      customerId,
      driverName: driver.profile?.firstName + ' ' + driver.profile?.lastName || driver.username,
      customerName: customer.profile?.firstName + ' ' + customer.profile?.lastName || customer.username,
      driverAvatar: driver.profile?.avatar,
      customerAvatar: customer.profile?.avatar,
      messages: [],
      lastMessageAt: now,
      unreadCount: 0,
    };

    this.conversations.set(id, conversation);
    this.messages.set(id, []);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (conversation) {
      conversation.messages = this.messages.get(id) || [];
    }
    return conversation;
  }

  async getConversationByBooking(bookingId: string): Promise<Conversation | undefined> {
    const conversation = Array.from(this.conversations.values()).find(c => c.bookingId === bookingId);
    if (conversation) {
      conversation.messages = this.messages.get(conversation.id) || [];
    }
    return conversation;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(c => c.driverId === userId || c.customerId === userId)
      .map(c => ({ ...c, messages: this.messages.get(c.id) || [] }))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  async addMessage(conversationId: string, insertMessage: InsertMessage): Promise<Message> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const sender = await this.getUser(insertMessage.senderId);
    if (!sender) {
      throw new Error('Sender not found');
    }

    const recipientId = conversation.driverId === insertMessage.senderId ? conversation.customerId : conversation.driverId;

    const message: Message = {
      id: randomUUID(),
      conversationId,
      senderId: insertMessage.senderId,
      senderName: sender.profile?.firstName + ' ' + sender.profile?.lastName || sender.username,
      recipientId,
      text: insertMessage.text,
      timestamp: new Date().toISOString(),
      read: false,
      type: insertMessage.type || 'text',
    };

    const messages = this.messages.get(conversationId) || [];
    messages.push(message);
    this.messages.set(conversationId, messages);

    // Update conversation
    conversation.lastMessageAt = message.timestamp;
    conversation.unreadCount++;
    this.conversations.set(conversationId, conversation);

    return message;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messages.get(conversationId) || [];
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const messages = this.messages.get(conversationId) || [];
    const conversation = this.conversations.get(conversationId);

    if (!conversation) return;

    let unreadCount = 0;
    messages.forEach(message => {
      if (message.recipientId === userId && !message.read) {
        message.read = true;
      } else if (message.recipientId !== userId && !message.read) {
        unreadCount++;
      }
    });

    conversation.unreadCount = unreadCount;
    this.messages.set(conversationId, messages);
    this.conversations.set(conversationId, conversation);
  }

  // Location methods
  async updateLocation(userId: string, location: LocationUpdate): Promise<void> {
    const locationData: LocationUpdate = {
      id: randomUUID(),
      userId,
      ...location,
      timestamp: new Date().toISOString(),
    };

    this.locations.set(userId, locationData);

    // Add to history
    const history = this.locationHistory.get(userId) || [];
    history.push(locationData);

    // Keep only last 100 positions
    if (history.length > 100) {
      history.shift();
    }

    this.locationHistory.set(userId, history);
  }

  async getUserLocation(userId: string): Promise<LocationUpdate | undefined> {
    return this.locations.get(userId);
  }

  async getLocationHistory(userId: string, limit = 50): Promise<LocationUpdate[]> {
    const history = this.locationHistory.get(userId) || [];
    return history.slice(-limit);
  }

  async clearLocationHistory(userId: string): Promise<void> {
    this.locationHistory.delete(userId);
  }

  // Statistics methods
  async getDriverStats(driverId: string): Promise<DriverStats> {
    const routes = await this.getUserRoutes(driverId);
    const bookings = Array.from(this.bookings.values()).filter(b => b.driverId === driverId);
    const driver = await this.getUser(driverId);

    const completedBookings = bookings.filter(b => b.status === 'completed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const earnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      activeRoutes: routes.filter(r => r.status === 'active').length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedTrips: completedBookings.length,
      earnings,
      rating: driver?.profile?.rating || 4.5,
      totalReviews: driver?.profile?.totalTrips || 0,
    };
  }

  async getCustomerStats(customerId: string): Promise<CustomerStats> {
    const bookings = Array.from(this.bookings.values()).filter(b => b.customerId === customerId);
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalBookings: bookings.length,
      completedTrips: completedBookings.length,
      totalSpent,
      favoriteRoutes: [], // TODO: Calculate based on booking patterns
      savedMoney: 0, // TODO: Calculate based on alternative transport costs
    };
  }
}

export const storage = new MemStorage();
