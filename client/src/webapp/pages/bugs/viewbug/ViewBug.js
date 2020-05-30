import React, { useContext, useEffect, useRef, useState } from "react"
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
import { Button, Card, CardActions, CardContent, Container, List, ListItem, ListItemText, TextField, Typography } from "@material-ui/core"
import AlertResolve from "../../../common/alert/AlertResolve"
import UserContext from "../../../../UserContext"
import classes from "./ViewBug.css"

const ViewBug = () => {
    let match = useRouteMatch()
    const { bugid } = match.params
    const { authUser, setAuthUser } = useContext(UserContext)
	const alertResolveRef = useRef()
    const [data, setData] = useState(null)
    const [newBugHistory, setNewBugHistory] = useState()
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmmitting] = useState(false)
    const [isBugGone, setIsBugGone] = useState(false)

    useEffect(() => {
        axios
            .get(`/app/bugs/${bugid}`)
            .then(res => {
                setData(res.data)
            })
            .catch(err => {
                if (err.response.status === 400 || err.response.status === 404) {
                    // Display that the bug was not found or deleted
                    setIsBugGone(true)
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
        // Do not run this function if we already have data in the useState
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
                if (property !== "updatedAt" && property !== "duedate") {
                    if (property == "description") {
                        items.push(`${property}: Description was changed`)
                    } else {
                        items.push(`${property}: ${his[property]}`)

                    }
                }
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

        return data["detailedcomments"].map(item => {
            let commentDate = moment(item.createdAt).fromNow()

            return (
                <List key={item.createdAt}>
                    <ListItem alignItems="flex-start" className={classes["viewbug__listitem"]}>     
                        <ListItemText
                        primary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes["viewbug__inline"]}
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
                                    className={classes["viewbug__inline"]}
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

    const handleCommentChange = (event) => {
        setNewComment(event.target.value)
    }

    const handleCommentSubmit = () => {
        if (!newComment) return

        setIsSubmmitting(true)

        let comment = {
            usercomment: newComment,
            userid: authUser.id,
            username: authUser.name,
            bugid: bugid
        }

        axios
            .post(`/app/bugs/${bugid}/comment/add`, comment)
            .then(data => {
                setTimeout(() => {
                    setIsSubmmitting(false)
                    window.location.reload(true)
                    //
                }, 1000)
            })
            .catch(() => {
                setIsSubmmitting(false)
            })
    }

    const handleCommentCancel = () => {
        // Make sure to set to an empty string or else it will return an error
        setNewComment("")
    }

    return (
        <div>
            <Container maxWidth="lg">
                {
                    isBugGone ?
                    <h2>Oh no, bug not found! Or bug could have been deleted.</h2>
                    :
                    (
                    <div className={classes["viewbug__flex"]}>
                        <div className={classes["viewbug__detail"]}>  
                            <div className={classes["viewbug__head-flex"]}>
                                <div className={classes["viewbug__head__text"]}>
                                    <div>
                                        <div className={[classes["viewbug__priority"],
                                            !data ? classes["viewbug__priority--high"] 
                                            : data["bug"].priority === "High" ? classes["viewbug__priority--high"] 
                                            : data["bug"].priority === "Medium" ? classes["viewbug__priority--medium"] 
                                            : classes["viewbug__priority--low"]].join(" ")
                                        }> 
                                          {data ? data["bug"].priority : null}
                                        </div>
                                        <h1 className={classes["viewbug__title"]}>{data ? data["bug"].title : null}</h1>
                                    </div>
                                    <div className={classes["viewbug__language-createdAt"]}>
                                        <p className={classes["viewbug__language"]}>Language: {data ? data["bug"].language : null}</p>
                                        <p className={classes["viewbug__createdAt"]}>Created At: {data ? moment(data["bug"].createdAtt).format("MM-DD-YYYY") : null}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className={classes["viewbug__description"]}>
                                        <div className={classes["viewbug__edit-resolve"]}>
                                            <Link to={`/app/bugs/update/${bugid}`} style={{ textDecoration: "none" }}>
                                                <Button className={classes["viewbug__btn--edit"]} variant="contained" color="secondary">Edit/Update</Button>
                                            </Link>
                                            <Button 
                                                className={classes["viewbug__btn--resolve"]} 
                                                onClick={() => alertResolveRef.current.handleOpen()}
                                                variant="contained" 
                                                color="primary"
                                                >
                                                    Mark as Resolved
                                            </Button>
                                            <AlertResolve ref={alertResolveRef} alertbugid={bugid} />
                                        </div>
                                        { <div dangerouslySetInnerHTML={data ? createMarkupDescription() : null} /> }
                                    </div>
                                    <div>
                                        <div>
                                            <h3>Comments: </h3>
                                            <TextField 
                                                id="standard-basic" 
                                                label="" 
                                                className={classes["viewbug__text-comment"]}
                                                value={newComment}
                                                onChange={(event) => handleCommentChange(event)}
                                            />
                                            <div className={classes["viewbug__text-btn"]}>
                                                <Button
                                                    className={classes["viewbug__cancel-button"]}
                                                    disabled={isSubmitting}
                                                    onClick={handleCommentCancel} 
                                                    variant="contained" 
                                                >
                                                    Cancel
                                                </Button>   
                                                <Button
                                                    className={classes["viewbug__submit-button"]}
                                                    disabled={isSubmitting}
                                                    onClick={handleCommentSubmit} 
                                                    variant="contained" 
                                                    color="primary"
                                                >
                                                    Comment
                                                </Button>
                                            </div>
                                            {data ? handleDetailedComments() : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes["viewbug__side"]}>
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
    
                                            Assigned To: 
                                            <br />
                                            {data ? data["bug"].assignedto : null}
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
                    )
                }
            </Container>
        </div>
    )
}

export default ViewBug



