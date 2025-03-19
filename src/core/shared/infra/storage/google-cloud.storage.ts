import { IStorage } from '@core/shared/application/storage.interface';
import * as Buffer from 'node:buffer';
import { Storage as GoogleCloudStorageSDK } from '@google-cloud/storage';

export class GoogleCloudStorage implements IStorage {
  constructor(
    private readonly storageSDK: GoogleCloudStorageSDK,
    private readonly bucketName: string,
  ) {}

  async get(
    id: string,
  ): Promise<{ data: Buffer; mime_type: string | undefined }> {
    const file = this.storageSDK.bucket(this.bucketName).file(id);
    const url = file.cloudStorageURI;
    const [content, metadata] = await Promise.all([
      file.download(),
      file.getMetadata(),
    ]);

    return {
      data: content[0],
      mime_type: metadata[0].contentType,
    };
  }

  store(object: {
    id: string;
    data: Buffer;
    mime_type?: string;
  }): Promise<void> {
    const bucket = this.storageSDK.bucket(this.bucketName);
    const file = bucket.file(object.id);
    return file.save(object.data, {
      metadata: {
        contentType: object.mime_type,
      },
    });
  }
}
