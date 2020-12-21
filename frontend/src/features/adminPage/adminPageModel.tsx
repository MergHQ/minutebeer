import React from 'react'
import {sendAction} from '../../utils/actionDispatcher'
import {fetchMoreParticipantsAction} from '../../utils/actions'
import StatCard from './components/StatCard'

interface Props {
  currentDrink: number,
  adminStats: {
    participants: string[],
    drinks: number,
    nonHolic: number,
    holic: number
  }
}

export default class AdminPage extends React.Component<Props, any> {
  render() {
    const {currentDrink, adminStats} = this.props
    console.log(adminStats)
    return (
      <div>
        <h1>{`Current drink: ${currentDrink}`}</h1>
        <br />
        <br />
        <br />
        <StatCard 
          participants={adminStats.participants} 
          totalDrinks={adminStats.drinks} 
          holic={adminStats.holic} 
          nonHolic={adminStats.nonHolic} 
        />
      </div>
    )
  }

  componentDidMount() {
    setInterval(() => sendAction(fetchMoreParticipantsAction, 0), 2000)
  }
}