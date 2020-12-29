import express from 'express'
import {
  getAllUsers,
  getUserWithToken,
  createUser,
  createUserToken,
} from './services/userService'
import * as bodyParser from 'body-parser'
import { createDrink, getUserDrinksWithToken } from './services/drinkService'
import cors from 'cors'
import {
  createGame,
  getGame,
  getGames,
  participate,
  startGame,
} from './services/gameService'
import cookieParser from 'cookie-parser'
import * as E from 'fp-ts/Either'
import { option as O } from './fptsExtensions'
import { check } from './client/userServiceClient'
import * as R from 'ramda'

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

  const task = getUserWithToken(token)
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
/*
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
*/
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

app.get('/api/games/:id/drinks', checkLogin, (req, res) => {
  const task = getUserDrinksWithToken(req.get('authorization'), req.params.id)
  task().then(
    E.fold(
      e => {
        res.status(e.status).json({ message: e.message })
        console.error(e.pureErrorMessage)
      },
      d => res.json(d)
    )
  )
})

app.post('/api/games/:id/drinks', checkLogin, (req, res) => {
  const { drinkType } = req.body
  if (R.isNil(drinkType) || Number(drinkType) === NaN)
    return res.status(400).json({ message: 'Invalid post body' })
  const task = createDrink(req.get('authorization'), req.params.id, drinkType)
  task().then(
    E.fold(
      e => {
        res.status(e.status).json({ message: e.message })
        console.error(e.pureErrorMessage)
      },
      d => res.json(d)
    )
  )
})

app.get('/api/games', checkLogin, (req, res) => {
  const task = getGames(req.get('authorization'))
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
      () => {
        res.status(500).json({ message: 'Game did not start, check logs' })
        console.error('Game did not start')
      },
      () => res.json({ message: 'started' })
    )
  )
})

app.post('/api/games', checkLogin, (req, res) => {
  const task = createGame(req.body)
  task().then(
    E.fold(
      e => {
        res.status(e.status).json({ message: e.message })
        console.error(e.pureErrorMessage)
      },
      g => res.json(g)
    )
  )
})

app.post('/api/games/:gameId/participate', checkLogin, (req, res) => {
  const { tier } = req.body
  if (!tier || Number(tier) === NaN)
    return res.status(400).json({ message: 'Invalid post body' })

  const task = participate(req.get('authorization'), req.params.gameId, tier)
  task().then(
    E.fold(
      e => {
        res.status(e.status).json({ message: e.message })
        console.error(e.pureErrorMessage)
      },
      _ => res.json({ message: 'Participation created' })
    )
  )
})

export const jsonServer = app
