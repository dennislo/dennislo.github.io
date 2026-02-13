import React from "react"
import "./animation.css"
import "./main.css"

import Clients from "./Clients"
import Contact from "./Contact"
import More from "./More"

const Article = () => (
  <article className="cv">
    <section className="question intro">
      <p>Who is DLO?</p>
    </section>
    <header>
      <h1 className="hello">hello</h1>
    </header>
    <section className="intro">
      <p>
        I&apos;m Dennis Lo, an IT consultant and software engineer who crafts
        robust, scalable solutions that solve real problems. I have deep expertise
        across the full stack, I thrive in fast-paced, collaborative
        environments and have a proven track record of delivering high-impact
        projects for clients both locally and internationally.
      </p>
    </section>
    <section className="intro">
      <h2>Agile IT & Software Limited</h2>
      <p>
        We deliver enterprise-grade IT consultancy and software engineering
        services, with specialized expertise in JavaScript, C#, Java, and
        Bash/Shell. Our proven experience spans diverse industries and complex
        technical challenges, from system architecture and full-stack development
        to DevOps automation and legacy system modernization.{" "}
        <a
          href="mailto:dennis@dlo.wtf"
          title="email Dennis Lo via dennis@dlo.wtf"
        >
          Please contact us for further information about our services.
        </a>
      </p>
    </section>

    <Clients />
    <More />
    <Contact />
    <span className="visuallyhidden">
      Page design credit: Peter W @techieshark
    </span>
  </article>
)

export default Article
