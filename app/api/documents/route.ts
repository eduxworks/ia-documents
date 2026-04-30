import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { DocumentsResponse } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse<DocumentsResponse>> {
  try {
    const db = await getDatabase();
    const documents = await db
      .collection('documents')
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();

    const formattedDocs = documents.map(doc => ({
      ...doc,
      _id: doc._id?.toString(),
    }));

    return NextResponse.json({
      success: true,
      documents: formattedDocs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
