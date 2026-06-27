// en-GB is the canonical dictionary. Every key here must appear in all other locales.
// Locale-invariant data (URLs, emails, social hrefs, dateRanges, accentColor, raw skill names
// that stay in English) lives in src/config.ts — not here.

export const enGB = {
  nav: {
    primaryAriaLabel: "Primary",
    mobileMenuAriaLabel: "Mobile primary menu",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    menu: "Menu",
    about: "About",
    projects: "Projects",
    activity: "Activity",
    experience: "Experience",
    education: "Education",
    gists: "Gists",
    contact: "Contact",
  },
  languageSwitcher: {
    ariaLabel: "Select language",
  },
  hero: {
    greeting: "Hello!",
    intro: "I'm",
    contactAriaLabel: "Contact Dennis Lo",
    githubAriaLabel: "Dennis Lo on GitHub",
    linkedinAriaLabel: "Dennis Lo on LinkedIn",
    instagramAriaLabel: "Dennis Lo on Instagram",
  },
  about: {
    heading: "About Me",
    agileITHeading: "Agile IT & Software Limited",
    agileITContactLink:
      "Please contact us for further information about our services.",
    skillsHeading: "Technologies & Skills",
    clientsHeading: "I've worked with clients from:",
    funFactsHeading: "Fun facts:",
    aboutMe:
      "I'm Dennis Lo, an IT consultant and software engineer who crafts robust, scalable solutions that solve real problems. I have deep expertise across the full stack, I thrive in fast-paced, collaborative environments and have a proven track record of delivering high-impact projects for clients both locally and internationally.",
    agileIT:
      "We deliver enterprise-grade IT consultancy and software engineering services, with specialised expertise in JavaScript, C#, Java, and Bash/Shell. Our proven experience spans diverse industries and complex technical challenges, from system architecture and full-stack development to DevOps automation and legacy system modernisation.",
    clients: {
      advertisingMedia: "Advertising & Media",
      hrRecruitment: "HR & Recruitment",
      retailConsumer: "Retail & Consumer",
      scienceEducation: "Science & Education",
      financeBanking: "Finance & Banking",
      itTelecommunications: "IT & Telecommunications",
    },
    funFacts: {
      fact1: "Learning Software Delivery with AI",
      fact2: "Ask me about Entrepreneurship & Web Development",
      fact3: "Enjoys Cooking, Snowboarding & Bike Riding",
    },
  },
  projects: {
    heading: "Projects",
    viewProjectAria: "View {name}",
    aiDevRoundupName: "AI Dev Roundup Newsletter",
    aiDevRoundupDescription:
      "One concise email. Five minutes. Every Tuesday. Essential AI news & trends, production-ready libraries, and developer tools curated for engineers.",
    chromeExtensionMasteryName: "Chrome Extension Mastery",
    chromeExtensionMasteryDescription:
      "A comprehensive course covering full-stack Chrome extension development from fundamentals to publishing on the Chrome Web Store.",
    extensionKitName: "ExtensionKit",
    extensionKitDescription:
      "A starter template kit for Chrome extensions with TypeScript, React, and Vite — get from zero to published in minutes.",
  },
  experience: {
    heading: "Experience",
    roleContractor: "Software Engineer (Contractor)",
    roleSenior: "Senior Software Engineer",
    crosstideBullet1:
      "Architected and led the Marks & Spencer web platform monorepo, now used by 200+ engineers",
    crosstideBullet2:
      "Replatformed the basket and checkout application processing millions of orders daily",
    crosstideBullet3:
      "Championed test-driven development, decision logs, and thorough code reviews across the team",
    pretBullet1:
      "Enhanced high-volume subscription transactions with Chargebee, Commerce Tools, and Adyen",
    pretBullet2:
      "Spearheaded engineering practices through full remote pair programming and increased test coverage",
    natwestBullet1:
      "Developed a greenfield HR platform from scratch using React, Redux, and Node",
    natwestBullet2:
      "Collaborated across NLP, legal, insurance, and HR disciplines to deliver NatWest Mentor",
    bcgBullet1:
      "Built a real-time data visualisation platform for an IoT startup (MachineMax)",
    bcgBullet2:
      "Collaborated with hardware, data science, and ML teams to deliver production-grade dashboards",
    elsevierBullet1:
      "Developed journal home pages for ScienceDirect, serving publications like Cell and The Lancet",
    elsevierBullet2:
      "Designed and built a shared UI library to accelerate cross-team frontend development",
    starcountBullet1:
      "Built the Vibe web app aggregating social media content from Facebook, Twitter, Instagram, and YouTube",
    starcountBullet2:
      "Architected embeddable web components for third-party integration across web and mobile",
    starcountBullet3:
      "Designed an enterprise analytics platform with scalable PDF report generation",
  },
  education: {
    heading: "Education",
    degree: "Bachelor of Engineering (B.Eng.), Computer Software Engineering",
    school: "UNSW",
    achievement1: "Honours Class 1",
    achievement2:
      "Honours Thesis: Service Oriented Architecture for e-Business Standards",
  },
  githubActivity: {
    heading: "Activity",
    loadingAria: "Loading GitHub activity",
    listAria: "Recent GitHub activity",
    errorText: "Couldn't load recent activity.",
    errorLinkText: "View on GitHub",
    noActivityText: "No recent public activity.",
    viewAllLink: "View all activity on GitHub →",
  },
  themeToggle: {
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
  },
  footer: {
    emailAria: "Contact Dennis Lo",
    githubAria: "Dennis Lo on GitHub",
    linkedinAria: "Dennis Lo on LinkedIn",
    instagramAria: "Dennis Lo on Instagram",
    builtWith: "Built with",
    using: "using",
    contact: "Contact",
  },
  contact: {
    pageTitle: "Contact Me",
    backLink: "Back",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    mobileLabel: "Mobile Number",
    emailLabel: "Email Address",
    messageLabel: "Message",
    messageHint:
      "If you would like to work with me please include information about the budget, timeline, project type.",
    submitButton: "Send Message",
    submittingButton: "Sending...",
    successMessage: "Thank you for your message! I'll get back to you soon.",
    successBackLink: "Back to homepage",
    serverErrorMessage:
      "There was a problem sending your message. Please try again.",
    validationRequired: "This field is required.",
    validationMaxLength: "Must be 50 characters or fewer.",
    validationMobileRequired: "Mobile number is required.",
    validationMobileInvalid:
      "Enter a valid phone number (e.g. +61 400 123 456).",
    validationEmailRequired: "Email address is required.",
    validationEmailInvalid: "Enter a valid email address.",
    validationMessageRequired: "Message is required.",
    validationMessageMin: "Message must be at least 10 characters.",
    validationMessageMax: "Message must be 500 characters or fewer.",
  },
  notFound: {
    title: "404",
    heading: "Page not found",
    body: "Sorry, we couldn't find what you were looking for.",
    goHomeButton: "Go home",
  },
  seo: {
    siteTitle: "Dennis Lo — IT Consultant & Software Engineer",
    description:
      "Personal website of Dennis Lo, IT consultant and software engineer.",
    contactPageTitle: "Contact — DLO",
    contactPageDescription: "Send a message to Dennis Lo",
    notFoundTitle: "Not found",
    ogTitle: "Dennis Lo — IT Consultant & Software Engineer",
    ogDescription:
      "Personal website of Dennis Lo, IT consultant and software engineer.",
    twitterTitle: "Dennis Lo — IT Consultant & Software Engineer",
    twitterDescription:
      "Personal website of Dennis Lo, IT consultant and software engineer.",
    jsonLdJobTitle: "IT Consultant & Software Engineer",
    jsonLdDescription:
      "Personal website of Dennis Lo, IT consultant and software engineer.",
  },
};
