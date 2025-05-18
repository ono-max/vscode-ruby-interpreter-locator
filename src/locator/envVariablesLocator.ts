import path from "path";
import { Kind, Locator, PathInfo, convToRubyInterpreterInfo, findRubyBinaries, getRbenvDir } from "./utils";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";

export class EnvVariablesLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.EnvVar;
    }
    async execute(): Promise<RubyInterpreterInfo[]> {
        const interpreterPaths: string[] = [];
        const pathEnvVars = this.getPathEnvVars();
        for (const env of pathEnvVars) {
            const pathEnvVar = process.env[env];
            if (pathEnvVar === undefined) {
                continue;
            }
            // .rbenv/shims directory is contained in $PATH.
            // We need to remove it because the files in the shims directory are not Ruby binaries.
            /*
            $ echo $PATH
            ...:/Users/ono-max/.rbenv/shims:/Users/ono-max/...
            */
            const candidatePaths = pathEnvVar.split(path.delimiter).filter((path) => !this.isShimsDir(path));
            for (const candidate of candidatePaths) {
                const binaries = await findRubyBinaries(candidate);
                for (const bin of binaries) {
                    interpreterPaths.push(bin);
                }
            }
        }
        return convToRubyInterpreterInfo({ kind: this.kind, interpreterPaths });
    }

    getPathEnvVars(): string[] {
        // On Windows, we need to support 'PATH' and 'Path'.
        // https://github.com/microsoft/vscode-python/pull/14326#discussion_r508838832
        if (process.platform === "win32") {
            return ["PATH", "Path"];
        }
        return ["PATH"];
    }

    isShimsDir(targetPath: string): boolean {
        const rbenvDir = getRbenvDir();
        return targetPath === path.join(rbenvDir, "shims");
    }
}
