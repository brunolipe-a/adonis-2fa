import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import { TwoFactorAuth } from '@ioc:Adonis/Addons/TwoFactorAuth'

export default class LoginController {
  public async handle({ request, auth, response }: HttpContextContract) {
    const { email, password, otp } = await request.validate(LoginValidator)

    const user = await User.query().where('email', email).firstOrFail()

    const isPasswordValid = await Hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.unauthorized({ message: 'Credenciais inválidas' })
    }

    if (!user.isTwoFactorEnabled) {
      const { token } = await auth.use('api').generate(user)

      return { token, user }
    }

    if (!otp) {
      return response.badRequest({
        message: 'Esse usuário tem autenticação de dois fatores ativada',
        code: '2FA_EXPECTED',
      })
    }

    const isOTPValid = TwoFactorAuth.verifyToken(
      user.twoFactorSecret?.secret,
      otp,
      user.twoFactorRecoveryCodes
    )

    if (!isOTPValid) {
      return response.unauthorized({ message: 'Credenciais inválidas' })
    }

    const { token } = await auth.use('api').generate(user)

    return { token, user }
  }
}
