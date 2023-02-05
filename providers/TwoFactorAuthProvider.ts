import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { TwoFactorAuthManager } from '../managers/TwoFactorAuthManager'

export default class TwoFactorAuthProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Adonis/Addons/TwoFactorAuth', () => {
      const config = this.app.container.resolveBinding('Adonis/Core/Config').get('2fa', {})

      return { TwoFactorAuth: new TwoFactorAuthManager(config) }
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
