import { InitialState } from '../types/InitialState'
import { actionStream, sendAction } from '../utils/actionDispatcher'
import { addDrinkAction, closeDrinkAlertModalAction } from '../utils/actions'
import Bacon from 'baconjs'
import { DrinkType } from '../types/UserDrink'
import axios from 'axios'

const config = require('../configs/clientConfig.json')

export function drinkStore(initialState: InitialState) {
  const addDrinkS = actionStream(addDrinkAction)

  const drinkRequestS = addDrinkS
    .debounce(300)
    .flatMapLatest(addDrink)
    .doAction(() => sendAction(closeDrinkAlertModalAction, null))

  return Bacon.update(
    initialState.competitionState.userDrinks,
    [drinkRequestS],
    (iv, nv) => [...iv, nv]
  )
}

function addDrink(drinkType: DrinkType) {
  const requestPromise = axios
    .post(
      config.apiEntrypoint + '/api/drinks',
      { drinkType },
      { headers: { authorization: document.cookie.split('token=')[1].split(';')[0] } }
    )
    .then(({ data }) => JSON.parse(data))
    .then((drink: { id: string }) => drink.id)
    .catch(e => console.error)

  return Bacon.fromPromise(requestPromise)
}
