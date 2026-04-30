import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { DocumentsResponse, Document } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse<DocumentsResponse>> {
  try {
    const db = await getDatabase();
    const documents = await db
      .collection('documents')
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();

    const formattedDocs: Document[] = documents.map(doc => ({
      _id: doc._id?.toString(),
      filename: doc.filename,
      key: doc.key,
      bucket: doc.bucket,
      mimetype: doc.mimetype,
      size: doc.size,
      uploadedAt: doc.uploadedAt,
      metadata: doc.metadata || {},
      tags: doc.tags || [],
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
