import path from "path";
import asyncfs from "fs/promises";
import fs from "fs";
import { Kind, Locator, convToRubyInterpreterInfo, getRbenvDir } from "./utils";
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
        const dirs = ["/opt/rubies", path.join(process.env.HOME || "", ".rubies")];
        for (const dir of dirs) {
            // The sub directory should be something like 'ruby-3.4.3', 'ruby-3.0.6'.
            const availableVersionDirs = await this.findDir(dir);
            for (const availableVersionDir of availableVersionDirs) {
                const binDir = path.join(availableVersionDir, "bin");
                const binFiles = await this.findFiles(binDir);
                for (const bin of binFiles) {
                    if (path.basename(bin) === "ruby") {
                        interpreterPaths.push(bin);
                    }
                }
            }
        }

        return convToRubyInterpreterInfo({ kind: this.kind, interpreterPaths });
    }
    private async findDir(dir: fs.PathLike) {
        const files = await asyncfs.readdir(dir, { withFileTypes: true });
        return files.map((file) => path.join(dir.toString(), file.name));
    }
    private async findFiles(dir: fs.PathLike) {
        const files = await asyncfs.readdir(dir, { withFileTypes: true });
        return files.filter((file) => file.isFile()).map((file) => path.join(dir.toString(), file.name));
    }
}
