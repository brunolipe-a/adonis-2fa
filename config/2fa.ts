import Env from '@ioc:Adonis/Core/Env'
import { TwoFactorAuthConfig } from '@ioc:Adonis/Addons/TwoFactorAuth'

const twoFactorAuthConfig: TwoFactorAuthConfig = {
  issuer: Env.get('APP_ISSUER', 'Adonis'),
}

export default twoFactorAuthConfig
