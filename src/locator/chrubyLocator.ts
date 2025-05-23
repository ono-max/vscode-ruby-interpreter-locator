import path from "path";
import { Kind, Locator, convToRubyInterpreterInfo, findDir, findFiles, getRbenvDir } from "./utils";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";

export class ChrubyLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Chruby;
    }
    async execute(): Promise<RubyInterpreterInfo[]> {
        // chruby uses either ruby-install or ruby-build to install Ruby versions.
        // https://github.com/postmodern/chruby?tab=readme-ov-file#rubies
        const interpreterPaths: string[] = [];
        // ruby-install installs into /opt/rubies/ for root and ~/.rubies/ for users by default.
        // https://github.com/postmodern/ruby-install?tab=readme-ov-file#features
        // TODO: Support ruby-build if needed.
        const dirs = this.getRootDir();
        for (const dir of dirs) {
            // The sub directory should be something like 'ruby-3.4.3', 'ruby-3.0.6'.
            const availableVersionDirs = await findDir(dir);
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

    getRootDir() {
        return ["/opt/rubies", path.join(process.env.HOME || "", ".rubies")];
    }
}
