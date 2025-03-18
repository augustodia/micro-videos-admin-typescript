export interface IStorage {
  store(object: {
    id: string;
    data: Buffer;
    mime_type?: string;
  }): Promise<void>;
  get(id: string): Promise<{ data: Buffer; mime_type: string }>;
}
