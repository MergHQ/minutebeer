import * as request from 'request-promise'
import { User } from '../../types/User'
import { InitialState } from '../../types/InitialState'
/*import {
  toNickNameArray,
  userDrinksObjectToDrinkCount,
} from '../../stores/competitionAdminStore'*/
import { UserGame } from '../../types/Game'
import { AdminStats } from '../../types/AdminStats'

const config = require('../../configs/clientConfig.json')

const ENTRYPOINT = config.apiEntrypoint + '/api'

export function resolveInitialState(
  token: string,
  path: string,
  gameId: string | null
): Promise<InitialState> {
  const auth = resolveAuthentication(token)
  const games = fetchGames(token)
  const adminStatsP = path.startsWith('/admin') ? getAdminStats(token, gameId) : null
  return Promise.all([auth, games, adminStatsP])
    .then(([user, games, adminStats]) => ({
      authentication: user,
      currentPage: path,
      games,
      adminStats,
      gameId,
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

const getAdminStats = (token: string, gameId: string) =>
  request
    .get(`${ENTRYPOINT}/stats/${gameId}`, { headers: { Authorization: token } })
    .then(JSON.parse)
    .then(stats => stats as AdminStats)
