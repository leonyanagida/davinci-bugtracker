import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import axios from "axios";
import MaterialTable from "material-table";
import classes from "./ResolvedBugs.css"

const ResolvedBugs = () => {
    let match = useRouteMatch()
    const [bugs, setBugs] = useState()

    useEffect(() => {
        if (!bugs) {
            // Run code once during page load
            handleGetBugs()
        }
    }, [])

    const handleGetBugs = () => {
        // Get the bugs from the server
        axios.get("/app/bugs/resolvedbugs")
            .then(res => {
                setBugs(res.data)
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
            <div className={classes["bugs-materialtable"]}>
                <div className={classes["bugs-head"]}>
                    <h2 className={classes["bugs-head__title"]}>Resolved Bugs [{bugs ? bugs.length : 0}]</h2>
                </div>      
                <MaterialTable
                    title="Bugs"
                    data={bugs ? bugs : []}
                    columns={[
                        { title: "Description", field: "title", render: bug => <Link to={`/app/resolvedbugs/${bug._id}`} style={{ textDecoration: "none" }}>{bug.title}</Link> },
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

export default ResolvedBugs