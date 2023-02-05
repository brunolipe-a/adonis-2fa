declare module '@ioc:Adonis/Addons/TwoFactorAuth' {
  import { TwoFactorAuthManager } from 'managers/TwoFactorAuthManager'

  export const TwoFactorAuth: TwoFactorAuthManager

  export interface TwoFactorAuthConfig {
    issuer: string
  }
}
