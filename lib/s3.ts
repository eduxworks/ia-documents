import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

const bucket = process.env.S3_BUCKET || 'ia-documents';

export async function uploadToS3(key: string, body: Buffer, mimetype: string): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: mimetype,
  });

  await s3Client.send(command);
}

export async function getObjectUrl(key: string): Promise<string> {
  return `${process.env.S3_ENDPOINT || 'http://localhost:9000'}/${bucket}/${key}`;
}

export async function listObjects(prefix?: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return response.Contents?.map(obj => obj.Key || '') || [];
}
