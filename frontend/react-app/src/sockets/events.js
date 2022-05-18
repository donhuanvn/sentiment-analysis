import { socket } from './index'

export const socketEvents = ({ setValue }) => {
  socket.on('analyzer-status-event', (newStatus) => {
    setValue(state => {
      return { ...state, analyzerStatus: newStatus.analyzerStatus }
    })
  })
}
