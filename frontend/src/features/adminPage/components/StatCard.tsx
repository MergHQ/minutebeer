import React from 'react'
import { Container, Col, Row, Card, CardTitle, CardSubtitle, CardBody } from 'reactstrap';

interface Props {
  participants: string[]
  totalDrinks: number
  nonHolic: number
  holic: number
}

export default class StatCard extends React.Component<Props, any> {
  render() {
    const {participants, totalDrinks, nonHolic, holic} = this.props
    return  (
      <div>
        <Container>
          <Row>
            <Col>
              <Card>
                <CardTitle><h3>Participants:</h3></CardTitle>
                <CardBody>
                  <b>{participants ? participants.join(', ') : ''}</b>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col xs="6" sm="4">
              <Card>
                <br />
                <CardSubtitle>Total drinks:</CardSubtitle>
                <CardTitle><h1>{totalDrinks}</h1></CardTitle>
              </Card>
            </Col>
            <Col xs="6" sm="4">
              <Card>
                <br />
                <CardSubtitle>Alcoholic drinks:</CardSubtitle>
                <CardTitle><h1>{holic}</h1></CardTitle>
              </Card>
            </Col>
            <Col xs="6" sm="4">
              <Card>
                <br />
                <CardSubtitle>Non-alcoholic drinks:</CardSubtitle>
                <CardTitle><h1>{nonHolic}</h1></CardTitle>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}