import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import axios from "axios"
import moment from "moment"
import { Button, Card, CardContent, Container, Typography } from "@material-ui/core"
import MaterialTable from "material-table";
import classes from "./ViewProject.css"

const ViewProject = () => {
    let match = useRouteMatch()
    const { projectid } = match.params
    const [data, setData] = useState(null)
    const [bugData, setBugData]  = useState()
    const [isProjectGone, setIsProjectGone] = useState(false)
    
    useEffect(() => {
        if (!data) {
            axios
                .get(`/app/projects/${projectid}`)
                .then(res => {
                    setData(res.data)
                })
                .then(() => {
                    axios
                    .get(`/app/bugs/projectbugs/${projectid}`)
                    .then(res => {
                        setBugData(res.data)
                    })
                    .catch(() => {
                        setBugData()
                        setIsProjectGone(true)
                    })
                })
                .catch(err => {
                    if (err.response.status === 400 || err.response.status === 404) {
                        setIsProjectGone(true)
                    }

                    if (err.response.status === 401 || err.response.status === 500) {
                        alert("You have been signed out...")
                        window.location.href="/app"
                    }
                })
        }
    }, [])

    const createMarkupDescription = () => {
        return {__html: data.description}
    }

    return (
        <div>
            <Container maxWidth="lg">
                {
                    isProjectGone ?
                    <h2>Oh no project not found!</h2>
                    :
                    <div className={classes["viewproject__flex"]}>
                        <div className={classes["viewproject__detail"]}>  
                            <div className={classes["viewproject__head-flex"]}>
                                <div className={classes["viewproject__head__text"]}>
                                    <div>
                                        <h1 className={classes["viewproject__title"]}>{data ? data.projectname : null}</h1>
                                    </div>
                                    <div className={classes["viewproject__language-createdAt"]}>
                                        <p className={classes["viewproject__language"]}>Project Manager: {data ? data.projectmanager : null}</p>
                                        <p className={classes["viewproject__createdAt"]}>Created At: {data ? moment(data.createdAt).format("MMMM Do YYYY") : null}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div >
                                    <div className={classes["viewproject__description"]}>
                                        <div className={classes["viewproject__edit-resolve"]}>
                                            <Link to={`/app/projects/update/${projectid}`} style={{ textDecoration: "none" }}>
                                                <Button className={classes["viewproject__btn--edit"]} variant="contained" color="secondary">Edit/Update</Button>
                                            </Link>
                                        </div>
                                        { <div dangerouslySetInnerHTML={data ? createMarkupDescription() : null} /> }
                                    </div>
                                    <div>
                                        <MaterialTable
                                            title="Bugs"
                                            data={bugData ? bugData : []}
                                            columns={[
                                                { title: "Description", field: "title", render: bug => <Link to={`/app/bugs/${bug._id}`}>{bug.title}</Link> },
                                                { title: "Priority", field: "priority" },
                                                { title: "Programming Language", field: "language" },
                                                { title: "Date Posted", field: "createdAt", type: "date" },
                                                { title: "Status", field: "bugstatus" }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes["viewproject__side"]}>
                            <Container maxWidth="sm">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Guidelines: <br />
                                        </Typography>
                                        <hr />
                                        <Typography paragraph>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at duis sed viverra non nisi massa. Hac ipsum donec sed sed urna a, lacinia id. Volutpat faucibus lacus rhoncus integer velit urna urna, fringilla. Ultrices augue erat nulla lorem id morbi sem venenatis a. Est, ullamcorper aliquet lectus et commodo. 
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Container>
                        </div>
                    </div>
                }
            </Container>
        </div>
    )
}

export default ViewProject


