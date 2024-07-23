import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { CastMemberType } from '../../../domain/cast-member-type';

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: CastMemberType;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsEnum(CastMemberType)
  @IsNotEmpty()
  type: CastMemberType;

  constructor(props: CreateCastMemberInputConstructorProps) {
    if (!props) return;

    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateCreateClassMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
  }
}
