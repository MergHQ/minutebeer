import React from 'react'
import { User } from '../../../types/User'
import { Card, CardBody } from 'reactstrap'
import { UserGame } from '../../../types/Game'

interface Props {
  currentDrink: number
  user: User
  drinks: string[]
  game: UserGame
}

export default class PersonalStats extends React.Component<Props, any> {
  render() {
    const { currentDrink, drinks, game } = this.props
    const tier = game.userGameState.tier
    return (
      <div>
        <Card>
          <CardBody>
            <h4>{`Current drink: ${currentDrink}/${(game.maxMinutes / 3) * tier}`}</h4>
            <h4>{`I've drank ${drinks.length}/${
              (game.maxMinutes / 3) * tier
            } drinks`}</h4>
          </CardBody>
        </Card>
      </div>
    )
  }
}
