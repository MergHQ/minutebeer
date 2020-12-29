import React from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import { sendAction } from '../../../utils/actionDispatcher'
import { addDrinkAction } from '../../../utils/actions'
import { DrinkType } from '../../../types/UserDrink'
import DrinkButtons from './DrinkButtons'

interface Props {
  isModalOpen: boolean
  drinkNumber: number
  gameId: string
}

export default class DrinkAlertModal extends React.Component<Props, any> {
  render() {
    const { isModalOpen, drinkNumber, gameId } = this.props
    return (
      <div>
        <Modal isOpen={isModalOpen}>
          <ModalBody>{`Drink number ${drinkNumber}`}</ModalBody>
          <ModalFooter>
            <DrinkButtons handleClick={dt => onDrinkButtonPress(gameId, dt)} />
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

function onDrinkButtonPress(gameId: string, type: DrinkType) {
  sendAction(addDrinkAction, { gameId, drinkType: type })
}
