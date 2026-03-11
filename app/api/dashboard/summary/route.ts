import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;

    // Get all transactions for the user
    const transactions = db.prepare('SELECT amount, type FROM transactions WHERE user_id = ?').all(userId) as any[];

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else if (t.type === 'expense') {
        totalExpenses += t.amount;
      }
    });

    const totalBalance = totalIncome - totalExpenses;

    return NextResponse.json({
      totalBalance,
      totalIncome,
      totalExpenses
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch dashboard summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
