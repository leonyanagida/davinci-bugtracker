import React, { useContext, useState } from "react"
import axios from "axios"
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress"
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider"
import UserContext from "../../../../UserContext"

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  guest: {
    marginTop: "25%",
    textAlign: "center"
  },
  or: {
    textAlign: "center"
  },
  orText: {
    backgroundColor: "gray",
    borderColor: "black",
    borderRadius: "2em",
    color: "white",
    width: "4em"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  demoBtn: {
    paddingBottom: "1em",
    paddingLeft: "3em",
    paddingRight: "3em",
    paddingTop: "1em",

  },
  buttonwrapper: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: "center"
  },
  buttonProgress: {
    color: "green",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  authError: {
    color: "red"
  }
}))

const Login = () => {
  const classes = useStyles()
  const { authUser, setAuthUser } = useContext(UserContext)
  const [ authError, setAuthError ] = useState(false)
  const [ authEmail, setAuthEmail ] = useState()
  const [ authPass, setAuthPass ] = useState()
  const [ loading, setLoading ] = useState(false)  
  const [ isAuthLoading, setIsAuthLoading ] = useState(false)  

  const handleAuthEmailChange = (event) => {
    if (authError) setAuthError(false)
    setAuthEmail(event.target.value)
  }

  const handleAuthPassChange = (event) => {
    if (authError) setAuthError(false)
    setAuthPass(event.target.value)
  }

  const handleAuthSubmit = event => {
    event.preventDefault()

    if (!loading) {
      setIsAuthLoading(true)
      
      axios
        .post("/app/users/login", { email: authEmail, password: authPass }, { withCredentials: true })
        .then((res) => {
          setIsAuthLoading(false)
          setAuthUser(res.data)
        })
        .catch(() => {
          setIsAuthLoading(false)
          setAuthError(true)
        })
    }
  }

  const handleGuestSubmit = async () => {
    if (!loading) {
      setLoading(true)

      let guestUser = {
        id: "5e6c1dc55555dc13801f6f6a"
      }

      await axios
        .post("/app/users/guestlogin", guestUser, { withCredentials: true })
        .then(res => {
          setLoading(false)
          setAuthUser(res.data)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={6}>
        <div className={classes.guest}>
          <Typography component="h1" variant="h3">
            Try the Demo
          </Typography>
          <br />
          <div className={classes.buttonwrapper}>
            <Button
                className={classes.demoBtn}
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
                onClick={handleGuestSubmit}
            >
              Sign In As Guest!
            </Button>
            {loading && <CircularProgress size={34} className={classes.buttonProgress}  />}
          </div>
          <br />
          <br />
          <Typography component="h1" variant="body2">
            Please note that this is a personal project.
            <br />
            Visit my <a target="_blank" rel="noopener noreferrer" href="https://www.github.com/leonyanagida">github</a> to view other projects I have built.
          </Typography>
        </div>
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs={12} sm={7} md={5} elevation={6}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleAuthSubmit}>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleAuthEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleAuthPassChange}
            />
            {
              authError ?
              <Typography component="h1" variant="body2" className={classes.authError}>
                Incorrect username or password!
              </Typography>
              :
              null
            }
            <Button
              disabled={isAuthLoading}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                Please sign in as guest
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Sign ups are temporarily disabled!"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}

export default Login