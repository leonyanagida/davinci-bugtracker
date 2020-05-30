import React from "react"
import classes from "./Footer.css"

const Footer = () => {
    return (
        <div className={classes["footer"]}>
            <div className={classes["footer-box"]}>
                <h1>Da Vinci</h1>
                <div>
                    <h4>Product</h4>
                    <ul>
                        <li>Features</li>
                        <li>Enterprise</li>
                        <li>Testimonials</li>
                        <li>Pricing</li>
                        <li>Live Demo</li>
                    </ul>
                </div>
                <div>
                    <h4>Contact</h4>
                    <ul>
                        <li>Customer Support</li>
                        <li>Fourms</li>
                        <li>App Developers</li>
                    </ul>
                </div>
                <div>
                    <h4>Policies</h4>
                    <ul>
                        <li>Terms of Service</li>
                        <li>Privacy Policy</li>
                        <li>Cookies Policy</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer