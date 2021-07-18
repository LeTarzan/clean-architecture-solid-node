import {
  EmailValidation,
  CompareFieldsValidation,
  RequireFieldValidation,
  ValidationComposite 
} from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { makeSignUpValidation } from './signup-validation-factory'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

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