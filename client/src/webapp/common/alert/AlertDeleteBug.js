import React, {useState, forwardRef, useImperativeHandle } from 'react'
import  { useHistory } from 'react-router-dom'
import axios from "axios"
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

const AlertDeleteBug = forwardRef((props, ref) => {
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

  
  const handleConfirm = () => {
    if (props.alertbugid) {
        axios
            .post(`/app/bugs/delete/${props.alertbugid}`, props.submitdata)
            .then(() => {
              return history.push(`/app/bugs/`)
            })
            .catch(() => {
              return history.push(`/app/bugs/`)
            })
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
           Do you do want to DELETE this bug?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default AlertDeleteBug