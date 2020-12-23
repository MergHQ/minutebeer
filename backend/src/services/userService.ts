import db from '../database'
import uuid from 'uuid'
import { UserDrink } from './drinkService'
import jwt from 'jsonwebtoken'
import { taskEither as F, option as O } from '../fptsExtensions'
import { pipe } from 'fp-ts/lib/function'
import { getUserInfo, TkoAlyUser } from '../client/userServiceClient'
import { ServiceError } from '../error'
import { AxiosError } from 'axios'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'

export interface User {
  id?: string
  nickname: string
  tier: 0 | 1 | 2
  tkoAlyUserId: number
  email: string
  role: string
}

export interface UserDrinksObject extends User {
  drinks: UserDrink[]
}

export const createUser = (user: any, token: string): TaskEither<ServiceError, User> =>
  pipe(
    F.tryCatch(
      () => getUserInfo(token),
      (e: AxiosError) =>
        ({
          message: 'Cannot fetch TKO-äly user',
          status: e.response ? e.response.status : 500,
          pureErrorMessage: e.message,
        } as ServiceError)
    ),
    F.flatMap(tekisUser => validateUser(user, tekisUser)),
    F.flatMap(insertUser)
  )

const insertUser = (user: User) =>
  F.tryCatch(
    () =>
      db('users')
        .insert(user)
        .then(() => user),
    (e: Error) => ({
      message: 'Failed to save user',
      pureErrorMessage: e.message,
      status: 500,
    })
  )

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

export const getUserById = (token: string): TaskEither<ServiceError, Option<User>> =>
  pipe(
    F.tryCatch(
      () => getUserInfo(token),
      (e: AxiosError) => ({
        message: 'Failed to resolve user',
        status: e.response.status,
        pureErrorMessage: e.message,
      })
    ),
    F.flatMap(({ id }) => getById(id))
  )

const getById = (tkoAlyId: number) =>
  F.tryCatch(
    () =>
      db('users')
        .where('tkoAlyUserId', tkoAlyId)
        .first()
        .then((user: User | null) => user)
        .then(O.fromNullable),
    (e: Error) => ({
      message: 'Failed to get user',
      status: 500,
      pureErrorMessage: e.message,
    })
  )

function validateUser(
  user: any,
  { id, email, role }: TkoAlyUser
): TaskEither<ServiceError, User> {
  const { nickname, tier } = user
  if (!nickname || !tier) {
    return F.left({
      pureErrorMessage: 'Missing post data',
      status: 400,
      message: 'Missing post data',
    })
  }

  if (!nickname.length) {
    return F.left({
      pureErrorMessage: 'Missing post data',
      status: 400,
      message: 'Missing post data',
    })
  }

  return F.of({
    id: uuid.v4(),
    nickname,
    tier,
    tkoAlyUserId: id,
    email,
    role,
  })
}

function toUserDrinksObject(dbResult: any[]): UserDrinksObject[] {
  //const map = new Map<String, UserDrinksObject>()
  return []
  /* dbResult.forEach(object => {
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

  return Array.from(map.values())*/
}

export function createUserToken(user: User) {
  const token = jwt.sign({ id: `${user.tkoAlyUserId}` }, process.env.JWT_SECRET)
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
