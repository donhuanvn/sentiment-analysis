import io from 'socket.io-client'
import { socketEvents } from './events'
export const socket = io('http://localhost:9000')

export const initSockets = ({ setValue }) => {
  socketEvents({ setValue })
}
