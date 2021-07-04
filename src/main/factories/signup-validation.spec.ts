import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-field-validation'
import { RequireFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'
import { EmailValidator } from '@/presentation/protocols/email-validator'

jest.mock('../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUP Validation', () => {
  test('Should call ValidationComposite with all validations', async () => {
    makeSignUpValidation()
  
    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequireFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})