import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const query = `
      SELECT t.date, t.type, c.name as category, t.amount, t.notes
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      ORDER BY t.date DESC
    `;

    const transactions = db.prepare(query).all(session.userId) as any[];

    // Convert to CSV
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Notes'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(t => {
        // Escape quotes and commas in notes
        const notes = t.notes ? `"${t.notes.replace(/"/g, '""')}"` : '""';
        return [
          t.date,
          t.type,
          t.category || 'Uncategorized',
          t.amount.toFixed(2),
          notes
        ].join(',');
      })
    ];

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="transactions_export.csv"'
      }
    });
  } catch (error) {
    console.error('Failed to export transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
