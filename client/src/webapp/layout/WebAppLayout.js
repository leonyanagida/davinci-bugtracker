import React, { useContext, useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  useHistory
} from "react-router-dom"
import axios from "axios"
import UserContext from "../../UserContext"
import clsx from "clsx"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import DashboardIcon from '@material-ui/icons/Dashboard'
import BugReportIcon from '@material-ui/icons/BugReport'
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import List from "@material-ui/core/List"
import CssBaseline from "@material-ui/core/CssBaseline"
import CommentIcon from '@material-ui/icons/Comment';
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import PublishIcon from '@material-ui/icons/Publish'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial'
import BeenhereIcon from '@material-ui/icons/Beenhere'

// WEB APP
import Bugs from "../pages/bugs/Bugs"
import EditBug from "../pages/bugs/editbug/EditBug"
import NewBug from "../pages/bugs/newbug/NewBug"
import ViewBug from "../pages/bugs/viewbug/ViewBug"
import Dashboard from "../pages/dashboard/Dashboard"
import Login from "../pages/auth/login/Login"
import Projects from "../pages/projects/Projects"
import ViewProject from "../pages/projects/viewproject/ViewProject"
import NewProject from "../pages/projects/newproject/NewProject"
import EditProject from "../pages/projects/editproject/EditProject"
import MySubmissions from "../pages/mysubmissions/MySubmissions"
import CommentSubmissions from "../pages/commentsubmissions/CommentSubmissions"
import ResolvedBugs from "../pages/bugs/resolvedbugs/ResolvedBugs"
import ViewResolvedBug from "../pages/bugs/viewresolvedbug/ViewResolvedBug"

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  link: {
    color: "white",
    textDecoration: "none",
  },
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  bottom: {
    position: "absolute",
    bottom: 0
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))


const WebAppLayout = () => {
	const classes = useStyles()
  const theme = useTheme()
  let history = useHistory()
	const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [noToken, setNoToken] = useState(true)

  const { authUser, setAuthUser } = useContext(UserContext)

	useEffect(() => {
    if (authUser) {
      return setNoToken(false)
    }

   axios
      .get("/api/checktoken")
      .then(res => {
        setNoToken(false)
        setAuthUser(res.data)
      })
      .catch(() => {
          setNoToken(false)
      })
	}, [])

    const handleSignout = () => {
      axios
        .post("/app/users/signout", authUser)
        .then(() => {
          setTimeout(() => {
            setAuthUser(null)
            return history.push(`/app`)
          }, 500)
        })
    }

    const handleDrawerOpen = () => {
      setOpen(true)
    }
  
	  const handleDrawerClose = () => {
	    setOpen(false)
    }

    return (
        <div>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                        [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        <Link to="/app" className={classes.link}>
                          Bug Tracker
                        </Link>
                    </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                    })}
                    classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                    }}
                >
                    <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    </div>
                    <Divider />
                    <List>
                    {["Dashboard", "Bugs", "Projects"].map((text, index) => (
                        <ListItem
                          button
                          component={Link}
                          key={text}
                          to={text === "Dashboard" ? `/app/` : `/app/${text.toLowerCase()}`} 
                        >
                          <ListItemIcon>
                            {
                              text === "Dashboard" ? <DashboardIcon /> : 
                              text === "Projects" ? <FolderSpecialIcon /> : 
                              <BugReportIcon />
                            }
                            </ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItem>
                    ))}
                    </List>
                    <Divider />
                    <List>
                    {["Resolved Bugs", "Bug Submissions", "My Comments"].map((text, index) => (
                        <ListItem 
                          button 
                          component={Link}
                          key={text}
                          to={`/app/${text.toLowerCase().split(" ").join("")}`} 
                        >
                        <ListItemIcon>
                          {
                            text === "Bug Submissions" ? <PublishIcon /> : 
                            text === "My Comments" ? <CommentIcon /> :
                            <BeenhereIcon />
                          }
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                    </List>
                    <br />
                    {
                      authUser ?
                      (
                        <List className={classes.bottom}>
                        {["Sign Out"].map((text, index) => (
                            <ListItem 
                              button 
                              key={text}
                              onClick={handleSignout}
                            >
                            <ListItemIcon>
                              <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                            </ListItem>
                        ))}
                        </List>
                      )
                      :
                      (null)
                    }
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                        {
                          authUser ? 
                          (
                            <Switch>
                              {/* Web Apps Routes */}
                              <Route path="/app/resolvedbugs/:bugid">
                                  <ViewResolvedBug />
                              </Route>
                              <Route path="/app/resolvedbugs">
                                  <ResolvedBugs />
                              </Route>
                              <Route path="/app/bugs/add">
                                  <NewBug />
                              </Route>
                              <Route path="/app/bugs/update/:bugid">
                                  <EditBug />
                              </Route>
                              <Route path="/app/bugs/:bugid">
                                  <ViewBug />
                              </Route>
                              <Route path="/app/bugs">
                                  <Bugs />
                              </Route>
                              <Route path="/app/projects/update/:projectid">
                                  <EditProject />
                              </Route>
                              <Route path="/app/projects/add">
                                  <NewProject />
                              </Route>
                              <Route path="/app/projects/:projectid">
                                  <ViewProject />
                              </Route>
                              <Route path="/app/projects">
                                  <Projects />
                              </Route>
                              <Route path="/app/bugsubmissions">
                                  <MySubmissions />
                              </Route>
                              <Route path="/app/mycomments">
                                  <CommentSubmissions />
                              </Route>
                              <Route path="/app/login">
                                <h1>You are already logged in!</h1>
                              </Route>
                              <Route exact path="/app/">
                                { authUser ? <Dashboard /> : <Login /> }
                              </Route>
                              <Route component={() => <h1>Page Not Found!</h1>} />
                            </Switch>
                          )
                          :
                            noToken ? 
                            (
                              <div>Loading...</div>
                            )
                            :
                            (
                              <Switch>
                                <Route path="/app/">
                                    <Login />
                                </Route>
                                <Route component={() => <h1>Page Not Found!</h1>} />
                              </Switch>
                            )
                        }
                </main>
            </div>
        </div>
    )
}

export default WebAppLayout