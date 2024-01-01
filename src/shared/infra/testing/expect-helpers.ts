import { EntityValidationError } from '../../domain/errors/validation.error';
import { ClassValidatorFields } from '../../domain/validators/class-validator-field';
import { FieldsErrors } from './../../domain/validators/validator-fields-interface';

type Expected = {
  validator: ClassValidatorFields<any>;
  data: any;
} | (() => any)

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError

        return assertContainsErrorsMessages(error.errors, received);
      }
    } 
      const { validator, data } = expected;
      const validate = validator.validate(data);

      if (validate) {
        isValid();
      }

      return assertContainsErrorsMessages(validator.errors, received);
    }
  })

function assertContainsErrorsMessages(expected: FieldsErrors, received: FieldsErrors) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  const receivedMessage = JSON.stringify(received);
  const expectedMessage = JSON.stringify(expected);

  return isMatch ? isValid() : {
    message: () => `The validation errors not contains ${receivedMessage}. Current: ${expectedMessage}`,
    pass: false
  };
}

function isValid() {
  return {
    message: () => '',
    pass: true,
  }
}
