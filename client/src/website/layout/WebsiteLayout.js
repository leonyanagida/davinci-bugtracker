import React, { useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter
  } from "react-router-dom"
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Footer from "../common/footer/Footer"
// Pages
import Home from "../pages/home/Home"

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    backgroundColor: "white",
    boxShadow: "none",
    color: "black",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    display: "flex",
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  title2: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  toolbar: {
    width: "100%",
    margin: "auto",
    maxWidth: 1450
  },
  navTitle: {
    color: "black",
    fontWeight: 800,
    marginRight: "2em",
    [theme.breakpoints.down("sm")]: {
      flexGrow: 1
    },
    textDecoration: "none"
  },
  navItem: {
    color: "black",
    fontWeight: 300,
    marginLeft: "3em",
    textDecoration: "none"
  },
  navBurger: {
    [theme.breakpoints.up("md")]: {
      display: "none",
      visibility: "none"
    },
  }
}))

const WebsiteLayout = () => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
        <CssBaseline />
        <AppBar
        position="absolute"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar className={classes.toolbar}>
              <Typography variant="h5" noWrap component={Link} to={"/"} className={classes.navTitle}>
                 Da Vinci
              </Typography>
            <div className={classes.title}>
              <Typography variant="h6" noWrap className={classes.navItem}>
                Why Da Vinci?
              </Typography>
              <Typography variant="h6" noWrap className={classes.navItem}>
                Solutions
              </Typography>
              <Typography variant="h6" noWrap className={classes.navItem}>
                Enterprise
              </Typography>
              <Typography variant="h6" noWrap className={classes.navItem}>
                Pricing
              </Typography>
            </div>
            <div className={classes.title2}>
              <Typography variant="h6" noWrap component={Link} to={"/app"} className={classes.navItem}>
                Login
              </Typography>
            </div>
            <div className={classes.title2}>
              <Typography variant="h6" noWrap className={classes.navItem}>
                Sign Up
              </Typography>
            </div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              className={clsx(open && classes.hide)}
            >
              <MenuIcon className={classes.navBurger} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <main 
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
                {/* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
                <Switch>
                    {/* Web Apps Routes */}
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route component={() => <h1>Page Not Found!</h1>} />
                </Switch>
            <Footer />
        </main>

        <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {["Why Da Vinci?", "Solutions", "Enterprise", "Pricing", "Login", "Sign Up"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
    </div>
  )
}

export default WebsiteLayout