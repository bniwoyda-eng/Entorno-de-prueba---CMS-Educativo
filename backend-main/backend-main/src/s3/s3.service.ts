import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { envs } from 'src/config';
import sharp from 'sharp';

@Injectable()
export class S3Service {
  private readonly s3 = new S3Client({
    region: envs.AWS_REGION,
    credentials: {
      accessKeyId: envs.AWS_ACCESS_KEY_ID,
      secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
    },
  });

  private readonly bucket = envs.AWS_BUCKET_NAME;

  // ✅ Método general sin procesamiento
  async uploadFile(buffer: Buffer, key: string, mimeType: string): Promise<{ key: string; mimeType: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      });

      await this.s3.send(command);

      return { key, mimeType };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error uploading file to S3');
    }
  }

  // ✅ Método específico para imágenes
  async uploadImage(file: Express.Multer.File, folder = 'images', options?: { width?: number; quality?: number }): Promise<{ key: string; mimeType: string; url: string }> {
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('File is not an image');

    const id = uuid();
    const key = `${folder}/${id}.webp`;
    const quality = options?.quality ?? 85;

    try {
      const { data: buffer } = await sharp(file.buffer)
        .webp({ quality })
        .toBuffer({ resolveWithObject: true });

      const uploadResult = await this.uploadFile(buffer, key, 'image/webp');
      const url = await this.getPresignedUrl(uploadResult.key, 900); // 15 min

      return {
        ...uploadResult,
        url,
      };

    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error processing image');
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3.send(command);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error deleting file from S3');
    }
  }

  async getPresignedUrl(key: string, expiresIn = 60): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3, command, { expiresIn });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error generating presigned URL');
    }
  }
}
