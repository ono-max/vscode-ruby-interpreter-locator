import path from "path";
import { Kind, Locator, convToRubyInterpreterInfo, findDir, findFiles, getRbenvDir } from "./utils";
import { RubyInterpreterInfo } from "../types";

export class RbenvLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Rbenv;
    }
    async execute(): Promise<RubyInterpreterInfo[]> {
        const interpreterPaths: string[] = [];
        // https://github.com/rbenv/rbenv#environment-variables
        const rbenvDir = getRbenvDir();
        const versionsDir = path.join(rbenvDir, "versions");
        // The sub directory should be something like '3.1.4', '2.7.1'.
        const availableVersionDirs = await findDir(versionsDir);
        for (const availableVersionDir of availableVersionDirs) {
            const binDir = path.join(availableVersionDir, "bin");
            const binFiles = await findFiles(binDir);
            for (const bin of binFiles) {
                if (path.basename(bin) === "ruby") {
                    interpreterPaths.push(bin);
                }
            }
        }
        return convToRubyInterpreterInfo({ kind: this.kind, interpreterPaths });
    }
}
