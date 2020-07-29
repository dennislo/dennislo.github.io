import React from "react"
import "./normalize.scss"
import "./animation.scss"
import "./main.scss"

import Clients from "./Clients"
import Contact from "./Contact"
import More from "./More"

const Article = () => (
  <article className="cv">
    <section className="question intro">
      <p>Who the f*** is DLO?</p>
    </section>
    <header>
      <h1 className="hello">hello</h1>
    </header>
    <section className="intro">
      <p>
        I'm Dennis Lo, a IT consultant & software engineer making elegant and
        useful things with code. I enjoy working in professional, exciting and
        challenging environments with great people locally or internationally.
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
