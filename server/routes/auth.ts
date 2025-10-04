import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { loginSchema, registerSchema } from '@shared/types';
import { z } from 'zod';

const router = Router();

// Mock session store (in production, use Redis or database)
const sessions = new Map<string, { userId: string; expires: number }>();

// Generate mock session token
function generateSessionToken(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Mock session middleware
function requireAuth(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.session;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({
      success: false,
      error: 'Session expired'
    });
  }

  // Extend session
  session.expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  (req as any).userId = session.userId;
  next();
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if username already exists
    const existingUser = await storage.getUserByUsername(validatedData.username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }

    // Create new user
    const user = await storage.createUser({
      username: validatedData.username,
      password: validatedData.password, // In real app, hash this!
      role: validatedData.role,
      profile: validatedData.profile
    });

    // Create session
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, {
      userId: user.id,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

    // Don't return password
    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: sessionToken
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user by username
    const user = await storage.getUserByUsername(validatedData.username);
    if (!user || user.password !== validatedData.password) { // In real app, use bcrypt.compare()
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Create session
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, {
      userId: user.id,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

    // Don't return password
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: sessionToken
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.session;

  if (token) {
    sessions.delete(token);
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Don't return password
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/auth/session/validate
router.get('/session/validate', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      valid: true,
      userId: (req as any).userId
    }
  });
});

export { router as authRouter, requireAuth };