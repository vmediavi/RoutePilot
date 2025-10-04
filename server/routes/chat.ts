import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { requireAuth } from './auth';
import { sendMessageSchema } from '@shared/types';
import { z } from 'zod';

const router = Router();

// GET /api/conversations/:bookingId - Get or create conversation for booking
router.get('/:bookingId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = (req as any).userId;

    // Check if booking exists and user is involved
    const booking = await storage.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.customerId !== userId && booking.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this conversation'
      });
    }

    // Try to get existing conversation
    let conversation = await storage.getConversationByBooking(bookingId);

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await storage.createConversation(
        bookingId,
        booking.driverId,
        booking.customerId
      );
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/conversations/:conversationId/messages - Send message
router.post('/:conversationId/messages', requireAuth, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).userId;
    const validatedData = sendMessageSchema.parse(req.body);

    // Check if conversation exists and user is involved
    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    if (conversation.customerId !== userId && conversation.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to send messages in this conversation'
      });
    }

    const message = await storage.addMessage(conversationId, {
      senderId: userId,
      text: validatedData.text,
      type: validatedData.type || 'text'
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/conversations/:conversationId/messages - Get messages
router.get('/:conversationId/messages', requireAuth, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).userId;
    const { limit = '50', offset = '0' } = req.query;

    // Check if conversation exists and user is involved
    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    if (conversation.customerId !== userId && conversation.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view messages in this conversation'
      });
    }

    const messages = await storage.getMessages(conversationId);

    // Apply pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    const paginatedMessages = messages.slice(offsetNum, offsetNum + limitNum);

    // Mark messages as read for current user
    await storage.markMessagesAsRead(conversationId, userId);

    res.json({
      success: true,
      data: paginatedMessages,
      pagination: {
        total: messages.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < messages.length
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/conversations/:conversationId/read - Mark conversation as read
router.put('/:conversationId/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).userId;

    // Check if conversation exists and user is involved
    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    if (conversation.customerId !== userId && conversation.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to mark this conversation as read'
      });
    }

    await storage.markMessagesAsRead(conversationId, userId);

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/conversations - Get all conversations for current user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const conversations = await storage.getUserConversations(userId);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/conversations/booking/:bookingId/exists - Check if conversation exists for booking
router.get('/booking/:bookingId/exists', requireAuth, async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = (req as any).userId;

    // Check if booking exists and user is involved
    const booking = await storage.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.customerId !== userId && booking.driverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to check this booking\'s conversation'
      });
    }

    const conversation = await storage.getConversationByBooking(bookingId);

    res.json({
      success: true,
      data: {
        exists: !!conversation,
        conversationId: conversation?.id || null
      }
    });
  } catch (error) {
    console.error('Check conversation exists error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export { router as chatRouter };