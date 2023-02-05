import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'

type TwoFactorSecret = {
  uri: string
  secret: string
  qr: string
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column({ consume: (value) => Boolean(value) })
  public isTwoFactorEnabled: boolean = false

  @column({
    serializeAs: null,
    consume: (value: string) => (value ? JSON.parse(Encryption.decrypt(value) ?? '{}') : null),
    prepare: (value: string) => Encryption.encrypt(JSON.stringify(value)),
  })
  public twoFactorSecret: TwoFactorSecret | null

  @column({
    serializeAs: null,
    consume: (value: string) => (value ? JSON.parse(Encryption.decrypt(value) ?? '[]') : []),
    prepare: (value: string[]) => Encryption.encrypt(JSON.stringify(value)),
  })
  public twoFactorRecoveryCodes: string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public removeRecoveryCode(code: string) {
    const index = this.twoFactorRecoveryCodes.indexOf(code)

    const isNotInTheList = index < 0

    if (isNotInTheList) {
      return this
    }

    this.twoFactorRecoveryCodes.splice(index, 1)

    return this
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
