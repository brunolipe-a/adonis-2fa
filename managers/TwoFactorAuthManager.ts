import * as twoFactor from 'node-2fa'

import { TwoFactorAuthConfig } from '@ioc:Adonis/Addons/TwoFactorAuth'
import { string } from '@ioc:Adonis/Core/Helpers'

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

  public verifyToken(secret: string = '', token: string, recoveryCodes: string[] = []) {
    const verifyResult = twoFactor.verifyToken(secret, token)

    if (!verifyResult) {
      const isSecretInRecoveryCodes = recoveryCodes.includes(token)

      return isSecretInRecoveryCodes
    }

    return verifyResult.delta === 0 // Valida token atual, não permitindo token já expirado ou token futuro
  }
}
