// import { FieldsErrors } from './shared/domain/validators/validator-fields-interface';
import { Notification } from './domain/validators/notification';

declare global {
  namespace jest {
    interface Matchers<R> {
      //containsErrorMessages: (expected: FieldsErrors) => R;
      notificationContainsErrorMessages: (expected: Notification) => R;
    }
  }
}
