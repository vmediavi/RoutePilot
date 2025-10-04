import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocket } from "./websocket";

// Import all route modules
import { authRouter } from "./routes/auth";
import { routesRouter } from "./routes/routes";
import { bookingsRouter } from "./routes/bookings";
import { chatRouter } from "./routes/chat";
import { locationRouter } from "./routes/location";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize mock data on first startup
  await storage.initializeWithMockData();

  // Register all API routes with /api prefix
  app.use('/api/auth', authRouter);
  app.use('/api/routes', routesRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/conversations', chatRouter);
  app.use('/api/location', locationRouter);

  // Stats endpoints
  app.get('/api/stats/driver/:driverId', async (req, res) => {
    try {
      const { driverId } = req.params;
      const stats = await storage.getDriverStats(driverId);
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Get driver stats error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  app.get('/api/stats/customer/:customerId', async (req, res) => {
    try {
      const { customerId } = req.params;
      const stats = await storage.getCustomerStats(customerId);
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Get customer stats error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'RoutePilot API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // API documentation endpoint
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      message: 'RoutePilot Mock API',
      version: '1.0.0',
      endpoints: {
        auth: {
          'POST /api/auth/register': 'Register new user',
          'POST /api/auth/login': 'User login',
          'POST /api/auth/logout': 'User logout',
          'GET /api/auth/me': 'Get current user info'
        },
        routes: {
          'GET /api/routes': 'Search routes',
          'POST /api/routes': 'Create route (drivers only)',
          'GET /api/routes/:id': 'Get route details',
          'PUT /api/routes/:id': 'Update route',
          'DELETE /api/routes/:id': 'Delete route',
          'GET /api/routes/:id/bookings': 'Get route bookings',
          'GET /api/routes/user/:userId': 'Get user routes'
        },
        bookings: {
          'POST /api/bookings': 'Create booking',
          'GET /api/bookings/:id': 'Get booking details',
          'PUT /api/bookings/:id/confirm': 'Confirm booking',
          'PUT /api/bookings/:id/reject': 'Reject booking',
          'PUT /api/bookings/:id/cancel': 'Cancel booking',
          'PUT /api/bookings/:id/complete': 'Complete booking',
          'GET /api/bookings/user/:userId': 'Get user bookings',
          'GET /api/bookings': 'Get current user bookings'
        },
        chat: {
          'GET /api/conversations/:bookingId': 'Get/create conversation',
          'POST /api/conversations/:conversationId/messages': 'Send message',
          'GET /api/conversations/:conversationId/messages': 'Get messages',
          'PUT /api/conversations/:conversationId/read': 'Mark as read',
          'GET /api/conversations': 'Get user conversations'
        },
        location: {
          'POST /api/location/update': 'Update location (drivers)',
          'GET /api/location/user/:userId': 'Get user location',
          'GET /api/location/user/:userId/history': 'Get location history',
          'GET /api/location/nearby-drivers': 'Find nearby drivers',
          'GET /api/location/driver/:driverId/route-progress': 'Get route progress'
        },
        stats: {
          'GET /api/stats/driver/:driverId': 'Get driver statistics',
          'GET /api/stats/customer/:customerId': 'Get customer statistics'
        },
        system: {
          'GET /api/health': 'Health check',
          'GET /api': 'API documentation'
        }
      },
      websocket: {
        url: 'ws://localhost:5000',
        events: [
          'location-update',
          'booking-status-change',
          'new-message',
          'route-update',
          'driver-online',
          'driver-offline',
          'notification'
        ]
      }
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server
  setupWebSocket(httpServer);

  return httpServer;
}
