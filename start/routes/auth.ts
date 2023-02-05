import Route from '@ioc:Adonis/Core/Route'

Route.post('login', 'LoginController.handle')

Route.group(() => {
  Route.post('generate', 'TwoFactorController.generate')
  Route.post('verify', 'TwoFactorController.verify')
  Route.post('disable', 'TwoFactorController.disable')
})
  .prefix('2fa')
  .middleware('auth')
