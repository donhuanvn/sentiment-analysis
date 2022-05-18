import {createContext} from 'react'

const SocketContext = createContext({
  analyzerStatus: '',
  statusTimeElapsed: 0
})

export default SocketContext
