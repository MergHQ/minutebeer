import * as TaskEither from 'fp-ts/TaskEither'
import * as Option from 'fp-ts/Option'

export const taskEither = {
  ...TaskEither,
  flatMap: TaskEither.chain,
}
export const option = { ...Option, flatMap: Option.chain }
