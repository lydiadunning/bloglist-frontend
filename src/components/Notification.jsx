const Notification = ({ message }) => {
  const classes = message.isError ? 'error message' : 'message'
  console.log('message', message.text, message.isError)
  return (
    <div className={classes}>
      {message.text}
    </div>
  )
}

export default Notification