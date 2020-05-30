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
import { Button, Checkbox, Collapse, FormControl, IconButton, TextField } from "@material-ui/core"
import { Alert, Autocomplete } from "@material-ui/lab"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CloseIcon from "@material-ui/icons/Close"
import UserContext from "../../../../UserContext"
import AlertDialog from "../../../common/alert/AlertDialog"
import classes from "./NewBug.css"

// Let"s keep the api a secret
const TINYAPI_URL = process.env.REACT_APP_CLIENT_TINYAPI

// Material UI styles
const useStyles = makeStyles((theme) => ({
	formControl: {
	//   margin: theme.spacing(1),
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const NewBug = () => {
	const alertDialogRef = useRef()
	const inlineclasses = useStyles()
	const { authUser, setAuthUser } = useContext(UserContext)

	const [loading, setLoading] = useState(true)
	const [getProjectList, setGetProjectList] = useState([])
	const [projectList, setProjectList] = useState()
	const [getPeopleList, setGetPeopleList] = useState([])
	const [peopleList, setPeopleList] = useState()
	const [assignedTo, setAssignedTo] = useState([])
	const [bugError, setBugError] = useState()
	const [dueDate, setDueDate] = useState()
	const [language, setLanguage] = useState("")
	const [note, setNote] = useState() 
	const [priority, setPriority] = useState("")
	const [project, setProject] = useState()
	const [title, setTitle] = useState()
	const [btnPressed, setBtnPressed] = useState(false)
	const [submitError, setSubmitError] = useState(false)
	const [open, setOpen] = useState(true);

	const newbugPriority = [
		{
			value: "",
			label: ""
		},
		{
			value: "Low",
			label: "Low"
		},
		{
			value: "Medium",
			label: "Medium"
		},
		{
			value: "High",
			label: "High"
		},
	]

	useEffect(() => {
		if (!projectList) {
			handleGetProjectList()
			handleGetPeopleList()
		}
	}, [])

	useEffect(() => {
        // Once we get the projects from the database, we will
        // make a concise version of the project object.
        // We will use this instead of the raw data from the database
        let projectListArr = []

        if (getProjectList) {
            getProjectList.map(a => {
                let projectListObj = {
					projectname: a.projectname
                }
                projectListArr.push(projectListObj)
            })
        }
		return setProjectList(projectListArr)
	}, [getProjectList])
	
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
		return setPeopleList(peopleListArr)
    }, [getPeopleList])

	useEffect(() => {
		if (peopleList && projectList) {
			setLoading(false)
		}
	}, [peopleList, projectList])

	const handleGetProjectList = () => {
		axios
			.get("/app/projects")
			.then(res => {
				setGetProjectList(res.data)
			})
            .catch(err => {
				setLoading(false)
                if (err.response.status == 401 || err.response.status == 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })
	}

	const handleGetPeopleList = () => {
		axios
			.get("/app/users")
			.then(res => {
				setGetPeopleList(res.data)
			})
            .catch(() => setLoading(false))
	}

	const handleAssignedToChange = (v) => {
		let result = v.map(a => a.name)
		setAssignedTo([...result])
	}

	const handleBugErrorChange = (event) => {
		if (!event.target.value) return
		setBugError(event.target.value)
	}

	const handleDueDateChange = (event) => {
		if (!event.target.value) return
		setDueDate(event.target.value)
	}

	const handleEditorChange = (content, editor) => {
		setBtnPressed(false)
		setNote(content)
	}

	const handleLanguageChange = (event) => {
		if (!event.target.value) return
		setLanguage(event.target.value)
	}

	const handlePriorityChange = (event) => {
		if (!event.target.value) return
		setPriority(event.target.value)
	}

	const handleTitleChange = (event) => {
		if (!event.target.value) return
		setTitle(event.target.value)
	}

	const handleProjectNameChange = (v) => {
		if (!v) return 
		setProject(v.projectname)
	}


	const handleButtonSubmit = async () => {
		setBtnPressed(true)

		// Do not let the user submit without writing a description
		if (!bugError || !note || !dueDate || !language || !title || !priority || !project) return setBtnPressed(false)

		const submit = {
			"assignedto": assignedTo,
			"bugtype": bugError,
			"bugstatus": "Open",
			"description": note,
			"duedate": dueDate,
			"language": language,
			"submitter": authUser.name,
			"title": title,
			"priority": priority,
			"projectname": project
		}

		await axios
			.post(`/app/bugs/add`, submit)
			.then((res) => {
				setTimeout(() => {
					window.location.href = `/app/bugs/${res.data.id}`
				}, 3000)
			})
			.catch(() => {
				setBtnPressed(false)
				setSubmitError(true)
			})
	}

	return (
			<div>
				{
					loading ? 
					<div>Loading...</div>
					:
					<div className={classes["newbug-container"]}>
						<form className={classes["newbug-form"]}>
							<h1 className={classes["newbug-form__title"]}>Add New Bug</h1>
							<div>
								<div>
									<FormControl className={[inlineclasses.formControl, classes["newbug__project"]].join(" ")}>
										<Autocomplete
											required 
											onChange={(e,v) => handleProjectNameChange(v)}
											id="checkboxes-project"
											options={projectList}
											getOptionLabel={(option) => option.projectname}
											renderInput={(params) => <TextField {...params} required label="Project" variant="outlined" />}
										/>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["newbug__title"]].join(" ")}>
										<TextField
											required 
											onChange={handleTitleChange}
											id="outlined-input"
											label="Title"
											variant="outlined"
										/>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["newbug__bugerror"]].join(" ")}>
										<TextField
											required 
											onChange={handleBugErrorChange}
											id="outlined-read-only-input"
											label="Bug Error Line"
											variant="outlined"
										/>
									</FormControl>
								</div>
								<div>
									<FormControl className={[inlineclasses.formControl, classes["newbug__language"]].join(" ")} variant="outlined">
										<TextField
											required
											// value={language}
											onChange={handleLanguageChange}
											id="outlined-select-currency-native"
											label="Programming Language"
											variant="outlined"
										/>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["newbug__priority"]].join(" ")} variant="outlined">
										<TextField
											required
											id="outlined-select-priority-native"
											label="Bug Priority"
											onChange={handlePriorityChange}
											select
											SelectProps={{
												native: true,
											}}
											value={priority}
											variant="outlined"
										>
											{newbugPriority.map((option) => {
												return (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												)
											})}
										</TextField>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["newbug__duedate"]].join(" ")} variant="outlined">
										<TextField
											required
											onChange={handleDueDateChange}
											className={classes.textField}
											label="Due Date"
											id="outlined-date-duedate"
											InputLabelProps={{
												shrink: true,
											}}
											type="date"
											variant="outlined"
										/>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["newbug__assignedto"]].join(" ")}>
										<Autocomplete
											onChange={(e, v) => handleAssignedToChange(v)}
											multiple
											id="checkboxes-assignedto"
											options={peopleList}
											disableCloseOnSelect
											getOptionLabel={(option) => option.name}
											renderOption={(option, { selected }) => (
												<React.Fragment>
													<Checkbox
														icon={icon}
														checkedIcon={checkedIcon}
														style={{ marginRight: 8 }}
														checked={selected}
													/>
													{option.name}
												</React.Fragment>
											)}
											renderInput={(params) => (
												<TextField {...params} variant="outlined" label="Assigned To (Optional)" placeholder="(Optional) Search or Select Person(s) " />
											)}
										/>
									</FormControl>
								</div>
							</div>
							<div className={classes["newbug-editor"]}>
								<Editor
									required
									apiKey={TINYAPI_URL}
									initialValue="<p>This is the initial content of the editor</p>"
									init={{
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
								className={classes["newbug-submit"]}
								disabled={btnPressed}
								onClick={handleButtonSubmit} 
								variant="contained" 
								color="primary"
							>
								Submit
							</Button>
							<Button 
								className={classes["newbug-cancel"]}
								variant="contained"
								onClick={() => alertDialogRef.current.handleOpen()}
							>
								Cancel
							</Button>
							<AlertDialog ref={alertDialogRef} alertbugid={null}/> 
							<br />
							<br />
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
						<div className={classes["newbug-guidelines"]}>
							<h4>Guidelines:</h4>
							<p className={classes["newbug__text"]}>
								On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.
							</p>
							<p className={classes["newbug__text"]}>
								On the other hand, we denounce with righteous indignation and dislike men  
							</p>
						</div>
					</div>
				}
		</div>
	)
}

export default NewBug