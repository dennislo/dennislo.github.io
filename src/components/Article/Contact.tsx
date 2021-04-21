import React from "react"
import Github from "../icons/Github"
import Email from "../icons/Email"
import Linkedin from "../icons/Linkedin"
import Instagram from "../icons/Instagram"

const Contact = () => (
  <section className="contact">
    <header className="visuallyhidden">
      <h1>Contact Dennis Lo:</h1>
    </header>

    <ul className="social">
      <li className="github">
        <a href="https://github.com/dennislo" title="Dennis Lo on GitHub">
          <Github />
          <span className="visuallyhidden">Dennis Lo on GitHub</span>
        </a>
      </li>
      <li className="mail">
        <a
          href="mailto:dennis@dlo.wtf"
          title="email Dennis Lo via dennis@dlo.wtf"
        >
          <Email />
          <span className="visuallyhidden">
            Email Dennis Lo via dennis@dlo.wtf
          </span>
        </a>
      </li>

      <li className="linkedin">
        <a
          href="https://www.linkedin.com/in/dennis-lo-profile"
          title="Dennis Lo on LinkedIn"
        >
          <Linkedin />
          <span className="visuallyhidden">Dennis Lo on LinkedIn</span>
        </a>
      </li>

      <li className="instagram">
        <a href="https://www.instagram.com/dlo" title="Dennis Lo on Instagram">
          <Instagram />
          <span className="visuallyhidden">Dennis Lo on Instagram</span>
        </a>
      </li>
    </ul>
  </section>
)

export default Contact
