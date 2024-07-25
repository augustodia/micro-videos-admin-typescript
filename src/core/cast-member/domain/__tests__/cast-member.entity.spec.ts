import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from '../cast-member-type';
import { CastMember } from '../cast-member.entity';

describe('CastMember Without Validator Unit Tests', () => {
  beforeEach(() => {
    CastMember.prototype.validate = jest
      .fn()
      .mockImplementation(CastMember.prototype.validate);
  });

  test('constructor of CastMember', () => {
    let castMember = new CastMember({
      name: 'Actor',
      type: CastMemberType.ACTOR,
    });

    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Actor');
    expect(castMember.type).toBe(CastMemberType.ACTOR);
    expect(castMember.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    castMember = new CastMember({
      name: 'Actor',
      type: CastMemberType.ACTOR,
      created_at,
    });

    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Actor');
    expect(castMember.type).toBe(CastMemberType.ACTOR);
    expect(castMember.created_at).toBe(created_at);

    created_at = new Date();
    castMember = new CastMember({
      name: 'Director',
      type: CastMemberType.DIRECTOR,
      created_at,
    });

    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Director');
    expect(castMember.type).toBe(CastMemberType.DIRECTOR);
    expect(castMember.created_at).toBe(created_at);
  });

  describe('create command', () => {
    test('create a cast member with type actor', () => {
      const castMember = CastMember.create({
        name: 'Actor',
        type: CastMemberType.ACTOR,
      });

      expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
      expect(castMember.name).toBe('Actor');
      expect(castMember.type).toBe(CastMemberType.ACTOR);
      expect(castMember.created_at).toBeInstanceOf(Date);
      expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
      expect(castMember.notification.hasErrors()).toBe(false);
    });

    test('create a cast member with type director', () => {
      const castMember = CastMember.create({
        name: 'Director',
        type: CastMemberType.DIRECTOR,
      });

      expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
      expect(castMember.name).toBe('Director');
      expect(castMember.type).toBe(CastMemberType.DIRECTOR);
      expect(castMember.created_at).toBeInstanceOf(Date);
      expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
      expect(castMember.notification.hasErrors()).toBe(false);
    });
  });

  describe('cast_member_id field', () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }];

    test.each(arrange)('should be is %j', (props) => {
      const category = new CastMember(props as any);
      expect(category.cast_member_id).toBeInstanceOf(Uuid);
    });
  });

  test('should change name', () => {
    const castMember = new CastMember({
      name: 'Actor',
      type: CastMemberType.ACTOR,
    });

    castMember.changeName('Actor 2');
    expect(castMember.name).toBe('Actor 2');
    expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
  });

  test('should change type', () => {
    const castMember = new CastMember({
      name: 'CastMember',
      type: CastMemberType.ACTOR,
    });

    castMember.changeType(CastMemberType.DIRECTOR);
    expect(castMember.type).toBe(CastMemberType.DIRECTOR);
    expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
  });
});

describe('CastMember Validator', () => {
  describe('create command', () => {
    test('should not create a cast member with empty name', () => {
      const castMember = CastMember.create({
        name: '',
        type: CastMemberType.ACTOR,
      });

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be longer than or equal to 3 characters'],
        },
      ]);
    });

    test('should not create a cast member with name length less than 3', () => {
      const castMember = CastMember.create({
        name: 'A',
        type: CastMemberType.ACTOR,
      });

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be longer than or equal to 3 characters'],
        },
      ]);
    });

    test('should not create a cast member with name length greater than 255', () => {
      const castMember = CastMember.create({
        name: 'A'.repeat(256),
        type: CastMemberType.ACTOR,
      });

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });

    test('should not create a cast member with invalid type', () => {
      const castMember = CastMember.create({
        name: 'Actor',
        type: 3 as CastMemberType,
      });

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          type: ['type must be one of the following values: 1, 2'],
        },
      ]);
    });

    test('should not create a cast member with invalid name and type', () => {
      const castMember = CastMember.create({
        name: 'A',
        type: 3 as CastMemberType,
      });

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be longer than or equal to 3 characters'],
          type: ['type must be one of the following values: 1, 2'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    test('should not change name with empty name', () => {
      const castMember = CastMember.create({
        name: 'Actor',
        type: CastMemberType.ACTOR,
      });

      castMember.changeName('');
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be longer than or equal to 3 characters'],
        },
      ]);
    });

    test('should not change name with name length less than 3', () => {
      const castMember = CastMember.create({
        name: 'Actor',
        type: CastMemberType.ACTOR,
      });

      castMember.changeName('A');
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be longer than or equal to 3 characters'],
        },
      ]);
    });

    test('should not change name with name length greater than 255', () => {
      const castMember = CastMember.create({
        name: 'Actor',
        type: CastMemberType.ACTOR,
      });

      castMember.changeName('A'.repeat(256));
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeType method', () => {
    test('should not change type with invalid type', () => {
      const castMember = CastMember.create({
        name: 'Actor',
        type: CastMemberType.ACTOR,
      });

      castMember.changeType(3 as CastMemberType);
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          type: ['type must be one of the following values: 1, 2'],
        },
      ]);
    });
  });
});
