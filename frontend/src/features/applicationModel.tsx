import React from 'react'
import Bacon from 'baconjs'

import Signup from './signupPage/signupModel'
import { userRegistrationStore } from '../stores/userRegistrationStore'
import { InitialState } from '../types/InitialState'
import { pageStateStore } from '../stores/pageStateStore'
import { User } from '../types/User'
//import CompetitionPage from './competitionPage/competitionModel'
import { drinkStore } from '../stores/drinkStore'
import { drinkTimerStore } from '../stores/drinkTimerStore'
import { competitionAdminStore } from '../stores/competitionAdminStore'
import AdminPage from './adminPage/adminPageModel'
import { UserGame } from '../types/Game'
import GameListing from './signupPage/components/gameListing'

export function createModel(initialState: InitialState) {
  const drinkTimerP = drinkTimerStore(initialState)

  // TODO: Hadle routung and stores better
  if (initialState.currentPage === '/admin') {
    const adminStatsStoreP = competitionAdminStore(initialState)
    return Bacon.combineTemplate({
      drinkTimer: drinkTimerP,
      adminStats: adminStatsStoreP
    }).map(({ drinkTimer, adminStats }) => (
      <div className="container">
        <AdminPage currentDrink={drinkTimer.stage} adminStats={adminStats} />
      </div>
    ))
  }

  const userP = userRegistrationStore(initialState)
  const pageStateP = pageStateStore(initialState)
  const drinkStoreP = drinkStore(initialState)
  const appP = Bacon.combineTemplate({
    pageState: pageStateP,
    user: userP,
    drinks: drinkStoreP,
    drinkTimer: drinkTimerP
  }).map(({ pageState, user, drinks, drinkTimer }) => {
    const currentPage = handlePage(pageState, user, drinks, drinkTimer, initialState.games)
    return (
      <div className="container">
        {currentPage}
      </div>
    )
  })

  return appP
}

function handlePage(currentPage: string, user: User, drinks: string[], { stage, isModalOpen }: { stage: number, isModalOpen: boolean }, games: UserGame[]) {
  if (!user) {
    return <Signup />
  } else {
    return <GameListing games={games} />
    // return <CompetitionPage user={user} drinks={drinks} currentDrink={stage} isModalOpen={isModalOpen} />
  }
}