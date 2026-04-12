import React from "react";
import { siteConfig } from "../../config";
import TablerArrowUpRight from "../icons/TablerArrowUpRight";

const Projects = () => {
  const accent = siteConfig.accentColor;
  const { projects } = siteConfig;

  if (!projects || projects.length === 0) return null;

  return (
    <section
      id="projects"
      className="p-8 sm:p-12 md:p-16 lg:p-24 bg-gray-50 dark:bg-gray-900 scroll-mt-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-bold text-gray-900 dark:text-gray-100">
            Projects
          </h2>
          <div
            className="w-[75px] h-[5px] mt-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            >
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-label={`View ${project.name}`}
                  style={{ color: accent }}
                >
                  <TablerArrowUpRight className="h-5 w-5" />
                </a>
              )}
              <div className="text-sm font-bold mb-2" style={{ color: accent }}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pr-8">
                {project.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
