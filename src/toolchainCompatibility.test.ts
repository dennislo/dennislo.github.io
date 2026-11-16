/** @jest-environment node */

import { readFileSync } from "node:fs";
import path from "node:path";

type LockedPackage = {
  peerDependencies?: Record<string, string>;
  version: string;
};

type PackageLock = {
  packages: Record<string, LockedPackage>;
};

const packageLock = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "package-lock.json"), "utf8"),
) as PackageLock;

const lockedPackage = (name: string) =>
  packageLock.packages[`node_modules/${name}`];

describe("Gatsby ESLint toolchain compatibility", () => {
  it("resolves the React App ESLint config that supports ESLint 8", () => {
    const eslintConfigReactApp = lockedPackage("eslint-config-react-app");

    expect(eslintConfigReactApp.version).toMatch(/^7\./);
    expect(eslintConfigReactApp.peerDependencies?.eslint).toBe("^8.0.0");
  });

  it("resolves the Flowtype plugin that supports ESLint 8", () => {
    const eslintPluginFlowtype = lockedPackage("eslint-plugin-flowtype");

    expect(eslintPluginFlowtype.version).toMatch(/^8\./);
    expect(eslintPluginFlowtype.peerDependencies?.eslint).toBe("^8.1.0");
  });
});
