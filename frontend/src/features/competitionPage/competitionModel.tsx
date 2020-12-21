import React from 'react'
import Header from './components/Header'
import {User} from '../../types/User'
import ProgressBar from './components/ProgressBar'
import DrinkAlertModal from './components/DrinkAlertModal'
import PersonalStats from './components/PersonalStats'
import CatchUpCard from './components/CatchUpCard'

interface Props {
  user: User
  drinks: string[]
  currentDrink: number,
  isModalOpen: boolean
}

export default class CompetitionPage extends React.Component<Props, any> {
  render() {
    const {user, drinks, currentDrink, isModalOpen} = this.props
    return (
      <div>
        <Header user={user} />
        <ProgressBar user={user} drinks={drinks} />
        <DrinkAlertModal drinkNumber={currentDrink} isModalOpen={isModalOpen} />
        <br />
        <PersonalStats drinks={drinks} user={user} currentDrink={currentDrink} />
        <br />
        {(drinks.length < currentDrink && !isModalOpen) && <CatchUpCard />}
      </div>
    )
  }
}