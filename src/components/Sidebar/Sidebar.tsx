import React from "react"
import Bobba from "../icons/Bobba"
import styles from "./Sidebar.module.scss"

const Sidebar = () => (
  <>
    <Bobba />
    <div className={styles.introContainer}>
      <p>I wrangle code for fun & profit.</p>
    </div>
    <div className={styles.linksContainer}>
      <p>Give me a buzz:</p>
      <p className={styles.links}>
        <a href="https://github.com/dennislo">Github</a>
        {", "}
        <a href="https://www.linkedin.com/in/dennis-lo-a3166245/">LinkedIn</a>
        {", "}
        <a href="mailto:dennis@dlo.wtf" target="_blank">
          Email
        </a>
        .
      </p>
    </div>
  </>
)

export default Sidebar
