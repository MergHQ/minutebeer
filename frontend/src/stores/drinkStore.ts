import { InitialState } from '../types/InitialState'
import { actionStream, sendAction } from '../utils/actionDispatcher'
import {
  addDrinkAction,
  closeDrinkAlertModalAction,
  setCurrentGameAction,
} from '../utils/actions'
import Bacon from 'baconjs'
import { DrinkType, UserDrink } from '../types/UserDrink'
import axios from 'axios'

const config = require('../configs/clientConfig.json')

export function drinkStore(_: InitialState) {
  const addDrinkS = actionStream(addDrinkAction)
  const gameChosenS = actionStream(setCurrentGameAction)

  const userDrinksRequest = gameChosenS.map(({ id }) => id).flatMapLatest(getUserDrinks)

  const drinkRequestS = addDrinkS
    .debounce(300)
    .flatMapLatest(({ drinkType, gameId }) => addDrink(drinkType, gameId))
    .doAction(() => sendAction(closeDrinkAlertModalAction, null))

  return Bacon.update(
    [],
    [drinkRequestS],
    (iv, nv) => [...iv, nv],
    [userDrinksRequest],
    (_, drinks) => drinks
  )
}

function addDrink(drinkType: DrinkType, gameId: string): Bacon.EventStream<any, string> {
  const requestPromise = axios
    .post<UserDrink>(
      `${config.apiEntrypoint}/api/games/${gameId}/drinks`,
      { drinkType },
      { headers: { authorization: document.cookie.split('token=')[1].split(';')[0] } }
    )
    .then(({ data }) => data)
    .then(({ id }) => id)

  return Bacon.fromPromise(requestPromise)
}

const getUserDrinks = (gameId: string): Bacon.EventStream<any, string[]> =>
  Bacon.fromPromise(
    axios
      .get<UserDrink[]>(`${config.apiEntrypoint}/api/games/${gameId}/drinks`, {
        headers: { authorization: document.cookie.split('token=')[1].split(';')[0] },
      })
      .then(({ data }) => data.map(d => d.id))
  )
