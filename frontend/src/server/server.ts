require('dotenv').config()
import express from 'express'
import cookieParser from 'cookie-parser'
import ReactServer from 'react-dom/server'
import { createTemplate } from './basePage'
import { createModel } from '../features/applicationModel'
import { resolveInitialState } from './resolvers/initialStateResolver'
import request from 'request-promise'
import bodyParser from 'body-parser'
const config = require('../configs/clientConfig.json')

const PORT = process.env.PORT || 3000
const server = express()

server.use(express.static('dist'))
server.use(cookieParser())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded())

const checkLogin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.cookies.token)
    return res.redirect(
      `${process.env.USER_SERVICE_URL}?serviceIdentifier=${process.env.USER_SERVICE_IDENTIFIER}`
    )
  next()
}

server.get('/', checkLogin, async (req, res) => {
  const initialState = await resolveInitialState(req.cookies.token, req.path, null)
  const appP = createModel(initialState)
  console.log(initialState)
  appP.first().onValue(container => {
    const body = ReactServer.renderToString(container)
    res.send(
      createTemplate({
        title: 'Minuuttijuoma',
        body,
        initialState: JSON.stringify(initialState),
      })
    )
  })
})

server.get('/admin/:gameId', async (req, res) => {
  const initialState = await resolveInitialState(
    req.cookies.token,
    req.path,
    req.params.gameId
  )
  const appP = createModel(initialState)
  appP.first().onValue(container => {
    const body = ReactServer.renderToString(container)
    res.send(
      createTemplate({
        title: 'Minuuttijuoma',
        body,
        initialState: JSON.stringify(initialState),
      })
    )
  })
})

server.post('/api/users', (req, res) => {
  const body = req.body
  const token = req.cookies.token
  request
    .post(config.apiEntrypoint + '/api/users', {
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json', authorization: token },
    })
    .then(() => res.redirect('/'))
    .catch(e => {
      console.error('Error creating user ' + e.message)
      res.redirect('/')
    })
})

server.listen(PORT, () => console.log('Listening on port', PORT))
