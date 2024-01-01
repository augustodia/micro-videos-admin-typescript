import {v4 as uuidv4, validate as uuidValidate} from 'uuid';
import { ValueObject } from '../value-object';

export class Uuid extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id ?? uuidv4();
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.id);

    if(!isValid) {
      throw new InvalidUuidError(this.id);
    }
  }
}

export class InvalidUuidError extends Error {
  constructor(uuid: string) {
    super(`Invalid UUID: ${uuid}`);
    this.name = 'InvalidUuidError';
  }
}