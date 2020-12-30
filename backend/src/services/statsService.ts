import { pipe } from 'fp-ts/lib/function'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import db from '../database'
import { ServiceError } from '../error'
import { taskEither as F } from '../fptsExtensions'
import { DrinkType, UserDrink } from './drinkService'
import { getGame } from './gameService'

type AdminStats = {
  participants: string[]
  drinks: number
  nonHolic: number
  holic: number
}

export const getStats = (gameId: string): TaskEither<ServiceError, AdminStats> => {
  const nicknames = F.tryCatch(
    () =>
      db
        .raw(
          'select users.nickname from participation inner join users on (participation."userId" = users.id) where "gameId" = ?',
          [gameId]
        )
        .then(r => r.rows.map(({ nickname }: any) => nickname) as any[]),
    e => ({
      message: 'Cannot list participants',
      status: 500,
      pureErrorMessage: 'Cannot list participants',
    })
  )

  const drinks = F.tryCatch(
    () =>
      db
        .raw('select * from user_drinks where "gameId" = ?', [gameId])
        .then(r => r.rows as UserDrink[]),
    e => ({
      message: 'Cannot list drinks',
      status: 500,
      pureErrorMessage: 'Cannot list drinks',
    })
  )

  return pipe(
    getGame(gameId),
    F.flatMap(
      F.fromOption(() => ({
        message: 'Could not get game',
        status: 404,
        pureErrorMessage: 'Could not get game',
      }))
    ),
    F.flatMap(() => F.sequenceArray([nicknames, drinks])),
    F.map(([nicknames, drinks]) => ({
      participants: nicknames,
      drinks: drinks.length,
      nonHolic: drinks.filter(d => d.drinkType === DrinkType.NON_ALCOHOL).length,
      holic: drinks.filter(d => d.drinkType === DrinkType.ALCOHOL).length,
    }))
  )
}
