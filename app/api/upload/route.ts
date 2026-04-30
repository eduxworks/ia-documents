import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { Document, UploadResponse } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadataStr = formData.get('metadata') as string || '{}';
    const tagsStr = formData.get('tags') as string || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const metadata = JSON.parse(metadataStr) as Record<string, string>;
    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${Date.now()}-${file.name}`;

    await uploadToS3(key, buffer, file.type);

    const db = await getDatabase();
    const document: Omit<Document, '_id'> = {
      filename: file.name,
      key,
      bucket: 'ia-documents',
      mimetype: file.type,
      size: buffer.length,
      uploadedAt: new Date(),
      metadata,
      tags,
    };

    const result = await db.collection('documents').insertOne(document as any);

    return NextResponse.json(
      {
        success: true,
        document: { ...document, _id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
