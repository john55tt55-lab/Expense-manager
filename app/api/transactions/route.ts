import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // In a real app we would paginate, filter by date, etc.
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
    
    const query = `
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      ORDER BY t.date DESC, t.created_at DESC
      LIMIT ?
    `;

    const transactions = db.prepare(query).all(session.userId, limit);
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { category_id, amount, type, date, notes } = await request.json();

    if (!amount || !type || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO transactions (id, user_id, category_id, amount, type, date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, session.userId, category_id || null, parseFloat(amount), type, date, notes || null);

    return NextResponse.json({ message: 'Transaction created successfully', id }, { status: 201 });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
