import Bacon from 'baconjs'
import { actionStream } from '../utils/actionDispatcher'
import { changePageAction } from '../utils/actions'
import { InitialState } from '../types/InitialState'

export function pageStateStore(initialState: InitialState) {
  const changePageS = actionStream(changePageAction)

  return Bacon.update(
    initialState.currentPage,
    [changePageS],
    (inital: InitialState, newPage: any) => newPage
  )
}
