import { pipe } from 'fp-ts/lib/function'
import { Option } from 'fp-ts/lib/Option'
import { head } from 'fp-ts/lib/ReadonlyArray'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import uuid from 'uuid/v4'
import db from '../database'
import { ServiceError } from '../error'
import { taskEither as F, option as O } from '../fptsExtensions'
import memoize from '../utils/memoize'
import { getUserDrinks, UserDrink } from './drinkService'
import { getUserWithToken } from './userService'

export enum GameState {
  NOT_STARTED,
  STARTED,
  FINISHED,
}

export type Game = {
  id: string
  maxMinutes: number
  currentMinutes: number
  state: GameState
}

export type UserGame = Game & {
  userGameState: {
    tier: number
    current: number
  }
}

const sleep = (timeMs: number): Promise<void> =>
  new Promise((resolve, _) => setTimeout(resolve, timeMs))

export const startGame = (gameId: string) =>
  pipe(
    getGame(gameId),
    F.map(
      O.map(async g => {
        await setGameState(gameId, GameState.STARTED)
        for (let m = 0; m < g.maxMinutes; m++) {
          await sleep(60000)
          await increaseMinutes(gameId, m + 1)
        }
        await setGameState(gameId, GameState.FINISHED)
      })
    ),
    F.mapLeft(e => console.error(e))
  )

const setGameState = (gameId: string, state: GameState) =>
  db.raw(`update games set state = ? where id = ?`, [state, gameId])

const increaseMinutes = (gameId: string, minute: number) =>
  db.raw('update games set current_minutes = ? where id = ?', [minute, gameId])

const getGameQuery = memoize(
  (gameId: string) => db.raw('select * from games where id = ? limit 1', [gameId]),
  1000
)

export const getGame = (gameId: string): TaskEither<ServiceError, Option<Game>> =>
  pipe(
    F.tryCatch(
      () => getGameQuery(gameId),
      (e: Error) => ({
        message: 'Failed to fetch games',
        status: 500,
        pureErrorMessage: e.message,
      })
    ),
    F.map(r => head<Game>(r.rows)),
    F.map(O.map(toGame))
  )

const toGame = ({ id, max_minutes, current_minutes, state }: any): Game => ({
  id: id,
  maxMinutes: max_minutes,
  currentMinutes: current_minutes,
  state,
})

const toUserGame = (drinks: UserDrink[]) => ({
  userId,
  tier,
  ...game
}: any): UserGame => ({
  ...toGame(game),
  userGameState: userId
    ? {
        tier,
        current: drinks.filter(d => d.gameId === game.id).length,
      }
    : null,
})

const getUserGames = (userId: string): TaskEither<ServiceError, any> =>
  F.tryCatch(
    () =>
      db.raw(
        `select * from games left join participation on (games.id = participation."gameId" and participation."userId" = ?) where state != 2`,
        [userId]
      ),
    (e: Error) => ({
      message: 'Failed to fetch games',
      status: 500,
      pureErrorMessage: e.message,
    })
  )

export const getGames = (token: string): TaskEither<ServiceError, UserGame[]> =>
  pipe(
    getUserWithToken(token),
    F.flatMap(
      F.fromOption(() => ({
        message: 'Failed to fetch user',
        status: 500,
        pureErrorMessage: 'Failed to fetch user',
      }))
    ),
    F.flatMap(({ id }) => F.sequenceArray([getUserGames(id), getUserDrinks(id)])),
    F.map(([gs, drinks]) => gs.rows.map(toUserGame(drinks))) // ughh
  )

const validateAndInsert = ({ maxMinutes }: any): Promise<Game> => {
  if (!maxMinutes || Number(maxMinutes) === NaN) {
    return Promise.reject({
      message: 'Invalid post data',
      status: 400,
      pureErrorMessage: 'Invalid post data',
    })
  }
  const id = uuid()
  return db('games')
    .insert({
      id,
      max_minutes: maxMinutes,
      current_minutes: 0,
      state: 0,
    })
    .catch((e: Error) => ({
      message: 'Failed to insert to DB',
      status: 500,
      pureErrorMessage: e.message,
    }))
    .then(() => ({
      id,
      maxMinutes,
      currentMinutes: 0,
      state: 0,
    }))
}

export const createGame = (body: any) =>
  F.tryCatch(
    () => validateAndInsert(body),
    (e: ServiceError) => e
  )

const createParticipation = (userId: string, gameId: string, tier: number) =>
  F.tryCatch(
    () => db('participation').insert({ userId, gameId, tier }),
    (e: Error) => ({
      message: 'Failed to insert to DB',
      status: 500,
      pureErrorMessage: e.message,
    })
  )

export const participate = (token: string, gameId: string, tier: number) =>
  pipe(
    getUserWithToken(token),
    F.flatMap(
      F.fromOption(() => ({
        message: 'Cannot find user',
        status: 400,
        pureErrorMessage: 'Cannot find user',
      }))
    ),
    F.flatMap(({ id }) => createParticipation(id, gameId, tier))
  )

export const isParticipant = (userId: string, gameId: string) =>
  F.tryCatch(
    () =>
      db
        .raw('select count(*) from participation where "userId" = ? and "gameId" = ?', [
          userId,
          gameId,
        ])
        .then(v => Number(v.rows[0].count) > 0),
    () => ({
      message: 'Cannot resolve participation',
      status: 500,
      pureErrorMessage: 'Cannot resolve participation',
    })
  )
