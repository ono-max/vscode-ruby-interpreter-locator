import path from "path";
import asyncfs from "fs/promises";
import fs from "fs";
import { Kind, Locator, PathInfo } from "./utils";

const rubyRegexp = /^ruby(@\d)?(\.\d)?(\.\d)?$/;

export class HomebrewLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Homebrew;
    }
    async execute(): Promise<PathInfo> {
        const pathInfoMap = new Set<string>();
        let homebrewDir = process.env.HOMEBREW_PREFIX;
        if (homebrewDir === undefined) {
            // https://docs.brew.sh/FAQ#why-should-i-install-homebrew-in-the-default-location
            if (process.platform === "darwin") {
                if (process.arch === "arm" || process.arch == "arm64") {
                    homebrewDir = "/opt/homebrew";
                } else if (process.arch === "x64") {
                    homebrewDir = "/usr/local";
                }
            } else if (process.platform === "linux") {
                homebrewDir = "/home/linuxbrew/.linuxbrew";
            }
        }
        if (homebrewDir) {
            const optDir = path.join(homebrewDir, "opt");
            // The sub directory should be something like 'ruby', 'ruby@3.2', 'ruby@3'.
            const availableVersionDirs = await this.findDir(optDir);
            for (const availableVersionDir of availableVersionDirs) {
                const binDir = path.join(availableVersionDir, "bin");
                const binFiles = await this.findFiles(binDir);
                for (const bin of binFiles) {
                    if (path.basename(bin) === "ruby") {
                        pathInfoMap.add(bin);
                    }
                }
            }
        }
        return {
            kind: this.kind,
            interpreterPaths: Array.from(pathInfoMap),
        };
    }
    private async findDir(dir: fs.PathLike) {
        const files = await asyncfs.readdir(dir, { withFileTypes: true });
        /*
        $ ls -l /opt/homebrew/opt
        ruby -> ../Cellar/ruby/3.2.2_1
        ruby-build -> ../Cellar/ruby-build/20230615
        ruby@3 -> ../Cellar/ruby/3.2.2_1
        ruby@3.2 -> ../Cellar/ruby/3.2.2_1
        */
        const symlinks = files
            .filter((file) => rubyRegexp.test(file.name) && file.isSymbolicLink())
            .map((file) => path.join(dir.toString(), file.name));
        const realDirs = await Promise.all(symlinks.map((link) => asyncfs.readlink(link)));
        return realDirs;
    }
    private async findFiles(dir: fs.PathLike) {
        const files = await asyncfs.readdir(dir, { withFileTypes: true });
        return files.filter((file) => file.isFile()).map((file) => path.join(dir.toString(), file.name));
    }
}
