import axios from 'axios'
import memoize from '../utils/memoize'

export type TkoAlyUser = {
  id: number
  email: string
  role: string
}

type ServiceResponse<T> = {
  payload: T
}

const userService = axios.create({
  baseURL: process.env.TKO_ALY_USER_SERVICE_URL || 'http://localhost:4200/api',
  headers: {
    Service: process.env.SERVICE_IDENTIFIER,
  },
})

const getUserInfoNonCached = (token: string) =>
  userService
    .get<ServiceResponse<TkoAlyUser>>('/users/me', {
      headers: { authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data.payload)

const memoizedUserInfo = memoize(getUserInfoNonCached, 60000)

export const getUserInfo = (token: string) => memoizedUserInfo(token)

export const check = (token: string) =>
  userService
    .get('/auth/check', { headers: { authorization: `Bearer ${token}` } })
    .then(() => true)
    .catch(e => {
      console.error(e)
      return false
    })
