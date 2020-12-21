import db from '../database'
import uuid from 'uuid'
import { UserDrink } from './drinkService'
import jwt from 'jsonwebtoken'

export interface User {
  id?: string
  nickname: string
  tier: 0 | 1 | 2
}

export interface UserDrinksObject extends User {
  drinks: UserDrink[]
}

export function createUser(user: any): Promise<User> {
  const validatedUser = validateUser(user)
  return db('users')
    .insert(validatedUser)
    .returning(['id', 'nickname', 'tier'])
    .then(() => validatedUser)
}

export function getAllUsers(): Promise<UserDrinksObject[]> {
  return db('users')
    .select([
      'users.id',
      'users.nickname',
      'users.tier',
      'user_drinks.drinkType',
      'user_drinks.userId',
    ])
    .leftJoin('user_drinks', 'users.id', '=', 'user_drinks.userId')
    .then(toUserDrinksObject)
}

export function getUserById(userId: string): Promise<User> {
  return db('users')
    .where('id', userId)
    .first()
    .then((user: User) => user)
}

function validateUser(user: any): User {
  const { nickname, tier } = user
  if (!nickname || !tier) {
    return null
  }

  if (!nickname.length) {
    return null
  }

  return {
    id: uuid.v4(),
    nickname,
    tier,
  }
}

function toUserDrinksObject(dbResult: any[]): UserDrinksObject[] {
  const map = new Map<String, UserDrinksObject>()
  dbResult.forEach(object => {
    const { id, nickname, tier, drinkType, userId } = object
    if (map.has(id)) {
      if (drinkType !== null) {
        map.get(id).drinks.push({ drinkType, userId })
      }
    } else {
      map.set(id, {
        id,
        nickname,
        tier,
        drinks: drinkType === null ? [] : [{ drinkType, userId }],
      })
    }
  })

  return Array.from(map.values())
}

export function createUserToken(user: User) {
  const token = jwt.sign(user.id, process.env.JWT_SECRET)
  return { ...user, token }
}

export function parseUserToken(token: string): any {
  try {
    const parsedToken: { id: string } = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string
    }
    return parsedToken
  } catch (e) {
    console.error(e)
    return null
  }
}
