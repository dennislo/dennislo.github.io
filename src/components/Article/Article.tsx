import React from "react"
import "./normalize.scss"
import "./animation.scss"
import "./main.scss"

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
        I'm Dennis Lo, a software consultant & software engineer making elegant
        and useful things with code. I enjoy working in professional, exciting
        and challenging environments with great people internationally.
      </p>
    </section>
    <section className="clients">
      <header>
        <h1>I've worked in areas:</h1>
      </header>

      <ul>
        <li>
          <a href="https://dlo.wtf">Advertising & Media</a>
        </li>
        <li>
          <a href="https://dlo.wtf">HR & Recruitment</a>
        </li>
        <li>
          <a href="https://dlo.wtf">Retail & Consumer</a>
        </li>
        <li>
          <a href="https://dlo.wtf">Science & Education</a>
        </li>
        <li>
          <a href="https://dlo.wtf">Finance & Banking</a>
        </li>
        <li>
          <a href="https://dlo.wtf">IT & Telecommunications</a>
        </li>
        <li>
          <a href="https://dlo.wtf">Sales & Marketing</a>
        </li>
      </ul>
    </section>
    ¡
    <section className="contact">
      <header className="visuallyhidden">
        <h1>Contact Dennis Lo:</h1>
      </header>

      <ul className="social">
        <li className="github">
          <a href="https://github.com/dennislo" title="Dennis Lo on GitHub">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
              height="20px"
            >
              <rect x="0" fill="none" width="24" height="24" />
              <g>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.84 9.49.5.09.68-.22.68-.485 0-.236-.008-.866-.013-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.07-.607.07-.607 1.004.07 1.532 1.03 1.532 1.03.89 1.53 2.34 1.09 2.91.833.09-.647.348-1.086.634-1.337-2.22-.252-4.555-1.112-4.555-4.944 0-1.09.39-1.984 1.03-2.682-.104-.254-.448-1.27.096-2.646 0 0 .84-.27 2.75 1.025.8-.223 1.654-.333 2.504-.337.85.004 1.705.114 2.504.336 1.91-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.394.1 2.646.64.7 1.026 1.59 1.026 2.682 0 3.84-2.337 4.687-4.565 4.935.36.307.68.917.68 1.852 0 1.335-.013 2.415-.013 2.74 0 .27.18.58.688.482C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </g>
            </svg>

            <span className="visuallyhidden">Dennis Lo on GitHub</span>
          </a>
        </li>
        <li className="mail">
          <a
            href="mailto:dennis@dlo.wtf"
            title="email Dennis Lo via dennis@dlo.wtf"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
              height="20px"
            >
              <rect x="0" fill="none" width="24" height="24" />
              <g>
                <path d="M20 4H4c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 4.236l-8 4.882-8-4.882V6h16v2.236z" />
              </g>
            </svg>

            <span className="visuallyhidden">
              Email Dennis Lo via dennis@dlo.wtf
            </span>
          </a>
        </li>

        <li className="linkedin">
          <a
            href="https://www.linkedin.com/in/dennis-lo-a3166245"
            title="Dennis Lo on LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
              height="20px"
            >
              <rect x="0" fill="none" width="24" height="24" />
              <g>
                <path d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.34 18.338H5.666v-8.59H8.34v8.59zM7.003 8.574c-.857 0-1.55-.694-1.55-1.548 0-.855.692-1.548 1.55-1.548.854 0 1.547.694 1.547 1.548 0 .855-.692 1.548-1.546 1.548zm11.335 9.764h-2.67V14.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.6 1.086-1.6 2.206v4.248h-2.668v-8.59h2.56v1.174h.036c.357-.675 1.228-1.387 2.527-1.387 2.703 0 3.203 1.78 3.203 4.092v4.71z" />
              </g>
            </svg>

            <span className="visuallyhidden">Dennis Lo on LinkedIn</span>
          </a>
        </li>

        <li className="instagram">
          <a
            href="https://www.instagram.com/dlo"
            title="Dennis Lo on Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
              height="20px"
            >
              <rect x="0" fill="none" width="24" height="24" />
              <g>
                <path
                  d="M18.924 10.615h-1.567c.114.443.182.906.182 1.385 0 3.06-2.48 5.54-5.54 5.54-3.058 0-5.537-2.48-5.537-5.54 0-.48.068-.942.182-1.385h-1.57v7.616c0 .383.31.693.694.693h12.46c.383 0 .693-.31.693-.692v-7.615zm0-4.846c0-.383-.31-.693-.693-.693h-2.075c-.382 0-.692.31-.692.692v2.076c0 .382.31.692.692.692h2.076c.384 0 .694-.31.694-.692V5.77zM12 8.537c-1.912 0-3.462 1.55-3.462 3.46 0 1.913 1.55 3.463 3.462 3.463s3.462-1.55 3.462-3.46c0-1.912-1.55-3.462-3.462-3.462M18.924 21H5.076C3.93 21 3 20.07 3 18.922V5.077C3 3.93 3.93 3 5.076 3h13.847C20.07 3 21 3.93 21 5.077v13.846C21 20.07 20.07 21 18.924 21"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </g>
            </svg>

            <span className="visuallyhidden">Dennis Lo on Instagram</span>
          </a>
        </li>
      </ul>
    </section>
    <span className="visuallyhidden">
      Page design credit: Peter W @techieshark
    </span>
  </article>
)

export default Article
