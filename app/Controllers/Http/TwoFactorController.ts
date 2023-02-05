import { TwoFactorAuth } from '@ioc:Adonis/Addons/TwoFactorAuth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyOtpValidator from 'App/Validators/VerifyOtpValidator'

export default class TwoFactorController {
  public async generate({ auth }: HttpContextContract) {
    const user = auth.user!

    user.twoFactorSecret = TwoFactorAuth.generateSecret(user.email)
    user.isTwoFactorEnabled = false

    await user.save()

    return user.twoFactorSecret
  }

  public async disable({ auth, response }: HttpContextContract) {
    await auth.user!.merge({ isTwoFactorEnabled: false }).save()

    return response.noContent()
  }

  public async verify({ auth, request, response }: HttpContextContract) {
    const { otp } = await request.validate(VerifyOtpValidator)

    const user = auth.user!

    if (user.isTwoFactorEnabled) {
      return response.badRequest({ message: 'Usuário já cadastrado com 2FA' })
    }

    const isValid = TwoFactorAuth.verifyToken(user.twoFactorSecret?.secret, otp)

    if (!isValid) {
      return response.badRequest({ message: 'OTP inválido' })
    }

    const recoveryCodes = TwoFactorAuth.generateRecoveryCodes()

    await user.merge({ isTwoFactorEnabled: true, twoFactorRecoveryCodes: recoveryCodes }).save()

    return { recovery_codes: recoveryCodes }
  }
}
