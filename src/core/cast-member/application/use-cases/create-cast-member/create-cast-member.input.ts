import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { CastMemberTypeInput } from '../../common/cast-member-type.enum';

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: CastMemberTypeInput;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsEnum(CastMemberTypeInput)
  @IsNotEmpty()
  type: CastMemberTypeInput;

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
