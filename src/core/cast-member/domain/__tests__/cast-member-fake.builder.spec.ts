import { CastMemberFakeBuilder } from './../cast-member-fake.builder';
import { Chance } from 'chance';

import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from '../cast-member-type';

describe('CategoryFakerBuilder Unit Tests', () => {
  describe('cast_member_id prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.cast_member_id).toThrow(
        new Error(
          "Property cast_member_id not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_cast_member_id']).toBeUndefined();
    });

    test('withUuid', () => {
      const cast_member_id = new Uuid();
      const $this = faker.withUuid(cast_member_id);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_cast_member_id']).toBe(cast_member_id);

      faker.withUuid(() => cast_member_id);
      //@ts-expect-error _cast_member_id is a callable
      expect(faker['_cast_member_id']()).toBe(cast_member_id);

      expect(faker.cast_member_id).toBe(cast_member_id);
    });

    test('should assign correct category IDs when multiple categories are created', () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withUuid(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const categoryId = new Uuid();
      mockFactory = jest.fn(() => categoryId);
      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withUuid(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].cast_member_id).toBe(categoryId);
      expect(fakerMany.build()[1].cast_member_id).toBe(categoryId);
    });
  });

  describe('name prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();
    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name');

      expect(faker.name).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('type prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();
    test('should be a function', () => {
      expect(typeof faker['_type']).toBe('function');
    });

    test('should call the pickone method', () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, 'pickone');
      faker['chance'] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test('withType', () => {
      const $this = faker.withType(CastMemberType.DIRECTOR);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_type']).toBe(CastMemberType.DIRECTOR);

      faker.withType(() => CastMemberType.DIRECTOR);
      //@ts-expect-error type is callable
      expect(faker['_type']()).toBe(CastMemberType.DIRECTOR);

      expect(faker.type).toBe(CastMemberType.DIRECTOR);
    });
  });

  describe('is_active prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();
    test('should be a function', () => {
      expect(typeof faker['_is_active']).toBe('function');
    });

    test('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_is_active']).toBe(true);
      expect(faker.is_active).toBe(true);
    });

    test('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_is_active']).toBe(false);
      expect(faker.is_active).toBe(false);
    });
  });

  describe('created_at prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();

    test('should throw error when any with methods has called', () => {
      const fakerCategory = CastMemberFakeBuilder.aCastMember();
      expect(() => fakerCategory.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_created_at']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _created_at is a callable
      expect(faker['_created_at']()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    test('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.created_at?.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at?.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at?.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should create a category', () => {
    const faker = CastMemberFakeBuilder.aCastMember();
    let category = faker.build();

    expect(category.cast_member_id).toBeInstanceOf(Uuid);
    expect(typeof category.name === 'string').toBeTruthy();
    expect(typeof category.type === 'number').toBeTruthy();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const cast_member_id = new Uuid();
    category = faker
      .withUuid(cast_member_id)
      .withName('name test')
      .withType(CastMemberType.DIRECTOR)
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    expect(category.cast_member_id.id).toBe(cast_member_id.id);
    expect(category.name).toBe('name test');
    expect(category.type).toBe(CastMemberType.DIRECTOR);
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBe(created_at);
  });

  test('should create many categories', () => {
    const faker = CastMemberFakeBuilder.theCastMembers(2);
    let categories = faker.build();

    categories.forEach((category) => {
      expect(category.cast_member_id).toBeInstanceOf(Uuid);
      expect(typeof category.name === 'string').toBeTruthy();
      expect(typeof category.type === 'number').toBeTruthy();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const cast_member_id = new Uuid();
    categories = faker
      .withUuid(cast_member_id)
      .withName('name test')
      .withType(CastMemberType.ACTOR)
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    categories.forEach((category) => {
      expect(category.cast_member_id.id).toBe(cast_member_id.id);
      expect(category.name).toBe('name test');
      expect(category.type).toBe(CastMemberType.ACTOR);
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBe(created_at);
    });
  });
});
