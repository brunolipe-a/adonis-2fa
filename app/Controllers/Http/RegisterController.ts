import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class RegisterController {
  public async handle({ request }: HttpContextContract) {
    const { name, email, password } = await request.validate(RegisterUserValidator)

    const user = await User.create({ name, email, password })

    return user
  }
}
