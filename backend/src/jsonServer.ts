import express from 'express'
import {
  getAllUsers,
  parseUserToken,
  getUserById,
  createUser,
  createUserToken,
} from './services/userService'
import * as bodyParser from 'body-parser'
import { createDrink, getUserDrinks } from './services/drinkService'
import cors from 'cors'
import { getGame, getGames, startGame } from './services/gameService'
import cookieParser from 'cookie-parser'
import * as E from 'fp-ts/Either'
import { option as O } from './fptsExtensions'
import { check } from './client/userServiceClient'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())
app.use(cookieParser())

const checkLogin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) =>
  check(req.get('authorization')).then(result =>
    result ? next() : res.status(401).json({ message: 'Unauthorizaed' })
  )

app.get('/api/participants', (req, res) => {
  getAllUsers().then(users => res.json(users))
})

app.get('/api/users/me', checkLogin, (req, res) => {
  const token = req.get('authorization')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const task = getUserById(token)
  task().then(
    E.fold(
      error => {
        res.status(error.status).json({ message: error.message })
        console.error(error.pureErrorMessage)
      },
      O.fold(
        () => res.status(404).json({ message: 'Not found' }),
        u => res.json(u)
      )
    )
  )
})

app.get('/api/users/me/drinks', (req, res) => {
  const token = req.get('authorization')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = parseUserToken(token)
  getUserDrinks(userId)
    .then(drinks => res.json(drinks))
    .catch(e => {
      res.send(500).json({ error: 'Internal server error' })
      console.error(e)
    })
})

app.post('/api/users/', (req, res) => {
  const token = req.get('authorization')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const body = req.body
  const task = createUser(body, token)
  task().then(
    E.fold(
      e => {
        console.error(e.pureErrorMessage)
        res.status(e.status).json({ message: e.message })
      },
      user => res.json(createUserToken(user))
    )
  )
})

app.post('/api/drinks', (req, res) => {
  const token = req.get('authorization') ? req.get('authorization') : req.cookies.token
  console.log(token, req.cookies.token)
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const userId = parseUserToken(token)
  const body = {
    userId,
    ...req.body,
  }
  createDrink(body)
    .then(id => res.status(200).json({ id }))
    .catch(e => {
      res.status(500).json({ error: 'Internal server error' })
      console.error(e)
    })
})

app.get('/api/games', checkLogin, (_, res) => {
  const task = getGames()
  task().then(
    E.fold(
      e => {
        res.status(e.status).json({ message: e.message })
        console.log(e.pureErrorMessage)
      },
      g => res.json(g)
    )
  )
})

app.get('/api/games/:id', checkLogin, (req, res) => {
  const task = getGame(req.params.id)
  task().then(
    E.fold(
      e => {
        res.status(e.status).json({ message: e.message })
        console.log(e.pureErrorMessage)
      },
      O.fold(
        () => res.status(404).json({ message: 'Not found' }),
        g => res.json(g)
      )
    )
  )
})

app.put('/api/games/:id', checkLogin, (req, res) => {
  const task = startGame(req.params.id)
  task().then(
    E.fold(
      () => res.status(500).json({ message: 'Game did not start, check logs' }),
      () => res.json({ message: 'started' })
    )
  )
})

export const jsonServer = app
