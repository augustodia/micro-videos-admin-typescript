import { IStorage } from '@core/shared/application/storage.interface';
import * as Buffer from 'node:buffer';

export class StorageInMemory implements IStorage {
  private storage: Map<string, { data: Buffer; mime_type: string }> = new Map();

  async get(id: string): Promise<{ data: Buffer; mime_type: string }> {
    const file = this.storage.get(id);
    if (!file) {
      throw new Error('File not found');
    }

    return {
      data: file.data,
      mime_type: file.mime_type,
    };
  }

  async store(object: {
    id: string;
    data: Buffer;
    mime_type?: string;
  }): Promise<void> {
    this.storage.set(object.id, {
      data: object.data,
      mime_type: object.mime_type || 'image',
    });
  }
}
