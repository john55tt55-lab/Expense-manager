import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { setSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    // Insert user
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `).run(userId, name, email, passwordHash);

    // Seed default categories
    const defaultCategories = [
      { id: crypto.randomUUID(), user_id: userId, name: 'Salary', type: 'income', color: '#10b981' },
      { id: crypto.randomUUID(), user_id: userId, name: 'Freelance', type: 'income', color: '#3b82f6' },
      { id: crypto.randomUUID(), user_id: userId, name: 'Food & Dining', type: 'expense', color: '#f59e0b' },
      { id: crypto.randomUUID(), user_id: userId, name: 'Transport', type: 'expense', color: '#6366f1' },
      { id: crypto.randomUUID(), user_id: userId, name: 'Bills & Utilities', type: 'expense', color: '#ef4444' },
      { id: crypto.randomUUID(), user_id: userId, name: 'Shopping', type: 'expense', color: '#ec4899' },
      { id: crypto.randomUUID(), user_id: userId, name: 'Entertainment', type: 'expense', color: '#8b5cf6' }
    ];

    const insertCategory = db.prepare(`
      INSERT INTO categories (id, user_id, name, type, color) VALUES (?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const cat of defaultCategories) {
        insertCategory.run(cat.id, cat.user_id, cat.name, cat.type, cat.color);
      }
    })();

    // Create session (sets cookie)
    await setSession(userId, email);

    return NextResponse.json({ 
      user: { id: userId, name, email },
      message: 'Registration successful' 
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
