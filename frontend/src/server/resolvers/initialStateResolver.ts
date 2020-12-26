import * as request from 'request-promise'
import { User } from '../../types/User'
import { InitialState } from '../../types/InitialState'
/*import {
  toNickNameArray,
  userDrinksObjectToDrinkCount,
} from '../../stores/competitionAdminStore'*/
import { UserGame } from '../../types/Game'

const config = require('../../configs/clientConfig.json')

const ENTRYPOINT = config.apiEntrypoint + '/api'

export function resolveInitialState(token: string, path: string): Promise<InitialState> {
  const auth = resolveAuthentication(token)
  //const userDrinks = resolveUserDrinks(token)
  const games = fetchGames(token)
  //const adminStats = path === '/admin' ? resolveParticipants() : null
  return Promise.all([auth, games])
    .then(([user, games]) => ({
      authentication: user,
      currentPage: path,
      games,
      /*competitionState: {
        userDrinks,
        stage: gameStage,
        adminStats,
      },*/
    }))
    .then(is => is as InitialState)
}

function resolveAuthentication(token: string) {
  return request
    .get(`${ENTRYPOINT}/users/me`, { headers: { Authorization: token } })
    .then(JSON.parse)
    .then((user: User) => user)
    .catch(e => {
      console.error(e)
      return null
    })
}
/*
function resolveUserDrinks(token: string) {
  return request
    .get(`${ENTRYPOINT}/users/me/drinks`, { headers: { Authorization: token } })
    .then(JSON.parse)
    .then((drinks: { drinkType: number }[]) => drinks)
    .catch(e => {
      console.error(e)
      return null
    })
}
*/
function fetchGames(token: string) {
  return request
    .get(`${ENTRYPOINT}/games`, { headers: { Authorization: token } })
    .then(JSON.parse)
    .then((games: UserGame[]) => games)
    .catch(e => {
      console.error(e)
      return []
    })
}
/*
function resolveParticipants() {
  return request
    .get(`${ENTRYPOINT}/participants`)
    .then(JSON.parse)
    .then((data: UserDrinksObject[]) => ({
      participants: toNickNameArray(data),
      ...userDrinksObjectToDrinkCount(data),
    }))
    .catch(e => {
      console.error(e)
      return null
    })
}
*/
