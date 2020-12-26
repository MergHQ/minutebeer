import db from '../database'
import uuid from 'uuid'
import R from 'ramda'
import { taskEither as F } from '../fptsExtensions'

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

export function createDrink(drink: any) {
  const validatedDrink = validateDrink(drink)
  console.log(validatedDrink)
  return db('user_drinks').insert(validatedDrink).returning(['id']).then(R.identity)
}

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

function validateDrink(drink: any): UserDrink {
  const { drinkType, userId } = drink
  if (!userId.length) {
    return null
  }

  if (R.isNil(drinkType)) {
    return null
  }

  return {
    id: uuid.v4(),
    drinkType,
    userId,
    gameId: '',
  }
}
