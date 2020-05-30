import React, { useContext, useEffect, useState  } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import { 
    Button, 
    Card, 
    CardActions, 
    CardActionArea,
    CardContent, 
    Typography 
} from "@material-ui/core"
import MaterialTable from "material-table";
import axios from "axios"
import UserContext from "../../../UserContext"
import classes from "./Dashboard.css"

const Dashboard = () => {
    const { authUser, setAuthUser } = useContext(UserContext)
    const [bugs, setBugs] = useState()
    const [projects, setProjects] = useState()

    useEffect(() => {
        if (!bugs && !projects) {
            handleGetAssignedBugs()
            handleGetAssignedProjects()
        }
    }, [])

    const handleGetAssignedBugs = () => {
        // Get the bugs from the server
        axios.get(`/app/bugs/assignedbugs/${authUser.id}`)
            .then(res => {
                setBugs(res.data)
            })
            .catch(err => {
                if (err.response.status == 401 || err.response.status == 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })
    }

    const handleGetAssignedProjects = () => {
        // Get the bugs from the server
        axios.get(`/app/projects/assignedprojects/${authUser.id}`)
            .then(res => {
                setProjects(res.data)

            })
            .catch(err => {
                if (err.response.status == 401 || err.response.status == 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })
    }

    return (
        <div className={classes["dashboard"]}>
            <h1>Welcome {authUser.name}</h1>
            <div>
                <div>
                    <MaterialTable
                        columns={[
                            { title: "Description", field: "title", render: bug => <Link to={`/app/bugs/${bug._id}`} style={{ textDecoration: "none" }}>{bug.title}</Link> },
                            { title: "Priority", field: "priority"},
                            { title: "Programming Language", field: "language" },
                            { title: "Date Posted", field: "createdAt", type: "date" },
                            { title: "Status", field: "bugstatus" }
                        ]}
                        data={bugs ? bugs : []}
                        title="Assigned Bugs"
                    />
                </div>
            </div>
            <div className={classes["dashboard__row2"]}>
                <div className={classes["dashboard__row2__table"]}>
                    <MaterialTable
                        columns={[
                            { title: "Project Name", field: "projectname", render: project => <Link to={`/app/projects/${project._id}`} style={{ textDecoration: "none" }}>{project.projectname}</Link>  },
                            { title: "Project Manager", field: "projectmanager"},
                            { title: "Date Created", field: "createdAt", type: "date" },
                        ]}
                        data={projects ? projects : []}
                        title="Assigned Projects"
                    />
                </div>
                <div className={classes["dashboard__row2__card"]}>
                    <Card>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Developer Notes
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Thank you for viewing Leon"s bug tracker application. Certain features are disabled on the live version to prevent spam requests from hitting the server.
                                    <br />
                                    <br />
                                    Of course there are plenty of more features I could have added to this web app. However, I learned a lot of new ideas and concepts just from what I have been able to complete so far.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary" href="http://leonyanagida.com">
                            About Leon
                            </Button>
                            <Button size="small" color="primary" href="http://github.com/leonyanagida">
                            Github
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 