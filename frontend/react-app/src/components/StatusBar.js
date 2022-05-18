import classes from './StatusBar.module.css'

function StatusBar(props) {
  return (
    <div className={classes.status}>
      <p>Analyzer is ready!</p>
      {props.isLoading && <div className={classes.loading}><div></div><div></div><div></div></div>}
    </div>
  )
}

export default StatusBar
