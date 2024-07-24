import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { CastMemberType } from '../../../domain/cast-member-type';

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: CastMemberType;
  is_active?: boolean;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsEnum(CastMemberType)
  @IsNotEmpty()
  type: CastMemberType;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props: CreateCastMemberInputConstructorProps) {
    if (!props) return;

    this.name = props.name;
    this.type = props.type;
    this.is_active = props.is_active;
  }
}

export class ValidateCreateClassMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
  }
}
