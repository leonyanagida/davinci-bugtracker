import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom"
import { Button } from "@material-ui/core"
import classes from "./Home.css"
import bugtrackerSampleImg from "../../assets/bugtracker-sample.png"
import bugtrackerTrackBugs from "../../assets/bugtracker-trackbugs.png"
import bugtrackerTeam from "../../assets/bugtracker-team.jpg"
import bugtrackerSupport from "../../assets/bugtracker-support.jpg"
import bugtrackerDownload from "../../assets/bugtracker-download.jpg"
import bugtrackerGetStarted from "../../assets/bugtracker-getstarted.jpg"

const Home = () => {
    return (
        <div className={classes["home"]}>
            <div>
                <div className={classes["home__header"]}>
                    <div className={classes["home__header__text"]}>
                        <h1 className={classes["home__header-title"]}>A Web Based Bug Tracker</h1>
                        <p className={classes["home__header-text"]}>
                            Get everything done through the browser,
                            <br />
                            stay productive with the team from anywhere,
                            <br />
                            without having to downloading software
                        </p>
                        <div className={classes["home__buttons"]}>
                            <Link to={`/app/`} className={classes["home__header-learnmore"]}>
                                <Button className={classes["home__buttons__learnmore"]} variant="contained">
                                    View Demo
                                </Button>          
                            </Link> 

                            <Link to={`/`} className={classes["home__header-contact"]}>
                                <Button className={classes["home__buttons__contact"]} variant="contained">
                                    Contact Us
                                </Button>          
                            </Link>
                        </div>
                    </div>
                    <div className={classes["home__header__img"]}>
                        <img src={bugtrackerSampleImg} className={classes["home__header-img"]} alt="Development Team" />
                    </div>
                </div>
                <div className={classes["home__tagline"]}>
                    <h2 className={classes["home__tagline-title"]}>Stay updated with bugs and issues</h2>
                    <p>
                        Get everything done through the browser, stay productive with the team from anywhere,
                        without having to downloading software
                    </p>
                </div>
                <div className={classes["home__feature-1"]}>
                    <div className={classes["home__feature-1___img"]}>
                        <img className={classes["home__feature-1___img-size"]} src={bugtrackerTrackBugs} alt="Development Team" />
                    </div>
                    <div className={classes["home__feature-1___info"]}>
                        <h3>Track Bugs and Issues</h3>
                        <p>
                            Get everything done through the browser, stay productive with the team from anywhere,
                            without having to downloading software
                        </p>
                        <p className={classes["home__feature-1__explore"]}>Explore Tools</p>
                    </div>
                </div>
                <div className={classes["home__feature-2"]}>
                    <div className={classes["home__feature-2___info"]}>
                        <h3>Lighting Fast Performance</h3>
                        <p>
                            Get everything done through the browser, stay productive with the team from anywhere,
                            without having to downloading software
                        </p>
                        <p>
                            Get everything done through the browser, 
                            <br />
                            stay productive with the team from anywhere,
                            <br />
                            without having to downloading software
                        </p>
                        <p className={classes["home__feature-2__explore"]}>Explore Tools </p>
                    </div>
                    <div className={classes["home__feature-2___img"]}>
                        <img className={classes["home__feature-1___img-size"]} src={bugtrackerTrackBugs} alt="Development Team" />
                    </div>
                </div>
                <div className={classes["home__support"]}>
                    <div className={classes["home__support-item"]}>
                        <img className={classes["home__support-img"]} src={bugtrackerSupport} alt="Development Team" />
                        <h3>Customer Support 24/7</h3>
                        <p>Our agents are ready to answer your questions</p>
                        <p className={classes["home__support-link"]}>Contact Support</p>
                    </div>
                    <div className={classes["home__support-item"]}>
                        <img className={classes["home__support-img"]} src={bugtrackerDownload} alt="Development Team" />
                        <h3>Download Updates Seemlessly</h3>
                        <p>Updates are done behind the scene, so you don’t have to wait. All you have to do is press refresh!</p>
                        <p className={classes["home__support-link"]}>View Latest Updates</p>
                    </div>
                    <div className={classes["home__support-item"]}>
                        <img className={classes["home__support-img"]} src={bugtrackerTeam} alt="Development Team" />
                        <h3>Get Up And Running Fast</h3>
                        <p>Have your teams are ready to go from day one.</p>
                        <p className={classes["home__support-link"]}>View Bug Tracker</p>
                    </div>
                </div>
                <div className={classes["home__getstarted-box"]}>
                    <div className={classes["home__getstarted"]}>
                        <h2 className={classes["home__getstarted-title"]}>Start for free and upgrade anytime</h2>
                        <p>
                            Get everything done through the browser, stay productive with the team from anywhere,
                            without having to downloading software
                        </p>
                        <p className={classes["home__getstarted-link"]}>Explore Tools To Start Bug Tracking</p>
                        <img className={classes["home__getstarted-img"]} src={bugtrackerGetStarted} alt="Development Team" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home