import { siteConfig } from "../config";
import { enGB } from "./translations/en-GB";
import {
  getLocalizedProjects,
  getLocalizedExperience,
  getLocalizedEducation,
  getLocalizedClients,
  getLocalizedFunFacts,
} from "./localizedContent";

describe("getLocalizedProjects", () => {
  it("returns one entry per siteConfig.projects entry", () => {
    const result = getLocalizedProjects(enGB);
    expect(result).toHaveLength(siteConfig.projects.length);
  });

  it("takes link and skills from siteConfig", () => {
    const result = getLocalizedProjects(enGB);
    result.forEach((proj, i) => {
      expect(proj.link).toBe(siteConfig.projects[i].link);
      expect(proj.skills).toEqual(siteConfig.projects[i].skills);
    });
  });

  it("takes name and description from the dictionary", () => {
    const result = getLocalizedProjects(enGB);
    expect(result[0].name).toBe(enGB.projects.aiDevRoundupName);
    expect(result[0].description).toBe(enGB.projects.aiDevRoundupDescription);
    expect(result[1].name).toBe(enGB.projects.chromeExtensionMasteryName);
    expect(result[2].name).toBe(enGB.projects.extensionKitName);
  });
});

describe("getLocalizedExperience", () => {
  it("returns one entry per siteConfig.experience entry", () => {
    const result = getLocalizedExperience(enGB);
    expect(result).toHaveLength(siteConfig.experience.length);
  });

  it("takes company and dateRange from siteConfig", () => {
    const result = getLocalizedExperience(enGB);
    result.forEach((entry, i) => {
      expect(entry.company).toBe(siteConfig.experience[i].company);
      expect(entry.dateRange).toBe(siteConfig.experience[i].dateRange);
    });
  });

  it("takes bullets from the dictionary", () => {
    const result = getLocalizedExperience(enGB);
    expect(result[0].bullets[0]).toBe(enGB.experience.crosstideBullet1);
    expect(result[1].bullets[0]).toBe(enGB.experience.pretBullet1);
    expect(result[5].bullets[0]).toBe(enGB.experience.starcountBullet1);
  });

  it("assigns contractor title to non-Starcount entries", () => {
    const result = getLocalizedExperience(enGB);
    expect(result[0].title).toBe(enGB.experience.roleContractor);
  });

  it("assigns senior title to Starcount entry", () => {
    const result = getLocalizedExperience(enGB);
    expect(result[5].title).toBe(enGB.experience.roleSenior);
  });

  it("returns empty array when experience config is empty", () => {
    const origExperience = siteConfig.experience;
    siteConfig.experience = [];
    expect(getLocalizedExperience(enGB)).toEqual([]);
    siteConfig.experience = origExperience;
  });
});

describe("getLocalizedEducation", () => {
  it("returns one entry", () => {
    expect(getLocalizedEducation(enGB)).toHaveLength(1);
  });

  it("takes school and dateRange from siteConfig", () => {
    const [entry] = getLocalizedEducation(enGB);
    expect(entry.school).toBe(siteConfig.education[0].school);
    expect(entry.dateRange).toBe(siteConfig.education[0].dateRange);
  });

  it("takes degree and achievements from the dictionary", () => {
    const [entry] = getLocalizedEducation(enGB);
    expect(entry.degree).toBe(enGB.education.degree);
    expect(entry.achievements[0]).toBe(enGB.education.achievement1);
    expect(entry.achievements[1]).toBe(enGB.education.achievement2);
  });
});

describe("getLocalizedClients", () => {
  it("returns 6 client labels from the dictionary", () => {
    const result = getLocalizedClients(enGB);
    expect(result).toHaveLength(6);
    expect(result[0]).toBe(enGB.about.clients.advertisingMedia);
    expect(result[5]).toBe(enGB.about.clients.itTelecommunications);
  });
});

describe("getLocalizedFunFacts", () => {
  it("returns 3 fun facts", () => {
    const result = getLocalizedFunFacts(enGB);
    expect(result).toHaveLength(3);
  });

  it("takes emoji from siteConfig and text from the dictionary", () => {
    const result = getLocalizedFunFacts(enGB);
    expect(result[0].emoji).toBe(siteConfig.funFacts[0].emoji);
    expect(result[0].text).toBe(enGB.about.funFacts.fact1);
    expect(result[2].emoji).toBe(siteConfig.funFacts[2].emoji);
    expect(result[2].text).toBe(enGB.about.funFacts.fact3);
  });
});
