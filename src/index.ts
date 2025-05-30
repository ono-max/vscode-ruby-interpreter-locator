import { RubyInterpreterInfo, GlobalState } from "./types";
import { AsdfLocator } from "./locator/asdfLocator";
import { EnvVariablesLocator } from "./locator/envVariablesLocator";
import { HomebrewLocator } from "./locator/homebrewLocator";
import { PosixPathLocator } from "./locator/posixPathLocator";
import { RbenvLocator } from "./locator/rbenvLocator";
import { PathsReducer } from "./pathsReducer";
import { ChrubyLocator } from "./locator/chrubyLocator";
import { RubyEnvScriptRunner } from "./rubyEnvScriptRunner";
import { RvmLocator } from "./locator/rvmLocator";
import { RubyInterpreterSorter } from "./rubyInterpreterSorter";
import { getActiveWorkspaceFolder } from "./vscodeApis";
import { CacheManager } from "./cacheManager";

export interface RubyInterpreterOptions {
    cwd?: string;
    globalState?: GlobalState;
}

export { RubyInterpreterInfo };

export function getInterpreters(options?: RubyInterpreterOptions): Promise<RubyInterpreterInfo[]> {
    let cacheManager: CacheManager<RubyInterpreterInfo[]> | undefined;
    if (options?.globalState) {
        cacheManager = new CacheManager(options.globalState);
        const cachedInterpreters = cacheManager.getCache();
        if (cachedInterpreters && cachedInterpreters.length > 0) {
            return Promise.resolve(cachedInterpreters);
        }
    }
    const locators: Promise<RubyInterpreterInfo[]>[] = [
        // alphabetical order
        new AsdfLocator().execute(),
        new ChrubyLocator().execute(),
        new EnvVariablesLocator().execute(),
        new HomebrewLocator().execute(),
        new RbenvLocator().execute(),
        new RvmLocator().execute(),
    ];
    if (process.platform !== "win32") {
        locators.push(new PosixPathLocator().execute());
    }
    const reducer = new PathsReducer(locators).execute();
    const runner = new RubyEnvScriptRunner(reducer).execute();
    const cwd = getCwd(options?.cwd);
    if (cwd !== undefined) {
        const sorter = new RubyInterpreterSorter(runner, cwd).execute();
        if (cacheManager) {
            cacheManager.setCache(sorter);
        }
        return sorter;
    }
    if (cacheManager) {
        cacheManager.setCache(runner);
    }
    return runner;
}

function getCwd(cwd?: string): string | undefined {
    if (cwd && cwd.length > 0) {
        return cwd;
    }
    const folder = getActiveWorkspaceFolder();
    if (folder) {
        return folder.uri.fsPath;
    }
}
