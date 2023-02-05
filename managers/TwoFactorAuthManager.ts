import * as twoFactor from 'node-2fa'

import { TwoFactorAuthConfig } from '@ioc:Adonis/Addons/TwoFactorAuth'
import { string } from '@ioc:Adonis/Core/Helpers'

type VerifyTokenResult = {
  isValid: boolean
  usesRecoveryCode: boolean
}

export class TwoFactorAuthManager {
  constructor(private config: TwoFactorAuthConfig) {}

  public generateSecret(account: string) {
    return twoFactor.generateSecret({
      name: this.config.issuer,
      account,
    })
  }

  public generateRecoveryCodes() {
    return Array.from({ length: 16 }, () => string.generateRandom(10).toUpperCase())
  }

  public verifyToken(
    secret: string = '',
    token: string,
    recoveryCodes: string[] = []
  ): VerifyTokenResult {
    const verifyResult = twoFactor.verifyToken(secret, token)

    if (!verifyResult) {
      const isTokenInRecoveryCodes = recoveryCodes.includes(token)

      return { isValid: isTokenInRecoveryCodes, usesRecoveryCode: isTokenInRecoveryCodes }
    }

    return { isValid: verifyResult.delta === 0, usesRecoveryCode: false } // Valida token atual, não permitindo token já expirado ou token futuro
  }
}
