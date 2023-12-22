import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-field";

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  constructor(props: Category) {
    this.name = props.name;
    this.description = props.description;
    this.is_active = props.is_active;
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules>{
  validate(entity: Category) {
    const data = new CategoryRules(entity);

    return super.validate(data);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator()
  }
}
