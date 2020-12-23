import ReactDOM from 'react-dom'

import { createModel } from './features/applicationModel'

const is = document.getElementById('initial-state')
const appP = createModel(is ? JSON.parse(is.innerText) : null)
is.parentElement.removeChild(is)
appP.onValue(container => {
  ReactDOM.render(container, document.getElementById('app'))
})
