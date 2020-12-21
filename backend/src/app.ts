require('dotenv').config()

import { jsonServer } from './jsonServer'
jsonServer.listen(Number(process.env.SERVER_PORT), () => {
  console.log('Server listening on', process.env.SERVER_PORT)
})
