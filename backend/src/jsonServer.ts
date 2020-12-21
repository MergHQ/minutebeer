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
import { getGame } from './services/gameService'
import cookieParser from 'cookie-parser'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())
app.use(cookieParser())

app.get('/api/participants', (req, res) => {
  getAllUsers().then(users => res.json(users))
})

app.get('/api/users/me', (req, res) => {
  const token = req.get('authorization')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = parseUserToken(token)
  getUserById(userId).then(user => {
    res.json(user)
  })
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
  const body = req.body
  createUser(body)
    .then(createUserToken)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(e => {
      res.status(500).json({ error: 'Internal server error' })
      console.error(e)
    })
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

app.get('/api/game', (req, res) => {
  const game = getGame()
  res.json(game)
})

app.post('/api/game', (req, res) => {})

export const jsonServer = app
