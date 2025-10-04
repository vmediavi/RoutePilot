import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { requireAuth } from './auth';
import { createRouteSchema } from '@shared/types';
import { z } from 'zod';

const router = Router();

// GET /api/routes - Search and list routes
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      origin,
      destination,
      date,
      minSeats,
      maxPrice,
      driverId,
      page = '1',
      limit = '20'
    } = req.query;

    const filters: any = {};
    if (origin) filters.origin = origin as string;
    if (destination) filters.destination = destination as string;
    if (date) filters.date = date as string;
    if (minSeats) filters.minSeats = parseInt(minSeats as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
    if (driverId) filters.driverId = driverId as string;

    const routes = await storage.getRoutes(filters);

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedRoutes = routes.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedRoutes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: routes.length,
        pages: Math.ceil(routes.length / limitNum)
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/routes - Create new route
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const validatedData = createRouteSchema.parse(req.body);

    // Verify user is a driver
    const user = await storage.getUser(userId);
    if (!user || user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        error: 'Only drivers can create routes'
      });
    }

    const route = await storage.createRoute({
      ...validatedData,
      driverId: userId
    });

    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/routes/:id - Get route details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const route = await storage.getRoute(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/routes/:id - Update route
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const route = await storage.getRoute(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    // Check if user owns the route
    if (route.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this route'
      });
    }

    // Validate updates (partial schema)
    const allowedUpdates = ['routeName', 'departureDate', 'departureTime', 'totalSeats', 'price', 'notes', 'status'];
    const updates: any = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedRoute = await storage.updateRoute(id, updates);

    res.json({
      success: true,
      data: updatedRoute
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/routes/:id - Delete route
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const route = await storage.getRoute(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    // Check if user owns the route
    if (route.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this route'
      });
    }

    // Check if route has active bookings
    const bookings = await storage.getRouteBookings(id);
    const activeBookings = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed');

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete route with active bookings'
      });
    }

    const deleted = await storage.deleteRoute(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/routes/:id/bookings - Get route bookings
router.get('/:id/bookings', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const route = await storage.getRoute(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    // Check if user owns the route
    if (route.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view route bookings'
      });
    }

    const bookings = await storage.getRouteBookings(id);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get route bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/users/:userId/routes - Get user routes
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const routes = await storage.getUserRoutes(userId);

    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    console.error('Get user routes error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export { router as routesRouter };