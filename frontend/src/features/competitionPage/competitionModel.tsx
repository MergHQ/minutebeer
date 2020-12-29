import React from 'react'
import Header from './components/Header'
import { User } from '../../types/User'
import ProgressBar from './components/ProgressBar'
import DrinkAlertModal from './components/DrinkAlertModal'
import PersonalStats from './components/PersonalStats'
import CatchUpCard from './components/CatchUpCard'
import { UserGame } from '../../types/Game'

interface Props {
  user: User
  drinks: string[]
  currentDrink: number
  isModalOpen: boolean
  game: UserGame
}

export default class CompetitionPage extends React.Component<Props, any> {
  render() {
    const { user, drinks, currentDrink, isModalOpen, game } = this.props
    return (
      <div>
        <Header user={user} tier={game.userGameState.tier} />
        <ProgressBar game={game} drinks={drinks} />
        <DrinkAlertModal
          drinkNumber={currentDrink}
          isModalOpen={isModalOpen}
          gameId={game.id}
        />
        <br />
        <PersonalStats
          drinks={drinks}
          user={user}
          currentDrink={currentDrink}
          game={game}
        />
        <br />
        {drinks.length < currentDrink && !isModalOpen && <CatchUpCard gameId={game.id} />}
      </div>
    )
  }
}
