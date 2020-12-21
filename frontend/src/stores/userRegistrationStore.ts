import Bacon from 'baconjs'
import {actionStream, sendAction} from '../utils/actionDispatcher'
import {updateRegistrationDetailsAction, createUserAction, changePageAction} from '../utils/actions'
import axios from 'axios'
import {InitialState} from '../types/InitialState'
import {User} from '../types/User'

const config = require('../configs/clientConfig.json')

export function userRegistrationStore(initialState: InitialState) {
  const updateUserDetailsS = actionStream(updateRegistrationDetailsAction)
  const createUserS = actionStream(createUserAction)
  const updateUserDetailsP = Bacon.update({nickname: '', tier: 0}, 
    [updateUserDetailsS], (initialValue, newValue) => ({...initialValue, ...newValue})
  )

  const createUseRequestS = updateUserDetailsP
    .sampledBy(createUserS)
    .flatMapLatest(createUser)
    
  return Bacon.update(initialState.authentication, 
      [createUseRequestS], (iv, user: User & {token: string}) => {
        sendAction(changePageAction, 'competition')
        return {...iv, user}
      }
    )
}

function createUser(userDetails: any) {
  const requestPromise = axios.post(config.apiEntrypoint + '/api/users', userDetails)
    .then(res => res.data)
    .then(JSON.parse)
    .then(user => user as {nickname: string, tier: number, token: string})
    .then(user => {
      addTokenToLocalStorage(user)
      return user
    })
    .catch(e => console.error(e))
    return Bacon.fromPromise(requestPromise)
}

function addTokenToLocalStorage({token}: {nickname: string, tier: number, token: string}) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  } 
}