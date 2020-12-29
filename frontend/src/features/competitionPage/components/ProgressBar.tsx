import React from 'react'
import { Progress } from 'reactstrap'
import { UserGame } from '../../../types/Game'

interface Props {
  drinks: string[]
  game: UserGame
}

export default class ProgressBar extends React.Component<Props, any> {
  render() {
    const { drinks, game } = this.props
    return (
      <Progress
        value={(drinks.length / ((game.maxMinutes / 3) * game.userGameState.tier)) * 100}
      />
    )
  }
}
