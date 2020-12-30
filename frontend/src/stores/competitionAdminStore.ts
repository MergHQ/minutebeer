import { InitialState } from '../types/InitialState'
import { fetchMoreParticipantsAction } from '../utils/actions'
import { actionStream } from '../utils/actionDispatcher'
import Axios from 'axios'
import Bacon from 'baconjs'
import { AdminStats } from '../types/AdminStats'

const config = require('../configs/clientConfig.json')

export function competitionAdminStore(initialState: InitialState) {
  const fetchMoreParticipantsS = actionStream(fetchMoreParticipantsAction)

  const statRequestS = fetchMoreParticipantsS.flatMapLatest(fetchStats)

  return Bacon.update(initialState.adminStats, [statRequestS], (_, nv) => nv || {})
}

function fetchStats(gameId: string) {
  const promise = Axios.get(`${config.apiEntrypoint}/api/stats/${gameId}`, {
    headers: { authorization: document.cookie.split('token=')[1].split(';')[0] },
  })
    .then(req => req.data)
    .then(data => data as AdminStats)

  return Bacon.fromPromise(promise)
}
