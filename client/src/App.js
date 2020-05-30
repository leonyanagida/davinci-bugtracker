import React, { useMemo, useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation 
} from "react-router-dom";
import UserContext from "./UserContext"
// WEB APP
import WebAppLayout from "./webapp/layout/WebAppLayout"
// WEBSITE
import WebsiteLayout from "./website/layout/WebsiteLayout"

function App() {
	const [authUser, setAuthUser] = useState(null)
	// Auth user contains the user's id, name, and email address
	const value = useMemo(() => ({ authUser, setAuthUser }), [authUser, setAuthUser])
	
	return (
		<div>
			<UserContext.Provider value={value}>
				<Route path="/app/" component={() => <WebAppLayout />} />
				<Route exact path="/" component={() => <WebsiteLayout />} />
			</UserContext.Provider>
		</div>
	)
}

export default App