import {validate as uuidValidate} from 'uuid';
import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('Uuid Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')

  test('should throw error when uuid is invalid', () => {
    expect(() => 
      new Uuid('invalid-uuid')
    ).toThrow(new InvalidUuidError('invalid-uuid'))
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid uuid', () => {
    const uuid = new Uuid()
    expect(uuid.id).toBeDefined()
    expect(uuidValidate(uuid.id)).toBe(true)
  })

  test('should accept a valid uuid', () => {
    const uuid = new Uuid('c6e2f8c0-8a3a-4c6b-9e3d-6e0f0c50b7a7')
    expect(uuid.id).toBe('c6e2f8c0-8a3a-4c6b-9e3d-6e0f0c50b7a7')
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should called validate method', () => {
    const uuid = new Uuid()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})