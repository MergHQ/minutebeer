import React from 'react'
import {Card, CardBody, CardTitle} from 'reactstrap'
import DrinkButtons from './DrinkButtons';
import {DrinkType} from '../../../types/UserDrink'
import {sendAction} from '../../../utils/actionDispatcher'
import {addDrinkAction} from '../../../utils/actions'

interface Props {

}

export default class CatchUpCard extends React.Component<Props, any> {
  render() {
    return (
      <Card>
        <CardTitle>Catch up with your drinks!</CardTitle>
        <CardBody>
          <DrinkButtons handleClick={onDrinkButtonPress} />
        </CardBody>
      </Card>
    )
  }
}

function onDrinkButtonPress(type: DrinkType) {
  sendAction(addDrinkAction, type)
}