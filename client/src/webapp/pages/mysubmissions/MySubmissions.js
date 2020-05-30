import React, { useContext, useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import axios from "axios";
import UserContext from "../../../UserContext"
import MaterialTable from "material-table";
import classes from "./MySubmissions.css"

const MySubmissions = () => {
    let match = useRouteMatch()
    const { userid } = match.params
    const [pageCount, setPageCount] = useState(0)
    const [lastRevised, setLastRevised] = useState(true)
    const [bugs, setBugs] = useState()
    const { authUser, setAuthUser } = useContext(UserContext)

    useEffect(() => {
        if (!bugs) {
            // Run code once during page load
            handleGetSubmittedBugs()
        }
    }, [])

    const handleGetSubmittedBugs = () => {
        // Get the bugs from the server
        axios.get(`/app/bugs/bugsubmissions/${authUser.id}`)
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

    return (
        <div>
            <div className={classes["mysubmissions-materialtable"]}>
                <div className={classes["mysubmissions-head"]}>
                    <h2 className={classes["mysubmissions-head__title"]}>My Bug Submissions</h2>
                </div>      
                <MaterialTable
                    title="Bugs"
                    data={bugs ? bugs : []}
                    columns={[
                        { title: "Description", field: "title", render: bug => <Link to={`/app/bugs/${bug._id}`} style={{ textDecoration: "none" }}>{bug.title}</Link> },
                        { title: "Priority", field: "priority" },
                        { title: "Programming Language", field: "language" },
                        { title: "Date Posted", field: "createdAt", type: "date" },
                        { title: "Status", field: "bugstatus" }
                    ]}
                />
            </div>
        </div>
    )
}

export default MySubmissions