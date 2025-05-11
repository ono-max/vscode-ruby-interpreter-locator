import { RubyInterpreterInfo } from "./rubyInterpreterInfo";
import { AsdfLocator } from "./locator/asdfLocator";
import { EnvVariablesLocator } from "./locator/envVariablesLocator";
import { HomebrewLocator } from "./locator/homebrewLocator";
import { PosixPathLocator } from "./locator/posixPathLocator";
import { RbenvLocator } from "./locator/rbenvLocator";
import { PathsReducer } from "./pathsReducer";
import { ChrubyLocator } from "./locator/chrubyLocator";

export interface RubyInterpreterOptions {}

export { RubyInterpreterInfo };

export async function getInterpreters(options?: RubyInterpreterOptions): Promise<RubyInterpreterInfo[]> {
    const locators: Promise<RubyInterpreterInfo[]>[] = [
        // alphabetical order
        new AsdfLocator().execute(),
        new ChrubyLocator().execute(),
        new EnvVariablesLocator().execute(),
        new HomebrewLocator().execute(),
        new RbenvLocator().execute(),
    ];
    if (process.platform !== "win32") {
        locators.push(new PosixPathLocator().execute());
    }
    const reducer = new PathsReducer(locators).execute();
    return reducer;
}
