import React from "react";
import { siteConfig } from "../../config";

const About = () => {
  const accent = siteConfig.accentColor;

  return (
    <section
      id="about"
      className="p-8 sm:p-12 md:p-16 lg:p-24 bg-white dark:bg-gray-950 scroll-mt-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-bold text-gray-900 dark:text-gray-100">
            About Me
          </h2>
          <div
            className="w-[75px] h-[5px] mt-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {siteConfig.aboutMe}
          </p>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Agile IT &amp; Software Limited
            </h3>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {siteConfig.agileIT}{" "}
              <a
                href="/contact-form"
                className="underline transition-colors duration-300"
                style={{ color: accent }}
              >
                Please contact us for further information about our services.
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Technologies &amp; Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {siteConfig.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              I&apos;ve worked with clients from:
            </h3>
            <div className="flex flex-wrap gap-2">
              {siteConfig.clients.map((client) => (
                <span
                  key={client}
                  className="px-3 py-1 border rounded-full text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200 cursor-default"
                  style={{ borderColor: `${accent}60` }}
                >
                  {client}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Fun facts:
            </h3>
            <ul className="space-y-2">
              {siteConfig.funFacts.map((fact) => (
                <li
                  key={fact.text}
                  className="flex items-start gap-2 text-base text-gray-700 dark:text-gray-300"
                >
                  <span aria-hidden="true">{fact.emoji}</span>
                  <span>{fact.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
