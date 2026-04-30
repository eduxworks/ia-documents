import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { Document, UploadResponse } from '@/lib/types';

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

    console.log('[UPLOAD] Starting upload:', { filename: file.name, size: buffer.length, key });

    try {
      console.log('[UPLOAD] Uploading to S3...');
      await uploadToS3(key, buffer, file.type);
      console.log('[UPLOAD] S3 upload successful');
    } catch (s3Error) {
      console.error('[UPLOAD] S3 upload failed:', s3Error);
      throw new Error(`S3 upload failed: ${s3Error instanceof Error ? s3Error.message : 'Unknown error'}`);
    }

    try {
      console.log('[UPLOAD] Saving to MongoDB...');
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
      console.log('[UPLOAD] MongoDB insert successful:', result.insertedId);

      return NextResponse.json(
        {
          success: true,
          document: { ...document, _id: result.insertedId.toString() },
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('[UPLOAD] MongoDB operation failed:', dbError);
      throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[UPLOAD] Complete error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
