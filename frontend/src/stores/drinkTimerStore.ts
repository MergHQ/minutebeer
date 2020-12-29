import Bacon from 'baconjs'
import { InitialState } from '../types/InitialState'
import { actionStream } from '../utils/actionDispatcher'
import { openDrinkAlertModalAction, closeDrinkAlertModalAction } from '../utils/actions'

export function drinkTimerStore(initialState: InitialState) {
  const openDrinkAlertModalS = actionStream(openDrinkAlertModalAction)
  const closeDrinkAlertModalS = actionStream(closeDrinkAlertModalAction)

  return Bacon.update(
    { stage: 0 },
    /*[drinkTimerS],
    (iv, nv) => {
      if (iv.stage === nv) return iv
      sendAction(openDrinkAlertModalAction, null)
      setTimeout(() => sendAction(closeDrinkAlertModalAction, null), 10000)
      return { ...iv, stage: nv }
    },*/
    [openDrinkAlertModalS],
    (iv, nv) => ({ ...iv, isModalOpen: true }),
    [closeDrinkAlertModalS],
    (iv, nv) => ({ ...iv, isModalOpen: false })
  )
}
