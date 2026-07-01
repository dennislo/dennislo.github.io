import type { TranslationDictionary } from "../types";

// Spanish (Spain conventions).
// Proper nouns, brand names, company names, programming languages, and tech product names
// are kept in their original English form.
export const esES: TranslationDictionary = {
  nav: {
    primaryAriaLabel: "Principal",
    mobileMenuAriaLabel: "Menú principal móvil",
    openMenu: "Abrir menú de navegación",
    closeMenu: "Cerrar menú de navegación",
    menu: "Menú",
    about: "Sobre mí",
    projects: "Proyectos",
    activity: "Actividad",
    experience: "Experiencia",
    education: "Formación",
    gists: "Gists",
    contact: "Contacto",
    meet: "Reunión",
  },
  languageSwitcher: {
    ariaLabel: "Seleccionar idioma",
  },
  hero: {
    greeting: "¡Hola!",
    intro: "Soy",
    role: "Consultor de TI e Ingeniero de Software",
    contactAriaLabel: "Contactar con Dennis Lo",
    meetAriaLabel: "Reservar una reunión con Dennis Lo",
    githubAriaLabel: "Dennis Lo en GitHub",
    linkedinAriaLabel: "Dennis Lo en LinkedIn",
    instagramAriaLabel: "Dennis Lo en Instagram",
  },
  about: {
    heading: "Sobre mí",
    agileITHeading: "Agile IT & Software Limited",
    agileITContactLink:
      "Ponte en contacto con nosotros para más información sobre nuestros servicios.",
    skillsHeading: "Tecnologías y habilidades",
    clientsHeading: "He trabajado con clientes de:",
    funFactsHeading: "Datos curiosos:",
    aboutMe:
      "Soy Dennis Lo, consultor de TI e ingeniero de software especializado en crear soluciones robustas y escalables que resuelven problemas reales. Cuento con una sólida experiencia en todo el stack, me desenvuelvo con soltura en entornos colaborativos de ritmo acelerado y tengo un historial probado de entrega de proyectos de alto impacto para clientes tanto locales como internacionales.",
    agileIT:
      "Ofrecemos servicios de consultoría de TI e ingeniería de software de nivel empresarial, con experiencia especializada en JavaScript, C#, Java y Bash/Shell. Nuestra amplia experiencia abarca diversos sectores y desafíos técnicos complejos, desde la arquitectura de sistemas y el desarrollo full-stack hasta la automatización de DevOps y la modernización de sistemas heredados.",
    clients: {
      advertisingMedia: "Publicidad y medios",
      hrRecruitment: "RR. HH. y selección de personal",
      retailConsumer: "Retail y consumo",
      scienceEducation: "Ciencia y educación",
      financeBanking: "Finanzas y banca",
      itTelecommunications: "TI y telecomunicaciones",
    },
    funFacts: {
      fact1: "Aprendiendo sobre desarrollo de software con IA",
      fact2: "Pregúntame sobre emprendimiento y desarrollo web",
      fact3: "Disfruta cocinar, hacer snowboard y montar en bici",
    },
  },
  projects: {
    heading: "Proyectos",
    viewProjectAria: "Ver {name}",
    aiDevRoundupName: "AI Dev Roundup Newsletter",
    aiDevRoundupDescription:
      "Un correo conciso. Cinco minutos. Cada martes. Noticias y tendencias esenciales de IA, librerías listas para producción y herramientas para desarrolladores, seleccionadas para ingenieros.",
    chromeExtensionMasteryName: "Chrome Extension Mastery",
    chromeExtensionMasteryDescription:
      "Un curso completo que abarca el desarrollo full-stack de extensiones de Chrome, desde los fundamentos hasta la publicación en la Chrome Web Store.",
    extensionKitName: "ExtensionKit",
    extensionKitDescription:
      "Un kit de plantilla inicial para extensiones de Chrome con TypeScript, React y Vite: pasa de cero a publicado en minutos.",
  },
  experience: {
    heading: "Experiencia",
    roleContractor: "Ingeniero de Software (Contratista)",
    roleSenior: "Ingeniero de Software Senior",
    crosstideBullet1:
      "Diseñé y lideré el monorepo de la plataforma web de Marks & Spencer, ahora utilizado por más de 200 ingenieros",
    crosstideBullet2:
      "Rediseñé la aplicación de cesta y pago que procesa millones de pedidos al día",
    crosstideBullet3:
      "Impulsé el desarrollo guiado por pruebas, los registros de decisiones y revisiones de código exhaustivas en todo el equipo",
    pretBullet1:
      "Mejoré transacciones de suscripción de alto volumen con Chargebee, Commerce Tools y Adyen",
    pretBullet2:
      "Impulsé prácticas de ingeniería mediante programación en pareja totalmente remota, aumentando la cobertura de pruebas",
    natwestBullet1:
      "Desarrollé desde cero una plataforma de RR. HH. utilizando React, Redux y Node",
    natwestBullet2:
      "Colaboré entre disciplinas de PLN, legal, seguros y RR. HH. para entregar NatWest Mentor",
    bcgBullet1:
      "Construí una plataforma de visualización de datos en tiempo real para una startup de IoT (MachineMax)",
    bcgBullet2:
      "Colaboré con equipos de hardware, ciencia de datos y ML para entregar paneles de nivel producción",
    elsevierBullet1:
      "Desarrollé páginas de inicio de revistas para ScienceDirect, dando servicio a publicaciones como Cell y The Lancet",
    elsevierBullet2:
      "Diseñé y construí una librería de componentes de interfaz compartida para acelerar el desarrollo frontend entre equipos",
    starcountBullet1:
      "Construí la aplicación web Vibe, que agrega contenido de redes sociales de Facebook, Twitter, Instagram y YouTube",
    starcountBullet2:
      "Diseñé componentes web integrables para integraciones de terceros en web y móvil",
    starcountBullet3:
      "Diseñé una plataforma de análisis empresarial con generación escalable de informes en PDF",
  },
  education: {
    heading: "Formación",
    degree: "Grado en Ingeniería (B.Eng.), Ingeniería de Software Informático",
    achievement1: "Matrícula de honor (primera clase)",
    achievement2:
      "Tesis de honor: Arquitectura orientada a servicios para estándares de e-Business",
  },
  githubActivity: {
    heading: "Actividad",
    loadingAria: "Cargando actividad de GitHub",
    listAria: "Actividad reciente de GitHub",
    errorText: "No se pudo cargar la actividad reciente.",
    errorLinkText: "Ver en GitHub",
    noActivityText: "Sin actividad pública reciente.",
    viewAllLink: "Ver toda la actividad en GitHub →",
    relativeTime: {
      justNow: "justo ahora",
      minuteSingular: "hace {count} minuto",
      minutePlural: "hace {count} minutos",
      hourSingular: "hace {count} hora",
      hourPlural: "hace {count} horas",
      daySingular: "hace {count} día",
      dayPlural: "hace {count} días",
    },
    events: {
      push: "Envió {count} {commitLabel} a {ref}",
      commitSingular: "commit",
      commitPlural: "commits",
      pullRequest: "{verb} PR #{number}: {title}",
      issue: "{verb} issue #{number}: {title}",
      create: "Creó {refType}{ref}",
      watch: "Marcó con estrella",
      fork: "Bifurcó",
      default: "Actividad",
    },
    actions: {
      opened: "Abrió",
      closed: "Cerró",
      merged: "Fusionó",
      reopened: "Reabrió",
      updated: "Actualizó",
    },
    refTypes: {
      branch: "rama",
      tag: "etiqueta",
      repository: "repositorio",
    },
  },
  themeToggle: {
    switchToDark: "Cambiar a modo oscuro",
    switchToLight: "Cambiar a modo claro",
  },
  footer: {
    emailAria: "Contactar con Dennis Lo",
    meetAria: "Reservar una reunión con Dennis Lo",
    githubAria: "Dennis Lo en GitHub",
    linkedinAria: "Dennis Lo en LinkedIn",
    instagramAria: "Dennis Lo en Instagram",
    builtWith: "Creado con",
    using: "usando",
    contact: "Contacto",
    meet: "Reunión",
  },
  meet: {
    loading: "Cargando horarios disponibles",
    unavailable: "La reserva no está disponible aquí temporalmente",
    openBookingPage: "Abrir página de reserva",
  },
  contact: {
    pageTitle: "Contáctame",
    backLink: "Volver",
    firstNameLabel: "Nombre",
    lastNameLabel: "Apellidos",
    mobileLabel: "Número de móvil",
    emailLabel: "Correo electrónico",
    messageLabel: "Mensaje",
    messageHint:
      "Si deseas trabajar conmigo, incluye información sobre el presupuesto, el plazo y el tipo de proyecto.",
    submitButton: "Enviar mensaje",
    submittingButton: "Enviando...",
    successMessage: "¡Gracias por tu mensaje! Te responderé lo antes posible.",
    successBackLink: "Volver al inicio",
    serverErrorMessage:
      "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.",
    validationRequired: "Este campo es obligatorio.",
    validationMaxLength: "No debe superar los 50 caracteres.",
    validationMobileRequired: "El número de móvil es obligatorio.",
    validationMobileInvalid:
      "Introduce un número de teléfono válido (p. ej. +34 612 345 678).",
    validationEmailRequired: "El correo electrónico es obligatorio.",
    validationEmailInvalid: "Introduce un correo electrónico válido.",
    validationMessageRequired: "El mensaje es obligatorio.",
    validationMessageMin: "El mensaje debe tener al menos 10 caracteres.",
    validationMessageMax: "El mensaje no debe superar los 500 caracteres.",
  },
  notFound: {
    title: "404",
    heading: "Página no encontrada",
    body: "Lo sentimos, no hemos podido encontrar lo que buscabas.",
    goHomeButton: "Ir al inicio",
  },
  seo: {
    siteTitle: "Dennis Lo — Consultor de TI e Ingeniero de Software",
    description:
      "Sitio web personal de Dennis Lo, consultor de TI e ingeniero de software.",
    meetPageTitle: "Reunión con Dennis Lo - DLO",
    meetPageDescription: "Reserva una reunión online con Dennis Lo",
    contactPageTitle: "Contacto — DLO",
    contactPageDescription: "Envía un mensaje a Dennis Lo",
    notFoundTitle: "No encontrado",
    ogTitle: "Dennis Lo — Consultor de TI e Ingeniero de Software",
    ogDescription:
      "Sitio web personal de Dennis Lo, consultor de TI e ingeniero de software.",
    twitterTitle: "Dennis Lo — Consultor de TI e Ingeniero de Software",
    twitterDescription:
      "Sitio web personal de Dennis Lo, consultor de TI e ingeniero de software.",
    jsonLdJobTitle: "Consultor de TI e Ingeniero de Software",
    jsonLdDescription:
      "Sitio web personal de Dennis Lo, consultor de TI e ingeniero de software.",
  },
};
