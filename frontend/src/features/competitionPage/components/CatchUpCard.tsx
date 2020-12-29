import React from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap'
import DrinkButtons from './DrinkButtons'
import { DrinkType } from '../../../types/UserDrink'
import { sendAction } from '../../../utils/actionDispatcher'
import { addDrinkAction } from '../../../utils/actions'

interface Props {
  gameId: string
}

export default class CatchUpCard extends React.Component<Props, any> {
  render() {
    return (
      <Card>
        <CardTitle>Catch up with your drinks!</CardTitle>
        <CardBody>
          <DrinkButtons handleClick={dt => onDrinkButtonPress(this.props.gameId, dt)} />
        </CardBody>
      </Card>
    )
  }
}

function onDrinkButtonPress(gameId: string, type: DrinkType) {
  sendAction(addDrinkAction, { gameId, drinkType: type })
}
