import path from "path";
import asyncfs from "fs/promises";
import fs from "fs";
import os from "os";
import { Kind, Locator, PathInfo, convToRubyInterpreterInfo, findDir, findFiles } from "./utils";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";

export class AsdfLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Asdf;
    }
    async execute(): Promise<RubyInterpreterInfo[]> {
        const interpreterPaths: string[] = [];
        const asdfDir = process.env.ASDF_DATA_DIR || path.join(os.homedir(), ".asdf");
        const installsDir = path.join(asdfDir, "installs", "ruby");
        // The sub directory should be something like '3.1.4', '2.7.1'.
        const availableVersionDirs = await findDir(installsDir);
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
