import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import axios from "axios"
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import classes from "./Projects.css"

const Projects = () => {
    const [getProjects, setGetProjects] = useState()
    const [projects, setProjects] = useState()

    useEffect(() => {
        if (!projects) {
            handleGetProjects()
        }
    }, [])

    useEffect(() => {
        // Once we get the projects from the database, we will
        // make a concise version of the project object.
        // We will use this instead of the raw data from the database
        let projectsArr = []
        if (getProjects) {
            getProjects.map(a => {
                let projectObj = {
                    bugs: a.bugs,
                    numofbugs: a.bugs ? a.bugs.length : 0,
                    description: a.description,
                    id: a._id,
                    projectmanager: a.projectmanager,
                    projectname: a.projectname,
                    createdAt: a.createdAt,
                    updatedAt: a.updatedAt
                }
                projectsArr.push(projectObj)
            })
        }
        return setProjects(projectsArr)
    }, [getProjects])

    const handleGetProjects = () => {
        // Get the bugs from the server
        axios.get("/app/projects/")
            .then(res => {
                setGetProjects(res.data)
            })
            .catch(err => {
                if (err.response.status === 401 || err.response.status === 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })
    }

    return (
        <div>
            <div className={classes["projects-materialtable"]}>
                <div className={classes["projects-head"]}>
                    <h2 className={classes["projects-head__title"]}>Total Projects [{ projects ? projects.length : 0 }]</h2>
                </div>
                <div className={classes["projects-materialtable__btn"]}>
                    <Link to={`/app/projects/add`} style={{ textDecoration: "none" }}>
                        <Button variant="contained" color="primary">
                            Create Project
                        </Button>          
                    </Link>
                </div>          
                <MaterialTable
                    columns={[
                        { title: "Project", field: "projectname", render: project => <Link to={`/app/projects/${project.id}`} style={{ textDecoration: "none" }}>{project.projectname}</Link> },
                        { title: "Project Manager", field: "projectmanager" },
                        { title: "Number of Bugs", field: "numofbugs" },
                        { title: "Date Posted", field: "createdAt", type: "date" },
                    ]}
                    data={projects ? projects : []}
                    title="Projects"
                />
            </div>
        </div>
    )
}

export default Projects