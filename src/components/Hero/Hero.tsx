import React from "react";
import { siteConfig } from "../../config";
import TablerEmail from "../icons/TablerEmail";
import TablerGithub from "../icons/TablerGithub";
import TablerLinkedin from "../icons/TablerLinkedin";
import TablerInstagram from "../icons/TablerInstagram";

const Hero: React.FC = () => {
  const accent = siteConfig.accentColor;

  return (
    <div
      id="hero"
      className="relative isolate overflow-hidden bg-white dark:bg-gray-950 py-24 md:h-screen"
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 800px 1200px at 0% 0%, ${accent}40 0%, ${accent}25 20%, ${accent}10 40%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.8) 90%, white 100%)`,
        }}
      />

      {/* SVG background */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            id="grid-pattern"
            x="50%"
            y={-1}
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
          <pattern
            id="programming-symbols"
            x="0"
            y="0"
            width="400"
            height="400"
            patternUnits="userSpaceOnUse"
          >
            <text
              x="50"
              y="50"
              fill={accent}
              fontFamily="monospace"
              fontSize="24"
              transform="rotate(-15)"
            >
              &lt;/&gt;
            </text>
            <text
              x="150"
              y="100"
              fill={accent}
              fontFamily="monospace"
              fontSize="20"
              transform="rotate(10)"
            >
              {"{}"}
            </text>
            <text
              x="250"
              y="80"
              fill={accent}
              fontFamily="monospace"
              fontSize="18"
              transform="rotate(-5)"
            >
              =&gt;
            </text>
            <text
              x="100"
              y="200"
              fill={accent}
              fontFamily="monospace"
              fontSize="22"
              transform="rotate(15)"
            >
              []
            </text>
            <text
              x="300"
              y="180"
              fill={accent}
              fontFamily="monospace"
              fontSize="20"
              transform="rotate(-10)"
            >
              &lt;&gt;
            </text>
            <text
              x="200"
              y="250"
              fill={accent}
              fontFamily="monospace"
              fontSize="24"
              transform="rotate(5)"
            >
              ()
            </text>
            <text
              x="50"
              y="320"
              fill={accent}
              fontFamily="monospace"
              fontSize="18"
              transform="rotate(-8)"
            >
              ::
            </text>
            <text
              x="350"
              y="300"
              fill={accent}
              fontFamily="monospace"
              fontSize="22"
              transform="rotate(12)"
            >
              ==
            </text>
            <text
              x="150"
              y="350"
              fill={accent}
              fontFamily="monospace"
              fontSize="20"
              transform="rotate(-15)"
            >
              ++
            </text>
            <text
              x="250"
              y="370"
              fill={accent}
              fontFamily="monospace"
              fontSize="24"
              transform="rotate(8)"
            >
              ;
            </text>
          </pattern>
        </defs>
        <rect
          fill="url(#programming-symbols)"
          width="100%"
          height="100%"
          opacity="0.2"
        />
        <rect
          fill="url(#grid-pattern)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      {/* Main content */}
      <div className="h-full mx-auto p-8 sm:p-12 md:p-24 flex items-center">
        <div>
          <h2 className="text-pretty text-xl sm:text-2xl md:text-5xl font-bold tracking-tight text-gray-700 dark:text-gray-300 animate-[fadeIn_0.8s_ease-out_forwards] opacity-0">
            Hello! 👋
          </h2>
          <h1 className="mt-6 sm:mt-8 md:mt-10 text-pretty text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-gray-800 dark:text-gray-100 animate-[fadeIn_0.8s_ease-out_0.2s_forwards] opacity-0">
            I&apos;m <span style={{ color: accent }}>{siteConfig.name}</span>
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-pretty text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 animate-[fadeIn_0.8s_ease-out_0.4s_forwards] opacity-0">
            {siteConfig.title}
          </p>
        </div>
      </div>

      {/* Social icons */}
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 md:p-24 flex gap-x-4 sm:gap-x-6 md:gap-x-8 text-gray-700 dark:text-gray-300 animate-[fadeIn_0.8s_ease-out_0.6s_forwards] opacity-0">
        <a
          href={`mailto:${siteConfig.social.email}`}
          aria-label="Email Dennis Lo"
          className="transition-colors duration-300 hover:text-[--accent]"
          style={{ ["--accent" as string]: accent }}
        >
          <TablerEmail className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
        </a>
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dennis Lo on GitHub"
          className="transition-colors duration-300 hover:text-[--accent]"
          style={{ ["--accent" as string]: accent }}
        >
          <TablerGithub className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dennis Lo on LinkedIn"
          className="transition-colors duration-300 hover:text-[--accent]"
          style={{ ["--accent" as string]: accent }}
        >
          <TablerLinkedin className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
        </a>
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dennis Lo on Instagram"
          className="transition-colors duration-300 hover:text-[--accent]"
          style={{ ["--accent" as string]: accent }}
        >
          <TablerInstagram className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
        </a>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Hero;
