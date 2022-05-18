import { useContext } from 'react'

import SocketContext from './SocketContext/context'

import classes from './StatusBar.module.css'

function StatusBar() {
  const { analyzerStatus, statusTimeElapsed } = useContext(SocketContext)

  const status = analyzerStatus === 'ready' ?
   <p>Analyzer is ready!</p> :
   <p>Analyzer is busy!</p>

  return (
    <div className={classes.status}>
      {status}
      {analyzerStatus === 'busy' && <div className={classes.loading}><div></div><div></div><div></div></div>}
    </div>
  )
}

export default StatusBar
