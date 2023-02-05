import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyOtpValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    otp: schema.string(),
  })

  public messages: CustomMessages = {}
}
