import path from "path";
import asyncfs from "fs/promises";
import fs from "fs";
import os from "os";
import { Kind, Locator, PathInfo } from "./utils";

export class AsdfLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Asdf;
    }
    async execute(): Promise<PathInfo> {
        const interpreterPaths: string[] = [];
        const rbenvDir = process.env.ASDF_DATA_DIR || path.join(os.homedir(), ".asdf");
        const installsDir = path.join(rbenvDir, "installs", "ruby");
        // The sub directory should be something like '3.1.4', '2.7.1'.
        const availableVersionDirs = await this.findDir(installsDir);
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
