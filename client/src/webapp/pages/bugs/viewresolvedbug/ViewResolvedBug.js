import React, { useContext, useEffect, useState } from "react"
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
import { Button, Card, CardActions, CardContent, Container, List, ListItem, ListItemText, Typography } from "@material-ui/core"
import classes from "./ViewResolvedBug.css"

const ViewResolvedBug = () => {
    let match = useRouteMatch()
    const { bugid } = match.params
    const [data, setData] = useState(null)
    const [isBugGone, setisBugGone] = useState(false)

    useEffect(() => {
        axios
            .get(`/app/bugs/resolvedbugs/${bugid}`)
            .then(res => {
                setData(res.data)
            })
            .catch(err => {
                if (err.response.status === 400 || err.response.status === 404) {
                    return setisBugGone(true)
                }

                if (err.response.status === 401 || err.response.status === 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })
    }, [])

    const createMarkupDescription = () => {
        return {__html: data["bug"].description}
    }

    const handleCheckDueDate = () => {        
        let bugStatus = data["bug"].bugstatus

        let currDate = moment().format()
        let bugDueDate = moment(data["bug"].duedate).format()
        let isExpired = moment(currDate).isAfter(bugDueDate)

        // Set this to true so the function doesn"t rerun everytime the the dom changes
        if (isExpired) {
            return (
                <>
                    {bugStatus === "Open" ? "The bug is past it's due date!" : null}
                    <br />
                </>
            )
        }
    }

    const handleNewBugHistory = () => {
        if (!(data["bug"].bughistory).length) {
            return (
                <li>No bug history</li>
            )
        }

        let size = 0
        if ((data["bug"].bughistory).length >= 5) {
            size = 5
        } else {
            size = (data["bug"].bughistory).length
        }

        let newBugHistoryArr = data["bug"].bughistory.slice(0, size)
        return newBugHistoryArr.map((a, b, c) => {
            let his = a[0]
            let date = a[1]
            let items = []
        
            items.push(`Last Edited: ${date}`)

            for (const property in his) {
                items.push(`${property}: ${his[property]}`)
            }
        
            return (
                <li key={items}>
                    {items.toString().split(",").map(line => <span key={line}>{line}, <br /></span>)}
                    <br />

                </li>
            )
        })
    }


    const handleDetailedComments = () => {
        if (!data["detailedcomments"].length) {
            return (
                <div>No comments!</div>
            )
        }

        // Set this to true so the function doesn"t rerun everytime the the dom changes
        return data["detailedcomments"].map(item => {
            let commentDate = moment(item.createdAt).fromNow()

            return (
                <List key={item.createdAt}>
                    <ListItem alignItems="flex-start" className={classes["viewresolved__listitem"]}>     
                        <ListItemText
                        primary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes["viewresolved__inline"]}
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
                                    className={classes["viewresolved__inline"]}
                                    color="textPrimary"
                                >
                                    { <span dangerouslySetInnerHTML={{__html: `${item.usercomment}`} } /> }
                                </Typography>
                            </React.Fragment>
                        }
                        />                
                    </ListItem>
                </List>
            )
        }).reverse()
    }

    return (
        <div>
            <Container maxWidth="lg">
                {
                    isBugGone ?
                    <h2>Oh no resolved bug is not found!</h2>
                    :
                    <div className={classes["viewresolved__flex"]}>
                        <div className={classes["viewresolved__detail"]}>  
                            <div className={classes["viewresolved__head-flex"]}>
                                <div className={classes["viewresolved__head__text"]}>
                                    <div>
                                        <h1 className={classes["viewresolved__title"]}>Resolved: {data ? data["bug"].title : null}</h1>
                                    </div>
                                    <div className={classes["viewresolved__language-createdAt"]}>
                                        <p className={classes["viewresolved__language"]}>Language: {data ? data["bug"].language : null}</p>
                                        <p className={classes["viewresolved__createdAt"]}>Created At: {data ? moment(data["bug"].createdAtt).format("MM-DD-YYYY") : null}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className={classes["viewresolved__description"]}>
                                        { <div dangerouslySetInnerHTML={data ? createMarkupDescription() : null} /> }     
                                    </div>
                                    <div>
                                        <div>
                                            <h3>Comments: </h3>
                                            {data ? handleDetailedComments() : null} 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes["viewresolved__side"]}>
                            <Container maxWidth="sm">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h6">
                                            Due Date: <br />
                                            {data ? moment(data["bug"].duedate).format("MMMM Do YYYY") : null}
                                        </Typography>
                                        <hr />

                                        <Typography paragraph>
                                            {data ? handleCheckDueDate() : null}
                                            <br />
                                            
                                            Assigned Project: 
                                            <br />
                                            {data ? data["bug"].projectname : null}
                                            <br />
                                            <br />
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <br />
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h6">
                                            History
                                        </Typography>
                                        <hr />
                                        <ul>
                                            { data ? 
                                                (
                                                    handleNewBugHistory()
                                                ) : null
                                            }

                                        </ul>
                                        <div>
                                            {
                                                data && (data["bug"].bughistory).length ?
                                                (
                                                    <CardActions>
                                                        <Button size="small" variant="contained">View all bug history</Button>
                                                    </CardActions>
                                                )
                                                :
                                                (
                                                    null
                                                )
                                            }

                                        </div>
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

export default ViewResolvedBug

