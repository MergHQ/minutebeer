import db from '../database'
import uuid from 'uuid'
import R from 'ramda'

export enum DrinkType {
  ALCOHOL = 0,
  NON_ALCOHOL = 1,
}

export interface UserDrink {
  id?: string
  drinkType: DrinkType
  userId: string
}

export function createDrink(drink: any) {
  const validatedDrink = validateDrink(drink)
  console.log(validatedDrink)
  return db('user_drinks').insert(validatedDrink).returning(['id']).then(R.identity)
}

export function getUserDrinks(userId: string) {
  return db('user_drinks')
    .select(['drinkType'])
    .where('userId', userId)
    .then(res => res as number[])
}

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
  }
}
