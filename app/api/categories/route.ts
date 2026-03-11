import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const categories = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY type, name').all(session.userId);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, type, color, budget_limit } = await request.json();

    if (!name || !type || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO categories (id, user_id, name, type, color, budget_limit)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, session.userId, name, type, color, budget_limit || null);

    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
