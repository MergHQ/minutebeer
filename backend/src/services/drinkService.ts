import db from '../database'
import uuid from 'uuid'
import { taskEither as F } from '../fptsExtensions'
import { pipe } from 'fp-ts/lib/function'
import { getUserWithToken } from './userService'
import { getGame, isParticipant } from './gameService'

export enum DrinkType {
  ALCOHOL = 0,
  NON_ALCOHOL = 1,
}

export type UserDrink = {
  id?: string
  drinkType: DrinkType
  userId: string
  gameId: string
}

const insertDrink = (userId: string, gameId: string, drinkType: DrinkType) => {
  const id = uuid()

  return F.tryCatch(
    () =>
      db('user_drinks')
        .insert({
          id,
          drinkType,
          userId,
          gameId,
        })
        .then(() => ({
          id,
          drinkType,
          userId,
          gameId,
        })),
    () => ({
      message: 'Could not insert drink',
      status: 500,
      pureErrorMessage: 'Could not insert drink',
    })
  )
}

const checkDrinkAmount = (gameId: string, userId: string) => {
  const drinkCount = F.tryCatch(
    () =>
      db
        .raw('select count(*) from user_drinks where "userId" = ? and "gameId" = ?', [
          userId,
          gameId,
        ])
        .then(v => Number(v.rows[0].count) as any),
    () => ({
      message: 'Could not count user drinks',
      status: 500,
      pureErrorMessage: 'Could not count user drinks',
    })
  )

  const game = pipe(
    getGame(gameId),
    F.flatMap(
      F.fromOption(() => ({
        message: 'Could not find game',
        status: 400,
        pureErrorMessage: 'Could not find game',
      }))
    )
  )

  return pipe(
    F.sequenceArray([drinkCount, game]),
    F.flatMap(([drinkCount, game]) => {
      if (drinkCount + 1 > game.currentMinutes) {
        return F.left({
          message: 'Illegal drink request',
          status: 403,
          pureErrorMessage: 'Illegal drink request',
        })
      }

      return F.of(true)
    })
  )
}

export const createDrink = (token: string, gameId: string, drinkType: DrinkType) =>
  pipe(
    getUserWithToken(token),
    F.flatMap(
      F.fromOption(() => ({
        message: 'Cannot find user',
        status: 400,
        pureErrorMessage: 'Cannot find user',
      }))
    ),
    F.flatMap(({ id }) =>
      F.sequenceArray([
        isParticipant(id, gameId),
        F.of(id as any),
        checkDrinkAmount(gameId, id),
      ])
    ),
    F.flatMap(([participant, userId]) => {
      if (participant) return insertDrink(userId, gameId, drinkType)
      return F.left({
        message: 'User not in game',
        status: 403,
        pureErrorMessage: 'User not in game',
      })
    })
  )

export const getUserDrinks = (userId: string) =>
  F.tryCatch(
    () =>
      db('user_drinks')
        .where('userId', userId)
        .then(res => res as UserDrink[]),
    (e: Error) => ({
      message: 'Cannot get user drinks',
      status: 500,
      pureErrorMessage: e.message,
    })
  )

export const getUserDrinksForGame = (userId: string, gameId: string) =>
  F.tryCatch(
    () =>
      db('user_drinks')
        .where('userId', userId)
        .andWhere('gameId', gameId)
        .then(res => res as UserDrink[]),
    (e: Error) => ({
      message: 'Cannot get user drinks',
      status: 500,
      pureErrorMessage: e.message,
    })
  )

export const getUserDrinksWithToken = (token: string, gameId: string) =>
  pipe(
    getUserWithToken(token),
    F.flatMap(
      F.fromOption(() => ({
        message: 'Cannot find user',
        status: 400,
        pureErrorMessage: 'Cannot find user',
      }))
    ),
    F.flatMap(({ id }) => getUserDrinksForGame(id, gameId))
  )
