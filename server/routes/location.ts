import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { requireAuth } from './auth';
import { updateLocationSchema } from '@shared/types';
import { z } from 'zod';

const router = Router();

// POST /api/location/update - Update user location
router.post('/update', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const validatedData = updateLocationSchema.parse(req.body);

    // Verify user is a driver (only drivers need to update location)
    const user = await storage.getUser(userId);
    if (!user || user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        error: 'Only drivers can update location'
      });
    }

    await storage.updateLocation(userId, validatedData);

    res.json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/location/user/:userId - Get user current location
router.get('/user/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).userId;

    // Check if user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Only the user themselves or users with active bookings can view location
    if (userId !== currentUserId) {
      // Check if current user has active booking with this driver
      const userBookings = await storage.getUserBookings(currentUserId);
      const hasActiveBooking = userBookings.some(booking =>
        booking.driverId === userId &&
        (booking.status === 'confirmed' || booking.status === 'pending')
      );

      if (!hasActiveBooking) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to view this user\'s location'
        });
      }
    }

    const location = await storage.getUserLocation(userId);
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'No location data available'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Get user location error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/location/user/:userId/history - Get user location history
router.get('/user/:userId/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).userId;
    const { limit = '50' } = req.query;

    // Check if user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Only the user themselves can view their location history
    if (userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this user\'s location history'
      });
    }

    const limitNum = Math.min(parseInt(limit as string), 100); // Max 100 locations
    const locationHistory = await storage.getLocationHistory(userId, limitNum);

    res.json({
      success: true,
      data: locationHistory
    });
  } catch (error) {
    console.error('Get location history error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/location/user/:userId/history - Clear user location history
router.delete('/user/:userId/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).userId;

    // Only the user themselves can clear their location history
    if (userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to clear this user\'s location history'
      });
    }

    await storage.clearLocationHistory(userId);

    res.json({
      success: true,
      message: 'Location history cleared successfully'
    });
  } catch (error) {
    console.error('Clear location history error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/location/nearby-drivers - Get nearby drivers (mock implementation)
router.get('/nearby-drivers', requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      latitude,
      longitude,
      radius = '5000', // 5km default radius
      limit = '10'
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusNum = parseInt(radius as string);
    const limitNum = parseInt(limit as string);

    // Get all users with driver role
    const allUsers = await storage.getAllUsers();
    const drivers = allUsers.filter(user => user.role === 'driver');

    const nearbyDrivers = [];

    for (const driver of drivers) {
      const location = await storage.getUserLocation(driver.id);
      if (location) {
        // Simple distance calculation (not accurate for large distances)
        const distance = Math.sqrt(
          Math.pow(location.latitude - lat, 2) +
          Math.pow(location.longitude - lng, 2)
        ) * 111000; // Rough conversion to meters

        if (distance <= radiusNum) {
          nearbyDrivers.push({
            driver: {
              id: driver.id,
              username: driver.username,
              profile: driver.profile
            },
            location,
            distance: Math.round(distance)
          });
        }
      }
    }

    // Sort by distance and limit results
    nearbyDrivers.sort((a, b) => a.distance - b.distance);
    const limitedDrivers = nearbyDrivers.slice(0, limitNum);

    res.json({
      success: true,
      data: limitedDrivers
    });
  } catch (error) {
    console.error('Get nearby drivers error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/location/driver/:driverId/route-progress - Get driver's progress on active route
router.get('/driver/:driverId/route-progress', requireAuth, async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    // Check if driver exists
    const driver = await storage.getUser(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({
        success: false,
        error: 'Driver not found'
      });
    }

    // Get driver's current location
    const currentLocation = await storage.getUserLocation(driverId);
    if (!currentLocation) {
      return res.status(404).json({
        success: false,
        error: 'Driver location not available'
      });
    }

    // Get driver's active routes
    const routes = await storage.getUserRoutes(driverId);
    const activeRoutes = routes.filter(route => route.status === 'active');

    // For this mock, return the first active route with progress
    if (activeRoutes.length > 0) {
      const route = activeRoutes[0];

      // Mock route progress calculation
      const progress = {
        routeId: route.id,
        currentLocation,
        nextStop: route.stops[1], // Next stop after origin
        completedStops: [route.stops[0]], // Origin completed
        estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins from now
        progress: 0.25 // 25% complete
      };

      res.json({
        success: true,
        data: progress
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: 'No active routes found'
      });
    }
  } catch (error) {
    console.error('Get route progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/location/statistics - Get location tracking statistics
router.get('/statistics', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Only drivers have location statistics
    const user = await storage.getUser(userId);
    if (!user || user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        error: 'Only drivers have location statistics'
      });
    }

    const locationHistory = await storage.getLocationHistory(userId, 100);
    const currentLocation = await storage.getUserLocation(userId);

    // Calculate mock statistics
    const stats = {
      totalLocationUpdates: locationHistory.length,
      averageAccuracy: locationHistory.length > 0
        ? Math.round(locationHistory.reduce((sum, loc) => sum + loc.accuracy, 0) / locationHistory.length)
        : 0,
      lastUpdate: currentLocation?.timestamp || null,
      isOnline: currentLocation ? (Date.now() - new Date(currentLocation.timestamp).getTime()) < 5 * 60 * 1000 : false, // Online if updated in last 5 minutes
      averageSpeed: locationHistory.length > 0
        ? Math.round(locationHistory.reduce((sum, loc) => sum + (loc.speed || 0), 0) / locationHistory.length)
        : 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get location statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export { router as locationRouter };