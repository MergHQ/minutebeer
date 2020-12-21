import Bacon from 'baconjs'
import {InitialState} from '../types/InitialState'
import {actionStream, sendAction} from '../utils/actionDispatcher'
import {drinkAction, openDrinkAlertModalAction, closeDrinkAlertModalAction} from '../utils/actions'

const config = require('../configs/clientConfig.json')

interface SocketPayload {
  eventType: 0 | 1,
  data: any
}

export function drinkTimerStore(initialState: InitialState) {
  if (typeof window !== 'undefined') createSocket()
  const drinkTimerS = actionStream(drinkAction)
  const openDrinkAlertModalS = actionStream(openDrinkAlertModalAction)
  const closeDrinkAlertModalS = actionStream(closeDrinkAlertModalAction)

  return Bacon.update(initialState.competitionState,
    [drinkTimerS], (iv, nv) => {
      sendAction(openDrinkAlertModalAction, null)
      setTimeout(() => sendAction(closeDrinkAlertModalAction, null), 10000)
      return {...iv, stage: nv}
    },
    [openDrinkAlertModalS], (iv, nv) => ({...iv, isModalOpen: true}),
    [closeDrinkAlertModalS], (iv, nv) => ({...iv, isModalOpen: false})
  )
}

function createSocket() {
  const ws = new WebSocket(config.socketURI)
  
  ws.onopen = () => console.log('Socket open')
  ws.onmessage = message => handleWebSocketEvent(JSON.parse(message.data))
}

function handleWebSocketEvent(payload: SocketPayload) {
  const event = payload.eventType
  console.log(event)
  switch (event) {
    case 1:
      const {stage} = payload.data
      sendAction(drinkAction, stage)
    break;
  }
}
