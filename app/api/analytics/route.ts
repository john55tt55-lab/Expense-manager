import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.userId;

    // Expenses by category
    const expenseByCategoryQuery = `
      SELECT c.name, c.color, SUM(t.amount) as total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.type = 'expense'
      GROUP BY c.id
      ORDER BY total DESC
    `;
    const expenseByCategory = db.prepare(expenseByCategoryQuery).all(userId);

    // Monthly Income vs Expense (last 6 months)
    // For SQLite, getting month from date: strftime('%Y-%m', date)
    const monthlyQuery = `
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE user_id = ? 
        AND date >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `;
    const monthlyData = db.prepare(monthlyQuery).all(userId);

    return NextResponse.json({
      expenseByCategory,
      monthlyData
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
