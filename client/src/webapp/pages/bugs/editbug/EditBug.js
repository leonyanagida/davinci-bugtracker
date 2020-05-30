/* eslint-disable no-use-before-define */
import React, { useContext, useEffect, useState, useRef } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
	Link,
	Redirect,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import moment from "moment"
import UserContext from "../../../../UserContext"
import axios from "axios"
import { Editor } from "@tinymce/tinymce-react"
import { makeStyles } from "@material-ui/core/styles"
import { Checkbox, FormControl, Button, TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import AlertDialog from "../../../common/alert/AlertDialog"
import AlertDeleteBug from "../../../common/alert/AlertDeleteBug"
import classes from "./EditBug.css"

// Let"s keep the api a secret
const TINYAPI_URL = process.env.REACT_APP_CLIENT_TINYAPI

// Material UI styles
const useStyles = makeStyles((theme) => ({
	formControl: {
	//   margin: theme.spacing(1),
		marginBottom: "8px",
		marginTop: "8px",
		  minWidth: 320,
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

const Edit = () => {
    let match = useRouteMatch()
	const { bugid } = match.params
    const { authUser, setAuthUser } = useContext(UserContext)
	const alertDialogRef = useRef()
	const alertDeleteBugRef = useRef()
	const inlineclasses = useStyles()
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [openModal, setOpenModal] = useState(false)
	const [assignedTo, setAssignedTo] = useState()
	const [bugError, setBugError] = useState()
	const [dueDate, setDueDate] = useState()
	const [language, setLanguage] = useState("")
	const [description, setDescription] = useState() 
	const [priority, setPriority] = useState("")
	const [projectName, setProjectName] = useState()
	const [title, setTitle] = useState()
	const [assignedToFilter, setAssignedToFilter] = useState()
	const [btnPressed, setBtnPressed] = useState(false)
	const [getProjectList, setGetProjectList] = useState([])
	const [projectList, setProjectList] = useState()
	const [getPeopleList, setGetPeopleList] = useState([])
	const [peopleList, setPeopleList] = useState()
	const [defaultAssignedTo, setDefaultAssignedTo] = useState([])
	const [isBugGone, setIsBugGone] = useState(false)
	const [deleteSubmitData, setDeleteSubmitData] = useState()

	const editBugPriority = [
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

		axios
			.get("/app/projects/")
			.then(res => {
				// Create an object for each project
				// Ex: [{name: "My Project Name"}, {name: "Another Project Name"}]
				let arr = res.data.map(obj => (
					{
						projectname: obj.projectname,
					}
				))
				setProjectList(arr)
			})
            .catch(err => {
				setLoading(false)
                if (err.response.status == 401 || err.response.status == 500) {
                    alert("You have been signed out...")
                    window.location.href="/app"
                }
            })

		// Fetch the bug
		axios
			.get(`/app/bugs/${bugid}`)
			.then(res => {
				setData(res.data)
			})
			.catch(() => {
				setIsBugGone(true)
				setTimeout(() => {
					setLoading(false)
				}, 500)
			})
	}, [])

	useEffect(() => {
		if (projectList && data) {

			// ======= Needed to assign default values to the <Autocomplete defaultValue={} />
			let assignedUsers = data["bug"].assignedto
			let peopleListArr = []
			if (assignedUsers) {
				assignedUsers.map(a => {
					let peopleListObj = {
						name: a
					}
					peopleListArr.push(peopleListObj)
				})
			}
			setDefaultAssignedTo(peopleListArr)
			// ======= Needed to assign default values to the <Autocomplete defaultValue={} />

			// Assign the rest of the default values
			setProjectName(data["bug"].projectname)
			setTitle(data["bug"].title)
			setBugError(data["bug"].bugtype)
			setPriority(data["bug"].priority)
			setLanguage(data["bug"].language)
			setDueDate(moment(data["bug"].duedate).format("YYYY-MM-DD"))
			setAssignedTo(data["bug"].assignedto)
			setDescription(data["bug"].description)
			// Set the delete data if the user wants to delete the bug
			let submit = {
				"assignedproject": data["bug"].projectname,
				"assignedto": data["bug"].assignedto,
				"submitter": data["bug"].submitter
			}
			setDeleteSubmitData(submit)
			setLoading(false)
		}
	}, [projectList, data])

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

	const handleGetPeopleList = () => {
		// Use this to set the default values for the => <Autocomplete defaultValue={defaultAssignedTo} ... />
		axios
			.get("/app/users")
			.then(res => {
				setGetPeopleList(res.data)
			})
			.catch(() => {
				setLoading(false)
			})
	}

	const handleGetProjectList = () => {
		axios
			.get("/app/projects")
			.then(res => {
				setGetProjectList(res.data)
			})
			.catch(() => {
				setLoading(false)
			})
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
		setDescription(content)
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
		setProjectName(v.projectname)
	}


	const handleButtonSubmit = async () => {
		setBtnPressed(true)

		const submit = {
			"assignedto": assignedTo,
			"bugtype": bugError,
			"bugstatus": "Open",
			"description": description,
			"duedate": dueDate,
			"language": language,
			// The original submitter should NOT be changed
			"submitter": data["bug"].submitter,
			"title": title,
			"priority": priority,
			"projectname": projectName
		}

		await axios
			.post(`/app/bugs/update/${bugid}`, submit)
			.then(() => {
				setTimeout(() => {
					window.location.href = `/app/bugs/${bugid}`
				}, 1000)
			})
			.catch(() => {
				setBtnPressed(false)
			})
	}

	return (
		<div>
			{
				isBugGone ?
				<h2>Oh no bug not found!</h2>
				:
				<div className={classes["editbug-container"]}>
					<form className={classes["editbug-form"]}>
						<div className={classes["editbug-title-button"]}>
							<h1 className={classes["editbug-title"]}>Edit/Update Bug</h1>
							<Button 
								className={classes["editbug-delete-button"]}
								variant="contained" 
								color="secondary"
								onClick={() => alertDeleteBugRef.current.handleOpen()}
							>
								Delete Bug
							</Button>
							<AlertDeleteBug ref={alertDeleteBugRef} alertbugid={bugid} submitdata={deleteSubmitData} />
						</div>
						{
							loading ?
							<div>Loading....</div>
							:
							<div>
								<div>
									<FormControl className={[inlineclasses.formControl, classes["editbug__project"]].join(" ")}>
										<Autocomplete
											defaultValue={{projectname: data["bug"].projectname}}
											loading={loading}
											onChange={(e,v) => handleProjectNameChange(v)}
											id="checkboxes-project"
											options={projectList}
											getOptionLabel={(option) => option.projectname}
											renderInput={(params) => <TextField {...params} label="Project" variant="outlined" />}
										/>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["editbug__title"]].join(" ")}>
										<TextField
											defaultValue={data["bug"].title}
											onChange={handleTitleChange}
											id="outlined-input"
											label="Title"
											variant="outlined"
										/>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["editbug__bugerror"]].join(" ")}>
										<TextField
											defaultValue={data["bug"].bugtype}
											onChange={handleBugErrorChange}
											id="outlined-read-only-input"
											label="Bug Error Line"
											helperText="Include the error shown to you"
											variant="outlined"
										/>
									</FormControl>
								</div>
								<div>
									<FormControl className={[inlineclasses.formControl, classes["editbug__language"]].join(" ")} variant="outlined">
										<TextField
											defaultValue={data["bug"].language}
											onChange={handleLanguageChange}
											id="outlined-select-currency-native"
											label="Programming Language"
											variant="outlined"
										/>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["editbug__priority"]].join(" ")} variant="outlined">
										<TextField
											id="outlined-select-priority-native"
											label="Bug Priority"
											onChange={handlePriorityChange}
											select
											SelectProps={{
												native: true,
											}}
											defaultValue={data["bug"].priority}
											variant="outlined"
										>
											{editBugPriority.map((option) => {
												return (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												)
											})}
										</TextField>
									</FormControl>
									<FormControl className={[inlineclasses.formControl, classes["editbug__duedate"]].join(" ")} variant="outlined">
										<TextField
											defaultValue={dueDate}
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
									<FormControl className={[inlineclasses.formControl, classes["editbug__assignedto"]].join(" ")}>
										<Autocomplete
											defaultValue={defaultAssignedTo}
											// value={data["bug"].assignedto}
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
												<TextField {...params} variant="outlined" label="Assigned To" placeholder="Search or Select Person(s)" />
											)}
										/>
									</FormControl>
								</div>
								<div className={classes["editbug-editor"]}>
									<Editor
										initialValue={"..."}
										value={data["bug"].description}
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
									className={classes["editbug-submit"]}
									disabled={btnPressed}
									onClick={handleButtonSubmit} 
									variant="contained" 
									color="primary"
								>
									Submit
								</Button>
								<Button 
									className={classes["editbug-cancel"]}
									variant="contained"
									onClick={() => alertDialogRef.current.handleOpen()}
								>
									Cancel
								</Button>
								<AlertDialog ref={alertDialogRef} alertbugid={bugid} />
							</div>				
						}
					</form>
					<div className={classes["editbug-guidelines"]}>
						<h4>Guidelines:</h4>
						<p className={classes["editbug__text"]}>
							On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.
						</p>
						<p className={classes["editbug__text"]}>
							On the other hand, we denounce with righteous indignation and dislike men  
						</p>
					</div>
				</div>
			}

			
		</div>
	)
}

export default Edit