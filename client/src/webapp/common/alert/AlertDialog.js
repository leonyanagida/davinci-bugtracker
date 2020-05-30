import React, {useState, forwardRef, useImperativeHandle } from 'react'
import  { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const AlertDialog = forwardRef((props, ref) => {
  let history = useHistory()
  const [open, setOpen] = useState(false)
  
  useImperativeHandle(ref, () => ({

    handleOpen() {
      setOpen(true)
    }

  }))

  const handleClose = () => {
    setOpen(false)
  }

  const handleLeave = () => {
    if (props.alertprojectid === null) {
      setOpen(false)
      return history.push(`/app/projects/`)
    }

    if (props.alertbugid === null) {
      setOpen(false)
      return history.push(`/app/bugs/`)
    }

    if (props.alertbugid) {
      setOpen(false)
      return history.push(`/app/bugs/${props.alertbugid}`)
    }

    if (props.alertprojectid) {
      setOpen(false)
      return history.push(`/app/projects/${props.alertprojectid}`)
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Alert!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to leave this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLeave} color="primary">
            Yes Leave
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default AlertDialog