import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { requireAuth } from './auth';
import { createBookingSchema } from '@shared/types';
import { z } from 'zod';

const router = Router();

// POST /api/bookings - Create booking request
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const validatedData = createBookingSchema.parse(req.body);

    // Verify user is a customer
    const user = await storage.getUser(userId);
    if (!user || user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        error: 'Only customers can create bookings'
      });
    }

    // Check if route exists and has available seats
    const route = await storage.getRoute(validatedData.routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    if (route.availableSeats < validatedData.seats) {
      return res.status(400).json({
        success: false,
        error: 'Not enough seats available'
      });
    }

    // Check if user already has a booking for this route
    const existingBookings = await storage.getUserBookings(userId);
    const existingBooking = existingBookings.find(b =>
      b.routeId === validatedData.routeId &&
      (b.status === 'pending' || b.status === 'confirmed')
    );

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active booking for this route'
      });
    }

    const booking = await storage.createBooking({
      ...validatedData,
      customerId: userId
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/bookings/:id - Get booking details
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is involved in the booking (customer or driver)
    if (booking.customerId !== userId && booking.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/bookings/:id/confirm - Confirm booking (driver or customer)
router.put('/:id/confirm', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is involved in the booking
    if (booking.customerId !== userId && booking.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to confirm this booking'
      });
    }

    // Can only confirm pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Booking is not in pending status'
      });
    }

    const updates: any = {};

    if (booking.driverId === userId) {
      updates.driverConfirmed = true;
    } else if (booking.customerId === userId) {
      updates.customerConfirmed = true;
    }

    // If both parties have confirmed, mark booking as confirmed
    if ((booking.driverConfirmed || updates.driverConfirmed) &&
        (booking.customerConfirmed || updates.customerConfirmed)) {
      updates.status = 'confirmed';
    }

    const updatedBooking = await storage.updateBooking(id, updates);

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/bookings/:id/reject - Reject booking
router.put('/:id/reject', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Only driver can reject bookings
    if (booking.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only drivers can reject bookings'
      });
    }

    // Can only reject pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Booking is not in pending status'
      });
    }

    const updatedBooking = await storage.updateBooking(id, {
      status: 'cancelled'
    });

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is involved in the booking
    if (booking.customerId !== userId && booking.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Can only cancel pending or confirmed bookings
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel booking in current status'
      });
    }

    const updatedBooking = await storage.updateBooking(id, {
      status: 'cancelled'
    });

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/bookings/:id/complete - Mark booking as completed
router.put('/:id/complete', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Only driver can mark as completed
    if (booking.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only drivers can mark bookings as completed'
      });
    }

    // Can only complete confirmed bookings
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Only confirmed bookings can be completed'
      });
    }

    const updatedBooking = await storage.updateBooking(id, {
      status: 'completed'
    });

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/users/:userId/bookings - Get user bookings
router.get('/user/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).userId;

    // Users can only view their own bookings
    if (userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view these bookings'
      });
    }

    const bookings = await storage.getUserBookings(userId);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/bookings - Get all bookings for current user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { status, role } = req.query;

    let bookings = await storage.getUserBookings(userId);

    // Filter by status if provided
    if (status && typeof status === 'string') {
      bookings = bookings.filter(b => b.status === status);
    }

    // Filter by role perspective if provided
    if (role && typeof role === 'string') {
      if (role === 'driver') {
        bookings = bookings.filter(b => b.driverId === userId);
      } else if (role === 'customer') {
        bookings = bookings.filter(b => b.customerId === userId);
      }
    }

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export { router as bookingsRouter };