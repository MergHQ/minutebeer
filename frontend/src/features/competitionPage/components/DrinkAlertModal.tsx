import React from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import { sendAction } from '../../../utils/actionDispatcher'
import { addDrinkAction } from '../../../utils/actions'
import { DrinkType } from '../../../types/UserDrink'
import DrinkButtons from './DrinkButtons';

interface Props {
  isModalOpen: boolean
  drinkNumber: number
}

export default class DrinkAlertModal extends React.Component<Props, any> {

  render() {
    const { isModalOpen, drinkNumber } = this.props
    return (
      <div>
        <Modal isOpen={isModalOpen}>
          <ModalBody>{`Drink number ${drinkNumber}`}</ModalBody>
          <ModalFooter>
            <DrinkButtons handleClick={onDrinkButtonPress} />
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

function onDrinkButtonPress(type: DrinkType) {
  sendAction(addDrinkAction, type)
}