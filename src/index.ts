import { AsdfLocator } from "./locator/asdfLocator";
import { EnvVariablesLocator } from "./locator/envVariablesLocator";
import { HomebrewLocator } from "./locator/homebrewLocator";
import { PosixPathLocator } from "./locator/posixPathLocator";
import { RbenvLocator } from "./locator/rbenvLocator";
import { PathInfo } from "./locator/utils";

export interface RubyInterpreterOptions {}

export interface RubyInterpreterInfo {
    directory: string;
    version?: string;
    // alphabetical order
    isAsdf?: boolean;
    isPathEnvVar?: boolean;
    isRbenv?: boolean;
    isHomebrew?: boolean;
}

export async function getInterpreters(options: RubyInterpreterOptions): Promise<RubyInterpreterInfo[]> {
    const promisePathInfos = [
        // alphabetical order
        new AsdfLocator().execute(),
        new EnvVariablesLocator().execute(),
        new HomebrewLocator().execute(),
        new RbenvLocator().execute(),
    ];
    if (process.platform !== "win32") {
        promisePathInfos.push(new PosixPathLocator().execute());
    }
    return [];
}

// TODO:
class PathsReducer {
    private promisePathInfos: Promise<PathInfo[]>;
    constructor(promisePathInfos: Promise<PathInfo[]>) {
        this.promisePathInfos = promisePathInfos;
    }
    public async execute() {
        const pathInfos = await this.promisePathInfos;
        const pathInfoMap = new Map<string, PathInfo>();
        for (const pathInfo of pathInfos) {
            for (const path of pathInfo.interpreterPaths) {
                pathInfoMap.set(path, pathInfo);
            }
        }
    }
}
