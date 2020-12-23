import { pipe } from 'fp-ts/lib/function'
import { Option } from 'fp-ts/lib/Option'
import { head } from 'fp-ts/lib/ReadonlyArray'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import db from '../database'
import { ServiceError } from '../error'
import { taskEither as F, option as O } from '../fptsExtensions'
import memoize from '../utils/memoize'

export type Game = {
  id: string
  maxMinutes: number
  currentMinutes: number
}

const sleep = (timeMs: number): Promise<void> =>
  new Promise((resolve, reject) => setTimeout(resolve, timeMs))

export const startGame = (gameId: string) =>
  pipe(
    getGame(gameId),
    F.map(
      O.map(async g => {
        for (let m = 0; m < g.maxMinutes; m++) {
          await sleep(60000)
          await increaseMinutes(gameId, m + 1)
        }
      })
    ),
    F.mapLeft(e => console.error(e))
  )

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

const toGame = ({ id, max_minutes, current_minutes }: any): Game => ({
  id: id,
  maxMinutes: max_minutes,
  currentMinutes: current_minutes,
})

export const getGames = (): TaskEither<ServiceError, Game[]> =>
  pipe(
    F.tryCatch(
      () => db.raw('select * from games'),
      (e: Error) => ({
        message: 'Failed to fetch games',
        status: 500,
        pureErrorMessage: e.message,
      })
    ),
    F.map(gs => gs.rows.map(toGame)) // ughh
  )
