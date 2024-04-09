import { FieldsErrors } from '../validators/validator-fields-interface';

export class EntityValidationError extends Error {
  constructor(
    public errors: FieldsErrors[],
    message = 'Entity Validation Error',
  ) {
    super(message);
  }

  count() {
    return Object.keys(this.errors).length;
  }
}
