import path from "path";
import asyncfs from "fs/promises";
import fs from "fs";
import { Kind, Locator, PathInfo, getRbenvDir } from "./utils";

export class RbenvLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Rbenv;
    }
    async execute(): Promise<PathInfo> {
        const interpreterPaths: string[] = [];
        // https://github.com/rbenv/rbenv#environment-variables
        const rbenvDir = getRbenvDir();
        const versionsDir = path.join(rbenvDir, "versions");
        // The sub directory should be something like '3.1.4', '2.7.1'.
        const availableVersionDirs = await this.findDir(versionsDir);
        for (const availableVersionDir of availableVersionDirs) {
            const binDir = path.join(availableVersionDir, "bin");
            const binFiles = await this.findFiles(binDir);
            for (const bin of binFiles) {
                if (path.basename(bin) === "ruby") {
                    interpreterPaths.push(bin);
                }
            }
        }
        return {
            kind: this.kind,
            interpreterPaths,
        };
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
