import { Action } from './actionDispatcher'
import { DrinkType } from '../types/UserDrink'
import { UserGame } from '../types/Game'

export const updateRegistrationDetailsAction: Action<any> = 'updateRegistrationDetails'
export const createUserAction: Action<any> = 'createUser'
export const changePageAction: Action<string> = 'changePage'
export const addDrinkAction: Action<{ drinkType: DrinkType; gameId: string }> = 'addDrink'
export const gameStateUpdateAction: Action<number> = 'drinkAction'
export const openDrinkAlertModalAction: Action<any> = 'openDrinkAlertModal'
export const closeDrinkAlertModalAction: Action<any> = 'closeDrinkAlertModal'
export const fetchMoreParticipantsAction: Action<string> = 'fetcMoreParticipants'
export const setCurrentGameAction: Action<{ id: string; tier: number }> = 'setCurrentGame'
export const openTierSelectionAction: Action<UserGame> = 'openTierSelection'
