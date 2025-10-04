import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { storage } from './storage';
import type { WebSocketEvents } from '@shared/types';

interface ClientInfo {
  userId: string;
  role: 'driver' | 'customer';
  ws: WebSocket;
}

export class MockWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientInfo> = new Map();
  private rooms: Map<string, Set<string>> = new Map();
  private locationSimulators: Map<string, NodeJS.Timeout> = new Map();

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('🔌 New WebSocket connection');

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Start background simulation tasks
    this.startLocationSimulation();
    this.startBookingSimulation();
  }

  private handleMessage(ws: WebSocket, data: any) {
    switch (data.type) {
      case 'authenticate':
        this.handleAuthentication(ws, data);
        break;
      case 'join-room':
        this.handleJoinRoom(ws, data);
        break;
      case 'leave-room':
        this.handleLeaveRoom(ws, data);
        break;
      case 'location-update':
        this.handleLocationUpdate(ws, data);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }

  private handleAuthentication(ws: WebSocket, data: any) {
    const { userId, token } = data;

    // Mock authentication - in real app, verify token
    if (!userId) {
      ws.send(JSON.stringify({
        type: 'auth-error',
        message: 'User ID required'
      }));
      return;
    }

    // Get user info
    storage.getUser(userId).then(user => {
      if (!user) {
        ws.send(JSON.stringify({
          type: 'auth-error',
          message: 'User not found'
        }));
        return;
      }

      // Store client info
      const clientId = this.generateClientId();
      this.clients.set(clientId, {
        userId,
        role: user.role || 'customer',
        ws
      });

      // Add clientId to WebSocket for later reference
      (ws as any).clientId = clientId;

      ws.send(JSON.stringify({
        type: 'auth-success',
        clientId,
        userId
      }));

      // Auto-join user to their personal room
      this.joinRoom(clientId, `user-${userId}`);

      // If driver, start location simulation
      if (user.role === 'driver') {
        this.startDriverLocationSimulation(userId);
      }

      console.log(`✅ User ${userId} authenticated as ${user.role}`);
    });
  }

  private handleJoinRoom(ws: WebSocket, data: any) {
    const { room } = data;
    const clientId = (ws as any).clientId;

    if (!clientId || !room) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication required'
      }));
      return;
    }

    this.joinRoom(clientId, room);
    ws.send(JSON.stringify({
      type: 'joined-room',
      room
    }));
  }

  private handleLeaveRoom(ws: WebSocket, data: any) {
    const { room } = data;
    const clientId = (ws as any).clientId;

    if (!clientId || !room) return;

    this.leaveRoom(clientId, room);
    ws.send(JSON.stringify({
      type: 'left-room',
      room
    }));
  }

  private handleLocationUpdate(ws: WebSocket, data: any) {
    const clientId = (ws as any).clientId;
    const client = this.clients.get(clientId);

    if (!client || client.role !== 'driver') {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Only drivers can update location'
      }));
      return;
    }

    // Store location in database
    storage.updateLocation(client.userId, data.location);

    // Broadcast to interested parties
    this.broadcastLocationUpdate(client.userId, data.location);
  }

  private handleDisconnection(ws: WebSocket) {
    const clientId = (ws as any).clientId;
    if (!clientId) return;

    const client = this.clients.get(clientId);
    if (client) {
      // Remove from all rooms
      this.rooms.forEach((roomClients, room) => {
        roomClients.delete(clientId);
        if (roomClients.size === 0) {
          this.rooms.delete(room);
        }
      });

      // Stop location simulation for drivers
      if (client.role === 'driver') {
        this.stopDriverLocationSimulation(client.userId);

        // Broadcast driver offline event
        this.broadcast('location-update', {
          driverId: client.userId,
          online: false
        });
      }

      this.clients.delete(clientId);
      console.log(`🔌 Client ${clientId} disconnected`);
    }
  }

  private joinRoom(clientId: string, room: string) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room)!.add(clientId);
  }

  private leaveRoom(clientId: string, room: string) {
    const roomClients = this.rooms.get(room);
    if (roomClients) {
      roomClients.delete(clientId);
      if (roomClients.size === 0) {
        this.rooms.delete(room);
      }
    }
  }

  private broadcastToRoom(room: string, message: any) {
    const roomClients = this.rooms.get(room);
    if (!roomClients) return;

    roomClients.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  private broadcast(type: keyof WebSocketEvents, data: any) {
    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({ type, data }));
      }
    });
  }

  private broadcastLocationUpdate(driverId: string, location: any) {
    // Broadcast to users with active bookings with this driver
    storage.getUserBookings(driverId).then(bookings => {
      const activeBookings = bookings.filter(b =>
        b.status === 'confirmed' || b.status === 'pending'
      );

      activeBookings.forEach(booking => {
        this.broadcastToRoom(`user-${booking.customerId}`, {
          type: 'location-update',
          data: {
            driverId,
            location,
            bookingId: booking.id
          }
        });
      });
    });

    // Also broadcast to driver room
    this.broadcastToRoom(`user-${driverId}`, {
      type: 'location-update',
      data: { driverId, location }
    });
  }

  private startDriverLocationSimulation(driverId: string) {
    if (this.locationSimulators.has(driverId)) return;

    const simulator = setInterval(async () => {
      try {
        const currentLocation = await storage.getUserLocation(driverId);
        if (currentLocation) {
          // Simulate movement (small random changes)
          const newLocation = {
            latitude: currentLocation.latitude + (Math.random() - 0.5) * 0.001,
            longitude: currentLocation.longitude + (Math.random() - 0.5) * 0.001,
            accuracy: Math.floor(Math.random() * 20 + 10),
            speed: Math.floor(Math.random() * 60 + 10),
            heading: Math.floor(Math.random() * 360)
          };

          await storage.updateLocation(driverId, newLocation);
          this.broadcastLocationUpdate(driverId, newLocation);
        }
      } catch (error) {
        console.error('Location simulation error:', error);
      }
    }, 30000); // Update every 30 seconds

    this.locationSimulators.set(driverId, simulator);
    console.log(`📍 Started location simulation for driver ${driverId}`);
  }

  private stopDriverLocationSimulation(driverId: string) {
    const simulator = this.locationSimulators.get(driverId);
    if (simulator) {
      clearInterval(simulator);
      this.locationSimulators.delete(driverId);
      console.log(`📍 Stopped location simulation for driver ${driverId}`);
    }
  }

  private startLocationSimulation() {
    // Simulate location updates for all drivers every 30 seconds
    console.log('📍 Starting location simulation service');
  }

  private startBookingSimulation() {
    // Simulate booking status changes
    setInterval(async () => {
      try {
        // Get all pending bookings
        const allUsers = await storage.getAllUsers();
        for (const user of allUsers) {
          const bookings = await storage.getUserBookings(user.id);
          const pendingBookings = bookings.filter(b => b.status === 'pending');

          // 10% chance to auto-confirm pending bookings
          for (const booking of pendingBookings) {
            if (Math.random() < 0.1) {
              if (!booking.driverConfirmed && Math.random() > 0.5) {
                await storage.updateBooking(booking.id, {
                  driverConfirmed: true,
                  status: booking.customerConfirmed ? 'confirmed' : 'pending'
                });

                // Broadcast booking update
                this.broadcastToRoom(`user-${booking.customerId}`, {
                  type: 'booking-status-change',
                  data: {
                    bookingId: booking.id,
                    status: booking.customerConfirmed ? 'confirmed' : 'pending',
                    driverConfirmed: true,
                    customerConfirmed: booking.customerConfirmed
                  }
                });

                this.broadcastToRoom(`user-${booking.driverId}`, {
                  type: 'booking-status-change',
                  data: {
                    bookingId: booking.id,
                    status: booking.customerConfirmed ? 'confirmed' : 'pending',
                    driverConfirmed: true,
                    customerConfirmed: booking.customerConfirmed
                  }
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Booking simulation error:', error);
      }
    }, 60000); // Check every minute

    console.log('📋 Starting booking simulation service');
  }

  private generateClientId(): string {
    return 'client_' + Math.random().toString(36).substring(2, 15);
  }

  // Public methods for external use
  public sendToUser(userId: string, type: keyof WebSocketEvents, data: any) {
    this.broadcastToRoom(`user-${userId}`, { type, data });
  }

  public sendNotification(userId: string, notification: any) {
    this.broadcastToRoom(`user-${userId}`, {
      type: 'notification',
      data: notification
    });
  }

  public broadcastRouteUpdate(routeId: string, update: any) {
    // Get route bookings and notify all involved users
    storage.getRouteBookings(routeId).then(bookings => {
      bookings.forEach(booking => {
        this.sendToUser(booking.customerId, 'route-update', update);
        this.sendToUser(booking.driverId, 'route-update', update);
      });
    });
  }
}

let wsServer: MockWebSocketServer | null = null;

export function setupWebSocket(server: HttpServer): MockWebSocketServer {
  if (!wsServer) {
    wsServer = new MockWebSocketServer(server);
    console.log('🚀 WebSocket server initialized');
  }
  return wsServer;
}

export function getWebSocketServer(): MockWebSocketServer | null {
  return wsServer;
}