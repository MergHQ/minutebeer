import React from 'react'
import { User } from '../../../types/User'
import { Card, CardBody } from 'reactstrap'

interface Props {
  currentDrink: number
  user: User
  drinks: string[]
}

export default class PersonalStats extends React.Component<Props, any> {
  render() {
    const { currentDrink, user, drinks } = this.props
    return (
      <div>
        <Card>
          <CardBody>
            <h4>{`Current drink: ${currentDrink}/${(user.tier + 1) * 31}`}</h4>
            <h4>{`I've drank ${drinks.length}/${(user.tier + 1) * 31} drinks`}</h4>
          </CardBody>
        </Card>
      </div>
    )
  }
}