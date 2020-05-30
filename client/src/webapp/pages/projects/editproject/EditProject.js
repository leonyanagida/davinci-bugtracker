/* eslint-disable no-use-before-define */

import React, { useContext, useEffect, useRef, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import axios from "axios"
import { Editor } from "@tinymce/tinymce-react"
import { makeStyles } from "@material-ui/core/styles"
import { Button, Collapse, FormControl, IconButton, TextField } from "@material-ui/core";
import { Alert, Autocomplete } from "@material-ui/lab";
import AlertDialog from "../../../common/alert/AlertDialog"
import UserContext from "../../../../UserContext"
import CloseIcon from "@material-ui/icons/Close";
import classes from "./EditProject.css"

// Let"s keep the api a secret
const TINYAPI_URL = process.env.REACT_APP_CLIENT_TINYAPI

// Material UI styles
const useStyles = makeStyles((theme) => ({
	formControl: {
		marginBottom: "8px",
		marginTop: "8px",
		minWidth: 320,
		width: "100%"
	},
	selectEmpty: {
	  marginTop: theme.spacing(2),
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		minWidth: 200,
	  },
  }))

const EditProject = () => {
	let match = useRouteMatch()
	const inlineclasses = useStyles()
	const alertDialogRef = useRef()
	const { projectid } = match.params
    const { authUser, setAuthUser } = useContext(UserContext)
	const [data, setData] = useState()
	const [loading, setLoading] = useState(true)
	const [getPeopleList, setGetPeopleList] = useState([])
	const [peopleList, setPeopleList] = useState()
	const [note, setNote] = useState() 
	const [projectName, setProjectName] = useState()
	const [projectManager, setProjectManager] = useState()
	const [submitError, setSubmitError] = useState(false)
	const [btnPressed, setBtnPressed] = useState(false)
	const [open, setOpen] = useState(true)
	const [isProjectGone, setIsProjectGone] = useState(false) 

	useEffect(() => {
		if (!peopleList) {
			handleGetPeopleList()
		}

		axios
			.get(`/app/projects/${projectid}`)
			.then(res => {
				// If the data we receive is empty show an error
				if (!res["data"]) {
					setIsProjectGone(true)
					setTimeout(() => {
						setLoading(false)
					}, 500)
				}

				// Set the good project data
				setData(res["data"])
			})
			.catch((err) => {
                if (err.response.status === 400 || err.response.status === 404) {
					setIsProjectGone(true)
                }
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		if (data && peopleList) {
			setProjectManager(data.projectmanager)
			setLoading(false)
		}
	}, [data])

	useEffect(() => {
        // Once we get the projects from the database, we will
        // make a concise version of the project object.
        // We will use this instead of the raw data from the database
        let peopleListArr = []
        if (getPeopleList.length) {
            getPeopleList.map(a => {
                let peopleListObj = {
					name: a.name
                }
                peopleListArr.push(peopleListObj)
            })
        }
		setPeopleList(peopleListArr)
    }, [getPeopleList])

	const handleGetPeopleList = () => {
		axios
			.get("/app/users")
			.then(res => {
				setGetPeopleList(res.data)
			})
            .catch(err => {
				setLoading(false)
                if (err.response.status === 401 || err.response.status === 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })
	}

	const handleEditorChange = (content, editor) => {
		setBtnPressed(false)
		setNote(content)
	}

	const handleManagerChange = (v) => {
		if (!v) return 
		setProjectManager(v.name)
	}

	const handleProjectNameChange = (event) => {

		console.log("event " + event.target.value)

		setProjectName(event.target.value)
	}

	const handleButtonSubmit = async () => {
		setBtnPressed(true)
		if (!note || !projectManager || !projectName) return setBtnPressed(false)

		const submit = {
			"description": note,
			"projectmanager": projectManager,
			"projectname": projectName
		}

		await axios
			.post(`/app/bugs/add`, submit)
			.then(() => {
				setTimeout(() => {
					window.location.href = "/app/bugs"
				}, 1000)
			})
			.catch(() => {
				setBtnPressed(false)
				setSubmitError(true)
			})
	}

	return (
		<div>
			{
				isProjectGone ?
				<h2>Oh no project does not exist!</h2>
				:
				<div className={classes["editproject-container"]}>
				{
					loading ? 
					<div>Loading...</div>
					:
					<form className={classes["editproject-form"]}>
						<h1 className={classes["editproject-form__title"]}>Edit Project</h1>
						<div>
							<div>
								<FormControl className={[inlineclasses.formControl, classes["newbug__title"]].join(" ")}>
									<TextField
										required
										defaultValue={data ? [data.projectname] : ""}
										onChange={handleProjectNameChange}
										id="outlined-input"
										label="Project name"
										variant="outlined"
									/>
								</FormControl>
							</div>
							<div>
								<FormControl className={[inlineclasses.formControl, classes["newbug__assignedto"]].join(" ")}>
									<Autocomplete
										required
										defaultValue={{name: projectManager}}
										onChange={(e,v) => handleManagerChange(v)}
										id="checkboxes-project"
										options={peopleList}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => <TextField {...params} required label="Project Manager" variant="outlined" />}
									/>
								</FormControl>
							</div>
						</div>
						<div className={classes["editproject-editor"]}>
							<Editor
								apiKey={TINYAPI_URL}
								initialValue={"..."}
								value={data ? data.description : ""}
								init={{
									//  width: "100%",
									margin: "1em",
									height: 500,
									menubar: false,
									codesample_global_prismjs: true,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code codesample help wordcount"
									],
									toolbar:
										"undo redo | formatselect | codesample | bold italic backcolor | \
										alignleft aligncenter alignright alignjustify | \
										bullist numlist outdent indent | removeformat | help"
								}}

								onEditorChange={handleEditorChange}
							/>
						</div>
						<Button 
							className={classes["editproject-submit"]}
							disabled={btnPressed}
							onClick={handleButtonSubmit} 
							variant="contained" 
							color="primary"
						>
							Submit
						</Button>
						<Button 
							className={classes["editproject-cancel"]}
							variant="contained"
							onClick={() => alertDialogRef.current.handleOpen()}
						>
							Cancel
						</Button>
						<AlertDialog ref={alertDialogRef} alertprojectid={projectid}/>
						{
							submitError ?
							<Collapse in={open}>
								<Alert
								variant="filled"
								severity="error"
								action={
									<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => {
										setOpen(false);
									}}
									>
									<CloseIcon fontSize="inherit" />
									</IconButton>
								}
								>
								Error submitting bug. Contact customer support
								</Alert>
							</Collapse>
							:
							null
						}
					</form>
				}
				<div className={classes["editproject-guidelines"]}>
					<h4>Guidelines:</h4>
					<p className={classes["editproject__text"]}>
						On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.
					</p>
					<p className={classes["editproject__text"]}>
						On the other hand, we denounce with righteous indignation and dislike men  
					</p>
				</div>
			</div>
		}
	</div>
	)
}

export default EditProject