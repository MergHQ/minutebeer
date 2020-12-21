import React from 'react'
import {Card, CardTitle, CardBody, Button, Form, FormGroup, Label, Input} from 'reactstrap'
import {sendAction} from '../../../utils/actionDispatcher'
import {updateRegistrationDetailsAction} from '../../../utils/actions'

export default (props: any) => {
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>Rekisteröidy</CardTitle>
          <RegistrationForm />
        </CardBody>
      </Card>
    </div>
  )
}

function RegistrationForm(props: any) {
  return (
    // Would be better if this request was made to the rendering server and 
    // not to the actual back end. The rendering server would then set
    // the cookie so that the initial state can be resolved server-side.
    <Form method="post" action="/api/users">
      <FormGroup>
        <Label for="nickname">Nickname</Label>
        <Input type="text" name="nickname" id="nickname" onChange={e => handleNicknameChange(e)} />
      </FormGroup>
      <FormGroup>
        <Label for="tier">Tier? (n * tier minutes)</Label>
        <Input type="select" name="tier" id="tier" onChange={e => handleTierChange(e)}>
          <option value="0">1</option>
          <option value="1">2</option>
          <option value="2">3</option>
        </Input>
      </FormGroup>
      <Button>Sit mennään!</Button>
    </Form>
  )
}

function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
  sendAction(updateRegistrationDetailsAction, {nickname: e.target.value})
}

function handleTierChange(e: React.ChangeEvent<HTMLInputElement>) {
  sendAction(updateRegistrationDetailsAction, {tier: Number(e.target.value)})
}
