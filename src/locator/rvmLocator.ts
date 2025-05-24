import path from "path";
import { Kind, Locator, convToRubyInterpreterInfo, findDir, findFiles, getRbenvDir } from "./utils";
import { RubyInterpreterInfo } from "../types";

export class RvmLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Rvm;
    }
    async execute(): Promise<RubyInterpreterInfo[]> {
        const interpreterPaths: string[] = [];
        // ruby-install installs into /usr/local/rvm for root and ~/.rvm/ for users by default.
        // https://rvm.io/rvm/install
        const dirs = ["/usr/local/rvm", path.join(process.env.HOME || "", ".rvm")];
        for (const dir of dirs) {
            // https://github.com/rvm/rvm/blob/1.29.12/scripts/initialize#L133
            // The sub directory should be something like 'ruby-3.4.3', 'ruby-3.0.6'.
            const availableVersionDirs = await findDir(path.join(dir, "rubies"));
            for (const availableVersionDir of availableVersionDirs) {
                const binDir = path.join(availableVersionDir, "bin");
                const binFiles = await findFiles(binDir);
                for (const bin of binFiles) {
                    if (path.basename(bin) === "ruby") {
                        interpreterPaths.push(bin);
                    }
                }
            }
        }

        return convToRubyInterpreterInfo({ kind: this.kind, interpreterPaths });
    }
}
