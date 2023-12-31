import { validateSync } from "class-validator";
import { FieldsErrors, IValidatorFields } from "./validator-fields-interface";

export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated> {
  errors: FieldsErrors = {};
  validatedData: PropsValidated | null = null;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (!errors.length) {
      this.validatedData = data;

      return true;
    }

    this.errors = {};
    for (const error of errors) {
      const field = error.property;
      this.errors[field] = Object.values(error.constraints ?? {});
    }

    return false;
  }
}
