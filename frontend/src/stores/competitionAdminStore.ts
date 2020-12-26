import { InitialState } from '../types/InitialState'
import { fetchMoreParticipantsAction } from '../utils/actions'
import { actionStream } from '../utils/actionDispatcher'
import Axios from 'axios'
import { UserDrinksObject } from '../types/User'
import { UserDrink, DrinkType } from '../types/UserDrink'
import Bacon from 'baconjs'

const config = require('../configs/clientConfig.json')

export function competitionAdminStore(initialState: InitialState) {
  const fetchMoreParticipantsS = actionStream(fetchMoreParticipantsAction)

  const participantsRequestS = fetchMoreParticipantsS.flatMapLatest(fetchParticipants)

  return Bacon.update({}, [participantsRequestS], (iv, nv) => nv || {})
}

function fetchParticipants() {
  const promise = Axios.get(config.apiEntrypoint + '/api/participants?d=' + Date.now())
    .then(req => req.data)
    .then(data => data as UserDrinksObject[])
    .then(nv => ({
      participants: toNickNameArray(nv),
      ...userDrinksObjectToDrinkCount(nv),
    }))
    .catch(console.error)

  return Bacon.fromPromise(promise)
}

export function toNickNameArray(data: UserDrinksObject[]) {
  return data.map(v => v.nickname)
}

export function userDrinksObjectToDrinkCount(
  data: UserDrinksObject[]
): { drinks: number; nonHolic: number; holic: number } {
  const calcDrinkTypes = (dr: UserDrink[], dt: DrinkType) => {
    let c = 0
    dr.forEach(d => (d.drinkType === dt ? c++ : 0))
    return c
  }

  const drinks = data.map(v => v.drinks.length)
  const holic = data.map(v => calcDrinkTypes(v.drinks, DrinkType.ALCOHOL))
  const nonHolic = data.map(v => calcDrinkTypes(v.drinks, DrinkType.NON_ALCOHOL))
  return {
    drinks: drinks.reduce((p, n) => p + n),
    holic: holic.reduce((p, n) => p + n),
    nonHolic: nonHolic.reduce((p, n) => p + n),
  }
}
