import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, InsertUser } from '../shared/schema';
import { storage } from './storage';

// Secret key for JWT signing - in production, this would be in environment variables
const JWT_SECRET = 'your-secret-key-f1ttr4ck-3xp3rt-m0d3'; // Replace with a proper secure key in production

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  
  // Set token to expire in 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function register(userData: InsertUser): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await storage.getUserByUsername(userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  // Hash the password
  const hashedPassword = await hashPassword(userData.password);
  
  // Create user with hashed password
  const user = await storage.createUser({
    ...userData,
    password: hashedPassword
  });
  
  // Generate JWT token
  const token = generateToken(user);
  
  // Remove password from returned user object
  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  // Find user by username
  const user = await storage.getUserByUsername(username);
  
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  // Compare passwords
  const isPasswordValid = await comparePasswords(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }
  
  // Generate JWT token
  const token = generateToken(user);
  
  // Remove password from returned user object
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
}

// Middleware for Express to verify JWT token
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// For use in client-side auth context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: Omit<User, 'password'> | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: InsertUser) => Promise<void>;
}