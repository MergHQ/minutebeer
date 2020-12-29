import * as B from 'baconjs'
import axios from 'axios'
import { InitialState } from '../types/InitialState'
import { actionStream, sendAction } from '../utils/actionDispatcher'
import {
  closeDrinkAlertModalAction,
  gameStateUpdateAction,
  openDrinkAlertModalAction,
  openTierSelectionAction,
  setCurrentGameAction,
} from '../utils/actions'
import { UserGame } from '../types/Game'

const config = require('../configs/clientConfig.json')

export default (initialState: InitialState) => {
  const gamesP = B.constant(initialState.games)
  const chosenGameS = actionStream(setCurrentGameAction)
  const gameStateUpdateActionS = actionStream(gameStateUpdateAction)
  const openTierSelectionS = actionStream(openTierSelectionAction)
  const timerIdP = B.update(null, [chosenGameS], (initial, newValue) => {
    initial && clearInterval(initial)
    return startPolling(newValue.id)
  })
  const gameStateUpdateActionP = B.update(
    null,
    [gameStateUpdateActionS],
    (initialValue, newValue) => {
      if (!initialValue) return newValue
      initialValue < newValue && triggerDrinkModals()
      return newValue
    }
  )

  const chosenGameP = gamesP
    .sampledBy(chosenGameS, (v, s) => ({ choseGamePararms: s, games: v }))
    .flatMap(({ choseGamePararms, games }) =>
      participate(games, choseGamePararms.id, choseGamePararms.tier)
    )
    .toProperty(null)

  return B.combineTemplate({
    games: gamesP,
    chosenGame: chosenGameP,
    currentGameMinute: gameStateUpdateActionP,
    timerId: timerIdP,
    tierSelectionGame: openTierSelectionS.toProperty(null),
  })
}

const startPolling = (id: string) =>
  setInterval(() => {
    axios
      .get(config.apiEntrypoint + '/api/games/' + id, {
        headers: { authorization: document.cookie.split('token=')[1].split(';')[0] },
      })
      .then(v => sendAction(gameStateUpdateAction, v.data.currentMinutes))
  }, 500)

const triggerDrinkModals = () => {
  sendAction(openDrinkAlertModalAction, null)
  setTimeout(() => sendAction(closeDrinkAlertModalAction, null), 10000)
}

const participate = (games: UserGame[], gameId: string, tier: number) => {
  const game = games.find(({ id }) => id === gameId)
  if (game.userGameState) {
    return B.constant(game).toEventStream()
  }
  const request = axios
    .post(
      `${config.apiEntrypoint}/api/games/${gameId}/participate`,
      { tier },
      {
        headers: { authorization: document.cookie.split('token=')[1].split(';')[0] },
      }
    )
    .then(() => ({
      ...game,
      userGameState: {
        tier,
        current: 0,
      },
    }))

  return B.fromPromise(request)
}
