import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly value: string, readonly value2: number) {
    super();
  }
}

class SimpleNullableValueObject extends ValueObject {
  constructor(readonly value: string | null) {
    super();
  }
}


describe('ValueObject Unit Tests', () => {
  test('should compare two value objects', () => {
    const vo1 = new StringValueObject('test');
    const vo2 = new StringValueObject('test');

    expect(vo1.equals(vo2)).toBeTruthy();
  })

  test('should compare two different value objects', () => {
    const vo1 = new StringValueObject('test');
    const vo2 = new StringValueObject('test2');

    expect(vo1.equals(vo2)).toBeFalsy();
  });

  test('should compare two complex value objects', () => {
    const vo1 = new ComplexValueObject('test', 1);
    const vo2 = new ComplexValueObject('test', 1);

    expect(vo1.equals(vo2)).toBeTruthy();
  });

  test('should compare two different complex value objects', () => {
    const vo1 = new ComplexValueObject('test', 1);
    const vo2 = new ComplexValueObject('test', 2);

    expect(vo1.equals(vo2)).toBeFalsy();
  });

  test('should compare two complex nullable value objects', () => {
    const vo1 = new SimpleNullableValueObject('test');
    const vo2 = new SimpleNullableValueObject('test');

    expect(vo1.equals(vo2)).toBeTruthy();
  });

  test('should compare two different complex nullable value objects', () => {
    const vo1 = new SimpleNullableValueObject('test');
    const vo2 = new SimpleNullableValueObject('test2');

    expect(vo1.equals(vo2)).toBeFalsy();
  });

  test('should compare two nullable value objects', () => {
    const vo1 = new SimpleNullableValueObject('test');
    const vo2 = null;

    expect(vo1.equals(vo2 as any)).toBeFalsy();
  });

  test('should compare two different value objects', () => {
    const vo1 = new StringValueObject('test');
    const vo2 = new ComplexValueObject('test', 1);

    expect(vo1.equals(vo2)).toBeFalsy();
  })
});