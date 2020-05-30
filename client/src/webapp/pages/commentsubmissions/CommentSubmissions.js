import React, { useContext, useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import UserContext from "../../../UserContext"
import axios from "axios";
import moment from "moment"
import { List, ListItem, ListItemText, Typography } from "@material-ui/core"

import classes from "./CommentSubmissions.css"

const CommentSubmissions = () => {
    let match = useRouteMatch()
    const { authUser, setAuthUser } = useContext(UserContext)

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!comments.length) {
            setLoading(true)
            // Run code once during page load
            handleGetComments()
        }
    }, [])

    const handleGetComments = () => {
        // Get the bugs from the server
        axios.get(`/app/usercomments/${authUser.id}`)
            .then(res => {
                setComments(res.data)
                setLoading(false)
            })
            .catch(err => {
                if (err.response.status === 401 || err.response.status === 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })
    }

    const handleComments = () => {
        if (!comments.length) return <div>No comments!</div>

        return comments.map(item => {
            let commentDate = moment(item.createdAt).fromNow()

            return (
                <List key={item.usercomment + item.createdAt}>
                    <ListItem alignItems="flex-start" className={classes["commentsubmissions__listitem"]}>
                        <Link to={`/app/bugs/${item.bugid}`} style={{ textDecoration: "none" }}>
                            <ListItemText
                            primary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes["commentsubmission__inline"]}
                                        color="textPrimary"
                                    >
                                        {item.username} - {commentDate}
                                    </Typography>
                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        className={classes["commentsubmission__inline"]}
                                        color="textPrimary"
                                    >
                                    { <span dangerouslySetInnerHTML={ {__html: `${item.usercomment}`} } /> }

                                    </Typography>
                                </React.Fragment>
                            }
                            />
                        </Link>
                    </ListItem>
                </List>
            )
        }).reverse()
    }

    return (
        <div>
            {
                loading ?
                <div>Loading...</div>
                :
                <div className={classes["bugs-materialtable"]}>
                    <div className={classes["bugs-head"]}>
                        <h2 className={classes["bugs-head__title"]}>My Comments</h2>
                    </div>
                    <div>
                        {comments ? handleComments() : null}
                    </div>
                </div>
            }
        </div>
    )
}

export default CommentSubmissions